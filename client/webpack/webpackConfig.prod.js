const { resolve } = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const autoprefixer = require('autoprefixer');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
	mode: 'production',
	entry: {
		main: resolve(__dirname, `../containers/App/App.js`),
	},
	resolve: {
		modules: [resolve(__dirname, '../'), 'node_modules'],
		alias: {
			utils: resolve(__dirname, '../../utils'),
			server: resolve(__dirname, '../../server'),
			stories: resolve(__dirname, '../../stories'),
			client: resolve(__dirname, '../../client'),
			containers: resolve(__dirname, '../../client/containers'),
			components: resolve(__dirname, '../../client/components'),
		},
	},
	devtool: '#source-map',
	output: {
		filename: '[name].[chunkhash].js',
		path: resolve(__dirname, '../../dist'),
		publicPath: '/',
	},
	module: {
		rules: [
			{
				test: /\.mjs$/,
				include: /node_modules/,
				type: 'javascript/auto',
			},
			{
				test: /\.(js|jsx)$/,
				include: [resolve(__dirname, '../')],
				use: 'babel-loader',
			},
			{
				test: /\.scss$/,
				use: [
					MiniCssExtractPlugin.loader,
					{ loader: 'css-loader' },
					{
						loader: 'postcss-loader',
						options: { ident: 'postcss', plugins: [autoprefixer({})] },
					},
					{ loader: 'resolve-url-loader' },
					{
						loader: 'sass-loader',
						options: {
							sourceMap: true,
							sourceMapContents: false,
							includePaths: [resolve(__dirname, '../')],
						},
					},
				],
			},
			{
				test: /\.(ttf|eot|svg|woff|woff2)$/,
				use: [
					{
						loader: 'file-loader',
						query: { name: 'fonts/[hash].[ext]', publicPath: '/dist/' },
					},
				],
			},
		],
	},
	plugins: [
		// new BundleAnalyzerPlugin(),
		new webpack.DefinePlugin({
			'process.env': {
				NODE_ENV: JSON.stringify('production'),
			},
		}),
		new MiniCssExtractPlugin({
			filename: '[name].[contenthash].css',
		}),
		new ManifestPlugin({
			publicPath: '/dist/',
		}),
	],
	optimization: {
		minimizer: [
			new TerserPlugin({
				sourceMap: true,
			}),
		],
		splitChunks: {
			cacheGroups: {
				vendors: {
					// test: /[\\/]node_modules[\\/]/,
					test: /([\\/]node_modules[\\/])/,
					name: 'vendor',
					chunks: 'all',
					// minChunks: 2, // This was causing weird vendor.css issues where it wouldn't output.
				},
			},
		},
	},
	node: {
		net: 'empty',
		tls: 'empty',
		dns: 'empty',
		fs: 'empty',
	},
};
