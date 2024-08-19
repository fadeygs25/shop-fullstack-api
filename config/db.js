const { Pool } = require('pg')
const env = require('dotenv').config()

// const db = new Pool({
//   host: process.env.POSTGRES_HOST,
//   database: process.env.POSTGRES_DATABASE,
//   user: process.env.POSTGRES_USER,
//   password: process.env.POSTGRES_PASSWORD,
//   port: 5432,
// })

const db = new Pool({
  // connectionString: process.env.POSTGRES_URL + "?sslmode=require",
})


// async function connectToDatabase() {
//   try {
//     await db.connect();
//     console.log('Connected to PostgreSQL database');
//   } catch (error) {
//     console.error('Error connecting to database', error);
//   }
// }
// connectToDatabase();

module.exports = db