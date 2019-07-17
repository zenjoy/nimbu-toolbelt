import spawn from './process'

export default function(token: string, command: string, args: Array<string> = []): Promise<void> {
  return new Promise<void>((_resolve, _reject) => {
    spawn(token, command, args)
  })
}
