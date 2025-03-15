import express from 'express'
import type { Request, Response } from 'express'
import { PORT } from 'src/config'

const app = express()
const port = PORT
app.use(express.json())

app.get('/', (req: Request, res: Response) => {
  console.log('Hello World!')
  res.send('Hello World!')
})

app.post('/', (req: Request, res: Response) => {
  console.log('Hello World post!')
  console.log(new Date().toISOString())
  console.log('body:', req.body)
  res.send('Hello World post!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})