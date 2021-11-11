import t from"color-space/rgb";import n from"color-space/xyz";import e from"color-space/lab";function r(t,n){return Math.sqrt((t[0]-n[0])**2+(t[1]-n[1])**2+(t[2]-n[2])**2+(t[3]-n[3])**2)}function o(t,n,e,o=1){const u=[],c=[],i=[];let f=0;for(let e=0;e<n;e++)u.push(t[Math.floor(Math.random()*t.length)]),i.push(l(0,5));for(;f<e;){for(let e=0;e<t.length;e++){const o=t[e];let a=0,l=r(o,u[0]);for(let t=1;t<n;t++){const n=r(o,u[t]);n<l&&(l=n,a=t)}const c=i[a];c[0]+=o[0],c[1]+=o[1],c[2]+=o[2],c[3]+=o[3],c[4]++}let e=0;for(let o=0;o<n;o++){const n=i[o],a=n[4];c[o]=0==a?t[Math.floor(Math.random()*t.length)]:[n[0]/a,n[1]/a,n[2]/a,n[3]/a],e+=r(u[o],c[o])}if(e<=o)return{centroid:c,iteration:f,fit:!0,label:i.map(t=>t[4]),size:t.length};a(c,u),f++;for(let t=0;t<n;t++){const n=i[t];n[0]=0,n[1]=0,n[2]=0,n[3]=0,n[4]=0}}return{centroid:u,iteration:f,fit:!1,label:i.map(t=>t[4]),size:t.length}}function a(t,n){for(let e=0;e<t.length;e++)n[e]=t[e]}function l(t,n){const e=[];for(let r=0;r<n;r++)e.push(t);return e}function u(t,n){const e=document.createElement("canvas"),r=e.getContext("2d");return e.height=n,e.width=t,r}function c(t,n){return new OffscreenCanvas(t,n).getContext("2d")}function i(t){return new Promise((n,e)=>{t.addEventListener("load",t=>{n(t)}),t.addEventListener("error",t=>{e(t)})})}function f(t){return h(u,t)}function s(t){return h(c,t)}function h(t,n){const{naturalWidth:e,naturalHeight:r}=n,o=t(e,r);return null==o||o.drawImage(n,0,0,e,r),null==o?void 0:o.getImageData(0,0,e,r)}function g(t,n){return m(u,t,n)}function d(t,n){return m(c,t,n)}function m(t,n,e){const{naturalWidth:r,naturalHeight:o}=n,a=r*o/e;if(a>1){const e=r/Math.sqrt(a),l=o/Math.sqrt(a),u=t(e,l);return null==u||u.drawImage(n,0,0,e,l),null==u?void 0:u.getImageData(0,0,e,l)}{const e=t(r,o);return null==e||e.drawImage(n,0,0),null==e?void 0:e.getImageData(0,0,r,o)}}function p(t){const{data:n}=t,e=[];for(let t=0;t<n.length;t+=4)e.push(n.slice(t,t+4));return e}function M(t){return t.map(t=>t/255)}function b(t){let n,e;const[r,o]=function([t,n,e]){return t>n?n>e?[t,e]:t>e?[t,n]:[e,n]:n>e?e>t?[n,t]:[n,e]:[e,t]}(t),a=r-o,l=r+o;if(0==a)n=0,e=0;else{if(r==t[0]){const e=60*(t[1]-t[2])/a;n=e<0?e+360:e}else n=r==t[1]?60*(t[2]-t[0])/a+120:60*(t[0]-t[1])/a+240;e=0==l?0:l<=1?a/l:a/(2-l)}return[n,e,l/2,t[3]]}const v=(t=[0,1,2,3])=>(n,e)=>{let r;for(const o of t)if(r=n[o]-e[o],0!=r)return r;return r},w=([t,n,e,r])=>`hsla(${t}deg,${100*n}%,${100*e}%,${r})`,x=t=>`rgba(${t.map(t=>Math.floor(t)).join(",")})`;function I(e){const{data:r}=e,o=[];for(let e=0;e<r.length;e+=4){const a=r.slice(e,e+4),l=a[3],u=a.slice(0,3),c=t.xyz(u),i=n.lab(c);o.push([...i,l])}return o}function z(t){const r=t.slice(0,3),o=t[3],a=e.xyz(r);return[...n.rgb(a),o]}export{i as awaitImage,w as hslaCSSText,o as kmeans,z as labaToRGBA,M as normalizeRGBA,f as readImage,s as readImageAsync,g as readImageDownsampling,d as readImageDownsamplingAsync,x as rgbaCSSText,b as rgbaToHSLA,v as sortHSL,p as toPixel,I as toPixelLAB};
//# sourceMappingURL=index.modern.js.map
