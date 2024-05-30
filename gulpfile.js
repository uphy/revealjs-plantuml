const {rollup} = require('rollup')
const terser = require('@rollup/plugin-terser')
const babel = require('@rollup/plugin-babel').default
const commonjs = require('@rollup/plugin-commonjs')
const resolve = require('@rollup/plugin-node-resolve').default

const gulp = require('gulp')

// Prevents warnings from opening too many test pages
process.setMaxListeners(20);

const babelConfig = {
    babelHelpers: 'bundled',
    ignore: ['node_modules'],
    compact: false,
    extensions: ['.js', '.html'],
    plugins: [
        'transform-html-import-to-string'
    ],
    presets: [[
        '@babel/preset-env',
        {
            corejs: 3,
            useBuiltIns: 'usage',
            modules: false
        }
    ]]
};

// Our ES module bundle only targets newer browsers with
// module support. Browsers are targeted explicitly instead
// of using the "esmodule: true" target since that leads to
// polyfilling older browsers and a larger bundle.
const babelConfigESM = JSON.parse( JSON.stringify( babelConfig ) );
babelConfigESM.presets[0][1].targets = { browsers: [
    'last 2 Chrome versions',
    'last 2 Safari versions',
    'last 2 iOS versions',
    'last 2 Firefox versions',
    'last 2 Edge versions',
] };

let cache = {};

// Creates a UMD and ES module bundle
gulp.task('build', () => {
    return Promise.all([
        { name: 'RevealPlantUML', input: 'src/index.js', output: 'dist/plantuml' },
    ].map( plugin => {
        return rollup({
                cache: cache[plugin.input],
                input: plugin.input,
                plugins: [
                    resolve(),
                    commonjs(),
                    babel({
                        ...babelConfig,
                        ignore: [/node_modules\/(?!(highlight\.js|marked)\/).*/],
                    }),
                    terser()
                ]
            }).then( bundle => {
                cache[plugin.input] = bundle.cache;
                bundle.write({
                    file: plugin.output + '.esm.js',
                    name: plugin.name,
                    format: 'es'
                })

                bundle.write({
                    file: plugin.output + '.js',
                    name: plugin.name,
                    format: 'umd'
                })
            });
    } ));
})
