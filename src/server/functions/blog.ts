// NPM
import { Handler } from "@netlify/functions";

// Local
import { prepare, getAll, getOne } from '../../../lib/db-instance'
import { page, errorPage } from '../../../lib/page'

const handler: Handler = async (event, context) => {
    try {
        const slug = getSlug(event.path)
        const allpages = getAll('SELECT name FROM names')
        const record = getOne('SELECT * FROM names WHERE name = ?', slug)
        return {
            statusCode: 200,
            body: page(record.name, getBody(allpages, record))
        }
    } catch(error) {
        console.error(error)
        return {
            statusCode: 500,
            body: errorPage(error)
        }
    }
}

function getSlug(path:string): string {
    return path.split('/').pop()
}

function getBody(allpages:Array<any>, record:NamesRecord) {
    const list = allpages.map(page => {
        return `<li><a href="/blog/${page.name}">${page.name}</a></li>`
    }).join('')
    return `<p>${record.body}</p><ul>${list}</ul>`
}

export { handler }
