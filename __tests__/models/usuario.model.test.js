// __tests__/models/usuario.model.test.js

const Usuario = require('../../models/usuario.model');
const db = require('../../db'); // Este será el módulo que necesitamos mockear
const bcrypt = require('bcryptjs');

// Mockear el módulo db
jest.mock('../../db', () => ({
  query: jest.fn(),
}));

// Mockear bcryptjs parcialmente para controlar el hash y la comparación
jest.mock('bcryptjs', () => ({
  ...jest.requireActual('bcryptjs'), // Importar y mantener las funciones originales que no queremos mockear
  genSalt: jest.fn(),
  hash: jest.fn(),
  compare: jest.fn(),
}));

describe('Usuario Model', () => {
  beforeEach(() => {
    // Limpiar los mocks antes de cada prueba
    db.query.mockClear();
    bcrypt.genSalt.mockClear();
    bcrypt.hash.mockClear();
    bcrypt.compare.mockClear();
  });

  describe('Usuario.create', () => {
    it('debería crear un nuevo usuario y devolver sus datos (sin contraseña)', async () => {
      const nuevoUsuarioData = {
        nombre: 'Test',
        apellido: 'User',
        email: 'test@example.com',
        password: 'password123',
        es_admin: false,
      };
      const mockSalt = 'somesalt';
      const mockHashedPassword = 'hashedpassword123';
      const mockInsertId = 1;

      bcrypt.genSalt.mockResolvedValue(mockSalt);
      bcrypt.hash.mockResolvedValue(mockHashedPassword);
      db.query.mockResolvedValue([{ insertId: mockInsertId }]); // Simula la respuesta de db.query para INSERT

      const resultado = await Usuario.create(nuevoUsuarioData);

      expect(bcrypt.genSalt).toHaveBeenCalledWith(10);
      expect(bcrypt.hash).toHaveBeenCalledWith(nuevoUsuarioData.password, mockSalt);
      expect(db.query).toHaveBeenCalledWith(
        'INSERT INTO usuarios (nombre, apellido, email, password, es_admin) VALUES (?, ?, ?, ?, ?)',
        [
          nuevoUsuarioData.nombre,
          nuevoUsuarioData.apellido,
          nuevoUsuarioData.email,
          mockHashedPassword,
          nuevoUsuarioData.es_admin,
        ]
      );
      expect(resultado).toEqual({
        id: mockInsertId,
        nombre: nuevoUsuarioData.nombre,
        apellido: nuevoUsuarioData.apellido,
        email: nuevoUsuarioData.email,
        es_admin: nuevoUsuarioData.es_admin,
      });
    });

    it('debería asignar es_admin como false por defecto si no se provee', async () => {
        const nuevoUsuarioData = {
            nombre: 'Test',
            apellido: 'User',
            email: 'test2@example.com',
            password: 'password123',
            // es_admin no se provee
        };
        bcrypt.genSalt.mockResolvedValue('somesalt');
        bcrypt.hash.mockResolvedValue('hashedpassword123');
        db.query.mockResolvedValue([{ insertId: 2 }]);

        await Usuario.create(nuevoUsuarioData);

        expect(db.query.mock.calls[0][1][4]).toBe(false); // El quinto argumento del array de valores debe ser false
    });

    it('debería lanzar un error si el email ya está registrado (ER_DUP_ENTRY)', async () => {
      const nuevoUsuarioData = {
        nombre: 'Test',
        apellido: 'User',
        email: 'test@example.com',
        password: 'password123',
      };
      const dbError = new Error('Duplicate entry');
      dbError.code = 'ER_DUP_ENTRY';

      bcrypt.genSalt.mockResolvedValue('somesalt');
      bcrypt.hash.mockResolvedValue('hashedpassword123');
      db.query.mockRejectedValue(dbError);

      await expect(Usuario.create(nuevoUsuarioData)).rejects.toThrow('El correo electrónico ya está registrado.');
    });

    it('debería lanzar otros errores de base de datos', async () => {
      const nuevoUsuarioData = {
        nombre: 'Test',
        apellido: 'User',
        email: 'test@example.com',
        password: 'password123',
      };
      const dbError = new Error('Some other DB error');
      dbError.code = 'OTHER_ERROR';

      bcrypt.genSalt.mockResolvedValue('somesalt');
      bcrypt.hash.mockResolvedValue('hashedpassword123');
      db.query.mockRejectedValue(dbError);

      await expect(Usuario.create(nuevoUsuarioData)).rejects.toThrow(dbError);
    });
  });

  describe('Usuario.findByEmail', () => {
    it('debería devolver los datos del usuario si se encuentra por email', async () => {
      const mockEmail = 'found@example.com';
      const mockUsuario = { id: 1, email: mockEmail, nombre: 'Found' };
      db.query.mockResolvedValue([[mockUsuario]]); // Simula la respuesta de db.query para SELECT

      const resultado = await Usuario.findByEmail(mockEmail);

      expect(db.query).toHaveBeenCalledWith('SELECT * FROM usuarios WHERE email = ?', [mockEmail]);
      expect(resultado).toEqual(mockUsuario);
    });

    it('debería devolver null si el usuario no se encuentra por email', async () => {
      const mockEmail = 'notfound@example.com';
      db.query.mockResolvedValue([[]]); // Simula una respuesta vacía

      const resultado = await Usuario.findByEmail(mockEmail);

      expect(db.query).toHaveBeenCalledWith('SELECT * FROM usuarios WHERE email = ?', [mockEmail]);
      expect(resultado).toBeNull();
    });

    it('debería lanzar un error si la consulta a la BD falla', async () => {
        const mockEmail = 'error@example.com';
        const dbError = new Error('DB query failed');
        db.query.mockRejectedValue(dbError);

        await expect(Usuario.findByEmail(mockEmail)).rejects.toThrow(dbError);
    });
  });

  describe('Usuario.findById', () => {
    it('debería devolver los datos del usuario (sin password) si se encuentra por ID', async () => {
      const mockId = 1;
      // El SELECT en el modelo es 'SELECT id, nombre, apellido, email, es_admin, fecha_registro FROM usuarios WHERE id = ?'
      const mockUsuario = { id: mockId, email: 'idfound@example.com', nombre: 'IDFound', es_admin: false, fecha_registro: expect.any(String) };
      db.query.mockResolvedValue([[mockUsuario]]);

      const resultado = await Usuario.findById(mockId);

      expect(db.query).toHaveBeenCalledWith('SELECT id, nombre, apellido, email, es_admin, fecha_registro FROM usuarios WHERE id = ?', [mockId]);
      expect(resultado).toEqual(mockUsuario);
    });

    it('debería devolver null si el usuario no se encuentra por ID', async () => {
      const mockId = 99;
      db.query.mockResolvedValue([[]]);

      const resultado = await Usuario.findById(mockId);

      expect(db.query).toHaveBeenCalledWith('SELECT id, nombre, apellido, email, es_admin, fecha_registro FROM usuarios WHERE id = ?', [mockId]);
      expect(resultado).toBeNull();
    });
  });

  describe('Usuario.comparePassword', () => {
    it('debería llamar a bcrypt.compare y devolver su resultado', async () => {
      const candidatePassword = 'password123';
      const hashedPassword = 'hashedpassword123';

      bcrypt.compare.mockResolvedValue(true);
      let resultado = await Usuario.comparePassword(candidatePassword, hashedPassword);
      expect(bcrypt.compare).toHaveBeenCalledWith(candidatePassword, hashedPassword);
      expect(resultado).toBe(true);

      bcrypt.compare.mockResolvedValue(false);
      resultado = await Usuario.comparePassword(candidatePassword, hashedPassword);
      expect(bcrypt.compare).toHaveBeenCalledWith(candidatePassword, hashedPassword);
      expect(resultado).toBe(false);
    });
  });
});
