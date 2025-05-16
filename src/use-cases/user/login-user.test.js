import { LoginUserUseCase } from './login-user'
import { user } from '../../tests/index.js'
import { InvalidPasswordError, UserNotFoundError } from '../../errors/index.js'

describe('Login User Use Case', () => {
    class GetUserByEmailRepositoryStub {
        async execute() {
            return user
        }
    }

    class PasswordComparatorStub {
        execute() {
            return true
        }
    }

    class TokensGeneratorStub {
        execute() {
            return {
                acessToken: 'any_acess_token',
                refreshToken: 'any_refresh_token',
            }
        }
    }

    const makeSut = () => {
        const getUserByEmailRepository = new GetUserByEmailRepositoryStub()
        const passwordComparatorAdapter = new PasswordComparatorStub()
        const tokensGeneratorAdapter = new TokensGeneratorStub()
        const sut = new LoginUserUseCase(
            getUserByEmailRepository,
            passwordComparatorAdapter,
            tokensGeneratorAdapter,
        )

        return {
            sut,
            getUserByEmailRepository,
            passwordComparatorAdapter,
        }
    }
    it('should throw UserNotFoundError if user is not found', async () => {
        const { sut, getUserByEmailRepository } = makeSut()
        import.meta.jest
            .spyOn(getUserByEmailRepository, 'execute')
            .mockResolvedValueOnce(null)

        const promise = sut.execute('any_email', 'any_password')

        await expect(promise).rejects.toThrow(new UserNotFoundError())
    })

    it('should throw InvalidPasswordError if password is invalid', async () => {
        const { sut, passwordComparatorAdapter } = makeSut()
        import.meta.jest
            .spyOn(passwordComparatorAdapter, 'execute')
            .mockReturnValue(false)

        const promise = sut.execute('any_email', 'any_password')

        await expect(promise).rejects.toThrow(new InvalidPasswordError())
    })

    it('should return user with tokens', async () => {
        const { sut } = makeSut()

        const results = await sut.execute('any_email', 'any_password')

        expect(results.tokens.acessToken).toBeDefined()
    })
})
