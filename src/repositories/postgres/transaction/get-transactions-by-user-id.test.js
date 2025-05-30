import dayjs from 'dayjs'
import { prisma } from '../../../../prisma/prisma.js'
import { transaction, user } from '../../../tests/index.js'
import { PostgresGetTransactionsByUserIdRepository } from './get-transactions-by-user-id.js'

describe('Get Transactions By User Id Repository', () => {
    const from = '2025-01-01'
    const to = '2025-01-31'
    it('should get transactions by user id on db', async () => {
        // arrange
        const date = '2025-01-02'
        const sut = new PostgresGetTransactionsByUserIdRepository()
        await prisma.user.create({
            data: user,
        })
        await prisma.transaction.create({
            data: { ...transaction, date: new Date(date), user_id: user.id },
        })

        // act
        const result = await sut.execute(user.id, from, to)

        // assert
        expect(result.length).toBe(1)
        expect(result[0].name).toBe(transaction.name)
        expect(String(result[0].amount)).toBe(String(transaction.amount))
        expect(result[0].type).toBe(transaction.type)
        expect(result[0].user_id).toBe(user.id)
        expect(dayjs(result[0].date).daysInMonth()).toBe(
            dayjs(date).daysInMonth(),
        )
        expect(dayjs(result[0].date).month()).toBe(dayjs(date).month())
        expect(dayjs(result[0].date).year()).toBe(dayjs(date).year())
    })

    it('should call Prisma with correct params', async () => {
        // arrange
        const prismaSpy = import.meta.jest.spyOn(prisma.transaction, 'findMany')
        const sut = new PostgresGetTransactionsByUserIdRepository()

        // act
        await sut.execute(user.id, from, to)

        // assert
        expect(prismaSpy).toHaveBeenCalledWith({
            where: {
                user_id: user.id,
                date: {
                    gte: new Date(from),
                    lte: new Date(to),
                },
            },
        })
    })

    it('should throw if prisma throws', async () => {
        // arrange
        const sut = new PostgresGetTransactionsByUserIdRepository()
        import.meta.jest
            .spyOn(prisma.transaction, 'findMany')
            .mockRejectedValueOnce(new Error())

        // act
        const promise = sut.execute(user.id)

        // assert
        await expect(promise).rejects.toThrow()
    })
})
