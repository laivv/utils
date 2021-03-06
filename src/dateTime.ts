/**
 * 判断类型
 * @param  {} obj
 * @returns string
 */
const type = (obj: any): string => {
  return Object.prototype.toString
    .call(obj)
    .replace(/(^\[\w+\s+)|(\]$)/g, '')
    .toLowerCase()
}
const WEEK_MAP: string[] = ['日', '一', '二', '三', '四', '五', '六']
export interface IDateTimeJSON {
	/**
	 * 完整年份
	 */
	yyyy: string;
	/**
	 *年份
	 */
	yy: string;
	/**
	 * 完整月份
	 */
	MM: string;
	/**
	 * 月份
	 */
	M: string;
	/**
	 * 完整号数
	 */
	dd: string;
	/**
	 * 号数
	 */
	d: string;
	/**
	 * 完整小时
	 */
	hh: string;
	/**
	 * 小时
	 */
	h: string;
	/**
	 * 完整分钟
	 */
	mm: string;
	/**
	 * 分钟
	 */
	m: string;
	/**
	 * 完整秒
	 */
	ss: string;
	/**
	 * 秒
	 */
	s: string;
	/**
	 * 星期（数字）
	 */
	w: string;
	/**
	 * 星期（大写）
	 */
	W: string;
}
class DateTime {
	private date: Date;
	/**
	 * 实例化一个DateTime类
	 * @param  {string|number|Date|DateTime} date? Date对象或可解析成Date的字符串或数字
	 */
	constructor(date?: string | number | Date | DateTime) {
	  if (!(this instanceof DateTime)) {
	    return new DateTime(date)
	  }
	  if (date !== undefined) {
	    if (date instanceof DateTime) {
	      return date
	    } else {
	      switch (type(date)) {
	      case 'string':
	        this.date = DateTime.parseString(<string>date)
	        break
	      case 'number':
	        this.date = DateTime.parseNumber(<number>date)
	        break
	      case 'date':
	        this.date = <Date>date
	        break
	      default:
	        throw new TypeError('无法解析参数')
	      }
	    }
	  } else {
	    this.date = new Date()
	  }
	}
	/**
	 * 返回IDateTimeJSON数据
	 * @returns IDateTimeJSON
	 */
	private getJSON(): IDateTimeJSON {
	  const { date } = this
	  let { year, month, day, hour, min, sec, week }: any = this.toJSON()
	  year = year.toString().substr(-2, 2)
	  month = month + 1
	  let fullYear = date.getFullYear(),
	    fullMonth = month < 10 ? `0${month}` : month,
	    fullDay = day < 10 ? `0${day}` : day,
	    fullHour = hour < 10 ? `0${hour}` : hour,
	    fullMin = min < 10 ? `0${min}` : min,
	    fullSec = sec < 10 ? `0${sec}` : sec
	  const json: IDateTimeJSON = {
	    yyyy: fullYear.toString(),
	    yy: year.toString(),
	    MM: fullMonth.toString(),
	    M: month.toString(),
	    dd: fullDay.toString(),
	    d: day.toString(),
	    hh: fullHour.toString(),
	    h: hour.toString(),
	    mm: fullMin.toString(),
	    m: min.toString(),
	    ss: fullSec.toString(),
	    s: sec.toString(),
	    w: week.toString(),
	    W: WEEK_MAP[week].toString()
	  }
	  return json
	}
	/**
	 * 返回格式化的时间字符串
	 * @param  {string} format
	 * @returns string
	 */
	toString(format: string = 'yyyy-MM-dd'): string {
	  const json: IDateTimeJSON = this.getJSON()
	  for (let i in json) {
	    if (json.hasOwnProperty(i)) {
	      format = format.replace(new RegExp(i, 'g'), json[i])
	    }
	  }
	  return format
	}
	/**
	 * 返回数字时间戳
	 * @returns number
	 */
	toStamp(): number {
	  return this.date.getTime()
	}
	/**
	 * 返回date的json数据
	 * @returns object
	 */
	toJSON(): { [x: string]: number } {
	  const { date } = this
	  let year: number = date.getFullYear(),
	    month: number = date.getMonth(),
	    day: number = date.getDate(),
	    hour: number = date.getHours(),
	    min: number = date.getMinutes(),
	    sec: number = date.getSeconds(),
	    mSec: number = date.getMilliseconds(),
	    week: number = date.getDay()
	  return { year, month, day, hour, min, sec, mSec, week }
	}
	/**
	 * 获取原生Date对象
	 * @returns Date
	 */
	getDate(): Date {
	  return this.date
	}
	/**
	 * 获取当月第一天
	 * @returns DateTime
	 */
	getFirstDay(): DateTime {
	  const { year, month, hour, min, sec, mSec } = this.toJSON()
	  return new DateTime(new Date(year, month, 1, hour, min, sec, mSec))
	}
	/**
	 * 获取当月最后一天
	 * @returns DateTime
	 */
	getLastDay(): DateTime {
	  const { year, month, hour, min, sec, mSec } = this.toJSON()
	  return new DateTime(new Date(year, month, DateTime.getMaxDay(year, month), hour, min, sec, mSec))
	}
	/**
	 * 增加秒数
	 * @param  {number} n 秒数
	 * @returns this
	 */
	addSeconds(n: number): this {
	  const seconds = n * 1000
	  this.date = new Date(this.date.getTime() + seconds)
	  return this
	}
	/**
	 * 增加分钟数
	 * @param  {number} n 分钟数
	 * @returns this
	 */
	addMinutes(n: number): this {
	  return this.addSeconds(n * 60)
	}
	/**
	 * 增加小时
	 * @param  {number} n 小时数
	 * @returns this
	 */
	addHours(n: number): this {
	  return this.addMinutes(n * 60)
	}
	/**增加天数
	 * @param  {number} n 天数
	 * @returns this
	 */
	addDays(n: number): this {
	  return this.addHours(n * 24)
	}
	/**
	 * 增加月数
	 * @param  {number} n 月
	 * @returns this
	 */
	addMonths(n: number): this {
	  let { year, month, day, hour, min, sec, mSec } = this.toJSON(),
	    absN: number = Math.abs(n),
	    addYear: number = absN >= 12 ? Math.floor(absN / 12) : 0,
	    addMonth: number = absN >= 12 ? absN % 12 : absN
	  addYear = n >= 0 ? addYear : -addYear
	  addMonth = n >= 0 ? addMonth : -addMonth

	  let nYear: number = year + addYear,
	    nMonth: number = month + addMonth

	  if (nMonth > 11) {
	    nMonth = nMonth - 12
	    nYear += 1
	  } else if (nMonth < 0) {
	    nMonth = 12 + nMonth
	    nYear -= 1
	  }
	  let maxDay: number = DateTime.getMaxDay(nYear, nMonth),
	    nDay: number = day > maxDay ? maxDay : day
	  this.date = new Date(nYear, nMonth, nDay, hour, min, sec, mSec)
	  return this
	}
	/**
	 * 增加年数
	 * @param  {number} n 年数
	 * @returns this
	 */
	addYears(n: number): this {
	  return this.addMonths(n * 12)
	}
	/**
	 * 获取某月的最大天数
	 * @param  {number} year 年份
	 * @param  {number} month 月份
	 * @returns number
	 */
	static getMaxDay(year: number, month: number): number {
	  return new Date(year, month + 1, 0).getDate()
	}
	/**
	 * 获取当前时间
	 * @returns DateTime
	 */
	static now(): DateTime {
	  return new DateTime()
	}
	/**
	 * 解析string类型时间
	 * @param  {string} a 时间字符串
	 * @returns Date
	 */
	static parseString(a: string): Date {
	  const RE_NUM: RegExp = /\d{10,13}/
	  const RE_DATE: RegExp = /(\d{4})([-\/年]((\d{1,2})([-\/月]((\d{1,2})([tT\s+日]((\d{1,2})([-\/:时]((\d{1,2})([-\/:分]((\d{1,2})秒?)?)?)?)?)?)?)?)?)?)?/
	  let ret: string[] | null = a.match(RE_NUM)
	  if (ret) {
	    return DateTime.parseNumber(ret[0])
	  } else if ((ret = a.match(RE_DATE))) {
	    const year: number = Number(ret[1]),
	      month: number = ret[4] ? Number(ret[4]) - 1 : 0,
	      day: number = ret[7] ? Number(ret[7]) : 1,
	      hour: number = ret[10] ? Number(ret[10]) : 0,
	      min: number = ret[13] ? Number(ret[13]) : 0,
	      sec: number = ret[16] ? Number(ret[16]) : 0
	    return new Date(year, month, day, hour, min, sec)
	  } else {
	    throw new TypeError('无法解析参数')
	  }
	}
	/**
	 * 解析number类型时间
	 * @param  {number} n number或string类型的时间戳
	 * @returns Date
	 */
	static parseNumber(n: number | string): Date {
	  let str: string
	  let num: number
	  if (type(n) === 'number') {
	    str = n.toString()
	    num = n as number
	  } else if (type(n) === 'string') {
	    str = n as string
	    num = Number(n)
	  } else {
	    throw new TypeError('无法解析参数')
	  }
	  num = str.length === 10 ? num * 1000 : num
	  return new Date(num)
	}
	/**
	 * 将传入的参数解析为DateTime对象
	 * @param  {string|number|Date|DateTime} a 要解析的参数
	 * @returns DateTime
	 */
	static parse(a: string | number | Date | DateTime): DateTime {
	  return new DateTime(a)
	}
}

export default DateTime
