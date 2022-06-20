// NPM
import { Handler } from "@netlify/functions"
import { marked } from 'marked'

// Local
import { BlogRecord, getAll, getOne } from '../../../lib/db-instance'
import { page, errorPage } from '../../../lib/page'
import { getSlug } from '../../../lib/get-slug'

const handler: Handler = async (event, context) => {
    try {
        const slug = getSlug(event.path)
        const allpages = getAll('SELECT slug, title FROM blogs')
        const record = getOne('SELECT * FROM blogs WHERE slug = ?', slug)
        return {
            statusCode: 200,
            body: page(record.title, getBody(allpages, record))
        }
    } catch(error) {
        console.error(error)
        return {
            statusCode: 500,
            body: errorPage(error)
        }
    }
}

function getBody(allpages:Array<any>, record:BlogRecord):string {
    const form = `<form method=get action=/search><label for=search>Search!</label><input type=text id=search name=q><button>Go</button></form>`
    const list = allpages.map(page => {
        return `<li><a href="/blog/${page.slug}">${page.title}</a></li>`
    }).join('')
    return `${form}<p>${marked.parse(record.body)}</p><ul>${list}</ul>`
}

export { handler }
