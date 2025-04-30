import { faker } from '@faker-js/faker'
import { CreateUserController } from './create-user.js'
import { EmailAlreadyInUseError } from '../../errors/user.js'
describe('Create User Controller', () => {
    class CreateUserUseCaseStuby {
        execute(user) {
            return user
        }
    }

    const makeSut = () => {
        const createUserUseCase = new CreateUserUseCaseStuby()
        const sut = new CreateUserController(createUserUseCase)
        return { createUserUseCase, sut }
    }
    it('should returns 201 when creating a user successfully', async () => {
        // arrange
        const { sut } = makeSut()

        const httpRequest = {
            body: {
                first_name: faker.person.firstName(),
                last_name: faker.person.lastName(),
                email: faker.internet.email(),
                password: faker.internet.password({
                    length: 6,
                }),
            },
        }

        // act

        const result = await sut.execute(httpRequest)

        // assert
        expect(result.statusCode).toBe(201)
        expect(result.body).toBe(httpRequest.body)
    })

    it('should return 400 if first_name is not provided', async () => {
        // arrange
        const { sut } = makeSut()

        const httpRequest = {
            body: {
                last_name: faker.person.lastName(),
                email: faker.internet.email(),
                password: faker.internet.password({
                    length: 6,
                }),
            },
        }

        // act

        const result = await sut.execute(httpRequest)

        // assert

        expect(result.statusCode).toBe(400)
    })

    it('should return 400 if last_name is not provided', async () => {
        // arrange
        const { sut } = makeSut()

        const httpRequest = {
            body: {
                first_name: faker.person.firstName(),
                email: faker.internet.email(),
                password: faker.internet.password({
                    length: 6,
                }),
            },
        }

        // act

        const result = await sut.execute(httpRequest)

        // assert

        expect(result.statusCode).toBe(400)
    })

    it('should return 400 if email is not provided', async () => {
        // arrange
        const { sut } = makeSut()

        const httpRequest = {
            body: {
                first_name: faker.person.firstName(),
                last_name: faker.person.lastName(),
                password: faker.internet.password({
                    length: 6,
                }),
            },
        }

        // act

        const result = await sut.execute(httpRequest)

        // assert

        expect(result.statusCode).toBe(400)
    })

    it('should return 400 if email is not valid', async () => {
        // arrange
        const { sut } = makeSut()

        const httpRequest = {
            body: {
                first_name: faker.person.firstName(),
                last_name: faker.person.lastName(),
                email: 'invalid_email',
                password: faker.internet.password({
                    length: 6,
                }),
            },
        }

        // act

        const result = await sut.execute(httpRequest)

        // assert

        expect(result.statusCode).toBe(400)
    })

    it('should return 400 if password is not provided', async () => {
        // arrange
        const { sut } = makeSut()

        const httpRequest = {
            body: {
                first_name: faker.person.firstName(),
                last_name: faker.person.lastName(),
                email: faker.internet.email(),
            },
        }

        // act

        const result = await sut.execute(httpRequest)

        // assert

        expect(result.statusCode).toBe(400)
    })

    it('should return 400 if password is less than 6 characters', async () => {
        // arrange
        const { sut } = makeSut()

        const httpRequest = {
            body: {
                first_name: faker.person.firstName(),
                last_name: faker.person.lastName(),
                email: faker.internet.email(),
                password: faker.internet.password({
                    length: 5,
                }),
            },
        }

        // act

        const result = await sut.execute(httpRequest)

        // assert

        expect(result.statusCode).toBe(400)
    })

    it('should call CreateUserUseCase with correct params', async () => {
        // arrange
        const { sut, createUserUseCase } = makeSut()

        const httpRequest = {
            body: {
                first_name: faker.person.firstName(),
                last_name: faker.person.lastName(),
                email: faker.internet.email(),
                password: faker.internet.password({
                    length: 6,
                }),
            },
        }

        const executeSpy = jest.spyOn(createUserUseCase, 'execute')

        // act

        await sut.execute(httpRequest)

        // assert

        expect(executeSpy).toHaveBeenCalledWith(httpRequest.body)
    })

    it('should return 500 if CreateUserUseCase throws', async () => {
        // arrange
        const { sut, createUserUseCase } = makeSut()

        const httpRequest = {
            body: {
                first_name: faker.person.firstName(),
                last_name: faker.person.lastName(),
                email: faker.internet.email(),
                password: faker.internet.password({
                    length: 6,
                }),
            },
        }

        jest.spyOn(createUserUseCase, 'execute').mockImplementationOnce(() => {
            throw new Error()
        })

        // act

        const result = await sut.execute(httpRequest)

        // assert

        expect(result.statusCode).toBe(500)
    })

    it('should return 400 if CreateUserUseCase throws EmailIsAlreadyInUseError', async () => {
        // arrange
        const { sut, createUserUseCase } = makeSut()

        const httpRequest = {
            body: {
                first_name: faker.person.firstName(),
                last_name: faker.person.lastName(),
                email: faker.internet.email(),
                password: faker.internet.password({
                    length: 6,
                }),
            },
        }

        jest.spyOn(createUserUseCase, 'execute').mockImplementationOnce(() => {
            throw new EmailAlreadyInUseError(httpRequest.body.email)
        })

        // act
        const result = await sut.execute(httpRequest)

        // assert
        expect(result.statusCode).toBe(400)
    })
})
