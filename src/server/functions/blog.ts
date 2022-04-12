// NPM
import { Handler } from "@netlify/functions";
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
    body?: string,
}

// Shared instances
let db:Database

/**
 * Initialise SQLite Database
 */
 function initDb(dbParams:dbOptions = {}): void {
    if (db) return
    const options = Object.assign({}, DB_DEFAULTS, dbParams)
    db = new DatabaseConstructor(DB_FILENAME, options)
}

const handler: Handler = async (event, context) => {
    if (!db) initDb()
    try {
        const slug = getSlug(event.path)
        const allpages = db.prepare('SELECT name FROM names').all()
        const record = db.prepare('SELECT * FROM names WHERE name = ?').get(slug)
        return {
            statusCode: 200,
            body: getBody(allpages, record)
        }
    } catch(error) {
        console.error(error)
        return {
            statusCode: 500,
            body: ':('
        }
    }
};

function getSlug(path:string): string {
    return path.split('/').pop()
}

function getBody(allpages:Array<any>, record:NamesRecord) {
    const list = allpages.map(page => {
        return `<li><a href="/blog/${page.name}">${page.name}</a></li>`
    }).join('')
    return `<h1>${record.name}</h1><p>${record.body}</p><ul>${list}</ul>`
}

export { handler };
