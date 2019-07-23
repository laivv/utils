import { serizeQuery, isNull, type, evalString, deepClone, getQuery, isObject, isArray, isString, isFunction, isNumber, isInteger } from './src/utils'
import validate from './src/formValidator'
import DateTime from './src/dateTime'

declare global {
    interface Window {
        [x: string]: any;
    }
}

if (typeof window === 'object') {
    window.serizeQuery = serizeQuery
    window.isNull = isNull
    window.type = type
    window.evalString = evalString
    window.deepClone = deepClone
    window.getQuery = getQuery
    window.isObject = isObject
    window.isArray = isArray
    window.isString = isString
    window.isFunction = isFunction
    window.isNumber = isNumber
    window.isInteger = isInteger
    window.DateTime = DateTime
    window.validate = validate


}
