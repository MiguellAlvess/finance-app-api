import { prisma } from '../../../../prisma/prisma.js'
import { PostgresDeleteTransactionRepository } from './delete-transaction.js'
import { transaction, user as fakeUser } from '../../../tests/index.js'
import dayjs from 'dayjs'

describe('Delete Transaction Repository', () => {
    it('should delete a transaction on db', async () => {
        // arrange
        const user = await prisma.user.create({
            data: fakeUser,
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
})
