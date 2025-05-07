import dayjs from 'dayjs'
import { faker } from '@faker-js/faker'
import { prisma } from '../../../../prisma/prisma.js'
import { PostgresUpdateTransactionRepository } from './update-transaction.js'
import { user, transaction } from '../../../tests/index.js'

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
})
