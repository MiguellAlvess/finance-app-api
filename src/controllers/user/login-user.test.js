import { LoginUserController } from './login-user.js'
import { user } from '../../tests/index.js'
import { InvalidPasswordError, UserNotFoundError } from '../../errors/index.js'

describe('Login User Controller', () => {
    const httpRequest = {
        body: {
            email: user.email,
            password: user.password,
        },
    }
    class LoginUserUseCaseStub {
        async execute() {
            return {
                ...user,
                tokens: {
                    accessToken: 'any_acess_token',
                    refreshToken: 'any_refresh_token',
                },
            }
        }
    }
    const makeSut = () => {
        const loginUserUseCase = new LoginUserUseCaseStub()
        const sut = new LoginUserController(loginUserUseCase)

        return {
            sut,
            loginUserUseCase,
        }
    }

    it('should return 200 with user and tokens', async () => {
        const { sut } = makeSut()

        const result = await sut.execute(httpRequest)

        expect(result.statusCode).toBe(200)
        expect(result.body.tokens.accessToken).toBe('any_acess_token')
        expect(result.body.tokens.refreshToken).toBe('any_refresh_token')
    })

    it('should return 401 if password is invalid', async () => {
        const { sut, loginUserUseCase } = makeSut()
        import.meta.jest
            .spyOn(loginUserUseCase, 'execute')
            .mockRejectedValueOnce(new InvalidPasswordError())

        const result = await sut.execute(httpRequest)

        expect(result.statusCode).toBe(401)
    })

    it('should return 404 if user is not found', async () => {
        const { sut, loginUserUseCase } = makeSut()
        import.meta.jest
            .spyOn(loginUserUseCase, 'execute')
            .mockRejectedValueOnce(new UserNotFoundError())

        const result = await sut.execute(httpRequest)

        expect(result.statusCode).toBe(404)
    })
})
