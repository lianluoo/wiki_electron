
import { customAlphabet } from 'nanoid'
const ALPHABET = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const IDLENGTH = 21

/**
 * 
 * @returns 返回生成的id字符串
 */
export function genID(){
  const nanoid = customAlphabet(ALPHABET, IDLENGTH)
  return nanoid()
}
