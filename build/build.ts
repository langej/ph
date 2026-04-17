await Bun.build({
    entrypoints: ['src/ph.ts'],
    outdir: 'dist',
    format: 'esm',
    minify: true,
    target: 'browser',
})

export {}
