import DateTime from '../src/DateTime';

let str = '2015-12-31 16:44:59';
test(`解析字符串 "${str}" `, () => {
	const dateTime = DateTime.parse(str);
	expect(dateTime.toString('yyyy-MM-dd hh:mm:ss')).toBe(str);
});

let str2 = '1543373878615';
test(`解析时间戳 "${str2}"`, () => {
	const dateTime = DateTime.parse(str2);
	expect(dateTime.toString('yyyy-MM-dd hh:mm:ss')).toBe('2018-11-28 10:57:58');
});

let str3 = '/Date(1543373878615)';
test(`解析含有时间戳的字符串 "${str3}"`, () => {
	const dateTime = DateTime.parse(str3);
	expect(dateTime.toString('yyyy-MM-dd hh:mm:ss')).toBe('2018-11-28 10:57:58');
});

let str4 = '/2015年12/31 16:00分38秒/abcde';
test(`解析含有时间的字符串 "${str4}"`, () => {
	const dateTime = DateTime.parse(str4);
	expect(dateTime.toString('yyyy-MM-dd hh:mm:ss')).toBe('2015-12-31 16:00:38');
});
