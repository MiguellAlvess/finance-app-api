import { faker } from '@faker-js/faker'
import { GetUserBalanceUseCase } from './get-user-balance.js'
import { UserNotFoundError } from '../../errors/user.js'
import { userBalance } from '../../tests/fixtures/user.js'

describe('Get User Balance Use Case', () => {
    class GetUserBalanceRepositoryStub {
        async execute() {
            return userBalance
        }
    }
    class GetUserByIdRepositoryStub {
        async execute() {
            return {
                id: faker.string.uuid(),
                first_name: faker.person.firstName(),
                last_name: faker.person.lastName(),
                email: faker.internet.email(),
                password: faker.internet.password({
                    length: 6,
                }),
            }
        }
    }

    const makeSut = () => {
        const getUserBalanceRepository = new GetUserBalanceRepositoryStub()
        const getUserByIdRepository = new GetUserByIdRepositoryStub()
        const sut = new GetUserBalanceUseCase(
            getUserBalanceRepository,
            getUserByIdRepository,
        )
        return {
            sut,
            getUserBalanceRepository,
            getUserByIdRepository,
        }
    }

    const from = '2025-01-01'
    const to = '2025-01-31'

    it('should get user balance successfully', async () => {
        // arrange
        const { sut } = makeSut()

        // act
        const result = await sut.execute(faker.string.uuid(), from, to)

        // assert
        expect(result).toEqual(userBalance)
    })

    it('should throw UserNotFoundError if GetUserByIdRepository returns null', async () => {
        // arrange
        const { sut, getUserByIdRepository } = makeSut()
        import.meta.jest
            .spyOn(getUserByIdRepository, 'execute')
            .mockResolvedValueOnce(null)
        const userId = faker.string.uuid()

        // act
        const promise = sut.execute(userId, from, to)

        // assert
        await expect(promise).rejects.toThrow(new UserNotFoundError(userId))
    })

    it('should call GetUserByIdRepository with correct params', async () => {
        // arrange
        const { sut, getUserByIdRepository } = makeSut()
        const getUserByIdSpy = import.meta.jest.spyOn(
            getUserByIdRepository,
            'execute',
        )
        const userId = faker.string.uuid()

        // act
        await sut.execute(userId, from, to)

        // assert
        expect(getUserByIdSpy).toHaveBeenCalledWith(userId)
    })

    it('should call GetUserBalanceRepository with correct params', async () => {
        // arrange
        const { sut, getUserBalanceRepository } = makeSut()
        const getUserBalanceSpy = import.meta.jest.spyOn(
            getUserBalanceRepository,
            'execute',
        )
        const userId = faker.string.uuid()

        // act
        await sut.execute(userId, from, to)

        // assert
        expect(getUserBalanceSpy).toHaveBeenCalledWith(userId, from, to)
    })

    it('should throw if GetUserByIdRepository throws', async () => {
        // arrange
        const { sut, getUserByIdRepository } = makeSut()
        import.meta.jest
            .spyOn(getUserByIdRepository, 'execute')
            .mockRejectedValueOnce(new Error())

        // act
        const promise = sut.execute(faker.string.uuid(), from, to)

        // assert
        await expect(promise).rejects.toThrow()
    })

    it('should throw if GetuserBalanceRepository throws', async () => {
        // arrange
        const { sut, getUserBalanceRepository } = makeSut()
        import.meta.jest
            .spyOn(getUserBalanceRepository, 'execute')
            .mockRejectedValueOnce(new Error())

        // act
        const promise = sut.execute(faker.string.uuid(), from, to)

        // assert
        await expect(promise).rejects.toThrow()
    })
})
