import { RGBA } from './struct';
/**
 * 返回两个四维坐标间的欧几里得距离
 * @param a
 * @param b
 * @returns
 */
export declare function euclidean_distance(a: RGBA, b: RGBA): number;
/**
 * 以数组形式返回三个数字中的最大值与最小值
 * @param param0 一个包含三个数字的数组
 * @returns [max,min]
 */
export declare function max_min_of_three([a, b, c]: [number, number, number]): number[];
