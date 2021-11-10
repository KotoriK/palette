import { CanvasRenderingContext2D, NodeCanvasRenderingContext2D } from "canvas"
import { RGBA } from "./struct"

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
export function awaitImage(imgElement: HTMLImageElement) {
    return new Promise<Event>((resolve, reject) => {
        imgElement.addEventListener('load', (e: Event) => {
            resolve(e)
        })
        imgElement.addEventListener('error', (reason) => {
            reject(reason)
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
/**
 * 降采样后读取图片
 * @param imgSource 
 * @param maxSample 
 * @returns 
 */
export function readImageDownsampling(imgSource: HTMLImageElement, maxSample: number) {
    return _readImageDownsampling(_prepare2DContext, imgSource, maxSample)
}
export function readImageDownsamplingAsync(imgSource: HTMLImageElement, maxSample: number) {
    return _readImageDownsampling(_prepare2DContextAsync as any, imgSource, maxSample)
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
/**
 * 从@type {Uint8ClampedArray} 中读取，每四个元素合并到一个数组元素中
 * @param img 要处理的图像矩阵
 * @returns 
 */
export function toPixel(img: ImageData) {
    const { data } = img
    const array: RGBA[] = []
    for (let i = 0; i < data.length; i += 4) {
        array.push(data.slice(i, i + 4))
    }
    return array
}
