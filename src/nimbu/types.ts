export interface App {
  name: string
  key: string
  url?: string
}

export interface AppFile {
  name: string
  created_at: string
  updated_at: string
  code?: string
  url?: string
}

export interface User {
  email: string
  name: string
  url: string
  username: string
}

export interface Token {
  app: App
  created_at: string
  updated_at: string
  note?: string
  note_url?: string
  scopes: string[]
  site?: string
  site_wide: boolean
  token: string
  url?: string
  expires_in?: number
  expired_at?: string
}

export interface Site {
  id: string
  url: string
  name: string
  domain: string
  domain_url: string
  subdomain: string
}
