import kmeans from '../../src/kmeans'
import { readFile } from 'fs/promises'
import { resolve } from 'path'
import { performance, PerformanceObserver } from 'perf_hooks'
import { loadImage, createCanvas } from 'canvas'
readFile(resolve('./example/pietro-de-grandi-T7K4aEPoGGk-unsplash.jpg'))
    .then(async buf => {
        const img = await loadImage(buf)
        const canvas = createCanvas(img.width, img.height)
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0)
        const { data } = ctx.getImageData(0, 0, img.width, img.height)
        let runstart, runend
        for (let i = 1; i < 6; i++) {
            runstart = performance.now()
            const result = kmeans(data, 3, 100)
            runend = performance.now()
            console.log(i, ":", { iteration: result.iteration, fit: result.fit }, runend - runstart)
        }
    })