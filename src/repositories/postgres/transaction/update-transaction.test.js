import dayjs from 'dayjs'
import { faker } from '@faker-js/faker'
import { prisma } from '../../../../prisma/prisma.js'
import { PostgresUpdateTransactionRepository } from './update-transaction.js'
import { user, transaction } from '../../../tests/index.js'
import { TransactionNotFoundError } from '../../../errors/transaction.js'

describe('Update Transaction Repository', () => {
    it('should update a transaction on db', async () => {
        // arrange
        const sut = new PostgresUpdateTransactionRepository()
        await prisma.user.create({
            data: user,
        })
        await prisma.transaction.create({
            data: { ...transaction, user_id: user.id },
        })
        const updateTransactionParams = {
            id: faker.string.uuid(),
            user_id: user.id,
            name: faker.commerce.productName(),
            date: faker.date.anytime().toISOString(),
            type: 'EXPENSE',
            amount: Number(faker.finance.amount()),
        }

        // act
        const result = await sut.execute(
            transaction.id,
            updateTransactionParams,
        )

        // assert
        expect(result.name).toBe(updateTransactionParams.name)
        expect(String(result.amount)).toBe(
            String(updateTransactionParams.amount),
        )
        expect(result.type).toBe(updateTransactionParams.type)
        expect(result.user_id).toBe(user.id)
        expect(dayjs(result.date).daysInMonth()).toBe(
            dayjs(updateTransactionParams.date).daysInMonth(),
        )
        expect(dayjs(result.date).month()).toBe(
            dayjs(updateTransactionParams.date).month(),
        )
        expect(dayjs(result.date).year()).toBe(
            dayjs(updateTransactionParams.date).year(),
        )
    })

    it('should call Prisma with correct params', async () => {
        // arrange
        await prisma.user.create({
            data: user,
        })
        await prisma.transaction.create({
            data: { ...transaction, user_id: user.id },
        })
        const prismaSpy = import.meta.jest.spyOn(prisma.transaction, 'update')
        const sut = new PostgresUpdateTransactionRepository()

        // act
        await sut.execute(transaction.id, { ...transaction, user_id: user.id })

        // assert
        expect(prismaSpy).toHaveBeenCalledWith({
            where: {
                id: transaction.id,
            },
            data: { ...transaction, user_id: user.id },
        })
    })

    it('should throw if Prisma throws', async () => {
        // arrange
        const sut = new PostgresUpdateTransactionRepository()
        import.meta.jest
            .spyOn(prisma.transaction, 'update')
            .mockRejectedValueOnce(new Error())

        // act
        const promise = sut.execute(transaction.id, transaction)

        // assert
        await expect(promise).rejects.toThrow()
    })

    it('should throw TransactionNotFoundError if Prisma throws P2025 error', async () => {
        // arrange
        const sut = new PostgresUpdateTransactionRepository()
        import.meta.jest
            .spyOn(prisma.transaction, 'update')
            .mockRejectedValueOnce({
                name: 'PrismaClientKnownRequestError',
                code: 'P2025',
            })

        // act
        const promise = sut.execute(transaction.id, transaction)

        // assert
        await expect(promise).rejects.toThrow(
            new TransactionNotFoundError(transaction.id),
        )
    })
})
