import spawn from './process'

export default function(command: string, args: Array<string> = []): Promise<void> {
  return new Promise<void>((_resolve, _reject) => {
    spawn(command, args)
  })
}
