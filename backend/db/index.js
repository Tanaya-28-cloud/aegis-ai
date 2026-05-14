const { Sequelize } = require("sequelize")

const sequelize = new Sequelize("sqlite::memory:", {
  logging: false
})

async function connectDB() {
  try {
    await sequelize.authenticate()
    await sequelize.sync({ force: false })
    console.log("Database: running in local SQLite mode (no PostgreSQL needed)")
  } catch (err) {
    console.error("Database connection failed:", err.message)
  }
}

module.exports = { sequelize, connectDB }