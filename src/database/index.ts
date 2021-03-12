import { MongoClient } from 'mongodb';
import { AppError } from '../errors/AppError';
import url from 'url';

async function connectionToDatabase(uri: string) {
  try {
    console.log(uri);
    const client = await MongoClient.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const dbName = url.parse(uri).pathname.substr(1);
    console.log(dbName);

    const db = client.db(dbName);

    return db;
  } catch (err) {
    console.log(err);
    throw new AppError(err);
  }
}

export { connectionToDatabase };
