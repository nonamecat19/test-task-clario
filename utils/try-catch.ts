type Success<T> = {
    data: T;
    error: null;
};

type Failure<E> = {
    data: null;
    error: E;
};

type TypedError = Error & {
    cause?: {
        code?: string
    }
}

type Result<T, E = TypedError> = Success<T> | Failure<E>;

export async function tryCatch<T, E = TypedError>(
    promise: Promise<T>,
): Promise<Result<T, E>> {
    try {
        const data = await promise;
        return {data, error: null};
    } catch (error) {
        return {data: null, error: error as unknown as E};
    }
}