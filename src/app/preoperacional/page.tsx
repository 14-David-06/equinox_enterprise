'use client';
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

// ==========================================
// CONFIGURACIÓN DEL FORMATO
// ==========================================
const INFO_FORMATO = {
  codigo: 'HSEQ-FOR-065',
  version: '002',
  fechaEdicion: '02-06-2025',
  empresa: 'TRANSPORTE Y LOGÍSTICA EQUINOX S.A.S.',
  nit: '901.870.510-5',
  titulo: 'FORMATO DE INSPECCIÓN PREOPERACIONAL DE TRACTOCAMIÓN',
};

// ==========================================
// ITEMS DE INSPECCIÓN SEGÚN LA IMAGEN
// ==========================================

const ITEMS_SEGURIDAD = [
  { id: 1, nombre: 'Extintor de incendios (20 libras 2 unidades)' },
  { id: 2, nombre: 'Equipo de Carretera (Triángulos, Conos, Chaleco Reflectante, Linterna, Manila, Gato, Cruceta)' },
  { id: 3, nombre: 'Botiquín de primeros auxilios' },
  { id: 4, nombre: 'Cinturones de seguridad operativos' },
  { id: 5, nombre: 'Bocina (claxon) funcionando correctamente' },
  { id: 6, nombre: 'Luces (altas, bajas, direccionales)' },
  { id: 7, nombre: 'Espejos (laterales) y lente angular en buen estado' },
  { id: 8, nombre: 'Kit de derrames' },
];

// ==========================================
// DATOS DEL GPS
// ==========================================

interface DatosGPS {
  nombreGPS: string;
  usuario: string;
  contrasena: string;
  autorizacionMonitoreo: boolean;
}

const ITEMS_GENERALES = [
  { id: 9, nombre: 'Papeles retrovisores ajustados y bien orientados' },
  { id: 10, nombre: 'Señalización adecuada en el tractocamión (reflectivos, calcomanías reglamentarias)' },
  { id: 11, nombre: 'Estado general del Tanque (Sin fugas)' },
  { id: 12, nombre: 'Tanque con tapa en buen estado' },
  { id: 13, nombre: 'Estado y limpieza de la cabina' },
  { id: 14, nombre: 'Silla del conductor en buen estado' },
  { id: 15, nombre: 'Estado general de los llantas (desgaste uniforme, presión correcta)' },
  { id: 16, nombre: 'Llanta de repuesto' },
  { id: 17, nombre: 'Estado de los rines y contrapesos (sin deformaciones ni faltantes)' },
  { id: 18, nombre: 'Sistema de frenos (inspección visual: pedal, fugas de aire o hidráulicas)' },
  { id: 19, nombre: 'Freno de estacionamiento (de mano)' },
  { id: 20, nombre: 'Sistema de dirección (sin ruidos anormales ni holguras)' },
  { id: 21, nombre: 'Estado y funcionamiento del motor (nivel de aceite, fugas de aceite o refrigerante, ruidos anormales)' },
  { id: 22, nombre: 'Nivel de fluidos (aceite, refrigerante, líquido de frenos)' },
  { id: 23, nombre: 'Medición de suspensión y amortiguadores' },
  { id: 24, nombre: 'Estado y funcionamiento de luces (delanteras, traseras, direccionales y de freno)' },
  { id: 25, nombre: 'Ausencia de fugas de fluidos en general' },
  { id: 26, nombre: 'Herramientas básicas y gato hidráulico presentes' },
  { id: 27, nombre: 'Punto de anclaje fijo' },
  { id: 28, nombre: 'Cable de acero' },
  { id: 29, nombre: 'Estado de los espejos' },
  { id: 30, nombre: 'Listado del torque' },
];

const ITEMS_MECANICOS = [
  { id: 31, nombre: 'Caja de cambios' },
  { id: 32, nombre: 'Estado de amortiguadores y resortes (muelles o ballestas)' },
  { id: 33, nombre: 'Revisión de componentes de suspensión (bujes, pernos, terminales)' },
  { id: 34, nombre: 'Nivel y estado del refrigerante' },
  { id: 35, nombre: 'Revisión de fugas en mangueras y sellantes' },
  { id: 36, nombre: 'Funcionamiento de frenos de emergencia y de servicio' },
  { id: 37, nombre: 'Estado de la batería' },
  { id: 38, nombre: 'Lubricación y engrase general' },
  { id: 39, nombre: 'Fugas en el sistema de escape, humo excesivo o color anormal' },
];

const ITEMS_CORREAS = [
  { id: 40, nombre: 'Correas (ventilador, alternador, compresor) sin grietas o desgaste excesivo' },
];

const ITEMS_HIGIENE = [
  { id: 41, nombre: 'Realizar desinfección y limpieza a la cabina del vehículo' },
];

const ITEMS_SALUD = [
  { id: 42, nombre: 'Antes de la jornada laboral tuvo un descanso apropiado para desarrollar su labor de manera segura' },
  { id: 43, nombre: 'Se encuentra bajo algún tratamiento médico y/o ha ingerido algún medicamento' },
  { id: 44, nombre: '¿Presenta algún trastorno de ansiedad o depresión?' },
  { id: 45, nombre: '¿Presenta algún trastorno neurológico o visual? (mareo, vértigo, visión borrosa)' },
  { id: 46, nombre: 'Se encuentra en condiciones de salud apropiadas para trabajar' },
];

const CATEGORIAS_LICENCIA = ['A1', 'A2', 'B1', 'B2', 'B3', 'C1', 'C2', 'C3'];

interface EstadoItem {
  cumple: boolean | null;
  observacion: string;
}

const STORAGE_KEY = 'equinox_conductor_datos';

export default function PreoperacionalPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [fechaActual, setFechaActual] = useState('');
  const [datosGuardados, setDatosGuardados] = useState(false);

  const [conductor, setConductor] = useState({
    nombreCompleto: '',
    cedula: '',
    telefono: '',
    email: '',
    edad: '',
    eps: '',
    arl: '',
    fondoPension: '',
    rh: '',
  });

  const [documentos, setDocumentos] = useState({
    soatCumple: null as boolean | null,
    soatVencimiento: '',
    revisionCumple: null as boolean | null,
    revisionVencimiento: '',
    polizaCumple: null as boolean | null,
    polizaVencimiento: '',
    licenciaCumple: null as boolean | null,
  });

  const [categoriasSeleccionadas, setCategoriasSeleccionadas] = useState<string[]>([]);
  const [vigenciasLicencia, setVigenciasLicencia] = useState<Record<string, string>>({});

  const [vehiculo, setVehiculo] = useState({
    placa: '',
    marca: '',
    linea: '',
    modelo: '',
    color: '',
    tarjetaPropiedad: '',
  });

  const [remolque, setRemolque] = useState({
    placa: '',
    marca: '',
    clase: '',
    modelo: '',
  });

  const [horasDormir, setHorasDormir] = useState('8');
  const [kilometrajeInicial, setKilometrajeInicial] = useState('');
  const [itemsVerificacion, setItemsVerificacion] = useState<Record<number, EstadoItem>>({});
  const [firmaConductor, setFirmaConductor] = useState('');
  const [aceptoPoliticas, setAceptoPoliticas] = useState(false);
  const [aceptoCookies, setAceptoCookies] = useState(false);

  const [datosGPS, setDatosGPS] = useState<DatosGPS>({
    nombreGPS: '',
    usuario: '',
    contrasena: '',
    autorizacionMonitoreo: false,
  });

  useEffect(() => {
    const datosGuardadosStr = localStorage.getItem(STORAGE_KEY);
    if (datosGuardadosStr) {
      try {
        const datos = JSON.parse(datosGuardadosStr);
        setConductor(datos);
        setDatosGuardados(true);
      } catch (e) {
        console.error('Error al cargar datos del conductor:', e);
      }
    }
  }, []);

  useEffect(() => {
    if (conductor.nombreCompleto && conductor.cedula) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(conductor));
      setDatosGuardados(true);
    }
  }, [conductor]);

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

  const handleItemChange = (itemId: number, field: 'cumple' | 'observacion', value: boolean | string) => {
    setItemsVerificacion(prev => ({
      ...prev,
      [itemId]: {
        cumple: prev[itemId]?.cumple ?? null,
        observacion: prev[itemId]?.observacion ?? '',
        [field]: value,
        ...(field === 'cumple' && value === true ? { observacion: '' } : {}),
      }
    }));
  };

  const handleCategoriaToggle = (categoria: string) => {
    setCategoriasSeleccionadas(prev => {
      if (prev.includes(categoria)) {
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

  const validarFormulario = (): boolean => {
    if (!conductor.nombreCompleto || !conductor.cedula) {
      alert('Por favor complete los datos del conductor (nombre y cédula son obligatorios)');
      return false;
    }
    if (!conductor.telefono) {
      alert('El número de teléfono del conductor es obligatorio');
      return false;
    }
    if (!conductor.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(conductor.email)) {
      alert('Por favor ingrese un correo electrónico válido');
      return false;
    }
    if (!vehiculo.placa) {
      alert('La placa del vehículo es obligatoria');
      return false;
    }
    if (!datosGPS.autorizacionMonitoreo) {
      alert('Debe autorizar el uso de los datos del GPS para monitoreo del servicio');
      return false;
    }
    if (!aceptoPoliticas) {
      alert('Debe aceptar la política de tratamiento de datos personales');
      return false;
    }
    if (!aceptoCookies) {
      alert('Debe aceptar el uso de cookies');
      return false;
    }
    const todosLosItems = [...ITEMS_SEGURIDAD, ...ITEMS_GENERALES, ...ITEMS_MECANICOS, ...ITEMS_CORREAS, ...ITEMS_HIGIENE, ...ITEMS_SALUD];
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
    if (!validarFormulario()) return;
    setIsLoading(true);
    try {
      const dataToSend = {
        tipoFormulario: 'PREOPERACIONAL',
        fecha: new Date().toISOString(),
        infoFormato: INFO_FORMATO,
        conductor,
        documentos: { ...documentos, categoriasLicencia: categoriasSeleccionadas, vigenciasLicencia },
        vehiculo,
        remolque,
        horasDormir,
        kilometrajeInicial,
        datosGPS,
        itemsVerificacion,
        firmaConductor,
        aceptoPoliticas,
        aceptoCookies,
      };

      const response = await fetch('/api/preoperacional', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Error al guardar la inspección');
      }

      alert(`✅ Inspección pre-operacional registrada correctamente\n\nCódigo: ${result.data?.codigoInspeccion || 'Generado'}`);
      
      // Limpiar formulario (excepto datos del conductor que se guardan en localStorage)
      setDocumentos({ soatCumple: null, soatVencimiento: '', revisionCumple: null, revisionVencimiento: '', polizaCumple: null, polizaVencimiento: '', licenciaCumple: null });
      setVehiculo({ placa: '', marca: '', linea: '', modelo: '', color: '', tarjetaPropiedad: '' });
      setRemolque({ placa: '', marca: '', clase: '', modelo: '' });
      setHorasDormir('8');
      setKilometrajeInicial('');
      setItemsVerificacion({});
      setFirmaConductor('');
      setCategoriasSeleccionadas([]);
      setVigenciasLicencia({});
      setAceptoPoliticas(false);
      setAceptoCookies(false);
      setDatosGPS({
        nombreGPS: '',
        usuario: '',
        contrasena: '',
        autorizacionMonitoreo: false,
      });
    } catch (error) {
      console.error('Error al guardar:', error);
      alert(`❌ ${error instanceof Error ? error.message : 'Error al guardar la inspección. Intente nuevamente.'}`);
    } finally {
      setIsLoading(false);
    }
  };

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
              <input type="radio" name={`item-${item.id}`} checked={estado.cumple === true} onChange={() => handleItemChange(item.id, 'cumple', true)} className="w-4 h-4 accent-green-500" />
              <span className="text-green-400 text-xs">Sí</span>
            </label>
            <label className="flex items-center space-x-1 cursor-pointer">
              <input type="radio" name={`item-${item.id}`} checked={estado.cumple === false} onChange={() => handleItemChange(item.id, 'cumple', false)} className="w-4 h-4 accent-red-500" />
              <span className="text-red-400 text-xs">No</span>
            </label>
          </div>
        </td>
        <td className="py-3 px-3">
          <input
            type="text"
            value={estado.observacion || ''}
            onChange={(e) => handleItemChange(item.id, 'observacion', e.target.value)}
            className={`w-full px-3 py-1 bg-white/5 border rounded text-white text-xs focus:outline-none transition-colors ${requiereObservacion ? 'border-red-400 focus:border-red-500' : 'border-white/10 focus:border-yellow-400'}`}
            placeholder={requiereObservacion ? '⚠️ Observación requerida...' : 'Observaciones...'}
            required={requiereObservacion}
          />
        </td>
      </tr>
    );
  };

  const renderSeccionItems = (titulo: string, icono: string, items: { id: number; nombre: string }[]) => (
    <section className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-6">
      <h2 className="text-xl sm:text-2xl font-bold text-yellow-400 mb-4 sm:mb-6">{icono} {titulo}</h2>
      <div className="overflow-x-auto -mx-4 sm:mx-0">
        <table className="w-full text-xs sm:text-sm min-w-[700px] sm:min-w-0">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-gray-300 font-semibold w-12">#</th>
              <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-gray-300 font-semibold">Descripción</th>
              <th className="text-center py-2 sm:py-3 px-2 sm:px-4 text-gray-300 font-semibold w-24">¿Cumple?</th>
              <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-gray-300 font-semibold w-48">Observaciones</th>
            </tr>
          </thead>
          <tbody>{items.map(item => renderItemVerificacion(item))}</tbody>
        </table>
      </div>
    </section>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black">
      <Navbar />
      <main className="pt-40 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-7xl">
          {/* Header */}
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 mb-6 sm:mb-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-4">
              <div className="text-center md:text-left">
                <p className="text-gray-400 text-sm">{INFO_FORMATO.empresa}</p>
                <p className="text-gray-500 text-xs">NIT: {INFO_FORMATO.nit}</p>
              </div>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-center bg-gradient-to-r from-yellow-400 to-yellow-300 bg-clip-text text-transparent mb-2 sm:mb-4">
              {INFO_FORMATO.titulo}
            </h1>
            <p className="text-center text-gray-300 text-sm sm:text-base md:text-lg">Control Diario del Vehículo - Tractocamión</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
            {/* 1. INFORMACIÓN DEL FORMATO */}
            <section className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-6">
              <h2 className="text-xl sm:text-2xl font-bold text-yellow-400 mb-4 sm:mb-6">📋 Información del Formato</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-400 mb-1">Código</label>
                  <div className="px-3 sm:px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white font-semibold">{INFO_FORMATO.codigo}</div>
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-400 mb-1">Versión</label>
                  <div className="px-3 sm:px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white font-semibold">{INFO_FORMATO.version}</div>
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-400 mb-1">Fecha de Edición</label>
                  <div className="px-3 sm:px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white font-semibold">{INFO_FORMATO.fechaEdicion}</div>
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-400 mb-1">Fecha de Inspección</label>
                  <div className="px-3 sm:px-4 py-2 bg-yellow-500/20 border border-yellow-400/30 rounded-lg text-yellow-300 font-semibold capitalize">{fechaActual || 'Cargando...'}</div>
                </div>
              </div>
            </section>

            {/* 2. DATOS DEL CONDUCTOR */}
            <section className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-yellow-400">👤 Datos del Conductor / Operador</h2>
                {datosGuardados && <span className="text-xs text-green-400 bg-green-500/20 px-3 py-1 rounded-full">✓ Datos guardados</span>}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs sm:text-sm font-medium text-gray-400 mb-1">Nombre Completo <span className="text-red-400">*</span></label>
                  <input type="text" value={conductor.nombreCompleto} onChange={(e) => setConductor(prev => ({ ...prev, nombreCompleto: e.target.value }))} className="w-full px-3 sm:px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-yellow-400 transition-colors" placeholder="Nombre completo del conductor" required />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-400 mb-1">Cédula <span className="text-red-400">*</span></label>
                  <input type="text" value={conductor.cedula} onChange={(e) => setConductor(prev => ({ ...prev, cedula: e.target.value }))} className="w-full px-3 sm:px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-yellow-400 transition-colors" placeholder="Número de cédula" required />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-400 mb-1">Teléfono <span className="text-red-400">*</span></label>
                  <input type="tel" value={conductor.telefono} onChange={(e) => setConductor(prev => ({ ...prev, telefono: e.target.value }))} className="w-full px-3 sm:px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-yellow-400 transition-colors" placeholder="Ej: 3001234567" required />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs sm:text-sm font-medium text-gray-400 mb-1">Correo Electrónico <span className="text-red-400">*</span></label>
                  <input type="email" value={conductor.email} onChange={(e) => setConductor(prev => ({ ...prev, email: e.target.value }))} className="w-full px-3 sm:px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-yellow-400 transition-colors" placeholder="correo@ejemplo.com" required />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-400 mb-1">Edad</label>
                  <input type="number" value={conductor.edad} onChange={(e) => setConductor(prev => ({ ...prev, edad: e.target.value }))} className="w-full px-3 sm:px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-yellow-400 transition-colors" placeholder="Años" />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-400 mb-1">RH</label>
                  <input type="text" value={conductor.rh} onChange={(e) => setConductor(prev => ({ ...prev, rh: e.target.value }))} className="w-full px-3 sm:px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-yellow-400 transition-colors" placeholder="Tipo de sangre" />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-400 mb-1">EPS</label>
                  <input type="text" value={conductor.eps} onChange={(e) => setConductor(prev => ({ ...prev, eps: e.target.value }))} className="w-full px-3 sm:px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-yellow-400 transition-colors" placeholder="EPS" />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-400 mb-1">ARL</label>
                  <input type="text" value={conductor.arl} onChange={(e) => setConductor(prev => ({ ...prev, arl: e.target.value }))} className="w-full px-3 sm:px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-yellow-400 transition-colors" placeholder="ARL" />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-400 mb-1">Fondo de Pensión</label>
                  <input type="text" value={conductor.fondoPension} onChange={(e) => setConductor(prev => ({ ...prev, fondoPension: e.target.value }))} className="w-full px-3 sm:px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-yellow-400 transition-colors" placeholder="Fondo de pensión" />
                </div>
              </div>
            </section>

            {/* 3. DOCUMENTOS REQUERIDOS */}
            <section className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-6">
              <h2 className="text-xl sm:text-2xl font-bold text-yellow-400 mb-4 sm:mb-6">📄 Documentos Requeridos</h2>
              <div className="overflow-x-auto -mx-4 sm:mx-0">
                <table className="w-full text-xs sm:text-sm min-w-[600px] sm:min-w-0">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-gray-300 font-semibold">Documento</th>
                      <th className="text-center py-2 sm:py-3 px-2 sm:px-4 text-gray-300 font-semibold">¿Vigente?</th>
                      <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-gray-300 font-semibold">Fecha Vencimiento</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-300">
                    <tr className="border-b border-white/5">
                      <td className="py-3 px-4">Seguro Obligatorio (SOAT)</td>
                      <td className="py-3 px-4">
                        <div className="flex justify-center space-x-4">
                          <label className="flex items-center space-x-1 cursor-pointer">
                            <input type="radio" name="soat" checked={documentos.soatCumple === true} onChange={() => setDocumentos(prev => ({ ...prev, soatCumple: true }))} className="w-4 h-4 accent-green-500" />
                            <span className="text-green-400 text-xs">Sí</span>
                          </label>
                          <label className="flex items-center space-x-1 cursor-pointer">
                            <input type="radio" name="soat" checked={documentos.soatCumple === false} onChange={() => setDocumentos(prev => ({ ...prev, soatCumple: false }))} className="w-4 h-4 accent-red-500" />
                            <span className="text-red-400 text-xs">No</span>
                          </label>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <input type="date" value={documentos.soatVencimiento} onChange={(e) => setDocumentos(prev => ({ ...prev, soatVencimiento: e.target.value }))} className="w-full px-3 py-1 bg-white/5 border border-white/10 rounded text-white text-xs focus:outline-none focus:border-yellow-400" />
                      </td>
                    </tr>
                    <tr className="border-b border-white/5">
                      <td className="py-3 px-4">Revisión Técnico Mecánica</td>
                      <td className="py-3 px-4">
                        <div className="flex justify-center space-x-4">
                          <label className="flex items-center space-x-1 cursor-pointer">
                            <input type="radio" name="revision" checked={documentos.revisionCumple === true} onChange={() => setDocumentos(prev => ({ ...prev, revisionCumple: true }))} className="w-4 h-4 accent-green-500" />
                            <span className="text-green-400 text-xs">Sí</span>
                          </label>
                          <label className="flex items-center space-x-1 cursor-pointer">
                            <input type="radio" name="revision" checked={documentos.revisionCumple === false} onChange={() => setDocumentos(prev => ({ ...prev, revisionCumple: false }))} className="w-4 h-4 accent-red-500" />
                            <span className="text-red-400 text-xs">No</span>
                          </label>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <input type="date" value={documentos.revisionVencimiento} onChange={(e) => setDocumentos(prev => ({ ...prev, revisionVencimiento: e.target.value }))} className="w-full px-3 py-1 bg-white/5 border border-white/10 rounded text-white text-xs focus:outline-none focus:border-yellow-400" />
                      </td>
                    </tr>
                    <tr className="border-b border-white/5">
                      <td className="py-3 px-4">Póliza Contra Todo Riesgo</td>
                      <td className="py-3 px-4">
                        <div className="flex justify-center space-x-4">
                          <label className="flex items-center space-x-1 cursor-pointer">
                            <input type="radio" name="poliza" checked={documentos.polizaCumple === true} onChange={() => setDocumentos(prev => ({ ...prev, polizaCumple: true }))} className="w-4 h-4 accent-green-500" />
                            <span className="text-green-400 text-xs">Sí</span>
                          </label>
                          <label className="flex items-center space-x-1 cursor-pointer">
                            <input type="radio" name="poliza" checked={documentos.polizaCumple === false} onChange={() => setDocumentos(prev => ({ ...prev, polizaCumple: false }))} className="w-4 h-4 accent-red-500" />
                            <span className="text-red-400 text-xs">No</span>
                          </label>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <input type="date" value={documentos.polizaVencimiento} onChange={(e) => setDocumentos(prev => ({ ...prev, polizaVencimiento: e.target.value }))} className="w-full px-3 py-1 bg-white/5 border border-white/10 rounded text-white text-xs focus:outline-none focus:border-yellow-400" />
                      </td>
                    </tr>
                    <tr className="border-b border-white/5">
                      <td className="py-3 px-4">Licencia de Conducción</td>
                      <td className="py-3 px-4">
                        <div className="flex justify-center space-x-4">
                          <label className="flex items-center space-x-1 cursor-pointer">
                            <input type="radio" name="licencia" checked={documentos.licenciaCumple === true} onChange={() => setDocumentos(prev => ({ ...prev, licenciaCumple: true }))} className="w-4 h-4 accent-green-500" />
                            <span className="text-green-400 text-xs">Sí</span>
                          </label>
                          <label className="flex items-center space-x-1 cursor-pointer">
                            <input type="radio" name="licencia" checked={documentos.licenciaCumple === false} onChange={() => setDocumentos(prev => ({ ...prev, licenciaCumple: false }))} className="w-4 h-4 accent-red-500" />
                            <span className="text-red-400 text-xs">No</span>
                          </label>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-500 text-xs italic">Ver categorías abajo</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              {/* Categorías de licencia */}
              <div className="mt-6 pt-4 border-t border-white/10">
                <label className="block text-sm font-medium text-gray-300 mb-3">Categorías de Licencia Autorizadas</label>
                <div className="flex flex-wrap gap-2 mb-4">
                  {CATEGORIAS_LICENCIA.map(cat => (
                    <button key={cat} type="button" onClick={() => handleCategoriaToggle(cat)} className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${categoriasSeleccionadas.includes(cat) ? 'bg-yellow-500 text-black' : 'bg-white/10 text-gray-300 hover:bg-white/20'}`}>
                      {cat}
                    </button>
                  ))}
                </div>
                {categoriasSeleccionadas.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-yellow-500/10 border border-yellow-400/20 rounded-xl">
                    {categoriasSeleccionadas.map(cat => (
                      <div key={cat}>
                        <label className="text-xs text-gray-400 block mb-1">Vencimiento {cat}</label>
                        <input type="date" value={vigenciasLicencia[cat] || ''} onChange={(e) => handleVigenciaChange(cat, e.target.value)} className="w-full px-3 py-1 bg-white/5 border border-white/10 rounded text-white text-xs focus:outline-none focus:border-yellow-400" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>

            {/* 4. DATOS DEL VEHÍCULO */}
            <section className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-6">
              <h2 className="text-xl sm:text-2xl font-bold text-yellow-400 mb-4 sm:mb-6">🚚 Datos del Vehículo</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-400 mb-1">Placa <span className="text-red-400">*</span></label>
                  <input type="text" value={vehiculo.placa} onChange={(e) => setVehiculo(prev => ({ ...prev, placa: e.target.value.toUpperCase() }))} className="w-full px-3 sm:px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white uppercase focus:outline-none focus:border-yellow-400 transition-colors" placeholder="ABC123" maxLength={6} required />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-400 mb-1">No. Tarjeta de Propiedad</label>
                  <input type="text" value={vehiculo.tarjetaPropiedad} onChange={(e) => setVehiculo(prev => ({ ...prev, tarjetaPropiedad: e.target.value.toUpperCase() }))} className="w-full px-3 sm:px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white uppercase focus:outline-none focus:border-yellow-400 transition-colors" placeholder="Número de tarjeta" />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-400 mb-1">Marca</label>
                  <input type="text" value={vehiculo.marca} onChange={(e) => setVehiculo(prev => ({ ...prev, marca: e.target.value }))} className="w-full px-3 sm:px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-yellow-400 transition-colors" placeholder="Kenworth" />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-400 mb-1">Línea</label>
                  <input type="text" value={vehiculo.linea} onChange={(e) => setVehiculo(prev => ({ ...prev, linea: e.target.value }))} className="w-full px-3 sm:px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-yellow-400 transition-colors" placeholder="T800" />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-400 mb-1">Modelo</label>
                  <input type="text" value={vehiculo.modelo} onChange={(e) => setVehiculo(prev => ({ ...prev, modelo: e.target.value }))} className="w-full px-3 sm:px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-yellow-400 transition-colors" placeholder="2024" />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-400 mb-1">Color</label>
                  <input type="text" value={vehiculo.color} onChange={(e) => setVehiculo(prev => ({ ...prev, color: e.target.value }))} className="w-full px-3 sm:px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-yellow-400 transition-colors" placeholder="Blanco" />
                </div>
              </div>
            </section>

            {/* 5. DATOS DEL REMOLQUE */}
            <section className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-6">
              <h2 className="text-xl sm:text-2xl font-bold text-yellow-400 mb-4 sm:mb-6">🚛 Datos del Remolque o Semirremolque</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-400 mb-1">Placa</label>
                  <input type="text" value={remolque.placa} onChange={(e) => setRemolque(prev => ({ ...prev, placa: e.target.value.toUpperCase() }))} className="w-full px-3 sm:px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white uppercase focus:outline-none focus:border-yellow-400 transition-colors" placeholder="R12345" />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-400 mb-1">Marca</label>
                  <input type="text" value={remolque.marca} onChange={(e) => setRemolque(prev => ({ ...prev, marca: e.target.value }))} className="w-full px-3 sm:px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-yellow-400 transition-colors" />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-400 mb-1">Clase</label>
                  <input type="text" value={remolque.clase} onChange={(e) => setRemolque(prev => ({ ...prev, clase: e.target.value }))} className="w-full px-3 sm:px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-yellow-400 transition-colors" placeholder="Semirremolque" />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-400 mb-1">Modelo</label>
                  <input type="text" value={remolque.modelo} onChange={(e) => setRemolque(prev => ({ ...prev, modelo: e.target.value }))} className="w-full px-3 sm:px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-yellow-400 transition-colors" placeholder="2024" />
                </div>
              </div>
            </section>

            {/* 6. DATOS DEL GPS */}
            <section className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-6">
              <h2 className="text-xl sm:text-2xl font-bold text-yellow-400 mb-4 sm:mb-6">📍 Datos del GPS</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-400 mb-1">Nombre del GPS</label>
                  <input type="text" value={datosGPS.nombreGPS} onChange={(e) => setDatosGPS(prev => ({ ...prev, nombreGPS: e.target.value }))} className="w-full px-3 sm:px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-yellow-400 transition-colors" placeholder="Ej: GPS Modelo X" />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-400 mb-1">Usuario</label>
                  <input type="text" value={datosGPS.usuario} onChange={(e) => setDatosGPS(prev => ({ ...prev, usuario: e.target.value }))} className="w-full px-3 sm:px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-yellow-400 transition-colors" placeholder="Usuario del GPS" />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-400 mb-1">Contraseña</label>
                  <input type="password" value={datosGPS.contrasena} onChange={(e) => setDatosGPS(prev => ({ ...prev, contrasena: e.target.value }))} className="w-full px-3 sm:px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-yellow-400 transition-colors" placeholder="Contraseña del GPS" />
                </div>
              </div>
              <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-400/20 rounded-xl">
                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={datosGPS.autorizacionMonitoreo}
                    onChange={(e) => setDatosGPS(prev => ({ ...prev, autorizacionMonitoreo: e.target.checked }))}
                    className="w-4 h-4 mt-1 accent-yellow-500"
                    required
                  />
                  <div className="text-sm text-gray-300">
                    <span className="font-medium text-yellow-400">Autorización de Monitoreo:</span> Al marcar esta casilla, autorizo el uso de los datos proporcionados del GPS para el monitoreo y seguimiento del servicio por parte de TRANSPORTE Y LOGÍSTICA EQUINOX S.A.S. <span className="text-red-400">*</span>
                  </div>
                </label>
              </div>
            </section>

            {/* 7. HORAS DE DESCANSO Y KILOMETRAJE */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <section className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-6">
                <h2 className="text-xl sm:text-2xl font-bold text-yellow-400 mb-4 sm:mb-6">😴 Horas Dedicadas a Dormir</h2>
                <input type="number" value={horasDormir} onChange={(e) => setHorasDormir(e.target.value)} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-center text-3xl font-bold focus:outline-none focus:border-yellow-400 transition-colors" min="0" max="24" />
                <p className="text-center text-gray-500 mt-2 text-sm">Horas de descanso antes del turno</p>
              </section>
              <section className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-6">
                <h2 className="text-xl sm:text-2xl font-bold text-yellow-400 mb-4 sm:mb-6">📊 Kilometraje Inicial</h2>
                <input type="number" value={kilometrajeInicial} onChange={(e) => setKilometrajeInicial(e.target.value)} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-center text-3xl font-bold focus:outline-none focus:border-yellow-400 transition-colors" placeholder="0" />
                <p className="text-center text-gray-500 mt-2 text-sm">Kilometraje del odómetro al inicio</p>
              </section>
            </div>

            {/* SECCIONES DE ITEMS */}
            {renderSeccionItems('Condiciones de Seguridad', '🛡️', ITEMS_SEGURIDAD)}
            {renderSeccionItems('Condiciones Generales', '⚙️', ITEMS_GENERALES)}
            {renderSeccionItems('Estado Mecánico', '🔧', ITEMS_MECANICOS)}
            {renderSeccionItems('Correas (Ventilador, Alternador)', '🔗', ITEMS_CORREAS)}
            {renderSeccionItems('Higiene - Desinfección Cabina', '🧹', ITEMS_HIGIENE)}
            {renderSeccionItems('Reporte de Condiciones de Salud', '❤️', ITEMS_SALUD)}

            {/* FIRMA DEL CONDUCTOR */}
            <section className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-6">
              <h2 className="text-xl sm:text-2xl font-bold text-yellow-400 mb-4 sm:mb-6">✍️ Firma del Conductor</h2>
              <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                <p className="text-gray-400 mb-4 text-sm">Al firmar, certifico que toda la información proporcionada es veraz y que he realizado la inspección pre-operacional del vehículo antes de iniciar la jornada.</p>
                <input type="text" value={firmaConductor} onChange={(e) => setFirmaConductor(e.target.value)} placeholder="Escriba su nombre completo como firma" className="w-full px-4 py-3 bg-white/5 border-2 border-dashed border-white/20 rounded-xl text-white text-center text-lg italic focus:outline-none focus:border-yellow-400 transition-colors" />
                {conductor.nombreCompleto && firmaConductor !== conductor.nombreCompleto && (
                  <button type="button" onClick={() => setFirmaConductor(conductor.nombreCompleto)} className="mt-3 text-sm text-yellow-400 hover:text-yellow-300 transition-colors">
                    📝 Usar mi nombre: {conductor.nombreCompleto}
                  </button>
                )}
              </div>
            </section>

            {/* POLÍTICAS DE PRIVACIDAD Y COOKIES */}
            <section className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-6">
              <h2 className="text-xl sm:text-2xl font-bold text-yellow-400 mb-4 sm:mb-6">📋 Términos y Condiciones</h2>
              <div className="space-y-4">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={aceptoPoliticas}
                    onChange={(e) => setAceptoPoliticas(e.target.checked)}
                    className="mt-1 w-5 h-5 rounded border-white/20 bg-white/5 text-yellow-400 focus:ring-yellow-400 focus:ring-offset-0 cursor-pointer"
                  />
                  <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
                    <span className="text-red-400">*</span> He leído y acepto la{' '}
                    <a href="/legal/politica-privacidad" target="_blank" className="text-yellow-400 hover:text-yellow-300 underline">
                      Política de Privacidad
                    </a>{' '}
                    y el{' '}
                    <a href="/legal/tratamiento-datos" target="_blank" className="text-yellow-400 hover:text-yellow-300 underline">
                      Tratamiento de Datos Personales
                    </a>
                    . Autorizo el uso de mis datos para los fines descritos.
                  </span>
                </label>
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={aceptoCookies}
                    onChange={(e) => setAceptoCookies(e.target.checked)}
                    className="mt-1 w-5 h-5 rounded border-white/20 bg-white/5 text-yellow-400 focus:ring-yellow-400 focus:ring-offset-0 cursor-pointer"
                  />
                  <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
                    <span className="text-red-400">*</span> Acepto el uso de{' '}
                    <a href="/legal/politica-cookies" target="_blank" className="text-yellow-400 hover:text-yellow-300 underline">
                      cookies
                    </a>{' '}
                    para mejorar mi experiencia y almacenar mis preferencias de forma local.
                  </span>
                </label>
              </div>
            </section>

            {/* BOTÓN DE ENVÍO */}
            <div className="flex justify-center">
              <button type="submit" disabled={isLoading} className={`px-12 py-4 rounded-2xl text-xl font-bold shadow-xl transition-all ${isLoading ? 'bg-gray-600 cursor-not-allowed text-gray-400' : 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-black hover:shadow-yellow-500/30 hover:shadow-2xl hover:scale-105'}`}>
                {isLoading ? (
                  <span className="flex items-center gap-3">
                    <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>
                    Guardando...
                  </span>
                ) : '📤 Enviar Inspección Pre-operacional'}
              </button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
