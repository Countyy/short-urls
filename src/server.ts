import fastify from 'fastify'
import { createLink } from './routes/createLink'
import { accessLink } from './routes/accessLink'
import { getLink } from './routes/getLink'
import { deleteLink } from './routes/deleteLink'

const app = fastify()

app.register(createLink)
app.register(accessLink)
app.register(getLink)
app.register(deleteLink)

app.listen(
  {
    port: 3333,
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
