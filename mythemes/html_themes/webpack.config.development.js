const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
    mode:"development",
    entry: './src/index.js',
    module: {
        rules: [
        //   {
        //     test: /\.html$/,
        //     loader: 'html-loader'
        //   }
            {
                test: /\.(scss)$/,
                use: [
                    {
                        loader: 'style-loader'
                    },
                    {
                        loader: 'css-loader'
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            postcssOptions: {
                                plugins: () => [
                                    require('autoprefixer')
                                ]
                            }
                        }
                    },
                    {
                        loader: 'sass-loader'
                    }
                ]
            }
        ],
    },
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: 'index_bundle.js',
    },
    devServer: {
        static: {
            directory: path.join(__dirname, 'dist'),
        },
        compress: true,
        port: 9000,
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'src/template/index.html',
            favicon: 'src/assets/favicon.ico',
        }),
        new HtmlWebpackPlugin({ 
            inject: false,
            filename: 'test.html',
            template: 'src/template/test.html'
        }),
        new HtmlWebpackPlugin({
            filename: 'tools.html',
            template: 'src/template/tools.html'
        })
    ],
};