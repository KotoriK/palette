import { kmeans, neuquant } from "../../src"

export interface kmeanWorkerData {
    img: Uint8ClampedArray,
    k: number,
    attempt: number,
    compare: boolean
}
self.onmessage = (e) => {
    const { img, k, attempt, compare } = e.data as kmeanWorkerData
    let result

    let timeStart = 0;
    let timeEnd = 0;
    if (compare) {
        timeStart = performance.now()
        result = neuquant(img, k, 1)
        timeEnd = performance.now()
        result.iteration = -1
    } else {
        timeStart = performance.now()
        result = kmeans(img, k, attempt)
        timeEnd = performance.now()
    }
    (e.target as Worker).postMessage({ time: timeEnd - timeStart, result })
}