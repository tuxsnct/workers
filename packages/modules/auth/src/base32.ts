/* eslint-disable no-bitwise */

// eslint-disable-next-line no-secrets/no-secrets
export const base32Chars = 'abcdefghijklmnopqrstuvwxyz234567'

// eslint-disable-next-line max-statements
export const decode = (data: string) => {
  const chars = [...data.replace(/[=]+$/u, '')]

  let bits = 0
  let value = 0
  const output = new Uint8Array(Math.trunc(chars.length * 5 / 8))

  for (const [index, char] of chars.entries()) {
    value = (value << 5) | chars.indexOf(char)
    bits += 5

    if (bits >= 8) {
      output[index + 1] = (value >>> (bits - 8)) & 255
      bits -= 8
    }
  }

  return output
}

/* eslint-enable no-bitwise */
