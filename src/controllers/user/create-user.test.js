import { CreateUserController } from './create-user.js'
describe('Create User Controller', () => {
    class CreateUserUseCaseStuby {
        execute(user) {
            return user
        }
    }
    it('should returns 201 when creating a user successfully', async () => {
        // arrange
        const createUserUseCase = new CreateUserUseCaseStuby()
        const createUserController = new CreateUserController(createUserUseCase)

        const httpRequest = {
            body: {
                first_name: 'Miguel',
                last_name: 'Alves',
                email: 'miguel2@gmail.com',
                password: '1234567',
            },
        }

        // act

        const result = await createUserController.execute(httpRequest)

        // assert
        expect(result.statusCode).toBe(201)
        expect(result.body).toBe(httpRequest.body)
    })

    it('should return 400 if first_name is not provided', async () => {
        // arrange
        const createUserUseCase = new CreateUserUseCaseStuby()
        const createUserController = new CreateUserController(createUserUseCase)

        const httpRequest = {
            body: {
                last_name: 'Alves',
                email: 'miguel2@gmail.com',
                password: '1234567',
            },
        }

        // act

        const result = await createUserController.execute(httpRequest)

        // assert

        expect(result.statusCode).toBe(400)
    })

    it('should return 400 if last_name is not provided', async () => {
        // arrange
        const createUserUseCase = new CreateUserUseCaseStuby()
        const createUserController = new CreateUserController(createUserUseCase)

        const httpRequest = {
            body: {
                first_name: 'Miguel',
                email: 'miguel2@gmail.com',
                password: '1234567',
            },
        }

        // act

        const result = await createUserController.execute(httpRequest)

        // assert

        expect(result.statusCode).toBe(400)
    })
})
