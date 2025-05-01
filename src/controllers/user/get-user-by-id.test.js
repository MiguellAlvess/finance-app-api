import { GetUserByIdController } from './get-user-by-id.js'
import { faker } from '@faker-js/faker'

describe('Get User By Id Controller', () => {
    class GetUserByIdUseCaseStub {
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
        const getUserByIdUseCase = new GetUserByIdUseCaseStub()
        const sut = new GetUserByIdController(getUserByIdUseCase)
        return { getUserByIdUseCase, sut }
    }

    it('should 200 if user is found', async () => {
        // arrange
        const { sut } = makeSut()

        // act
        const result = await sut.execute({
            params: {
                userId: faker.string.uuid(),
            },
        })

        // assert
        expect(result.statusCode).toBe(200)
    })
})
