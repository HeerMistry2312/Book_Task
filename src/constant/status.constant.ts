import StatusCode from "../enum/statusCode";

const StatusConstants = {
    BAD_REQUEST:{
        httpStatusCode: StatusCode.BAD_REQUEST,
        body: {
            code: 'bad_request',
            message: 'Page Number not valid',
        },
    },
    DUPLICATE_KEY_VALUE: {
        httpStatusCode: StatusCode.CONFLICT,
        body: {
            code: 'duplicate_key_value',
            message: 'Value already existed',
        },
    },
    INTERNAL_SERVER_ERROR: {
        httpStatusCode: StatusCode.INTERNAL_SERVER_ERROR,
        body: {
            code: 'internal_server_error',
            message: 'Something went wrong, please try again later.',
        },
    },
    NOT_FOUND: {
        httpStatusCode: StatusCode.NOT_FOUND,
        body: {
            code: 'not_found',
            message: 'Data Not Found',
        },
    },
    RESOURCE_NOT_FOUND: {
        httpStatusCode: StatusCode.NOT_FOUND,
        body: {
            code: 'resource_not_found',
            message: 'Requested resource not found.',
        },
    },
    RESOURCE_ALREADY_EXISTS: {
        httpStatusCode: StatusCode.CONFLICT,
        body: {
            code: 'resource_already_exists',
            message: 'Requested resource already exists.',
        },
    },
    FORBIDDEN: {
        httpStatusCode: StatusCode.FORBIDDEN,
        body: {
            code: 'forbidden',
            message: 'Permission denied.',
        },
    },
    UNAUTHORIZED: {
        httpStatusCode: StatusCode.UNAUTHORIZED,
        body: {
            code: 'unauthorized',
            message: 'You are not authorized.',
        },
    },
    TOKEN_EXPIRED: {
        httpStatusCode: StatusCode.UNAUTHORIZED,
        body: {
            code: 'token_expired',
            message: 'Provided authorization token has expired. Please renew the token with the provider entity.',
        },
    },
    CONFLICT: {
        httpStatusCode: StatusCode.CONFLICT,
        body: {
            code: 'conflict',
            message: 'Duplicate resource',
        },
    },
    INVALID_DATA: {
        httpStatusCode: StatusCode.BAD_REQUEST,
        body: {
            code: 'invalid_data',
            message: 'Provided arguments are invalid or do not exist',
        },
    },
    NOT_IMPLEMENTED: {
        httpStatusCode: StatusCode.NOT_IMPLEMENTED,
        body: {
            code: 'not_implemented',
            message: 'Server does not support the functionality required to fulfill the request.',
        },
    },
    UNPROCESSABLE: {
        httpStatusCode: StatusCode.UNPROCESSABLE_ENTITY,
        body: {
            code: 'unprocessable',
            message: 'The request is unable to be processed.',
        },
    },
    PERMISSION_DENIED: {
        httpStatusCode: StatusCode.FORBIDDEN,
        body: {
            code: 'permission_denied',
            message: 'Permission denied.',
        },
    },
};

export default StatusConstants;