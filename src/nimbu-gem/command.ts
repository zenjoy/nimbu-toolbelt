import spawn from './process';

export default function (command: string, args: Array<string> = []) : Promise<void> {
  return new Promise<void>((resolve, reject) => {
    const process = spawn(command, args);

  })
}
