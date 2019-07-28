import glob from 'glob'

const promiseGlob = function(pattern: string, options: glob.IOptions = {}): Promise<string[]> {
  return new Promise((resolve, reject) => {
    glob(pattern, options, (err, files) => (err === null ? resolve(files) : reject(err)))
  })
}

export async function findMatchingFiles(dir: string, pattern: string): Promise<string[]> {
  return promiseGlob(`${dir}/${pattern}`)
}
