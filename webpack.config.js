var webpack = require('webpack')
var path = require('path')

const UglifyJSPlugin = require('uglifyjs-webpack-plugin')

module.exports = {
    entry: path.resolve(__dirname, 'src/main.js'),
    output: {
        path: path.join(__dirname, '/build'),
        filename: "bundle.js",
        library: "whh",
        libraryTarget: "umd"
    },
    plugins: [
        new UglifyJSPlugin()
    ]
};