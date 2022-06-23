# proto-baked-data

> Prototype for exploring the baked data architectural pattern

Based on [this blogpost](https://simonwillison.net/2021/Jul/28/baked-data/).

## Development

```bash
$ npm ci
$ npm start
```

### Production

Runs and builds on Netlify.

### Tech

- Written with TypeScript
- Uses Directus as data source for blogs
- Uses SQLite database for ‘baked data’
- During build, 10.000 generated 'products' along with data from Airtable is stored in sqlite database that is available during runtime
