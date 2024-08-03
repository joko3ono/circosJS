// jest.config.js
module.exports = {
  moduleNameMapper: {
    'd3': '<rootDir>/node_modules/d3/dist/d3.min.js',
    ".+\\.(css|styl|less|sass|scss|png|jpg|ttf|woff|woff2)$": "jest-transform-stub",
  },
  testEnvironment: "jsdom",
  setupFiles: ['<rootDir>/jest.setup.js'],
}
