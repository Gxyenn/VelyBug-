require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
app.use(cors());
app.use(express.json());

// routes
const authRoutes = require('./routes/auth.routes');
const commandRoutes = require('./routes/command.routes');
const keysRoutes = require('./routes/keys.routes');
const serversRoutes = require('./routes/servers.routes');
const settingsRoutes = require('./routes/settings.routes');
const historyRoutes = require('./routes/history.routes');

app.use('/api/auth', authRoutes);
app.use('/api/command', commandRoutes);
app.use('/api/keys', keysRoutes);
app.use('/api/servers', serversRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/history', historyRoutes);

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/velybug';

async function seedInitialData() {
  const Key = require('./models/key.model');
  const Settings = require('./models/settings.model');
  const Server = require('./models/server.model');

  // developer key
  const devKeyValue = 'Gxyenn969';
  const devUsername = 'Gxyenn 正式';
  let dev = await Key.findOne({ value: devKeyValue });
  if (!dev) {
    dev = new Key({ value: devKeyValue, role: 'developer', username: devUsername });
    await dev.save();
    console.log('Seeded developer key');
  }

  // settings
  let settings = await Settings.findOne({});
  if (!settings) {
    settings = new Settings({
      botToken: 'TELEGRAM_BOT_TOKEN_HERE',
      chatId: 'CHAT_ID_HERE',
      mongoURI: MONGO_URI
    });
    await settings.save();
    console.log('Seeded Settings');
  }

  // sample servers
  const samples = [
    { serverName: 'Example Server 1', commandFormat: '/kick ${target}' },
    { serverName: 'Example Server 2', commandFormat: '/warn ${target} reason' },
  ];
  for (const s of samples) {
    const exists = await Server.findOne({ serverName: s.serverName });
    if (!exists) {
      await new Server(s).save();
      console.log('Seeded server', s.serverName);
    }
  }
}

mongoose.connect(MONGO_URI, { })
  .then(async () => {
    console.log('Mongo connected');
    await seedInitialData();
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
  });
