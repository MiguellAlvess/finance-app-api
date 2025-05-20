import { ForbiddenError, TransactionNotFoundError } from '../../errors/index.js'

export class DeleteTransactionUseCase {
    constructor(deleteTransactionRepository, getTransactionRepository) {
        this.deleteTransactionRepository = deleteTransactionRepository
        this.getTransactionRepository = getTransactionRepository
    }

    async execute(transactionId, userId) {
        const transaction =
            await this.getTransactionRepository.execute(transactionId)

        if (!transaction) {
            throw new TransactionNotFoundError(transactionId)
        }

        if (transaction.user_id !== userId) {
            throw new ForbiddenError()
        }
        const deletedTransaction =
            await this.deleteTransactionRepository.execute(transactionId)

        return deletedTransaction
    }
}
