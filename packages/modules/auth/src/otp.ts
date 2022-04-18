/* eslint-disable implicit-arrow-linebreak, no-bitwise */

import { base32Chars, decode } from './base32'

export const hotp = async (secret: string, counter: number, digits = 6) => {
  const counterPairs = counter.toString(16).padStart(16, '0')
    .match(/..?/gu)

  if (counterPairs) {
    const data = new Uint8Array(
      await crypto.subtle.sign(
        'HMAC',
        await crypto.subtle.importKey(
          'raw',
          decode(secret),
          { hash: { name: 'SHA-1' }, name: 'HMAC' },
          false,
          ['sign']
        ),
        Uint8Array.from(counterPairs.map((value) => Number.parseInt(value, 16)))
      )
    )

    const offset = data[19] & 0b1111

    // eslint-disable-next-line security/detect-object-injection
    return (((data[offset] & 0x7F) << 24) | (data[offset + 1] << 16) | (data[offset + 2] << 8) | data[offset + 3])
      .toString()
      .padStart(digits, '0')
      .slice(-digits)
  }

  throw new Error('invalid counter')
}

export const totp = (secret: string, digits?: number, alignSeconds = 0) =>
  hotp(secret, Math.floor(Date.now() / 30_000) + alignSeconds * 1000, digits)

// eslint-disable-next-line max-params
export const generateKeyUriFormat = (issuer: string, accountName: string, secret: string, digits = 6) =>
  `otpauth://totp/${issuer}:${accountName}?secret=${secret}&issuer=${issuer}&digits=${digits}`

export const generateSecret = (length = 16) =>
  // eslint-disable-next-line unicorn/no-new-array
  [...(new Array(length).keys())].map(() => base32Chars[Math.floor(Math.random() * base32Chars.length)]).join('')

/* eslint-enable implicit-arrow-linebreak, no-bitwise */
