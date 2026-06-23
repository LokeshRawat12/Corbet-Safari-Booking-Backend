import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'

import config from '../config/default.js'

const adapter = new JSONFile(config.dbFile)
const db = new Low(adapter, { zones: [], bookings: [] })

export async function initDb() {
  await db.read()
  db.data ||= { zones: [], bookings: [] }
  await db.write()
  return db
}

export default db
