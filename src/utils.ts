type obj = {
	[x: string]: any;
};

/**
 * check type 
 * @param  {} arg
 * @returns string
 */
export function type(arg: any): string {
  return Object.prototype.toString
    .call(arg)
    .replace(/(^\[\w+\s+)|(\]$)/g, '')
    .toLowerCase()
}

export function isObject(arg: any): boolean {
  return type(arg) === 'object'
}

export function isArray(arg: any): boolean {
  return type(arg) === 'array'
}

export function isString(arg: any): boolean {
  return type(arg) === 'string'
}

export function isFunction(arg: any): boolean {
  return type(arg) === 'function'
}

export function isNumber(arg: any): boolean {
  if (type(arg) === 'number') {
    return !Number.isNaN(arg) && Number.isFinite(arg)
  }
  if (isString(arg)) {
    return /^-?\d+(\.\d+)?$/.test(arg)
  }
  return false
}

export function isInteger(arg: any): boolean {
  if (isString(arg)) {
    return /^-?\d+$/.test(arg)
  }
  if (isNumber(arg)) {
    return Number.isInteger(arg)
  }
  return false
}

/**
 * 判断是否空值
 * @param  {any} arg 要判断的对象
 * @returns boolean
 */
export function isNull(arg: any): boolean {
  if (arg === null || arg === undefined || arg === '' || isNaN(arg)) {
    return true
  }
  if (type(arg) === 'array' && !arg.length) {
    return true
  }
  if (type(arg) === 'object' && !Object.keys(arg).length) {
    return true
  }
  if (type(arg) === 'map' && !(arg as Map<any, any>).size) {
    return true
  }
  if (type(arg) === 'set' && !(arg as Set<any>).size) {
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
  const baseType: Array<string> = ['string', 'number', 'boolean', 'undefined', 'null']
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

/**
 * 深拷贝对象
 * @param  {any} data
 * @returns any
 */
export function deepClone(data: any): any {
  const targetStack: Array<any> = []
  const sourceStack: Array<any> = []
  const ret: any = clone(data)
  function clone(data: any) {
    const mType: string = type(data)
    let ret: any
    if (['array', 'object'].indexOf(mType) > -1) {
      const index: number = sourceStack.indexOf(data)
      // resolve loop reference
      if (index > -1) {
        return targetStack[index]
      }
      ret = mType === 'array' ? [] : {}
      targetStack.push(ret)
      sourceStack.push(data)
    }

    if (mType === 'array') {
      data.forEach((item: any) => {
        ret.push(clone(item))
      })
    } else if (mType === 'object') {
      for (let key in data) {
        if (data.hasOwnProperty(key)) {
          ret[key] = clone(data[key])
        }
      }
    } else {
      return data
    }
    return ret
  }
  return ret
}

/**
 * 获取query
 * @returns obj
 */
export function getQuery(): obj {
  const ret: obj = {}
  const query: string = location.href.split('?')[1]
  if (query) {
    const querys: Array<String> = query.split('&')
    querys.forEach((item: string) => {
      const [key, val] = item.split('=')
      if (key) {
        if (ret.hasOwnProperty(key)) {
          if (type(ret[key] !== 'array')) {
            ret[key] = [ret[key]]
          }
          ret[key].push(val)
        } else {
          ret[key] = val
        }
      }
    })
  }
  return ret
}