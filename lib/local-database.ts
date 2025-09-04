import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

// Database file paths
const DB_DIR = path.join(process.cwd(), 'database');
const DB_FILES = {
  users: path.join(DB_DIR, 'users.json'),
  vendors: path.join(DB_DIR, 'vendors.json'),
  venues: path.join(DB_DIR, 'venues.json'),
  bookings: path.join(DB_DIR, 'bookings.json'),
  tasks: path.join(DB_DIR, 'tasks.json'),
  payments: path.join(DB_DIR, 'payments.json'),
  reviews: path.join(DB_DIR, 'reviews.json'),
};

// Ensure database directory exists
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

// Initialize database files if they don't exist
const initializeDatabase = () => {
  Object.entries(DB_FILES).forEach(([table, filePath]) => {
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify([], null, 2));
    }
  });
};

// Read data from a database file
const readData = <T>(table: keyof typeof DB_FILES): T[] => {
  try {
    const filePath = DB_FILES[table];
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading ${table}:`, error);
    return [];
  }
};

// Write data to a database file
const writeData = <T>(table: keyof typeof DB_FILES, data: T[]): boolean => {
  try {
    const filePath = DB_FILES[table];
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error(`Error writing ${table}:`, error);
    return false;
  }
};

// Generic CRUD operations
export class LocalDatabase {
  // Create a new record
  static create<T extends { id?: string }>(table: keyof typeof DB_FILES, data: Omit<T, 'id'>): T | null {
    initializeDatabase();
    const records = readData<T>(table);
    const newRecord = {
      ...data,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as T;
    
    records.push(newRecord);
    
    if (writeData(table, records)) {
      return newRecord;
    }
    return null;
  }

  // Read all records
  static read<T>(table: keyof typeof DB_FILES): T[] {
    initializeDatabase();
    return readData<T>(table);
  }

  // Read a single record by ID
  static readById<T extends { id: string }>(table: keyof typeof DB_FILES, id: string): T | null {
    initializeDatabase();
    const records = readData<T>(table);
    return records.find(record => record.id === id) || null;
  }

  // Read records by field
  static readByField<T>(table: keyof typeof DB_FILES, field: string, value: any): T[] {
    initializeDatabase();
    const records = readData<T>(table);
    return records.filter((record: any) => record[field] === value);
  }

  // Update a record
  static update<T extends { id: string }>(table: keyof typeof DB_FILES, id: string, updates: Partial<T>): T | null {
    initializeDatabase();
    const records = readData<T>(table);
    const index = records.findIndex(record => record.id === id);
    
    if (index === -1) {
      return null;
    }
    
    records[index] = {
      ...records[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    
    if (writeData(table, records)) {
      return records[index];
    }
    return null;
  }

  // Delete a record
  static delete<T extends { id: string }>(table: keyof typeof DB_FILES, id: string): boolean {
    initializeDatabase();
    const records = readData<T>(table);
    const filteredRecords = records.filter(record => record.id !== id);
    
    if (filteredRecords.length === records.length) {
      return false; // Record not found
    }
    
    return writeData(table, filteredRecords);
  }

  // Count records
  static count(table: keyof typeof DB_FILES): number {
    initializeDatabase();
    const records = readData(table);
    return records.length;
  }

  // Search records
  static search<T>(table: keyof typeof DB_FILES, query: string, fields: string[]): T[] {
    initializeDatabase();
    const records = readData<T>(table);
    const lowercaseQuery = query.toLowerCase();
    
    return records.filter((record: any) => {
      return fields.some(field => {
        const value = record[field];
        return value && value.toString().toLowerCase().includes(lowercaseQuery);
      });
    });
  }

  // Get paginated results
  static paginate<T>(table: keyof typeof DB_FILES, page: number = 1, limit: number = 10): {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  } {
    initializeDatabase();
    const records = readData<T>(table);
    const total = records.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const data = records.slice(startIndex, endIndex);
    
    return {
      data,
      total,
      page,
      limit,
      totalPages,
    };
  }

  // Clear all data from a table
  static clear(table: keyof typeof DB_FILES): boolean {
    return writeData(table, []);
  }

  // Clear all database
  static clearAll(): boolean {
    try {
      Object.keys(DB_FILES).forEach(table => {
        writeData(table as keyof typeof DB_FILES, []);
      });
      return true;
    } catch (error) {
      console.error('Error clearing database:', error);
      return false;
    }
  }
}

// Initialize database on import
initializeDatabase();

export default LocalDatabase;
