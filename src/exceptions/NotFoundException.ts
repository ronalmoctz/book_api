import { BaseException } from "./BaseException.js";

export class NotFoundException extends BaseException {
    constructor(message = 'Resource not found') {
        super(message, 404, 'NotFoundException');
    }
}