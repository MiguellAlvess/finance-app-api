import { faker } from '@faker-js/faker'
import { prisma } from '../../../../prisma/prisma.js'
import { user as fakeUser } from '../../../tests/index.js'
import { PostgresGetUserBalanceRepository } from './get-user-balance.js'

describe('Get User Balance Repository', () => {
    it('should get user balance on db', async () => {
        const user = await prisma.user.create({
            data: fakeUser,
        })

        await prisma.transaction.createMany({
            data: [
                {
                    name: faker.string.sample(),
                    user_id: user.id,
                    date: faker.date.anytime(),
                    amount: 10000,
                    type: 'EARNING',
                },
                {
                    name: faker.string.sample(),
                    user_id: user.id,
                    date: faker.date.anytime(),
                    amount: 2000,
                    type: 'EXPENSE',
                },
                {
                    name: faker.string.sample(),
                    date: faker.date.anytime(),
                    user_id: user.id,
                    amount: 6000,
                    type: 'INVESTMENT',
                },
            ],
        })

        const sut = new PostgresGetUserBalanceRepository()

        const result = await sut.execute(user.id)

        expect(result.earnings.toString()).toBe('10000')
        expect(result.expenses.toString()).toBe('2000')
        expect(result.investments.toString()).toBe('6000')
        expect(result.balance.toString()).toBe('2000')
    })
})
