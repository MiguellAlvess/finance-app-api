import { IdGeneratorAdapter } from './id-generater.js'

describe('Id Generator Adapter', () => {
    it('should return a random id', () => {
        // arrange
        const sut = new IdGeneratorAdapter()

        // act
        const result = sut.execute()

        // arrange
        const uuidRegex =
            /^[0-9a-f]{8}-[0-9a-f]{4}-[4][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
        expect(result).toBeTruthy()
        expect(typeof result).toBe('string')
        expect(uuidRegex.test(result)).toBe(true)
    })
})
