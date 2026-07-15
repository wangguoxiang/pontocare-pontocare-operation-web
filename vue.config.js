const { defineConfig } = require('@vue/cli-service');
const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Timestamp = new Date().getTime();

console.log(`@@@@@@@`, process.env.NODE_ENV);

module.exports = defineConfig({
  publicPath: '/',
  configureWebpack: {
    devtool: process.env.NODE_ENV === 'development' ? 'source-map' : false,
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src')
      },
      fallback: {}
    },
    optimization: {
      splitChunks: {
        chunks: 'all' // 只将异步加载的模块拆分为独立的块 减小首次加载的文件大小
      },
      minimizer:
				process.env.NODE_ENV === 'production'
				  ? [
				    new TerserPlugin({
				      // js代码压缩
				      parallel: true, // 使用多进程并发运行以提高构建速度
				      terserOptions: {
				        compress: {
				          drop_console: true,
				          drop_debugger: true
				        },
				        output: {
				          comments: false
				        },
				        sourceMap: true // Must be set to true if using source-maps in production
				      }
				    }),
				    new CssMinimizerPlugin({
				      // css代码压缩
				      minimizerOptions: {
				        preset: [
				          'default',
				          {
				            discardComments: { removeAll: true }
				          }
				        ]
				      }
				    }),
				    new MiniCssExtractPlugin({
				      // 修改打包后css文件名
				      filename: `css/[name].${Timestamp}.css`,
				      chunkFilename: `css/[name].${Timestamp}.css`
				    })
				    // new BundleAnalyzerPlugin(),
					  ]
				  : []
    },
    output: {
      filename: `js/[name].${Timestamp}.js`,
      chunkFilename: `js/[name].${Timestamp}.js`
    }
  },
  chainWebpack: config => {
    config.plugin('html').use(
      new HtmlWebpackPlugin({
        filename: 'index.html',
        templateParameters: {
          BASE_URL: `/`
        },
        template: path.resolve('./public/index.html'),
        inject: 'body',
        recaptcha: process.env.VUE_APP_RECAPTCHA_ADDR,
        title: 'pontocare-operation-web'
      })
    );
  },
  transpileDependencies: true,
  css: {
    extract: {
      filename: `css/[name].${Timestamp}.css`,
      chunkFilename: `css/[name].${Timestamp}.css`
    },
    sourceMap: false,
    loaderOptions: {
      scss: {
        additionalData: ``
      }
    }
  },

  lintOnSave: false,
  devServer: {
    port: 8081,
    proxy: {
      '/': {
        target: 'https://dev-pc.pontosense.net',
        // target: "https://test-pc.pontosense.net/",
        // target: "http://192.168.10.55:10020",
        ws: false,
        changeOrigin: true
      }
    },
    client: {
      overlay: false
    }
  }
});
