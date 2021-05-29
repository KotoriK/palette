export type RGBA = [number, number, number, number]
export type RGBAC = [number, number, number, number, number]
export function readImage(imgSource: HTMLImageElement) {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const { width, height } = imgSource
    canvas.height = height
canvas.width = width
    ctx?.drawImage(imgSource, 0, 0)
    return ctx?.getImageData(0, 0, width, height)
}
export function toColorStats(img: ImageData): RGBAC[] {
    const { data } = img
    const colorMap = new Map<RGBA, number>()
    function _map_add(...color: RGBA) {
        const _color = colorMap.get(color)
        if (_color) {
            colorMap.set(color, _color + 1)
        } else {
            colorMap.set(color, 1)
        }
    }
    for (let i = 0; i < data.length; i += 4) {
        _map_add(data[i], data[i + 1], data[i + 2], data[i + 3])
    }
    return Array.from(colorMap.entries()).map(([color, count]) => [...color, count])
}
export function kmeans(img: ImageData, k: number, attempt: number) {
    const THRESOLD = 1
    let cluster_center:RGBAC[] = new Array(k)
    const cluster = new Array(k)
    //初始化集群
    for (let i = 0; i < k; i++) {
        cluster[i] = []
    }
    const data = toColorStats(img)
    //随机选点
    for (let i = 0; i < k; i++) {
        cluster_center[i] = data[Math.floor(Math.random() * data.length)]
    }
    let iterate_time = 0
    while (iterate_time < attempt) {
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
        if (distance_result.every(distance => distance < THRESOLD)) {
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

function _distance(a: RGBAC, b: RGBAC) {
    return Math.sqrt(
        Math.pow(a[0] - b[0], 2)
        + Math.pow(a[1] - b[1], 2)
        + Math.pow(a[2] - b[2], 2)
        + Math.pow(a[3] - b[3], 2)
        + Math.pow(a[4] - b[4], 2)

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
function calcu_cluster_center(cluster: RGBAC[]): RGBAC {
    const a_r = new Array(cluster.length), a_g = new Array(cluster.length), a_b = new Array(cluster.length), a_a = new Array(cluster.length), a_c = new Array(cluster.length)
    for (let i = 0; i < cluster.length; i++) {
        const [r, g, b, a, c] = cluster[i]
        a_r[i] = r
        a_g[i] = g
        a_b[i] = b
        a_a[i] = a
        a_c[i] = c
    }
    return [_mean(a_r), _mean(a_g), _mean(a_b), _mean(a_a), _mean(a_c)]
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