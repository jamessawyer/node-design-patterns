import { createGzip, createGunzip } from 'node:zlib'
import { createCipheriv, createDecipheriv, scryptSync } from 'node:crypto'
import pumpify from 'pumpify'

/**
 * 该函数用于根据提供的password生成一个key
 * scryptSync是node.js提供的用于生成一个key的函数
 * 它的三个参数分别是
 * 1. password: 一个字符串，是要生成key的密码
 * 2. salt: 一个字符串，是一个随机数
 * 3. keylen: 一个整数，是生成的key的长度
 * @param {string} password 密码
 * @returns {Buffer} 生成的key
 */
function createKey(password) {
  return scryptSync(password, 'salt', 24) // 24字节 * 8 = 192位 和 aes192算法需要的密钥key长度相等
}

// 压缩 + 加密
export function createCompressAndEncrypt(password, iv) {
  const key = createKey(password)
  const combinedStreams = pumpify(
    createGzip(),
    /**
     * 密钥（key）：这是用于加密算法的原始密钥。它必须与所选加密算法兼容，并且可以是字符串、Buffer、TypedArray、DataView 或者 KeyObject 类型。密钥是加密过程中的关键，它决定了加密数据的安全性。
     *             密钥的长度和算法的要求必须匹配，例如，对于AES-256，密钥应该是256位长
     * 初始化向量（iv）：初始化向量用于为加密提供一个随机数种子，以确保即使明文相同，加密结果也会因为不同的初始化向量而不同，从而增加加密的安全性。它必须是唯一的并且非常独特，但不必保密。初始化向量可以是字符串、Buffer、TypedArray 或 DataView 类型，且对于某些不需要初始化向量的加密算法，iv 可以是 null
     *            初始化向量（iv）不需要保密，但它必须是随机的，以确保加密的强度。
     *            在实际使用中，通常将iv与密文一起传输，以便解密方可以使用相同的iv进行解密。
     */
    createCipheriv('aes192', key, iv)
  )
  combinedStreams.iv = iv

  return combinedStreams
}

// 执行和上面相反的操作
// 解密 + 解压缩
export function createDecryptAndDecompress(password, iv) {
  const key = createKey(password)

  return pumpify(
    createDecipheriv('aes192', key, iv),
    createGunzip()
  )
}