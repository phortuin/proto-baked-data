// NPM
import { Handler } from "@netlify/functions";

// Local
import { getAll, getOne } from '../../../lib/db-instance'
import { page, errorPage } from '../../../lib/page'
import { getSlug } from '../../../lib/get-slug'

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

function getBody(allpages:Array<any>, record:NamesRecord):string {
    const form = `<form method=get action=/search><label for=search>Search!</label><input type=text id=search name=q><button>Go</button></form>`
    const list = allpages.map(page => {
        return `<li><a href="/blog/${page.name}">${page.name}</a></li>`
    }).join('')
    return `${form}<p>${record.body}</p><ul>${list}</ul>`
}

export { handler }
