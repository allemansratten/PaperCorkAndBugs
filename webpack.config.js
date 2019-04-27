// const CleanWebpackPlugin = require('clean-webpack-plugin');
// const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './src/scripts/main.ts',
    plugins: [
        // new CleanWebpackPlugin(['public/build']),
        // new HtmlWebpackPlugin({
        //     template: 'src/templates/index.html'
        // }),
    ],
    output: {
        path: __dirname ,
        filename: 'build/[name].js'
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js']
    },
    module: {
        rules: [
            {test: /\.tsx?$/, loader: 'ts-loader'}
        ]
    }
};