import { PenCircle, PenLine } from './classes'

/**
 * declare Interface of Point 
 */
interface IPoint {
    /**
     * X coordinate of point
     */
    x: number,

    /**
     * X coordinate of point
     */
    y: number
}

/**
 * the curve handler endpoint
 */
interface IController extends IPoint { }

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

    /** other options parameters */
    [param: string]: any
}

export {
    IPoint,
    IController,
    IPenOptions
}