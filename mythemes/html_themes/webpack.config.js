const HtmlWebpackPlugin = require('html-webpack-plugin');
const miniCssExtractPlugin = require('mini-css-extract-plugin')
const path = require('path');

module.exports = {
    mode:"production",
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
                        // loader: 'style-loader'、
                        loader:miniCssExtractPlugin.loader
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
            },
            {
                test: /\.(ico)$/,
                loader: 'url-loader',

            },
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
            inject: "head",
            favicon: 'src/assets/favicon.ico',
            minify: { 
                // removeComments: true, 
                collapseWhitespace: false 
            },
            cdn: {
                js:[
                    'https://cdnjs.cloudflare.com/ajax/libs/axios/0.27.2/axios.min.js',
                    'https://cdn.jsdelivr.net/npm/bootstrap@5.2.1/dist/js/bootstrap.bundle.min.js',
                    'https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.21/lodash.core.min.js',
                    'https://cdn.jsdelivr.net/npm/web3@latest/dist/web3.min.js',
                    'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.1/jquery.min.js'
                ],
            }
        }), 
        new HtmlWebpackPlugin({ 
            inject: false,
            filename: 'test.html',
            template: 'src/template/test.html'
        }),
        new miniCssExtractPlugin(),
        new HtmlWebpackPlugin({
            filename: 'tools.html',
            template: 'src/template/tools.html'
        })
    ],
    externals:{
        axios: 'axios',
        bootstrap:'bootstrap',
        _:'lodash',
        web3:'web3',
        $:'jquery'
    }
};