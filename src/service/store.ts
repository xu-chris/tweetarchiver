import FileSync from 'lowdb/adapters/FileSync';
import * as dotenv from 'dotenv'
import low from 'lowdb';

const DB_PATH = process.env.ROOT_PATH + 'history.json'

export default class Store {
  
  private _name: string;
  private _db = low(new FileSync(DB_PATH));

  constructor(name: string) {
    dotenv.config()
    this._name = name
    this._db.defaults({ [name]: [] }).write()
  }

  get knownIds() {
    return this._db.get(this._name).value()
  }

  addId(id: string) {
    this._db
      .get(this._name)
      .push(id)
      .write()
  }
}