import { prisma } from '../../../../prisma/prisma.js'
import { PostgresDeleteTransactionRepository } from './delete-transaction.js'
import { transaction, user } from '../../../tests/index.js'
import dayjs from 'dayjs'
import { TransactionNotFoundError } from '../../../errors/index.js'

describe('Delete Transaction Repository', () => {
    it('should delete a transaction on db', async () => {
        // arrange
        await prisma.user.create({
            data: user,
        })
        await prisma.transaction.create({
            data: { ...transaction, user_id: user.id },
        })
        const sut = new PostgresDeleteTransactionRepository()

        // act
        const result = await sut.execute(transaction.id)

        // asert
        expect(result.name).toBe(transaction.name)
        expect(String(result.amount)).toBe(String(transaction.amount))
        expect(result.type).toBe(transaction.type)
        expect(result.user_id).toBe(user.id)
        expect(dayjs(result.date).daysInMonth()).toBe(
            dayjs(transaction.date).daysInMonth(),
        )
        expect(dayjs(result.date).month()).toBe(dayjs(transaction.date).month())
        expect(dayjs(result.date).year()).toBe(dayjs(transaction.date).year())
    })

    it('should call Prisma with correct params', async () => {
        // arrange
        await prisma.user.create({
            data: user,
        })
        await prisma.transaction.create({
            data: { ...transaction, user_id: user.id },
        })
        const prismaSpy = jest.spyOn(prisma.transaction, 'delete')
        const sut = new PostgresDeleteTransactionRepository()

        // act
        await sut.execute(transaction.id)

        // assert
        expect(prismaSpy).toHaveBeenCalledWith({
            where: { id: transaction.id },
        })
    })

    it('should throw generic error if Prisma throws generic error', async () => {
        // arrange
        const sut = new PostgresDeleteTransactionRepository()
        jest.spyOn(prisma.transaction, 'delete').mockRejectedValueOnce(
            new Error(),
        )

        // act
        const promise = sut.execute(transaction.id)

        // assert
        await expect(promise).rejects.toThrow()
    })

    it('should throw TransactionNotFoundError if Prisma throws P2025 error', async () => {
        // arrange
        const sut = new PostgresDeleteTransactionRepository()
        jest.spyOn(prisma.transaction, 'delete').mockRejectedValueOnce({
            name: 'PrismaClientKnownRequestError',
            code: 'P2025',
        })

        // act
        const promise = sut.execute(transaction.id)

        // assert
        await expect(promise).rejects.toThrow(
            new TransactionNotFoundError(transaction.id),
        )
    })
})
