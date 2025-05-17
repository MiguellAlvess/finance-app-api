import jwt from 'jsonwebtoken'

export const auth = (req, res, next) => {
    try {
        const acessToken = req.headers?.authorization?.split('Bearer ')[1]
        if (!acessToken) {
            return res.status(401).send({ message: 'Unauthorized' })
        }

        const decodedToken = jwt.verify(
            acessToken,
            process.env.JWT_ACESS_TOKEN_SECRET,
        )

        if (!decodedToken) {
            return res.status(401).send({ message: 'Unauthorized' })
        }

        req.userId = decodedToken.userId

        next()
    } catch (error) {
        console.error(error)
        return res.status(401).send({ message: 'Unauthorized' })
    }
}
