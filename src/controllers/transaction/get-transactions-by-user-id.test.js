import { faker } from '@faker-js/faker'
import { GetTransactionsByUserIdController } from './get-transactions-by-user-id.js'
import { UserNotFoundError } from '../../errors/user.js'
import { transaction } from '../../tests/index.js'

describe('Get Transactions By User ID', () => {
    const from = '2025-05-19'
    const to = '2025-05-30'
    class GetTransactionsByUserIdUseCaseStub {
        async execute() {
            return transaction
        }
    }
    const makeSut = () => {
        const getTransactionsByUserIdUseCase =
            new GetTransactionsByUserIdUseCaseStub()
        const sut = new GetTransactionsByUserIdController(
            getTransactionsByUserIdUseCase,
        )

        return {
            sut,
            getTransactionsByUserIdUseCase,
        }
    }

    it('should return 200 when finding transactions by user id successfully', async () => {
        // arrange
        const { sut } = makeSut()

        // act
        const response = await sut.execute({
            query: {
                userId: faker.string.uuid(),
                from,
                to,
            },
        })

        // assert
        expect(response.statusCode).toBe(200)
    })
    it('should return 400 when missing userId param', async () => {
        // arrange
        const { sut } = makeSut()

        // act
        const response = await sut.execute({
            query: {
                userId: undefined,
                from,
                to,
            },
        })

        // assert
        expect(response.statusCode).toBe(400)
    })

    it('should return 400 when missing userId param is invalid', async () => {
        // arrange
        const { sut } = makeSut()

        // act
        const response = await sut.execute({
            query: {
                userId: 'invalid_id',
                from,
                to,
            },
        })

        // assert
        expect(response.statusCode).toBe(400)
    })

    it('should return 404 GetTransactionsByUserIdUseCase throws UserNotFoundError', async () => {
        // arrange
        const { sut, getTransactionsByUserIdUseCase } = makeSut()
        import.meta.jest
            .spyOn(getTransactionsByUserIdUseCase, 'execute')
            .mockRejectedValueOnce(new UserNotFoundError())

        // act
        const response = await sut.execute({
            query: {
                userId: faker.string.uuid(),
                from,
                to,
            },
        })

        // assert
        expect(response.statusCode).toBe(404)
    })

    it('should return 500 when GetTransactionsByUserIdUseCase throws', async () => {
        // arrange
        const { sut, getTransactionsByUserIdUseCase } = makeSut()
        import.meta.jest
            .spyOn(getTransactionsByUserIdUseCase, 'execute')
            .mockRejectedValueOnce(new Error())

        // act
        const response = await sut.execute({
            query: {
                userId: faker.string.uuid(),
                from,
                to,
            },
        })

        // assert
        expect(response.statusCode).toBe(500)
    })

    it('should call GetTransactionsByUserIdUseCase with correct params', async () => {
        // arrange
        const { sut, getTransactionsByUserIdUseCase } = makeSut()
        const executeSpy = import.meta.jest.spyOn(
            getTransactionsByUserIdUseCase,
            'execute',
        )

        const userId = faker.string.uuid()

        // act
        await sut.execute({
            query: {
                userId,
                from,
                to,
            },
        })

        // assert
        expect(executeSpy).toHaveBeenCalledWith(userId, from, to)
    })
})
