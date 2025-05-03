import { faker } from '@faker-js/faker'
import { DeleteUserUseCase } from './delete-user'
describe('Delete User Use Case', () => {
    const user = {
        id: faker.string.uuid(),
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password({
            length: 6,
        }),
    }
    class DeleteUserRepositoryStub {
        async execute() {
            return user
        }
    }

    const makeSut = () => {
        const deleteUserRepositoryStub = new DeleteUserRepositoryStub()
        const sut = new DeleteUserUseCase(deleteUserRepositoryStub)

        return {
            sut,
            deleteUserRepositoryStub,
        }
    }

    it('should successfully delete a user', async () => {
        // arrange
        const { sut } = makeSut()

        // act
        const deletedUser = await sut.execute(faker.string.uuid())

        // assert
        expect(deletedUser).toEqual(user)
    })

    it('should call DeleteUserRepository with correct params', async () => {
        // arrange
        const { sut, deleteUserRepositoryStub } = makeSut()
        const deleteUserSpy = jest.spyOn(deleteUserRepositoryStub, 'execute')
        const userId = faker.string.uuid()

        // act
        await sut.execute(userId)

        // asset
        expect(deleteUserSpy).toHaveBeenCalledWith(userId)
    })
})
