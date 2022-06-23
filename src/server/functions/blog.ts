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
        if (slug !== 'blog') {
            const allpages = getAll('SELECT slug, title FROM blogs')
            const record = getOne('SELECT * FROM blogs WHERE slug = ?', slug)
            return {
                statusCode: 200,
                body: page(record.title, getBody(allpages, record))
            }
        } else {
            const allpages = getAll('SELECT slug, title FROM blogs')
            return {
                statusCode: 200,
                body: page('All blogs', getBody(allpages))
            }
        }
    } catch(error) {
        console.error(error)
        return {
            statusCode: 500,
            body: errorPage(error)
        }
    }
}

function getBody(allpages:Array<any>, record?:BlogRecord):string {
    const search = `<form method=get action=/search>Search: <input type=text id=search name=q> <button>Go</button></form>`
    const list = allpages.map(page => {
        return `<li><a href="/blog/${page.slug}">${page.title}</a></li>`
    }).join('')
    let body = ''
    if (record) body = `<p>${marked.parse(record.body)}</p><h2><hr>Moar readings!</h2>`
    return `${body}<ul>${list}<li><a href="/blog">&larr; See all blogs</a></li></ul><hr>${search}`
}

export { handler }
