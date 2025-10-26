import { MongoClient, Db } from 'mongodb';

const uri = 'mongodb+srv://gxyenndev_db_user:34tkxTduFqL1VarQ@cluster0.hmmep5r.mongodb.net/VelyBugDb?retryWrites=true&w=majority';

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const client = new MongoClient(uri);

  await client.connect();
  const db = client.db();

  cachedClient = client;
  cachedDb = db;

  return { client, db };
}
