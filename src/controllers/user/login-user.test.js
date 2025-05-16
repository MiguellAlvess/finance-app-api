import { LoginUserController } from './login-user.js'
import { user } from '../../tests/index.js'

describe('Login User Controller', () => {
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

        const result = await sut.execute({
            body: {
                email: user.email,
                password: user.password,
            },
        })

        expect(result.statusCode).toBe(200)
        expect(result.body.tokens.accessToken).toBe('any_acess_token')
        expect(result.body.tokens.refreshToken).toBe('any_refresh_token')
    })
})
