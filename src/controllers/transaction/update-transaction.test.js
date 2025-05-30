import { faker } from '@faker-js/faker'
import { UpdateTransactionController } from './update-transaction.js'
import { transaction } from '../../tests/index.js'
import { TransactionNotFoundError } from '../../errors/transaction.js'
describe('Update Transaction Controller', () => {
    class updateTransactionUseCaseStub {
        async execute() {
            return transaction
        }
    }

    const baseHttpRequest = {
        params: {
            transactionId: faker.string.uuid(),
        },
        body: {
            name: faker.commerce.productName(),
            date: faker.date.anytime().toISOString(),
            type: 'EXPENSE',
            amount: Number(faker.finance.amount()),
        },
    }

    const makeSut = () => {
        const updateTransactionUseCase = new updateTransactionUseCaseStub()
        const sut = new UpdateTransactionController(updateTransactionUseCase)

        return {
            sut,
            updateTransactionUseCase,
        }
    }
    it('should return 200 when transaction is updated successfully', async () => {
        // arrange
        const { sut } = makeSut()

        // act
        const response = await sut.execute(baseHttpRequest)

        // assert
        expect(response.statusCode).toBe(200)
    })

    it('should return 400 when transaction id is invalid', async () => {
        // arrange
        const { sut } = makeSut()

        // act
        const response = await sut.execute({
            ...baseHttpRequest,
            params: {
                transactionId: 'invalid_id',
            },
        })

        // assert
        expect(response.statusCode).toBe(400)
    })

    it('should return 400 when amount is not a valid currency', async () => {
        // arrange
        const { sut } = makeSut()

        // act
        const response = await sut.execute({
            ...baseHttpRequest,
            body: {
                ...baseHttpRequest.body,
                amount: 'invalid_amount',
            },
        })

        // assert
        expect(response.statusCode).toBe(400)
    })

    it('should return 400 when type is invalid', async () => {
        // arrange
        const { sut } = makeSut()

        // act
        const response = await sut.execute({
            ...baseHttpRequest,
            body: {
                ...baseHttpRequest.body,
                type: 'invalid_type',
            },
        })

        // assert
        expect(response.statusCode).toBe(400)
    })

    it('should return 500 when UpdateTransactionUseCase throws', async () => {
        // arrange
        const { sut, updateTransactionUseCase } = makeSut(0)
        import.meta.jest
            .spyOn(updateTransactionUseCase, 'execute')
            .mockRejectedValueOnce(new Error())

        // act
        const response = await sut.execute(baseHttpRequest)

        // assert
        expect(response.statusCode).toBe(500)
    })

    it('should call UpdateTransactionUseCase with correct params', async () => {
        // arrange
        const { sut, updateTransactionUseCase } = makeSut()
        const executeSpy = import.meta.jest.spyOn(
            updateTransactionUseCase,
            'execute',
        )

        // act
        await sut.execute(baseHttpRequest)

        // asssert
        expect(executeSpy).toHaveBeenCalledWith(
            baseHttpRequest.params.transactionId,
            baseHttpRequest.body,
        )
    })

    it('should return 404 whe TransactionNotFoundError is thrown', async () => {
        // arrange
        const { sut, updateTransactionUseCase } = makeSut()
        import.meta.jest
            .spyOn(updateTransactionUseCase, 'execute')
            .mockRejectedValueOnce(
                new TransactionNotFoundError(faker.string.uuid()),
            )

        // act
        const result = await sut.execute(baseHttpRequest)

        // assert
        expect(result.statusCode).toBe(404)
    })
})
