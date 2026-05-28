const { Sequelize } = require("sequelize")

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
})

async function connectDB() {
  try {
    await sequelize.authenticate()
    await sequelize.sync({ force: false })
    console.log("Database connected successfully")
  } catch (err) {
    console.error("Database connection failed:", err.message)
    // Don't crash the server if DB is unavailable
  }
}

module.exports = { sequelize, connectDB }