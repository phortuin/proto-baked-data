#!/usr/bin/env node

// Core
import { readFile } from 'fs/promises'

// NPM
import dotenv from 'dotenv-safe'
import Airtable from 'airtable'
import DatabaseConstructor, {
    Database,
    Options as dbOptions,
} from 'better-sqlite3'

// Init env vars
dotenv.config()

// Config
const DB_FILENAME:string = './data/content.sqlite3'
const DB_DEFAULTS:dbOptions = {
    verbose: process.env.NODE_ENV === 'development' ? console.log : null,
}
const AIRTABLE_TABLE:string = 'Table 1'

// Types
type NamesRecord = {
    name: string,
    body: string,
}

// Shared instances
let airtableBase:Airtable.Base
let db:Database

// $RUN
migrate()
    .then(() => seed())
    .catch(console.error)

/**
 * Migrate: drop and create tables in our database
 */
async function migrate(): Promise<void> {
    if (!db) initDb()
    try {
        const sql = await getSQLStatement('names', 'migrate')
        db.exec(sql)
    } catch(error) {
        console.error(error)
        process.exitCode = 1
    }
}

/**
 * Seed database with Airtable records we retrieved
 *
 * @return {Promise<void>}
 */
async function seed(): Promise<void> {
    if (!db) initDb()
    const records = await getRecords(AIRTABLE_TABLE)
    const parsedRecords = records.map((record) => ({
        name: record.get('Name'),
        body: record.get('body'),
    }))
    await seedTable('names', <NamesRecord[]>parsedRecords)
}

/**
 * Initialise SQLite Database
 */
function initDb(dbParams:dbOptions = {}): void {
    if (db) return
    const options = Object.assign({}, DB_DEFAULTS, dbParams)
    db = new DatabaseConstructor(DB_FILENAME, options)
}

/**
 * Initialise Airtable connection
 */
function initAirtable(): void {
    if (airtableBase) return
    airtableBase = Airtable.base(process.env.AIRTABLE_BASE)
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
 * Get all records for an Airtable table
 *
 * @param {string} tableName
 * @return {Promise<Airtable.Records>}
 */
function getRecords(tableName:string): Promise<Airtable.Records<Airtable.FieldSet>> {
    if (!airtableBase) initAirtable()
    return airtableBase(tableName).select().all()
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
