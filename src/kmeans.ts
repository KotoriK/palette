import { euclidean_distance } from "./utils/math"
import { RGBA } from "./utils/struct"

const THRESOLD = 1

export default function kmeans(data: RGBA[], k: number, attempt: number): KMeansResult {
    const cluster_centers: RGBA[] = []
    const new_cluster_centers: RGBA[] = []
    const cluster_sum: [number, number, number, number, number][]/*[r,g,b,a,c]*/ = []
    let iteration = 0

    for (let i = 0; i < k; i++) {
        cluster_centers.push(data[Math.floor(Math.random() * data.length)])    //随机选点
        cluster_sum.push(_filled_array(0, 5) as [number, number, number, number, number])
    }
    while (iteration < attempt) {
        //准备坐标和
        //计算每个点与中心的距离
        for (let i = 0; i < data.length; i++) {
            const data_item = data[i]
            let cluster_index = 0
            let _min_distance = euclidean_distance(data_item, cluster_centers[0])
            for (let j = 1; j < k; j++) {
                const distance = euclidean_distance(data_item, cluster_centers[j])
                if (distance < _min_distance) {
                    _min_distance = distance
                    cluster_index = j
                }
            }
            const sum = cluster_sum[cluster_index]
            sum[0] += data_item[0]
            sum[1] += data_item[1]
            sum[2] += data_item[2]
            sum[3] += data_item[3]
            sum[4]++
        }
        let diff = 0
        //重新计算中心点
        for (let i = 0; i < k; i++) {
            const rgbac = cluster_sum[i]
            const count = rgbac[4]
            if (count == 0) {
                //空类 重新选中心点
                new_cluster_centers[i] = data[Math.floor(Math.random() * data.length)]
            } else {
                new_cluster_centers[i] = [rgbac[0] / count, rgbac[1] / count, rgbac[2] / count, rgbac[3] / count]
            }
            diff += euclidean_distance(cluster_centers[i], new_cluster_centers[i])
        }
        if (diff <= THRESOLD) {
            return {
                centroid: new_cluster_centers, iteration, fit: true, label: cluster_sum.map(v => v[4]), size: data.length
            }
        }
        _swap_array(new_cluster_centers, cluster_centers)
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
        centroid: cluster_centers, iteration, fit: false, label: cluster_sum.map(v => v[4]), size: data.length
    }
}
export interface KMeansResult {
    centroid: RGBA[],
    iteration: number,
    /**是否符合阈值要求 */
    fit: boolean,
    label: number[]
    /**输入的图像的像素计数 */
    size: number
}
function _swap_array(from: Array<any>, to: Array<any>) {
    for (let i = 0; i < from.length; i++) {
        to[i] = from[i]
    }
}
function _filled_array<T>(fillWith: T, count: number) {
    const array: T[] = []
    for (let i = 0; i < count; i++) {
        array.push(fillWith)
    }
    return array
}