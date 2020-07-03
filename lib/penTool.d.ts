/**
 * declare Interface of Point
 */
interface IPoint {
    /**
     * X coordinate of point
     */
    x: number;
    /**
     * X coordinate of point
     */
    y: number;
}
/**
 * the curve handler endpoint
 */
interface IController extends IPoint {
}
interface IPenOptions {
    /**
     * Settings of the aux point
     */
    circle: PenCircle;
    /**
     * Settings of the aux line
     */
    line: PenLine;
    /**
     * the stroke color of the pen path
     */
    pathColor: string;
    /**
     * the fill color of the pen path when the path is closed
     */
    pathFillColor: string;
    /**
     * Whether need fill the path, when true, fill path with pathFillColor
     */
    isFillPath: boolean;
}
declare class PenObject {
    /**
     * Identify the object as an auxiliary point or line of the path
     * Since js does not support static attributes,
     * this attribute will be used as read-only. Please do not modify during use
     */
    penType: string;
    /**
     * The type of drawing object.
     * Since js does not support static attributes,
     * this attribute will be used as read-only. Please do not modify during use
     */
    type: string;
    /**
     * property of the Canvas 2D API specifies the color, gradient, or pattern
     * to use for the strokes (outlines) around shapes.
     */
    stroke: String | CanvasGradient | CanvasPattern;
    /**
     * property of the Canvas 2D API specifies the color, gradient, or pattern
     * to use inside shapes.
     */
    fill: String | CanvasGradient | CanvasPattern;
    /**
     * property of the Canvas 2D API sets the thickness of lines.
     */
    lineWidth: number;
    constructor(options?: any);
}
/**
 * aux Circle of penTool
 */
declare class PenCircle extends PenObject {
    /**
     * The x coordinate of the center of the circle
     */
    x: number;
    /**
     * The y coordinate of the center of the circle
     */
    y: number;
    /**
     * Radius of Circle
     */
    radius: number;
    /**
     * name of circle when circle as a handler
     */
    handleName?: string;
    /**
     * The index of the associated key point when circle as a handler
     */
    keyPointIndex: number;
    /**
     * property of the Canvas 2D API specifies the color, gradient, or pattern
     * to use for the strokes (outlines) around shapes.
     */
    stroke: String | CanvasGradient | CanvasPattern;
    /**
     * property of the Canvas 2D API specifies the color, gradient, or pattern
     * to use inside shapes.
     */
    fill: String | CanvasGradient | CanvasPattern;
    constructor(options?: any);
}
/**
 * aux Line of penTool
 */
declare class PenLine extends PenObject {
    /**
     * The x coordinate of an endpoint of the line segment
     */
    x1: number;
    /**
     * The y coordinate of an endpoint of the line segment
     */
    y1: number;
    /**
     * The x coordinate of another endpoint of the line segment
     */
    x2: number;
    /**
     * The y coordinate of another endpoint of the line segment
     */
    y2: number;
    constructor(options?: any);
}
/**
 * declare path keyPoint Class
 */
declare class KeyPoint {
    /**
     * svg path key letter. 'M' means moveTo, 'C' means curveTo
     */
    type: string;
    /**
     * the mousedown keyPoint
     */
    point: IPoint;
    /**
     * Indicate the relationship between current keyPoint and previous keyPoint
     * 'straight' means drawing a Line from previous to current
     * 'mirrored' means drawing a curve. Cause there will be 2 handlers which are mirror symmetry centered on current keyPoint and in a straight line
     * 'disjointed' means the curve's handlers are not in a straight line
     * @default 'straight'
     */
    pointType: string;
    /**
     * Coordinates related to the current keyPoint
     * When keyPoint's type is 'M', the array length is 2, the coordinates of the current point are saved
     * When keyPoint's type is 'C', the array length is 6. likes [prevLeft, prevTop, curLeft, curTop, curLeft, curTop]
     */
    relationPoints: number[];
    /**
     * Index of keyPointData array
     */
    keyPointIndex: number;
    /**
     * one of handlers of the curve when keyPoint's type is 'C'
     */
    controller1?: IController;
    /**
     * another handler of the curve when keyPoint's type is 'C'
     */
    controller2?: IController;
    /**
     * Straight line composed of aux-point(controller1) and origin-point
     */
    auxLine1?: any;
    /**
     * Straight line composed of aux-point(controller2) and origin-point
     */
    auxLine2?: any;
    /**
     * When current keyPoint is a handler of curve, attribute will be set
     * 'handleA' as left handler
     * 'handleB' as right handler
     */
    handleName?: string;
    constructor({ type, point, pointType, relationPoints, keyPointIndex, controller1, controller2, auxLine1, auxLine2, handleName }?: any);
}
/**
 * declare Pen Tool Class
 */
declare class Pen {
    /**
     * Whether the penTool's edit mode is opened. Default false.
     */
    penModeOn: boolean;
    /**
     * Store final path keyPoints data.
     */
    keyPointData: KeyPoint[];
    /**
     * Store the real path keyPoints data, cause it's different from keyPointData when mousemove.
     */
    keyPointDataCache: KeyPoint[];
    /**
     * Whether the path is closed
     */
    closeState: boolean;
    /**
     * Whether the real-path is closed.
     * Fill the path containing area when cursor position and path start-point coincide during mousemoving (but not mouseup).
     */
    cacheCloseState: boolean;
    /**
     * The svg Path string
     */
    realPathStr: string;
    /**
     * Fabric.Path object
     */
    pathRealObject: object;
    /**
     * State of keyPoint.
     * 'new' when mousedown which means new keyPoint, reset null when mouseup
     */
    keyPointState: string;
    /**
     * Index of current operation point in the keyPointData
     */
    currentKeyPointIndex: number;
    /**
     * Save the lastest mousedown positon
     */
    penMouseMoveFix: any;
    /**
     * Save part of the keyPoint information which is activated by mousedown
     */
    penMouseDownOrigin: any;
    /**
     * Whether the mousedown event is triggered
     */
    penMouseDown: boolean;
    /**
     * <canvas> element
     */
    canvas: HTMLCanvasElement;
    /**
     * canvas context('2d')
     */
    canvasCtx: CanvasRenderingContext2D;
    /**
     * Custom setting options
     */
    options: IPenOptions;
    /**
     * Collection of objects drawn on canvas
     */
    objects: any[];
    /**
     * Whether edit the keyPoint position
     */
    isEdit: boolean;
    /**
     * Save auxPoint or keyPoint when mousedown on the point
     */
    mousedownTarget?: any;
    constructor(canvasId: string, options?: any);
    /**
     * Open drawing mode
     */
    enablePen(): void;
    /**
     * Exit drawing mode
     * The first call sets currentKeyPointIndex to null and set keyPoint editable
     * The second call removes auxPoints and auxLines
     */
    exitPenMode(): void;
    /**
     * Set cursor style
     * @param type cursor type
     */
    setCursor(type: string): void;
    /**
     * fire mousedown event
     */
    _mouseDown(): void;
    /**
     * fire mouseMove event
     */
    _mouseMove(): void;
    /**
     * fire mouseup event
     */
    _mouseUp(): void;
    /**
     * fire path double click event
     */
    _mouseDblclick(): void;
    /**
     * fire keydown event
     * Support to press ESC to exit drawing mode
     */
    _keydown(): void;
    /**
     * Implementation of MouseDown
     * @param event
     */
    _penMouseDown(event: MouseEvent): void;
    /**
     * Implementation of MouseMove
     * @param event
     */
    _penMouseMove(event: MouseEvent): void;
    /**
     * Implementation of MouseUp
     * @param event
     */
    _penMouseUp(event: MouseEvent): void;
    /**
     * update keyPoint or handle point position
     * @param x mouseOffsetX relative to canvas
     * @param y mouseOffsetY relative to canvas
     * @param type control point type
     */
    changeKeyPointPos(x: number, y: number, type?: string): void;
    /**
     * creating aux control handlers for curve
     * @param curKeyPoint the current operating keyPoint
     */
    createPathCurveAux(curKeyPoint: KeyPoint): void;
    /**
     * update the handlers of the curve
     * @param item operating keyPoint
     * @param position the key coordinates. {x, y, x1, y1, x2, y2}
     * (x, y) is the main keyPoint's coordinates. (x1, y1) and (x2, y2) is the two controllers' coordinates.
     * @param type Indicates which auxLine and controller to update
     */
    updatePenPathControll(item: KeyPoint, position: any, type?: string): void;
    /**
     * save the coordinate informations when mousedown
     * (x, y) is the main keyPoint's coordinate
     * (x1, y1) and (x2, y2) is the controllers' coordinate
     */
    setMousedownOrigin(): void;
    /**
     * update the pathObject when path is modified
     * @param isCashed whether update path with the keyPointDataCache
     */
    refreshEditPath(isCashed?: boolean): void;
    /**
     * generate the pathStr according to keyPointData
     * @param keyPointData
     */
    _generatePathStr(keyPointData: KeyPoint[]): string;
    /**
     * refresh and redraw the canvas
     */
    refreshRender(): void;
    /**
     * drawing object on canvas
     * @param objects objects to be drawing
     */
    drawObjects(objects: Array<any>): void;
    /**
     * draw circle on canvas
     * @param options config of circle
     */
    drawCircle(options: any): void;
    /**
     * draw path on canvas
     * @param options config of circle
     */
    drawPath(options: any): void;
    /**
     * draw straight line on canvas
     * @param options config of circle
     */
    drawLine(options: any): void;
    /**
     * Add objects to Pen instance for rendering
     * @param objects objects for rendering
     * @returns returns adding objects
     */
    addCanvasObjects(...objects: Array<any>): Array<any>;
    /**
     * remove objects from Pen instance
     * @param objects objects to remove
     */
    removeObjects(...objects: Array<any>): void;
    /**
     * match currect object and remove it from instance
     * @param object object to remove
     */
    removeSingleObject(object: any): void;
    /**
     * Get the mouseover target
     * @param event
     */
    _getMouseOverTarget(event: MouseEvent): any;
    /**
     * Checks if point is inside the object
     * @param point target point, always mouse position
     * @param object target object
     */
    _containsPoint(point: IPoint, object: any): boolean;
    /**
     * Matches the object with the specified property name and value, and then performs the callback
     * @param key property name
     * @param value property value
     * @param callback callback function
     */
    _matchObjectsByProrerty(key: string, value: string, callback: Function): void;
    /**
     * Put the object at the end of the array to make canvas draw last
     * so as to achieve the purpose of the object at the top after drawing
     * @param object
     */
    _bringToFront(object: any): void;
    /**
     * change the keyPoint type when dblclick on the keyPoint
     * when keyPoint is the straight line keyPoint, it will be a curve keyPoint after dblclick
     * when keyPoint is the curve keyPoint, it will be a straight line keyPoint after dblclick
     * @param target
     * @param pointType the pointType attribute of current operating keyPoint
     */
    changeKeyPointType(target: KeyPoint, pointType?: string): void;
    /**
     * generate the path with keyPoints and handlers
     */
    generateEditablePath(): void;
    /**
     * generate the aux keyPoints and handlers to render
     * @param keyPointData collection of path's keyPoints
     */
    generateAuxPointLine(keyPointData?: KeyPoint[]): void;
}
export default Pen;
