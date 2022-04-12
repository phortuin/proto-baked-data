# proto-baked-data

> Prototype for exploring the baked data architectural pattern

Based on [this blogpost](https://simonwillison.net/2021/Jul/28/baked-data/).

## Development

```bash
$ npm run ci
$ npm run dev
```

### Production

Runs and builds on Netlify.

### Tech

- Written with TypeScript
- Uses Airtable as data source
- Uses SQLite database for ‘baked data’
- During build, data from Airtable is stored in sqlite database that is available during runtime



