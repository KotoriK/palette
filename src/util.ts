import { CanvasRenderingContext2D, NodeCanvasRenderingContext2D } from "canvas"

export type HSLA = [number, number, number, number]
export type RGBA = [number, number, number, number]
export function awaitImage(imgElement: HTMLImageElement) {
    return new Promise<void>((resolve, reject) => {
        imgElement.addEventListener('load', () => {
            resolve()
        })
        imgElement.addEventListener('error', () => {
            reject()
        })
    })
}
export function readImage(imgSource: HTMLImageElement) {
    return _readImage(_prepare2DContext, imgSource)
}
export function readImageAsync(imgSource: HTMLImageElement) {
    return _readImage(_prepare2DContextAsync as any, imgSource)
}
function _readImage(prepareCtx: (width: number, height: number) => CanvasRenderingContext2D, imgSource: HTMLImageElement) {
    const { naturalWidth, naturalHeight } = imgSource;
    const ctx = prepareCtx(naturalWidth, naturalHeight)
    ctx?.drawImage(imgSource, 0, 0, naturalWidth, naturalHeight);
    return ctx?.getImageData(0, 0, naturalWidth, naturalHeight);
}
export function readImageDownsampling(imgSource: HTMLImageElement, maxSample: number) {
    return _readImageDownsampling(_prepare2DContext, imgSource, maxSample)
}
function _readImageDownsampling(prepareCtx: (width: number, height: number) => CanvasRenderingContext2D, imgSource: HTMLImageElement, maxSample: number) {
    const { naturalWidth: width, naturalHeight: height } = imgSource
    const scale = width * height / maxSample
    if (scale > 1) {
        const n_width = width / Math.sqrt(scale)
        const n_height = height / Math.sqrt(scale)
        const ctx = prepareCtx(n_width, n_height)
        ctx?.drawImage(imgSource, 0, 0, n_width, n_height)
        return ctx?.getImageData(0, 0, n_width, n_height)
    } else {
        const ctx = prepareCtx(width, height)
        ctx?.drawImage(imgSource, 0, 0)
        return ctx?.getImageData(0, 0, width, height)
    }
}
function _prepare2DContext(width: number, height: number) {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d') as NodeCanvasRenderingContext2D | CanvasRenderingContext2D
    canvas.height = height
    canvas.width = width
    return ctx
}
/**
 * Use OffscreenCanvas
 */
function _prepare2DContextAsync(width: number, height: number) {
    const canvas = new OffscreenCanvas(width, height)
    const ctx = canvas.getContext('2d')!
    return ctx
}
/**
 * 从@type {Uint8ClampedArray} 中读取，每四个元素合并到一个数组元素中
 * @param img 要处理的图像矩阵
 * @returns 
 */
export function toPixel(img: ImageData) {
    const { data } = img
    const array: RGBA[] = new Array(data.length / 4)
    for (let i = 0; i < data.length; i += 4) {
        array[i / 4] = [data[i], data[i + 1], data[i + 2], data[i + 3]]
    }
    return array
}
export function euclidean_distance(a: RGBA, b: RGBA) {
    const r = a[0] - b[0]
    const g = a[1] - b[1]
    const _b = a[2] - b[2]
    const _a = a[3] - b[3]
    return Math.sqrt(
        r * r
        + g * g
        + _b * _b
        + _a * _a
    )
    /* return Math.sqrt(
        Math.pow(a[0] - b[0], 2)
        + Math.pow(a[1] - b[1], 2)
        + Math.pow(a[2] - b[2], 2)
        + Math.pow(a[3] - b[3], 2)
    ) */
}
function max_min_of_three([a, b, c]: [number, number, number]) {
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
export const sortHSL = (sort: IndexOFHSLA[] = [0, 1, 2, 3]) =>
    (a: HSLA, b: HSLA) => {
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
export const hslaCSSText = ([h, s, l, a]: HSLA) => `hsla(${h}deg,${s * 100}%,${l * 100}%,${a})`
export const rgbaCSSText = (pixel: RGBA) => `rgba(${pixel.map(v => Math.floor(v)).join(',')})`
/* export class RGBAArray extends Uint8ClampedArray {
    pixel(pixel_index: number) {
        return [pixel_index * 4, pixel_index * 4 + 1, pixel_index * 4 + 2, pixel_index * 4 + 3]
    }
    r(pixel_index: number) {
        return pixel_index * 4
    }
    g(pixel_index: number) {
        return pixel_index * 4 + 1
    }
    b(pixel_index: number) {
        return pixel_index * 4 + 2
    }
    a(pixel_index: number) {
        return pixel_index * 4 + 3
    }
} */