export class ExecutionError extends Error {
    constructor(message: string, readonly explanation?: string) {
        super(message);
    }
}

export class IllegalOperationError extends ExecutionError {

}
