'use client';
import { useState, useEffect, useRef } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

// ==========================================
// CONFIGURACIÓN DEL FORMATO
// ==========================================
const INFO_FORMATO = {
  codigo: 'HSEQ-FOR-065',
  version: '001',
  fechaEdicion: '02-06-2025',
  empresa: 'TRANSPORTE Y LOGÍSTICA EQUINOX S.A.S.',
  nit: '901.870.510-5',
  titulo: 'FORMATO DE INSPECCIÓN PREOPERACIONAL DE TRACTOCAMIÓN',
};

// ==========================================
// ITEMS DE INSPECCIÓN
// ==========================================
const ITEMS_SEGURIDAD = [
  { id: 1, nombre: 'Extintor de Incendios (20 libras 2 unidades)' },
  { id: 2, nombre: 'Equipo de Carretera (Triángulos, Conos, Chaleco Reflectante, Linterna, Manila, Gato, Cruceta)' },
  { id: 3, nombre: 'Botiquín de primeros auxilios' },
  { id: 4, nombre: 'Cinturones de seguridad operativos' },
  { id: 5, nombre: 'Bocina (claxon) funcionando correctamente' },
  { id: 6, nombre: 'Luces (altas, bajas, direccionales)' },
  { id: 7, nombre: 'Espejos (laterales) y lente angular en buen estado' },
  { id: 8, nombre: 'Papeles retrovisores sin daños y bien ajustados' },
];

const ITEMS_GENERALES = [
  { id: 9, nombre: 'Señalización adecuada en el tractocamión (reflectivos, calcomanías reglamentarias)' },
  { id: 10, nombre: 'Estado general del Tanque (Sin fugas)' },
  { id: 11, nombre: 'Tanque con tapa en buen estado' },
  { id: 12, nombre: 'Estado y limpieza de la cabina' },
  { id: 13, nombre: 'Estado general de las llantas (desgaste uniforme, presión correcta)' },
  { id: 14, nombre: 'Llanta de repuesto' },
  { id: 15, nombre: 'Estado de los rines y contrapesos (sin deformaciones ni faltantes)' },
  { id: 16, nombre: 'Sistema de frenos (inspección visual: pedal, fugas de aire o hidráulicas)' },
  { id: 17, nombre: 'Freno de estacionamiento (de mano)' },
  { id: 18, nombre: 'Sistema de dirección (sin ruidos, sin holguras)' },
  { id: 19, nombre: 'Estado y funcionamiento del motor (nivel de aceite, fugas de aceite o refrigerante, ruidos anormales)' },
  { id: 20, nombre: 'Nivel de fluidos (aceite, refrigerante, líquido de frenos)' },
  { id: 21, nombre: 'Medición de suspensión y amortiguadores' },
  { id: 22, nombre: 'Estado y funcionamiento de luces (delanteras, traseras, direccionales y de freno)' },
  { id: 23, nombre: 'Ausencia de fugas de fluidos en general' },
  { id: 24, nombre: 'Herramientas básicas y gato hidráulico presentes' },
  { id: 25, nombre: 'Punto de anclaje fijo' },
  { id: 26, nombre: 'Cable de acero' },
  { id: 27, nombre: 'Estado de los espejos' },
  { id: 28, nombre: 'Listado del torque' },
];

const ITEMS_MECANICOS = [
  { id: 29, nombre: 'Caja de cambios' },
  { id: 30, nombre: 'Estado de amortiguadores y resortes (muelles o ballestas)' },
  { id: 31, nombre: 'Revisión de componentes de suspensión (bujes, pernos, terminales)' },
  { id: 32, nombre: 'Nivel y estado del refrigerante' },
  { id: 33, nombre: 'Revisión de fugas en mangueras y sellantes' },
  { id: 34, nombre: 'Funcionamiento de frenos de emergencia y de servicio' },
  { id: 35, nombre: 'Estado de la batería' },
  { id: 36, nombre: 'Lubricación y engrase general' },
  { id: 37, nombre: 'Fugas en el sistema de escape, humo excesivo o color anormal' },
];

const ITEMS_CORREAS = [
  { id: 38, nombre: 'Correas (ventilador, alternador, compresor) sin grietas o desgaste excesivo' },
];

const ITEMS_HIGIENE = [
  { id: 39, nombre: 'Realizar desinfección y limpieza a la cabina del vehículo' },
];

const ITEMS_SALUD = [
  { id: 40, nombre: 'Antes de la jornada laboral tuvo un descanso apropiado para desarrollar su labor de manera segura' },
  { id: 41, nombre: 'Se encuentra bajo algún tratamiento médico y/o ha ingerido algún medicamento' },
  { id: 42, nombre: '¿Presenta algún trastorno de ansiedad o depresión?' },
  { id: 43, nombre: '¿Presenta algún trastorno neurológico o visual? (mareo, vértigo, visión borrosa)' },
  { id: 44, nombre: 'Se encuentra en condiciones de salud apropiadas para trabajar' },
];

const CATEGORIAS_LICENCIA = ['A1', 'A2', 'B1', 'B2', 'B3', 'C1', 'C2', 'C3'];

// ==========================================
// STORAGE KEYS
// ==========================================
const STORAGE_KEY = 'equinox_conductor_datos';
const STORAGE_KEY_VEHICULO = 'equinox_vehiculo_datos';
const STORAGE_KEY_REMOLQUE = 'equinox_remolque_datos';
const STORAGE_KEY_LICENCIA = 'equinox_licencia_datos';
const STORAGE_KEY_DOCUMENTOS = 'equinox_documentos_datos';

interface EstadoItem {
  cumple: boolean | null;
  observacion: string;
}

export default function FormatoInspeccionPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [datosPreCargados, setDatosPreCargados] = useState(false);
  const [fechaActual, setFechaActual] = useState('');

  // Datos del conductor
  const [conductor, setConductor] = useState({
    nombreCompleto: '',
    cedula: '',
    edad: '',
    eps: '',
    arl: '',
    fondoPension: '',
    rh: '',
  });

  // Documentos requeridos
  const [documentos, setDocumentos] = useState({
    soatCumple: null as boolean | null,
    soatVencimiento: '',
    revisionCumple: null as boolean | null,
    revisionVencimiento: '',
    polizaCumple: null as boolean | null,
    polizaVencimiento: '',
    licenciaCumple: null as boolean | null,
  });

  // Categorías de licencia seleccionadas
  const [categoriasSeleccionadas, setCategoriasSeleccionadas] = useState<string[]>([]);
  const [vigenciasLicencia, setVigenciasLicencia] = useState<Record<string, string>>({});

  // Datos del vehículo
  const [vehiculo, setVehiculo] = useState({
    placa: '',
    marca: '',
    linea: '',
    modelo: '',
  });

  // Datos del remolque
  const [remolque, setRemolque] = useState({
    placa: '',
    marca: '',
    clase: '',
    modelo: '',
  });

  // Otros datos
  const [horasDormir, setHorasDormir] = useState('8');
  const [kilometrajeInicial, setKilometrajeInicial] = useState('');
  const [itemsVerificacion, setItemsVerificacion] = useState<Record<number, EstadoItem>>({});

  // Firma
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasFirma, setHasFirma] = useState(false);
  const [firmaConductor, setFirmaConductor] = useState('');

  // ==========================================
  // CARGAR DATOS GUARDADOS DESDE LOCALSTORAGE
  // ==========================================
  useEffect(() => {
    // Establecer fecha actual
    const hoy = new Date();
    const opciones: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    setFechaActual(hoy.toLocaleDateString('es-CO', opciones));

    // Cargar datos del conductor
    const conductorStr = localStorage.getItem(STORAGE_KEY);
    if (conductorStr) {
      try {
        const datos = JSON.parse(conductorStr);
        setConductor(prev => ({ ...prev, ...datos }));
        setDatosPreCargados(true);
      } catch (e) {
        console.error('Error al cargar datos del conductor:', e);
      }
    }

    // Cargar datos del vehículo
    const vehiculoStr = localStorage.getItem(STORAGE_KEY_VEHICULO);
    if (vehiculoStr) {
      try {
        const datos = JSON.parse(vehiculoStr);
        setVehiculo(prev => ({ ...prev, ...datos }));
      } catch (e) {
        console.error('Error al cargar datos del vehículo:', e);
      }
    }

    // Cargar datos del remolque
    const remolqueStr = localStorage.getItem(STORAGE_KEY_REMOLQUE);
    if (remolqueStr) {
      try {
        const datos = JSON.parse(remolqueStr);
        setRemolque(prev => ({ ...prev, ...datos }));
      } catch (e) {
        console.error('Error al cargar datos del remolque:', e);
      }
    }

    // Cargar datos de licencia
    const licenciaStr = localStorage.getItem(STORAGE_KEY_LICENCIA);
    if (licenciaStr) {
      try {
        const datos = JSON.parse(licenciaStr);
        setCategoriasSeleccionadas(datos.categorias || []);
        setVigenciasLicencia(datos.vigencias || {});
      } catch (e) {
        console.error('Error al cargar datos de licencia:', e);
      }
    }

    // Cargar datos de documentos
    const documentosStr = localStorage.getItem(STORAGE_KEY_DOCUMENTOS);
    if (documentosStr) {
      try {
        const datos = JSON.parse(documentosStr);
        setDocumentos(prev => ({
          ...prev,
          soatVencimiento: datos.soatVencimiento || '',
          revisionVencimiento: datos.revisionVencimiento || '',
          polizaVencimiento: datos.polizaVencimiento || '',
        }));
      } catch (e) {
        console.error('Error al cargar datos de documentos:', e);
      }
    }
  }, []);

  // ==========================================
  // GUARDAR DATOS EN LOCALSTORAGE
  // ==========================================
  useEffect(() => {
    if (conductor.nombreCompleto && conductor.cedula) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(conductor));
    }
  }, [conductor]);

  useEffect(() => {
    if (vehiculo.placa) {
      localStorage.setItem(STORAGE_KEY_VEHICULO, JSON.stringify(vehiculo));
    }
  }, [vehiculo]);

  useEffect(() => {
    if (remolque.placa) {
      localStorage.setItem(STORAGE_KEY_REMOLQUE, JSON.stringify(remolque));
    }
  }, [remolque]);

  useEffect(() => {
    if (categoriasSeleccionadas.length > 0) {
      localStorage.setItem(STORAGE_KEY_LICENCIA, JSON.stringify({
        categorias: categoriasSeleccionadas,
        vigencias: vigenciasLicencia,
      }));
    }
  }, [categoriasSeleccionadas, vigenciasLicencia]);

  useEffect(() => {
    if (documentos.soatVencimiento || documentos.revisionVencimiento || documentos.polizaVencimiento) {
      localStorage.setItem(STORAGE_KEY_DOCUMENTOS, JSON.stringify({
        soatVencimiento: documentos.soatVencimiento,
        revisionVencimiento: documentos.revisionVencimiento,
        polizaVencimiento: documentos.polizaVencimiento,
      }));
    }
  }, [documentos.soatVencimiento, documentos.revisionVencimiento, documentos.polizaVencimiento]);

  // ==========================================
  // HANDLERS
  // ==========================================
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

  // ==========================================
  // FUNCIONES PARA EL CANVAS DE FIRMA
  // ==========================================
  const getCanvasContext = () => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
    }
    return ctx;
  };

  const getCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    if ('touches' in e) {
      const touch = e.touches[0];
      return {
        x: (touch.clientX - rect.left) * scaleX,
        y: (touch.clientY - rect.top) * scaleY
      };
    } else {
      return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY
      };
    }
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const ctx = getCanvasContext();
    if (!ctx) return;
    
    setIsDrawing(true);
    const { x, y } = getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (!isDrawing) return;
    
    const ctx = getCanvasContext();
    if (!ctx) return;
    
    const { x, y } = getCoordinates(e);
    ctx.lineTo(x, y);
    ctx.stroke();
    setHasFirma(true);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas && hasFirma) {
      const dataUrl = canvas.toDataURL('image/png');
      setFirmaConductor(dataUrl);
    }
  };

  const limpiarFirma = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    setHasFirma(false);
    setFirmaConductor('');
  };

  // ==========================================
  // VALIDACIÓN Y ENVÍO
  // ==========================================
  const validarFormulario = (): boolean => {
    if (!conductor.nombreCompleto || !conductor.cedula) {
      alert('Por favor complete los datos del conductor (nombre y cédula son obligatorios)');
      return false;
    }
    if (!vehiculo.placa) {
      alert('La placa del vehículo es obligatoria');
      return false;
    }
    if (!hasFirma || !firmaConductor) {
      alert('Debe firmar el formulario antes de enviarlo');
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
      // Estructura de datos para el nuevo API de inspección vehicular
      const dataToSend = {
        conductor: {
          cedula: conductor.cedula,
          nombre: conductor.nombreCompleto,
          edad: conductor.edad,
          eps: conductor.eps,
          arl: conductor.arl,
          fondoPension: conductor.fondoPension,
          rh: conductor.rh,
        },
        vehiculo: {
          placa: vehiculo.placa,
          marca: vehiculo.marca,
          linea: vehiculo.linea,
          modelo: vehiculo.modelo,
        },
        remolque: {
          placa: remolque.placa,
          marca: remolque.marca,
          clase: remolque.clase,
          modelo: remolque.modelo,
        },
        documentos: {
          soat: {
            cumple: documentos.soatCumple,
            vencimiento: documentos.soatVencimiento,
          },
          rtm: {
            cumple: documentos.revisionCumple,
            vencimiento: documentos.revisionVencimiento,
          },
          poliza: {
            cumple: documentos.polizaCumple,
            vencimiento: documentos.polizaVencimiento,
          },
          licencia: {
            cumple: documentos.licenciaCumple,
            categorias: categoriasSeleccionadas,
            vigencias: vigenciasLicencia,
          },
        },
        condiciones: {
          horasDormir: parseInt(horasDormir) || 0,
          kilometrajeInicial: parseInt(kilometrajeInicial) || 0,
        },
        itemsVerificacion,
        firma: firmaConductor,
        observacionesGenerales: '',
      };

      const response = await fetch('/api/inspeccion-vehicular', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || result.details || 'Error al guardar la inspección');
      }

      alert(`✅ Inspección registrada correctamente\n\nCódigo: ${result.data?.codigoInspeccion || 'Generado'}\n\n📊 Cumplimiento: ${result.data?.porcentajeCumplimiento || 0}%\n✓ Items OK: ${result.data?.totalCumple || 0}\n✗ Items con observación: ${result.data?.totalNoCumple || 0}`);
      
      // Limpiar formulario
      setItemsVerificacion({});
      setKilometrajeInicial('');
      limpiarFirma();
    } catch (error) {
      console.error('Error al guardar:', error);
      alert(`❌ ${error instanceof Error ? error.message : 'Error al guardar la inspección. Intente nuevamente.'}`);
    } finally {
      setIsLoading(false);
    }
  };

  // ==========================================
  // RENDER DE ITEMS
  // ==========================================
  const renderItemVerificacion = (item: { id: number; nombre: string }) => {
    const estado = itemsVerificacion[item.id] || { cumple: null, observacion: '' };
    const requiereObservacion = estado.cumple === false;
    
    return (
      <div key={item.id} className="p-3 sm:p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors">
        <div className="flex items-start gap-3">
          <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-yellow-500/20 text-yellow-400 font-mono text-sm font-bold rounded-lg">
            {item.id}
          </span>
          <div className="flex-1 min-w-0">
            <p className="text-gray-200 text-sm leading-relaxed mb-3">{item.nombre}</p>
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-4 bg-slate-800/50 rounded-lg px-3 py-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="radio" 
                    name={`item-${item.id}`} 
                    checked={estado.cumple === true} 
                    onChange={() => handleItemChange(item.id, 'cumple', true)} 
                    className="w-5 h-5 accent-green-500" 
                  />
                  <span className="text-green-400 text-sm font-medium">Sí</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="radio" 
                    name={`item-${item.id}`} 
                    checked={estado.cumple === false} 
                    onChange={() => handleItemChange(item.id, 'cumple', false)} 
                    className="w-5 h-5 accent-red-500" 
                  />
                  <span className="text-red-400 text-sm font-medium">No</span>
                </label>
              </div>
              <input
                type="text"
                value={estado.observacion || ''}
                onChange={(e) => handleItemChange(item.id, 'observacion', e.target.value)}
                className={`flex-1 min-w-[150px] sm:min-w-[200px] px-3 py-2 bg-white/5 border rounded-lg text-white text-sm focus:outline-none transition-colors ${
                  requiereObservacion 
                    ? 'border-red-400/70 focus:border-red-500 bg-red-500/10' 
                    : 'border-white/10 focus:border-yellow-400'
                }`}
                placeholder={requiereObservacion ? '⚠️ Observación requerida...' : 'Observación (opcional)...'}
                required={requiereObservacion}
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderSeccionItems = (titulo: string, icono: string, items: { id: number; nombre: string }[]) => (
    <section className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-6">
      <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-yellow-400 mb-4 sm:mb-6 flex items-center gap-2">
        <span>{icono}</span>
        <span>{titulo}</span>
        <span className="ml-auto text-xs font-normal text-gray-500">{items.length} items</span>
      </h2>
      <div className="space-y-2 sm:space-y-3">
        {items.map(item => renderItemVerificacion(item))}
      </div>
    </section>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black">
      <Navbar />
      <main className="pt-24 sm:pt-32 md:pt-40 pb-8 sm:pb-16 px-3 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-7xl">
          
          {/* Header */}
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl md:rounded-3xl p-3 sm:p-6 md:p-8 mb-4 sm:mb-6 md:mb-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 mb-3 sm:mb-4">
              <div className="text-center sm:text-left">
                <p className="text-gray-400 text-xs sm:text-sm">{INFO_FORMATO.empresa}</p>
                <p className="text-gray-500 text-xs">NIT: {INFO_FORMATO.nit}</p>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <span className="bg-white/10 px-2 py-1 rounded">{INFO_FORMATO.codigo}</span>
                <span className="bg-white/10 px-2 py-1 rounded">V.{INFO_FORMATO.version}</span>
              </div>
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-center bg-gradient-to-r from-yellow-400 to-yellow-300 bg-clip-text text-transparent mb-1 sm:mb-2 md:mb-4 leading-tight">
              {INFO_FORMATO.titulo}
            </h1>
            <p className="text-center text-gray-300 text-xs sm:text-sm md:text-base capitalize">{fechaActual || 'Cargando fecha...'}</p>
            
            {datosPreCargados && (
              <div className="mt-4 flex items-center justify-center gap-2 text-green-400 text-sm">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Datos precargados desde el dispositivo</span>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
            
            {/* 1. DATOS DEL CONDUCTOR */}
            <section className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-6">
              <h2 className="text-xl sm:text-2xl font-bold text-yellow-400 mb-4 sm:mb-6 flex items-center gap-2">
                <span>👤</span>
                <span>Datos del Conductor</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs sm:text-sm font-medium text-gray-400 mb-1">Nombre Completo <span className="text-red-400">*</span></label>
                  <input 
                    type="text" 
                    value={conductor.nombreCompleto} 
                    onChange={(e) => setConductor(prev => ({ ...prev, nombreCompleto: e.target.value }))} 
                    className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-yellow-400 transition-colors" 
                    placeholder="Nombre completo del conductor" 
                    required 
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-400 mb-1">Cédula <span className="text-red-400">*</span></label>
                  <input 
                    type="text" 
                    inputMode="numeric"
                    value={conductor.cedula} 
                    onChange={(e) => setConductor(prev => ({ ...prev, cedula: e.target.value }))} 
                    className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-yellow-400 transition-colors" 
                    placeholder="Número de cédula" 
                    required 
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-400 mb-1">Edad</label>
                  <input 
                    type="number" 
                    value={conductor.edad} 
                    onChange={(e) => setConductor(prev => ({ ...prev, edad: e.target.value }))} 
                    className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-yellow-400 transition-colors" 
                    placeholder="Años" 
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-400 mb-1">EPS</label>
                  <input 
                    type="text" 
                    value={conductor.eps} 
                    onChange={(e) => setConductor(prev => ({ ...prev, eps: e.target.value }))} 
                    className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-yellow-400 transition-colors" 
                    placeholder="EPS" 
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-400 mb-1">ARL</label>
                  <input 
                    type="text" 
                    value={conductor.arl} 
                    onChange={(e) => setConductor(prev => ({ ...prev, arl: e.target.value }))} 
                    className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-yellow-400 transition-colors" 
                    placeholder="ARL" 
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-400 mb-1">Fondo de Pensión</label>
                  <input 
                    type="text" 
                    value={conductor.fondoPension} 
                    onChange={(e) => setConductor(prev => ({ ...prev, fondoPension: e.target.value }))} 
                    className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-yellow-400 transition-colors" 
                    placeholder="Fondo de pensión" 
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-400 mb-1">RH</label>
                  <select 
                    value={conductor.rh} 
                    onChange={(e) => setConductor(prev => ({ ...prev, rh: e.target.value }))} 
                    className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-yellow-400 transition-colors"
                  >
                    <option value="" className="bg-slate-800">Seleccionar</option>
                    <option value="O+" className="bg-slate-800">O+</option>
                    <option value="O-" className="bg-slate-800">O-</option>
                    <option value="A+" className="bg-slate-800">A+</option>
                    <option value="A-" className="bg-slate-800">A-</option>
                    <option value="B+" className="bg-slate-800">B+</option>
                    <option value="B-" className="bg-slate-800">B-</option>
                    <option value="AB+" className="bg-slate-800">AB+</option>
                    <option value="AB-" className="bg-slate-800">AB-</option>
                  </select>
                </div>
              </div>
            </section>

            {/* 2. DOCUMENTOS REQUERIDOS */}
            <section className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-6">
              <h2 className="text-xl sm:text-2xl font-bold text-yellow-400 mb-4 sm:mb-6 flex items-center gap-2">
                <span>📄</span>
                <span>Documentos Requeridos</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* SOAT */}
                <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-gray-200 font-medium">Seguro Obligatorio (SOAT)</span>
                    <div className="flex items-center gap-3">
                      <label className="flex items-center gap-1 cursor-pointer">
                        <input 
                          type="radio" 
                          name="soat" 
                          checked={documentos.soatCumple === true} 
                          onChange={() => setDocumentos(prev => ({ ...prev, soatCumple: true }))} 
                          className="w-4 h-4 accent-green-500" 
                        />
                        <span className="text-green-400 text-sm">Sí</span>
                      </label>
                      <label className="flex items-center gap-1 cursor-pointer">
                        <input 
                          type="radio" 
                          name="soat" 
                          checked={documentos.soatCumple === false} 
                          onChange={() => setDocumentos(prev => ({ ...prev, soatCumple: false }))} 
                          className="w-4 h-4 accent-red-500" 
                        />
                        <span className="text-red-400 text-sm">No</span>
                      </label>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Fecha de Vencimiento</label>
                    <input 
                      type="date" 
                      value={documentos.soatVencimiento} 
                      onChange={(e) => setDocumentos(prev => ({ ...prev, soatVencimiento: e.target.value }))} 
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-yellow-400" 
                    />
                  </div>
                </div>

                {/* Revisión Técnico Mecánica */}
                <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-gray-200 font-medium">Revisión Técnico Mecánica</span>
                    <div className="flex items-center gap-3">
                      <label className="flex items-center gap-1 cursor-pointer">
                        <input 
                          type="radio" 
                          name="revision" 
                          checked={documentos.revisionCumple === true} 
                          onChange={() => setDocumentos(prev => ({ ...prev, revisionCumple: true }))} 
                          className="w-4 h-4 accent-green-500" 
                        />
                        <span className="text-green-400 text-sm">Sí</span>
                      </label>
                      <label className="flex items-center gap-1 cursor-pointer">
                        <input 
                          type="radio" 
                          name="revision" 
                          checked={documentos.revisionCumple === false} 
                          onChange={() => setDocumentos(prev => ({ ...prev, revisionCumple: false }))} 
                          className="w-4 h-4 accent-red-500" 
                        />
                        <span className="text-red-400 text-sm">No</span>
                      </label>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Fecha de Vencimiento</label>
                    <input 
                      type="date" 
                      value={documentos.revisionVencimiento} 
                      onChange={(e) => setDocumentos(prev => ({ ...prev, revisionVencimiento: e.target.value }))} 
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-yellow-400" 
                    />
                  </div>
                </div>

                {/* Póliza contra todo riesgo */}
                <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-gray-200 font-medium">Póliza contra Todo Riesgo</span>
                    <div className="flex items-center gap-3">
                      <label className="flex items-center gap-1 cursor-pointer">
                        <input 
                          type="radio" 
                          name="poliza" 
                          checked={documentos.polizaCumple === true} 
                          onChange={() => setDocumentos(prev => ({ ...prev, polizaCumple: true }))} 
                          className="w-4 h-4 accent-green-500" 
                        />
                        <span className="text-green-400 text-sm">Sí</span>
                      </label>
                      <label className="flex items-center gap-1 cursor-pointer">
                        <input 
                          type="radio" 
                          name="poliza" 
                          checked={documentos.polizaCumple === false} 
                          onChange={() => setDocumentos(prev => ({ ...prev, polizaCumple: false }))} 
                          className="w-4 h-4 accent-red-500" 
                        />
                        <span className="text-red-400 text-sm">No</span>
                      </label>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Fecha de Vencimiento</label>
                    <input 
                      type="date" 
                      value={documentos.polizaVencimiento} 
                      onChange={(e) => setDocumentos(prev => ({ ...prev, polizaVencimiento: e.target.value }))} 
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-yellow-400" 
                    />
                  </div>
                </div>

                {/* Licencia de Conducción */}
                <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-gray-200 font-medium">Licencia de Conducción</span>
                    <div className="flex items-center gap-3">
                      <label className="flex items-center gap-1 cursor-pointer">
                        <input 
                          type="radio" 
                          name="licencia" 
                          checked={documentos.licenciaCumple === true} 
                          onChange={() => setDocumentos(prev => ({ ...prev, licenciaCumple: true }))} 
                          className="w-4 h-4 accent-green-500" 
                        />
                        <span className="text-green-400 text-sm">Sí</span>
                      </label>
                      <label className="flex items-center gap-1 cursor-pointer">
                        <input 
                          type="radio" 
                          name="licencia" 
                          checked={documentos.licenciaCumple === false} 
                          onChange={() => setDocumentos(prev => ({ ...prev, licenciaCumple: false }))} 
                          className="w-4 h-4 accent-red-500" 
                        />
                        <span className="text-red-400 text-sm">No</span>
                      </label>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-2">Categorías Autorizadas</label>
                    <div className="flex flex-wrap gap-2">
                      {CATEGORIAS_LICENCIA.map(cat => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => handleCategoriaToggle(cat)}
                          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                            categoriasSeleccionadas.includes(cat)
                              ? 'bg-yellow-500 text-black'
                              : 'bg-white/10 text-gray-300 hover:bg-white/20'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                    {categoriasSeleccionadas.length > 0 && (
                      <div className="mt-3 space-y-2">
                        {categoriasSeleccionadas.map(cat => (
                          <div key={cat} className="flex items-center gap-2">
                            <span className="text-xs text-gray-400 w-12">{cat}:</span>
                            <input 
                              type="date" 
                              value={vigenciasLicencia[cat] || ''} 
                              onChange={(e) => handleVigenciaChange(cat, e.target.value)} 
                              className="flex-1 px-2 py-1 bg-white/5 border border-white/10 rounded text-white text-xs focus:outline-none focus:border-yellow-400" 
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* 3. DATOS DEL VEHÍCULO */}
            <section className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-6">
              <h2 className="text-xl sm:text-2xl font-bold text-yellow-400 mb-4 sm:mb-6 flex items-center gap-2">
                <span>🚛</span>
                <span>Datos del Vehículo</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-400 mb-1">Placa <span className="text-red-400">*</span></label>
                  <input 
                    type="text" 
                    value={vehiculo.placa} 
                    onChange={(e) => setVehiculo(prev => ({ ...prev, placa: e.target.value.toUpperCase() }))} 
                    className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm uppercase focus:outline-none focus:border-yellow-400 transition-colors" 
                    placeholder="ABC123" 
                    required 
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-400 mb-1">Marca</label>
                  <input 
                    type="text" 
                    value={vehiculo.marca} 
                    onChange={(e) => setVehiculo(prev => ({ ...prev, marca: e.target.value }))} 
                    className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-yellow-400 transition-colors" 
                    placeholder="Kenworth, Freightliner..." 
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-400 mb-1">Línea</label>
                  <input 
                    type="text" 
                    value={vehiculo.linea} 
                    onChange={(e) => setVehiculo(prev => ({ ...prev, linea: e.target.value }))} 
                    className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-yellow-400 transition-colors" 
                    placeholder="T800, Cascadia..." 
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-400 mb-1">Modelo (Año)</label>
                  <input 
                    type="text" 
                    value={vehiculo.modelo} 
                    onChange={(e) => setVehiculo(prev => ({ ...prev, modelo: e.target.value }))} 
                    className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-yellow-400 transition-colors" 
                    placeholder="2024" 
                  />
                </div>
              </div>
            </section>

            {/* 4. DATOS DEL REMOLQUE */}
            <section className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-6">
              <h2 className="text-xl sm:text-2xl font-bold text-yellow-400 mb-4 sm:mb-6 flex items-center gap-2">
                <span>🚚</span>
                <span>Datos del Remolque o Semirremolque</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-400 mb-1">Placa</label>
                  <input 
                    type="text" 
                    value={remolque.placa} 
                    onChange={(e) => setRemolque(prev => ({ ...prev, placa: e.target.value.toUpperCase() }))} 
                    className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm uppercase focus:outline-none focus:border-yellow-400 transition-colors" 
                    placeholder="R12345" 
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-400 mb-1">Marca</label>
                  <input 
                    type="text" 
                    value={remolque.marca} 
                    onChange={(e) => setRemolque(prev => ({ ...prev, marca: e.target.value }))} 
                    className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-yellow-400 transition-colors" 
                    placeholder="Marca del remolque" 
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-400 mb-1">Clase</label>
                  <input 
                    type="text" 
                    value={remolque.clase} 
                    onChange={(e) => setRemolque(prev => ({ ...prev, clase: e.target.value }))} 
                    className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-yellow-400 transition-colors" 
                    placeholder="Tipo de remolque" 
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-400 mb-1">Modelo (Año)</label>
                  <input 
                    type="text" 
                    value={remolque.modelo} 
                    onChange={(e) => setRemolque(prev => ({ ...prev, modelo: e.target.value }))} 
                    className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-yellow-400 transition-colors" 
                    placeholder="2024" 
                  />
                </div>
              </div>
            </section>

            {/* 5. CONDICIONES GENERALES */}
            <section className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-6">
              <h2 className="text-xl sm:text-2xl font-bold text-yellow-400 mb-4 sm:mb-6 flex items-center gap-2">
                <span>⚙️</span>
                <span>Condiciones de Operación</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-400 mb-1">Horas Dedicadas a Dormir</label>
                  <input 
                    type="number" 
                    value={horasDormir} 
                    onChange={(e) => setHorasDormir(e.target.value)} 
                    className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-yellow-400 transition-colors" 
                    placeholder="8" 
                    min="0" 
                    max="24" 
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-400 mb-1">Kilometraje Inicial</label>
                  <input 
                    type="number" 
                    value={kilometrajeInicial} 
                    onChange={(e) => setKilometrajeInicial(e.target.value)} 
                    className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-yellow-400 transition-colors" 
                    placeholder="150000" 
                  />
                </div>
              </div>
            </section>

            {/* SECCIONES DE ITEMS DE VERIFICACIÓN */}
            {renderSeccionItems('Condiciones de Seguridad', '🛡️', ITEMS_SEGURIDAD)}
            {renderSeccionItems('Condiciones Generales', '🔧', ITEMS_GENERALES)}
            {renderSeccionItems('Estado Mecánico', '⚙️', ITEMS_MECANICOS)}
            {renderSeccionItems('Correas (Transmisión)', '🔗', ITEMS_CORREAS)}
            {renderSeccionItems('Higiene (Limpieza)', '🧹', ITEMS_HIGIENE)}
            {renderSeccionItems('Reporte de Condiciones de Salud', '🏥', ITEMS_SALUD)}

            {/* FIRMA DEL CONDUCTOR */}
            <section className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-6">
              <h2 className="text-xl sm:text-2xl font-bold text-yellow-400 mb-4 sm:mb-6 flex items-center gap-2">
                <span>✍️</span>
                <span>Firma del Conductor</span>
              </h2>
              <div className="max-w-md mx-auto">
                <div className="border-2 border-dashed border-white/20 rounded-xl p-4 bg-white">
                  <canvas
                    ref={canvasRef}
                    width={400}
                    height={150}
                    className="w-full border border-gray-200 rounded-lg cursor-crosshair touch-none"
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                  />
                </div>
                <div className="mt-3 flex justify-center gap-3">
                  <button
                    type="button"
                    onClick={limpiarFirma}
                    className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg text-sm font-medium hover:bg-red-500/30 transition-colors"
                  >
                    Limpiar Firma
                  </button>
                </div>
                {hasFirma && (
                  <p className="text-center text-green-400 text-sm mt-2">✓ Firma capturada</p>
                )}
              </div>
            </section>

            {/* BOTÓN DE ENVÍO */}
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
                type="submit"
                disabled={isLoading}
                className="px-8 py-4 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-bold text-lg rounded-xl hover:shadow-lg hover:shadow-yellow-500/30 hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Enviando...
                  </span>
                ) : (
                  '📤 Enviar Inspección'
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
