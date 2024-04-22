import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { prisma } from '../lib/prisma'

export async function accessLink(app: FastifyInstance) {
  app.get('/:shortLink', async (request, reply) => {
    const { shortLink } = z
      .object({
        shortLink: z.string(),
      })
      .parse(request.params)

    const { password } = z
      .object({
        password: z.string().nullish(),
      })
      .parse(request.query)

    const link = await prisma.links.findUnique({
      where: {
        shortLink,
      },
    })

    if (!link)
      return reply.status(404).send({
        error: 'This link does not exist or you do not have access to it.',
      })

    if (link.isPrivate && link.password !== password)
      return reply.status(404).send({
        error: 'This link does not exist or you do not have access to it.',
      })

    await prisma.links.update({
      where: {
        id: link.id,
      },
      data: {
        timesClicked: link.timesClicked + 1,
      },
    })

    return reply.redirect(302, link.redirectLink);
  })
}
