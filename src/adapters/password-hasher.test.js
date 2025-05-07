import { faker } from '@faker-js/faker'
import { PasswordHasherAdapter } from './password-hasher.js'

describe('Password Hasher Adapter', () => {
    it('should return a hashed password', async () => {
        // arrange
        const sut = new PasswordHasherAdapter()
        const password = faker.internet.password()

        // act
        const result = await sut.execute(password)

        // assert
        expect(result).toBeTruthy()
        expect(typeof result).toBe('string')
        expect(result).not.toBe(password)
    })
})
