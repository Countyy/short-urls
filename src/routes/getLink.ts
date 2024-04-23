import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { prisma } from '../lib/prisma'

export async function getLink(app: FastifyInstance) {
  app.get('/links/:linkId', async (request, reply) => {
    const { linkId } = z
      .object({
        linkId: z.string(),
      })
      .parse(request.params)

    const { password } = z
      .object({
        password: z.string().nullish(),
      })
      .parse(request.query)

    const link = await prisma.links.findUnique({
      where: {
        id: linkId,
      },
    })

    if (!link) {
      return reply.status(404).send({
        message: 'This link does not exist or you do not have access to it.',
      })
    }

    if (link.isPrivate && link.password !== password)
      return reply.status(404).send({
        error: 'This link does not exist or you do not have access to it.',
      })

    return reply.status(200).send({ link })
  })
}
