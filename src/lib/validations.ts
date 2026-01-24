import { z } from 'zod';

/**
 * Schemas de validación con Zod para los endpoints de la API
 */

// Schema para login
export const loginSchema = z.object({
  cedula: z.string()
    .min(6, 'La cédula debe tener al menos 6 caracteres')
    .max(20, 'La cédula no puede exceder 20 caracteres')
    .regex(/^[0-9]+$/, 'La cédula solo puede contener números'),
  password: z.string()
    .min(4, 'La contraseña debe tener al menos 4 caracteres')
    .max(100, 'La contraseña no puede exceder 100 caracteres'),
});

// Schema para crear usuario
export const createUsuarioSchema = z.object({
  cedula: z.string()
    .min(6, 'La cédula debe tener al menos 6 caracteres')
    .max(20, 'La cédula no puede exceder 20 caracteres')
    .regex(/^[0-9]+$/, 'La cédula solo puede contener números'),
  password: z.string()
    .min(4, 'La contraseña debe tener al menos 4 caracteres')
    .max(100, 'La contraseña no puede exceder 100 caracteres'),
  nombre: z.string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres'),
  email: z.string().email('Email inválido').optional().nullable(),
  telefono: z.string().max(20).optional().nullable(),
  rol: z.enum(['conductor', 'admin', 'supervisor']).default('conductor'),
  activo: z.boolean().default(true),
});

// Schema para inspección
export const inspeccionSchema = z.object({
  // Encabezado
  codigo: z.string().max(50).optional().nullable(),
  version: z.string().max(20).optional().nullable(),
  fechaEdicion: z.string().max(20).optional().nullable(),
  fechaInspeccionDesde: z.string().max(20).optional().nullable(),
  fechaInspeccionHasta: z.string().max(20).optional().nullable(),
  mes: z.string().max(20).optional().nullable(),
  anio: z.string().max(4).optional().nullable(),
  
  // Documentos
  soatEstado: z.string().max(20).optional().nullable(),
  soatVencimiento: z.string().max(20).optional().nullable(),
  revisionTecnicaEstado: z.string().max(20).optional().nullable(),
  revisionTecnicaVencimiento: z.string().max(20).optional().nullable(),
  polizaEstado: z.string().max(20).optional().nullable(),
  polizaVencimiento: z.string().max(20).optional().nullable(),
  licenciaEstado: z.string().max(20).optional().nullable(),
  licenciaVencimiento: z.string().max(20).optional().nullable(),
  
  // Categorías (debe ser array)
  categorias: z.array(z.any()).optional().nullable(),
  
  // Conductor
  nombreConductor: z.string().max(100).optional().nullable(),
  cedula: z.string().max(20).optional().nullable(),
  edad: z.string().max(3).optional().nullable(),
  arl: z.string().max(100).optional().nullable(),
  eps: z.string().max(100).optional().nullable(),
  fondoPension: z.string().max(100).optional().nullable(),
  rh: z.string().max(10).optional().nullable(),
  
  // Vehículo
  placaVehiculo: z.string().max(20).optional().nullable(),
  marcaVehiculo: z.string().max(50).optional().nullable(),
  lineaVehiculo: z.string().max(50).optional().nullable(),
  modeloVehiculo: z.string().max(20).optional().nullable(),
  
  // Remolque
  placaRemolque: z.string().max(20).optional().nullable(),
  marcaRemolque: z.string().max(50).optional().nullable(),
  claseRemolque: z.string().max(50).optional().nullable(),
  modeloRemolque: z.string().max(20).optional().nullable(),
  
  // Otros
  horasDormir: z.string().max(10).optional().nullable(),
  kilometraje: z.array(z.any()).optional().nullable(),
  tomaMedicacion: z.string().max(10).optional().nullable(),
  ansiedadEstres: z.string().max(10).optional().nullable(),
  problemasVisuales: z.string().max(10).optional().nullable(),
  estadoSalud: z.string().max(20).optional().nullable(),
});

// Helper para validar y retornar errores formateados
export function validateRequest<T>(schema: z.ZodSchema<T>, data: unknown): {
  success: true;
  data: T;
} | {
  success: false;
  errors: Array<{ field: string; message: string }>;
} {
  const result = schema.safeParse(data);
  
  if (!result.success) {
    return {
      success: false,
      errors: result.error.issues.map((err: z.ZodIssue) => ({
        field: err.path.join('.'),
        message: err.message,
      })),
    };
  }
  
  return {
    success: true,
    data: result.data,
  };
}
