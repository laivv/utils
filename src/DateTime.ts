interface IDateTimeJSON {
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
	mm: string;
	
	m: string;
	dd: string;
	d: string;
	hh: string;
	h: string;
	ii: string;
	i: string;
	ss: string;
	s: string;
	w: string;
	W: string;
}
class DateTime {
	private date: Date;
	private week_map: string[] = ['日', '一', '二', '三', '四', '五', '六'];
	constructor(date?: string | number | DateTime | number) {
		if (!(this instanceof DateTime)) {
			return new DateTime(date);
		}
		if (typeof date !== 'undefined') {
			if (date instanceof Date) {
				this.date = date;
			} else if (date instanceof DateTime) {
				return date;
			} else {
				if (/^\d{10,13}$/.test(date)) {
					this.date = new Date(parseInt(date.length === 10 ? date + '' + '000' : a));
				} else {
					this.date = new Date(date);
				}
			}
		} else {
			this.date = new Date();
		}
	}

	private parse(): IDateTimeJSON {
		const { date } = this;
		let year = date.getFullYear().toString().substr(-2, 2),
			month = date.getMonth() + 1,
			day = date.getDate(),
			week = date.getDay(),
			hour = date.getHours(),
			min = date.getMinutes(),
			sec = date.getSeconds(),
			fullYear = date.getFullYear(),
			fullMonth = month < 10 ? `0${month}` : month,
			fullDay = day < 10 ? `0${day}` : day,
			fullHour = hour < 10 ? `0${hour}` : hour,
			fullMin = min < 10 ? `0${min}` : min,
			fullSec = sec < 10 ? `0${sec}` : sec;
		let json = {
				yyyy: fullYear,
				yy: year,
				mm: fullMonth,
				m: month,
				dd: fullDay,
				d: day,
				hh: fullHour,
				h: hour,
				ii: fullMin,
				i: min,
				ss: fullSec,
				s: sec,
				w: week,
				W: this.week_map[week],
			};
	
	
	}
	toString(format: string = 'yyyy-mm-dd'): string {
		const json = this.parse();
		for (let i in json) {
			if (json.hasOwnProperty(i)) {
				format = format.replace(new RegExp(i, 'g'), json[i]);
			}
		}
		return format;
	}
	toStamp(): number {
		return this.date.getTime();
	}
	toJSON(): IDateTimeJSON {
		return this.parse();
	}
	addSeconds(n: number): this {
		const seconds = n * 1000;
		this.date = new Date(this.date.getTime() + seconds);
		return this;
	}
	addMinutes(n: number): this {
		const minutes = n * 1000 * 60;
		this.date = new Date(this.date.getTime() + minutes);
		return this;
	}
	addHours(n: number): this {
		const hours = n * 1000 * 60 * 60;
		this.date = new Date(this.date.getTime() + hours);
		return this;
	}
	addDays(n: number): this {
		const days = n * 1000 * 60 * 60 * 24;
		this.date = new Date(this.date.getTime() + days);
		return this;
	}
	static now(): DateTime {
		return new DateTime();
	}
	static parse(a: string | number | DateTime | Date): DateTime {
		if (typeof a !== 'undefined') {
			a = a.toString();
		} else {
			return null;
		}
		let ret: string[] = a.match(/\d{10,13}/);
		if (ret && ret[0]) {
			return new DateTime(ret.length === 10 ? ret.toString() + '000' : ret);
		}
		ret = a.match(/\d{4}[\/-]\d{1,2}[\/-]\d{1,2}([t\s]\d{1,2}[:-]\d{2}([:-]\d{2})?)?/);
		if (ret && ret[0]) {
			return new DateTime(ret);
		}
		return null;
	}
}
