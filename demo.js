import PenTool from './index.esm.js'

let pen = new PenTool("canvas", {
    pathFillColor: 'red',
    isFillPath: true
});
document.getElementById("btn").addEventListener("click", event => {
    pen.enablePen();
})
