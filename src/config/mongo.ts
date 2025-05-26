import { MongoClient, GridFSBucket, Db } from "mongodb";

const client = new MongoClient(process.env.DATABASE_URL!);
let db: Db;
let bucket: GridFSBucket;

export async function connectMongo() {
  if (!db) {
    await client.connect();
    db = client.db(); // default db from connection string
    bucket = new GridFSBucket(db, { bucketName: "profilePictures" });
  }
  return { db, bucket };
}
