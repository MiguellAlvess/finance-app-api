import 'dotenv/config'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { pool } from '../helper.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

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
