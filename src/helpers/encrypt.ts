import CryptoJS from 'crypto-js';

// Validate environment variables
if (!process.env.JWT_SECRET_KEY || !process.env.JWT_IV) {
  console.log(process.env.JWT_SECRET_KEY, process.env.JWT_IV);
  throw new Error(
    'Encryption environment variables not set. Please configure JWT_SECRET_KEY and JWT_IV',
  );
}

// Use first 32 bytes for key and first 16 bytes for IV
const key = process.env.JWT_SECRET_KEY?.slice(0, 32);
const iv = process.env.JWT_IV?.slice(0, 16);

if (!key || !iv) {
  throw new Error('Invalid environment variables. Please check your .env file');
}

const encryptedAES = (data: string): string => {
  if (!data) return '';

  try {
    const encrypted = CryptoJS.AES.encrypt(data, key, {
      iv: CryptoJS.enc.Hex.parse(iv),
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });
    return encrypted.toString();
  } catch (error) {
    console.error('Error encrypting data:', error);
    throw new Error('Failed to encrypt data');
  }
};

const encryptJSON = (data: JSON): string => {
  if (!data) return '';

  try {
    const encrypted = CryptoJS.AES.encrypt(JSON.stringify(data), key, {
      iv: CryptoJS.enc.Hex.parse(iv),
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });
    return encrypted.toString();
  } catch (error) {
    console.error('Error encrypting JSON:', error);
    throw new Error('Failed to encrypt JSON data');
  }
};

const decryptJSON = (data: string): JSON => {
  if (!data) {
    throw new Error('No encrypted data provided');
  }

  try {
    const decrypted = CryptoJS.AES.decrypt(data, key, {
      iv: CryptoJS.enc.Hex.parse(iv),
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });
    const resultJSON = JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));
    return resultJSON;
  } catch (error) {
    console.error('Error decrypting JSON:', error);
    throw new Error('Failed to decrypt JSON data');
  }
};

const decryptedAES = (data: string): string => {
  if (!data) {
    throw new Error('No encrypted data provided');
  }

  try {
    const decrypted = CryptoJS.AES.decrypt(data, key, {
      iv: CryptoJS.enc.Hex.parse(iv),
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });
    return decrypted.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.error('Error decrypting data:', error);
    throw new Error('Failed to decrypt data');
  }
};

export { encryptedAES, decryptedAES, encryptJSON, decryptJSON };
