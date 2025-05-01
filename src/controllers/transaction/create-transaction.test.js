import { faker } from '@faker-js/faker'
import { CreateTransactionController } from './create-transaction.js'
describe('Create Transaction Controller', () => {
    class CreateTransactionUseCaseStub {
        async execute(transaction) {
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
            user_id: faker.string.uuid(),
            name: faker.commerce.productName(),
            date: faker.date.anytime().toISOString(),
            type: 'EXPENSE',
            amount: Number(faker.finance.amount()),
        },
    }

    it('should return 201 when creating a transaction successfully', async () => {
        // arrange
        const { sut } = makeSut()

        // act
        const response = await sut.execute(baseHttpRequest)

        // assert
        expect(response.statusCode).toBe(201)
    })
})
