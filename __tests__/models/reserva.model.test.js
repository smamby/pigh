// __tests__/models/reserva.model.test.js

const Reserva = require('../../models/reserva.model');
const db = require('../../db');
const habitacionesCRUD = require('../../models/habitacion.model');

jest.mock('../../db', () => {
  const mockModuleLevelQuery = jest.fn();
  // La query de conexión será un nuevo mock cada vez que se obtiene una conexión

  return {
    __esModule: true,
    query: mockModuleLevelQuery,
    getConnection: jest.fn().mockImplementation(() => ({
      beginTransaction: jest.fn().mockResolvedValue(undefined),
      commit: jest.fn().mockResolvedValue(undefined),
      rollback: jest.fn().mockResolvedValue(undefined),
      release: jest.fn().mockResolvedValue(undefined),
      query: jest.fn(), // Cada conexión obtiene su propio mock de query
    })),
  };
});

jest.mock('../../models/habitacion.model', () => ({
  getById: jest.fn(),
}));

describe('Reserva Model', () => {
  let moduleLevelMockQuery;

  beforeEach(() => {
    moduleLevelMockQuery = db.query;
    moduleLevelMockQuery.mockReset();

    db.getConnection.mockClear();

    // Resetear los mocks internos de CUALQUIER conexión mockeada que se haya creado
    // y accedido a través de db.getConnection.mock.results en pruebas anteriores.
    if (db.getConnection.mock.results && db.getConnection.mock.results.length > 0) {
        db.getConnection.mock.results.forEach(result => {
            if (result.type === 'return' && result.value) {
                result.value.query.mockReset();
                result.value.beginTransaction.mockReset();
                result.value.commit.mockReset();
                result.value.rollback.mockReset();
                result.value.release.mockReset();
            }
        });
    }
    habitacionesCRUD.getById.mockReset();
  });

  describe('Reserva.create', () => {
    const nuevaReservaData = {
      id_usuario: 1,
      id_alojamiento: 1,
      id_tipo_habitacion: 1,
      checkin: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0],
      checkout: new Date(new Date().setDate(new Date().getDate() + 3)).toISOString().split('T')[0],
      adultos: 2,
      menores: 0,
      cantidadBuscada: 1,
    };

    it('debería crear una reserva exitosamente si la habitación está disponible', async () => {
      // Configurar el mock de getConnection para esta prueba específica
      const mockConnectionQueryFn = jest.fn();
      const mockConnectionInstance = {
        beginTransaction: jest.fn().mockResolvedValue(undefined),
        commit: jest.fn().mockResolvedValue(undefined),
        rollback: jest.fn().mockResolvedValue(undefined),
        release: jest.fn().mockResolvedValue(undefined),
        query: mockConnectionQueryFn,
      };
      db.getConnection.mockReturnValueOnce(mockConnectionInstance);

      mockConnectionQueryFn.mockResolvedValueOnce([[]]); // 1. hayReservas
      const mockIdHabitacionDisponible = 101;
      mockConnectionQueryFn.mockResolvedValueOnce([[{ id_habitacion: mockIdHabitacionDisponible }]]); // 2. idHabitacionAReservar
      const mockInsertId = 500;
      mockConnectionQueryFn.mockResolvedValueOnce([{ insertId: mockInsertId }]); // 3. INSERT

      const resultado = await Reserva.create(nuevaReservaData);

      expect(db.getConnection).toHaveBeenCalledTimes(1);
      expect(mockConnectionInstance.beginTransaction).toHaveBeenCalledTimes(1);

      expect(mockConnectionQueryFn.mock.calls[0][0]).toContain('SELECT r.id FROM reservas r');
      expect(mockConnectionQueryFn.mock.calls[1][0]).toContain('SELECT id_habitacion FROM habitaciones');
      expect(mockConnectionQueryFn.mock.calls[2][0]).toContain('INSERT INTO reservas');

      expect(mockConnectionInstance.commit).toHaveBeenCalledTimes(1);
      expect(mockConnectionInstance.rollback).not.toHaveBeenCalled();
      expect(mockConnectionInstance.release).toHaveBeenCalledTimes(1);
      expect(resultado).toEqual(expect.objectContaining({ id: mockInsertId }));
    });

    it('debería fallar si la fecha de checkin es posterior o igual a checkout', async () => {
      const reservaInvalida = { ...nuevaReservaData, checkin: '2024-12-25', checkout: '2024-12-24' };
      await expect(Reserva.create(reservaInvalida)).rejects.toThrow('La fecha de inicio debe ser anterior a la fecha de fin.');
      expect(db.getConnection).not.toHaveBeenCalled();
    });

    it('debería fallar si la fecha de checkin es en el pasado', async () => {
      const reservaInvalida = { ...nuevaReservaData, checkin: '2020-01-01' };
      await expect(Reserva.create(reservaInvalida)).rejects.toThrow('La fecha de inicio no puede ser en el pasado.');
      expect(db.getConnection).not.toHaveBeenCalled();
    });

    it('debería fallar y hacer rollback si no hay disponibilidad (reservasSuperpuestas)', async () => {
        const checkin = new Date(new Date().setDate(new Date().getDate() + 5)).toISOString().split('T')[0];
        const checkout = new Date(new Date().setDate(new Date().getDate() + 10)).toISOString().split('T')[0];

        const mockConnectionQueryFn = jest.fn();
        const mockConnectionInstance = {
            beginTransaction: jest.fn().mockResolvedValue(undefined),
            commit: jest.fn().mockResolvedValue(undefined),
            rollback: jest.fn().mockResolvedValue(undefined),
            release: jest.fn().mockResolvedValue(undefined),
            query: mockConnectionQueryFn,
        };
        db.getConnection.mockReturnValueOnce(mockConnectionInstance);

        mockConnectionQueryFn
            .mockResolvedValueOnce([[{id: 1}]]) // 1. Mock para la query de 'hayReservas' (fuera del try anidado pero dentro del if)
            .mockResolvedValueOnce([[{ id_reserva_superpuesta: 1 }]]) // 2. Mock para 'reservasSuperpuestas'
            .mockResolvedValueOnce([[{ habitaciones_existentes: 1 }]]); // 3. Mock para 'habitaciones_existentes'
            // La 4ta query es la de la línea 74: const [reservas] = ...
            // Para esta prueba, como el throw debe ocurrir, el contenido de 'reservas' no importa mucho.
        mockConnectionQueryFn.mockResolvedValueOnce([[]]); // 4. Mock para la query de la línea 74

        await expect(Reserva.create({ ...nuevaReservaData, checkin, checkout })).rejects.toThrow('El alojamiento no está disponible para las fechas seleccionadas.');

        expect(db.getConnection).toHaveBeenCalledTimes(1);
        expect(mockConnectionInstance.beginTransaction).toHaveBeenCalledTimes(1);
        // Se ejecutan las 4 queries antes de la condición del throw
        expect(mockConnectionQueryFn).toHaveBeenCalledTimes(4);
        expect(mockConnectionInstance.commit).not.toHaveBeenCalled();
        expect(mockConnectionInstance.rollback).toHaveBeenCalledTimes(2);
        expect(mockConnectionInstance.release).toHaveBeenCalledTimes(2); // CORREGIDO: Se espera que se llame dos veces
    });

    it('debería hacer rollback si falla el INSERT final', async () => {
      const mockConnectionQueryFn = jest.fn();
      const mockConnectionInstance = {
        beginTransaction: jest.fn().mockResolvedValue(undefined),
        commit: jest.fn().mockResolvedValue(undefined),
        rollback: jest.fn().mockResolvedValue(undefined),
        release: jest.fn().mockResolvedValue(undefined),
        query: mockConnectionQueryFn,
      };
      db.getConnection.mockReturnValueOnce(mockConnectionInstance);

      const mockIdHabitacionDisponible = 101;
      mockConnectionQueryFn
        .mockResolvedValueOnce([[]]) // 1. hayReservas
        .mockResolvedValueOnce([[{ id_habitacion: mockIdHabitacionDisponible }]]); // 2. idHabitacionAReservar

      const dbError = new Error('INSERT failed');
      mockConnectionQueryFn.mockRejectedValueOnce(dbError); // 3. Falla en el INSERT

      await expect(Reserva.create(nuevaReservaData)).rejects.toThrow(dbError);

      expect(db.getConnection).toHaveBeenCalledTimes(1);
      expect(mockConnectionInstance.beginTransaction).toHaveBeenCalledTimes(1);
      expect(mockConnectionQueryFn).toHaveBeenCalledTimes(3);
      expect(mockConnectionInstance.commit).not.toHaveBeenCalled();
      expect(mockConnectionInstance.rollback).toHaveBeenCalledTimes(1);
      expect(mockConnectionInstance.release).toHaveBeenCalledTimes(1);
    });
  });

  describe('Reserva.findByUserId', () => {
    it('debería devolver las reservas de un usuario', async () => {
      const usuarioId = 1;
      const mockReservas = [{ id: 1, id_usuario: usuarioId }];
      moduleLevelMockQuery.mockResolvedValueOnce([mockReservas]);

      const resultado = await Reserva.findByUserId(usuarioId);

      expect(moduleLevelMockQuery).toHaveBeenCalledWith(expect.stringContaining('FROM reservas r'), [usuarioId]);
      expect(resultado).toEqual(mockReservas);
    });
  });

  describe('Reserva.findByAlojamientoId', () => {
    it('debería devolver las reservas de un alojamiento', async () => {
        const alojamientoId = 1;
        const mockReservas = [{ id: 1, id_alojamiento: alojamientoId }];
        moduleLevelMockQuery.mockResolvedValueOnce([mockReservas]);

        const resultado = await Reserva.findByAlojamientoId(alojamientoId);

        expect(moduleLevelMockQuery).toHaveBeenCalledWith(expect.stringContaining('WHERE a.id_alojamiento = ?'), [alojamientoId]);
        expect(resultado).toEqual(mockReservas);
    });
  });
});

beforeAll(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'log').mockImplementation(() => {});
});

afterAll(() => {
  console.error.mockRestore();
  console.log.mockRestore();
});
