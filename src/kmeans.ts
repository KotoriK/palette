import { euclidean_distance_squared, euclidean_distance_squared_index } from "./utils/math"
import { Vector4, Vector5 } from "./utils/struct"

export default function kmeans(data: Uint8ClampedArray | Array<number>, k: number, attempt: number, thresold = 1): KMeansResult {
    const data_length = data.length
    const cluster_sum: Vector5[]/*[r,g,b,a,c]*/ = []
    let cluster_centers: Vector4[] = []
    let new_cluster_centers: Vector4[] = []
    let iteration = 0
    for (let i = 0; i < k; i++) {
        const start = Math.floor(Math.random() * data_length)
        cluster_centers.push(Array.from(data.slice(start, start + 4)) as Vector4)  //随机选点
        new_cluster_centers.push(_filled_array(0, 4) as Vector4)
        cluster_sum.push(_filled_array(0, 5) as Vector5)
    }
    while (iteration < attempt) {
        //准备坐标和
        //计算每个点与中心的距离
        for (let i = 0; i < data_length;) {
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
            sum[3] += data[i++]
            sum[4]++
        }
        let diff = 0
        //重新计算中心点
        for (let i = 0; i < k; i++) {
            const rgbac = cluster_sum[i]
            const count = rgbac[4]
            if (count == 0) {
                //空类 重新选中心点
                const start = Math.floor(Math.random() * data.length)
                new_cluster_centers[i] = Array.from(data.slice(start, start + 4)) as Vector4
                diff += thresold
            } else {
                const new_center = new_cluster_centers[i]
                for (let j = 0; j < 4; j++) {
                    new_center[j] = rgbac[j] / count
                }
                diff += Math.sqrt(euclidean_distance_squared(cluster_centers[i], new_cluster_centers[i]))
            }
        }
        if (diff <= thresold) {
            return {
                centroid: new_cluster_centers,
                iteration,
                fit: true,
                label: cluster_sum.map(v => v[4]),
                size: data.length
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
            sum_array[4] = 0
        }
    }
    return {
        centroid: cluster_centers,
        iteration,
        fit: false,
        label: cluster_sum.map(v => v[4]),
        size: data.length
    }
}
export interface KMeansResult {
    centroid: Vector4[],
    iteration: number,
    /**是否符合阈值要求 */
    fit: boolean,
    label: number[]
    /**输入的图像的像素计数 */
    size: number
}
function _filled_array<T>(fillWith: T, count: number) {
    const array: T[] = []
    for (let i = 0; i < count; i++) {
        array.push(fillWith)
    }
    return array
}