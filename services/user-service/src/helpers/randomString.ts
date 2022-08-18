import crypto from 'crypto'

/**
 * Helper to generate cryptographically strong
 * random string of given length.
 * Uses hex encoding so there are no special characters.
 * slice & ceil are used to handle odd lengths
 */
export function generateRandomString(length: number): Promise<string> {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(Math.ceil(length / 2), (err, buf) => {
      if (err) {
        reject(err)
      } else {
        resolve(buf.toString('hex').slice(0, length))
      }
    })
  })
}
