import db from '../lib/db';
import { User } from '../context/AuthContext';

export const createUser = async (user: Omit<User, 'uid'> & { password: string }) => {
  const { email, name, surname, role, password } = user;
  
  try {
    const result = await db.query(
      'INSERT INTO users (email, name, surname, role, password) VALUES ($1, $2, $3, $4, $5) RETURNING id, email, name, surname, role',
      [email, name, surname, role, password] // En producción, deberías hashear la contraseña
    );
    
    return {
      success: true,
      user: {
        uid: result.rows[0].id,
        email: result.rows[0].email,
        name: result.rows[0].name,
        surname: result.rows[0].surname,
        role: result.rows[0].role,
      },
    };
  } catch (error) {
    console.error('Error al crear usuario:', error);
    return {
      success: false,
      error: 'Error al crear usuario. Por favor, inténtalo de nuevo.',
    };
  }
};

export const getUserByEmail = async (email: string) => {
  try {
    const result = await db.query(
      'SELECT id, email, name, surname, role FROM users WHERE email = $1',
      [email]
    );
    
    if (result.rows.length === 0) {
      return { success: false, error: 'Usuario no encontrado' };
    }
    
    return {
      success: true,
      user: {
        uid: result.rows[0].id,
        email: result.rows[0].email,
        name: result.rows[0].name,
        surname: result.rows[0].surname,
        role: result.rows[0].role,
      },
    };
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    return {
      success: false,
      error: 'Error al obtener usuario. Por favor, inténtalo de nuevo.',
    };
  }
};

export const authenticateUser = async (email: string, password: string) => {
  try {
    // En producción, deberías comparar con el hash de la contraseña
    const result = await db.query(
      'SELECT id, email, name, surname, role FROM users WHERE email = $1 AND password = $2',
      [email, password]
    );
    
    if (result.rows.length === 0) {
      return { success: false, error: 'Credenciales incorrectas' };
    }
    
    return {
      success: true,
      user: {
        uid: result.rows[0].id,
        email: result.rows[0].email,
        name: result.rows[0].name,
        surname: result.rows[0].surname,
        role: result.rows[0].role,
      },
    };
  } catch (error) {
    console.error('Error al autenticar usuario:', error);
    return {
      success: false,
      error: 'Error al autenticar usuario. Por favor, inténtalo de nuevo.',
    };
  }
};

export const getAllPatients = async () => {
  try {
    const result = await db.query(
      'SELECT id, email, name, surname FROM users WHERE role = $1',
      ['patient']
    );
    
    return {
      success: true,
      patients: result.rows.map(row => ({
        id: row.id,
        name: `${row.name} ${row.surname}`,
        email: row.email,
      })),
    };
  } catch (error) {
    console.error('Error al obtener pacientes:', error);
    return {
      success: false,
      error: 'Error al obtener pacientes. Por favor, inténtalo de nuevo.',
    };
  }
};

// Nueva función para obtener todos los médicos
export const getAllDoctors = async () => {
  try {
    const result = await db.query(
      'SELECT id, email, name, surname FROM users WHERE role = $1',
      ['doctor']
    );
    
    return {
      success: true,
      doctors: result.rows.map(row => ({
        id: row.id,
        name: `${row.name} ${row.surname}`,
        email: row.email,
      })),
    };
  } catch (error) {
    console.error('Error al obtener médicos:', error);
    return {
      success: false,
      error: 'Error al obtener médicos. Por favor, inténtalo de nuevo.',
    };
  }
};