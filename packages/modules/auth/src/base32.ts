/* eslint-disable no-bitwise, no-plusplus, max-statements */

// eslint-disable-next-line no-secrets/no-secrets
export const base32Chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'

export const encode = (data: string, padding: boolean) => {
  const dataView = new DataView(new TextEncoder().encode(data).buffer)

  let { bits, value } = { bits: 0, value: 0 }
  let output = ''

  for (let index = 0; index < dataView.byteLength; index++) {
    value = (value << 8) | dataView.getUint8(index)
    bits += 8

    while (bits >= 5) {
      output += base32Chars[(value >>> (bits - 5)) & 31]
      bits -= 5
    }
  }

  if (bits) output += base32Chars[(value << (5 - bits)) & 31]

  if (padding) while (output.length % 8) output += '='

  return output
}

export const decode = (data: string) => {
  const chars = [...(data.toUpperCase()).replace(/[=]+$/u, '')]

  let { bits, index, value } = { bits: 0, index: 0, value: 0 }
  const output = new Uint8Array(Math.trunc(chars.length * 5 / 8))

  for (const char of chars.values()) {
    value = (value << 5) | base32Chars.indexOf(char)
    bits += 5

    if (bits >= 8) {
      output[index++] = (value >>> (bits - 8)) & 255
      bits -= 8
    }
  }

  return output
}

/* eslint-enable no-bitwise, no-plusplus, max-statements */
