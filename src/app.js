import express from 'express'
import { usersRouter, transactionsRouter } from './routes/index.js'
import swaggerUi from 'swagger-ui-express'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

export const app = express()

app.use(express.json())

app.use('/api/users', usersRouter)
app.use('/api/transactions', transactionsRouter)

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const swaggerDocument = JSON.parse(
    fs.readFileSync(path.join(__dirname, '../docs/swagger.json'), 'utf-8'),
)

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
