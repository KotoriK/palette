# @kotorik/palette
Color Quantiliaztion in vanilla Javascript for browser/Nodejs, powered by an optimized k-means algorithm.
## Feature
### Quantilization
* Color quantilization powered by an optimized k-means algorithm. 
* Support RGBA
* Support transforming to CIE Lab before process.
### Bundle Size
* 4kB minfied ("color-space" not included)
* Support Tree Shaking
### Other
* Detailed Type definition
* Transform cluster result to CSS Text
* Work on Nodejs with ```node-canvas```
## Install
```
npm i --save @kotorik/palette
```
## Usage
```ts
import {toPixel,readImageDownsampling,kmeans} from '@kotorik/palette'
const img = document.getElementsByTagName('img')[0];
const imgData = toPixel(readImageDownsampling(img, 100 * 1000))
/**
 * transform to CIE LAB, this method only support sRGB 8-bit source image for now.
 * However you can make your own tranform method for other format and color space,
 * and pass a 'Vector4' to the function
*/
//const imgData = toPixelLAB(readImageDownsampling(img, 100 * 1000))
const result:KMeansResult = kmeans(imgData, k, attempt,thresold)

interface KMeansResult {
    /**centroids of each cluster */
    centroid: Vector4[],
    /**how many times iterated before the model fitted*/
    iteration: number,
    /**is model fitted within iteration*/
    fit: boolean,
    /**how many pixels does each cluster has*/
    label: number[]
    /**how many pixels does the input image has */
    size: number
}
```
see ```example/app.ts``` for more.
