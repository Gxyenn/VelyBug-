import { MongoClient, Db } from 'mongodb';

const uri = process.env.MONGO_URI || 'mongodb+srv://gxyenndev_db_user:34tkxTduFqL1VarQ@cluster0.hmmep5r.mongodb.net/Cluster0?retryWrites=true&w=majority';
if (!uri) {
  throw new Error('Please define the MONGO_URI environment variable');
}

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const client = new MongoClient(uri!);

  await client.connect();
  const db = client.db();

  cachedClient = client;
  cachedDb = db;

  return { client, db };
}