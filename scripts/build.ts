#!/usr/bin/env node

// NPM
import dotenv from 'dotenv-safe'
import Airtable from 'airtable'

// Local
import { NamesRecord, seedTable, migrate } from '../lib/db-instance'

// Init env vars
dotenv.config()

// Config
const AIRTABLE_TABLE:string = 'Table 1'

// $RUN
migrate()
    .then(() => seed())
    .catch(console.error)

/**
 * Seed database with Airtable records we retrieved
 *
 * @return {Promise<void>}
 */
async function seed(): Promise<void> {
    const records = await getRecords(AIRTABLE_TABLE)
    const parsedRecords = records.map((record) => ({
        name: record.get('Name'),
        body: record.get('body'),
    }))
    await seedTable('names', <NamesRecord[]>parsedRecords)
}

/**
 * Get all records for an Airtable table
 *
 * @param {string} tableName
 * @return {Promise<Airtable.Records>}
 */
function getRecords(tableName:string): Promise<Airtable.Records<Airtable.FieldSet>> {
    const airtableBase = Airtable.base(process.env.AIRTABLE_BASE)
    return airtableBase(tableName).select().all()
}
