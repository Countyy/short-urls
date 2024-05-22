import dotenv from 'dotenv';
import fastify from 'fastify'
import { createLink } from './routes/createLink'
import { accessLink } from './routes/accessLink'
import { getLink } from './routes/getLink'
import { deleteLink } from './routes/deleteLink'
import { modifyLink } from './routes/modifyLink'

const app = fastify()
dotenv.config()
app.register(createLink)
app.register(accessLink)
app.register(getLink)
app.register(deleteLink)
app.register(modifyLink)

const port = process.env.PORT || 3333

app.listen(
  {
    port: port as number,
    host: '0.0.0.0',
  },
  (err, address) => {
    if (err) {
      console.error(err)
      process.exit(1)
    }

    console.log(`Server listening at ${address}`)
  }
)
