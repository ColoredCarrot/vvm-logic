import {State} from "../model/State";
import {expect} from "@jest/globals";

expect.extend({
    toEqualState(actual: unknown, expected: unknown) {
        if (!(actual instanceof State && expected instanceof State)) {
            throw new Error("actual and expected must be of type State");
        }

        if (actual.equals(expected)) {
            return {
                message: () => "Expected INequality between states.\n" + this.utils.printDiffOrStringify(expected, actual, "Expected", "Actual", true),
                pass: true
            };
        } else {
            return {
                message: () => "Expected equality between states.\n" + this.utils.printDiffOrStringify(expected, actual, "Expected", "Actual", true),
                pass: false
            };
        }
    }
});

declare module "expect" {
    interface AsymmetricMatchers {
        toEqualState(expected: State): void;
    }
    interface Matchers<R> {
        toEqualState(expected: State): R;
    }
}
