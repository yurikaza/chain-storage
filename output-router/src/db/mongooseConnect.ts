import { connect } from 'mongoose';
import dotenv from 'dotenv';

export class ConnectDatabase {
  async render() {
    dotenv.config();
    
    const db: any = process.env.MONGODBLINK;
    await connect(`${db}`);
    console.log("db Connected");
  }
}

