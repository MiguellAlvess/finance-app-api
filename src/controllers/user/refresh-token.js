import { ZodError } from 'zod'
import { UnauthorizedError } from '../../errors/index.js'
import { refreshTokenSchema } from '../../schemas/index.js'
import {
    userUnauthorizedResponse,
    serverError,
    ok,
    badRequest,
} from '../helpers/index.js'

export class RefreshTokenController {
    constructor(refreshTokenUseCase) {
        this.refreshTokenUseCase = refreshTokenUseCase
    }

    async execute(httpRequest) {
        try {
            const params = httpRequest.body

            await refreshTokenSchema.parseAsync(params)

            const refreshToken = params.refreshToken

            const response = this.refreshTokenUseCase.execute(refreshToken)

            return ok(response)
        } catch (error) {
            console.log(error)
            if (error instanceof ZodError) {
                return badRequest({ message: error.errors[0].message })
            }
            if (error instanceof UnauthorizedError) {
                return userUnauthorizedResponse()
            }
            return serverError()
        }
    }
}
