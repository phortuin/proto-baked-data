// Core
import { readFile } from 'fs/promises'

// NPM
import DatabaseConstructor, {
    Database,
    Options as dbOptions,
} from 'better-sqlite3'

// Config
const DB_FILENAME:string = './data/content.sqlite3'
const DB_DEFAULTS:dbOptions = {
    verbose: process.env.NODE_ENV === 'development' ? console.log : null,
}

// Types
type NamesRecord = {
    name: string,
    body: string,
}

// API
export {
    NamesRecord,
    migrate,
    seedTable,
    getOne,
    getAll,
}

// Shared instance
let db:Database

/**
 * Initialise SQLite Database
 */
function initDb(dbParams:dbOptions = {}): void {
    if (db) return
    const options = Object.assign({}, DB_DEFAULTS, dbParams)
    db = new DatabaseConstructor(DB_FILENAME, options)
}

/**
 * Migrate: drop and create tables in our database
 *
 * @param {array} tables
 */
async function migrate(tables:Array<string>): Promise<void> {
    if (!db) initDb()
    try {
        tables.forEach(async (table) => {
            const sql = await getSQLStatement(table, 'migrate')
            db.exec(sql)
        })
    } catch(error) {
        console.error(error)
        process.exitCode = 1
    }
}

/**
 * Read SQL statement from disk file
 *
 * @param  {string} table
 * @param  {string} name
 *
 * @return {Promise<string>}
 */
async function getSQLStatement(table:string, name:string): Promise<string> {
    return await readFile(`./sql/${table}/${name}.sql`, 'utf8')
}

/**
 * Seed a table with records
 * Records is an array of objects where the key/value pairs correspond to
 * the columns in that table
 *
 * @param {string} tableName
 * @param {Array} records
 */
async function seedTable<T>(tableName:string, records:T[]): Promise<void> {
    const sql = await getSQLStatement(tableName, 'insert')
    runInsertTransaction<T>(sql, records)
}

/**
 * Run transaction for table insert
 * db.transaction returns a function that we immediately invoke with the
 * records argument
 *
 * @param {string} sql query for prepared statement
 * @param {Array} records
 */
function runInsertTransaction<T>(sql:string, records:T[]): void {
    const insert = db.prepare(sql)
    return db.transaction((records) => {
        for (const record of records) {
            insert.run(record)
        }
    })(records)
}

/**
 * Run prepared sql statement, returning a single record as an object. The param
 * parameter is used as interpolation value, like this:
 *
 * SELECT * FROM table WHERE id = ?
 * ...where ? will be substituted with the param value
 *
 * @param  {string} sql
 * @param  {string} param
 *
 * @return {Object}
 */
function getOne(sql:string, param:string):any {
    if (!db) initDb()
    return db.prepare(sql).get(param)
}

/**
 * Run prepared sql statement, returning array with all resulting records. The
 * param is used as in getOne
 *
 * @param {string} sql
 * @param {string} param
 *
 * @return {Array} list of records as objects
 */
function getAll(sql:string, param?:string):any[] {
    if (!db) initDb()
    return param
        ? db.prepare(sql).all(param)
        : db.prepare(sql).all()
}
