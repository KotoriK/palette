
import { rgbaToHSLA, normalizeRGBA, sortHSL, RGBA, readImageDownsampling } from "../src/util";
import { kmeanWorkerData } from "./worker";
const img = document.getElementsByTagName('img')[0];
const div_result = document.getElementById('result');

(document.getElementById('input_image') as HTMLFormElement).addEventListener('submit',(e)=>{
    e.preventDefault();
    const files = ((e.currentTarget as HTMLFormElement).querySelector('input[type=file]') as HTMLInputElement).files
    if(files && files.length>0){
        img.src=URL.createObjectURL(files[0])
    }
})
const workers = new Array(5).fill(0).map(()=>new Worker('./worker.ts'))
function run(){
    
    cleanResult()
    workers.forEach((worker)=>{
      worker.postMessage({img:readImageDownsampling(img,100*1000),k:parseInt((document.getElementById('k') as HTMLInputElement).value),attempt:100} as kmeanWorkerData)
    worker.onmessage = (e)=>{
       const {time,result} = e.data
       const row = document.createElement('div')
       const span_time = document.createElement('span')
       span_time.innerText = time+'ms'+',iterate:'+result.iterate_time
       console.log(e.data);
       (result.cluster_center as RGBA[])
       .map(v=>rgbaToHSLA(normalizeRGBA(v)))
       .sort(sortHSL([2,0,1,3]))
       .forEach(([h,s,l,a])=>{
        const css_color = `hsla(${h}deg,${s*100}%,${l*100}%,${a})`
        const new_div = document.createElement('div')
        new_div.classList.add('color-block')
        new_div.style.backgroundColor = css_color
        row?.append(new_div)
    })
    row.append(span_time)

    div_result?.append(row)
    }  
    })
    
    
    
}
function cleanResult(){
    document.querySelectorAll('#result *').forEach(node=>node.remove())
}
(document.getElementById('run') as HTMLButtonElement).onclick=run