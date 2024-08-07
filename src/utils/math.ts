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