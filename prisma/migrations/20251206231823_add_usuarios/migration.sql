-- CreateTable
CREATE TABLE "Usuario" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT,
    "cedula" TEXT,
    "telefono" TEXT,
    "rol" TEXT NOT NULL DEFAULT 'conductor',
    "activo" BOOLEAN NOT NULL DEFAULT true
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Inspeccion" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "usuarioId" TEXT,
    "codigo" TEXT,
    "version" TEXT,
    "fechaEdicion" TEXT,
    "fechaInspeccionDesde" TEXT,
    "fechaInspeccionHasta" TEXT,
    "mes" TEXT,
    "anio" TEXT,
    "soatEstado" TEXT,
    "soatVencimiento" TEXT,
    "revisionTecnicaEstado" TEXT,
    "revisionTecnicaVencimiento" TEXT,
    "polizaEstado" TEXT,
    "polizaVencimiento" TEXT,
    "licenciaEstado" TEXT,
    "licenciaVencimiento" TEXT,
    "categorias" TEXT,
    "nombreConductor" TEXT,
    "cedula" TEXT,
    "edad" TEXT,
    "arl" TEXT,
    "eps" TEXT,
    "fondoPension" TEXT,
    "rh" TEXT,
    "placaVehiculo" TEXT,
    "marcaVehiculo" TEXT,
    "lineaVehiculo" TEXT,
    "modeloVehiculo" TEXT,
    "placaRemolque" TEXT,
    "marcaRemolque" TEXT,
    "claseRemolque" TEXT,
    "modeloRemolque" TEXT,
    "horasDormir" TEXT,
    "kilometraje" TEXT,
    "tomaMedicacion" TEXT,
    "ansiedadEstres" TEXT,
    "problemasVisuales" TEXT,
    "estadoSalud" TEXT,
    CONSTRAINT "Inspeccion_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Inspeccion" ("anio", "ansiedadEstres", "arl", "categorias", "cedula", "claseRemolque", "codigo", "createdAt", "edad", "eps", "estadoSalud", "fechaEdicion", "fechaInspeccionDesde", "fechaInspeccionHasta", "fondoPension", "horasDormir", "id", "kilometraje", "licenciaEstado", "licenciaVencimiento", "lineaVehiculo", "marcaRemolque", "marcaVehiculo", "mes", "modeloRemolque", "modeloVehiculo", "nombreConductor", "placaRemolque", "placaVehiculo", "polizaEstado", "polizaVencimiento", "problemasVisuales", "revisionTecnicaEstado", "revisionTecnicaVencimiento", "rh", "soatEstado", "soatVencimiento", "tomaMedicacion", "updatedAt", "version") SELECT "anio", "ansiedadEstres", "arl", "categorias", "cedula", "claseRemolque", "codigo", "createdAt", "edad", "eps", "estadoSalud", "fechaEdicion", "fechaInspeccionDesde", "fechaInspeccionHasta", "fondoPension", "horasDormir", "id", "kilometraje", "licenciaEstado", "licenciaVencimiento", "lineaVehiculo", "marcaRemolque", "marcaVehiculo", "mes", "modeloRemolque", "modeloVehiculo", "nombreConductor", "placaRemolque", "placaVehiculo", "polizaEstado", "polizaVencimiento", "problemasVisuales", "revisionTecnicaEstado", "revisionTecnicaVencimiento", "rh", "soatEstado", "soatVencimiento", "tomaMedicacion", "updatedAt", "version" FROM "Inspeccion";
DROP TABLE "Inspeccion";
ALTER TABLE "new_Inspeccion" RENAME TO "Inspeccion";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_cedula_key" ON "Usuario"("cedula");
