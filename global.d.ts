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
