import type { Vector3, Vector4 } from "./utils/struct"
function _filled_array<T>(fillWith: T, count: number) {
    const array: T[] = []
    for (let i = 0; i < count; i++) {
        array.push(fillWith)
    }
    return array
}
function euclidean_distance_squared_index(a: Uint8ClampedArray | number[], a_start: number, b: Uint8ClampedArray | Vector3) {
    const r = a[a_start++] - b[0]
    const g = a[a_start++] - b[1]
    const _b = a[a_start++] - b[2]
    return r ** 2
        + g ** 2
        + _b ** 2
}

export interface KMeansResult<T extends Vector3 | Uint8ClampedArray> {
    centroid: T[],
    iteration: number,
    /**是否符合阈值要求 */
    fit: boolean,
    label: number[]
    /**输入的图像的像素计数 */
    size: number
}
/**
 * 
 * @param data 
 * @param k 
 * @param maxAttempt 
 * @param thresold 
 * @param clipAlpha 裁切掉alpha通道为0的部分
 * @returns 
 */
export default function kmeans<T extends Uint8ClampedArray | Array<number>, CentroidType extends Uint8ClampedArray | Vector3 = T extends Uint8ClampedArray ? Uint8ClampedArray : Vector3>
    (data: T, k: number, maxAttempt: number, thresold = 2, clipAlpha: boolean = false): KMeansResult<CentroidType> {
    const cluster_sum: Vector4[]/*[r,g,b,c]*/ = []
    const thresold_squared = thresold ** 2
    let pixelCount = data.length / 4
    let cluster_centers: (CentroidType)[] = []
    let new_cluster_centers: (CentroidType)[] = []
    let iteration = 0

    const isDataTypedArray = data instanceof Uint8ClampedArray
    const PIXEL_LEN = clipAlpha ? 3 : 4
    if (clipAlpha) {
        let j = 0
        const dataNoAlpha = isDataTypedArray ? new Uint8ClampedArray(pixelCount * 3) : []
        for (let i = 0; i < data.length;) {
            if (data[i + 3] == 0) {
                i += 4
                continue
            }
            dataNoAlpha[j++] = data[i++]
            dataNoAlpha[j++] = data[i++]
            dataNoAlpha[j++] = data[i++]
            i++
        }
        data = dataNoAlpha.slice(0, j) as T
        pixelCount = j / 3
    }
    //随机选点
    for (let i = 0; i < k; i++) {
        const start = Math.floor(1 * (pixelCount - 1)) * PIXEL_LEN
        cluster_centers.push(/* Array.from */(data.slice(start, start + 3)) as CentroidType)// ignore alpha
        new_cluster_centers.push((isDataTypedArray ? new Uint8ClampedArray(3) : _filled_array(0, 3)) as CentroidType)
        cluster_sum.push(_filled_array(0, 4) as Vector4)
    }
    while (iteration < maxAttempt) {
        //准备坐标和
        //计算每个点与中心的距离
        for (let i = 0; i < data.length;) {
            let cluster_index = 0
            let _min_distance = euclidean_distance_squared_index(data, i, cluster_centers[0])
            for (let j = 1; j < k; j++) {
                const distance = euclidean_distance_squared_index(data, i, cluster_centers[j])
                if (distance < _min_distance) {
                    _min_distance = distance
                    cluster_index = j
                }
            }
            const sum = cluster_sum[cluster_index]
            sum[0] += data[i++]
            sum[1] += data[i++]
            sum[2] += data[i++]
            sum[3]++
            if (PIXEL_LEN === 4) i++
        }

        let allStabled = true
        //重新计算中心点
        for (let i = 0; i < k; i++) {
            const rgbc = cluster_sum[i]
            const count = rgbc[3]

            if (count == 0) {
                //空类 重新选中心点
                const start = Math.floor(Math.random() * (pixelCount - 1)) * PIXEL_LEN
                new_cluster_centers[i] = /* Array.from */(data.slice(start, start + 3)) as CentroidType
                allStabled = false
            } else {
                let new_center = new_cluster_centers[i]
                let diffSquared = 0
                for (let j = 0; j < 3; j++) {
                    new_center[j] = rgbc[j] / count
                    diffSquared += (new_center[j] - cluster_centers[i][j]) ** 2
                }
                if (diffSquared > thresold_squared) {
                    allStabled = false
                }
            }
        }
        if (allStabled) {
            return {
                centroid: new_cluster_centers,
                iteration,
                fit: true,
                label: cluster_sum.map(v => v[3]),
                size: pixelCount
            }
        }
        const medium = cluster_centers
        cluster_centers = new_cluster_centers
        new_cluster_centers = medium
        iteration++
        //清空累加
        for (let i = 0; i < k; i++) {
            const sum_array = cluster_sum[i]
            sum_array[0] = 0
            sum_array[1] = 0
            sum_array[2] = 0
            sum_array[3] = 0
        }
    }
    return {
        centroid: cluster_centers,
        iteration,
        fit: false,
        label: cluster_sum.map(v => v[3]),
        size: pixelCount
    }
}