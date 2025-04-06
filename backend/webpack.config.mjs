import path from 'path';
import { fileURLToPath } from 'url';
// import dotenv from 'dotenv';
// dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default {
    entry: './index.ts',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'index.js'
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    target: 'node',
    // watch: true,
    mode: process.env.NODE_ENV || 'development',
};
