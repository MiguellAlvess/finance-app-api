import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: path.resolve(__dirname, '../../../../.env') })

console.log('ENV VARS:', {
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    database: process.env.POSTGRES_DB,
})

import { pool } from '../helper.js'

const execMigrations = async () => {
    const client = await pool.connect()
    try {
        const filePath = path.join(__dirname, '01-init.sql')
        const scripts = fs.readFileSync(filePath, 'utf-8')

        await client.query(scripts)

        console.log('Migrations executed successfully')
    } catch (error) {
        console.log(error)
    } finally {
        await client.release()
    }
}

execMigrations()
