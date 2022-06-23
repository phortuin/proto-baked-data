// NPM
import { Handler } from "@netlify/functions"

// Local
import { page, errorPage } from '../../../lib/page'

const handler: Handler = async (event, context) => {
    return {
        statusCode: 200,
        body: page('Do it.', '<div role=app></div>')
    }
}

export { handler }
