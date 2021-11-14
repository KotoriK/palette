import { RGBA } from './struct'
/**
 * 返回两个四维坐标间的欧几里得距离
 * @param a 
 * @param b 
 * @returns 
 */
export function euclidean_distance_squared(a: RGBA, b: RGBA) {
    const r = a[0] - b[0]
    const g = a[1] - b[1]
    const _b = a[2] - b[2]
    const _a = a[3] - b[3]
    return r ** 2
        + g ** 2
        + _b ** 2
        + _a ** 2
    
    /* return Math.sqrt(
        Math.pow(a[0] - b[0], 2)
        + Math.pow(a[1] - b[1], 2)
        + Math.pow(a[2] - b[2], 2)
        + Math.pow(a[3] - b[3], 2)
    ) */
}
/**
 * 以数组形式返回三个数字中的最大值与最小值
 * @param param0 一个包含三个数字的数组
 * @returns [max,min]
 */
export function max_min_of_three([a, b, c]: [number, number, number]) {
    if (a > b) {
        if (b > c) {
            //abc
            return [a, c]
        } else {
            if (a > c) {
                //acb
                return [a, b]
            } else {
                //cab
                return [c, b]
            }
        }
    } else {
        //a<b
        if (b > c) {
            if (c > a) {
                //bca
                return [b, a]
            } else {
                //bac
                return [b, c]
            }
        } else {
            //cba
            return [c, a]
        }
    }
}