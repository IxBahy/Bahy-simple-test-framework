type FunctionArguments<T> = T extends (...args: infer A) => any ? A : never;
type ArrayElement<T> = T extends readonly (infer A)[] ? A : never;

type testObject = {
	equals: (expected: any) => void;
	gt: (expected: number) => void;
	gte: (expected: number) => void;
	lt: (expected: number) => void;
	lte: (expected: number) => void;
	includes: (expected: string) => void;
};

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

const sum = (a: number, b: number): number => {
	return a + b;
};

test(sum, [1, 3]).equals(4);
