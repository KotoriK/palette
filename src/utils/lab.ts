import rgb from 'color-space/rgb'
import xyz from 'color-space/xyz'
import lab from 'color-space/lab'
import { LABA, RGBA } from './struct'

/**
 * 提取像素并转换到CIE Lab
 * 
 * @param img 
 * @returns 
 */
export function toPixelLAB(img: ImageData) {
    const { data } = img
    const array: LABA[] = []
    for (let i = 0; i < data.length; i += 4) {
        const pixel = data.slice(i, i + 4)
        const alpha = pixel[3]
        const pixel_rgb = pixel.slice(0, 3)
        const pixel_xyz = rgb.xyz(pixel_rgb)
        const pixel_lab = xyz.lab(pixel_xyz) as [number, number, number]
        array.push([...pixel_lab, alpha])
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