import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('little_lemon.db');

export const initDatabase = () => {
  db.transaction(tx => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS menu (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        price REAL NOT NULL,
        description TEXT,
        image TEXT,
        category TEXT
      );`
    );
  });
};

export const saveMenuItems = (items) => {
  db.transaction(tx => {
    items.forEach(item => {
      tx.executeSql(
        'INSERT INTO menu (name, price, description, image, category) VALUES (?, ?, ?, ?, ?)',
        [item.name, item.price, item.description, item.image, item.category],
        (_, result) => console.log('Item saved:', item.name),
        (_, error) => console.log('Save error:', error)
      );
    });
  });
};

export const getMenuItems = (filters, callback) => {
  const { categories = [], searchText = '' } = filters;
  let query = 'SELECT * FROM menu';
  let params = [];

  if (searchText || categories.length > 0) {
    query += ' WHERE ';
    const conditions = [];
    
    if (searchText) {
      conditions.push('name LIKE ?');
      params.push(`%${searchText}%`);
    }
    
    if (categories.length > 0) {
      const placeholders = categories.map(() => '?').join(',');
      conditions.push(`category IN (${placeholders})`);
      params = [...params, ...categories];
    }
    
    query += conditions.join(' AND ');
  }

  db.transaction(tx => {
    tx.executeSql(
      query,
      params,
      (_, { rows }) => callback(rows._array),
      (_, error) => {
        console.log('Query error:', error);
        callback([]);
      }
    );
  });
};

export const getCategories = (callback) => {
  db.transaction(tx => {
    tx.executeSql(
      'SELECT DISTINCT category FROM menu',
      [],
      (_, { rows }) => {
        const categories = rows._array.map(item => item.category);
        callback(categories);
      },
      (_, error) => console.log('Category error:', error)
    );
  });
};