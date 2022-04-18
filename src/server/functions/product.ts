// NPM
import { Handler } from "@netlify/functions";

// Local
import { getAll, getOne } from '../../../lib/db-instance'
import { page, errorPage } from '../../../lib/page'
import { getSlug } from '../../../lib/get-slug'

const handler: Handler = async (event, context) => {
    try {
        const slug = getSlug(event.path)
        if (slug !== 'products') {
            const product = getOne('SELECT * FROM products WHERE name = ?', slug)
            return {
                statusCode: 200,
                body: page(product.name, getProduct(product))
            }
        } else {
            let offset = 0
            const pageSize = 48
            if (event.queryStringParameters && event.queryStringParameters.page) {
                offset = Number(event.queryStringParameters.page) - 1
            }
            const allproducts = getAll(`SELECT * FROM products LIMIT ${offset * pageSize},${(offset + 1) * pageSize}`)
            return {
                statusCode: 200,
                body: page(`Products (page ${offset + 1}/${Math.ceil(10000/pageSize)})`, getOverview(allproducts))
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

function getOverview(allproducts:Array<any>):string {
    const list = allproducts.map(product => {
        return `<li style="background-color: ${product.color}"><a href="/product/${product.name}">${product.name} €${product.price}.00</a></li>`
    }).join('')
    return `<ul class="products">${list}</ul>`
}

function getProduct(product:any):string {
    return `<div class="image" style="background-color: ${product.color}"></div><h2>Now only €${product.price}</h2><button class="buy">Buy now!</button>`
}

export { handler }
