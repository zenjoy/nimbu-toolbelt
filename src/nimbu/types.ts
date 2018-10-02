export interface App {
  name: string,
  key: string,
}

export interface AppFile {
  name: string,
  created_at: string,
  updated_at: string,
  code?: string
}
