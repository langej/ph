await Bun.build({
    entrypoints: ['src/ph.ts'],
    outdir: 'dist',
    format: 'iife',
    minify: true,
    target: 'browser',
})

await Bun.build({
    entrypoints: ['src/ph.esm.ts'],
    outdir: 'dist',
    format: 'esm',
    minify: true,
    target: 'browser',
})

export {}
