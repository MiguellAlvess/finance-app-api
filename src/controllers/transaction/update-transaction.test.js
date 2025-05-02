import { faker } from '@faker-js/faker'
import { UpdateTransactionController } from './update-transaction.js'
describe('Update Transaction Controller', () => {
    class updateTransactionUseCaseStub {
        async execute() {
            return {
                user_id: faker.string.uuid(),
                id: faker.string.uuid(),
                name: faker.commerce.productName(),
                date: faker.date.anytime().toISOString(),
                type: 'EXPENSE',
                amount: Number(faker.finance.amount()),
            }
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
})
