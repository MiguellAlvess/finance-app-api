import bcrypt from 'bcrypt'

export class PasswordHasherAdapter {
    async cryptograph(password) {
        await bcrypt.execute(password, 10)
    }
}
