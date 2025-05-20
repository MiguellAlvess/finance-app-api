import { faker } from '@faker-js/faker'
import { prisma } from '../../../../prisma/prisma.js'
import { user as fakeUser } from '../../../tests/index.js'
import { PostgresGetUserBalanceRepository } from './get-user-balance.js'

describe('Get User Balance Repository', () => {
    const from = '2025-01-01'
    const to = '2025-01-31'
    it('should get user balance on db', async () => {
        // assert
        const user = await prisma.user.create({
            data: fakeUser,
        })

        await prisma.transaction.createMany({
            data: [
                {
                    name: faker.string.sample(),
                    user_id: user.id,
                    date: new Date(from),
                    amount: 10000,
                    type: 'EARNING',
                },
                {
                    name: faker.string.sample(),
                    user_id: user.id,
                    date: new Date(to),
                    amount: 2000,
                    type: 'EXPENSE',
                },
                {
                    name: faker.string.sample(),
                    date: new Date(to),
                    user_id: user.id,
                    amount: 6000,
                    type: 'INVESTMENT',
                },
            ],
        })
        const sut = new PostgresGetUserBalanceRepository()

        // act
        const result = await sut.execute(user.id, from, to)

        // assert
        expect(result.earnings.toString()).toBe('10000')
        expect(result.expenses.toString()).toBe('2000')
        expect(result.investments.toString()).toBe('6000')
        expect(result.balance.toString()).toBe('2000')
    })

    it('should call Prisma with correct params', async () => {
        // arrange
        const sut = new PostgresGetUserBalanceRepository()
        const prismaSpy = import.meta.jest.spyOn(
            prisma.transaction,
            'aggregate',
        )

        // act
        await sut.execute(fakeUser.id, from, to)

        // assert
        expect(prismaSpy).toHaveBeenCalledTimes(3)
        expect(prismaSpy).toHaveBeenCalledWith({
            where: {
                user_id: fakeUser.id,
                type: 'EXPENSE',
                date: {
                    gte: new Date(from),
                    lte: new Date(to),
                },
            },
            _sum: {
                amount: true,
            },
        })
        expect(prismaSpy).toHaveBeenCalledWith({
            where: {
                user_id: fakeUser.id,
                type: 'EARNING',
                date: {
                    gte: new Date(from),
                    lte: new Date(to),
                },
            },
            _sum: {
                amount: true,
            },
        })
        expect(prismaSpy).toHaveBeenCalledWith({
            where: {
                user_id: fakeUser.id,
                type: 'INVESTMENT',
                date: {
                    gte: new Date(from),
                    lte: new Date(to),
                },
            },
            _sum: {
                amount: true,
            },
        })
    })

    it('should throw if prisma throws', async () => {
        // arrange
        const sut = new PostgresGetUserBalanceRepository()
        import.meta.jest
            .spyOn(prisma.transaction, 'aggregate')
            .mockRejectedValueOnce(new Error())

        // act
        const promise = sut.execute(fakeUser.id, from, to)

        // assert
        await expect(promise).rejects.toThrow()
    })
})
