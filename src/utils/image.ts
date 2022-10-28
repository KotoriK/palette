function _prepare2DContext(width: number, height: number) {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')! //contextType 是存在的
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
 * a Promise resolved when <img> is loaded
 * @param imgElement 
 * @returns Event, undefined when Image is already loaded
 */
export function awaitImage(imgElement: HTMLImageElement) {
    return new Promise<Event | void>((resolve, reject) => {
        if (imgElement.complete) {
            resolve()
        } else {
            imgElement.addEventListener('load', (e: Event) => {
                resolve(e)
            })
            imgElement.addEventListener('error', (reason) => {
                reject(reason)
            })
        }
    })
}
type ContextPrepareFunc = (width: number, height: number) => CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D

export const readImage = _readImage.bind(undefined, _prepare2DContext)
/**
 * read image using OffscreenCanvas
 */
export const readImageOffscreen = _readImage.bind(undefined, _prepare2DContextAsync)

function _readImage(prepareCtx: ContextPrepareFunc, imgSource: HTMLImageElement) {
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
export const readImageDownsampling = _readImageDownsampling.bind(undefined, _prepare2DContext)

export const readImageDownsamplingOffscreen = _readImageDownsampling.bind(undefined, _prepare2DContextAsync)

function _readImageDownsampling(prepareCtx: ContextPrepareFunc, imgSource: HTMLImageElement, maxSample: number) {
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