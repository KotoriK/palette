import kmeans from '../src/kmeans'
import { readFile } from 'fs/promises'
import { resolve } from 'path'
import { performance, PerformanceObserver } from 'perf_hooks'
import { toPixel } from '../src/util'
import { loadImage, createCanvas } from 'canvas'
readFile(resolve('./example/pietro-de-grandi-T7K4aEPoGGk-unsplash.jpg')).then(async buf => {
    const img = await loadImage(buf)
    const canvas = createCanvas(img.width, img.height)
    const ctx = canvas.getContext('2d')
    ctx.drawImage(img,0,0)
    const data = toPixel(ctx.getImageData(0, 0, img.width, img.height))
    const obs = new PerformanceObserver((items) => {
        console.log(items.getEntries()[0].duration);
        performance.clearMarks();
    });
    obs.observe({entryTypes: ['measure']})
    for (let i = 0; i < 10; i++) {
        performance.mark('runstart')
        const result = kmeans(data, 3, 100)
        performance.mark('runend')
        performance.measure('run time', 'runstart', 'runend');
        console.log(i, ":", { iterate_time: result.iterate_time, fit_thresold: result.fit_thresold })
        performance.clearMarks();
    }
})