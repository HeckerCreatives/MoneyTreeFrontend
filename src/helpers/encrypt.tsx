import CryptoJS from 'crypto-js';


export function encryptUid(uid: string) {
  return CryptoJS.AES.encrypt(uid, process.env.NEXT_PUBLIC_SECRET_KEY).toString();
}

export function decryptUid(encryptedUid: any) {
  const bytes = CryptoJS.AES.decrypt(encryptedUid, process.env.NEXT_PUBLIC_SECRET_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
}