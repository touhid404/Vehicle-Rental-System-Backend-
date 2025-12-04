import { Pool } from "pg";
import config from ".";
const pool = new Pool({
  connectionString: config.databaseUrl,
});

const initDB = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE CHECK (email = LOWER(email)), 
        password TEXT NOT NULL CHECK (LENGTH(password) >= 6),
        phone VARCHAR(15) NOT NULL, 
        role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'customer'))
);
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS vehicles (
        id SERIAL PRIMARY KEY,
        vehicle_name VARCHAR(100) NOT NULL,
        type VARCHAR(20) NOT NULL CHECK (type IN ('car', 'bike', 'van', 'SUV')),
        registration_number VARCHAR(50) NOT NULL UNIQUE,
        daily_rent_price NUMERIC(10, 2) NOT NULL CHECK (daily_rent_price > 0),
        availability_status VARCHAR(20) NOT NULL CHECK (availability_status IN ('available', 'booked'))
);
    `);

    console.log("Tables are ready");
  } catch (error) {
    console.error("DB Initialization Error:", error);
  }
};

export { pool, initDB };

// id	Auto-generated
// vehicle_name	Required
// type	'car', 'bike', 'van' or 'SUV'
// registration_number	Required, unique
// daily_rent_price	Required, positive
// availability_status	'available' or 'booked'
