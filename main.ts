import sha256 from "crypto-js/sha256";
import hmacSHA512 from "crypto-js/hmac-sha512";
import Base64 from "crypto-js/enc-base64";
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

type testFunction = (
	...args: any[]
) => string | number | string[] | number[] | Record<string, unknown>;
type testObject<T = testFunction> = {
	equals: (expected: ArrayElement<FunctionArguments<T>>) => void;
	gt: (value: number) => void;
	gte: (value: number) => void;
	lt: (value: number) => void;
	lte: (value: number) => void;
	includes: (subValue: string | number) => void;
	isSame: (obj: Record<string, unknown> | any[]) => void;
};

type NumberTestParams = Exclude<keyof testObject, "includes" | "isSame">;
const NumberPropertiesToShow: readonly NumberTestParams[] = [
	"equals",
	"gt",
	"gte",
	"lt",
	"lte",
] as const;

type NumberTestObject = Pick<testObject, NumberTestParams>;

type StringTestParams = Exclude<keyof testObject, "isSame">;
const StringPropertiesToShow: readonly StringTestParams[] = [
	"equals",
	"gt",
	"gte",
	"lt",
	"lte",
	"includes",
] as const;
type StringTestObject = Pick<testObject, StringTestParams>;
type ObjectTestParams = Exclude<
	keyof testObject,
	"lt" | "lte" | "gt" | "gte" | "equals"
>;
type ObjectTestObject = Pick<testObject, ObjectTestParams>;

const ObjectPropertiesToShow: readonly ObjectTestParams[] = [
	"isSame",
	"includes",
] as const;

type testFunctionReturn<T extends testFunction> = ReturnType<T> extends number
	? NumberTestObject
	: ReturnType<T> extends string
	? StringTestObject
	: ObjectTestObject;

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

function test<T extends testFunction>(
	fn: T,
	values: FunctionArguments<T>
): testFunctionReturn<T> {
	const result = fn(...values);

	const testedValueAsNumber =
		typeof result === "string" || Array.isArray(result)
			? result.length
			: isObject(result)
			? Object.keys(result).length
			: result;

	const TestingFunctions = {
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
		gt: (value: number) => {
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
		isSame: (obj: Record<string, unknown> | any[]) => {
			if (isObject(result) || Array.isArray(result)) {
				const first = Base64.stringify(
					hmacSHA512(sha256(JSON.stringify(obj).trim()), "bebo")
				);
				const second = Base64.stringify(
					hmacSHA512(sha256(JSON.stringify(result).trim()), "bebo")
				);
				try {
					if (first === second) {
						console.log(`${fn.name} PASSED✅✅,Both objects are the same`);
					} else {
						throw new Error(`${fn.name} Failed❌❌,objects are not the same`);
					}
				} catch (error) {
					console.log(error);
				}
			}
			// (result)
		},
	};
	const testObject = {} as testFunctionReturn<T>;

	if (typeof result === "number") {
		NumberPropertiesToShow.forEach((key) => {
			let tempObj: { [key: string]: any } = {};
			tempObj[key] = TestingFunctions[key];
			Object.assign(testObject, tempObj);
		});
	} else if (typeof result === "string") {
		StringPropertiesToShow.forEach((key) => {
			let tempObj: { [key: string]: any } = {};
			tempObj[key] = TestingFunctions[key];
			Object.assign(testObject, tempObj);
		});
	} else if (typeof isObject(result) || Array.isArray(result)) {
		ObjectPropertiesToShow.forEach((key) => {
			let tempObj: { [key: string]: any } = {};
			tempObj[key] = TestingFunctions[key];
			Object.assign(testObject, tempObj);
		});
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

test(concatUpperString, ["first", "second"]).equals("FIRSTSECOND");
test(sum, [1, 3]).equals(4);
test(appendToArray<number>, [[1, 2, 3], 5]).includes(5);
test(appendToArray<string>, [["1", "2", "3"], "batman"]).includes("batman");
test(assignToObject<string>, [{ name: "7mo" }, "job", "batman"]).includes(
	"job"
);
test(assignToObject<string>, [{ name: "7mo" }, "job", "batman"]).isSame({
	name: "7mo",
	job: "batman",
});
test(appendToArray<string>, [["1", "2", "3"], "batman"]).isSame([
	"1",
	"2",
	"3",
	"batman",
]);
