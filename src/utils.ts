
type obj = {
  [x: string]: any
}

/**
 * 判断类型
 * @param  {} obj
 * @returns string
 */
export function type(obj: any): string {
  return Object.prototype.toString
    .call(obj)
    .replace(/(^\[\w+\s+)|(\]$)/g, '')
    .toLowerCase()
}

/**
 * 判断是否空值
 * @param  {any} obj 要判断的对象
 * @returns boolean
 */
export function isNull(obj: any): boolean {
  if (obj === null || obj === undefined || obj === '' || isNaN(obj)) {
    return true
  }
  if (type(obj) === 'array' && !obj.length) {
    return true
  }
  if (type(obj) === 'object' && !Object.keys(obj).length) {
    return true
  }
  if (type(obj) === 'map' && !(obj as Map<any, any>).size) {
    return true
  }
  if (type(obj) === 'set' && !(obj as Set<any>).size) {
    return true
  }
  return false
}

/**
 * 将对象转成queryString
 * @param  {obj} obj 要转的对象
 * @param  {boolean=false} ignoreNull 是否忽略空值
 * @returns string
 */
export function serizeQuery(obj: obj, ignoreNull: boolean = false): string {
  const baseType: Array<string> = ['string', 'number', 'boolean', 'undefined', 'null'];
  const ret: Array<string> = []
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      const item: any = obj[key]
      const itemType: string = type(item)
      if (baseType.indexOf(itemType) > -1) {
        if (ignoreNull && (item === undefined || item === null)) {
          continue
        }
        ret.push(`${key}=${item}`)
      } else if (itemType === 'array') {
        for (let i: number = 0, len: number = item.length; i < len; ++i) {
          const value: any = item[i]
          if (ignoreNull && isNull(value)) {
            continue
          }
          ret.push(`${key}[]=${value}`)
        }
      }
    }
  }
  return ret.join('&')
}

/**
 * 解析str中的变量
 * @param  {string} str 要解析的字符串
 * @param  {obj} option option对象
 */
export function evalString(str: string, option: obj) {
  if (!str) {
    return ''
  }
  for (let key in option) {
    if (option.hasOwnProperty(key)) {
      const re: RegExp = new RegExp(`{\s*${key}\s*}`, 'g')
      str = str.replace(re, option[key])
    }
  }
  return str
}

export function deepClone(data: any) {
  const baseType: Array<string> = ['string', 'number', 'boolean', 'undefined', 'null']
  const tp: string = type(data)
  if (baseType.indexOf(tp) > -1) {
    return data
  }
  if (tp === 'symbol') {
    return new Object(data)
  }
  let ret: any
  if (tp === 'array') {
    ret = []
    data.forEach((item: any) => {
      ret.push(deepClone(item))
    });
  } else if (tp === 'object') {
    ret = {}
    for (let key in data) {
      if (data.hasOwnProperty(key)) {
        ret[key] = deepClone(data[key])
      }
    }
  } else {
    return data
  }
  return ret
}

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
}
