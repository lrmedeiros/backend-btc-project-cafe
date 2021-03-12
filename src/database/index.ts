import { MongoClient } from 'mongodb';
import { AppError } from '../errors/AppError';
import url from 'url';

async function connectionToDatabase(uri: string) {
  try {
    const client = await MongoClient.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const dbName = url.parse(uri).pathname.substr(1);

    const db = client.db(dbName);

    return db;
  } catch (err) {
    throw new AppError(err);
  }
}

export { connectionToDatabase };
