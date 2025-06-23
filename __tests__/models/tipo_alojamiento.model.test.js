// __tests__/models/tipo_alojamiento.model.test.js

const TipoAlojamiento = require('../../models/tipo_alojamiento.model');
const db = require('../../db');

jest.mock('../../db', () => ({
  query: jest.fn(),
}));

describe('TipoAlojamiento Model', () => {
  beforeEach(() => {
    db.query.mockClear();
  });

  describe('TipoAlojamiento.getAll', () => {
    it('debería devolver todos los tipos de alojamiento', async () => {
      const mockTipos = [
        { id_tipo_alojamiento: 1, nombre: 'Hotel', descripcion: 'Hotel desc' },
        { id_tipo_alojamiento: 2, nombre: 'Resort', descripcion: 'Resort desc' },
      ];
      db.query.mockResolvedValue([mockTipos]);

      const resultado = await TipoAlojamiento.getAll();

      expect(db.query).toHaveBeenCalledWith('SELECT * FROM tipo_alojamiento WHERE 1=1', []);
      expect(resultado).toEqual(mockTipos);
    });

    it('debería filtrar por nombre si se provee', async () => {
        const mockNombre = 'Hotel';
        const mockTiposFiltrados = [{ id_tipo_alojamiento: 1, nombre: 'Hotel', descripcion: 'Hotel desc' }];
        db.query.mockResolvedValue([mockTiposFiltrados]);

        const resultado = await TipoAlojamiento.getAll({ nombre: mockNombre });
        expect(db.query).toHaveBeenCalledWith(
            'SELECT * FROM tipo_alojamiento WHERE 1=1 AND LOWER(nombre) LIKE LOWER(?)',
            [`%${mockNombre}%`]
        );
        expect(resultado).toEqual(mockTiposFiltrados);
    });

    it('debería lanzar un error si la BD falla', async () => {
        const dbError = new Error('DB getAll failed');
        db.query.mockRejectedValue(dbError);
        await expect(TipoAlojamiento.getAll()).rejects.toThrow(dbError);
        expect(console.error).toHaveBeenCalledWith("Error al obtener tipos de alojamiento de BD:", dbError);
    });
  });

  describe('TipoAlojamiento.findById', () => {
    it('debería devolver un tipo de alojamiento por ID', async () => {
      const mockId = 1;
      const mockTipo = { id_tipo_alojamiento: mockId, nombre: 'Hotel' };
      db.query.mockResolvedValue([[mockTipo]]);

      const resultado = await TipoAlojamiento.findById(mockId);

      expect(db.query).toHaveBeenCalledWith('SELECT * FROM tipo_alojamiento WHERE id_tipo_alojamiento = ?', [mockId]);
      expect(resultado).toEqual(mockTipo);
    });

    it('debería devolver null si el ID no se encuentra', async () => {
      const mockId = 99;
      db.query.mockResolvedValue([[]]);

      const resultado = await TipoAlojamiento.findById(mockId);
      expect(resultado).toBeNull();
    });

    it('debería lanzar un error si la BD falla', async () => {
        const mockId = 1;
        const dbError = new Error('DB findById failed');
        db.query.mockRejectedValue(dbError);
        await expect(TipoAlojamiento.findById(mockId)).rejects.toThrow(dbError);
        expect(console.error).toHaveBeenCalledWith("Error al buscar tipo de alojamiento por ID en BD:", dbError);
    });
  });

  describe('TipoAlojamiento.create', () => {
    it('debería crear un nuevo tipo de alojamiento', async () => {
      const tipoData = { nombre: 'Cabaña', descripcion: 'Acogedora cabaña' };
      const mockInsertId = 3;
      db.query.mockResolvedValue([{ insertId: mockInsertId }]);

      const resultado = await TipoAlojamiento.create(tipoData);

      expect(db.query).toHaveBeenCalledWith(
        'INSERT INTO tipo_alojamiento (nombre, descripcion) VALUES (?, ?)',
        [tipoData.nombre, tipoData.descripcion]
      );
      expect(resultado).toEqual({ id_tipo_alojamiento: mockInsertId, ...tipoData });
    });

    it('debería usar null para descripción si no se provee', async () => {
        const tipoData = { nombre: 'Hostel' };
        const mockInsertId = 4;
        db.query.mockResolvedValue([{ insertId: mockInsertId }]);

        await TipoAlojamiento.create(tipoData);
        expect(db.query.mock.calls[0][1][1]).toBeNull(); // El segundo valor (descripción) debe ser null
    });


    it('debería lanzar un error si la BD falla', async () => {
        const tipoData = { nombre: 'ErrorTipo' };
        const dbError = new Error('DB create failed');
        db.query.mockRejectedValue(dbError);
        await expect(TipoAlojamiento.create(tipoData)).rejects.toThrow(dbError);
        expect(console.error).toHaveBeenCalledWith("Error al crear tipo de alojamiento en BD:", dbError);
    });
  });

  describe('TipoAlojamiento.updateById', () => {
    it('debería actualizar un tipo de alojamiento', async () => {
      const mockId = 1;
      const updateData = { nombre: 'Hotel Actualizado', descripcion: 'Nueva desc' };
      db.query.mockResolvedValue([{ affectedRows: 1 }]);

      const resultado = await TipoAlojamiento.updateById(mockId, updateData);

      expect(db.query).toHaveBeenCalledWith(
        'UPDATE tipo_alojamiento SET nombre = ?, descripcion = ? WHERE id_tipo_alojamiento = ?',
        [updateData.nombre, updateData.descripcion, mockId]
      );
      expect(resultado).toBe(true);
    });

    it('debería actualizar solo el nombre si solo se provee nombre', async () => {
        const mockId = 1;
        const updateData = { nombre: 'Solo Nombre Hotel' };
        db.query.mockResolvedValue([{ affectedRows: 1 }]);
        await TipoAlojamiento.updateById(mockId, updateData);
        expect(db.query).toHaveBeenCalledWith(
            'UPDATE tipo_alojamiento SET nombre = ? WHERE id_tipo_alojamiento = ?',
            [updateData.nombre, mockId]
        );
    });

    it('debería actualizar solo la descripción si solo se provee descripción', async () => {
        const mockId = 1;
        const updateData = { descripcion: 'Solo Descripcion Hotel' };
        db.query.mockResolvedValue([{ affectedRows: 1 }]);
        await TipoAlojamiento.updateById(mockId, updateData);
        expect(db.query).toHaveBeenCalledWith(
            'UPDATE tipo_alojamiento SET descripcion = ? WHERE id_tipo_alojamiento = ?',
            [updateData.descripcion, mockId]
        );
    });


    it('debería devolver false si no se afectan filas', async () => {
      const mockId = 99; // ID no existente
      const updateData = { nombre: 'No Existe' };
      db.query.mockResolvedValue([{ affectedRows: 0 }]);

      const resultado = await TipoAlojamiento.updateById(mockId, updateData);
      expect(resultado).toBe(false);
    });

    it('debería lanzar un error "No se proporcionaron datos para actualizar" si updateData está vacío', async () => {
        const mockId = 1;
        await expect(TipoAlojamiento.updateById(mockId, {})).rejects.toThrow("No se proporcionaron datos para actualizar.");
    });

    it('debería lanzar un error si la BD falla', async () => {
        const mockId = 1;
        const updateData = { nombre: 'ErrorUpdate' };
        const dbError = new Error('DB update failed');
        db.query.mockRejectedValue(dbError);
        await expect(TipoAlojamiento.updateById(mockId, updateData)).rejects.toThrow(dbError);
        expect(console.error).toHaveBeenCalledWith("Error al actualizar tipo de alojamiento en BD:", dbError);
    });
  });

  describe('TipoAlojamiento.deleteById', () => {
    it('debería eliminar un tipo de alojamiento', async () => {
      const mockId = 1;
      db.query.mockResolvedValue([{ affectedRows: 1 }]);

      const resultado = await TipoAlojamiento.deleteById(mockId);

      expect(db.query).toHaveBeenCalledWith('DELETE FROM tipo_alojamiento WHERE id_tipo_alojamiento = ?', [mockId]);
      expect(resultado).toBe(true);
    });

    it('debería devolver false si no se afectan filas', async () => {
      const mockId = 99; // ID no existente
      db.query.mockResolvedValue([{ affectedRows: 0 }]);

      const resultado = await TipoAlojamiento.deleteById(mockId);
      expect(resultado).toBe(false);
    });

    it('debería lanzar un error si la BD falla', async () => {
        const mockId = 1;
        const dbError = new Error('DB delete failed');
        db.query.mockRejectedValue(dbError);
        await expect(TipoAlojamiento.deleteById(mockId)).rejects.toThrow(dbError);
        expect(console.error).toHaveBeenCalledWith("Error al eliminar tipo de alojamiento en BD:", dbError);
    });
  });
});

// Espía para console.error, útil para verificar que se loguean errores
beforeAll(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterAll(() => {
  console.error.mockRestore();
});
