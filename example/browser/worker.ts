import { RGBA, kmeans } from "../../src"
import { palette, indexed } from 'neuquant-js'

export interface kmeanWorkerData {
    img: Uint8ClampedArray,
    k: number,
    attempt: number,
    compare: boolean
}
self.onmessage = (e) => {
    const { img, k, attempt, compare } = e.data as kmeanWorkerData
    let result
    if (compare) {
        result = {}
        const convertTimeStart = performance.now()
        const rgb = new Uint8ClampedArray(img.length / 4 * 3)
        let rgb_i = 0
        for (let i = 0,l = img.length; i < l;) {
            rgb[rgb_i++] = img[i++]
            rgb[rgb_i++] = img[i++]
            rgb[rgb_i++] = img[i++]
            i++
        }
        const convertTimeEnd = performance.now()
console.log(convertTimeEnd-convertTimeStart)
        performance.mark('runstart')
        const colors = palette(rgb, { netsize: k, samplefac: 1 })
        const pixel = []
        for (let i = 0, l = colors.length; i < l;) {
            pixel.push([colors[i++], colors[i++], colors[i++], 255])
        }
        performance.mark('runend')
        result.centroid = pixel
        result.iteration = -1
    } else {
        performance.mark('runstart')
        result = kmeans(img, k, attempt)
        performance.mark('runend')
    }
    performance.measure('run time', 'runstart', 'runend');
    (e.target as Worker).postMessage({ time: performance.getEntriesByName('run time')[0].duration, result })
    performance.clearMarks();
    performance.clearMeasures();
}