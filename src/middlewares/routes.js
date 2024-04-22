import { randomUUID } from 'node:crypto';
import { Database } from "./database.js"
import { buildRoutePath } from '../utils/build-route-path.js';

const database = new Database()

export const routes = [

    {
        method: 'GET',
        path: buildRoutePath('/tasks'),
        handler: (req, res) => {
            const { search } = req.query

            const tasks = database.select('tasks', search ? {
                title: search,
                description: search,
            } : null)

            return res.end(JSON.stringify(tasks))
        }
    },
    {
        method: 'POST',
        path: buildRoutePath('/tasks'),
        handler: (req, res) => {
            const { title, description } = req.body

            const task = {
                id: randomUUID(),
                title,
                description,
                completed_at: null,
                created_at: new Date(),
                updated_at: null
            }

            database.insert('tasks', task)
            return res.writeHead(201).end()
        }
    },
    {
        method: 'PUT',
        path: buildRoutePath('/tasks/:id'),
        handler: (req, res) => {
            const { id } = req.params
            const { title, description, completed_at, created_at } = req.body


            if (!database.validate('tasks', id)) {
                res.writeHead(404)
                res.end(JSON.stringify({ error: 'Task não localizada' }))
                return
            } else {                
                
                const [task] = database.select('tasks', { id })

                if (title !== undefined) {
                    task.title = title
                }
    
                if (description !== undefined) {
                    task.description = description
                }
    
                task.updated_at = new Date()
    
                database.update('tasks', id, task)
                return res.writeHead(200).end();
            }
        }
    },
    {
        method: 'DELETE',
        path: buildRoutePath('/tasks/:id'),
        handler: (req, res) => {
            const { id } = req.params

            if (!database.validate('tasks', id)) {
                res.writeHead(404)
                res.end(JSON.stringify({ error: 'Task não localizada' }))
                return
            } else {
                database.delete('tasks', id)
                return res.writeHead(204).end()
            }
        }
    },
    {
        method: 'PATCH',
        path: buildRoutePath('/tasks/:id/complete'),
        handler: (req, res) => {
            const { id } = req.params

            if (!database.validate('tasks', id)) {
                res.writeHead(404)
                res.end(JSON.stringify({ error: 'Task não localizada' }))
                return
            } else {

                const [task] = database.select('tasks', { id })

                task.completed_at = new Date()

                database.update('tasks', id, task)
                return res.writeHead(200).end();
            }
        }
    }
]