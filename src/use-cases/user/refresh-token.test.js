import { UnauthorizedError } from '../../errors'
import { RefreshTokenUseCase } from './refresh-token'

describe('Refresh Token Use Case', () => {
    class TokensGeneratorAdapterStub {
        execute() {
            return {
                acessToken: 'any_acess_token',
                refreshToken: 'any_refresh_token',
            }
        }
    }
    class TokenVerifierAdapterStub {
        execute() {
            return true
        }
    }

    const makeSut = () => {
        const tokensGeneratorAdapter = new TokensGeneratorAdapterStub()
        const tokenVerifierAdapter = new TokenVerifierAdapterStub()
        const sut = new RefreshTokenUseCase(
            tokensGeneratorAdapter,
            tokenVerifierAdapter,
        )

        return {
            sut,
            tokensGeneratorAdapter,
            tokenVerifierAdapter,
        }
    }

    it('should return new tokens', () => {
        const { sut } = makeSut()
        const refreshToken = 'any_refresh_token'

        const result = sut.execute(refreshToken)

        expect(result).toEqual({
            acessToken: 'any_acess_token',
            refreshToken: 'any_refresh_token',
        })
    })

    it('should throw if TokenVerifierAdapter throws', () => {
        const { sut, tokenVerifierAdapter } = makeSut()
        import.meta.jest
            .spyOn(tokenVerifierAdapter, 'execute')
            .mockImplementationOnce(() => {
                throw new Error()
            })

        expect(() => sut.execute('any_refresh_token')).toThrow(
            UnauthorizedError,
        )
    })
})
