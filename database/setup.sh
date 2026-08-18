#!/bin/bash

# Nestania MySQL Database Setup Script

echo "🚀 Setting up Nestania MySQL Database..."
echo ""

# Check if MySQL is installed
if ! command -v mysql &> /dev/null; then
    echo "❌ MySQL is not installed. Please install MySQL 8.0+ first."
    echo "Visit: https://dev.mysql.com/downloads/mysql/"
    exit 1
fi

echo "✅ MySQL found"
echo ""

# Prompt for MySQL credentials
read -p "Enter MySQL root username (default: root): " DB_USER
DB_USER=${DB_USER:-root}

read -sp "Enter MySQL password: " DB_PASSWORD
echo ""

# Test connection
echo ""
echo "Testing MySQL connection..."
mysql -u "$DB_USER" -p"$DB_PASSWORD" -e "SELECT 1;" &> /dev/null

if [ $? -eq 0 ]; then
    echo "✅ MySQL connection successful"
else
    echo "❌ Failed to connect to MySQL. Please check your credentials."
    exit 1
fi

# Create database and tables
echo ""
echo "Creating database and tables..."
mysql -u "$DB_USER" -p"$DB_PASSWORD" < database/schema.sql

if [ $? -eq 0 ]; then
    echo "✅ Database created successfully"
else
    echo "❌ Failed to create database"
    exit 1
fi

# Update .env file
echo ""
echo "Updating .env file..."

# Check if .env exists
if [ ! -f .env ]; then
    echo "❌ .env file not found"
    exit 1
fi

# Update database credentials in .env
sed -i.bak "s/DB_USER=.*/DB_USER=$DB_USER/" .env
sed -i.bak "s/DB_PASSWORD=.*/DB_PASSWORD=$DB_PASSWORD/" .env
sed -i.bak "s/DB_NAME=.*/DB_NAME=nestania/" .env

echo "✅ .env file updated"
echo ""
echo "🎉 Setup complete! Your database is ready."
echo ""
echo "Start the server with: npm run dev"
