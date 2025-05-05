import { CreateTransactionController } from './create-transaction.js'
import { transaction } from '../../tests/index.js'

describe('Create Transaction Controller', () => {
    class CreateTransactionUseCaseStub {
        async execute() {
            return transaction
        }
    }

    const makeSut = () => {
        const createTransactionUseCase = new CreateTransactionUseCaseStub()
        const sut = new CreateTransactionController(createTransactionUseCase)

        return {
            sut,
            createTransactionUseCase,
        }
    }

    const baseHttpRequest = {
        body: {
            ...transaction,
            id: undefined,
        },
    }

    it('should return 201 when creating a transaction successfully (expense)', async () => {
        // arrange
        const { sut } = makeSut()

        // act
        const response = await sut.execute(baseHttpRequest)

        // assert
        expect(response.statusCode).toBe(201)
    })

    it('should return 201 when creating a transaction successfully (earning)', async () => {
        // arrange
        const { sut } = makeSut()

        // act
        const response = await sut.execute({
            ...baseHttpRequest,
            body: {
                ...baseHttpRequest.body,
                type: 'EARNING',
            },
        })

        // assert
        expect(response.statusCode).toBe(201)
    })

    it('should return 201 when creating a transaction successfully (investment)', async () => {
        // arrange
        const { sut } = makeSut()

        // act
        const response = await sut.execute({
            ...baseHttpRequest,
            body: {
                ...baseHttpRequest.body,
                type: 'INVESTMENT',
            },
        })

        // assert
        expect(response.statusCode).toBe(201)
    })

    it('should return 400 when user_id is not provided', async () => {
        // arrange
        const { sut } = makeSut()

        // act
        const response = await sut.execute({
            ...baseHttpRequest.body,
            user_id: undefined,
        })

        // assert
        expect(response.statusCode).toBe(400)
    })

    it('should return 400 when name is not provided', async () => {
        // arrange
        const { sut } = makeSut()

        // act
        const response = await sut.execute({
            ...baseHttpRequest.body,
            name: undefined,
        })

        // assert
        expect(response.statusCode).toBe(400)
    })

    it('should return 400 when date is not provided', async () => {
        // arrange
        const { sut } = makeSut()

        // act
        const response = await sut.execute({
            ...baseHttpRequest.body,
            date: undefined,
        })

        // assert
        expect(response.statusCode).toBe(400)
    })

    it('should return 400 when type is not provided', async () => {
        // arrange
        const { sut } = makeSut()

        // act
        const response = await sut.execute({
            ...baseHttpRequest.body,
            type: undefined,
        })

        // assert
        expect(response.statusCode).toBe(400)
    })

    it('should return 400 when amount is not provided', async () => {
        // arrange
        const { sut } = makeSut()

        // act
        const response = await sut.execute({
            ...baseHttpRequest.body,
            amount: undefined,
        })

        // assert
        expect(response.statusCode).toBe(400)
    })

    it('should return 400 when date is invalid', async () => {
        // arrange
        const { sut } = makeSut()

        // act
        const response = await sut.execute({
            ...baseHttpRequest.body,
            date: 'invalid_date',
        })

        // assert
        expect(response.statusCode).toBe(400)
    })

    it('should return 400 when type is not EXPENSE, EARNING or INVESTMENT', async () => {
        // arrange
        const { sut } = makeSut()

        // act
        const response = await sut.execute({
            ...baseHttpRequest.body,
            type: 'invalid_type',
        })

        // assert
        expect(response.statusCode).toBe(400)
    })

    it('should return 400 when amount is not a valid currency', async () => {
        // arrange
        const { sut } = makeSut()

        // act
        const response = await sut.execute({
            ...baseHttpRequest.body,
            amount: 'invalid_amount',
        })

        // assert
        expect(response.statusCode).toBe(400)
    })

    it('should return 500 when CreateTransactionUseCase throws', async () => {
        // arrange
        const { sut, createTransactionUseCase } = makeSut()
        jest.spyOn(createTransactionUseCase, 'execute').mockRejectedValueOnce(
            new Error(),
        )

        // act
        const response = await sut.execute(baseHttpRequest)

        // assert
        expect(response.statusCode).toBe(500)
    })

    it('should call CreateTransactionUseCase with correct values', async () => {
        // arrange
        const { sut, createTransactionUseCase } = makeSut()
        const executeSpy = jest.spyOn(createTransactionUseCase, 'execute')

        // act
        await sut.execute(baseHttpRequest)

        // assert
        expect(executeSpy).toHaveBeenCalledWith(baseHttpRequest.body)
    })
})
