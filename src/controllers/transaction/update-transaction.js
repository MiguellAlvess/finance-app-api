import { ForbiddenError, TransactionNotFoundError } from '../../errors/index.js'
import { updateTransactionSchema } from '../../schemas/index.js'
import {
    serverError,
    ok,
    badRequest,
    checkIfIdIsValid,
    invalidIdResponse,
    transactionNotFoundResponse,
    forbiddenResponse,
} from '../helpers/index.js'

import { ZodError } from 'zod'

export class UpdateTransactionController {
    constructor(updateTransactionUseCase) {
        this.updateTransactionUseCase = updateTransactionUseCase
    }
    async execute(httpRequest) {
        try {
            const idIsValid = checkIfIdIsValid(httpRequest.params.transactionId)

            if (!idIsValid) {
                return invalidIdResponse()
            }
            const params = httpRequest.body

            await updateTransactionSchema.parseAsync(params)

            const transaction = await this.updateTransactionUseCase.execute(
                httpRequest.params.transactionId,
                params,
            )

            return ok(transaction)
        } catch (error) {
            if (error instanceof ZodError) {
                return badRequest({ message: error.errors[0].message })
            }
            if (error instanceof ForbiddenError) {
                return forbiddenResponse()
            }
            if (error instanceof TransactionNotFoundError) {
                return transactionNotFoundResponse()
            }
            console.error(error)
            return serverError()
        }
    }
}
