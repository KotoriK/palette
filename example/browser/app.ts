
import { kmeanWorkerData } from "./worker";
import { readImageDownsampling, readImage, rgbaToHSLA, normalizeRGBA, RGBA, labaToRGBA, getHSLAComparer, convertToLab } from '../../src'
const img = document.getElementsByTagName('img')[0];
const div_result = document.getElementById('result');

(document.getElementById('input_image') as HTMLFormElement).addEventListener('submit', (e) => {
    e.preventDefault();
    const files = ((e.currentTarget as HTMLFormElement).querySelector('input[type=file]') as HTMLInputElement).files
    if (files && files.length > 0) {
        img.src = URL.createObjectURL(files[0])
    }
})
const workers = new Array(5).fill(0).map(() => new Worker('./worker.ts'))
let RESULT = []
function run(laba = false) {
    const DEV_DOWNSAMPLING = true
    performance.mark('convert:start')
    const { data: originalData } = (DEV_DOWNSAMPLING ? readImageDownsampling(img, 100 * 1000)! : readImage(img))
    const data = laba ? convertToLab(originalData) : originalData
    performance.mark('convert:end')
    performance.measure('convert time', 'convert:start', 'convert:end');
    console.log('convert time', performance.getEntriesByName('convert time')[0].duration)
    performance.clearMarks();
    performance.clearMeasures();
    return Promise.all(workers.map((worker) => new Promise<void>(resolve => {
        worker.postMessage({ img: data, k: parseInt((document.getElementById('k') as HTMLInputElement).value), attempt: 100 } as kmeanWorkerData)
        worker.onmessage = (e) => {
            const { time, result } = e.data
            const row = document.createElement('div')
            const span_time = document.createElement('span')
            span_time.innerText = `${time}ms,iterate:${result.iteration}, laba:${laba}`
            RESULT.push({
                time, iteration: result.iteration, laba
            })
            console.log(e.data);
            (result.centroid as RGBA[])
                .map(centre => rgbaToHSLA(
                    normalizeRGBA(
                        laba ? labaToRGBA(centre as any) : centre
                    )
                ))
                .sort(getHSLAComparer([2, 0, 1, 3]))
                .forEach(([h, s, l, a]) => {
                    const css_color = `hsla(${h}deg,${s * 100}%,${l * 100}%,${a})`
                    const new_div = document.createElement('div')
                    new_div.classList.add('color-block')
                    new_div.style.backgroundColor = css_color
                    row?.append(new_div)
                })
            row.append(span_time)

            div_result?.append(row)
            resolve()
        }
    })))
}
function cleanResult() {
    document.querySelectorAll('#result *').forEach(node => node.remove())
    RESULT = []
}
document.getElementById('run').onclick = () => {
    run(true).then(() => {
        //run(true)
    })
}
document.getElementById('clear').onclick = () => {
    cleanResult()
}
document.getElementById('show').onclick = () => {
    console.log(
        'time,iteration,laba\n' +
        RESULT.map(({ time, iteration, laba }) => `${time},${iteration},${laba}`).join('\n'))
}