import { faker } from '@faker-js/faker'
import { prisma } from '../../../../prisma/prisma.js'
import { user as fakeUser } from '../../../tests/index.js'
import { PostgresGetUserBalanceRepository } from './get-user-balance.js'

describe('Get User Balance Repository', () => {
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

        // act
        const result = await sut.execute(user.id)

        // assert
        expect(result.earnings.toString()).toBe('10000')
        expect(result.expenses.toString()).toBe('2000')
        expect(result.investments.toString()).toBe('6000')
        expect(result.balance.toString()).toBe('2000')
    })

    it('should call Prisma with correct params', async () => {
        // arrange
        const sut = new PostgresGetUserBalanceRepository()
        const prismaSpy = jest.spyOn(prisma.transaction, 'aggregate')

        // act
        await sut.execute(fakeUser.id)

        // assert
        expect(prismaSpy).toHaveBeenCalledTimes(3)
        expect(prismaSpy).toHaveBeenCalledWith({
            where: {
                user_id: fakeUser.id,
                type: 'EXPENSE',
            },
            _sum: {
                amount: true,
            },
        })
        expect(prismaSpy).toHaveBeenCalledWith({
            where: {
                user_id: fakeUser.id,
                type: 'EARNING',
            },
            _sum: {
                amount: true,
            },
        })
        expect(prismaSpy).toHaveBeenCalledWith({
            where: {
                user_id: fakeUser.id,
                type: 'INVESTMENT',
            },
            _sum: {
                amount: true,
            },
        })
    })

    it('should throw if prisma throws', async () => {
        // arrange
        const sut = new PostgresGetUserBalanceRepository()
        jest.spyOn(prisma.transaction, 'aggregate').mockRejectedValueOnce(
            new Error(),
        )

        // act
        const promise = sut.execute(fakeUser.id)

        // assert
        await expect(promise).rejects.toThrow()
    })
})
