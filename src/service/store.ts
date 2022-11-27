import FileSync from 'lowdb/adapters/FileSync';
import * as dotenv from 'dotenv'
import path from 'path';

// This is somehow leading to a compiler error when formulated as import statement.
const low = require('lowdb')

export default class Store {
  
  private _name: string;
  private _db;

  constructor(name: string) {
    dotenv.config()

    this._db = low(new FileSync('./data/history.json'));

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