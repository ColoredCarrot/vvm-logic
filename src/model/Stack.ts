export class Stack {

    values: number[] = [];

    push = (value: number) => {
        this.values.push(value);
    };

    pop() {
        this.values.pop();
    }

    get(index: number) {
        return this.values[index];
    }

    set(index: number, value: number) {
        this.values[index] = value;
    }

}
