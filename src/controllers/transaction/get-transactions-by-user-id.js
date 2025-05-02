import {
    requiredFieldIsMissingResponse,
    serverError,
    userNotFoundResponse,
    checkIfIdIsValid,
    invalidIdResponse,
    ok,
} from '../helpers/index.js'
import { UserNotFoundError } from '../../errors/user.js'
export class GetTransactionsByUserIdController {
    constructor(getTransactionsByUserIdUseCase) {
        this.getTransactionsByUserIdUseCase = getTransactionsByUserIdUseCase
    }

    async execute(httpRequest) {
        try {
            const userId = httpRequest.query.userId

            if (!userId) {
                return requiredFieldIsMissingResponse('userId')
            }

            const userIdIsValid = checkIfIdIsValid(userId)

            if (!userIdIsValid) {
                return invalidIdResponse()
            }

            const transactions =
                await this.getTransactionsByUserIdUseCase.execute(userId)

            return ok(transactions)
        } catch (error) {
            if (error instanceof UserNotFoundError) {
                return userNotFoundResponse()
            }
            console.error(error)
            return serverError()
        }
    }
}
