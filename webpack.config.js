const path = require('path');

module.exports = {
	entry: './app/Main.jsx',
	output: {
		publicPath: '/',
		path: path.resolve(__dirname, 'app'),
		filename: 'bundled.js',
	},
	mode: 'development',
	devServer: {
		port: 3000,
		contentBase: path.join(__dirname, 'app'),
		hot: true,
		historyApiFallback: { index: 'index.html' },
	},
	resolve: {
		extensions: ['.webpack.js', '.web.js', '.js', '.json', '.jsx'],
	},
	module: {
		rules: [
			{
				test: /\.jsx$/,
				exclude: /(node_modules)/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['@babel/preset-react', ['@babel/preset-env', { targets: { node: '12' } }]],

						plugins: ['@babel/plugin-proposal-class-properties'],
					},
				},
			},
		],
	},
};
