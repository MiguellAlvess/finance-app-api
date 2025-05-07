import { prisma } from '../../../../prisma/prisma.js'
import { user as fakeUser } from '../../../tests/index.js'
import { PostgresGetUserByEmailRepository } from './get-user-by-email.js'

describe('Get User By Email Repository', () => {
    it('should get user by email on db', async () => {
        await prisma.user.create({
            data: fakeUser,
        })
        const sut = new PostgresGetUserByEmailRepository()

        const result = await sut.execute(fakeUser.email)

        expect(result).toStrictEqual(fakeUser)
    })
})
