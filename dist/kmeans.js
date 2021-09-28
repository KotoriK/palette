"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("./util");
const THRESOLD = 1;
function kmeans(data, k, attempt) {
    const cluster_centers = [];
    const new_cluster_centers = [];
    const cluster_sum = [];
    let iterate_time = 0;
    for (let i = 0; i < k; i++) {
        cluster_centers.push(data[Math.floor(Math.random() * data.length)]); //随机选点
        cluster_sum.push(_filled_array(0, 5));
    }
    while (iterate_time < attempt) {
        //准备坐标和
        //计算每个点与中心的距离
        for (let i = 0; i < data.length; i++) {
            const data_item = data[i];
            let cluster_index = 0;
            let _min_distance = (0, util_1.euclidean_distance)(data_item, cluster_centers[0]);
            for (let j = 1; j < k; j++) {
                const distance = (0, util_1.euclidean_distance)(data_item, cluster_centers[j]);
                if (distance < _min_distance) {
                    _min_distance = distance;
                    cluster_index = j;
                }
            }
            const sum = cluster_sum[cluster_index];
            sum[0] += data_item[0];
            sum[1] += data_item[1];
            sum[2] += data_item[2];
            sum[3] += data_item[3];
            sum[4]++;
        }
        let diff = 0;
        //重新计算中心点
        for (let i = 0; i < k; i++) {
            const rgbac = cluster_sum[i];
            const count = rgbac[4];
            if (count == 0) {
                new_cluster_centers[i] = data[Math.floor(Math.random() * data.length)];
            }
            else {
                new_cluster_centers[i] = [rgbac[0] / count, rgbac[1] / count, rgbac[2] / count, rgbac[3] / count];
            }
            diff += (0, util_1.euclidean_distance)(cluster_centers[i], new_cluster_centers[i]);
        }
        if (diff <= THRESOLD) {
            return {
                cluster_center: new_cluster_centers, iterate_time, fit_thresold: true, label: cluster_sum.map(v => v[4]), size: data.length
            };
        }
        _swap_array(new_cluster_centers, cluster_centers);
        iterate_time++;
        //清空累加
        for (let i = 0; i < k; i++) {
            const sum_array = cluster_sum[i];
            sum_array[0] = 0;
            sum_array[1] = 0;
            sum_array[2] = 0;
            sum_array[3] = 0;
            sum_array[4] = 0;
        }
    }
    return {
        cluster_center: cluster_centers, iterate_time, fit_thresold: false, label: cluster_sum.map(v => v[4]), size: data.length
    };
}
exports.default = kmeans;
function _swap_array(from, to) {
    for (let i = 0; i < from.length; i++) {
        to[i] = from[i];
    }
}
function _filled_array(fillWith, count) {
    const array = [];
    for (let i = 0; i < count; i++) {
        array.push(fillWith);
    }
    return array;
}
