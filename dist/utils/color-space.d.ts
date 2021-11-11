import { RGBA, HSLA } from "./struct";
export declare function normalizeRGBA(rgba: RGBA): RGBA;
export declare function rgbaToHSLA(rgba: RGBA): HSLA;
export declare type IndexOFHSLA = 0 | 1 | 2 | 3;
export declare const sortHSL: (sort?: IndexOFHSLA[]) => (a: import("./struct").Vector4, b: import("./struct").Vector4) => number;
export declare const hslaCSSText: ([h, s, l, a]: import("./struct").Vector4) => string;
export declare const rgbaCSSText: (pixel: RGBA) => string;
