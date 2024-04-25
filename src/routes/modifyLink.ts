import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { prisma } from '../lib/prisma'

export async function modifyLink(app: FastifyInstance) {
  app.patch('/links/modify/:linkId', async (request, response) => {
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

    const publicLinkBodySchema = z.object({
      shortLink: z.string().nullish(),
      redirectLink: z.string().nullish(),
      isPrivate: z.literal(false).nullish(),
    })

    const privateLinkBodySchema = z.object({
      shortLink: z.string().nullish(),
      redirectLink: z.string().nullish(),
      isPrivate: z.literal(true).nullish(),
      password: z.coerce.string().nullish(),
    })

    const bodySchema = z.union([publicLinkBodySchema, privateLinkBodySchema])

    const body = bodySchema.parse(request.body)

    type ExpandRecursively<T> = T extends object
      ? T extends infer O
        ? { [K in keyof O]: ExpandRecursively<O[K]> }
        : never
      : T

    type RemoveNull<T> = ExpandRecursively<{
      [K in keyof T]: Exclude<RemoveNull<T[K]>, null>
    }>

    function removeEmpty<T extends {}>(obj: T): RemoveNull<T> {
      return Object.fromEntries(
        Object.entries(obj).filter(([_, v]) => v != null || v != undefined)
      ) as RemoveNull<T>
    }

    const newBody = removeEmpty(body)

    if (Object.keys(body).length === 0) {
      return response.status(400).send({
        message: 'You must provide at least one field to update.',
      })
    }

    const link = await prisma.links.findUnique({
      where: {
        id: linkId,
      },
    })

    if (!link) {
      return response.status(404).send({
        message: 'This link does not exist or you do not have access to it.',
      })
    }

    if (link.isPrivate && password !== link.password) {
      return response.status(404).send({
        message: 'This link does not exist or you do not have access to it.',
      })
    }

    if (body.isPrivate) {
      if (!link.isPrivate && !body.password) {
        return response.status(400).send({
          message:
            'You must provide a password in order to modify a link to be private.',
        })
      }

      const newLink = await prisma.links.update({
        where: {
          id: linkId,
        },

        data: {
          ...link,
          ...newBody,
        },
      })

      return response
        .status(200)
        .send({ message: `Updated link ${linkId}.`, newLink })
    }

    if (!body.isPrivate) {
      const newLink = await prisma.links.update({
        where: {
          id: linkId,
        },

        data: {
          ...link,
          ...newBody,
          password: null,
        },
      })

      return response
        .status(200)
        .send({ message: `Updated link ${linkId}.`, newLink })
    }
  })
}
