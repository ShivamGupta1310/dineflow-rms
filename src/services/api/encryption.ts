import CryptoJS from 'crypto-js';

const assertEncryptionKey = (key: string | undefined) => {
  if (key) return key;

  // Temporary/dev-friendly fallback: allow encryption to work without env wiring.
  // In release builds we still fail fast to avoid silently encrypting with a weak key.
  if (typeof __DEV__ !== 'undefined' && __DEV__) return 'demo_temp_dev_key_change_me';

  throw new Error('Missing ENCRYPTION_KEY. Add it to your .env file.');
};

export const encryptJson = (value: unknown, encryptionKey: string | undefined) => {
  const key = assertEncryptionKey(encryptionKey);
  const plaintext = JSON.stringify(value ?? null);

  // React Native note:
  // CryptoJS passphrase-mode encryption generates random salt/IV, which requires
  // a native crypto RNG that React Native may not provide.
  // To keep this working without native crypto, we derive a deterministic key/IV.
  const keyWords = CryptoJS.SHA256(key); // 256-bit key
  const ivWords = CryptoJS.MD5(key); // 128-bit IV

  return CryptoJS.AES.encrypt(plaintext, keyWords, {
    iv: ivWords,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  }).toString();
};

export const decryptJson = (cipherText: string, encryptionKey: string | undefined) => {
  const key = assertEncryptionKey(encryptionKey);
  const keyWords = CryptoJS.SHA256(key);
  const ivWords = CryptoJS.MD5(key);

  const bytes = CryptoJS.AES.decrypt(cipherText, keyWords, {
    iv: ivWords,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });
  const plaintext = bytes.toString(CryptoJS.enc.Utf8);

  if (!plaintext) return null;
  try {
    return JSON.parse(plaintext);
  } catch {
    return plaintext;
  }
};
