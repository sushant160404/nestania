# MySQL Database Setup for Nestania

## Prerequisites

Install MySQL 8.0+ on your system:

### Windows
Download from: https://dev.mysql.com/downloads/mysql/

### Mac
```bash
brew install mysql
brew services start mysql
```

### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install mysql-server
sudo systemctl start mysql
```

## Setup Instructions

### 1. Start MySQL Service

Make sure MySQL is running on your system.

### 2. Create Database and Tables

Run the schema file:

```bash
mysql -u root -p < database/schema.sql
```

Or manually:

```bash
mysql -u root -p

# Then paste the contents of schema.sql
```

### 3. Configure Environment Variables

Update your `.env` file with your MySQL credentials:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=nestania
```

### 4. Test Connection

Start the server:

```bash
npm run dev
```

You should see:
```
✅ MySQL database connected
✅ MySQL connection pool created
Nestania Server running on http://localhost:3000
```

## Troubleshooting

### Connection Issues

**Error: Access denied for user 'root'@'localhost'**
- Check your MySQL password in `.env`
- Try connecting manually: `mysql -u root -p`

**Error: Can't connect to MySQL server on 'localhost'**
- Make sure MySQL service is running
- Check if MySQL is listening on port 3306: `netstat -an | findstr 3306` (Windows) or `lsof -i :3306` (Mac/Linux)

**Error: Database 'nestania' doesn't exist**
- Run the schema file again: `mysql -u root -p < database/schema.sql`

### Fallback to In-Memory

If MySQL isn't available, the app automatically falls back to in-memory storage. You'll see:

```
⚠️  MySQL not available - using in-memory storage
```

The app will still work, but data won't persist across server restarts.

## Database Structure

```
nestania/
├── users          - User accounts and addresses
├── orders         - Order history and tracking
├── reviews        - Product reviews
├── newsletter     - Email subscribers
└── products       - Product catalog (optional)
```

## Useful Commands

### View all tables
```sql
USE nestania;
SHOW TABLES;
```

### View table structure
```sql
DESCRIBE orders;
```

### Check recent orders
```sql
SELECT orderNumber, status, total, createdAt FROM orders ORDER BY createdAt DESC LIMIT 10;
```

### Clear all data (keep structure)
```sql
TRUNCATE TABLE orders;
TRUNCATE TABLE reviews;
TRUNCATE TABLE newsletter;
```
