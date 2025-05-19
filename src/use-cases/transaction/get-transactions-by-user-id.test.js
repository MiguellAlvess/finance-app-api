import { faker } from '@faker-js/faker'
import { GetTransactionsByUserIdUseCase } from './get-transactions-by-user-id.js'
import { UserNotFoundError } from '../../errors/user.js'
import { user } from '../../tests/index.js'

describe('Get Transactions By User Id Use Case', () => {
    class GetUserByIdRepositoryStub {
        async execute() {
            return user
        }
    }

    class GetTransactionsByUserIdRepositoryStub {
        async execute() {
            return []
        }
    }

    const makeSut = () => {
        const getTransactionsByUserIdRepository =
            new GetTransactionsByUserIdRepositoryStub()
        const getUserByIdRepository = new GetUserByIdRepositoryStub()
        const sut = new GetTransactionsByUserIdUseCase(
            getTransactionsByUserIdRepository,
            getUserByIdRepository,
        )

        return {
            sut,
            getTransactionsByUserIdRepository,
            getUserByIdRepository,
        }
    }

    it('should get transactions by user id successfully', async () => {
        // arrange
        const { sut } = makeSut()

        // act
        const result = await sut.execute(faker.string.uuid())

        // assert
        expect(result).toEqual([])
    })

    it('should throw UserNotFoundError if user does not exist', async () => {
        // arrange
        const { sut, getUserByIdRepository } = makeSut()
        import.meta.jest
            .spyOn(getUserByIdRepository, 'execute')
            .mockResolvedValueOnce(null)
        const userId = faker.string.uuid()

        // act
        const promise = sut.execute(userId)

        // assert
        expect(promise).rejects.toThrow(new UserNotFoundError(userId))
    })

    it('should call GetUserByIdRepository with correct params', async () => {
        // arrange
        const { sut, getUserByIdRepository } = makeSut()
        const getUserByIdRepositorySpy = import.meta.jest.spyOn(
            getUserByIdRepository,
            'execute',
        )

        const userId = faker.string.uuid()

        // act
        await sut.execute(userId)

        // assert
        expect(getUserByIdRepositorySpy).toHaveBeenCalledWith(userId)
    })

    it('should call GetTransactionsByUserIdRepository with correct params', async () => {
        // arrange
        const { sut, getTransactionsByUserIdRepository } = makeSut()
        const getTransactionsByUserIdRepositorySpy = import.meta.jest.spyOn(
            getTransactionsByUserIdRepository,
            'execute',
        )
        const userId = faker.string.uuid()
        const from = '2025-01-01'
        const to = '2025-01-02'

        // act
        await sut.execute(userId, from, to)

        // assert
        expect(getTransactionsByUserIdRepositorySpy).toHaveBeenCalledWith(
            userId,
            from,
            to,
        )
    })

    it('should throw if GetUserByIdRepository throws', async () => {
        // arrange
        const { sut, getUserByIdRepository } = makeSut()
        import.meta.jest
            .spyOn(getUserByIdRepository, 'execute')
            .mockRejectedValueOnce(new Error())

        // act
        const promise = sut.execute(faker.string.uuid())

        // assert
        await expect(promise).rejects.toThrow()
    })

    it('should throw if GetTransactionsByUserIdRepository throws', async () => {
        // arrange
        const { sut, getTransactionsByUserIdRepository } = makeSut()
        import.meta.jest
            .spyOn(getTransactionsByUserIdRepository, 'execute')
            .mockRejectedValueOnce(new Error())

        // act
        const promise = sut.execute(faker.string.uuid())

        // assert
        await expect(promise).rejects.toThrow()
    })
})
