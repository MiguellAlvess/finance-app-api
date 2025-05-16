import bcrypt from 'bcrypt'

export class PasswordComparatorAdapter {
    execute(password, hashedPassword) {
        return bcrypt.compare(password, hashedPassword)
    }
}
