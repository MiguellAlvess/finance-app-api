import { UnauthorizedError } from '../../errors'
import { RefreshTokenController } from './refresh-token'

describe('Refresh Token Controller', () => {
    class RefreshTokenUseCaseStub {
        execute() {
            return {
                accessToken: 'any_acess_token',
                refreshToken: 'any_refresh_token',
            }
        }
    }
    const makeSut = () => {
        const refreshTokenUseCase = new RefreshTokenUseCaseStub()
        const sut = new RefreshTokenController(refreshTokenUseCase)

        return {
            sut,
            refreshTokenUseCase,
        }
    }

    it('should return 200 if refresh token is valid', async () => {
        const { sut } = makeSut()
        const httpRequest = {
            body: {
                refreshToken: 'any_refresh_token',
            },
        }

        const response = await sut.execute(httpRequest)

        expect(response.statusCode).toBe(200)
    })

    it('should return 400 if refresh token is invalid', async () => {
        const { sut } = makeSut()
        const httpRequest = {
            body: {
                refreshToken: 2,
            },
        }

        const response = await sut.execute(httpRequest)

        expect(response.statusCode).toBe(400)
    })

    it('should return 401 if use case throws UnauthorizedError', async () => {
        const { sut, refreshTokenUseCase } = makeSut()
        import.meta.jest
            .spyOn(refreshTokenUseCase, 'execute')
            .mockImplementationOnce(() => {
                throw new UnauthorizedError()
            })

        const httpRequest = {
            body: {
                refreshToken: 'any_refresh_token',
            },
        }

        const response = await sut.execute(httpRequest)

        expect(response.statusCode).toBe(401)
    })
})
