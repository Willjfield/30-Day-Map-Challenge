import glsl from 'vite-plugin-glsl';
import { defineConfig } from 'vite';

export default defineConfig({
    plugins: [glsl()],
    build:{
        outDir: '../Day2'
    },
    base: "./",
    publicPath: "./30-Day-Map-Challenge/Day2/"
});