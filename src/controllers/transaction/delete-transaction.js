import {
    checkIfIdIsValid,
    serverError,
    invalidIdResponse,
    ok,
    transactionNotFoundResponse,
} from '../helpers/index.js'

import { TransactionNotFoundError } from '../../errors/index.js'

export class DeleteTransactionController {
    constructor(deleteTransactionUseCase) {
        this.deleteTransactionUseCase = deleteTransactionUseCase
    }
    async execute(httpRequest) {
        try {
            const transactionId = httpRequest.params.transactionId

            const idIsValid = checkIfIdIsValid(transactionId)

            if (!idIsValid) {
                return invalidIdResponse()
            }

            const deletedTransaction =
                await this.deleteTransactionUseCase.execute(transactionId)

            return ok(deletedTransaction)
        } catch (error) {
            if (error instanceof TransactionNotFoundError) {
                return transactionNotFoundResponse()
            }
            console.log(error)
            return serverError()
        }
    }
}
