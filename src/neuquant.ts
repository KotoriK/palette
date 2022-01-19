import NeuQuant from 'neuquant-js/src/neuquant.js'
import { indexed } from 'neuquant-js'
import { RGBA } from './utils/struct'
function rgba2Rgb(array: Uint8ClampedArray) {
    const rgb = new Uint8ClampedArray(array.length / 4 * 3)
    let rgb_i = 0
    for (let i = 0, l = array.length; i < l;) {
        for (let j = 0; j < 3; j++) {
            rgb[rgb_i++] = array[i++]
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
    const nq = new NeuQuant(img_rgb, { netsize: k, samplefac })
    nq.buildColorMap()
    const palette = nq.getColorMap()
    const indexed_pixel = indexed(img_rgb, palette)
    const pixel: Array<RGBA> = []
    for (let i = 0, l = palette.length; i < l;) {
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
