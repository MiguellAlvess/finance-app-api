import { prisma } from '../../../../prisma/prisma.js'
import { TransactionNotFoundError } from '../../../errors/index.js'

export class PostgresUpdateTransactionRepository {
    async execute(transactionId, updateTransactionParams) {
        try {
            return await prisma.transaction.update({
                where: {
                    id: transactionId,
                },
                data: updateTransactionParams,
            })
        } catch (error) {
            if (error.name === 'PrismaClientKnownRequestError') {
                // P2025 -> An operation failed because it depends on one or more records that were required but not found. {cause}
                if (error.code === 'P2025') {
                    throw new TransactionNotFoundError(transactionId)
                }
            }

            throw error
        }
    }
}
