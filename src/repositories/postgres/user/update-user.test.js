import { faker } from '@faker-js/faker'
import { prisma } from '../../../../prisma/prisma.js'
import { user as fakeUser } from '../../../tests/index.js'
import { PostgresUpdateUserRepository } from './update-user.js'

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
        const prismaSpy = jest.spyOn(prisma.user, 'update')

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
})
