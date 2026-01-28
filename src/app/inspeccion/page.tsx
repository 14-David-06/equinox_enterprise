'use client';
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

// Categorías de licencia disponibles
const CATEGORIAS_LICENCIA = ['A1', 'A2', 'B1', 'B2', 'B3', 'C1', 'C2', 'C3'];

// Items de verificación con estructura para validación
const ITEMS_SEGURIDAD = [
  { id: 1, nombre: 'Extintor' },
  { id: 2, nombre: 'Equipo de Carretera' },
  { id: 3, nombre: 'Botiquín' },
  { id: 4, nombre: 'Cinturones de Seguridad' },
  { id: 5, nombre: 'Bocina' },
  { id: 6, nombre: 'Luces (Altas, Bajas, Direccionales)' },
  { id: 7, nombre: 'Retrovisores' },
  { id: 8, nombre: 'Señalización Reglamentaria' },
];

const ITEMS_GENERALES = [
  { id: 9, nombre: 'Tanque de Combustible' },
  { id: 10, nombre: 'Tapa del Tanque de Combustible' },
  { id: 11, nombre: 'Cabina' },
  { id: 12, nombre: 'Silla del Conductor (buen estado)' },
  { id: 13, nombre: 'Llantas (Estado y Presión)' },
  { id: 14, nombre: 'Sistema de Frenos' },
  { id: 15, nombre: 'Dirección' },
  { id: 16, nombre: 'Motor' },
  { id: 17, nombre: 'Nivel de Aceite' },
  { id: 18, nombre: 'Nivel de Refrigerante' },
  { id: 19, nombre: 'Suspensión' },
  { id: 20, nombre: 'Herramientas' },
  { id: 21, nombre: 'Anclajes' },
  { id: 22, nombre: 'Cables Eléctricos' },
  { id: 23, nombre: 'Sistema de Escape' },
  { id: 24, nombre: 'Parabrisas y Vidrios' },
  { id: 25, nombre: 'Limpiaparabrisas' },
  { id: 26, nombre: 'Espejo Retrovisor Interior' },
  { id: 27, nombre: 'Cintas Reflectivas' },
  { id: 28, nombre: 'Tensores y Cadenas' },
];

const ITEMS_MECANICOS = [
  { id: 29, nombre: 'Caja de Cambios' },
  { id: 30, nombre: 'Amortiguadores' },
  { id: 31, nombre: 'Sistema de Refrigerante' },
  { id: 32, nombre: 'Fugas (Aceite, Combustible, Refrigerante)' },
  { id: 33, nombre: 'Sistema de Frenos (Hidráulico/Neumático)' },
  { id: 34, nombre: 'Batería' },
  { id: 35, nombre: 'Sistema de Lubricación' },
  { id: 36, nombre: 'Correas y Bandas' },
  { id: 37, nombre: 'Filtros (Aire, Aceite, Combustible)' },
  { id: 38, nombre: 'Alineación y Balanceo' },
];

// Información fija del formato
const INFO_FORMATO = {
  codigo: 'TR-FOR-009',
  version: '004',
  fechaEdicion: '25 de Abril 2023',
};

export default function InspeccionPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [fechaActual, setFechaActual] = useState('');
  
  // Estado para items de verificación: { [id]: { cumple: boolean | null, observacion: string } }
  const [itemsVerificacion, setItemsVerificacion] = useState<Record<number, { cumple: boolean | null; observacion: string }>>({});
  
  // Estado para categorías de licencia seleccionadas y sus fechas
  const [categoriasSeleccionadas, setCategoriasSeleccionadas] = useState<string[]>([]);
  const [vigenciasLicencia, setVigenciasLicencia] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    // Documentos
    soatCumple: null as boolean | null,
    soatVencimiento: '',
    soatObservacion: '',
    revisionTecnicaCumple: null as boolean | null,
    revisionTecnicaVencimiento: '',
    revisionTecnicaObservacion: '',
    polizaCumple: null as boolean | null,
    polizaVencimiento: '',
    polizaObservacion: '',
    licenciaCumple: null as boolean | null,
    licenciaVencimiento: '',
    licenciaObservacion: '',
    
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
    colorVehiculo: '',
    tarjetaPropiedad: '',
    
    // Remolque
    placaRemolque: '',
    marcaRemolque: '',
    claseRemolque: '',
    modeloRemolque: '',
    
    // Horas dormir (predeterminado 8)
    horasDormir: '8',
    
    // Salud
    tomaMedicacion: null as boolean | null,
    ansiedadEstres: null as boolean | null,
    problemasVisuales: null as boolean | null,
    estadoSalud: null as boolean | null,
    
    // Desinfección y descanso
    desinfeccion: null as boolean | null,
    descanso: null as boolean | null,
    
    // Firmas
    cedulaFirmaConductor: '',
    cedulaFirmaHSEQ: '',
  });

  // Establecer fecha actual al cargar
  useEffect(() => {
    const hoy = new Date();
    const opciones: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    setFechaActual(hoy.toLocaleDateString('es-CO', opciones));
  }, []);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleItemChange = (itemId: number, field: 'cumple' | 'observacion', value: boolean | string) => {
    setItemsVerificacion(prev => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        [field]: value,
        // Limpiar observación si cambia a cumple
        ...(field === 'cumple' && value === true ? { observacion: '' } : {}),
      }
    }));
  };

  const handleCategoriaToggle = (categoria: string) => {
    setCategoriasSeleccionadas(prev => {
      if (prev.includes(categoria)) {
        // Remover categoría y su vigencia
        const nuevasVigencias = { ...vigenciasLicencia };
        delete nuevasVigencias[categoria];
        setVigenciasLicencia(nuevasVigencias);
        return prev.filter(c => c !== categoria);
      } else {
        return [...prev, categoria];
      }
    });
  };

  const handleVigenciaChange = (categoria: string, fecha: string) => {
    setVigenciasLicencia(prev => ({ ...prev, [categoria]: fecha }));
  };

  // Validar que items que no cumplen tengan observación
  const validarItems = (): boolean => {
    const todosLosItems = [...ITEMS_SEGURIDAD, ...ITEMS_GENERALES, ...ITEMS_MECANICOS];
    for (const item of todosLosItems) {
      const estado = itemsVerificacion[item.id];
      if (estado?.cumple === false && (!estado.observacion || estado.observacion.trim() === '')) {
        alert(`El item "${item.nombre}" no cumple. Debe agregar una observación.`);
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validarItems()) {
      return;
    }
    
    setIsLoading(true);

    try {
      const dataToSend = {
        ...formData,
        fechaInspeccion: new Date().toISOString(),
        categoriasLicencia: categoriasSeleccionadas,
        vigenciasLicencia,
        itemsVerificacion,
        infoFormato: INFO_FORMATO,
      };

      const response = await fetch('/api/inspecciones', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al guardar la inspección');
      }

      alert('✅ Inspección guardada correctamente');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al guardar la inspección';
      alert(`❌ ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Componente para renderizar items de verificación
  const renderItemVerificacion = (item: { id: number; nombre: string }) => {
    const estado = itemsVerificacion[item.id] || { cumple: null, observacion: '' };
    const requiereObservacion = estado.cumple === false;

    return (
      <tr key={item.id} className="border-b border-white/5">
        <td className="py-3 px-3 font-mono text-yellow-400">{item.id}</td>
        <td className="py-3 px-3 text-gray-300">{item.nombre}</td>
        <td className="py-3 px-3">
          <div className="flex justify-center space-x-4">
            <label className="flex items-center space-x-1 cursor-pointer">
              <input
                type="radio"
                name={`item-${item.id}`}
                checked={estado.cumple === true}
                onChange={() => handleItemChange(item.id, 'cumple', true)}
                className="w-4 h-4 accent-green-500"
              />
              <span className="text-green-400 text-xs">Sí</span>
            </label>
            <label className="flex items-center space-x-1 cursor-pointer">
              <input
                type="radio"
                name={`item-${item.id}`}
                checked={estado.cumple === false}
                onChange={() => handleItemChange(item.id, 'cumple', false)}
                className="w-4 h-4 accent-red-500"
              />
              <span className="text-red-400 text-xs">No</span>
            </label>
          </div>
        </td>
        <td className="py-3 px-3">
          <input
            type="text"
            value={estado.observacion || ''}
            onChange={(e) => handleItemChange(item.id, 'observacion', e.target.value)}
            className={`w-full px-3 py-1 bg-white/5 border rounded text-white text-xs focus:outline-none transition-colors ${
              requiereObservacion 
                ? 'border-red-400 focus:border-red-500' 
                : 'border-white/10 focus:border-yellow-400'
            }`}
            placeholder={requiereObservacion ? '⚠️ Observación requerida...' : 'Observaciones...'}
            required={requiereObservacion}
          />
        </td>
      </tr>
    );
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
            {/* 1. INFORMACIÓN DEL FORMATO (FIJA) */}
            <section className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-6">
              <h2 className="text-xl sm:text-2xl font-bold text-yellow-400 mb-4 sm:mb-6">📋 Información del Formato</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-400 mb-1">Código</label>
                  <div className="px-3 sm:px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white font-semibold">
                    {INFO_FORMATO.codigo}
                  </div>
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-400 mb-1">Versión</label>
                  <div className="px-3 sm:px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white font-semibold">
                    {INFO_FORMATO.version}
                  </div>
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-400 mb-1">Fecha de Edición</label>
                  <div className="px-3 sm:px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white font-semibold">
                    {INFO_FORMATO.fechaEdicion}
                  </div>
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-400 mb-1">Fecha de Inspección</label>
                  <div className="px-3 sm:px-4 py-2 bg-yellow-500/20 border border-yellow-400/30 rounded-lg text-yellow-300 font-semibold capitalize">
                    {fechaActual || 'Cargando...'}
                  </div>
                </div>
              </div>
            </section>

            {/* 2. DOCUMENTOS REQUERIDOS */}
            <section className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-6">
              <h2 className="text-xl sm:text-2xl font-bold text-yellow-400 mb-4 sm:mb-6">📄 Documentos Requeridos</h2>
              <div className="overflow-x-auto -mx-4 sm:mx-0">
                <table className="w-full text-xs sm:text-sm min-w-[700px] sm:min-w-0">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-gray-300 font-semibold">Documento</th>
                      <th className="text-center py-2 sm:py-3 px-2 sm:px-4 text-gray-300 font-semibold">¿Cumple?</th>
                      <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-gray-300 font-semibold">Fecha Vencimiento</th>
                      <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-gray-300 font-semibold">Observaciones</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-300">
                    {[
                      { key: 'soat', label: 'SOAT' },
                      { key: 'revisionTecnica', label: 'Revisión Técnico-Mecánica' },
                      { key: 'poliza', label: 'Póliza Contra Todo Riesgo' },
                      { key: 'licencia', label: 'Licencia de Conducción' }
                    ].map(({ key, label }) => {
                      const cumpleKey = `${key}Cumple` as keyof typeof formData;
                      const cumple = formData[cumpleKey] as boolean | null;
                      const requiereObs = cumple === false;
                      
                      return (
                        <tr key={key} className="border-b border-white/5">
                          <td className="py-3 px-4">{label}</td>
                          <td className="py-3 px-4">
                            <div className="flex justify-center space-x-4">
                              <label className="flex items-center space-x-1 cursor-pointer">
                                <input
                                  type="radio"
                                  name={key}
                                  checked={cumple === true}
                                  onChange={() => handleInputChange(`${key}Cumple`, true)}
                                  className="w-4 h-4 accent-green-500"
                                />
                                <span className="text-green-400 text-xs">Sí</span>
                              </label>
                              <label className="flex items-center space-x-1 cursor-pointer">
                                <input
                                  type="radio"
                                  name={key}
                                  checked={cumple === false}
                                  onChange={() => handleInputChange(`${key}Cumple`, false)}
                                  className="w-4 h-4 accent-red-500"
                                />
                                <span className="text-red-400 text-xs">No</span>
                              </label>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <input
                              type="date"
                              value={(formData as any)[`${key}Vencimiento`] || ''}
                              onChange={(e) => handleInputChange(`${key}Vencimiento`, e.target.value)}
                              className="w-full px-3 py-1 bg-white/5 border border-white/10 rounded text-white text-xs focus:outline-none focus:border-yellow-400"
                            />
                          </td>
                          <td className="py-3 px-4">
                            <input
                              type="text"
                              value={(formData as any)[`${key}Observacion`] || ''}
                              onChange={(e) => handleInputChange(`${key}Observacion`, e.target.value)}
                              className={`w-full px-3 py-1 bg-white/5 border rounded text-white text-xs focus:outline-none ${
                                requiereObs ? 'border-red-400' : 'border-white/10 focus:border-yellow-400'
                              }`}
                              placeholder={requiereObs ? '⚠️ Requerida...' : 'Observaciones...'}
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              
              {/* Categorías de Licencia - Selección Múltiple */}
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-yellow-300 mb-4">Categorías Autorizadas</h3>
                <p className="text-sm text-gray-400 mb-4">Seleccione las categorías de licencia y su fecha de vigencia:</p>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                  {CATEGORIAS_LICENCIA.map((cat) => (
                    <label 
                      key={cat}
                      className={`flex items-center space-x-2 p-3 rounded-lg cursor-pointer transition-all ${
                        categoriasSeleccionadas.includes(cat)
                          ? 'bg-yellow-500/20 border-2 border-yellow-400'
                          : 'bg-white/5 border border-white/10 hover:bg-white/10'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={categoriasSeleccionadas.includes(cat)}
                        onChange={() => handleCategoriaToggle(cat)}
                        className="w-4 h-4 accent-yellow-400"
                      />
                      <span className={`font-semibold ${
                        categoriasSeleccionadas.includes(cat) ? 'text-yellow-400' : 'text-gray-300'
                      }`}>{cat}</span>
                    </label>
                  ))}
                </div>

                {/* Fechas de vigencia para categorías seleccionadas */}
                {categoriasSeleccionadas.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 p-4 bg-white/5 rounded-lg">
                    {categoriasSeleccionadas.map((cat) => (
                      <div key={cat}>
                        <label className="block text-xs text-gray-400 mb-1">Vigencia {cat}</label>
                        <input
                          type="date"
                          value={vigenciasLicencia[cat] || ''}
                          onChange={(e) => handleVigenciaChange(cat, e.target.value)}
                          className="w-full px-3 py-2 bg-white/5 border border-yellow-400/30 rounded-lg text-white text-sm focus:outline-none focus:border-yellow-400"
                        />
                      </div>
                    ))}
                  </div>
                )}
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Placa</label>
                  <input
                    type="text"
                    value={formData.placaVehiculo}
                    onChange={(e) => handleInputChange('placaVehiculo', e.target.value.toUpperCase())}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-yellow-400 transition-colors uppercase"
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
                  <label className="block text-sm font-medium text-gray-300 mb-2">Modelo (Año)</label>
                  <input
                    type="number"
                    value={formData.modeloVehiculo}
                    onChange={(e) => handleInputChange('modeloVehiculo', e.target.value)}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-yellow-400 transition-colors"
                    placeholder="2025"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Color</label>
                  <input
                    type="text"
                    value={formData.colorVehiculo}
                    onChange={(e) => handleInputChange('colorVehiculo', e.target.value)}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-yellow-400 transition-colors"
                    placeholder="Ej: Blanco, Rojo, Negro"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">No. Tarjeta de Propiedad</label>
                  <input
                    type="text"
                    value={formData.tarjetaPropiedad}
                    onChange={(e) => handleInputChange('tarjetaPropiedad', e.target.value)}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-yellow-400 transition-colors"
                    placeholder="Número de tarjeta"
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
                    onChange={(e) => handleInputChange('placaRemolque', e.target.value.toUpperCase())}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-yellow-400 transition-colors uppercase"
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
                <label className="block text-sm font-medium text-gray-300 mb-2">Total de horas (predeterminado: 8)</label>
                <input
                  type="number"
                  value={formData.horasDormir}
                  onChange={(e) => handleInputChange('horasDormir', e.target.value)}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-yellow-400 transition-colors"
                  placeholder="8"
                  min="0"
                  max="24"
                />
              </div>
            </section>

            {/* 7. ÍTEMS DE VERIFICACIÓN */}
            <section className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-6">
              <h2 className="text-xl sm:text-2xl font-bold text-yellow-400 mb-4 sm:mb-6">✅ Ítems de Verificación</h2>
              <p className="text-sm text-gray-400 mb-4">
                <span className="text-red-400">⚠️ Importante:</span> Si un ítem NO cumple, la observación es obligatoria.
              </p>
              
              {/* Condiciones de Seguridad */}
              <div className="mb-6 sm:mb-8">
                <h3 className="text-lg sm:text-xl font-semibold text-yellow-300 mb-3 sm:mb-4">🔒 Condiciones de Seguridad (1-8)</h3>
                <div className="overflow-x-auto -mx-4 sm:mx-0">
                  <table className="w-full text-sm min-w-[600px]">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="text-left py-2 px-3 text-gray-300 w-12">#</th>
                        <th className="text-left py-2 px-3 text-gray-300">Ítem</th>
                        <th className="text-center py-2 px-3 text-gray-300 w-32">¿Cumple?</th>
                        <th className="text-left py-2 px-3 text-gray-300">Observaciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ITEMS_SEGURIDAD.map(renderItemVerificacion)}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Condiciones Generales */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-yellow-300 mb-4">⚙️ Condiciones Generales (9-28)</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm min-w-[600px]">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="text-left py-2 px-3 text-gray-300 w-12">#</th>
                        <th className="text-left py-2 px-3 text-gray-300">Ítem</th>
                        <th className="text-center py-2 px-3 text-gray-300 w-32">¿Cumple?</th>
                        <th className="text-left py-2 px-3 text-gray-300">Observaciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ITEMS_GENERALES.map(renderItemVerificacion)}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Estado Mecánico */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-yellow-300 mb-4">🔧 Estado Mecánico (29-38)</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm min-w-[600px]">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="text-left py-2 px-3 text-gray-300 w-12">#</th>
                        <th className="text-left py-2 px-3 text-gray-300">Ítem</th>
                        <th className="text-center py-2 px-3 text-gray-300 w-32">¿Cumple?</th>
                        <th className="text-left py-2 px-3 text-gray-300">Observaciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ITEMS_MECANICOS.map(renderItemVerificacion)}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Desinfección y Limpieza */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-yellow-300 mb-4">🧼 Desinfección y Limpieza</h3>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 bg-white/5 rounded-lg gap-3">
                  <span className="text-gray-300">¿Se realizó desinfección y limpieza del vehículo?</span>
                  <div className="flex space-x-4">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input 
                        type="radio" 
                        name="desinfeccion" 
                        checked={formData.desinfeccion === true}
                        onChange={() => handleInputChange('desinfeccion', true)}
                        className="w-4 h-4 accent-green-500" 
                      />
                      <span className="text-green-400">Sí</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input 
                        type="radio" 
                        name="desinfeccion" 
                        checked={formData.desinfeccion === false}
                        onChange={() => handleInputChange('desinfeccion', false)}
                        className="w-4 h-4 accent-red-500" 
                      />
                      <span className="text-red-400">No</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Reporte de Descanso */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-yellow-300 mb-4">💤 Reporte de Descanso</h3>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 bg-white/5 rounded-lg gap-3">
                  <span className="text-gray-300">¿Tomó los descansos reglamentarios?</span>
                  <div className="flex space-x-4">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input 
                        type="radio" 
                        name="descanso" 
                        checked={formData.descanso === true}
                        onChange={() => handleInputChange('descanso', true)}
                        className="w-4 h-4 accent-green-500" 
                      />
                      <span className="text-green-400">Sí</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input 
                        type="radio" 
                        name="descanso" 
                        checked={formData.descanso === false}
                        onChange={() => handleInputChange('descanso', false)}
                        className="w-4 h-4 accent-red-500" 
                      />
                      <span className="text-red-400">No</span>
                    </label>
                  </div>
                </div>
              </div>
            </section>

            {/* 8. CONDICIONES DE SALUD DEL CONDUCTOR */}
            <section className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-6">
              <h2 className="text-xl sm:text-2xl font-bold text-yellow-400 mb-4 sm:mb-6">❤️ Estado de Salud del Conductor</h2>
              <div className="space-y-3 sm:space-y-4">
                {[
                  { key: 'tomaMedicacion', question: '¿Está tomando algún medicamento?' },
                  { key: 'ansiedadEstres', question: '¿Presenta ansiedad o estrés?' },
                  { key: 'problemasVisuales', question: '¿Tiene problemas visuales o de audición?' },
                  { key: 'estadoSalud', question: '¿Se encuentra en buen estado de salud para operar?' }
                ].map(({ key, question }, index) => (
                  <div key={key} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 bg-white/5 rounded-lg gap-2 sm:gap-0">
                    <div className="flex items-start flex-1">
                      <span className="text-gray-300 font-mono text-xs sm:text-sm text-yellow-400 mr-2 sm:mr-4 flex-shrink-0">{index + 1}.</span>
                      <span className="text-gray-300 text-sm sm:text-base">{question}</span>
                    </div>
                    <div className="flex space-x-4 ml-6 sm:ml-0">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          name={key}
                          checked={(formData as any)[key] === true}
                          onChange={() => handleInputChange(key, true)}
                          className="w-4 h-4 accent-green-500"
                        />
                        <span className="text-green-400">Sí</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          name={key}
                          checked={(formData as any)[key] === false}
                          onChange={() => handleInputChange(key, false)}
                          className="w-4 h-4 accent-red-500"
                        />
                        <span className="text-red-400">No</span>
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 9. FIRMAS */}
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
                        value={formData.cedulaFirmaConductor}
                        onChange={(e) => handleInputChange('cedulaFirmaConductor', e.target.value)}
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
                        value={formData.cedulaFirmaHSEQ}
                        onChange={(e) => handleInputChange('cedulaFirmaHSEQ', e.target.value)}
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
