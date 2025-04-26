import {
    invalidIdResponse,
    serverError,
    checkIfIdIsValid,
    userNotFoundResponse,
    ok,
} from '../helpers/index.js'

import { UserNotFoundError } from '../../errors/user.js'

export class GetUserBalanceController {
    constructor(getUserBalanceUseCase) {
        this.getUserBalanceUseCase = getUserBalanceUseCase
    }

    async execute(httpRequest) {
        try {
            const userId = httpRequest.params.userId

            const isIdValid = checkIfIdIsValid(userId)

            if (!isIdValid) {
                return invalidIdResponse()
            }

            const balance = await this.getUserBalanceUseCase.execute({
                userId: userId,
            })

            return ok(balance)
        } catch (error) {
            if (error instanceof UserNotFoundError) {
                return userNotFoundResponse()
            }
            console.error(error)
            return serverError()
        }
    }
}
