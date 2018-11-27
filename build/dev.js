const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const base = require('./base.js');
const basePath = path.join(__dirname, '../');

module.exports = merge(base, {
	mode: 'development',
	devtool: 'cheap-module-eval-source-map',
	devServer: {
		contentBase: path.join(basePath, './dist'),
		open: true,
		index: 'index.html',
		inline: true, 
		hot: true,
	},
	plugins: [
		new webpack.HotModuleReplacementPlugin()
	],
});
