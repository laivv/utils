module.exports = {
	parser: 'typescript-eslint-parser',
	plugins: ['typescript'],
	rules: {
		eqeqeq: [
			'error',
			'always',
			{
				null: 'ignore'
			}
		],
		indent: [1, 2],
		quotes: [1, 'single'],
		semi: [1, 'never'],
		'no-console': 1,
		'arrow-parens': 0,
		// 类和接口的命名必须遵守帕斯卡命名法，比如 PersianCat
		'typescript/class-name-casing': 'error'
	}
};
