"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("./util");
function kmeans(data, k, attempt) {
    const THRESOLD = 1;
    const cluster_centers = new Array(k);
    const new_cluster_centers = new Array(k);
    //随机选点
    for (let i = 0; i < k; i++) {
        cluster_centers[i] = data[Math.floor(Math.random() * data.length)];
    }
    let iterate_time = 0;
    const cluster_sum = new Array(k).fill(0).map(() => new Array(5).fill(0)); //[r,g,b,a,c]
    while (iterate_time < attempt) {
        //准备坐标和
        //计算每个点与中心的距离
        for (let i = 0; i < data.length; i++) {
            const data_item = data[i];
            let cluster_index = 0;
            let _min_distance = util_1.euclidean_distance(data_item, cluster_centers[0]);
            for (let j = 1; j < k; j++) {
                const distance = util_1.euclidean_distance(data_item, cluster_centers[j]);
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
        //重新计算中心点
        for (let i = 0; i < k; i++) {
            const rgbac = cluster_sum[i];
            const count = rgbac[4];
            if (count == 0)
                new_cluster_centers[i] = data[Math.floor(Math.random() * data.length)];
            else {
                new_cluster_centers[i] = [rgbac[0] / count, rgbac[1] / count, rgbac[2] / count, rgbac[3] / count];
            }
        }
        let diff = 0;
        for (let i = 0; i < k; i++) {
            diff += util_1.euclidean_distance(cluster_centers[i], new_cluster_centers[i]);
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
            cluster_sum[i][4] = 0;
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
