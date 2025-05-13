import { faker } from '@faker-js/faker'
import { prisma } from '../../../../prisma/prisma.js'
import { user as fakeUser } from '../../../tests/index.js'
import { PostgresUpdateUserRepository } from './update-user.js'
import { UserNotFoundError } from '../../../errors/user.js'

describe('Update User Repository', () => {
    const updateUserParams = {
        id: faker.string.uuid(),
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
    }
    it('should update user on db', async () => {
        // arrange
        const user = await prisma.user.create({
            data: fakeUser,
        })
        const sut = new PostgresUpdateUserRepository()

        // act
        const result = await sut.execute(user.id, updateUserParams)

        // assert
        expect(result).toStrictEqual(updateUserParams)
    })

    it('should call Prisma with correct params', async () => {
        // arrange
        const user = await prisma.user.create({
            data: fakeUser,
        })
        const sut = new PostgresUpdateUserRepository()
        const prismaSpy = import.meta.jest.spyOn(prisma.user, 'update')

        // act
        await sut.execute(user.id, updateUserParams)

        // assert
        expect(prismaSpy).toHaveBeenCalledWith({
            where: {
                id: user.id,
            },
            data: updateUserParams,
        })
    })

    it('should throw if prisma throws', async () => {
        // arrange
        const sut = new PostgresUpdateUserRepository()
        import.meta.jest
            .spyOn(prisma.user, 'update')
            .mockRejectedValueOnce(new Error())

        // act
        const promise = sut.execute(fakeUser.id, updateUserParams)

        // assert
        await expect(promise).rejects.toThrow()
    })

    it('should throw UserNotFoundError if Prisma throws P2025 error', async () => {
        // arrange
        const sut = new PostgresUpdateUserRepository()
        import.meta.jest.spyOn(prisma.user, 'update').mockRejectedValueOnce({
            name: 'PrismaClientKnownRequestError',
            code: 'P2025',
        })

        // act
        const promise = sut.execute(updateUserParams.id)

        // assert
        await expect(promise).rejects.toThrow(
            new UserNotFoundError(updateUserParams.id),
        )
    })
})
