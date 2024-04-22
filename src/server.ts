import fastify from 'fastify'
import { createLink } from './routes/createLink'
import { accessLink } from './routes/accessLink'

const app = fastify()

app.register(createLink)
app.register(accessLink)

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
