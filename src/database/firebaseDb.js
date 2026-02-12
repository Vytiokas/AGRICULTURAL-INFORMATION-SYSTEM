// Hybrid Database Layer - SQLite now, Firebase ready
import * as SQLite from 'expo-sqlite';
import { USE_FIREBASE } from '../config/firebase';

let db;

// Reset database - call once if you have migration issues
export const resetDatabase = async () => {
  try {
    const tempDb = await SQLite.openDatabaseAsync('agrolink.db');
    await tempDb.execAsync(`
      DROP TABLE IF EXISTS equipment;
      DROP TABLE IF EXISTS services;
      DROP TABLE IF EXISTS news;
      DROP TABLE IF EXISTS calendar_events;
    `);
    db = null; // Force reinit
    console.log('Database reset successfully');
  } catch (error) {
    console.error('Reset database error:', error);
  }
};

const initDatabase = async () => {
  if (!db) {
    db = await SQLite.openDatabaseAsync('agrolink.db');
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        name TEXT NOT NULL,
        phone TEXT,
        createdAt INTEGER
      );

      CREATE TABLE IF NOT EXISTS equipment (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        price REAL,
        sellerName TEXT,
        sellerPhone TEXT,
        imageUrl TEXT,
        images TEXT,
        userId INTEGER,
        createdAt INTEGER,
        FOREIGN KEY (userId) REFERENCES users (id)
      );

      CREATE TABLE IF NOT EXISTS services (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        serviceName TEXT NOT NULL,
        toolType TEXT,
        description TEXT,
        price REAL,
        priceUnit TEXT DEFAULT 'ha',
        providerName TEXT,
        providerPhone TEXT,
        imageUrl TEXT,
        userId INTEGER,
        createdAt INTEGER,
        FOREIGN KEY (userId) REFERENCES users (id)
      );

      CREATE TABLE IF NOT EXISTS news (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        content TEXT,
        timestamp INTEGER
      );

      CREATE TABLE IF NOT EXISTS calendar_events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        eventDate INTEGER,
        eventType TEXT
      );
    `);
    
    // Migration: Add createdAt column if it doesn't exist
    try {
      await db.execAsync(`
        ALTER TABLE equipment ADD COLUMN createdAt INTEGER;
      `);
    } catch (e) {
      // Column already exists, ignore error
    }
    
    // Migration: Add images column if it doesn't exist
    try {
      await db.execAsync(`
        ALTER TABLE equipment ADD COLUMN images TEXT;
      `);
    } catch (e) {
      // Column already exists, ignore error
    }

    // Migration: Add userId column if it doesn't exist
    try {
      await db.execAsync(`
        ALTER TABLE equipment ADD COLUMN userId INTEGER;
      `);
    } catch (e) {
      // Column already exists, ignore error
    }

    // Migration: Create admin user and assign old equipment (one-time)
    try {
      // Check if admin user exists
      const adminUser = await db.getFirstAsync('SELECT id FROM users WHERE email = ?', ['admin@agrolink.lt']);
      
      if (!adminUser) {
        // Create admin user
        const result = await db.runAsync(
          'INSERT INTO users (email, password, name, phone, createdAt) VALUES (?, ?, ?, ?, ?)',
          ['admin@agrolink.lt', 'admin123', 'Administratorius', '+370 600 00000', Date.now()]
        );
        
        const adminId = result.lastInsertRowId;
        
        // Assign old equipment to admin
        await db.execAsync(`
          UPDATE equipment SET userId = ${adminId} WHERE userId IS NULL;
        `);
        
        console.log('Created admin user and assigned old equipment');
      }
    } catch (e) {
      console.error('Admin migration error:', e);
    }
    
    try {
      await db.execAsync(`
        ALTER TABLE services ADD COLUMN createdAt INTEGER;
      `);
    } catch (e) {
      // Column already exists, ignore error
    }

    // Migration: Add toolType column to services if it doesn't exist
    try {
      await db.execAsync(`
        ALTER TABLE services ADD COLUMN toolType TEXT;
      `);
    } catch (e) {
      // Column already exists, ignore error
    }

    // Migration: Add imageUrl column to services if it doesn't exist
    try {
      await db.execAsync(`
        ALTER TABLE services ADD COLUMN imageUrl TEXT;
      `);
    } catch (e) {
      // Column already exists, ignore error
    }

    // Migration: Add userId column to services if it doesn't exist
    try {
      await db.execAsync(`
        ALTER TABLE services ADD COLUMN userId INTEGER;
      `);
    } catch (e) {
      // Column already exists, ignore error
    }

    // Migration: Add price column to services if it doesn't exist
    try {
      await db.execAsync(`
        ALTER TABLE services ADD COLUMN price REAL;
      `);
    } catch (e) {
      // Column already exists, ignore error
    }

    // Migration: Add priceUnit column to services if it doesn't exist
    try {
      await db.execAsync(`
        ALTER TABLE services ADD COLUMN priceUnit TEXT DEFAULT 'ha';
      `);
    } catch (e) {
      // Column already exists, ignore error
    }

    // Migration: Copy pricePerHectare to price if exists
    try {
      await db.execAsync(`
        UPDATE services SET price = pricePerHectare WHERE price IS NULL AND pricePerHectare IS NOT NULL;
      `);
    } catch (e) {
      // Ignore error
    }
  }
};

// Equipment
export const getEquipment = async () => {
  try {
    await initDatabase();
    const result = await db.getAllAsync('SELECT * FROM equipment ORDER BY createdAt DESC');
    // Parse images JSON string back to array
    return (result || []).map(item => ({
      ...item,
      images: item.images ? JSON.parse(item.images) : []
    }));
  } catch (error) {
    console.error('Get equipment error:', error);
    return [];
  }
};

export const addEquipment = async (equipment) => {
  try {
    await initDatabase();
    const imagesJson = equipment.images ? JSON.stringify(equipment.images) : null;
    await db.runAsync(
      'INSERT INTO equipment (title, description, price, sellerName, sellerPhone, imageUrl, images, userId, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [equipment.title, equipment.description, equipment.price, equipment.sellerName, equipment.sellerPhone, equipment.imageUrl, imagesJson, equipment.userId, Date.now()]
    );
  } catch (error) {
    console.error('Add equipment error:', error);
  }
};

export const deleteEquipment = async (id, userId) => {
  try {
    await initDatabase();
    // Tik skelbimo savininkas gali ištrinti
    await db.runAsync('DELETE FROM equipment WHERE id = ? AND userId = ?', [id, userId]);
  } catch (error) {
    console.error('Delete equipment error:', error);
  }
};

export const getUserEquipment = async (userId) => {
  try {
    await initDatabase();
    const result = await db.getAllAsync('SELECT * FROM equipment WHERE userId = ? ORDER BY createdAt DESC', [userId]);
    return (result || []).map(item => ({
      ...item,
      images: item.images ? JSON.parse(item.images) : []
    }));
  } catch (error) {
    console.error('Get user equipment error:', error);
    return [];
  }
};

// Services
export const getServices = async () => {
  try {
    await initDatabase();
    const result = await db.getAllAsync('SELECT * FROM services ORDER BY createdAt DESC');
    return result || [];
  } catch (error) {
    console.error('Get services error:', error);
    return [];
  }
};

export const addService = async (service) => {
  try {
    await initDatabase();
    await db.runAsync(
      'INSERT INTO services (serviceName, toolType, description, price, priceUnit, providerName, providerPhone, imageUrl, userId, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [service.serviceName, service.toolType, service.description, service.price, service.priceUnit, service.providerName, service.providerPhone, service.imageUrl, service.userId, Date.now()]
    );
  } catch (error) {
    console.error('Add service error:', error);
  }
};

export const deleteService = async (id) => {
  try {
    await initDatabase();
    await db.runAsync('DELETE FROM services WHERE id = ?', [id]);
  } catch (error) {
    console.error('Delete service error:', error);
  }
};

// News
export const getNews = async () => {
  try {
    await initDatabase();
    const result = await db.getAllAsync('SELECT * FROM news ORDER BY timestamp DESC');
    return result || [];
  } catch (error) {
    console.error('Get news error:', error);
    return [];
  }
};

export const addNews = async (news) => {
  try {
    await initDatabase();
    await db.runAsync(
      'INSERT INTO news (title, content, timestamp) VALUES (?, ?, ?)',
      [news.title, news.content, Date.now()]
    );
  } catch (error) {
    console.error('Add news error:', error);
  }
};

export const deleteNews = async (id) => {
  try {
    await initDatabase();
    await db.runAsync('DELETE FROM news WHERE id = ?', [id]);
  } catch (error) {
    console.error('Delete news error:', error);
  }
};

// Calendar Events
export const getCalendarEvents = async () => {
  try {
    await initDatabase();
    const result = await db.getAllAsync('SELECT * FROM calendar_events ORDER BY eventDate ASC');
    return result || [];
  } catch (error) {
    console.error('Get calendar events error:', error);
    return [];
  }
};

export const addCalendarEvent = async (event) => {
  try {
    await initDatabase();
    await db.runAsync(
      'INSERT INTO calendar_events (title, description, eventDate, eventType) VALUES (?, ?, ?, ?)',
      [event.title, event.description, event.eventDate, event.eventType]
    );
  } catch (error) {
    console.error('Add calendar event error:', error);
  }
};

export const deleteCalendarEvent = async (id) => {
  try {
    await initDatabase();
    await db.runAsync('DELETE FROM calendar_events WHERE id = ?', [id]);
  } catch (error) {
    console.error('Delete calendar event error:', error);
  }
};

// Users
export const registerUser = async (userData) => {
  try {
    await initDatabase();
    const result = await db.runAsync(
      'INSERT INTO users (email, password, name, phone, createdAt) VALUES (?, ?, ?, ?, ?)',
      [userData.email, userData.password, userData.name, userData.phone, Date.now()]
    );
    return result.lastInsertRowId;
  } catch (error) {
    console.error('Register user error:', error);
    throw error;
  }
};

export const loginUser = async (email, password) => {
  try {
    await initDatabase();
    const result = await db.getFirstAsync(
      'SELECT * FROM users WHERE email = ? AND password = ?',
      [email, password]
    );
    return result;
  } catch (error) {
    console.error('Login user error:', error);
    return null;
  }
};

export const getUserById = async (userId) => {
  try {
    await initDatabase();
    const result = await db.getFirstAsync(
      'SELECT * FROM users WHERE id = ?',
      [userId]
    );
    return result;
  } catch (error) {
    console.error('Get user error:', error);
    return null;
  }
};
