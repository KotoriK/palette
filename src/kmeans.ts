import { toPixel, RGBA, euclidean_distance } from "./util"

export default function kmeans(img: ImageData, k: number, attempt: number):KMeansResult {
    const THRESOLD = 1
    const data = toPixel(img)
    const cluster_center: RGBA[] = new Array(k)
    const new_cluster_center = new Array(k)
    //随机选点
    for (let i = 0; i < k; i++) {
        cluster_center[i] = data[Math.floor(Math.random() * data.length)]
    }
    let iterate_time = 0
    const cluster_sum = new Array(k).fill(0).map(() => new Array(5).fill(0))//[r,g,b,a,c]
    while (iterate_time < attempt) {
        //准备坐标和
        //计算每个点与中心的距离
        for (let i = 0; i < data.length; i++) {
            const data_item = data[i]
            let cluster_index = 0
            let _min_distance = euclidean_distance(data_item, cluster_center[0])
            for (let j = 1; j < k; j++) {
                const distance = euclidean_distance(data_item, cluster_center[j])
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
        //重新计算中心点
        for (let i = 0; i < k; i++) {
            const rgbac = cluster_sum[i]
            const count = rgbac[4]
            if (count == 0) new_cluster_center[i] = data[Math.floor(Math.random() * data.length)]
            else new_cluster_center[i] = [rgbac[0] / count, rgbac[1] / count, rgbac[2] / count, rgbac[3] / count]
        }
        let diff = 0
        for (let i = 0; i < k; i++) {
            diff += euclidean_distance(cluster_center[i], new_cluster_center[i])
        }
        if (diff <= THRESOLD) {
            return {
                cluster_center: new_cluster_center, iterate_time, fit_thresold: true, label: cluster_sum.map(v => v[4])
            }
        }
        _swap_array(new_cluster_center, cluster_center)
        iterate_time++
    }
    return {
        cluster_center, iterate_time, fit_thresold: false, label: cluster_sum.map(v => v[4])
    }
}
export interface KMeansResult {
    cluster_center: RGBA[],
    iterate_time: number,
    fit_thresold: boolean,
    label: number[]
}
function _swap_array(from: Array<any>, to: Array<any>) {
    for (let i = 0; i < from.length; i++) {
        to[i] = from[i]
    }
}