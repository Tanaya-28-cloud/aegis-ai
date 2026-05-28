require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { connectDB } = require('./db/index');
const { apiLimiter } = require('./middleware/rateLimiter');

// Route imports
const authRoutes = require('./routes/auth');
const emailRoutes = require('./routes/email');
const urlRoutes = require('./routes/url');
const sandboxRoutes = require('./routes/sandbox')

const app = express();
const PORT = process.env.PORT || 3001;

// ─── SECURITY MIDDLEWARE ─────────────────────────────────────────────────────
app.use(helmet()); // sets secure HTTP headers
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://aegis-ai.vercel.app',
    process.env.FRONTEND_URL
  ].filter(Boolean),
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// ─── BODY PARSING ────────────────────────────────────────────────────────────
app.use(express.json({ limit: '1mb' })); // email content can be long
app.use(express.urlencoded({ extended: true }));

// ─── GLOBAL RATE LIMITING ────────────────────────────────────────────────────
app.use('/api/', apiLimiter);

// ─── ROUTES ──────────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/check-email', emailRoutes);
app.use('/api/check-url', urlRoutes);
app.use('/api/sandbox-preview', sandboxRoutes)

// Health check endpoint (useful for Railway + uptime monitoring)
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'aegis-ai-backend', timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.path} not found` });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// ─── START SERVER ────────────────────────────────────────────────────────────
const start = async () => {
  await connectDB(); // wait for DB before accepting requests
  app.listen(PORT, () => {
    console.log(`🚀 Aegis AI backend running on port ${PORT}`);
    console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`   Health check: http://localhost:${PORT}/health`);
  });
};

start();