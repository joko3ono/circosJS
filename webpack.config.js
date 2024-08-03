const path = require('path');

module.exports = {
  entry: './src/circos.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'circos.es6.js',
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader',
        include: path.resolve(__dirname, 'src'),
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  }
};
