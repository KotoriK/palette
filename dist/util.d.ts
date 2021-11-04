export declare type HSLA = [number, number, number, number];
export declare type RGBA = [number, number, number, number] | Uint8ClampedArray;
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
/**
 * 返回两个四维坐标间的欧几里得距离
 * @param a
 * @param b
 * @returns
 */
export declare function euclidean_distance(a: RGBA, b: RGBA): number;
export declare function normalizeRGBA(rgba: RGBA): RGBA;
export declare function rgbaToHSLA(rgba: RGBA): HSLA;
export declare type IndexOFHSLA = 0 | 1 | 2 | 3;
export declare const sortHSL: (sort?: IndexOFHSLA[]) => (a: HSLA, b: HSLA) => number;
export declare const hslaCSSText: ([h, s, l, a]: HSLA) => string;
export declare const rgbaCSSText: (pixel: RGBA) => string;
