#!/usr/bin/env node

// NPM
import dotenv from 'dotenv-safe'
import Airtable from 'airtable'
import { Directus, ID, PartialItem } from '@directus/sdk'
import slugify from 'slugify'

// Local
import { BlogRecord, ProductRecord, seedTable, migrate } from '../lib/db-instance'

// Init env vars
dotenv.config()

// Typings
type BlogPost = {
    id: ID;
    title: string;
    body: string;
    date_created: string;
    date_updated: string;
}

type Collections = {
    blogs: BlogPost;
}

// $RUN
migrate(['blogs', 'products'])
    .then(() => seed())
    .catch(console.error)

/**
 * Seed database with Airtable records we retrieved
 *
 * @return {Promise<void>}
 */
async function seed(): Promise<void> {
    const records = await getDirectusBlogs()
    await seedTable('blogs', <BlogRecord[]>records)

    const products = generateProducts(10000)
    await seedTable('products', <ProductRecord[]>products)
}

/**
 * Generates a number of products to be stored in a database
 *
 * @param {number} amount
 * @return {array} ProductRecord[]
 */
function generateProducts(amount: number): ProductRecord[] {
    const colors = [ '#09f', '#f90', '#90f', '#080' ]
    const adverbs = [ 'great', 'tall', 'broad', 'fine', 'giant', 'awesome', 'typical' ]
    const nouns1 = [ 'crocodile', 'overlord', 'dwarven', 'robot', 'ragdoll', 'ornithopter' ]
    const nouns2 = [ 'meetup', 'feast', 'presence', 'happening', 'party', 'gathering', 'adventure' ]

    function random(range):number {
        return Math.floor((Math.random() * range));
    }

    function makeName():string {
        return `${adverbs[random(adverbs.length)]}-${nouns1[random(nouns1.length)]}-${nouns2[random(nouns2.length)]}`
    }

    let products = []

    for (let i = 0; i < amount; i++) {
        const product = {
            name: makeName(),
            color: colors[random(4)],
            price: random(10) + 1,
        }
        products.push(product)
    }

    return products
}

/**
 * Helper to get blog posts from Directus database
 *
 * @return {Promise<BlogRecord[]}
 */
async function getDirectusBlogs():Promise<BlogRecord[]> {
    const blogs = await getBlogsFromDirectus()
    return blogs.map((blog) => ({
        title: blog.title,
        body: blog.body,
        slug: slugify(blog.title, { lower: true }),
    }))
}

/**
 * Helper to get blog posts from Airtable database
 *
 * @return {Promise<BlogRecord[]}
 */
async function getAirtableBlogs():Promise<BlogRecord[]> {
    const blogs = await getBlogsFromAirtable()
    return <BlogRecord[]>blogs.map((blog) => ({
        title: blog.get('title'),
        body: blog.get('body'),
        slug: slugify(blog.get('title').toString(), { lower: true }),
    }))
}

/**
 * Get all records from Airtable blogs table
 *
 * @return {Promise<Airtable.Records>}
 */
function getBlogsFromAirtable(): Promise<Airtable.Records<Airtable.FieldSet>> {
    const tableName = 'Blogs'
    const airtableBase = Airtable.base(process.env.AIRTABLE_BASE)
    return airtableBase(tableName).select().all()
}

/**
 * Get all records from Directus blogs collection
 *
 * @return {Promise<PartialItem<BlogPost[]>>}
 */
async function getBlogsFromDirectus(): Promise<PartialItem<BlogPost[]>> {
    const options = {
        auth: {
            staticToken: process.env.DIRECTUS_TOKEN
        }
    }
    const directus = new Directus<Collections>(`https://${process.env.DIRECTUS_KEY}.directus.app/`, options)

    const items = await directus.items('blogs').readByQuery()
    return items.data
}
