import { Vector4 } from "./utils/struct";
export default function kmeans(data: Vector4[], k: number, attempt: number, thresold?: number): KMeansResult;
export interface KMeansResult {
    centroid: Vector4[];
    iteration: number;
    /**是否符合阈值要求 */
    fit: boolean;
    label: number[];
    /**输入的图像的像素计数 */
    size: number;
}
