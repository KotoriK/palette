import { RGBA, kmeans } from "../../src"

export interface kmeanWorkerData {
    img: Uint8ClampedArray,
    k: number,
    attempt: number,
}
self.onmessage = (e) => {
    const { img, k, attempt } = e.data as kmeanWorkerData
    performance.mark('runstart')
    const result = kmeans(img, k, attempt)
    performance.mark('runend')
    performance.measure('run time', 'runstart', 'runend');
    (e.target as Worker).postMessage({ time: performance.getEntriesByName('run time')[0].duration, result })
    performance.clearMarks();
    performance.clearMeasures();
}