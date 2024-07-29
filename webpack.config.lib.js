const path = require('path');

const filename = process.env.NODE_ENV === 'prod'
  ? 'circos.min.js' : 'circos.js';

module.exports = {
  entry: './src/circos.js',
  mode: 'production',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: filename,
    library: 'Circos',
    libraryTarget: 'var',
    globalObject: 'this'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader',
        include: [
          path.resolve(__dirname, 'src')
        ],
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  }
};
