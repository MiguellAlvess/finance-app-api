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
            const idIsValid = checkIfIdIsValid(httpRequest.params.transactionId)

            if (!idIsValid) {
                return invalidIdResponse()
            }

            const deletedTransaction =
                await this.deleteTransactionUseCase.execute(
                    httpRequest.params.transactionId,
                    httpRequest.params.user_id,
                )

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
