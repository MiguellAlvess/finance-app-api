import { faker } from '@faker-js/faker'
import { GetUserByIdUseCase } from './get-user-by-id'
import { user } from '../../tests/index.js'

describe('Get User By Id Use Case', () => {
    class GetUserByIdRepositoryStub {
        async execute() {
            return user
        }
    }
    const makeSut = () => {
        const getUserByIdRepository = new GetUserByIdRepositoryStub()
        const sut = new GetUserByIdUseCase(getUserByIdRepository)

        return {
            sut,
            getUserByIdRepository,
        }
    }

    it('should get user by id successfully', async () => {
        // arrange
        const { sut } = makeSut()

        // act
        const result = await sut.execute(faker.string.uuid())

        // assert
        expect(result).toEqual(user)
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
        await sut.execute(userId)

        // assert
        expect(getUserByIdSpy).toHaveBeenCalledWith(userId)
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
})
