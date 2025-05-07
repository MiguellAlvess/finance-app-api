import { prisma } from '../../../../prisma/prisma.js'
import { user as fakeUser } from '../../../tests/index.js'
import { PostgresGetUserByIdRepository } from './get-user-by-id.js'

describe('Get User By Id Repository', () => {
    it('should get user by id on db', async () => {
        await prisma.user.create({
            data: fakeUser,
        })
        const sut = new PostgresGetUserByIdRepository()

        const result = await sut.execute(fakeUser.id)

        expect(result).toStrictEqual(fakeUser)
    })

    it('should call Prisma with correct params', async () => {
        const sut = new PostgresGetUserByIdRepository()
        const prismaSpy = jest.spyOn(prisma.user, 'findUnique')

        await sut.execute(fakeUser.id)

        expect(prismaSpy).toHaveBeenCalledWith({
            where: {
                id: fakeUser.id,
            },
        })
    })

    it('should throw if prisma throws', async () => {
        // arrange
        const sut = new PostgresGetUserByIdRepository()
        jest.spyOn(prisma.user, 'findUnique').mockRejectedValueOnce(new Error())

        // act
        const promise = sut.execute(fakeUser.id)

        // assert
        await expect(promise).rejects.toThrow()
    })
})
