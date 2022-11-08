export class Stack {

    values: number[] = [];

    push = (value: number) => {
        this.values.push(value);
    };

    pop() {
        this.values.pop();
    }

    get(index: number) {
        if (index < 0 || index >= this.values.length){
            return this.values[index];
        }
        // sonst: ERROR!
    }

    set(index: number, value: number) {
        this.values[index] = value;
    }

}
