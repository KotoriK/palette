import { kMeansCluster } from "simple-statistics"

export type RGBA = [number, number, number, number]
export function readImage(imgSource: HTMLImageElement) {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const { width, height } = imgSource
    canvas.height = height
canvas.width = width
    ctx?.drawImage(imgSource, 0, 0)
    return ctx?.getImageData(0, 0, width, height)
}
export function toPixel(img:ImageData){
    const {data} = img
    const array:RGBA[] = []
    for (let i = 0; i < data.length; i += 4) {
        array.push([data[i], data[i + 1], data[i + 2], data[i + 3]])
    }
    return array
}
export function kmeans(img: ImageData, k: number, attempt: number){
    const data = toPixel(img)

    const result = kMeansCluster(data,k)
    console.log(result)
    return {
        cluster_center:result.centroids
    } 
}
export function _kmeans(img: ImageData, k: number, attempt: number) {
    const THRESOLD = 0
    let cluster_center:RGBA[] = new Array(k)
    let cluster = new Array(k)
    const data = toPixel(img)
    //随机选点
    for (let i = 0; i < k; i++) {
        cluster_center[i] = data[Math.floor(Math.random() * data.length)]
    }
    let iterate_time = 0
    while (iterate_time < attempt) {
            //初始化集群
    for (let i = 0; i < k; i++) {
        cluster[i] = []
    }
        //计算每个点与中心的距离
        for (let i = 0; i < data.length; i++) {
            const distance = new Array(k)
            for (let j = 0; j < k; j++) {
                distance[j] = _distance(data[i], cluster_center[j])
            }
            cluster[_min_index(distance)].push(data[i])
        }
        //重新计算中心点
        const new_cluster_center = new Array(k)
        for (let i = 0; i < k; i++) {
            new_cluster_center[i] = calcu_cluster_center(cluster[i])
        }
        const distance_result = new Array(k)
        for (let i = 0; i < k; i++) {
            distance_result[i] = _distance(cluster_center[i], new_cluster_center[i])
        }
        if (distance_result.every(distance => distance <= THRESOLD)) {
            return {
                cluster, cluster_center:new_cluster_center, iterate_time, fit_thresold: true
            }
        }
        cluster_center = new_cluster_center
        iterate_time++
    }
    return {
        cluster, cluster_center, iterate_time, fit_thresold: false
    }
}

function _distance(a: RGBA, b: RGBA) {
    return Math.sqrt(
        Math.pow(a[0] - b[0], 2)
        + Math.pow(a[1] - b[1], 2)
        + Math.pow(a[2] - b[2], 2)
        + Math.pow(a[3] - b[3], 2)
    )
}

function _min_index(x: Array<number>) {
    let index = 0
    let value = x[0];
    for (let i = 1; i < x.length; i++) {
        if (x[i] < value) {
            value = x[i];
            index = i
        }
    }
    return index;
}
function calcu_cluster_center(cluster: RGBA[]): RGBA {
    const a_r = new Array(cluster.length), a_g = new Array(cluster.length), a_b = new Array(cluster.length), a_a = new Array(cluster.length)
    for (let i = 0; i < cluster.length; i++) {
        const [r, g, b, a,] = cluster[i]
        a_r[i] = r
        a_g[i] = g
        a_b[i] = b
        a_a[i] = a
    }
    return [_mean(a_r), _mean(a_g), _mean(a_b), _mean(a_a)]
}
function _sum(array: Array<number>) {
    let sum = array[0]
    for (let i = 1; i < array.length; i++) {
        sum += array[i]
    }
    return sum
}
function _mean(array: Array<number>) {
    return _sum(array) / array.length
}