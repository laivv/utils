const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const base = require('./base.js');
const basePath = path.resolve(__dirname, '../');

module.exports = merge(base, {
	mode: 'production',
});
