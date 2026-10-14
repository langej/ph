await Bun.build({
    entrypoints: ['src/ph.ts'],
    outdir: 'dist',
    format: 'esm',
    minify: false,
    target: 'browser',
})

// build minified version as ph.min.js output
await Bun.build({
    entrypoints: ['src/ph.ts'],
    outdir: 'dist',
    naming: {
        entry: '[name].min.[ext]',
    },
    format: 'esm',
    minify: true,
    target: 'browser',
})

export {}
