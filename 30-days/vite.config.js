import glsl from 'vite-plugin-glsl';
import { defineConfig } from 'vite';

export default defineConfig({
    plugins: [glsl()],
    build: {
        outDir: '../Day10',
        emptyOutDir: true
    },
    //base: "https://willjfield.github.io/30-Day-Map-Challenge/Day10/",
    publicPath: "./"
});