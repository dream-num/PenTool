import CONST from './constant.js';
import CURSOR_CONFIG from './cursorConfig.js';
class PenObject {
    constructor(options = {}) {
        /**
         * Identify the object as an auxiliary point or line of the path
         * Since js does not support static attributes,
         * this attribute will be used as read-only. Please do not modify during use
         */
        // static penType: string = CONST.OBJECT_TYPE.PEN_AUX;
        this.penType = CONST.OBJECT_TYPE.PEN_AUX;
        /**
         * property of the Canvas 2D API specifies the color, gradient, or pattern
         * to use for the strokes (outlines) around shapes.
         */
        this.stroke = '#ff56b1';
        /**
         * property of the Canvas 2D API specifies the color, gradient, or pattern
         * to use inside shapes.
         */
        this.fill = '#006cff';
        /**
         * property of the Canvas 2D API sets the thickness of lines.
         */
        this.lineWidth = 1;
        this.penType = CONST.OBJECT_TYPE.PEN_AUX;
        this.stroke = options.stroke || '#ff56b1';
        this.fill = options.fill || '#006cff';
        this.lineWidth = options.lineWidth || 1;
    }
}
/**
 * aux Circle of penTool
 */
class PenCircle extends PenObject {
    constructor(options = {}) {
        super(options);
        /**
         * Radius of Circle
         */
        this.radius = 3;
        /**
         * property of the Canvas 2D API specifies the color, gradient, or pattern
         * to use for the strokes (outlines) around shapes.
         */
        this.stroke = '#006cff';
        /**
         * property of the Canvas 2D API specifies the color, gradient, or pattern
         * to use inside shapes.
         */
        this.fill = '#fff';
        this.x = options.x;
        this.y = options.y;
        this.radius = options.radius || 3;
        this.keyPointIndex = options.keyPointIndex;
        this.handleName = options.handleName;
        this.fill = options.fill || '#fff';
        this.stroke = options.stroke || '#006cff';
        this.type = CONST.OBJECT_TYPE.CIRCLE;
    }
}
/**
 * aux Line of penTool
 */
class PenLine extends PenObject {
    constructor(options = {}) {
        super(options);
        this.x1 = options.x1;
        this.y1 = options.y1;
        this.x2 = options.x2;
        this.y2 = options.y2;
        this.type = CONST.OBJECT_TYPE.LINE;
    }
}
/**
 * declare path keyPoint Class
 */
class KeyPoint {
    constructor({ type, point, pointType, relationPoints, keyPointIndex, controller1, controller2, auxLine1, auxLine2, handleName } = {}) {
        /**
         * Indicate the relationship between current keyPoint and previous keyPoint
         * 'straight' means drawing a Line from previous to current
         * 'mirrored' means drawing a curve. Cause there will be 2 handlers which are mirror symmetry centered on current keyPoint and in a straight line
         * 'disjointed' means the curve's handlers are not in a straight line
         * @default 'straight'
         */
        this.pointType = CONST.POINT_TYPE.STRAIGHT;
        this.type = type;
        this.point = point;
        this.pointType = pointType || CONST.POINT_TYPE.STRAIGHT;
        this.relationPoints = relationPoints || [];
        this.keyPointIndex = keyPointIndex;
        this.controller1 = controller1;
        this.controller2 = controller2;
        this.auxLine1 = auxLine1;
        this.auxLine2 = auxLine2;
        this.handleName = handleName;
    }
}
/**
 * declare Pen Tool Class
 */
class Pen {
    constructor(canvasId, options) {
        /**
         * Whether the penTool's edit mode is opened. Default false.
         */
        this.penModeOn = false;
        /**
         * Store final path keyPoints data.
         */
        this.keyPointData = [];
        /**
         * Store the real path keyPoints data, cause it's different from keyPointData when mousemove.
         */
        this.keyPointDataCache = [];
        /**
         * Whether the path is closed
         */
        this.closeState = false;
        /**
         * Whether the real-path is closed.
         * Fill the path containing area when cursor position and path start-point coincide during mousemoving (but not mouseup).
         */
        this.cacheCloseState = false;
        /**
         * Whether the mousedown event is triggered
         */
        this.penMouseDown = false;
        /**
         * Custom setting options
         */
        this.options = {
            circle: new PenCircle(),
            line: new PenLine(),
            pathColor: '#000',
            pathFillColor: '#ebebeb',
            isFillPath: false
        };
        /**
         * Collection of objects drawn on canvas
         */
        this.objects = [];
        /**
         * Whether edit the keyPoint position
         */
        this.isEdit = false;
        try {
            if (!canvasId) {
                console.error("PenTool must based a canvas, please confirm that the canvasId is passed.");
            }
            else {
                this.canvas = document.getElementById(canvasId);
                this.canvasCtx = this.canvas.getContext('2d');
                this.options = Object.assign({
                    circle: new PenCircle(),
                    line: new PenLine(),
                    pathColor: '#000',
                    pathFillColor: '#ebebeb' // default pathFillColor
                }, options);
                // fire mouse event
                this._mouseDown();
                this._mouseMove();
                this._mouseUp();
                this._keydown();
                this._mouseDblclick();
            }
        }
        catch (error) {
            console.error(error.message);
        }
    }
    /**
     * Open drawing mode
     */
    enablePen() {
        this.penModeOn = true;
        this.setCursor(CONST.CURSOR_TYPE.NORMAL);
    }
    /**
     * Exist drawing mode
     * The first call sets currentKeyPointIndex to null and set keyPoint editable
     * The second call removes auxPoints and auxLines
     */
    existPenMode() {
        if (this.currentKeyPointIndex != null) {
            this.currentKeyPointIndex = null;
            this.isEdit = true; // set editable
            this.setCursor(CONST.CURSOR_TYPE.NORMAL);
            this.refreshEditPath();
        }
        else {
            this.penModeOn = false;
            if (this.pathRealObject) {
                // remove auxPoint and auxLine
                let auxPointAndLines = this.objects.filter((object) => {
                    return object.penType === CONST.OBJECT_TYPE.PEN_AUX;
                });
                this.removeObjects(...auxPointAndLines);
            }
            this.setCursor(CONST.CURSOR_TYPE.DEFAULT);
            // reset params
            this.currentKeyPointIndex = null;
            this.isEdit = false;
        }
        this.refreshRender();
    }
    /**
     * Set cursor style
     * @param type cursor type
     */
    setCursor(type) {
        if (type === CONST.CURSOR_TYPE.DEFAULT) {
            this.canvas.style.cursor = 'default';
        }
        else {
            this.canvas.style.cursor = `url(${CURSOR_CONFIG[type]}), default`;
        }
    }
    /**
     * fire mousedown event
     */
    _mouseDown() {
        this.canvas.addEventListener("mousedown", event => {
            if (this.penModeOn) {
                this._penMouseDown(event);
            }
        });
    }
    /**
     * fire mouseMove event
     */
    _mouseMove() {
        this.canvas.addEventListener("mousemove", event => {
            if (this.penModeOn) {
                if (this.penMouseDown) {
                    this.setCursor(CONST.CURSOR_TYPE.MOVE);
                }
                this._penMouseMove(event);
            }
        });
    }
    /**
     * fire mouseup event
     */
    _mouseUp() {
        this.canvas.addEventListener("mouseup", event => {
            if (this.penModeOn) {
                this.setCursor(CONST.CURSOR_TYPE.NORMAL);
                this._penMouseUp(event);
            }
        });
    }
    /**
     * fire path double click event
     */
    _mouseDblclick() {
        this.canvas.addEventListener("dblclick", event => {
            if (this.penModeOn) {
                let target = this._getMouseOverTarget(event);
                if (target && target.penType === CONST.OBJECT_TYPE.PEN_AUX && target.handleName == null) {
                    this.changeKeyPointType(target);
                    this.refreshRender();
                }
            }
            else {
                let point = {
                    x: event.offsetX,
                    y: event.offsetY
                }, path = new Path2D(this.realPathStr), isInPath = this.canvasCtx.isPointInPath(path, point.x, point.y);
                if (isInPath) {
                    this.setCursor(CONST.CURSOR_TYPE.NORMAL);
                    this.generateEditablePath();
                }
            }
        });
    }
    /**
     * fire keydown event
     * Support to press ESC to exit drawing mode
     */
    _keydown() {
        // Set the tabIndex value of canvas so that canvas can get focus. Only in this way can canvas respond to keyboard events
        this.canvas.setAttribute("tabIndex", "0");
        this.canvas.addEventListener("keydown", event => {
            if (this.penModeOn) {
                if (event.keyCode === 27) {
                    this.existPenMode();
                }
            }
        });
    }
    /**
     * Implementation of MouseDown
     * @param event
     */
    _penMouseDown(event) {
        let target = this._getMouseOverTarget(event), x = event.offsetX, y = event.offsetY, index;
        this.penMouseDown = true;
        this.mousedownTarget = target;
        this.keyPointDataCache = null;
        this.penMouseMoveFix = { x, y };
        // update aux point fill color
        this._matchObjectsByProrerty("penType", CONST.OBJECT_TYPE.PEN_AUX, (object) => {
            object.fill = "#fff";
        });
        // checks if the target is aux point
        if (target !== null && target.penType === CONST.OBJECT_TYPE.PEN_AUX) {
            index = target.keyPointIndex;
            // fill the aux point 
            target.fill = target.stroke;
            /**
             * When the first and the last keyPoint coincide, the path is closed.
             * Path is closed, set keyPoints editable.
             */
            if (this.keyPointData.length > 1 && this.currentKeyPointIndex === this.keyPointData.length - 1 && index === 0) {
                this.closeState = true;
            }
            if (this.closeState || index !== this.keyPointData.length - 1) {
                this.isEdit = true;
            }
            this.currentKeyPointIndex = index;
            this.setMousedownOrigin();
            this.refreshEditPath();
            return;
        }
        /**
         * Normally, add keyPoint
         */
        if (this.keyPointData.length === 0 || this.currentKeyPointIndex === this.keyPointData.length - 1 && !this.closeState) {
            let keyPoint;
            // first keyPoint, set type 'M'
            if (this.keyPointData.length === 0) {
                keyPoint = new KeyPoint({
                    type: 'M',
                    point: { x, y },
                    pointType: CONST.POINT_TYPE.STRAIGHT,
                    relationPoints: [x, y],
                    keyPointIndex: this.keyPointData.length
                });
            }
            else {
                let preKeyPoint = this.keyPointData[this.keyPointData.length - 1], preLeft = preKeyPoint.point.x, preTop = preKeyPoint.point.y;
                if (preKeyPoint.pointType !== CONST.POINT_TYPE.STRAIGHT) {
                    preLeft = preKeyPoint.controller2.x;
                    preTop = preKeyPoint.controller2.y;
                }
                keyPoint = new KeyPoint({
                    type: 'C',
                    point: { x, y },
                    pointType: CONST.POINT_TYPE.STRAIGHT,
                    relationPoints: [preLeft, preTop, x, y, x, y],
                    keyPointIndex: this.keyPointData.length
                });
            }
            let circle = new PenCircle({
                x: x,
                y: y,
                keyPointIndex: keyPoint.keyPointIndex,
                fill: this.options.circle.fill,
                stroke: this.options.circle.stroke
            });
            this.addCanvasObjects(circle);
            this.keyPointData.push(keyPoint);
            this.currentKeyPointIndex = this.keyPointData.length - 1;
            this.refreshEditPath();
            // add new keyPoint, set state
            this.keyPointState = CONST.PATH_STATE.NEW;
        }
        // clickoutside or 'ESC' keypress to exit penmode when editmode
        else if (this.currentKeyPointIndex == null) {
            this.existPenMode();
        }
        // first time: clickoutside or 'ESC' keypress set edit mode and reset currentKeyPointIndex
        else if (this.keyPointData.length > 0 && (this.closeState || this.currentKeyPointIndex !== this.keyPointData.length - 1)) {
            this.currentKeyPointIndex = null;
            this.isEdit = true;
        }
        this.refreshRender();
    }
    /**
     * Implementation of MouseMove
     * @param event
     */
    _penMouseMove(event) {
        let x = event.offsetX, y = event.offsetY, target = this._getMouseOverTarget(event);
        if (!this.isEdit) {
            // keep mousedown and mousemoving will draw a curve on canvas when current keyPoint is new
            if (this.keyPointState === CONST.PATH_STATE.NEW) {
                if (Math.abs(this.penMouseMoveFix.x - x) > 2 || Math.abs(this.penMouseMoveFix.y - y) > 2) {
                    this.changeKeyPointPos(x, y, CONST.CONTROL_TYPE.RIGHT);
                }
            }
            else {
                /**
                 * when target is keyPoint
                 * 1. target is not start or
                 * 2. the path is closed or
                 * 3. target is start but currentkeyPointIndex is not the last keyPoint's index(otherwise the path is closed).
                 */
                if (target != null && target.penType === CONST.OBJECT_TYPE.PEN_AUX && (target.keyPointIndex !== 0 || this.closeState || (target.keyPointIndex === 0 && this.currentKeyPointIndex !== this.keyPointData.length - 1))) {
                    if (!this.penMouseDown) {
                        this.setCursor(CONST.CURSOR_TYPE.MOVE);
                    }
                }
                else {
                    this.setCursor(CONST.CURSOR_TYPE.NORMAL);
                    if (this.currentKeyPointIndex === this.keyPointData.length - 1 && !this.closeState) {
                        let keyPoint, prev = this.keyPointData[this.currentKeyPointIndex], prevLeft, prevTop;
                        if (this.keyPointDataCache == null) {
                            this.keyPointDataCache = JSON.parse(JSON.stringify(this.keyPointData));
                            this.keyPointDataCache.push(new KeyPoint());
                        }
                        else {
                            this.cacheCloseState = false;
                        }
                        if (this.keyPointData[this.currentKeyPointIndex].type === "M") {
                            prevLeft = prev.relationPoints[0];
                            prevTop = prev.relationPoints[1];
                        }
                        else {
                            prevLeft = prev.relationPoints[4];
                            prevTop = prev.relationPoints[5];
                        }
                        if (prev.pointType !== CONST.POINT_TYPE.STRAIGHT) {
                            prevLeft = prev.controller2.x;
                            prevTop = prev.controller2.y;
                        }
                        keyPoint = new KeyPoint({
                            type: "C",
                            point: { x, y },
                            pointType: CONST.POINT_TYPE.STRAIGHT,
                            relationPoints: [prevLeft, prevTop, x, y, x, y],
                            keyPointIndex: this.keyPointDataCache.length - 1
                        });
                        this.keyPointDataCache[this.keyPointDataCache.length - 1] = keyPoint;
                        // path closed
                        if (this.keyPointData.length > 1 && target !== null && target.penType === CONST.OBJECT_TYPE.PEN_AUX && target.keyPointIndex === 0) {
                            this.cacheCloseState = true;
                            this.setCursor(CONST.CURSOR_TYPE.CLOSE);
                        }
                        else {
                            this.setCursor(CONST.CURSOR_TYPE.ADD);
                        }
                        this.refreshEditPath(true);
                    }
                }
            }
        }
        /**
         * keyPoint moving
         * alt + handler keypoint moving: change path curve
         */
        else if (this.mousedownTarget != null && this.mousedownTarget.penType === CONST.OBJECT_TYPE.PEN_AUX && this.penMouseDown) {
            let target = this.mousedownTarget;
            target.x = x;
            target.y = y;
            if (target.handleName === CONST.CONTROL_TYPE.LEFT) {
                if (event.altKey) {
                    this.changeKeyPointType(target, CONST.POINT_TYPE.DISJOINTED);
                }
                else {
                    this.changeKeyPointType(target);
                }
                this.changeKeyPointPos(x, y, CONST.CONTROL_TYPE.LEFT);
            }
            else if (target.handleName === CONST.CONTROL_TYPE.RIGHT) {
                if (event.altKey) {
                    this.changeKeyPointType(target, CONST.POINT_TYPE.DISJOINTED);
                }
                else {
                    this.changeKeyPointType(target);
                }
                this.changeKeyPointPos(x, y, CONST.CONTROL_TYPE.RIGHT);
            }
            else {
                this.changeKeyPointPos(x, y, CONST.CONTROL_TYPE.MAIN);
            }
        }
        this.refreshRender();
    }
    /**
     * Implementation of MouseUp
     * @param event
     */
    _penMouseUp(event) {
        this.penMouseDown = false;
        if (this.currentKeyPointIndex === this.keyPointData.length - 1 && !this.closeState && this.penMouseMoveFix && event.offsetX === this.penMouseMoveFix.x && event.offsetY === this.penMouseMoveFix.y) {
            this.isEdit = false;
        }
        // set main keyPoint fill
        this._matchObjectsByProrerty("penType", CONST.OBJECT_TYPE.PEN_AUX, (object) => {
            if (object.keyPointIndex === this.currentKeyPointIndex && object.handleName == null) {
                object.fill = object.stroke;
            }
        });
        /** reset params */
        this.keyPointState = null;
        this.penMouseMoveFix = null;
        this.penMouseDownOrigin = null;
        this.refreshRender();
    }
    /**
     * update keyPoint or handle point position
     * @param x mouseOffsetX relative to canvas
     * @param y mouseOffsetY relative to canvas
     * @param type control point type
     */
    changeKeyPointPos(x, y, type = CONST.CONTROL_TYPE.MAIN) {
        let index = this.currentKeyPointIndex, curKeyPoint = this.keyPointData[index], originPoint = curKeyPoint.point;
        if ((type === CONST.CONTROL_TYPE.LEFT || type === CONST.CONTROL_TYPE.RIGHT) && curKeyPoint.pointType == CONST.POINT_TYPE.STRAIGHT) {
            this.createPathCurveAux(curKeyPoint);
        }
        // keyPoint
        if (type === CONST.CONTROL_TYPE.MAIN) {
            let x1, x2, y1, y2, minulsX, minulsY;
            if (this.penMouseDownOrigin) {
                if (this.penMouseDownOrigin.x) {
                    minulsX = this.penMouseDownOrigin.x - x;
                    minulsY = this.penMouseDownOrigin.y - y;
                }
                if (this.penMouseDownOrigin.x1) {
                    x1 = this.penMouseDownOrigin.x1 - minulsX;
                    y1 = this.penMouseDownOrigin.y1 - minulsY;
                }
                if (this.penMouseDownOrigin.x2) {
                    x2 = this.penMouseDownOrigin.x2 - minulsX;
                    y2 = this.penMouseDownOrigin.y2 - minulsY;
                }
                this.updatePenPathControll(curKeyPoint, { x, y, x1, y1, x2, y2 });
            }
            originPoint.x = x;
            originPoint.y = y;
            if (curKeyPoint.type === "M") {
                curKeyPoint.relationPoints[0] = x;
                curKeyPoint.relationPoints[1] = y;
                if (index + 1 <= this.keyPointData.length - 1) {
                    let nextItem = this.keyPointData[index + 1];
                    if (curKeyPoint.pointType != CONST.POINT_TYPE.STRAIGHT) {
                        nextItem.relationPoints[0] = x2;
                        nextItem.relationPoints[1] = y2;
                    }
                    else {
                        nextItem.relationPoints[0] = x;
                        nextItem.relationPoints[1] = y;
                    }
                }
                if (curKeyPoint.pointType != CONST.POINT_TYPE.STRAIGHT) {
                    curKeyPoint.relationPoints[2] = x1;
                    curKeyPoint.relationPoints[3] = y1;
                }
                curKeyPoint.point = { x, y };
            }
            else {
                if (curKeyPoint.pointType != CONST.POINT_TYPE.STRAIGHT) {
                    curKeyPoint.relationPoints[2] = x1;
                    curKeyPoint.relationPoints[3] = y1;
                }
                else {
                    curKeyPoint.relationPoints[2] = x;
                    curKeyPoint.relationPoints[3] = y;
                }
                curKeyPoint.relationPoints[4] = x;
                curKeyPoint.relationPoints[5] = y;
                if (index + 1 <= this.keyPointData.length - 1) {
                    let nextItem = this.keyPointData[index + 1];
                    if (curKeyPoint.pointType != CONST.POINT_TYPE.STRAIGHT) {
                        nextItem.relationPoints[0] = x2;
                        nextItem.relationPoints[1] = y2;
                    }
                    else {
                        nextItem.relationPoints[0] = x;
                        nextItem.relationPoints[1] = y;
                    }
                }
                curKeyPoint.point = { x, y };
            }
        }
        // handle aux keyPoint
        else if (type === CONST.CONTROL_TYPE.LEFT || type === CONST.CONTROL_TYPE.RIGHT) {
            if (curKeyPoint.pointType == CONST.POINT_TYPE.STRAIGHT) {
                curKeyPoint.pointType = CONST.POINT_TYPE.MIRRORED;
            }
            let x1, y1, x2, y2;
            let originX = curKeyPoint.relationPoints[4], originY = curKeyPoint.relationPoints[5];
            if (curKeyPoint.type == "M") {
                originX = curKeyPoint.relationPoints[0];
                originY = curKeyPoint.relationPoints[1];
            }
            if (curKeyPoint.pointType == CONST.POINT_TYPE.MIRRORED) {
                if (type === CONST.CONTROL_TYPE.RIGHT) {
                    x1 = originX * 2 - x;
                    y1 = originY * 2 - y;
                    x2 = x;
                    y2 = y;
                }
                else {
                    x2 = originX * 2 - x;
                    y2 = originY * 2 - y;
                    x1 = x;
                    y1 = y;
                }
                this.updatePenPathControll(curKeyPoint, { x: originX, y: originY, x1, y1, x2, y2 });
                if (curKeyPoint.type === "M") {
                    if (index + 1 <= this.keyPointData.length - 1) {
                        let nextItem = this.keyPointData[index + 1];
                        nextItem.relationPoints[0] = x2;
                        nextItem.relationPoints[1] = y2;
                    }
                    if (curKeyPoint.pointType != CONST.POINT_TYPE.STRAIGHT) {
                        curKeyPoint.relationPoints[2] = x1;
                        curKeyPoint.relationPoints[3] = y1;
                    }
                }
                else {
                    curKeyPoint.relationPoints[2] = x1;
                    curKeyPoint.relationPoints[3] = y1;
                    if (index + 1 <= this.keyPointData.length - 1) {
                        var nextItem = this.keyPointData[index + 1];
                        nextItem.relationPoints[0] = x2;
                        nextItem.relationPoints[1] = y2;
                    }
                }
            }
            else if (curKeyPoint.pointType == CONST.POINT_TYPE.DISJOINTED) {
                if (type === CONST.CONTROL_TYPE.RIGHT) {
                    x2 = x;
                    y2 = y;
                    this.updatePenPathControll(curKeyPoint, { x: originX, y: originY, x2, y2 }, CONST.CONTROL_TYPE.RIGHT);
                    if (curKeyPoint.type === "M") {
                        if (index + 1 <= this.keyPointData.length - 1) {
                            let nextItem = this.keyPointData[index + 1];
                            nextItem.relationPoints[0] = x2;
                            nextItem.relationPoints[1] = y2;
                        }
                    }
                    else {
                        if (index + 1 <= this.keyPointData.length - 1) {
                            let nextItem = this.keyPointData[index + 1];
                            nextItem.relationPoints[0] = x2;
                            nextItem.relationPoints[1] = y2;
                        }
                    }
                }
                else {
                    x1 = x;
                    y1 = y;
                    this.updatePenPathControll(curKeyPoint, { x: originX, y: originY, x1, y1 }, CONST.CONTROL_TYPE.LEFT);
                    if (curKeyPoint.type === "M") {
                        if (curKeyPoint.pointType != "straight") {
                            curKeyPoint.relationPoints[2] = x1;
                            curKeyPoint.relationPoints[3] = y1;
                        }
                    }
                    else {
                        curKeyPoint.relationPoints[2] = x1;
                        curKeyPoint.relationPoints[3] = y1;
                    }
                }
            }
        }
        this.refreshEditPath();
    }
    /**
     * creating aux control handlers for curve
     * @param curKeyPoint the current operating keyPoint
     */
    createPathCurveAux(curKeyPoint) {
        let originPoint = curKeyPoint.point, x = originPoint.x, y = originPoint.y;
        let circle1 = new PenCircle({
            x,
            y,
            handleName: CONST.CONTROL_TYPE.LEFT,
            keyPointIndex: curKeyPoint.keyPointIndex,
            fill: this.options.circle.fill,
            stroke: this.options.circle.stroke,
            lineWidth: this.options.circle.lineWidth
        }), circle2 = new PenCircle({
            x,
            y,
            handleName: CONST.CONTROL_TYPE.RIGHT,
            keyPointIndex: curKeyPoint.keyPointIndex,
            fill: this.options.circle.fill,
            stroke: this.options.circle.stroke,
            lineWidth: this.options.circle.lineWidth
        }), line1 = new PenLine({
            x1: x, y1: y, x2: x, y2: y,
            stroke: this.options.line.stroke,
            lineWidth: this.options.line.lineWidth
        }), line2 = new PenLine({
            x1: x, y1: y, x2: x, y2: y,
            stroke: this.options.line.stroke,
            lineWidth: this.options.line.lineWidth
        });
        curKeyPoint.controller1 = circle1;
        curKeyPoint.controller2 = circle2;
        curKeyPoint.auxLine1 = line1;
        curKeyPoint.auxLine2 = line2;
        this.addCanvasObjects(circle1, circle2, line1, line2);
    }
    /**
     * update the handlers of the curve
     * @param item operating keyPoint
     * @param position the key coordinates. {x, y, x1, y1, x2, y2}
     * (x, y) is the main keyPoint's coordinates. (x1, y1) and (x2, y2) is the two controllers' coordinates.
     * @param type Indicates which auxLine and controller to update
     */
    updatePenPathControll(item, position, type) {
        let x = position.x, y = position.y, x1 = position.x1, y1 = position.y1, x2 = position.x2, y2 = position.y2, { controller1, controller2, auxLine1, auxLine2 } = Object.assign({}, item);
        if (type == null || type === CONST.CONTROL_TYPE.LEFT) {
            if (controller1 != null) {
                controller1.x = x1;
                controller1.y = y1;
            }
            if (auxLine1 != null) {
                auxLine1.x1 = x1;
                auxLine1.y1 = y1;
                auxLine1.x2 = x;
                auxLine1.y2 = y;
            }
        }
        if (type == null || type === CONST.CONTROL_TYPE.RIGHT) {
            if (controller2 != null) {
                controller2.x = x2;
                controller2.y = y2;
            }
            if (auxLine2 != null) {
                auxLine2.x1 = x2;
                auxLine2.y1 = y2;
                auxLine2.x2 = x;
                auxLine2.y2 = y;
            }
        }
    }
    /**
     * save the coordinate informations when mousedown
     * (x, y) is the main keyPoint's coordinate
     * (x1, y1) and (x2, y2) is the controllers' coordinate
     */
    setMousedownOrigin() {
        let curKeyPoint = this.keyPointData[this.currentKeyPointIndex], controller1 = curKeyPoint.controller1, controller2 = curKeyPoint.controller2, originPoint = curKeyPoint.point, origin = {};
        if (controller1 != null) {
            origin.x1 = controller1.x;
            origin.y1 = controller1.y;
        }
        if (controller1 != null) {
            origin.x2 = controller2.x;
            origin.y2 = controller2.y;
        }
        if (originPoint != null) {
            origin.x = originPoint.x;
            origin.y = originPoint.y;
        }
        this.penMouseDownOrigin = origin;
    }
    ;
    /**
     * update the pathObject when path is modified
     * @param isCashed whether update path with the keyPointDataCache
     */
    refreshEditPath(isCashed = false) {
        let keyPointData = this.keyPointData, closeState = this.closeState;
        if (keyPointData.length === 0)
            return;
        if (isCashed) {
            keyPointData = this.keyPointDataCache;
            closeState = this.cacheCloseState;
        }
        let pathStr = this._generatePathStr(keyPointData), fillColor = null, realPathStr = pathStr, auxPathStr = pathStr;
        if (closeState) {
            fillColor = this.options.pathFillColor;
            realPathStr += ' Z';
            isCashed ? auxPathStr += ' Z' : '';
        }
        if (this.realPathStr != null && this.realPathStr === pathStr && isCashed) {
            return;
        }
        else {
            this.realPathStr = realPathStr;
            // remove and redraw path
            let pathObjects = this.objects.filter(object => {
                return object.type === CONST.OBJECT_TYPE.PATH;
            });
            this.removeObjects(...pathObjects);
            this.pathRealObject = {
                pathStr: this.realPathStr,
                type: CONST.OBJECT_TYPE.PATH,
                fill: fillColor || '#ebebeb',
                closeState: closeState,
                index: -Infinity // path's z-index keep lowest
            };
            this.addCanvasObjects(this.pathRealObject);
        }
    }
    /**
     * generate the pathStr according to keyPointData
     * @param keyPointData
     */
    _generatePathStr(keyPointData) {
        let pathStr = "";
        keyPointData.forEach(keyPoint => {
            let pathSection = "";
            if (keyPoint.type === "M") {
                let str = `M ${keyPoint.relationPoints[0]} ${keyPoint.relationPoints[1]} `;
                pathSection += str;
            }
            else if (keyPoint.type === "C") {
                pathSection += "C ";
                keyPoint.relationPoints.forEach(value => {
                    pathSection += value + " ";
                });
            }
            pathStr += pathSection;
        });
        if (this.closeState) {
            let firstKeyPoint = keyPointData[0], lastkeyPoint = keyPointData[keyPointData.length - 1];
            pathStr += "C ";
            if (lastkeyPoint.pointType !== CONST.POINT_TYPE.STRAIGHT) {
                pathStr += `${lastkeyPoint.controller2.x} ${lastkeyPoint.controller2.y} `;
            }
            else {
                pathStr += `${lastkeyPoint.relationPoints[4]} ${lastkeyPoint.relationPoints[5]} `;
            }
            if (firstKeyPoint.pointType !== CONST.POINT_TYPE.STRAIGHT) {
                pathStr += `${firstKeyPoint.relationPoints[2]} ${firstKeyPoint.relationPoints[3]} `;
            }
            else {
                pathStr += `${firstKeyPoint.relationPoints[0]} ${firstKeyPoint.relationPoints[1]} `;
            }
            pathStr += `${firstKeyPoint.relationPoints[0]} ${firstKeyPoint.relationPoints[1]} `;
        }
        return pathStr;
    }
    /**
     * refresh and redraw the canvas
     */
    refreshRender() {
        this.canvasCtx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this._matchObjectsByProrerty("penType", CONST.OBJECT_TYPE.PEN_AUX, (object) => {
            if (object.type === CONST.OBJECT_TYPE.CIRCLE) {
                this._bringToFront(object);
            }
        });
        this.drawObjects(this.objects || []);
    }
    /**
     * drawing object on canvas
     * @param objects objects to be drawing
     */
    drawObjects(objects) {
        objects.forEach(object => {
            switch (object.type) {
                case CONST.OBJECT_TYPE.CIRCLE:
                    this.drawCircle(object);
                    break;
                case CONST.OBJECT_TYPE.LINE:
                    this.drawLine(object);
                    break;
                case CONST.OBJECT_TYPE.PATH:
                    this.drawPath(object);
                    break;
                default:
                    break;
            }
        });
    }
    /**
     * draw circle on canvas
     * @param options config of circle
     */
    drawCircle(options) {
        this.canvasCtx.fillStyle = options.fill;
        this.canvasCtx.strokeStyle = options.stroke;
        this.canvasCtx.beginPath();
        this.canvasCtx.arc(options.x, options.y, options.radius, 0, 2 * Math.PI);
        this.canvasCtx.fill();
        this.canvasCtx.stroke();
    }
    /**
     * draw path on canvas
     * @param options config of circle
     */
    drawPath(options) {
        this.canvasCtx.fillStyle = this.options.pathFillColor;
        this.canvasCtx.strokeStyle = this.options.pathColor;
        this.canvasCtx.beginPath();
        let path = new Path2D(this.realPathStr);
        this.canvasCtx.stroke(path);
        if (options.closeState) {
            /**
             * keyPointDataCache is null indicate that the drawing is completed.
             */
            if (!this.keyPointDataCache && this.options.isFillPath) {
                this.canvasCtx.fill(path);
            }
            /**
             * when drawing uncomplete, the cache path closed, then fill
             */
            else if (this.keyPointDataCache && this.keyPointData.length !== this.keyPointDataCache.length) {
                this.canvasCtx.fill(path);
            }
        }
    }
    /**
     * draw straight line on canvas
     * @param options config of circle
     */
    drawLine(options) {
        this.canvasCtx.fillStyle = options.fill;
        this.canvasCtx.strokeStyle = options.stroke;
        // this.canvasCtx.lineWidth = 5;
        this.canvasCtx.beginPath();
        this.canvasCtx.moveTo(options.x1, options.y1);
        this.canvasCtx.lineTo(options.x2, options.y2);
        this.canvasCtx.stroke();
    }
    /**
     * Add objects to Pen instance for rendering
     * @param objects objects for rendering
     * @returns returns adding objects
     */
    addCanvasObjects(...objects) {
        objects.forEach(object => {
            if (object.index == null) {
                object.index = this.objects.length;
            }
            this.objects.push(object);
        });
        return objects;
    }
    /**
     * remove objects from Pen instance
     * @param objects objects to remove
     */
    removeObjects(...objects) {
        objects.forEach(object => {
            this.removeSingleObject(object);
        });
    }
    /**
     * match currect object and remove it from instance
     * @param object object to remove
     */
    removeSingleObject(object) {
        for (let i = this.objects.length - 1; i >= 0; i--) {
            const item = this.objects[i];
            if (item === object) {
                this.objects.splice(i, 1);
                break;
            }
        }
    }
    /**
     * Get the mouseover target
     * @param event
     */
    _getMouseOverTarget(event) {
        let point = {
            x: event.offsetX,
            y: event.offsetY
        }, target = null;
        // sort objects by index
        this.objects.sort((a, b) => {
            return a - b;
        });
        for (let i = this.objects.length - 1; i >= 0; i--) {
            const object = this.objects[i];
            if (this._containsPoint(point, object)) {
                target = object;
                break;
            }
        }
        return target;
    }
    /**
     * Checks if point is inside the object
     * @param point target point, always mouse position
     * @param object target object
     */
    _containsPoint(point, object) {
        if (!object.type)
            return false;
        if (object.type === CONST.OBJECT_TYPE.CIRCLE) {
            let radius = object.radius, x = object.x, y = object.y;
            return point.x <= x + radius && point.x >= x - radius
                && point.y <= y + radius && point.y >= y - radius;
        }
        else if (object.type === CONST.OBJECT_TYPE.LINE) {
            // calculate the slope of line
            let slope = (object.y1 - object.y2) / (object.x1 - object.x2), slope2 = (point.y - object.y1) / (point.x - object.x1);
            // slope is equal and the point coordinate is included in the line area indicate collinearity
            return slope === slope2 &&
                (point.x >= object.x1 && point.x <= object.x2 && point.y >= object.y1 && point.y <= object.y2 ||
                    point.x >= object.x2 && point.x <= object.x1 && point.y >= object.y2 && point.y <= object.y1);
        }
        else if (object.type === CONST.OBJECT_TYPE.PATH) {
            let path = new Path2D(object.pathStr);
            return this.canvasCtx.isPointInStroke(path, point.x, point.y);
        }
        return false;
    }
    /**
     * Matches the object with the specified property name and value, and then performs the callback
     * @param key property name
     * @param value property value
     * @param callback callback function
     */
    _matchObjectsByProrerty(key, value, callback) {
        let objects = this.objects;
        objects.forEach(object => {
            // match object
            if (object[key] === value) {
                callback(object);
            }
        });
    }
    /**
     * Put the object at the end of the array to make canvas draw last
     * so as to achieve the purpose of the object at the top after drawing
     * @param object
     */
    _bringToFront(object) {
        object.index = Infinity; // Make sure the index is the largest
        // resort objects and set index
        this.objects.sort((a, b) => {
            return a.index - b.index;
        });
        this.objects.forEach((item, index) => {
            item.index = index;
        });
    }
    /**
     * change the keyPoint type when dblclick on the keyPoint
     * when keyPoint is the straight line keyPoint, it will be a curve keyPoint after dblclick
     * when keyPoint is the curve keyPoint, it will be a straight line keyPoint after dblclick
     * @param target
     * @param pointType the pointType attribute of current operating keyPoint
     */
    changeKeyPointType(target, pointType) {
        let index = target.keyPointIndex, curPoint = this.keyPointData[index], typelist = Object.assign({}, CONST.POINT_TYPE);
        if (!(pointType == null || (curPoint.pointType === CONST.POINT_TYPE.STRAIGHT && pointType in typelist) || (pointType === CONST.POINT_TYPE.STRAIGHT && curPoint.pointType in typelist))) {
            curPoint.pointType = pointType;
            return;
        }
        if (curPoint.controller1 == null) {
            this.createPathCurveAux(curPoint);
            curPoint.pointType = pointType || CONST.POINT_TYPE.MIRRORED;
            let preItem, // previous keyPoint to target
            nextItem, // next keyPoint to target
            preX, // previous keyPoint's coordinate
            preY, // previous keyPoint's coordinate
            nextX, // next keyPoint's coordinate
            nextY, // next keyPoint's coordinate
            x, // current keyPoint's coordinate
            y, // current keyPoint's coordinate
            radian, // the radian corresponding to the inclination angle of the line between two points
            hypotenuse, // the hypotenuse of a right triangle made up of two points
            x1, x2, y1, y2;
            if (target.keyPointIndex === 0) {
                preItem = this.keyPointData[this.keyPointData.length - 1];
            }
            else {
                preItem = this.keyPointData[target.keyPointIndex - 1];
            }
            if (target.keyPointIndex === this.keyPointData.length - 1) {
                nextItem = this.keyPointData[0];
            }
            else {
                nextItem = this.keyPointData[target.keyPointIndex + 1];
            }
            preX = preItem.point.x,
                preY = preItem.point.y,
                nextX = nextItem.point.x,
                nextY = nextItem.point.y,
                x = curPoint.point.x,
                y = curPoint.point.y;
            radian = Math.atan2(nextY - preY, nextX - preX),
                // The half of the hypotenuse of the right triangle formed by the coordinates of the previous and next keyPoint is used as the base of the offset when calculating the coordinates of the control point
                hypotenuse = Math.sqrt(Math.pow(nextX - preX, 2) + Math.pow(nextY - preY, 2)) / 2;
            x1 = Math.round(x - hypotenuse * Math.cos(radian)),
                y1 = Math.round(y - hypotenuse * Math.sin(radian)),
                x2 = Math.round(x + hypotenuse * Math.cos(radian)),
                y2 = Math.round(y + hypotenuse * Math.sin(radian));
            this.updatePenPathControll(curPoint, { x, y, x1, y1, x2, y2 });
            if (index + 1 <= this.keyPointData.length - 1) {
                let nextItem = this.keyPointData[index + 1];
                nextItem.relationPoints[0] = x2;
                nextItem.relationPoints[1] = y2;
            }
            curPoint.relationPoints[2] = x1;
            curPoint.relationPoints[3] = y1;
        }
        else {
            this.removeObjects(curPoint.controller1, curPoint.controller2, curPoint.auxLine1, curPoint.auxLine2);
            delete curPoint.controller1,
                delete curPoint.controller2,
                delete curPoint.auxLine1,
                delete curPoint.auxLine2;
            curPoint.pointType = CONST.POINT_TYPE.STRAIGHT;
            let x = curPoint.point.x, y = curPoint.point.y;
            if (curPoint.pointType === "M") {
                if (curPoint.relationPoints.length > 2) {
                    curPoint.relationPoints.splice(-2, 2);
                }
            }
            else {
                curPoint.relationPoints[2] = x;
                curPoint.relationPoints[3] = y;
            }
            if (index + 1 <= this.keyPointData.length - 1) {
                let nextItem = this.keyPointData[index + 1];
                nextItem.relationPoints[0] = x;
                nextItem.relationPoints[1] = y;
            }
        }
        this.refreshEditPath();
    }
    /**
     * generate the path with keyPoints and handlers
     */
    generateEditablePath() {
        this.penModeOn = true;
        // reset objects
        this.objects = [];
        // generate keyPoints and aux
        this.generateAuxPointLine(this.keyPointData);
        // generate pathstr
        this.refreshEditPath();
        this.refreshRender();
    }
    /**
     * generate the aux keyPoints and handlers to render
     * @param keyPointData collection of path's keyPoints
     */
    generateAuxPointLine(keyPointData = []) {
        if (keyPointData.length === 0)
            return;
        keyPointData.forEach((keyPoint, index) => {
            let x = keyPoint.point.x, y = keyPoint.point.y, circle = new PenCircle({
                x,
                y,
                keyPointIndex: keyPoint.keyPointIndex,
                fill: this.options.circle.fill,
                stroke: this.options.circle.stroke
            });
            this.addCanvasObjects(circle); // add keyPoint
            // when curve, add handlers 
            if (keyPoint.pointType !== CONST.POINT_TYPE.STRAIGHT) {
                this.addCanvasObjects(keyPoint.auxLine1, keyPoint.auxLine2, keyPoint.controller1, keyPoint.controller2);
            }
        });
    }
}
export default Pen;
