import { MongoClient } from "mongodb";
import { attachDatabasePool } from "@vercel/functions";

const uri = "mongodb://ugcsetup_db_user:r9S5cHPUAgWF3MU9@ac-5r6zvl9-shard-00-00.riwhhcq.mongodb.net:27017,ac-5r6zvl9-shard-00-01.riwhhcq.mongodb.net:27017,ac-5r6zvl9-shard-00-02.riwhhcq.mongodb.net:27017/?ssl=true&replicaSet=atlas-relrff-shard-0&authSource=admin&appName=Cluster0";

const options = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
};

const client = new MongoClient(uri, options);
attachDatabasePool(client);

export default client;