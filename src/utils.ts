/**
 * convert an array of string-number to number
 * @param array 
 */
export function convertStr2Num(array: string[] = []): Number[] {
    let result = [];
    array.forEach(item => {
        result.push(Math.round(Number(item)))
    })
    return result;
}

/**
 * Divide an array into several array blocks according to the specified array size
 * @param array 
 * @param size split size
 */
export function chunk(array: any[], size: number) {
    if (array.length < size) return array;
    let result = [];
    for(let i = 0; i < array.length; i+=size) {
        result.push(array.slice(i, i + size))
    }
    return result;
}

/**
 * get absolute cordinate
 * @param array 
 * @param baseCordinate Relative to the first point
 */
export function getAbsoluteCordinate(array: any[][], baseCordinate: {x: number, y: number}): any[][] {
    let result = []
    array.forEach((cordinate, index) => {
        if (index === 0) {
            result.push([cordinate[0] + baseCordinate.x, cordinate[1] + baseCordinate.y])
        } else {
            result.push([cordinate[0] + result[index - 1][0], cordinate[1] + result[index - 1][1]])
        }
    })
    return result;
}