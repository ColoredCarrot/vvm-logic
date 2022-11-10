export class ExecutionError extends Error {
    constructor(message: string) {
        super(message);
    }
}

export class IllegalOperationError extends ExecutionError {

}
