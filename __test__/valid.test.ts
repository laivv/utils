import { valid } from '../src/validate';

const rules = {
	name: {
		require: [true, '名称必填'],
		minLen: [4, '名称不少于4个字符'],
		maxLen: [8, '名称不超过8个字符'],
	},
	verifyCode: {
		require: [true, '验证码必填'],
		type: ['int', '验证码必须是数字'],
		len: [4, '验证码必须是4位'],
	},
	complany: {
		require: [false, ''],
		minLen: [2, '公司名称不少于两个字'],
		maxLen: [8, '公司名称不超过8个字'],
		regExp: [/\w+/, '公司名称只能是字母'],
		func: [
			/**
			 * 用户自定义验证函数，支持同步和异步
			 * @param  {} filedValue 当前字段
			 * @param  {} form 当前表单全部字段
			 * @returns boolean
			 */
			function(filedValue, form): boolean | Promise<Function> {
				return new Promise(function(resolve, reject) {
					reject('服务器验证失败，此消息将覆盖默认提示消息');
				});
			},
			'服务器验证失败的默认提示消息',
		],
	},
	email: {
		require: [true, '邮箱必填'],
		type: ['email', '无效的邮箱'],
	},
};

const formData = {
	name: 'lingluo',
	verifyCode: 2002,
	complany: 'uoko',
	email: '123@qq.com',
};

test('验证字段', async function() {
	try {
		let ret = await valid(rules, formData);
		expect(true).toBe(true);
	} catch (e) {
		expect(e.state).toBe(false);
	}
});
