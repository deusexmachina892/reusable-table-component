const express = require('express');
const path = require('path');

const app = express();

const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV === 'development') {
    const webpack = require('webpack');
    const config = require('./webpack.config');
    const compiler = webpack(config);
    const history = require('connect-history-api-fallback');

    app.use(history());
     /**
     * Use webpack-dev-middleware, which facilitates creating a bundle.js in memory and updating it automatically
     * based on changed files
     */
    app.use(require('webpack-dev-middleware')(compiler, {
        /**
         * @noInfo Only display warnings and errors to the concsole
         */
        noInfo: true,
        publicPath: '/',
        stats: {
            assets: false,
            colors: true,
            version: false,
            hash: false,
            timings: false,
            chunks: false,
            chunkModules: false
        }
    }));

    /**
     * Hot middleware allows the page to reload automatically while we are working on it
     * Can be used instead of react-hot-middleware if Redux is being used to manage app state
     */
    app.use(require('webpack-hot-middleware')(compiler));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'public', 'index.html'))
    })

} else {
    app.use(express.static(path.resolve(__dirname, 'dist')));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'dist', 'index.html'))
    })
}

app.listen(PORT, () => {
    console.log(`Server bound to ${PORT}`)
})