#!/bin/bash

# Database Setup Script for CURHATIN
# This script helps set up different database configurations

echo "CURHATIN Database Setup"
echo "======================="
echo ""

# Check which database type to set up
echo "Which database would you like to configure?"
echo "1. Localhost PostgreSQL"
echo "2. Localhost MySQL"
echo "3. NeonDB (PostgreSQL)"
echo "4. Supabase (PostgreSQL)"
echo "5. Aiven MySQL"
echo ""

read -p "Enter your choice (1-5): " choice

case $choice in
  1)
    echo "Setting up PostgreSQL database schema..."
    npm run db:push
    echo "PostgreSQL setup complete!"
    echo "Remember to set DATABASE_URL=postgresql://username:password@localhost:5432/curhatin_db"
    ;;
  2)
    echo "Setting up MySQL database schema..."
    npm run db:push:mysql
    echo "MySQL setup complete!"
    echo "Remember to set DATABASE_URL=mysql://username:password@localhost:3306/curhatin_db"
    echo "Also set DB_TYPE=mysql"
    ;;
  3)
    echo "Setting up NeonDB schema..."
    npm run db:push
    echo "NeonDB setup complete!"
    echo "Remember to set your NeonDB connection string in DATABASE_URL"
    ;;
  4)
    echo "Setting up Supabase schema..."
    npm run db:push
    echo "Supabase setup complete!"
    echo "Remember to set your Supabase connection string in DATABASE_URL"
    ;;
  5)
    echo "Setting up Aiven MySQL schema..."
    npm run db:push:mysql
    echo "Aiven MySQL setup complete!"
    echo "Remember to set your Aiven MySQL connection string in DATABASE_URL"
    echo "Also set DB_TYPE=mysql"
    ;;
  *)
    echo "Invalid choice. Please run the script again and choose 1-5."
    exit 1
    ;;
esac

echo ""
echo "Database setup complete! Don't forget to:"
echo "1. Copy .env.example to .env"
echo "2. Configure your DATABASE_URL"
echo "3. Set your OPENAI_API_KEY"
echo "4. Restart the application"