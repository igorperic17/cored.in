/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const nodeExternals = require('webpack-node-externals');
const CopyWebpackPlugin = require("copy-webpack-plugin");
const WriteFilePlugin = require("write-file-webpack-plugin");
const { IgnorePlugin } = require("webpack");
const ForkTSCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
require('source-map-support').install();
const TerserPlugin = require('terser-webpack-plugin');

// List of NestJS lazy imports
const lazyImports = [
  '@fastify/static',
  '@fastify/view',
  '@nestjs/microservices',
  '@nestjs/microservices/microservices-module',
  '@nestjs/websockets/socket-module',
  '@nestjs/platform-express',
  '@grpc/grpc-js',
  '@grpc/proto-loader',
  'kafkajs',
  'mqtt',
  'nats',
  'ioredis',
  'amqplib',
  'amqp-connection-manager',
  'pg-native',
  'cache-manager',
  'class-validator',
  'class-transformer',
];

module.exports = module.exports = (options) => ({
  ...options,
  entry: {
    lambda: './src/lambda.ts',
  },
  mode: "production",
  devtool: 'source-map',
  target: 'node',
  resolve: {
    extensions: ['.ts', '.js'],
  },
  output: {
    libraryTarget: 'commonjs2',
    path: path.join(__dirname, "dist"),
    filename: '[name].js',
    chunkFormat: false,
  },
  externals: [nodeExternals()],
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        loader: 'ts-loader',
        options: {
          configFile: 'tsconfig.webpack.json',
          transpileOnly: true,
          experimentalFileCaching: true,
        },
      },
    ],
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          keep_classnames: true,
        },
      }),
    ],
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        {
          from: "package.json",
          to: "[name][ext]",
        },
      ],
    }),
    new ForkTSCheckerWebpackPlugin(),
    new WriteFilePlugin(),
    new IgnorePlugin({
      checkResource(resource) {
        if (lazyImports.includes(resource)) {
          try {
            require.resolve(resource);
          } catch (err) {
            return true;
          }
        }
        return false;
      },
    }),
  ],
});
