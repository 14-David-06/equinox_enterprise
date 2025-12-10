'use client';
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function InspeccionPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    // Encabezado
    codigo: '',
    version: '',
    fechaEdicion: '',
    fechaInspeccionDesde: '',
    fechaInspeccionHasta: '',
    mes: '',
    anio: '',
    
    // Documentos
    soatEstado: '',
    soatVencimiento: '',
    revisionTecnicaEstado: '',
    revisionTecnicaVencimiento: '',
    polizaEstado: '',
    polizaVencimiento: '',
    licenciaEstado: '',
    licenciaVencimiento: '',
    categorias: [
      { categoria: '', vigencia: '' },
      { categoria: '', vigencia: '' },
      { categoria: '', vigencia: '' }
    ],
    
    // Conductor
    nombreConductor: '',
    cedula: '',
    edad: '',
    arl: '',
    eps: '',
    fondoPension: '',
    rh: '',
    
    // Vehículo
    placaVehiculo: '',
    marcaVehiculo: '',
    lineaVehiculo: '',
    modeloVehiculo: '',
    
    // Remolque
    placaRemolque: '',
    marcaRemolque: '',
    claseRemolque: '',
    modeloRemolque: '',
    
    // Horas dormir
    horasDormir: '',
    
    // Kilometraje (31 días)
    kilometraje: Array(31).fill(''),
    
    // Salud
    tomaMedicacion: '',
    ansiedadEstres: '',
    problemasVisuales: '',
    estadoSalud: ''
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleDocumentChange = (documentType: string, field: 'estado' | 'vencimiento', value: string) => {
    const fieldName = `${documentType}${field.charAt(0).toUpperCase() + field.slice(1)}`;
    setFormData(prev => ({ ...prev, [fieldName]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/inspecciones', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al guardar la inspección');
      }

      const data = await response.json();
      alert('✅ Inspección guardada correctamente en la base de datos');
      
      // Opcional: Limpiar el formulario después de guardar
      // setFormData({ ...initialFormData });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al guardar la inspección';
      alert(`❌ ${errorMessage}. Intente de nuevo.`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black">
      <Navbar />
      
      <main className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-7xl">
          {/* Header */}
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-center bg-gradient-to-r from-yellow-400 to-yellow-300 bg-clip-text text-transparent mb-2 sm:mb-4">
              Formato de Inspección Preoperacional
            </h1>
            <p className="text-center text-gray-300 text-sm sm:text-base md:text-lg">
              Tractocamión - Control Diario del Vehículo
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
            {/* 1. ENCABEZADO */}
            <section className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-6">
              <h2 className="text-xl sm:text-2xl font-bold text-yellow-400 mb-4 sm:mb-6">📋 Información del Formato</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1 sm:mb-2">Código</label>
                  <input
                    type="text"
                    value={formData.codigo}
                    onChange={(e) => handleInputChange('codigo', e.target.value)}
                    className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-yellow-400 transition-colors"
                    placeholder="Ej: FI-001"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Versión</label>
                  <input
                    type="text"
                    value={formData.version}
                    onChange={(e) => handleInputChange('version', e.target.value)}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-yellow-400 transition-colors"
                    placeholder="Ej: 1.0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Fecha de Edición</label>
                  <input
                    type="date"
                    value={formData.fechaEdicion}
                    onChange={(e) => handleInputChange('fechaEdicion', e.target.value)}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-yellow-400 transition-colors"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-3 sm:mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Desde</label>
                  <input
                    type="date"
                    value={formData.fechaInspeccionDesde}
                    onChange={(e) => handleInputChange('fechaInspeccionDesde', e.target.value)}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-yellow-400 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Hasta</label>
                  <input
                    type="date"
                    value={formData.fechaInspeccionHasta}
                    onChange={(e) => handleInputChange('fechaInspeccionHasta', e.target.value)}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-yellow-400 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Mes</label>
                  <select
                    value={formData.mes}
                    onChange={(e) => handleInputChange('mes', e.target.value)}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-yellow-400 transition-colors"
                  >
                    <option value="">Seleccione</option>
                    {['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'].map((mes) => (
                      <option key={mes} value={mes} className="bg-slate-800">{mes}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Año</label>
                  <input
                    type="number"
                    value={formData.anio}
                    onChange={(e) => handleInputChange('anio', e.target.value)}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-yellow-400 transition-colors"
                    placeholder="2025"
                  />
                </div>
              </div>
            </section>

            {/* 2. DOCUMENTOS REQUERIDOS */}
            <section className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-6">
              <h2 className="text-xl sm:text-2xl font-bold text-yellow-400 mb-4 sm:mb-6">📄 Documentos Requeridos</h2>
              <div className="overflow-x-auto -mx-4 sm:mx-0">
                <table className="w-full text-xs sm:text-sm min-w-[600px] sm:min-w-0">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-gray-300 font-semibold">Documento</th>
                      <th className="text-center py-2 sm:py-3 px-2 sm:px-4 text-gray-300 font-semibold">Sí</th>
                      <th className="text-center py-2 sm:py-3 px-2 sm:px-4 text-gray-300 font-semibold">No</th>
                      <th className="text-center py-2 sm:py-3 px-2 sm:px-4 text-gray-300 font-semibold">N.A</th>
                      <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-gray-300 font-semibold">Fecha Vencimiento</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-300">
                    {[
                      { key: 'soat', label: 'SOAT' },
                      { key: 'revisionTecnica', label: 'Revisión Técnico-Mecánica' },
                      { key: 'poliza', label: 'Póliza Contra Todo Riesgo' },
                      { key: 'licencia', label: 'Licencia de Conducción' }
                    ].map(({ key, label }) => (
                      <tr key={key} className="border-b border-white/5">
                        <td className="py-3 px-4">{label}</td>
                        <td className="text-center py-3 px-4">
                          <input
                            type="radio"
                            name={key}
                            value="si"
                            onChange={(e) => handleDocumentChange(key, 'estado', 'si')}
                            className="w-4 h-4 accent-yellow-400"
                          />
                        </td>
                        <td className="text-center py-3 px-4">
                          <input
                            type="radio"
                            name={key}
                            value="no"
                            onChange={(e) => handleDocumentChange(key, 'estado', 'no')}
                            className="w-4 h-4 accent-yellow-400"
                          />
                        </td>
                        <td className="text-center py-3 px-4">
                          <input
                            type="radio"
                            name={key}
                            value="na"
                            onChange={(e) => handleDocumentChange(key, 'estado', 'na')}
                            className="w-4 h-4 accent-yellow-400"
                          />
                        </td>
                        <td className="py-3 px-4">
                          <input
                            type="date"
                            onChange={(e) => handleDocumentChange(key, 'vencimiento', e.target.value)}
                            className="w-full px-3 py-1 bg-white/5 border border-white/10 rounded text-white text-xs focus:outline-none focus:border-yellow-400"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-yellow-300 mb-4">Categorías Autorizadas</h3>
                {formData.categorias.map((cat, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Categoría {index + 1}</label>
                      <input
                        type="text"
                        placeholder="Ej: C1, C2, C3"
                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-yellow-400 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Fecha de Vigencia</label>
                      <input
                        type="date"
                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-yellow-400 transition-colors"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 3. DATOS DEL CONDUCTOR */}
            <section className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-6">
              <h2 className="text-xl sm:text-2xl font-bold text-yellow-400 mb-4 sm:mb-6">👤 Datos del Conductor / Operador</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Nombre Completo</label>
                  <input
                    type="text"
                    value={formData.nombreConductor}
                    onChange={(e) => handleInputChange('nombreConductor', e.target.value)}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-yellow-400 transition-colors"
                    placeholder="Nombre completo del conductor"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Cédula</label>
                  <input
                    type="text"
                    value={formData.cedula}
                    onChange={(e) => handleInputChange('cedula', e.target.value)}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-yellow-400 transition-colors"
                    placeholder="CC"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Edad</label>
                  <input
                    type="number"
                    value={formData.edad}
                    onChange={(e) => handleInputChange('edad', e.target.value)}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-yellow-400 transition-colors"
                    placeholder="Edad"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">ARL</label>
                  <input
                    type="text"
                    value={formData.arl}
                    onChange={(e) => handleInputChange('arl', e.target.value)}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-yellow-400 transition-colors"
                    placeholder="ARL"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">EPS</label>
                  <input
                    type="text"
                    value={formData.eps}
                    onChange={(e) => handleInputChange('eps', e.target.value)}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-yellow-400 transition-colors"
                    placeholder="EPS"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Fondo de Pensión</label>
                  <input
                    type="text"
                    value={formData.fondoPension}
                    onChange={(e) => handleInputChange('fondoPension', e.target.value)}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-yellow-400 transition-colors"
                    placeholder="Fondo"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">RH</label>
                  <select
                    value={formData.rh}
                    onChange={(e) => handleInputChange('rh', e.target.value)}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-yellow-400 transition-colors"
                  >
                    <option value="">Seleccione</option>
                    {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map((rh) => (
                      <option key={rh} value={rh} className="bg-slate-800">{rh}</option>
                    ))}
                  </select>
                </div>
              </div>
            </section>

            {/* 4. DATOS DEL VEHÍCULO */}
            <section className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-6">
              <h2 className="text-xl sm:text-2xl font-bold text-yellow-400 mb-4 sm:mb-6">🚛 Datos del Vehículo</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Placa</label>
                  <input
                    type="text"
                    value={formData.placaVehiculo}
                    onChange={(e) => handleInputChange('placaVehiculo', e.target.value)}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-yellow-400 transition-colors"
                    placeholder="XXX000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Marca</label>
                  <input
                    type="text"
                    value={formData.marcaVehiculo}
                    onChange={(e) => handleInputChange('marcaVehiculo', e.target.value)}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-yellow-400 transition-colors"
                    placeholder="Marca"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Línea</label>
                  <input
                    type="text"
                    value={formData.lineaVehiculo}
                    onChange={(e) => handleInputChange('lineaVehiculo', e.target.value)}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-yellow-400 transition-colors"
                    placeholder="Línea"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Modelo</label>
                  <input
                    type="number"
                    value={formData.modeloVehiculo}
                    onChange={(e) => handleInputChange('modeloVehiculo', e.target.value)}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-yellow-400 transition-colors"
                    placeholder="2025"
                  />
                </div>
              </div>
            </section>

            {/* 5. DATOS DEL REMOLQUE */}
            <section className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-6">
              <h2 className="text-xl sm:text-2xl font-bold text-yellow-400 mb-4 sm:mb-6">🚚 Datos del Remolque o Semirremolque</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Placa</label>
                  <input
                    type="text"
                    value={formData.placaRemolque}
                    onChange={(e) => handleInputChange('placaRemolque', e.target.value)}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-yellow-400 transition-colors"
                    placeholder="XXX000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Marca</label>
                  <input
                    type="text"
                    value={formData.marcaRemolque}
                    onChange={(e) => handleInputChange('marcaRemolque', e.target.value)}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-yellow-400 transition-colors"
                    placeholder="Marca"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Clase</label>
                  <input
                    type="text"
                    value={formData.claseRemolque}
                    onChange={(e) => handleInputChange('claseRemolque', e.target.value)}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-yellow-400 transition-colors"
                    placeholder="Clase"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Modelo</label>
                  <input
                    type="number"
                    value={formData.modeloRemolque}
                    onChange={(e) => handleInputChange('modeloRemolque', e.target.value)}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-yellow-400 transition-colors"
                    placeholder="2025"
                  />
                </div>
              </div>
            </section>

            {/* 6. HORAS DE DORMIR */}
            <section className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-6">
              <h2 className="text-xl sm:text-2xl font-bold text-yellow-400 mb-4 sm:mb-6">😴 Horas Dedicadas a Dormir</h2>
              <div className="max-w-md">
                <label className="block text-sm font-medium text-gray-300 mb-2">Total de horas</label>
                <input
                  type="number"
                  value={formData.horasDormir}
                  onChange={(e) => handleInputChange('horasDormir', e.target.value)}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-yellow-400 transition-colors"
                  placeholder="Horas"
                  min="0"
                  max="24"
                />
              </div>
            </section>

            {/* 7. KILOMETRAJE DIARIO */}
            <section className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-6">
              <h2 className="text-xl sm:text-2xl font-bold text-yellow-400 mb-4 sm:mb-6">📏 Kilometraje Diario</h2>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2 sm:gap-3">
                {Array.from({ length: 31 }, (_, i) => (
                  <div key={i}>
                    <label className="block text-xs font-medium text-gray-400 mb-1 text-center">Día {i + 1}</label>
                    <input
                      type="number"
                      className="w-full px-2 py-2 bg-white/5 border border-white/10 rounded text-white text-sm text-center focus:outline-none focus:border-yellow-400 transition-colors"
                      placeholder="km"
                    />
                  </div>
                ))}
              </div>
              <div className="mt-4 max-w-md">
                <label className="block text-sm font-medium text-yellow-300 mb-2">Total Mensual (km)</label>
                <input
                  type="number"
                  className="w-full px-4 py-2 bg-yellow-500/10 border border-yellow-400/30 rounded-lg text-white font-semibold focus:outline-none focus:border-yellow-400 transition-colors"
                  placeholder="Total km"
                  readOnly
                />
              </div>
            </section>

            {/* 8. ÍTEMS DE VERIFICACIÓN */}
            <section className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-6">
              <h2 className="text-xl sm:text-2xl font-bold text-yellow-400 mb-4 sm:mb-6">✅ Ítems de Verificación</h2>
              
              {/* Condiciones de Seguridad */}
              <div className="mb-6 sm:mb-8">
                <h3 className="text-lg sm:text-xl font-semibold text-yellow-300 mb-3 sm:mb-4">🔒 Condiciones de Seguridad (1-8)</h3>
                <div className="overflow-x-auto -mx-4 sm:mx-0">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="text-left py-2 px-3 text-gray-300">#</th>
                        <th className="text-left py-2 px-3 text-gray-300">Ítem</th>
                        <th className="text-center py-2 px-3 text-gray-300">Estado</th>
                        <th className="text-left py-2 px-3 text-gray-300">Observaciones</th>
                      </tr>
                    </thead>
                    <tbody className="text-gray-300">
                      {[
                        'Extintor',
                        'Equipo de Carretera',
                        'Botiquín',
                        'Cinturones de Seguridad',
                        'Bocina',
                        'Luces (Altas, Bajas, Direccionales)',
                        'Retrovisores',
                        'Señalización Reglamentaria'
                      ].map((item, index) => (
                        <tr key={index} className="border-b border-white/5">
                          <td className="py-3 px-3 font-mono text-yellow-400">{index + 1}</td>
                          <td className="py-3 px-3">{item}</td>
                          <td className="py-3 px-3">
                            <select className="w-full px-3 py-1 bg-white/5 border border-white/10 rounded text-white text-xs focus:outline-none focus:border-yellow-400">
                              <option value="">Seleccionar</option>
                              <option value="B" className="bg-slate-800">B - Bueno</option>
                              <option value="R" className="bg-slate-800">R - Regular</option>
                              <option value="M" className="bg-slate-800">M - Malo</option>
                            </select>
                          </td>
                          <td className="py-3 px-3">
                            <input
                              type="text"
                              className="w-full px-3 py-1 bg-white/5 border border-white/10 rounded text-white text-xs focus:outline-none focus:border-yellow-400"
                              placeholder="Observaciones..."
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Condiciones Generales */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-yellow-300 mb-4">⚙️ Condiciones Generales (9-26)</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="text-left py-2 px-3 text-gray-300">#</th>
                        <th className="text-left py-2 px-3 text-gray-300">Ítem</th>
                        <th className="text-center py-2 px-3 text-gray-300">Estado</th>
                        <th className="text-left py-2 px-3 text-gray-300">Observaciones</th>
                      </tr>
                    </thead>
                    <tbody className="text-gray-300">
                      {[
                        'Tanque de Combustible',
                        'Cabina',
                        'Llantas (Estado y Presión)',
                        'Sistema de Frenos',
                        'Dirección',
                        'Motor',
                        'Nivel de Aceite',
                        'Nivel de Refrigerante',
                        'Suspensión',
                        'Herramientas',
                        'Anclajes',
                        'Cables Eléctricos',
                        'Sistema de Escape',
                        'Parabrisas y Vidrios',
                        'Limpiaparabrisas',
                        'Espejo Retrovisor Interior',
                        'Cintas Reflectivas',
                        'Tensores y Cadenas'
                      ].map((item, index) => (
                        <tr key={index} className="border-b border-white/5">
                          <td className="py-3 px-3 font-mono text-yellow-400">{index + 9}</td>
                          <td className="py-3 px-3">{item}</td>
                          <td className="py-3 px-3">
                            <select className="w-full px-3 py-1 bg-white/5 border border-white/10 rounded text-white text-xs focus:outline-none focus:border-yellow-400">
                              <option value="">Seleccionar</option>
                              <option value="B" className="bg-slate-800">B - Bueno</option>
                              <option value="R" className="bg-slate-800">R - Regular</option>
                              <option value="M" className="bg-slate-800">M - Malo</option>
                            </select>
                          </td>
                          <td className="py-3 px-3">
                            <input
                              type="text"
                              className="w-full px-3 py-1 bg-white/5 border border-white/10 rounded text-white text-xs focus:outline-none focus:border-yellow-400"
                              placeholder="Observaciones..."
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Estado Mecánico */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-yellow-300 mb-4">🔧 Estado Mecánico (27-36)</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="text-left py-2 px-3 text-gray-300">#</th>
                        <th className="text-left py-2 px-3 text-gray-300">Ítem</th>
                        <th className="text-center py-2 px-3 text-gray-300">Estado</th>
                        <th className="text-left py-2 px-3 text-gray-300">Observaciones</th>
                      </tr>
                    </thead>
                    <tbody className="text-gray-300">
                      {[
                        'Caja de Cambios',
                        'Amortiguadores',
                        'Sistema de Refrigerante',
                        'Fugas (Aceite, Combustible, Refrigerante)',
                        'Sistema de Frenos (Hidráulico/Neumático)',
                        'Batería',
                        'Sistema de Lubricación',
                        'Correas y Bandas',
                        'Filtros (Aire, Aceite, Combustible)',
                        'Alineación y Balanceo'
                      ].map((item, index) => (
                        <tr key={index} className="border-b border-white/5">
                          <td className="py-3 px-3 font-mono text-yellow-400">{index + 27}</td>
                          <td className="py-3 px-3">{item}</td>
                          <td className="py-3 px-3">
                            <select className="w-full px-3 py-1 bg-white/5 border border-white/10 rounded text-white text-xs focus:outline-none focus:border-yellow-400">
                              <option value="">Seleccionar</option>
                              <option value="B" className="bg-slate-800">B - Bueno</option>
                              <option value="R" className="bg-slate-800">R - Regular</option>
                              <option value="M" className="bg-slate-800">M - Malo</option>
                            </select>
                          </td>
                          <td className="py-3 px-3">
                            <input
                              type="text"
                              className="w-full px-3 py-1 bg-white/5 border border-white/10 rounded text-white text-xs focus:outline-none focus:border-yellow-400"
                              placeholder="Observaciones..."
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Desinfección y Limpieza */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-yellow-300 mb-4">🧼 Desinfección y Limpieza (37)</h3>
                <div className="flex items-center space-x-6 p-4 bg-white/5 rounded-lg">
                  <span className="text-gray-300">¿Se realizó desinfección y limpieza del vehículo?</span>
                  <div className="flex space-x-4">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input type="radio" name="desinfeccion" value="si" className="w-4 h-4 accent-yellow-400" />
                      <span className="text-gray-300">Sí</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input type="radio" name="desinfeccion" value="no" className="w-4 h-4 accent-yellow-400" />
                      <span className="text-gray-300">No</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Reporte de Descanso */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-yellow-300 mb-4">💤 Reporte de Descanso (38)</h3>
                <div className="flex items-center space-x-6 p-4 bg-white/5 rounded-lg">
                  <span className="text-gray-300">¿Tomó los descansos reglamentarios?</span>
                  <div className="flex space-x-4">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input type="radio" name="descanso" value="si" className="w-4 h-4 accent-yellow-400" />
                      <span className="text-gray-300">Sí</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input type="radio" name="descanso" value="no" className="w-4 h-4 accent-yellow-400" />
                      <span className="text-gray-300">No</span>
                    </label>
                  </div>
                </div>
              </div>
            </section>

            {/* 9. CONDICIONES DE SALUD DEL CONDUCTOR */}
            <section className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-6">
              <h2 className="text-xl sm:text-2xl font-bold text-yellow-400 mb-4 sm:mb-6">❤️ Estado de Salud del Conductor (39-42)</h2>
              <div className="space-y-3 sm:space-y-4">
                {[
                  { key: 'tomaMedicacion', question: '¿Está tomando algún medicamento?' },
                  { key: 'ansiedadEstres', question: '¿Presenta ansiedad o estrés?' },
                  { key: 'problemasVisuales', question: '¿Tiene problemas visuales o de audición?' },
                  { key: 'estadoSalud', question: '¿Se encuentra en buen estado de salud para operar?' }
                ].map(({ key, question }, index) => (
                  <div key={key} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 bg-white/5 rounded-lg gap-2 sm:gap-0">
                    <div className="flex items-start flex-1">
                      <span className="text-gray-300 font-mono text-xs sm:text-sm text-yellow-400 mr-2 sm:mr-4 flex-shrink-0">{index + 39}.</span>
                      <span className="text-gray-300 text-sm sm:text-base">{question}</span>
                    </div>
                    <div className="flex space-x-4 ml-6 sm:ml-0">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          name={key}
                          value="si"
                          onChange={(e) => handleInputChange(key, e.target.value)}
                          className="w-4 h-4 accent-yellow-400"
                        />
                        <span className="text-gray-300">Sí</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          name={key}
                          value="no"
                          onChange={(e) => handleInputChange(key, e.target.value)}
                          className="w-4 h-4 accent-yellow-400"
                        />
                        <span className="text-gray-300">No</span>
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 10. FIRMAS */}
            <section className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-6">
              <h2 className="text-xl sm:text-2xl font-bold text-yellow-400 mb-4 sm:mb-6">✍️ Firmas y Responsables</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-yellow-300 mb-4">Conductor</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Firma</label>
                      <div className="w-full h-32 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center text-gray-500">
                        [Área de firma digital]
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Cédula</label>
                      <input
                        type="text"
                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-yellow-400 transition-colors"
                        placeholder="Número de cédula"
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-yellow-300 mb-4">Coordinadora HSEQ</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Firma</label>
                      <div className="w-full h-32 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center text-gray-500">
                        [Área de firma digital]
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Cédula</label>
                      <input
                        type="text"
                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-yellow-400 transition-colors"
                        placeholder="Número de cédula"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* NOTA IMPORTANTE */}
            <div className="backdrop-blur-xl bg-yellow-500/10 border border-yellow-400/30 rounded-xl sm:rounded-2xl p-4 sm:p-6">
              <div className="flex items-start space-x-3">
                <svg className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div>
                  <h3 className="text-lg font-semibold text-yellow-300 mb-2">⚠️ Nota Importante</h3>
                  <p className="text-gray-300">
                    La inspección preoperacional debe diligenciarla <strong className="text-yellow-400">únicamente el conductor del vehículo</strong>. 
                    Es responsabilidad del conductor verificar cada ítem antes de iniciar operaciones y reportar cualquier anomalía de inmediato.
                  </p>
                </div>
              </div>
            </div>

            {/* BOTONES DE ACCIÓN */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <button
                type="submit"
                disabled={isLoading}
                className="group relative px-8 sm:px-12 py-3 sm:py-4 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-bold text-base sm:text-lg rounded-full overflow-hidden shadow-xl hover:shadow-yellow-500/50 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                <span className="relative z-10">
                  {isLoading ? '⏳ Guardando...' : 'Enviar Inspección'}
                </span>
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              </button>
              <button
                type="button"
                className="px-8 sm:px-12 py-3 sm:py-4 backdrop-blur-lg bg-white/5 border border-white/10 text-white font-semibold text-base sm:text-lg rounded-full hover:bg-white/10 transition-all duration-300 hover:scale-105"
              >
                Guardar Borrador
              </button>
            </div>
          </form>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
