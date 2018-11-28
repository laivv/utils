/*
 * @Description: Lingluo
 * @Author: Lingluo
 * @Date: 2018-11-27 18:22:48
 * @Last Modified by: Lingluo
 * @Last Modified time: 2018-11-28 15:56:01
 */

/**
 *
 * rules 规则格式
 * rules ={
 *  userName: {
 * 		require: [true,'userName必填'],
 *		type:['email','不是邮箱']
 *		len:[6,"长度不正确"],
 *		minLen:[4,"长度最小四位"],
 *		maxLen:[6,"长度最大6位"],
 *		regExp:[/\d{11}/,'格式错误'],
 *      func:[function(field,fields){return true},'验证未通过']
 *  }
 * }
 *
 *
 * 需要验证的表单字段
 * formData = {
 * 		userName:'username',
 * 		age:26
 * }
 *
 *
 * */

type IRule = Array<boolean | number | RegExp | Function | string>;

interface IRules {
	require?: IRule;
	type?: IRule;
	len?: IRule;
	minLen?: IRule;
	maxLen?: IRule;
	regExp?: IRule;
	func?: IRule;
}

interface IValidateRule {
	[x: string]: IRules;
}
interface IValidateResultItem {
	field: string;
	msg: any;
}
interface IValidateResult {
	state: boolean;
	msg?: string;
	fields?: IValidateResultItem[];
}
/**
 * 判断参数类型
 * @param  {} object 要判断的参数
 * @returns string
 */
const type = (object): string => {
	return Object.prototype.toString
		.call(object)
		.replace(/(^\[\w+\s+)|(\]$)/g, '')
		.toLowerCase();
};
/**
 * 判断参数是否为空值
 * @param  {any} n 要判断的参数
 * @returns boolean
 */
const isEmpty = (n: any): boolean => {
	if (n === undefined || n === null) {
		return true;
	}
	switch (type(n)) {
		case 'string':
			return !n.trim();
		case 'array':
			return !n.length;
		case 'object':
			return !Object.keys(n).length;
		case 'number':
			return isNaN(n);
		case 'set':
		case 'map':
			return !n.size;
	}
	return false;
};

/**
 * 内置的一些规则
 */

const TYPES = {
	moblie: /^1[3456789]\d{9}$/,
	number: /^-?\d+(\.\d+)?$/,
	money: /^-?\d+(\.\d{2})?$/,
	int: /^-?\d+$/,
	email: /^[\w\d]+[\d\w_]+@[\w\d]+(\.\w+)+$/i,
	date: /^\d{4}[-\/]\d{1,2}[-\/]\d{1,2}$/,
};

const VALIDATORS = {
	require(a: any, bool: boolean): boolean {
		return bool ? !isEmpty(a) : true;
	},
	type(a: any, b: RegExp): boolean {
		return b.test(a);
	},
	len(a: any, len: number): boolean {
		return !isEmpty(a) && a.toString().trim().length === len;
	},
	minLen(a: any, len: number): boolean {
		return !isEmpty(a) && a.toString().trim().length >= len;
	},
	maxLen(a: any, len: number): boolean {
		return !isEmpty(a) && a.toString().trim().length <= len;
	},
	regExp(a: any, regExp: RegExp): boolean {
		return regExp.test(a);
	},
	func(a: any, fn: Function, c: any): boolean | Promise<any> {
		const result = fn(a, c);
		return result === undefined ? true : result;
	},
};

const RULE_NAMES: string[] = ['require', 'type', 'len', 'minLen', 'maxLen', 'regExp', 'func'];
const RULE_LEN = RULE_NAMES.length;

declare global {
	interface Window {
		valid: any;
	}
}
/**
 * 验证表单字段
 * @param  {IValidateRule} rules 验证的规则
 * @param  {{[x:string]:any}} data 验证的表单options
 * @returns Promise
 */
export const valid = (rules: IValidateRule, data: { [x: string]: any }): Promise<Function> => {
	return new Promise((resolve, reject) => {
		let ret: IValidateResult = {
			state: true,
			msg: '',
			fields: [],
		};
		let promises: Array<Promise<any>> = [];
		for (let key in rules) {
			if (rules.hasOwnProperty(key)) {
				let rule: IRules = rules[key];
				for (let i = 0; i < RULE_LEN; i++) {
					let ruleName: string = RULE_NAMES[i];
					if (rule.hasOwnProperty(ruleName)) {
						let ruleItem: IRule = rule[ruleName];
						let func: Function = VALIDATORS[ruleName];
						let ruleVal: any = ruleItem[0],
							ruleMsg: any = ruleItem[1];
						let args = [data[key], ruleVal];
						if (ruleName === 'func') {
							args.push(data);
						}
						if (ruleName === 'type') {
							args = [data[key], TYPES[<string>ruleVal]];
						}

						let is = func(...args);
						if (ruleName === 'require' && !ruleVal && isEmpty(data[key])) {
							break;
						}
						let field: IValidateResultItem = {
							field: key,
							msg: ruleMsg,
						};
						if (type(is) === 'promise') {
							promises.push(is);
							is.catch(data => {
								ret.state = false;
								if (!ret.msg) {
									ret.msg = data || ruleMsg;
								}
								field.msg = data || ruleMsg;
								ret.fields.push(field);
							});
						} else if (!is) {
							ret.state = false;
							if (!ret.msg) {
								ret.msg = ruleMsg;
							}
							ret.fields.push(field);
							break;
						}
					}
				}
			}
		}
		if (promises.length) {
			Promise.all(promises)
				.then(() => {
					if (ret.state) {
						resolve();
					} else {
						reject(ret);
					}
				})
				.catch(() => {
					reject(ret);
				});
		} else {
			if (ret.state) {
				resolve();
			} else {
				reject(ret);
			}
		}
	});
};

window.valid = valid;
