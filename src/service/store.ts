import fs from 'fs'
import FileSync from 'lowdb/adapters/FileSync';
import * as dotenv from 'dotenv'

// This is somehow leading to a compiler error when formulated as import statement.
const low = require('lowdb')

export default class Store {
  
  private _name: string;
  private _db;

  constructor(name: string, baseDir: string) {
    dotenv.config()

    const dir = baseDir + '/db/'
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir, { recursive: true });
        console.log('Created archive folder: ' + dir)
    } 

    this._db = low(new FileSync(baseDir + '/db/db.json'));

    this._name = name
    this._db.defaults({ [name]: [] }).write()
  }

  get get() {
    return this._db.get(this._name).value()
  }

  add(item: any) {
    this._db
      .get(this._name)
      .push(item)
      .write()
  }
}