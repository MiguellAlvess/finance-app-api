import { prisma } from '../../../../prisma/prisma.js'
import { user } from '../../../tests/index.js'
import { PostgresDeleteUserRepository } from './delete-user.js'

describe('Delete User Repository', () => {
    it('should delete a user on db', async () => {
        await prisma.user.create({
            data: user,
        })
        const sut = new PostgresDeleteUserRepository()

        const result = await sut.execute(user.id)

        expect(result).toStrictEqual(user)
    })
})
