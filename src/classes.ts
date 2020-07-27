import CONST from './constant'
import { IPoint, IController } from './interface'

class PenObject {
    /**
     * Identify the object as an auxiliary point or line of the path
     * Since js does not support static attributes, 
     * this attribute will be used as read-only. Please do not modify during use
     */
    // static penType: string = CONST.OBJECT_TYPE.PEN_AUX;
    penType: string = CONST.OBJECT_TYPE.PEN_AUX;

    /**
     * The type of drawing object. 
     * Since js does not support static attributes, 
     * this attribute will be used as read-only. Please do not modify during use
     */
    // static type: string = CONST.OBJECT_TYPE.CIRCLE;
    type: string;

    /**
     * property of the Canvas 2D API specifies the color, gradient, or pattern 
     * to use for the strokes (outlines) around shapes.
     */
    stroke: String | CanvasGradient | CanvasPattern = '#ff56b1';

    /**
     * property of the Canvas 2D API specifies the color, gradient, or pattern 
     * to use inside shapes.
     */
    fill: String | CanvasGradient | CanvasPattern = '#006cff';

    /**
     * property of the Canvas 2D API sets the thickness of lines.
     */
    lineWidth: number = 1;

    constructor(options: any = {}) {
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
    radius: number = 3;

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
    stroke: String | CanvasGradient | CanvasPattern = '#006cff';

    /**
     * property of the Canvas 2D API specifies the color, gradient, or pattern 
     * to use inside shapes.
     */
    fill: String | CanvasGradient | CanvasPattern = '#fff';

    constructor(options: any = {}) {
        super(options);
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

    constructor(options: any = {}) {
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
    pointType: string = CONST.POINT_TYPE.STRAIGHT;

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

    constructor({
        type,
        point,
        pointType,
        relationPoints,
        keyPointIndex,
        controller1,
        controller2,
        auxLine1,
        auxLine2,
        handleName
    }: any = {}) {
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

export {
    PenObject,
    PenCircle,
    PenLine,
    KeyPoint
}