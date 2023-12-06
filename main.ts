//////////////////////////////////////////////////////
///////////////////// Types //////////////////////////
//////////////////////////////////////////////////////

type FunctionArguments<T> = T extends (...args: infer A) => any ? A : never;
type ArrayElement<T> = T extends (infer A)[] ? A : never;
type IncludeParameter<T> = T extends string
	? string
	: T extends Array<string | number>
	? ArrayElement<T>
	: never;
// type NumberTestParams = Exclude<keyof testObject, "includes">;
// type StringTestParams = Exclude<keyof testObject, "lt" | "lte" | "gt" | "gte">;

//////////////////////////////////////////////////////
////////////////// Type Guards ///////////////////////
//////////////////////////////////////////////////////

const isObject = (input: unknown): input is Record<string, unknown> => {
	return typeof input === "object" && input !== null && !Array.isArray(input);
};
function arrayIsOfType(
	array: number[] | string[],
	type: "string" | "number"
): array is number[] {
	let res: boolean = true;
	array.forEach((element) => {
		if (typeof element !== type) {
			res = false;
		}
	});
	return res;
}
//////////////////////////////////////////////////////
/////////////////// Functions  ///////////////////////
//////////////////////////////////////////////////////

function test<
	T extends (
		...args: any[]
	) => string | number | string[] | number[] | Record<string, unknown>
>(fn: T, values: FunctionArguments<T>) {
	const result = fn(...values);
	const testedValueAsNumber =
		typeof result === "string" || Array.isArray(result)
			? result.length
			: isObject(result)
			? Object.keys(result).length
			: result;
	const testObject = {
		equals: (expected: ArrayElement<typeof values>): void => {
			try {
				if (result === expected) {
					console.log(
						`${fn.name} PASSED✅✅ , produced the correct answer ${expected}`
					);
				} else {
					throw new Error(
						`${fn.name} Failed❌❌, produced the wrong answer ${expected} it produces ${result} insted`
					);
				}
			} catch (error) {
				console.log(error);
			}
		},
		gt: function (value: number) {
			try {
				if ((testedValueAsNumber as number) > value) {
					console.log(
						`${fn.name} PASSED✅✅ , produced the correct answer ${value}`
					);
				} else {
					throw new Error(
						`${fn.name} Failed❌❌, produced the wrong answer ${value} is not greater than ${result}`
					);
				}
			} catch (error) {
				console.log(error);
			}
		},
		gte: (value: number) => {
			try {
				if (testedValueAsNumber >= value) {
					console.log(
						`${fn.name} PASSED✅✅ , produced the correct answer ${value}`
					);
				} else {
					throw new Error(
						`${fn.name} Failed❌❌, produced the wrong answer ${value} is not greater than or equal  ${result}`
					);
				}
			} catch (error) {
				console.log(error);
			}
		},
		lt: (value: number) => {
			try {
				if (testedValueAsNumber < value) {
					console.log(
						`${fn.name} PASSED✅✅ , produced the correct answer ${value}`
					);
				} else {
					throw new Error(
						`${fn.name} Failed❌❌, produced the wrong answer ${value} is not less than  ${result}`
					);
				}
			} catch (error) {
				console.log(error);
			}
		},
		lte: (value: number) => {
			try {
				if (testedValueAsNumber <= value) {
					console.log(
						`${fn.name} PASSED✅✅ , produced the correct answer ${value}`
					);
				} else {
					throw new Error(
						`${fn.name} Failed❌❌, produced the wrong answer ${value} is not less than or equal  ${result}`
					);
				}
			} catch (error) {
				console.log(error);
			}
		},
		includes: (subValue: IncludeParameter<typeof result>) => {
			let isIncluded: boolean = false;
			if (typeof result === "string") {
				isIncluded = result.includes(String(subValue));
			} else if (Array.isArray(result)) {
				if (arrayIsOfType(result, "number")) {
					isIncluded = result.includes(Number(subValue));
				} else if (arrayIsOfType(result, "string")) {
					isIncluded = result.includes(String(subValue));
				}
			} else if (isObject(result)) {
				isIncluded = !!result[subValue];
			}
			try {
				if (isIncluded) {
					console.log(`${fn.name} PASSED✅✅, ${subValue} is included `);
				} else {
					throw new Error(
						`${fn.name} Failed❌❌ , ${subValue} isn't included `
					);
				}
			} catch (error) {
				console.log(error);
			}
		},
	};
	if (typeof result === "number") {
	}
	return testObject;
}
//////////////////////////////////////////
// to test
const sum = (a: number, b: number): number => {
	return a + b;
};
const appendToArray = <T>(arr: T[], val: T) => {
	arr.push(val);
	return arr;
};
const assignToObject = <T>(
	obj: Record<string, unknown>,
	key: string,
	value: T
) => {
	obj[key] = value;
	return obj;
};
const concatUpperString = (a: string, b: string): string => {
	return a.concat(b).toUpperCase();
};

// attempts
// test(concatUpperString, ["first", "second"]).equals("FIRSTSECOND");
test(sum, [1, 3]).equals(4);
test(appendToArray<number>, [[1, 2, 3], 5]).includes(5);
test(appendToArray<string>, [["1", "2", "3"], "batman"]).includes("batman");
test(assignToObject<string>, [{ name: "7mo" }, "job", "batman"]).includes(
	"job"
);
