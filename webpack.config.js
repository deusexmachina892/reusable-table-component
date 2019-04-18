const webpack = require('webpack');
const path = require('path');
const htmlWebPackPlugin = require('html-webpack-plugin');
const cleanWebPackPlugin = require('clean-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const safePostCssParser = require('postcss-safe-parser');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const CompressionPlugin = require('compression-webpack-plugin');
const BrotliPlugin = require('brotli-webpack-plugin');


const APP_DIR  = path.resolve(__dirname, 'src', 'index.jsx');
const BUILD_DIR = path.join(__dirname, 'dist');


let plugins = [
    new htmlWebPackPlugin({
        template: path.join(__dirname, 'public', 'index.html')
    }),
    new cleanWebPackPlugin(),
   
   // new webpack.optimize.ModuleConcatenationPlugin(),
  
];

if(process.env.NODE_ENV === 'production'){
    plugins.push(
        new webpack.HashedModuleIdsPlugin(),
        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            filename: 'static/css/[name].[contenthash:8].css',
            chunkFilename: 'static/css/[name].[contenthash:8].chunk.css',
          }),
          new CompressionPlugin({
            filename: '[path].gz[query]',
            algorithm: 'gzip',
            test: /\.js$|\.css$|\.html$/,
            threshold: 10240,
            minRatio: 0.7
            }),
            new BrotliPlugin({
            asset: '[path].br[query]',
            test: /\.js$|\.css$|\.html$/,
            threshold: 10240,
            minRatio: 0.7
            })
    )
} else {
    plugins.push(
        new webpack.HotModuleReplacementPlugin(),
        // new BundleAnalyzerPlugin()
    )
}

  // common function to get style loaders
  const getStyleLoaders = (cssOptions, preProcessor) => {
    const loaders = [
      process.env.NODE_ENV === 'development' && require.resolve('style-loader'),
     process.env.NODE_ENV === 'production' && {
        loader: MiniCssExtractPlugin.loader,
        options: Object.assign(
          {}
        ),
      },
      {
        loader: require.resolve('css-loader'),
        options: cssOptions,
      },
      {
        // Options for PostCSS as we reference these options twice
        // Adds vendor prefixing based on your specified browser support in
        // package.json
        loader: require.resolve('postcss-loader'),
        options: {
          // Necessary for external CSS imports to work
          ident: 'postcss',
          plugins: () => [
            require('postcss-flexbugs-fixes'),
            require('postcss-preset-env')({
              autoprefixer: {
                flexbox: 'no-2009',
              },
              stage: 3,
            }),
          ],
          sourceMap: process.env.NODE_ENV === 'production' ? false : true,
        },
      },
    ].filter(Boolean);
    if (preProcessor) {
      loaders.push({
        loader: require.resolve(preProcessor),
        options: {
          sourceMap: process.env.NODE_ENV === 'production' ? false : true,
        },
      });
    }
    return loaders;
  };
module.exports =  {
    mode: process.env.NODE_ENV,
    devtool: 'source-map',
    entry: process.env.NODE_ENV === 'production'?
        APP_DIR:
        [
        'webpack-hot-middleware/client?reload=true',
            APP_DIR
        ],
    output: {
        path: BUILD_DIR,
        filename: process.env.NODE_ENV === 'production'?'[name].[contenthash:8].js':'[name].[hash].js',
        chunkFilename: '[name].[contenthash:8].js',
        publicPath: '/'
    },
    resolve:{
        extensions: [".js", ".jsx", ".json"]
    },
    module: {
        rules: [
            { 
                test: /\.jsx?$/, 
                loader: "babel-loader"
            },
            {
                test: /\.css$/,
                exclude: /\.module\.css$/,
                use: getStyleLoaders({
                  importLoaders: 1,
                  sourceMap: process.env.NODE_ENV==='production'?false:true,
                }),
                // Don't consider CSS imports dead code even if the
                // containing package claims to have no side effects.
                // Remove this when webpack adds a warning or an error for this.
                // See https://github.com/webpack/webpack/issues/6571
                sideEffects: true,
              },
              // 
            {
                test: /\.(a?png|woff|woff2|gif|eot|ttf|svg|jpe?g)$/,
                loader: 'file-loader',
                query:{
                    outputPath: './img/',
                    name: '[name].[ext]?[hash]'
                }
            }
        ]
    },
    // optimization
    optimization: {
        splitChunks: {
            chunks: 'all',
        cacheGroups: {
            default: false,
            vendors: false,
            // vendor chunk
            vendor: {
            name: 'vendor',
            // sync + async chunks
            chunks: 'all',
            // import file path containing node_modules
            test: /[\\/]node_modules[\\/]/
            }
          }
        },
        runtimeChunk: true,
        minimize: process.env.NODE_ENV === 'production',
      minimizer: [
        // This is only used in production mode
        new TerserPlugin({
          terserOptions: {
            parse: {
              // we want terser to parse ecma 8 code. However, we don't want it
              // to apply any minfication steps that turns valid ecma 5 code
              // into invalid ecma 5 code. This is why the 'compress' and 'output'
              // sections only apply transformations that are ecma 5 safe
              ecma: 8,
            },
            compress: {
              ecma: 5,
              warnings: false,
              // Disabled because of an issue with Uglify breaking seemingly valid code:
              comparisons: false,
              inline: 2,
            },
            mangle: {
              safari10: true,
            },
            output: {
              ecma: 5,
              comments: false,
              ascii_only: true,
            },
          },
          // Use multi-process parallel running to improve the build speed
          // Default number of concurrent runs: os.cpus().length - 1
          parallel: true,
          // Enable file caching
          cache: true,
          sourceMap: false,
        }),
        // This is only used in production mode
        new OptimizeCSSAssetsPlugin({
          cssProcessorOptions: {
            parser: safePostCssParser,
            map: false
              ? {
                  // `inline: false` forces the sourcemap to be output into a
                  // separate file
                  inline: false,
                  // `annotation: true` appends the sourceMappingURL to the end of
                  // the css file, helping the browser find the sourcemap
                  annotation: true,
                }
              : false,
          },
        }),
      ],
    },
    plugins: plugins
   
}

