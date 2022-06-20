// NPM
import { Handler, HandlerEvent, HandlerResponse } from "@netlify/functions";

// Local
import { ProductRecord, getAll, getOne } from '../../../lib/db-instance'
import { page, errorPage } from '../../../lib/page'
import { getSlug } from '../../../lib/get-slug'

/**
 * Handle request
 *
 * @return {Promise<HandlerResponse>}
 */
const handler: Handler = async (event, context):Promise<HandlerResponse> => {
    try {
        const slug = getSlug(event.path)
        if (slug !== 'products') {
            return singleResult(slug, event.headers)
        } else {
            const query = event.queryStringParameters && event.queryStringParameters.q
            const pageNumber = event.queryStringParameters && event.queryStringParameters.page
            return results(query, pageNumber, event.headers)
        }
    } catch(error) {
        console.error(error)
        return respond(errorPage(error), 500, event.headers)
    }
}

/**
 * Create a Netlify function response. The accept header is used to pass a
 * proper content type header
 *
 * @param {string} body
 * @param {number} statusCode
 * @param {string | undefined} accept
 *
 * @return {object}
 */
function respond(body:string, statusCode:number, headers:HandlerEvent['headers']):HandlerResponse {
    return {
        statusCode,
        headers: {
            'content-type': (headers.accept === 'application/json')
                ? 'application/json'
                : 'text/html',
        },
        body,
    }
}

/**
 * Return a single result for a 'detail page'
 *
 * @param  {string} slug
 * @param  {HandlerEvent.headers} headers
 * @return {HandlerResponse}
 */
function singleResult(slug:string, headers:HandlerEvent['headers']):HandlerResponse {
    const product = getOne('SELECT * FROM products WHERE name = ?', slug)
    return respond(page(product.name, getProductHtml(product)), 200, headers)
}

/**
 * Get products, optionally filtered with a query and/or paginated
 *
 * @param  {string} query
 * @param  {number} pageNumber
 * @param  {HandlerEvent.headers} headers
 * @return {HandlerResponse}
 */
function results(query:any, pageNumber:any, headers:HandlerEvent['headers']):HandlerResponse {
    const pageSize = 48
    const offset = (pageNumber)
        ? Number(pageNumber) - 1
        : 0
    const select = `SELECT * FROM products `
    const limit = `LIMIT ${offset * pageSize},${(offset + 1) * pageSize}`
    const products = (query)
        ? getAll(`${select} WHERE name LIKE ? ${limit}`, `%${query}%`)
        : getAll(`${select} ${limit}`)
    const body = (headers.accept === 'application/json')
        ? JSON.stringify(products)
        : page(`Products (page ${offset + 1}/${Math.ceil(10000/pageSize)})`, getOverviewHtml(products))

    return respond(body, 200, headers)
}

/**
 * Get html for products overview
 *
 * @param  {Array<any>} products
 * @return {string}
 */
function getOverviewHtml(products:Array<any>):string {
    const list = products.map(product => {
        return `<li style="background-color: ${product.color}"><a href="/product/${product.name}">${product.name} €${product.price}.00</a></li>`
    }).join('')
    return `<ul class="products">${list}</ul>`
}

/**
 * Get html for single product page
 *
 * @param  {any} product
 * @return {string}
 */
function getProductHtml(product:ProductRecord):string {
    return `<div class="image" style="background-color: ${product.color}"></div><h2>Now only €${product.price}</h2><button class="buy">Buy now!</button>`
}

export { handler }
