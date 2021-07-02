import { RGBA } from "./util";
export default function kmeans(data: RGBA[], k: number, attempt: number): KMeansResult;
export interface KMeansResult {
    cluster_center: RGBA[];
    iterate_time: number;
    fit_thresold: boolean;
    label: number[];
    /**输入的图像的像素计数 */
    size: number;
}
