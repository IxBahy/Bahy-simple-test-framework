function test<T extends Function>(
	fn: T,
	values: FunctionArguments<T>
): testObject {
	const testObject: testObject = {
		equals: (expected: ArrayElement<typeof values>) => {
			try {
				if (fn(...values) === expected) {
					console.log(
						`${fn.name} PASSED✅✅ , produced the correct answer ${expected}`
					);
				} else {
					throw new Error(
						`${fn.name} Failed❌❌, produced the wrong answer ${expected}`
					);
				}
			} catch (error) {
				console.log(error);
			}
		},
		gt: () => {},
		gte: () => {},
		lt: () => {},
		lte: () => {},
		includes: () => {},
	};
	return testObject;
}
