require('dotenv').config();
const serverless = require('serverless-http');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// import the backend routers from ./backend/routes (we assume those files exist)
const authRoutes = require('./backend/routes/auth.routes');
const commandRoutes = require('./backend/routes/command.routes');
const keysRoutes = require('./backend/routes/keys.routes');
const serversRoutes = require('./backend/routes/servers.routes');
const settingsRoutes = require('./backend/routes/settings.routes');
const historyRoutes = require('./backend/routes/history.routes');

app.use('/api/auth', authRoutes);
app.use('/api/command', commandRoutes);
app.use('/api/keys', keysRoutes);
app.use('/api/servers', serversRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/history', historyRoutes);

// health
app.get('/api/health', (req, res) => res.json({ ok: true }));

// mongoose connection caching for serverless environments
const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb+srv://dummy:dummy@cluster0.mongodb.net/velybug';
let conn = null;

async function connectToDatabase() {
  if (conn && mongoose.connection.readyState === 1) return conn;
  mongoose.set('strictQuery', false);
  conn = await mongoose.connect(MONGODB_URI, {});
  return conn;
}

connectToDatabase().then(() => {
  console.log('Mongo connected (serverless wrapper)');
}).catch(err => {
  console.error('Mongo connection error', err);
});

module.exports = app;
module.exports.handler = serverless(app);
