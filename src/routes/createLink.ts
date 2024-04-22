import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { prisma } from '../lib/prisma'

export async function createLink(app: FastifyInstance) {
  app.post('/links/create', async (request, reply) => {
    const publicLinkBodySchema = z.object({
      shortLink: z.string(),
      redirectLink: z.string(),
      isPrivate: z.literal(false).nullish(),
      password: z.string().nullish(),
    })

    const privateLinkBodySchema = z.object({
      shortLink: z.string(),
      redirectLink: z.string(),
      isPrivate: z.literal(true),
      password: z.coerce.string(),
    })

    const bodySchema = z.union([publicLinkBodySchema, privateLinkBodySchema])

    const body = bodySchema.parse(request.body)

    const link = await prisma.links.findUnique({
      where: {
        shortLink: body.shortLink,
      },
    })

    if (link) {
      return reply.status(400).send({
        error: 'This link already exists.',
      })
    }

    const newLink = await prisma.links.create({
      data: {
        shortLink: body.shortLink,
        redirectLink: body.redirectLink,
        isPrivate: body.isPrivate ?? false,
        password: body.isPrivate ? body.password : null,
      },
    })

    return reply.status(201).send(newLink)
  })
}
