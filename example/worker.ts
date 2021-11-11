import kmeans from "../src/kmeans"
import { RGBA } from "../src/utils/struct"
export interface kmeanWorkerData {
    img: RGBA[],
    k: number,
    attempt: number,
    laba:boolean
}
self.onmessage = (e) => {
    const { img, k, attempt } = e.data
    performance.mark('runstart')
    const result = kmeans(img, k, attempt)
    performance.mark('runend')
    performance.measure('run time', 'runstart', 'runend');
    (e.target as Worker).postMessage({ time: performance.getEntriesByName('run time')[0].duration, result })
    performance.clearMarks();
    performance.clearMeasures();
}