import { KeyPoint } from './classes';
import { IPenOptions, IPoint } from './interface';
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
    constructor(canvasId: string, options?: any, keyPointData?: KeyPoint[]);
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
     * @param options config of path
     */
    drawPath(options?: any): void;
    /**
     * draw straight line on canvas
     * @param options config of line
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
