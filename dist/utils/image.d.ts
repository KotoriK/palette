import { RGBA } from "./struct";
export declare function awaitImage(imgElement: HTMLImageElement): Promise<Event>;
export declare function readImage(imgSource: HTMLImageElement): import("canvas").ImageData;
export declare function readImageAsync(imgSource: HTMLImageElement): import("canvas").ImageData;
/**
 * 降采样后读取图片
 * @param imgSource
 * @param maxSample
 * @returns
 */
export declare function readImageDownsampling(imgSource: HTMLImageElement, maxSample: number): import("canvas").ImageData;
export declare function readImageDownsamplingAsync(imgSource: HTMLImageElement, maxSample: number): import("canvas").ImageData;
/**
 * 从@type {Uint8ClampedArray} 中读取，每四个元素合并到一个数组元素中
 * @param img 要处理的图像矩阵
 * @returns
 */
export declare function toPixel(img: ImageData): RGBA[];
