import { RGBA, kmeans, neuquant } from "../../src"
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
        performance.mark('runstart')
        result = neuquant(img, k)
        performance.mark('runend')
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