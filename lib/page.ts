export { errorPage, page }

/**
 * Wrapper for template with a preformatted error message. The message is
 * understood to be a string, but could be HTML if needed
 *
 * @param  {string} message
 * @return {string}
 */
function errorPage(message:string):string {
    return page(
        'Website broken',
        `<pre class="error">${message}</pre><p>Sorry about that ¯\\_(ツ)_/¯</p><p><a href="/">&larr; Go back</a></p>`
    )
}

/**
 * Return a string with title and body injected (no sanitization, this is a
 * regular template literal. All strings are considered to be HTML.
 *
 * @param  {string} title
 * @param  {string} body
 * @return {string}
 */
function page(title:string, body:string):string {
    return `<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
    <meta http-equiv="x-ua-compatible" content="ie=edge">
    <title>Baked Data!</title>
    <style>
        body {
            font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen,Ubuntu,Cantarell,sans-serif;
        }
        main {
            margin-top: 2rem;
            padding: 1rem;
        }
        h1 {
            font-size: 1.25em;
            text-transform: uppercase;
            letter-spacing: 2px;
        }
        h1, p, pre {
            margin: 0 0 2rem;
        }
        pre {
            font-family: 'Menlo', monospace;
            padding: 0.5em;
            word-break: break-word;
            color: red;
            background: #f7f7f7;
            white-space: normal;
            font-size: 0.9375em;
        }
        a {
            color: black;
        }
        .button {
            text-decoration: none;
            padding: 0.5em 0.75em;
            background: #09f;
            border-radius: 0.25em;
            color: white;
        }
        .products {
            list-style: none;
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
            margin: 0;
            margin-left: -0.5rem;
            padding: 0;
        }
        .products li {
            flex: 1 0 12vw;
            height: 16rem;
            margin: 0 0.5rem 1rem 0.5rem;
            padding: 1rem;
            font-size: 2em;
            border-radius: 0.5rem;
        }
        .products li a {
            color: white;
        }
        .image {
            width: 30vw;
            height: 20vh;
        }
    </style>
</head>
<body>
    <main>
        <h1>${title}</h1>
        ${body}
    </main>
</body>
</html>`
}
