/**
 * Módulo de encriptación para datos sensibles
 * Usa AES-256-GCM para encriptar/desencriptar contraseñas y datos sensibles
 */

import crypto from 'crypto';

// Algoritmo de encriptación
const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16; // 16 bytes para AES
const AUTH_TAG_LENGTH = 16; // 16 bytes para GCM
const SALT_LENGTH = 32;

/**
 * Obtiene la clave de encriptación desde las variables de entorno
 */
function getEncryptionKey(): Buffer {
  const key = process.env.ENCRYPTION_KEY;
  
  if (!key) {
    throw new Error('ENCRYPTION_KEY no está configurada en las variables de entorno');
  }
  
  // Si la clave es menor a 32 bytes, la derivamos usando SHA-256
  if (key.length < 32) {
    return crypto.createHash('sha256').update(key).digest();
  }
  
  // Si es mayor o igual, tomamos los primeros 32 bytes
  return Buffer.from(key.slice(0, 32), 'utf-8');
}

/**
 * Encripta un texto usando AES-256-GCM
 * @param plainText - Texto a encriptar
 * @returns String encriptado en formato: iv:authTag:encryptedData (base64)
 */
export function encrypt(plainText: string): string {
  if (!plainText) return '';
  
  try {
    const key = getEncryptionKey();
    const iv = crypto.randomBytes(IV_LENGTH);
    
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
    
    let encrypted = cipher.update(plainText, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    
    const authTag = cipher.getAuthTag();
    
    // Formato: iv:authTag:encryptedData (todo en base64)
    return `${iv.toString('base64')}:${authTag.toString('base64')}:${encrypted}`;
  } catch (error) {
    console.error('Error al encriptar:', error);
    throw new Error('Error al encriptar los datos');
  }
}

/**
 * Desencripta un texto encriptado con AES-256-GCM
 * @param encryptedText - Texto encriptado en formato iv:authTag:encryptedData
 * @returns Texto original desencriptado
 */
export function decrypt(encryptedText: string): string {
  if (!encryptedText) return '';
  
  // Si no tiene el formato correcto, probablemente es texto plano (migración)
  if (!encryptedText.includes(':')) {
    console.warn('Texto no encriptado detectado, retornando como está');
    return encryptedText;
  }
  
  try {
    const key = getEncryptionKey();
    const parts = encryptedText.split(':');
    
    if (parts.length !== 3) {
      throw new Error('Formato de encriptación inválido');
    }
    
    const iv = Buffer.from(parts[0], 'base64');
    const authTag = Buffer.from(parts[1], 'base64');
    const encrypted = parts[2];
    
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(authTag);
    
    let decrypted = decipher.update(encrypted, 'base64', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (error) {
    console.error('Error al desencriptar:', error);
    throw new Error('Error al desencriptar los datos');
  }
}

/**
 * Verifica si un texto está encriptado con nuestro formato
 * @param text - Texto a verificar
 * @returns true si está encriptado
 */
export function isEncrypted(text: string): boolean {
  if (!text) return false;
  const parts = text.split(':');
  return parts.length === 3;
}

/**
 * Genera una clave de encriptación segura (para configuración inicial)
 * @returns Clave de 32 caracteres hexadecimales
 */
export function generateEncryptionKey(): string {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Hashea una contraseña (para casos donde no necesitas recuperar el original)
 * @param password - Contraseña a hashear
 * @returns Hash de la contraseña
 */
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(SALT_LENGTH).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

/**
 * Verifica una contraseña contra su hash
 * @param password - Contraseña en texto plano
 * @param hashedPassword - Hash almacenado
 * @returns true si coincide
 */
export function verifyPassword(password: string, hashedPassword: string): boolean {
  const [salt, originalHash] = hashedPassword.split(':');
  const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
  return hash === originalHash;
}
