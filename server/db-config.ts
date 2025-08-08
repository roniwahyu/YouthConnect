import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle as drizzlePg } from 'drizzle-orm/neon-serverless';
import { drizzle as drizzleMysql } from 'drizzle-orm/mysql2';
import { drizzle as drizzlePostgres } from 'drizzle-orm/postgres-js';
import mysql from 'mysql2/promise';
import postgres from 'postgres';
import ws from 'ws';
import * as schema from '../shared/schema';
import * as mysqlSchema from '../shared/schema-mysql';

// Configure WebSocket for Neon
neonConfig.webSocketConstructor = ws;

// Database type detection based on connection string or environment
export function detectDatabaseType(): 'mysql' | 'postgresql' | 'neon' | 'supabase' {
  const dbUrl = process.env.DATABASE_URL || '';
  
  if (dbUrl.includes('neon.tech')) return 'neon';
  if (dbUrl.includes('supabase.co')) return 'supabase';
  if (dbUrl.startsWith('mysql://') || process.env.DB_TYPE === 'mysql') return 'mysql';
  return 'postgresql'; // Default to PostgreSQL
}

// Initialize database connection based on type
export function initializeDatabase() {
  const dbType = detectDatabaseType();
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error(
      'DATABASE_URL must be set. Please configure your database connection string.'
    );
  }

  switch (dbType) {
    case 'neon':
      console.log('Connecting to NeonDB...');
      const neonPool = new Pool({ connectionString });
      return drizzlePg({ client: neonPool, schema });

    case 'supabase':
      console.log('Connecting to Supabase PostgreSQL...');
      const supabaseClient = postgres(connectionString, { prepare: false });
      return drizzlePostgres({ client: supabaseClient, schema });

    case 'mysql':
      console.log('Connecting to MySQL database...');
      const mysqlConnection = mysql.createPool({
        uri: connectionString,
        connectionLimit: 10,
      });
      return drizzleMysql({ client: mysqlConnection, schema: mysqlSchema, mode: 'default' });

    case 'postgresql':
    default:
      console.log('Connecting to PostgreSQL database...');
      const pgClient = postgres(connectionString, { prepare: false });
      return drizzlePostgres({ client: pgClient, schema });
  }
}

// Export the database instance
export const db = initializeDatabase();
export const dbType = detectDatabaseType();