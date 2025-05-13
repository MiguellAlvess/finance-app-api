import { prisma } from '../../../../prisma/prisma.js'
import { user } from '../../../tests/index.js'
import { PostgresDeleteUserRepository } from './delete-user.js'
import { UserNotFoundError } from '../../../errors/user.js'

describe('Delete User Repository', () => {
    it('should delete a user on db', async () => {
        // arrange
        await prisma.user.create({
            data: user,
        })
        const sut = new PostgresDeleteUserRepository()

        // act
        const result = await sut.execute(user.id)

        // assert
        expect(result).toStrictEqual(user)
    })

    it('should call prisma with correct params', async () => {
        // arrange
        await prisma.user.create({
            data: user,
        })
        const sut = new PostgresDeleteUserRepository()
        const prismaSpy = import.meta.jest.spyOn(prisma.user, 'delete')

        // act
        await sut.execute(user.id)

        // assert
        expect(prismaSpy).toHaveBeenCalledWith({
            where: {
                id: user.id,
            },
        })
    })

    it('should throw generic error if Prisma throws generic error', async () => {
        // arrange
        const sut = new PostgresDeleteUserRepository()
        import.meta.jest
            .spyOn(prisma.user, 'delete')
            .mockRejectedValueOnce(new Error())

        // act
        const promise = sut.execute(user.id)

        // assert
        await expect(promise).rejects.toThrow()
    })
    it('should throw UserNotFoundError if Prisma throws P2025 error', async () => {
        // arrange
        const sut = new PostgresDeleteUserRepository()
        import.meta.jest.spyOn(prisma.user, 'delete').mockRejectedValueOnce({
            name: 'PrismaClientKnownRequestError',
            code: 'P2025',
        })

        // act
        const promise = sut.execute(user.id)

        // assert
        await expect(promise).rejects.toThrow(new UserNotFoundError(user.id))
    })
})
