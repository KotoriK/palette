function t(t){return new Promise((n,e)=>{t.addEventListener("load",t=>{n(t)}),t.addEventListener("error",t=>{e(t)})})}function n(t){return r(l,t)}function e(t){return r(c,t)}function r(t,n){const{naturalWidth:e,naturalHeight:r}=n,o=t(e,r);return null==o||o.drawImage(n,0,0,e,r),null==o?void 0:o.getImageData(0,0,e,r)}function o(t,n){return a(l,t,n)}function u(t,n){return a(c,t,n)}function a(t,n,e){const{naturalWidth:r,naturalHeight:o}=n,u=r*o/e;if(u>1){const e=r/Math.sqrt(u),a=o/Math.sqrt(u),l=t(e,a);return null==l||l.drawImage(n,0,0,e,a),null==l?void 0:l.getImageData(0,0,e,a)}{const e=t(r,o);return null==e||e.drawImage(n,0,0),null==e?void 0:e.getImageData(0,0,r,o)}}function l(t,n){const e=document.createElement("canvas"),r=e.getContext("2d");return e.height=n,e.width=t,r}function c(t,n){return new OffscreenCanvas(t,n).getContext("2d")}function i(t){const{data:n}=t,e=[];for(let t=0;t<n.length;t+=4)e.push(n.slice(t,t+4));return e}function s(t,n){const e=t[0]-n[0],r=t[1]-n[1],o=t[2]-n[2],u=t[3]-n[3];return Math.sqrt(e*e+r*r+o*o+u*u)}function f(t){return t.map(t=>t/255)}function h(t){let n,e;const[r,o]=function([t,n,e]){return t>n?n>e?[t,e]:t>e?[t,n]:[e,n]:n>e?e>t?[n,t]:[n,e]:[e,t]}(t),u=r-o,a=r+o;if(0==u)n=0,e=0;else{if(r==t[0]){const e=60*(t[1]-t[2])/u;n=e<0?e+360:e}else n=r==t[1]?60*(t[2]-t[0])/u+120:60*(t[0]-t[1])/u+240;e=0==a?0:a<=1?u/a:u/(2-a)}return[n,e,a/2,t[3]]}const d=(t=[0,1,2,3])=>(n,e)=>{let r;for(const o of t)if(r=n[o]-e[o],0!=r)return r;return r},g=([t,n,e,r])=>`hsla(${t}deg,${100*n}%,${100*e}%,${r})`,m=t=>`rgba(${t.map(t=>Math.floor(t)).join(",")})`;function p(t,n,e){const r=[],o=[],u=[];let a=0;for(let e=0;e<n;e++)r.push(t[Math.floor(Math.random()*t.length)]),u.push(v(0,5));for(;a<e;){for(let e=0;e<t.length;e++){const o=t[e];let a=0,l=s(o,r[0]);for(let t=1;t<n;t++){const n=s(o,r[t]);n<l&&(l=n,a=t)}const c=u[a];c[0]+=o[0],c[1]+=o[1],c[2]+=o[2],c[3]+=o[3],c[4]++}let e=0;for(let a=0;a<n;a++){const n=u[a],l=n[4];o[a]=0==l?t[Math.floor(Math.random()*t.length)]:[n[0]/l,n[1]/l,n[2]/l,n[3]/l],e+=s(r[a],o[a])}if(e<=1)return{cluster_center:o,iterate_time:a,fit_thresold:!0,label:u.map(t=>t[4]),size:t.length};M(o,r),a++;for(let t=0;t<n;t++){const n=u[t];n[0]=0,n[1]=0,n[2]=0,n[3]=0,n[4]=0}}return{cluster_center:r,iterate_time:a,fit_thresold:!1,label:u.map(t=>t[4]),size:t.length}}function M(t,n){for(let e=0;e<t.length;e++)n[e]=t[e]}function v(t,n){const e=[];for(let r=0;r<n;r++)e.push(t);return e}export{t as awaitImage,s as euclidean_distance,g as hslaCSSText,p as kmeans,f as normalizeRGBA,n as readImage,e as readImageAsync,o as readImageDownsampling,u as readImageDownsamplingAsync,m as rgbaCSSText,h as rgbaToHSLA,d as sortHSL,i as toPixel};
//# sourceMappingURL=index.modern.js.map
