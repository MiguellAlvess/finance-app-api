import { loginUserSchema } from '../../schemas/index.js'
import {
    serverError,
    ok,
    badRequest,
    userNotFoundResponse,
    userUnauthorizedResponse,
} from '../helpers/index.js'
import { ZodError } from 'zod'
import { InvalidPasswordError, UserNotFoundError } from '../../errors/index.js'

export class LoginUserController {
    constructor(loginUserUseCase) {
        this.loginUserUseCase = loginUserUseCase
    }
    async execute(httpRequest) {
        try {
            const params = httpRequest.body

            await loginUserSchema.parseAsync(params)

            const user = await this.loginUserUseCase.execute(
                params.email,
                params.password,
            )

            return ok(user)
        } catch (error) {
            if (error instanceof ZodError) {
                return badRequest({ message: error.errors[0].message })
            }
            if (error instanceof InvalidPasswordError) {
                return userUnauthorizedResponse()
            }
            if (error instanceof UserNotFoundError) {
                return userNotFoundResponse()
            }
            console.error(error)
            return serverError()
        }
    }
}
