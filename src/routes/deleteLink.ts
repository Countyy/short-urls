import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { prisma } from '../lib/prisma'

export async function deleteLink(app: FastifyInstance) {
  app.delete('/links/delete/:linkId', async (request, response) => {
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
      return response
        .status(404)
        .send({
          message: 'This link does not exist or you do not have access to it.',
        })
    }

    if (link?.isPrivate && password !== link.password) {
      return response
        .status(404)
        .send({
          message: 'This link does not exist or you do not have access to it.',
        })
    }

    await prisma.links.delete({
      where: {
        id: linkId,
      },
    })

    return response.status(200).send({ message: `Deleted link ${linkId}.` })
  })
}
