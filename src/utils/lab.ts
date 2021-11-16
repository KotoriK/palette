import rgb from 'color-space/rgb'
import xyz from 'color-space/xyz'
import lab from 'color-space/lab'
import { LABA, RGBA } from './struct'
export function convertToLab(source: Uint8ClampedArray | Array<number>): Array<number> {
    //CIE Lab包含浮点表示，不能使用Uint8ClampedArray
    const array: Array<number> = []
    for (let i = 0; i < source.length; i += 4) {
        const pixel = source.slice(i, i + 4)
        const alpha = pixel[3]
        const pixel_rgb = pixel.slice(0, 3)
        const pixel_xyz = rgb.xyz(pixel_rgb)
        const pixel_lab = xyz.lab(pixel_xyz) as [number, number, number]
        array.push(...pixel_lab, alpha)
    }
    return array
}
export function labaToRGBA(laba: LABA): RGBA {
    const pixel_lab = laba.slice(0, 3)
    const alpha = laba[3]
    const pixel_xyz = lab.xyz(pixel_lab)
    const pixel_rgb = xyz.rgb(pixel_xyz) as [number, number, number]
    return [...pixel_rgb, alpha]
}