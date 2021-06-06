import { MongoClient, Db } from 'mongodb';
import { AppError } from '../errors/AppError';
import url from 'url';

let db: Db = null;
async function connectionToDatabase(uri: string) {
  if (db) {
    return db;
  } else {
    try {
      const client = await MongoClient.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });

      const dbName = url.parse(uri).pathname.substr(1);

      db = client.db(dbName);

      return db;
    } catch (err) {
      throw new AppError(err);
    }
  }
}

export { connectionToDatabase };
