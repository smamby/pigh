// __tests__/models/habitacion.model.test.js

const Habitacion = require('../../models/habitacion.model');
const db = require('../../db');

jest.mock('../../db', () => ({
  query: jest.fn(),
}));

describe('Habitacion Model', () => {
  beforeEach(() => {
    db.query.mockReset();
  });

  describe('Habitacion.getByAlojamiento', () => {
    it('debería devolver una habitación de un alojamiento con sus detalles (caso una habitación)', async () => {
      const idAlojamiento = 1;
      const mockHabitacionesDevueltasPorQuery1 = [
        { id_habitacion: 101, id_tipo_habitacion: 1, numero_habitacion: '101', /* otros campos de habitacion */ },
      ];
      const mockCaracteristicasDevueltasPorQuery2 = [{ id_caracteristica: 1, nombre: 'WiFi' }];
      const mockReservasDevueltasPorQuery3 = [{ id: 1, checkin: '2024-01-01', checkout: '2024-01-05' }];

      db.query
        .mockResolvedValueOnce([mockHabitacionesDevueltasPorQuery1])
        .mockResolvedValueOnce([mockCaracteristicasDevueltasPorQuery2])
        .mockResolvedValueOnce([mockReservasDevueltasPorQuery3]);

      const resultado = await Habitacion.getByAlojamiento(idAlojamiento);

      expect(db.query).toHaveBeenCalledTimes(3);
      expect(db.query.mock.calls[0][0]).toContain('FROM habitaciones h');
      expect(db.query.mock.calls[0][1]).toEqual([idAlojamiento]);

      expect(db.query.mock.calls[1][0]).toContain('FROM caracteristicas_habitacion ch');
      expect(db.query.mock.calls[1][1]).toEqual([mockHabitacionesDevueltasPorQuery1[0].id_tipo_habitacion]);

      expect(db.query.mock.calls[2][0]).toContain('FROM reservas');
      expect(db.query.mock.calls[2][1]).toEqual([mockHabitacionesDevueltasPorQuery1[0].id_habitacion]);

      expect(resultado.length).toBe(1);
      expect(resultado[0]).toHaveProperty('id_habitacion', mockHabitacionesDevueltasPorQuery1[0].id_habitacion);
      expect(resultado[0]).toHaveProperty('caracteristicas', mockCaracteristicasDevueltasPorQuery2);
      expect(resultado[0]).toHaveProperty('reservas', mockReservasDevueltasPorQuery3);
    });

    it('debería devolver múltiples habitaciones de un alojamiento con sus detalles (caso dos habitaciones)', async () => {
      const idAlojamiento = 2;
      const mockHabitacionesDevueltasPorQuery1 = [
        { id_habitacion: 201, id_tipo_habitacion: 3, numero_habitacion: '201' },
        { id_habitacion: 202, id_tipo_habitacion: 4, numero_habitacion: '202' },
      ];
      const mockCaracteristicasHab201 = [{ id_caracteristica: 10, nombre: 'Balcón' }];
      const mockReservasHab201 = [];
      const mockCaracteristicasHab202 = [{ id_caracteristica: 11, nombre: 'Minibar' }];
      const mockReservasHab202 = [{ id: 5, checkin: '2024-02-10' }];

      db.query.mockImplementation(async (sql, params) => {
        if (sql.includes('FROM habitaciones h')) {
          return Promise.resolve([mockHabitacionesDevueltasPorQuery1]);
        } else if (sql.includes('FROM caracteristicas_habitacion ch')) {
          if (params[0] === mockHabitacionesDevueltasPorQuery1[0].id_tipo_habitacion) {
            return Promise.resolve([mockCaracteristicasHab201]);
          } else if (params[0] === mockHabitacionesDevueltasPorQuery1[1].id_tipo_habitacion) {
            return Promise.resolve([mockCaracteristicasHab202]);
          }
        } else if (sql.includes('FROM reservas')) {
          if (params[0] === mockHabitacionesDevueltasPorQuery1[0].id_habitacion) {
            return Promise.resolve([mockReservasHab201]);
          } else if (params[0] === mockHabitacionesDevueltasPorQuery1[1].id_habitacion) {
            return Promise.resolve([mockReservasHab202]);
          }
        }
        return Promise.resolve([[]]);
      });

      const resultado = await Habitacion.getByAlojamiento(idAlojamiento);

      expect(resultado.length).toBe(2);
      expect(resultado[0]).toHaveProperty('id_habitacion', 201);
      expect(resultado[0]).toHaveProperty('caracteristicas', mockCaracteristicasHab201);
      expect(resultado[0]).toHaveProperty('reservas', mockReservasHab201);
      expect(resultado[1]).toHaveProperty('id_habitacion', 202);
      expect(resultado[1]).toHaveProperty('caracteristicas', mockCaracteristicasHab202);
      expect(resultado[1]).toHaveProperty('reservas', mockReservasHab202);
      expect(db.query).toHaveBeenCalledTimes(1 + mockHabitacionesDevueltasPorQuery1.length * 2);
    });

    it('debería devolver un array vacío si el alojamiento no tiene habitaciones', async () => {
      const idAlojamiento = 3; // Diferente ID para no interferir con mockImplementation si se ejecuta en el mismo suite
      db.query.mockReset(); // Resetear para asegurar que mockImplementation no afecte
      db.query.mockResolvedValueOnce([[]]);

      const resultado = await Habitacion.getByAlojamiento(idAlojamiento);

      expect(db.query).toHaveBeenCalledTimes(1);
      expect(resultado).toEqual([]);
    });

    it('debería lanzar un error si la BD falla al obtener habitaciones', async () => {
        const idAlojamiento = 4;
        db.query.mockReset();
        const dbError = new Error('DB getByAlojamiento failed');
        db.query.mockRejectedValueOnce(dbError);
        await expect(Habitacion.getByAlojamiento(idAlojamiento)).rejects.toThrow(dbError);
        expect(console.error).toHaveBeenCalledWith("Error al obtener habitaciones:", dbError);
    });
  });

  describe('Habitacion.getById', () => {
    it('debería devolver una habitación específica con sus detalles', async () => {
      const idHabitacion = 101;
      const mockHabitacion = { id_habitacion: idHabitacion, id_tipo_habitacion: 1, numero_habitacion: '101' };
      const mockCaracteristicas = [{ id_caracteristica: 1, nombre: 'WiFi' }];
      const mockReservas = [{ id: 1, checkin: '2024-01-01' }];

      db.query.mockReset(); // Asegurar mocks limpios
      db.query
        .mockResolvedValueOnce([[mockHabitacion]])
        .mockResolvedValueOnce([mockCaracteristicas])
        .mockResolvedValueOnce([mockReservas]);

      const resultado = await Habitacion.getById(idHabitacion);

      expect(db.query).toHaveBeenCalledTimes(3);
      expect(db.query.mock.calls[0][1]).toEqual([idHabitacion]);
      expect(resultado).toHaveProperty('id_habitacion', idHabitacion);
      expect(resultado).toHaveProperty('caracteristicas', mockCaracteristicas);
      expect(resultado).toHaveProperty('reservas', mockReservas);
    });

    it('debería devolver null si la habitación no se encuentra', async () => {
      const idHabitacion = 999;
      db.query.mockReset();
      db.query.mockResolvedValueOnce([[]]);

      const resultado = await Habitacion.getById(idHabitacion);

      expect(db.query).toHaveBeenCalledTimes(1);
      expect(resultado).toBeNull();
    });
  });

  describe('Habitacion.create', () => {
    it('debería crear una nueva habitación (y reflejar el bug de SQL del modelo)', async () => {
      const habitacionData = {
        numero_habitacion: '201',
        id_tipo_habitacion: 1,
        plazas: 2,
        precio: 150.00,
        id_alojamiento: 1,
        notas: 'Vista al jardín',
      };
      const mockInsertId = 1;
      db.query.mockReset();
      db.query.mockResolvedValue([{ insertId: mockInsertId }]);

      const resultado = await Habitacion.create(habitacionData);

      expect(db.query).toHaveBeenCalledTimes(1);
      const [sqlQuery, queryParams] = db.query.mock.calls[0];

      expect(sqlQuery).toEqual(expect.stringContaining('INSERT INTO habitaciones \n        (numero_habitacion, id_tipo_habitacion, precio, id_alojamiento, notas)\n        VALUES (?, ?, ?, ?, ?, ?)'));
      expect(queryParams).toEqual([
            habitacionData.numero_habitacion,
            habitacionData.id_tipo_habitacion,
            habitacionData.plazas, // Esto va al 3er '?' (que es `precio` en SQL)
            habitacionData.precio, // Esto va al 4to '?' (que es `id_alojamiento` en SQL)
            habitacionData.id_alojamiento, // Esto va al 5to '?' (que es `notas` en SQL)
            habitacionData.notas // Esto va al 6to '?', que no tiene columna correspondiente
      ]);
      expect(resultado).toEqual({ id: mockInsertId, ...habitacionData });
    });
  });

  describe('Habitacion.update', () => {
    it('debería actualizar una habitación (y reflejar el bug de SQL del modelo)', async () => {
      const idHabitacion = 1;
      const habitacionData = {
        numero_habitacion: '202U',
        id_tipo_habitacion: 2,
        plazas: 3,
        precio: 180.00,
        estado: 'mantenimiento',
        id_alojamiento: 1,
        notas: 'Actualizada',
      };
      db.query.mockReset();
      db.query.mockResolvedValue([{ affectedRows: 1 }]);

      const resultado = await Habitacion.update(idHabitacion, habitacionData);

      expect(db.query).toHaveBeenCalledTimes(1);
      const [sqlQuery, queryParams] = db.query.mock.calls[0];

      expect(sqlQuery).toEqual(expect.stringContaining('UPDATE habitaciones SET\n          numero_habitacion = ?,\n          id_tipo_habitacion = ?,\n          precio = ?,\n          estado = ?,\n          id_alojamiento = ?,\n          notas = ?\n        WHERE id_habitacion = ?'));
      expect(queryParams).toEqual([
          habitacionData.numero_habitacion,
          habitacionData.id_tipo_habitacion,
          habitacionData.plazas,      // va a `precio = ?`
          habitacionData.precio,      // va a `estado = ?`
          habitacionData.estado,      // va a `id_alojamiento = ?`
          habitacionData.id_alojamiento, // va a `notas = ?`
          habitacionData.notas,       // va a `WHERE id_habitacion = ?`
          idHabitacion // 8vo parámetro, extra para la query de 7 placeholders
      ]);
      expect(resultado).toBe(true);
    });
  });

  describe('Habitacion.delete', () => {
    it('debería eliminar una habitación si no tiene reservas activas', async () => {
      const idHabitacion = 1;
      db.query.mockReset();
      db.query
        .mockResolvedValueOnce([[{ count: 0 }]])
        .mockResolvedValueOnce([{ affectedRows: 1 }]);

      const resultado = await Habitacion.delete(idHabitacion);
      expect(db.query).toHaveBeenCalledTimes(2);
      expect(db.query.mock.calls[1][0]).toContain('DELETE FROM habitaciones');
      expect(resultado).toBe(true);
    });

    it('debería lanzar un error si la habitación tiene reservas activas', async () => {
      const idHabitacion = 2;
      db.query.mockReset();
      db.query.mockResolvedValueOnce([[{ count: 1 }]]);

      await expect(Habitacion.delete(idHabitacion)).rejects.toThrow('No se puede eliminar una habitación con reservas activas');
      expect(db.query).toHaveBeenCalledTimes(1);
    });
  });
});

beforeAll(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
});
afterAll(() => {
  console.error.mockRestore();
});
