import './dist/penTool.all.js'
// import Pen from './output/penTool.js'

let pen = new Pen("canvas", {
    pathFillColor: 'red',
    isFillPath: true
});
document.getElementById("btn").addEventListener("click", event => {
    pen.enablePen();
})
