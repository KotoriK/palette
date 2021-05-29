import  kmeans  from "../src/kmeans"
export interface kmeanWorkerData{
    img:ImageData,
    k:number,
    attempt:number
}
self.onmessage = (e)=>{
    const {img,k,attempt} = e.data
    performance.mark('runstart')
        const result = kmeans(img as ImageData, k,attempt)
        performance.mark('runend')
        performance.measure('run time','runstart','runend');
        (e.target as Worker).postMessage({time:performance.getEntriesByName('run time')[0].duration,result})
        performance.clearMarks();
        performance.clearMeasures();
}