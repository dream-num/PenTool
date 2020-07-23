# pen-tool

[English](./README.md) | 简体中文

## 概述

基于canvas的路径绘制工具。
背景：在经常遇到的h5编辑器中，总有各式各样的组件，但是遍寻市面上大多数h5编辑器，没有找到一个满意的轻量级的路径绘制工具，于是决心自己根据现有的想法开发一个。考虑到typescript相对于js的优势，本项目以ts构建。如有不完善的地方或需要新增的功能，请大家踊跃提issue。

### 目录结构
```
|-- pen-tool
    |-- lib                                 ts声明文件
    |   |-- constant.d.ts
    |   |-- cursorConfig.d.ts
    |   |-- penTool.d.ts
    |-- output                              ts编译目录
    |   |-- constant.js
    |   |-- cursorConfig.js
    |   |-- penTool.js
    |-- src                                 源文件目录
    |   |-- classes.ts
    |   |-- constant.ts
    |   |-- cursorConfig.ts
    |   |-- interface.ts
    |   |-- penTool.ts
    |-- gulpfile.js                         gulp打包配置
    |-- index.esm.js
    |-- index.umd.js
    |-- package-lock.json
    |-- package.json
    |-- README.md
    |-- README-zh.md
    |-- tsconfig.json
```

### 开发
- 编译
```
> tsc
```

- 打包
```
> gulp
```

### 使用方式
#### cdn 引入
```
...
<head>
    <script type="text/javascript" src="index.umd.js"></script>
</head>
<body>
    <button id="btn">EnablePen</button>
    <canvas id="canvas" width="600" height="400"></canvas>
</body>
...

<script>
    let pen = new PenTool("canvas");
    document.getElementById("btn").addEventListener("click", function() {
        pen.enablePen();
    })
</script>
```

#### npm import
```
npm install pen-tool
```

- index.html
```
<body>
    <button id="btn">EnablePen</button>
    <canvas id="canvas" width="600" height="400"></canvas>
</body>
```
- index.js
```
import PenTool from 'pen-tool'

let pen = new PenTool("canvas", {
    pathFillColor: 'red',
    isFillPath: true
    // ...
});
document.getElementById("btn").addEventListener("click", function() {
    pen.enablePen();
})
```

### 参数说明
一般来说，路径绘制时曲线是必不可少的，但是随手绘制的贝塞尔曲线不可能一步到位。针对这个问题，我们对于曲线给出了一个调整的手柄，通过手柄控制曲线的绘制。
初始化pen-tool
```
var pen = new Pen(canvasId, options);
```
- canvasId: `string` 绘制路径的画布。请确保钢笔工具初始化时dom已存在
- options: `IPenOptions` optional
    - circle: `PenCircle` 路径关键点配置
      - radius: `number` 关键点半径
      - stroke: `String | CanvasGradient | CanvasPattern` 关键点绘制线条颜色/渐变
      - fill: `String | CanvasGradient | CanvasPattern` 关键点填充颜色/渐变
    - line: `PebLine` 曲线控制手柄线条配置
      - stroke: `String | CanvasGradient | CanvasPattern`
      - fill: `String | CanvasGradient | CanvasPattern`
    - pathColor: `string` 路径线条颜色
    - pathFillColor: `string` 路径填充颜色
    - isFillPath: `boolean` 是否填充路径，默认`false`不填充

更多详细参数信息请参见 `lib/penTool.d.ts`
  
#### 退出绘制
- 退出绘制

    在钢笔工具开启时，第一次按下`ESC`进入路径编辑模式，此时可以通过移动路径关键点来修改绘制形状; 第二次按下`ESC`或在路径编辑模式下点击空白处，退出绘制。

- 编辑路径

    已经退出绘制后想要重新编辑路径，此时只需要 *双击* 路径区域就可重新进入路径编辑模式。关于路径区域的判定请参见 [isPointInPath](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/isPointInPath)

#### 直线曲线功能
- 改变path类型

    在路径编辑模式下：双击关键点，若当前关键点为直线类型，则关键点变为曲线类型，连接前后两个关键点与当前关键点的直线为曲线，反之亦然。

- 曲线控制手柄
  
    对于曲线的控制手柄，移动手柄位置可以改变曲线的贝塞尔函数，但是控制手柄的移动会影响曲线关键点两端的路径。
    在移动手柄的同时按下`Alt`键，此时可以只控制该手柄端的曲线。

### 后续功能
当前项目只是简单的实现路径绘制与编辑，还称不上强大，我们未来还会不停地完善，当前的目标：
- [ ] 支持路径在canvas中移动
- [ ] 支持多路径绘制


### License
[MIT License](./LICENSE)

  


