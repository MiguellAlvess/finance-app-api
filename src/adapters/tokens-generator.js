import jwt from 'jsonwebtoken'

export class TokensGeneratorAdapter {
    execute(userId) {
        return {
            acessToken: jwt.sign(
                { userId },
                process.env.JWT_ACESS_TOKEN_SECRET,
                {
                    expiresIn: '15m',
                },
            ),
            refreshToken: jwt.sign(
                { userId },
                process.env.JWT_REFRESH_TOKEN_SECRET,
                {
                    expiresIn: '30d',
                },
            ),
        }
    }
}
