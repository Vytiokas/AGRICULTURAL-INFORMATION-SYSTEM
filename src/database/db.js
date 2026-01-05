import * as SQLite from 'expo-sqlite';

let db;

export const initDatabase = async () => {
  try {
    db = await SQLite.openDatabaseAsync('agrolink.db');
    
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS equipment (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        price REAL,
        sellerName TEXT,
        sellerPhone TEXT,
        imageUrl TEXT,
        createdAt INTEGER
      );

      CREATE TABLE IF NOT EXISTS services (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        serviceName TEXT NOT NULL,
        description TEXT,
        pricePerHectare REAL,
        providerName TEXT,
        providerPhone TEXT,
        createdAt INTEGER
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
  } catch (error) {
    console.error('Database init error:', error);
  }
};

// Equipment
export const getEquipment = async () => {
  try {
    if (!db) await initDatabase();
    const result = await db.getAllAsync('SELECT * FROM equipment ORDER BY createdAt DESC');
    return result || [];
  } catch (error) {
    console.error('Get equipment error:', error);
    return [];
  }
};

export const addEquipment = async (equipment) => {
  try {
    if (!db) await initDatabase();
    await db.runAsync(
      'INSERT INTO equipment (title, description, price, sellerName, sellerPhone, createdAt) VALUES (?, ?, ?, ?, ?, ?)',
      [equipment.title, equipment.description, equipment.price, equipment.sellerName, equipment.sellerPhone, Date.now()]
    );
  } catch (error) {
    console.error('Add equipment error:', error);
  }
};

// Services
export const getServices = async () => {
  try {
    if (!db) await initDatabase();
    const result = await db.getAllAsync('SELECT * FROM services ORDER BY createdAt DESC');
    return result || [];
  } catch (error) {
    console.error('Get services error:', error);
    return [];
  }
};

export const addService = async (service) => {
  try {
    if (!db) await initDatabase();
    await db.runAsync(
      'INSERT INTO services (serviceName, description, pricePerHectare, providerName, providerPhone, createdAt) VALUES (?, ?, ?, ?, ?, ?)',
      [service.serviceName, service.description, service.pricePerHectare, service.providerName, service.providerPhone, Date.now()]
    );
  } catch (error) {
    console.error('Add service error:', error);
  }
};

// News
export const getNews = async () => {
  try {
    if (!db) await initDatabase();
    const result = await db.getAllAsync('SELECT * FROM news ORDER BY timestamp DESC');
    return result || [];
  } catch (error) {
    console.error('Get news error:', error);
    return [];
  }
};

export const addNews = async (news) => {
  try {
    if (!db) await initDatabase();
    await db.runAsync(
      'INSERT INTO news (title, content, timestamp) VALUES (?, ?, ?)',
      [news.title, news.content, Date.now()]
    );
  } catch (error) {
    console.error('Add news error:', error);
  }
};

// Calendar Events
export const getCalendarEvents = async () => {
  try {
    if (!db) await initDatabase();
    const result = await db.getAllAsync('SELECT * FROM calendar_events ORDER BY eventDate ASC');
    return result || [];
  } catch (error) {
    console.error('Get calendar events error:', error);
    return [];
  }
};

export const addCalendarEvent = async (event) => {
  try {
    if (!db) await initDatabase();
    await db.runAsync(
      'INSERT INTO calendar_events (title, description, eventDate, eventType) VALUES (?, ?, ?, ?)',
      [event.title, event.description, event.eventDate, event.eventType]
    );
  } catch (error) {
    console.error('Add calendar event error:', error);
  }
};
