import { PostgresCreateTransactionRepository } from './create-transaction.js'
import { transaction, user } from '../../../tests/index.js'
import { prisma } from '../../../../prisma/prisma.js'
import dayjs from 'dayjs'

describe('Create Transaction Repository', () => {
    it('should create a transaction o on db', async () => {
        // arrange
        await prisma.user.create({
            data: user,
        })
        const sut = new PostgresCreateTransactionRepository()

        // act
        const result = await sut.execute({ ...transaction, user_id: user.id })

        // assert
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
        const prismaSpy = jest.spyOn(prisma.transaction, 'create')
        const sut = new PostgresCreateTransactionRepository()

        // act
        await sut.execute({ ...transaction, user_id: user.id })

        // assert
        expect(prismaSpy).toHaveBeenCalledWith({
            data: { ...transaction, user_id: user.id },
        })
    })

    it('should throw if Prisma throws', async () => {
        // arrange
        const sut = new PostgresCreateTransactionRepository()
        jest.spyOn(prisma.transaction, 'create').mockRejectedValueOnce(
            new Error(),
        )

        // act
        const promise = sut.execute({ ...transaction, user_id: user.id })

        // assert
        await expect(promise).rejects.toThrow()
    })
})
