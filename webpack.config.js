var webpack = require('webpack');

module.exports = {
  entry : __dirname + '/src/assets/js/entry.js',
  output: {
    path    : __dirname + '/public/assets/js',
    filename: 'app.js'
  },
  devtool: 'source-map',
	module : {
		loaders: [
			{
				test   : /.jsx?$/,
				loader : 'babel-loader',
				exclude: /node_modules/
			}
		]
	},
  plugins: [
    new webpack.optimize.UglifyJsPlugin({compress: {warnings: false} }),
    new webpack.DefinePlugin({
        'process.env': {
          'NODE_ENV': JSON.stringify('production')
        }
      })
  ]
};
