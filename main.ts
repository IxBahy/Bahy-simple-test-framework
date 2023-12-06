type FunctionArguments<T> = T extends (...args: infer A) => any ? A : never;
type ArrayElement<T> = T extends readonly (infer A)[] ? A : never;

type testObject = {
	equals: (expected: any) => void;
	gt: (value: number) => void;
	gte: (value: number) => void;
	lt: (value: number) => void;
	lte: (value: number) => void;
	includes: (expected: string) => void;
};

function test<T extends Function>(
	fn: T,
	values: FunctionArguments<T>
): testObject {
	const result = fn(...values);
	const testObject: testObject = {
		equals: (expected: ArrayElement<typeof values>): void => {
			try {
				if (result === expected) {
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
		gt: function (value: number) {
			try {
				if (result > value) {
					console.log(
						`${fn.name} PASSED✅✅ , produced the correct answer ${value}`
					);
				} else {
					throw new Error(
						`${fn.name} Failed❌❌, produced the wrong answer ${value}`
					);
				}
			} catch (error) {
				console.log(error);
			}
		},
		gte: (value: number) => {
			try {
				if (result >= value) {
					console.log(
						`${fn.name} PASSED✅✅ , produced the correct answer ${value}`
					);
				} else {
					throw new Error(
						`${fn.name} Failed❌❌, produced the wrong answer ${value}`
					);
				}
			} catch (error) {
				console.log(error);
			}
		},
		lt: (value: number) => {
			try {
				if (result < value) {
					console.log(
						`${fn.name} PASSED✅✅ , produced the correct answer ${value}`
					);
				} else {
					throw new Error(
						`${fn.name} Failed❌❌, produced the wrong answer ${value}`
					);
				}
			} catch (error) {
				console.log(error);
			}
		},
		lte: (value: number) => {
			try {
				if (result <= value) {
					console.log(
						`${fn.name} PASSED✅✅ , produced the correct answer ${value}`
					);
				} else {
					throw new Error(
						`${fn.name} Failed❌❌, produced the wrong answer ${value}`
					);
				}
			} catch (error) {
				console.log(error);
			}
		},
		includes: () => {},
	};
	return testObject;
}

const sum = (a: number, b: number): number => {
	return a + b;
};

test(sum, [1, 3]).equals(5);
test(sum, [1, 3]).equals(4);
