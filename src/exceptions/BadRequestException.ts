import { BaseException } from "./BaseException";

export class BadRequestException extends BaseException {
    constructor(message = 'Bad Request') {
        super(message, 400, 'BadRequestException');
    }
}