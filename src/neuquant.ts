import NeuQuant from 'neuquant-js/src/neuquant.js'
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
}
/**
 * @param samplefac Sampling factor, which can be changed to increase or decrease quality at the expense of performance. The lower the number, the higher the quality.
 * based on 'neuquant-js'
 */
export default function neuquant(img: Uint8ClampedArray, k: number, samplefac = 1) {
    const img_rgb = rgba2Rgb(img)
    const nq = new NeuQuant(img_rgb, { netsize: k, samplefac })
    nq.buildColorMap()
    const colors = nq.getColorMap()
    const pixel: Array<RGBA> = []
    for (let i = 0, l = colors.length; i < l;) {
        pixel.push([colors[i++], colors[i++], colors[i++], 255])
    }
    return pixel
}
