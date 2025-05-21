const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || 'ovh-bom.opfw.me',
  user: process.env.DB_USER || 'harmonic_unicorn',
  password: process.env.DB_PASSWORD || 'lzbsA8oFzZifHZhd',
  database: process.env.DB_NAME || 'harmonic_unicorn'
};

// Initialize database
async function initializeDatabase() {
  try {
    const connection = await mysql.createConnection(dbConfig);
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS mdt_leaderboard (
        id INT AUTO_INCREMENT PRIMARY KEY,
        officer_name VARCHAR(255) NOT NULL,
        mdt_count INT DEFAULT 1,
        last_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    await connection.end();
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization error:', error);
    process.exit(1);
  }
}

// Initialize database on startup
initializeDatabase();

// API Routes
app.get('/api/leaderboard', async (req, res) => {
  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute(
      'SELECT * FROM mdt_leaderboard ORDER BY mdt_count DESC LIMIT 10'
    );
    res.json(rows);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ error: 'Failed to fetch leaderboard data' });
  } finally {
    if (connection) await connection.end();
  }
});

app.post('/api/record-mdt', async (req, res) => {
  const { officerName } = req.body;
  
  if (!officerName) {
    return res.status(400).json({ error: 'Officer name is required' });
  }

  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    
    // Check if officer exists
    const [existing] = await connection.execute(
      'SELECT * FROM mdt_leaderboard WHERE officer_name = ?',
      [officerName]
    );

    if (existing.length > 0) {
      // Update existing record
      await connection.execute(
        'UPDATE mdt_leaderboard SET mdt_count = mdt_count + 1, last_created = CURRENT_TIMESTAMP WHERE officer_name = ?',
        [officerName]
      );
    } else {
      // Insert new record
      await connection.execute(
        'INSERT INTO mdt_leaderboard (officer_name) VALUES (?)',
        [officerName]
      );
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Error recording MDT:', error);
    res.status(500).json({ error: 'Failed to record MDT creation' });
  } finally {
    if (connection) await connection.end();
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// For local development
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Export for Vercel
module.exports = app; 