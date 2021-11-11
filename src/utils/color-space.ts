import { RGBA, HSLA } from "./struct"
import { max_min_of_three } from './math'

export function normalizeRGBA(rgba: RGBA): RGBA {
    //@ts-ignore
    return rgba.map(v => v / 255)
}
export function rgbaToHSLA(rgba: RGBA): HSLA {
    let h, s
    //@ts-ignore
    const [max, min] = max_min_of_three(rgba)
    const diff = max - min
    const light_2x = max + min
    //h
    if (diff == 0) {
        h = 0
        s = 0
    } else {
        if (max == rgba[0]) {
            const temp_h = 60 * (rgba[1] - rgba[2]) / diff
            if (temp_h < 0) {
                h = temp_h + 360
            } else {
                h = temp_h
            }
        } else if (max == rgba[1]) {
            h = 60 * (rgba[2] - rgba[0]) / diff + 120
        } else {
            h = 60 * (rgba[0] - rgba[1]) / diff + 240
        }
        if (light_2x == 0) {
            s = 0
        } else if (light_2x <= 1) {
            s = diff / light_2x
        } else {
            s = diff / (2 - light_2x)
        }
    }
    return [h, s, light_2x / 2, rgba[3]]
}
function adjustAngleIn2Pi(angle: number) {
    if (angle < 0) return angle + 360
    let temp = angle
    while (temp >= 360) {
        temp = angle - 360
    }
    return temp
}
export type IndexOFHSLA = 0 | 1 | 2 | 3
/**
 * 返回一个排序HSLA颜色的函数
 * @param sort 
 * @returns 
 */
export const getHSLAComparer = (sort: IndexOFHSLA[] = [0, 1, 2, 3]) => (a: HSLA, b: HSLA) => {
    let result: number
    for (const s of sort) {
        result = a[s] - b[s]
        if (result != 0) {
            return result
        }
    }
    //其实是赋了值的，但是ts没猜出来
    //@ts-ignore
    return result
}
/**
 * 将颜色转换成对应的CSS文本
 * @param param0 像素
 * @returns hsla(${h}deg,${s}%,${l}%,${a})
 */
export const hslaCSSText = ([h, s, l, a]: HSLA) => `hsla(${h}deg,${s * 100}%,${l * 100}%,${a})`
/**
 * 将颜色转换成对应的CSS文本
 * @param pixel 像素
 * @returns rgba(r,g,b,a)
 */
export const rgbaCSSText = (pixel: RGBA) => `rgba(${pixel.map(v => Math.floor(v)).join(',')})`
