import { flags } from '@oclif/command'
import * as Config from '@oclif/config'
import Client from '../nimbu/client'

export const day = 60 * 60 * 24

export const fetchFromNimbu = async (resource: string, ctx: { config: Config.IConfig }): Promise<string[]> => {
  const nimbu = new Client(ctx.config)

  let resources = await nimbu.get<any>(`/${resource}`, { fetchAll: true })

  if (typeof resources === 'string') resources = JSON.parse(resources)
  return resources.map((a: any) => a.name).sort()
}

export const SiteCompletion: flags.ICompletion = {
  cacheDuration: day,
  options: async ctx => {
    let sites = await fetchFromNimbu('sites', ctx)
    return sites
  },
}
