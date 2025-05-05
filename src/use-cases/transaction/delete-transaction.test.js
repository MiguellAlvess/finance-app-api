import { faker } from '@faker-js/faker'
import { DeleteTransactionUseCase } from './delete-transaction.js'
import { transaction } from '../../tests/index.js'

describe('Delete Transaction Use Case', () => {
    class DeleteTransactionRepositoryStub {
        async execute(transactionId) {
            return {
                ...transaction,
                id: transactionId,
            }
        }
    }

    const makeSut = () => {
        const deleteTransactionRepository =
            new DeleteTransactionRepositoryStub()
        const sut = new DeleteTransactionUseCase(deleteTransactionRepository)

        return {
            deleteTransactionRepository,
            sut,
        }
    }

    it('should delete transaction successfully', async () => {
        // arrange
        const { sut } = makeSut()
        const id = faker.string.uuid()

        // act
        const result = await sut.execute(id)

        // assert
        expect(result).toEqual({
            ...transaction,
            id: id,
        })
    })

    it('should call DeleteTransactionRepository with correct params', async () => {
        // arrange
        const { sut, deleteTransactionRepository } = makeSut()
        const deleteTransactionRepositorySpy = jest.spyOn(
            deleteTransactionRepository,
            'execute',
        )
        const id = faker.string.uuid()

        // assert
        await sut.execute(id)

        // act
        expect(deleteTransactionRepositorySpy).toHaveBeenCalledWith(id)
    })

    it('should thorw if DeleteTransactionRepository throws', async () => {
        // arrange
        const { sut, deleteTransactionRepository } = makeSut()
        jest.spyOn(
            deleteTransactionRepository,
            'execute',
        ).mockRejectedValueOnce(new Error())
        const id = faker.string.uuid()

        // act
        const promise = sut.execute(id)

        // assert
        await expect(promise).rejects.toThrow()
    })
})
