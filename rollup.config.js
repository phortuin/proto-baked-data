import svelte from 'rollup-plugin-svelte'
import resolve from '@rollup/plugin-node-resolve'
import serve from 'rollup-plugin-serve'
import livereload from 'rollup-plugin-livereload'

const isProduction = process.env.NODE_ENV === 'production'

export default {
    input: 'src/client/index.js',
    output: {
        sourcemap: true,
        format: 'iife',
        name: 'app',
        file: 'dist/bundle.js',
    },
    plugins: [
        svelte(),
        resolve(),
        !isProduction && (serve('dist')),
        !isProduction && (livereload('dist')),
    ],
}
