# CURHATIN Database Setup Guide

This guide helps you configure CURHATIN to work with various database providers.

## Supported Databases

1. **Localhost PostgreSQL**
2. **Localhost MySQL**
3. **NeonDB (PostgreSQL)**
4. **Supabase (PostgreSQL)**
5. **Aiven MySQL**

## Setup Instructions

### 1. Environment Configuration

Copy the example environment file:
```bash
cp .env.example .env
```

### 2. Choose Your Database

#### Option 1: Localhost PostgreSQL
```bash
# In .env file
DATABASE_URL=postgresql://username:password@localhost:5432/curhatin_db
```

Then run:
```bash
npm run db:push
```

#### Option 2: Localhost MySQL
```bash
# In .env file
DATABASE_URL=mysql://username:password@localhost:3306/curhatin_db
DB_TYPE=mysql
```

Then run:
```bash
npm run db:push:mysql
```

#### Option 3: NeonDB (PostgreSQL)
1. Create account at [Neon](https://neon.tech)
2. Create a new project
3. Copy connection string from dashboard
```bash
# In .env file
DATABASE_URL=postgresql://username:password@ep-xxx-xxx.us-east-1.aws.neon.tech/neondb
```

Then run:
```bash
npm run db:push
```

#### Option 4: Supabase (PostgreSQL)
1. Create account at [Supabase](https://supabase.com)
2. Create a new project
3. Go to Settings > Database
4. Copy connection string under "Connection string" > "Transaction pooler"
5. Replace `[YOUR-PASSWORD]` with your database password

```bash
# In .env file
DATABASE_URL=postgresql://postgres.xxx:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres
```

Then run:
```bash
npm run db:push
```

#### Option 5: Aiven MySQL
1. Create account at [Aiven](https://aiven.io)
2. Create a MySQL service
3. Copy connection string from service overview

```bash
# In .env file
DATABASE_URL=mysql://username:password@mysql-xxx.aivencloud.com:port/defaultdb
DB_TYPE=mysql
```

Then run:
```bash
npm run db:push:mysql
```

### 3. Enable Database Storage

Once your database is configured and schema is pushed:

1. Open `server/storage.ts`
2. Comment out the memory storage line:
   ```typescript
   // export const storage = new MemStorage();
   ```
3. Uncomment the database storage line:
   ```typescript
   export { storage } from './storage-db';
   ```

### 4. Restart Application

```bash
npm run dev
```

## Database Scripts

- `npm run db:push` - Push PostgreSQL schema
- `npm run db:push:mysql` - Push MySQL schema
- `npm run db:studio` - Open PostgreSQL database studio
- `npm run db:studio:mysql` - Open MySQL database studio
- `npm run db:generate` - Generate PostgreSQL migrations
- `npm run db:generate:mysql` - Generate MySQL migrations

## Troubleshooting

### Connection Issues
- Verify your DATABASE_URL is correct
- Check firewall settings for localhost databases
- Ensure database server is running
- For cloud databases, check IP whitelist settings

### Schema Issues
- Run the appropriate `db:push` command for your database type
- For MySQL, ensure `DB_TYPE=mysql` is set in environment
- Check database logs for specific error messages

### Performance
- For production, use connection pooling
- Set appropriate connection limits in database configuration
- Monitor query performance with database studio tools

## Security Notes

- Never commit your .env file to version control
- Use strong passwords for database connections
- Enable SSL/TLS for remote database connections
- Regularly update database credentials
- Use read-only connections where appropriate