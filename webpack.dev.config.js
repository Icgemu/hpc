const path = require('path');
const webpack = require('webpack');

const HtmlwebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const config = {
    resolve: {
      extensions: ['', '.js', '.jsx'],
      alias: {
        "rsuite-table":path.resolve(__dirname,"./src/lib/table/"),
        "dom-lib":path.resolve(__dirname,"./src/lib/dom-lib/lib/"),
        "rsuite-datepicker":path.resolve(__dirname,"./src/lib/datepicker/"),
        "rsuite-picker":path.resolve(__dirname,"./src/lib/picker/"),
        "rsuite-echarts":path.resolve(__dirname,"./src/lib/echarts/"),
        "rsuite":path.resolve(__dirname,"./src/lib/rsuite/src/")
      }
    },
    entry: [
      'babel-polyfill',
      //'webpack-dev-server/client?http://0.0.0.0:3000',
    //   'webpack/hot/dev-server',
      path.join(__dirname, 'src/components/index/index')
    ],
    output: {
        publicPath: '',
        path: path.resolve(__dirname, 'build'),
        filename: 'bundle.js',
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
        }),
        new ExtractTextPlugin('[name].css'),
        new webpack.HotModuleReplacementPlugin(),
        new HtmlwebpackPlugin({
            title: 'gaei-ui dev',
            filename: 'index.html',
            template: 'html-withimg-loader!src/components/index/index.html',
            inject: true,
            hash: true
        }),
    ],
    // devtool: 'source-map',
    module: {
        loaders: [
            {
                test: /\.(jsx|js)$/,
                loaders: [
                    //'react-hot',
                    'es3ify-loader',
                    'babel?babelrc'
                ],
                exclude: /node_modules/
            }, {
                test: /\.less$/,
                loader: ExtractTextPlugin.extract('style-loader','css-loader!postcss-loader!less-loader')
            },
            {
                test: /\.scss$/,
                loader: ExtractTextPlugin
                .extract('style','css?modules&localIdentName=[name]__[local]___[hash:base64:5]!resolve-url-loader!postcss-loader!sass-loader')
            },
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract('style-loader','css-loader!postcss-loader')
            },
            {
                test: /\.(png|jpg|gif)$/,
                loader: 'url?limit=8192&name=./img/[hash].[ext]',
            },
            {
               test: /\.(woff|svg|eot|ttf)\??.*$/,
               loader: "file-loader?&name=./font/[hash].[ext]"
           },
           {
                test: /\.md$/,
                loader: 'html!markdown'
            }
        ]
    },
    postcss: function () {
        return [require('autoprefixer'), require('precss')];
    }
};


module.exports = config;
