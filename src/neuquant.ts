import { indexed, palette as getPalette } from 'neuquant-js/src/helpers.js'
import { RGBA } from './utils/struct'
function rgba2Rgb(data: Uint8ClampedArray) {
    const rgb = new Uint8ClampedArray(data.length / 4 * 3)
    const len = data.length
    let rgb_i = 0
    for (let i = 0; i < len;) {
        for (let j = 0; j < 3; j++) {
            rgb[rgb_i++] = data[i++]
        }
        i++
    }
    return rgb
}
/**
 * @param samplefac Sampling factor, which can be changed to increase or decrease quality at the expense of performance. The lower the number, the higher the quality.
 * based on 'neuquant-js'
 */
export default function neuquant(img: Uint8ClampedArray, k: number, samplefac = 1) {
    const img_rgb = rgba2Rgb(img)
    const palette = getPalette(img_rgb, { netsize: k, samplefac })
    const indexed_pixel = indexed(img_rgb, palette)
    const pixel: Array<RGBA> = []
    const len = palette.length
    for (let i = 0; i < len;) {
        pixel.push([palette[i++], palette[i++], palette[i++], 255])
    }
    return { centroid: pixel, label: count(k, indexed_pixel) }
}
function count(k: number, index: number[]) {
    const counts = new Array(k).fill(0)
    for (const i of index) {
        counts[i]++
    }
    return counts
}
