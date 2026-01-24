#!/usr/bin/env node

/**
 * Script de verificación de archivos sensibles
 * Detecta archivos que podrían contener información confidencial
 * y verifica que estén correctamente ignorados por git
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Patrones de archivos sensibles
const SENSITIVE_PATTERNS = [
  /\.key$/,
  /\.pem$/,
  /\.p12$/,
  /\.pfx$/,
  /\.jks$/,
  /secrets?\.(json|yml|yaml|js|ts)$/,
  /credentials?\.(json|yml|yaml|js|ts)$/,
  /\.env\..*$/,
  /\.env$/, 
  /backup.*\.(sql|db|json)$/,
  /dump.*\.(sql|db|json)$/,
  /password.*\.(txt|json|yml)$/,
  /token.*\.(txt|json|yml)$/,
  /api[-_]?key.*\.(txt|json|yml)$/,
];

// Extensiones de archivos sensibles
const SENSITIVE_EXTENSIONS = [
  '.key', '.pem', '.p12', '.pfx', '.crt', '.cer', 
  '.keystore', '.jks', '.backup', '.dump'
];

// Nombres de archivos sensibles
const SENSITIVE_NAMES = [
  'secrets', 'credentials', 'passwords', 'tokens',
  'private', 'confidential', '.htpasswd', 'shadow'
];

console.log('🔍 Escaneando archivos sensibles...\n');

function scanDirectory(dir, basePath = '') {
  const results = [];
  
  try {
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const relativePath = path.join(basePath, item);
      
      // Saltar directorios que ya sabemos que están seguros
      if (item === 'node_modules' || item === '.git' || item === '.next') {
        continue;
      }
      
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        results.push(...scanDirectory(fullPath, relativePath));
      } else {
        // Verificar si el archivo es sensible
        if (isSensitiveFile(item, relativePath)) {
          results.push({
            path: relativePath,
            reason: getSensitiveReason(item, relativePath),
            size: stat.size,
            modified: stat.mtime
          });
        }
      }
    }
  } catch (error) {
    // Ignorar errores de acceso
  }
  
  return results;
}

function isSensitiveFile(filename, fullPath) {
  const lowerFilename = filename.toLowerCase();
  const lowerPath = fullPath.toLowerCase();
  
  // Verificar patrones
  for (const pattern of SENSITIVE_PATTERNS) {
    if (pattern.test(lowerFilename) || pattern.test(lowerPath)) {
      return true;
    }
  }
  
  // Verificar extensiones
  for (const ext of SENSITIVE_EXTENSIONS) {
    if (lowerFilename.endsWith(ext)) {
      return true;
    }
  }
  
  // Verificar nombres
  for (const name of SENSITIVE_NAMES) {
    if (lowerFilename.includes(name)) {
      return true;
    }
  }
  
  return false;
}

function getSensitiveReason(filename, fullPath) {
  const lower = filename.toLowerCase();
  
  if (lower.includes('secret')) return 'Contiene "secret" en el nombre';
  if (lower.includes('credential')) return 'Contiene "credential" en el nombre';
  if (lower.includes('password')) return 'Contiene "password" en el nombre';
  if (lower.includes('token')) return 'Contiene "token" en el nombre';
  if (lower.endsWith('.key')) return 'Archivo de clave privada';
  if (lower.endsWith('.pem')) return 'Certificado/clave PEM';
  if (lower.includes('backup')) return 'Archivo de respaldo (puede contener datos sensibles)';
  if (lower.includes('.env')) return 'Archivo de variables de entorno';
  
  return 'Archivo potencialmente sensible';
}

function isIgnoredByGit(filePath) {
  try {
    execSync(`git check-ignore "${filePath}"`, { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

// Escanear proyecto
const sensitiveFiles = scanDirectory('.');

if (sensitiveFiles.length === 0) {
  console.log('✅ No se encontraron archivos sensibles en el proyecto.');
} else {
  console.log(`⚠️  Se encontraron ${sensitiveFiles.length} archivos potencialmente sensibles:\n`);
  
  let ignoredCount = 0;
  let trackedCount = 0;
  
  for (const file of sensitiveFiles) {
    const isIgnored = isIgnoredByGit(file.path);
    const status = isIgnored ? '✅ IGNORADO' : '❌ TRACKED';
    
    if (isIgnored) ignoredCount++;
    else trackedCount++;
    
    console.log(`${status} ${file.path}`);
    console.log(`   Razón: ${file.reason}`);
    console.log(`   Tamaño: ${file.size} bytes\n`);
  }
  
  console.log(`📊 Resumen:`);
  console.log(`   Archivos ignorados por git: ${ignoredCount}`);
  console.log(`   Archivos tracked por git: ${trackedCount}`);
  
  if (trackedCount > 0) {
    console.log(`\n🚨 ACCIÓN REQUERIDA:`);
    console.log(`   ${trackedCount} archivos sensibles están siendo tracked por git.`);
    console.log(`   Considera agregarlos al .gitignore y usar 'git rm --cached <file>' para removerlos del tracking.`);
  } else {
    console.log(`\n✅ Todos los archivos sensibles están correctamente ignorados.`);
  }
}

console.log(`\n🔒 Verificación de seguridad completada.`);