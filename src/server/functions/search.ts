// NPM
import { Handler } from "@netlify/functions";

// Local
import { getAll, getOne } from '../../../lib/db-instance'
import { page, errorPage } from '../../../lib/page'

const handler: Handler = async (event, context) => {
    try {
        if (event.queryStringParameters && event.queryStringParameters.q) {
            const query = event.queryStringParameters.q
            // moet natuurlijkmeer dan 1 result kunnen geven
            const foundpages = getAll('SELECT * FROM names WHERE body LIKE ?', `%${query}%`)
            if (foundpages) {
                return {
                    statusCode: 200,
                    body: page(`Search results for ‘${query}’`, getBody(foundpages, query))
                }
            } else {
                return {
                    statusCode: 200,
                    headers: {
                        'content-type': 'text/html'
                    },
                    body: page(`Search results for ‘${query}’`, 'Nothing found')
                }
            }
        } else {
            return {
                statusCode: 400,
                body: errorPage('Missing query')
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

function getBody(pages:any, query:string): string {
    const regex = new RegExp(`(${query})`, 'gi')
    const pageItems = pages.map(page => {
        return `<li><a href="/blog/${ page.name }">${ page.name }</a><br/>${ page.body.replace(regex, `<mark>$1</mark>`) }</li>`
    }).join('')
    return `<ul>${ pageItems }</ul>`
}

export { handler }

