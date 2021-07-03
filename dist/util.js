"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hslaCSSText = exports.sortHSL = exports.rgbaToHSLA = exports.normalizeRGBA = exports.euclidean_distance = exports.toPixel = exports.readImageDownsampling = exports.readImage = exports.awaitImage = void 0;
function awaitImage(imgSource) {
    return new Promise((resolve, reject) => {
        imgSource.addEventListener('load', () => {
            resolve();
        });
        imgSource.addEventListener('error', () => {
            reject();
        });
    });
}
exports.awaitImage = awaitImage;
function readImage(imgSource) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const { naturalWidth, naturalHeight } = imgSource;
    canvas.height = naturalHeight;
    canvas.width = naturalWidth;
    ctx?.drawImage(imgSource, 0, 0, naturalWidth, naturalHeight);
    return ctx?.getImageData(0, 0, naturalWidth, naturalHeight);
}
exports.readImage = readImage;
function readImageDownsampling(imgSource, maxSample) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const { naturalWidth: width, naturalHeight: height } = imgSource;
    const scale = width * height / maxSample;
    if (scale > 1) {
        const n_width = width / Math.sqrt(scale);
        const n_height = height / Math.sqrt(scale);
        canvas.height = n_height;
        canvas.width = n_width;
        ctx?.drawImage(imgSource, 0, 0, n_width, n_height);
        return ctx?.getImageData(0, 0, n_width, n_height);
    }
    else {
        canvas.height = height;
        canvas.width = width;
        ctx?.drawImage(imgSource, 0, 0);
        return ctx?.getImageData(0, 0, width, height);
    }
}
exports.readImageDownsampling = readImageDownsampling;
/**
 * 从@type {Uint8ClampedArray} 中读取，每四个元素合并到一个数组元素中
 * @param img 要处理的图像矩阵
 * @returns
 */
function toPixel(img) {
    const { data } = img;
    const array = new Array(data.length / 4);
    for (let i = 0; i < data.length; i += 4) {
        array[i / 4] = [data[i], data[i + 1], data[i + 2], data[i + 3]];
    }
    return array;
}
exports.toPixel = toPixel;
function euclidean_distance(a, b) {
    const r = a[0] - b[0];
    const g = a[1] - b[1];
    const _b = a[2] - b[2];
    const _a = a[3] - b[3];
    return Math.sqrt(r * r
        + g * g
        + _b * _b
        + _a * _a);
    /* return Math.sqrt(
        Math.pow(a[0] - b[0], 2)
        + Math.pow(a[1] - b[1], 2)
        + Math.pow(a[2] - b[2], 2)
        + Math.pow(a[3] - b[3], 2)
    ) */
}
exports.euclidean_distance = euclidean_distance;
function max_min_of_three([a, b, c]) {
    if (a > b) {
        if (b > c) {
            //abc
            return [a, c];
        }
        else {
            if (a > c) {
                //acb
                return [a, b];
            }
            else {
                //cab
                return [c, b];
            }
        }
    }
    else {
        //a<b
        if (b > c) {
            if (c > a) {
                //bca
                return [b, a];
            }
            else {
                //bac
                return [b, c];
            }
        }
        else {
            //cba
            return [c, a];
        }
    }
}
function normalizeRGBA(rgba) {
    //@ts-ignore
    return rgba.map(v => v / 255);
}
exports.normalizeRGBA = normalizeRGBA;
function rgbaToHSLA(rgba) {
    let h, s;
    //@ts-ignore
    const [max, min] = max_min_of_three(rgba);
    const diff = max - min;
    const light_2x = max + min;
    //h
    if (diff == 0) {
        h = 0;
        s = 0;
    }
    else {
        if (max == rgba[0]) {
            const temp_h = 60 * (rgba[1] - rgba[2]) / diff;
            if (temp_h < 0) {
                h = temp_h + 360;
            }
            else {
                h = temp_h;
            }
        }
        else if (max == rgba[1]) {
            h = 60 * (rgba[2] - rgba[0]) / diff + 120;
        }
        else {
            h = 60 * (rgba[0] - rgba[1]) / diff + 240;
        }
        if (light_2x == 0) {
            s = 0;
        }
        else if (light_2x <= 1) {
            s = diff / light_2x;
        }
        else {
            s = diff / (2 - light_2x);
        }
    }
    return [h, s, light_2x / 2, rgba[3]];
}
exports.rgbaToHSLA = rgbaToHSLA;
function adjustAngleIn2Pi(angle) {
    if (angle < 0)
        return angle + 360;
    let temp = angle;
    while (temp >= 360) {
        temp = angle - 360;
    }
    return temp;
}
const sortHSL = (sort = [0, 1, 2, 3]) => (a, b) => {
    let result;
    for (const s of sort) {
        result = a[s] - b[s];
        if (result != 0) {
            return result;
        }
    }
    //其实是赋了值的，但是ts没猜出来
    //@ts-ignore
    return result;
};
exports.sortHSL = sortHSL;
const hslaCSSText = ([h, s, l, a]) => `hsla(${h}deg,${s * 100}%,${l * 100}%,${a})`;
exports.hslaCSSText = hslaCSSText;
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
