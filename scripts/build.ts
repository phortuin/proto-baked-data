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
migrate(['names', 'products'])
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

    const colors = [ '#09f', '#f90', '#90f', '#080' ]
    const adverbs = [ 'great', 'tall', 'broad', 'fine' ]
    const nouns1 = [ 'crocodile', 'overlord', 'giant', 'robot' ]
    const nouns2 = [ 'tail', 'feast', 'river', 'ornithopter' ]

    function random(range):number {
        return Math.floor((Math.random() * range));
    }

    function makeName():string {
        return `${adverbs[random(4)]}-${nouns1[random(4)]}-${nouns2[random(4)]}`
    }

    let products = []

    for (let i = 0; i < 10000; i++) {
        const product = {
            name: makeName(),
            color: colors[random(4)],
            price: random(10) + 1,
        }
        products.push(product)
    }

    await seedTable('products', products)
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
