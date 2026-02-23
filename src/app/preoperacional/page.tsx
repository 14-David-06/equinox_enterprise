'use client';
import { useState, useEffect, useRef } from 'react';
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
const STORAGE_KEY_GPS = 'equinox_gps_datos';
const STORAGE_KEY_VEHICULO = 'equinox_vehiculo_datos';
const STORAGE_KEY_REMOLQUE = 'equinox_remolque_datos';
const STORAGE_KEY_LICENCIA = 'equinox_licencia_datos';
const STORAGE_KEY_DOCUMENTOS = 'equinox_documentos_datos';

export default function PreoperacionalPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [fechaActual, setFechaActual] = useState('');
  const [datosGuardados, setDatosGuardados] = useState(false);
  
  // Estado para validación de cédula
  const [cedulaValidacion, setCedulaValidacion] = useState<{
    checking: boolean;
    exists: boolean | null;
    message: string;
    emailConflict: boolean;
    emailMessage: string;
  }>({ checking: false, exists: null, message: '', emailConflict: false, emailMessage: '' });

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

  // Estados para campos "Otra" personalizados
  const [epsOtra, setEpsOtra] = useState('');
  const [arlOtra, setArlOtra] = useState('');
  const [fondoPensionOtra, setFondoPensionOtra] = useState('');

  // Refs y estados para el canvas de firma
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasFirma, setHasFirma] = useState(false);

  const [datosGPS, setDatosGPS] = useState<DatosGPS>({
    nombreGPS: '',
    usuario: '',
    contrasena: '',
    autorizacionMonitoreo: false,
  });

  // ==========================================
  // FUNCIÓN AUTO-FILL PARA DESARROLLO
  // ==========================================
  const autoFillFormulario = () => {
    // Datos del conductor
    setConductor({
      nombreCompleto: 'Juan Carlos Pérez García',
      cedula: '1234567890',
      telefono: '3001234567',
      email: 'juanperez@test.com',
      edad: '35',
      eps: 'Sura',
      arl: 'Sura',
      fondoPension: 'Porvenir',
      rh: 'O+',
    });

    // Documentos
    const fechaVencimiento = new Date();
    fechaVencimiento.setFullYear(fechaVencimiento.getFullYear() + 1);
    const fechaVencimientoStr = fechaVencimiento.toISOString().split('T')[0];

    setDocumentos({
      soatCumple: true,
      soatVencimiento: fechaVencimientoStr,
      revisionCumple: true,
      revisionVencimiento: fechaVencimientoStr,
      polizaCumple: true,
      polizaVencimiento: fechaVencimientoStr,
      licenciaCumple: true,
    });

    // Categorías de licencia
    setCategoriasSeleccionadas(['C2', 'C3']);
    setVigenciasLicencia({
      'C2': fechaVencimientoStr,
      'C3': fechaVencimientoStr,
    });

    // Vehículo
    setVehiculo({
      placa: 'ABC123',
      marca: 'Kenworth',
      linea: 'T800',
      modelo: '2024',
      color: 'Blanco',
      tarjetaPropiedad: '123456789',
    });

    // Remolque
    setRemolque({
      placa: 'R12345',
      marca: 'Fontaine',
      clase: 'Remolque',
      modelo: '2023',
    });

    // Condiciones
    setHorasDormir('8');
    setKilometrajeInicial('150000');

    // Datos GPS
    setDatosGPS({
      nombreGPS: 'GPS Tracker Pro',
      usuario: 'user_gps_001',
      contrasena: 'gps12345',
      autorizacionMonitoreo: true,
    });

    // Items de verificación - todos cumplen
    const todosLosItems = [...ITEMS_SEGURIDAD, ...ITEMS_GENERALES, ...ITEMS_MECANICOS, ...ITEMS_CORREAS, ...ITEMS_HIGIENE, ...ITEMS_SALUD];
    const itemsAutoFill: Record<number, EstadoItem> = {};
    todosLosItems.forEach(item => {
      itemsAutoFill[item.id] = { cumple: true, observacion: '' };
    });
    setItemsVerificacion(itemsAutoFill);

    // Aceptaciones
    setAceptoPoliticas(true);
    setAceptoCookies(true);

    alert('✅ Formulario llenado automáticamente.\n\n⚠️ Solo falta firmar el formulario para enviarlo.');
  };

  // ==========================================
  // FUNCIÓN PARA VERIFICAR CÉDULA
  // ==========================================
  const verificarCedula = async (cedula: string, email?: string) => {
    // Limpiar caracteres no numéricos
    const cedulaLimpia = cedula.replace(/\D/g, '');
    
    // No verificar si la cédula es muy corta
    if (cedulaLimpia.length < 5) {
      setCedulaValidacion({ checking: false, exists: null, message: '', emailConflict: false, emailMessage: '' });
      return;
    }

    setCedulaValidacion({ checking: true, exists: null, message: 'Verificando...', emailConflict: false, emailMessage: '' });

    try {
      const response = await fetch('/api/preoperacional/check-cedula', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cedula: cedulaLimpia, email: email || conductor.email }),
      });

      const data = await response.json();

      if (response.ok) {
        setCedulaValidacion({
          checking: false,
          exists: data.exists,
          message: data.message,
          emailConflict: data.emailConflict || false,
          emailMessage: data.emailMessage || '',
        });
      } else {
        setCedulaValidacion({
          checking: false,
          exists: null,
          message: 'Error al verificar',
          emailConflict: false,
          emailMessage: '',
        });
      }
    } catch (error) {
      console.error('Error verificando cédula:', error);
      setCedulaValidacion({
        checking: false,
        exists: null,
        message: 'Error de conexión',
        emailConflict: false,
        emailMessage: '',
      });
    }
  };

  // ==========================================
  // FUNCIÓN PARA LIMPIAR DATOS GUARDADOS
  // ==========================================
  const limpiarDatosGuardados = () => {
    if (confirm('¿Está seguro de eliminar todos los datos guardados?\n\nEsto borrará:\n- Datos del conductor\n- Datos del GPS\n- Datos del vehículo\n- Datos del remolque\n- Datos de licencia\n- Vencimientos de documentos')) {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(STORAGE_KEY_GPS);
      localStorage.removeItem(STORAGE_KEY_VEHICULO);
      localStorage.removeItem(STORAGE_KEY_REMOLQUE);
      localStorage.removeItem(STORAGE_KEY_LICENCIA);
      localStorage.removeItem(STORAGE_KEY_DOCUMENTOS);
      
      // Resetear estados
      setConductor({ nombreCompleto: '', cedula: '', telefono: '', email: '', edad: '', eps: '', arl: '', fondoPension: '', rh: '' });
      setDatosGPS({ nombreGPS: '', usuario: '', contrasena: '', autorizacionMonitoreo: false });
      setVehiculo({ placa: '', marca: '', linea: '', modelo: '', color: '', tarjetaPropiedad: '' });
      setRemolque({ placa: '', marca: '', clase: '', modelo: '' });
      setCategoriasSeleccionadas([]);
      setVigenciasLicencia({});
      setDocumentos({ soatCumple: null, soatVencimiento: '', revisionCumple: null, revisionVencimiento: '', polizaCumple: null, polizaVencimiento: '', licenciaCumple: null });
      setDatosGuardados(false);
      
      alert('✅ Datos eliminados correctamente');
    }
  };

  // Verificar qué datos están guardados
  const tieneDatosGuardados = {
    conductor: Boolean(conductor.nombreCompleto && conductor.cedula),
    gps: Boolean(datosGPS.nombreGPS || datosGPS.usuario),
    vehiculo: Boolean(vehiculo.placa),
    remolque: Boolean(remolque.placa),
    licencia: categoriasSeleccionadas.length > 0,
    documentos: Boolean(documentos.soatVencimiento || documentos.revisionVencimiento || documentos.polizaVencimiento),
  };
  
  const cantidadDatosGuardados = Object.values(tieneDatosGuardados).filter(Boolean).length;


  // ==========================================
  // CARGAR DATOS GUARDADOS DESDE LOCALSTORAGE
  // ==========================================
  useEffect(() => {
    // Cargar datos del conductor
    const conductorStr = localStorage.getItem(STORAGE_KEY);
    if (conductorStr) {
      try {
        const datos = JSON.parse(conductorStr);
        setConductor(datos);
        setDatosGuardados(true);
      } catch (e) {
        console.error('Error al cargar datos del conductor:', e);
      }
    }

    // Cargar datos del GPS
    const gpsStr = localStorage.getItem(STORAGE_KEY_GPS);
    if (gpsStr) {
      try {
        setDatosGPS(JSON.parse(gpsStr));
      } catch (e) {
        console.error('Error al cargar datos del GPS:', e);
      }
    }

    // Cargar datos del vehículo
    const vehiculoStr = localStorage.getItem(STORAGE_KEY_VEHICULO);
    if (vehiculoStr) {
      try {
        setVehiculo(JSON.parse(vehiculoStr));
      } catch (e) {
        console.error('Error al cargar datos del vehículo:', e);
      }
    }

    // Cargar datos del remolque
    const remolqueStr = localStorage.getItem(STORAGE_KEY_REMOLQUE);
    if (remolqueStr) {
      try {
        setRemolque(JSON.parse(remolqueStr));
      } catch (e) {
        console.error('Error al cargar datos del remolque:', e);
      }
    }

    // Cargar datos de licencia
    const licenciaStr = localStorage.getItem(STORAGE_KEY_LICENCIA);
    if (licenciaStr) {
      try {
        const licencia = JSON.parse(licenciaStr);
        setCategoriasSeleccionadas(licencia.categorias || []);
        setVigenciasLicencia(licencia.vigencias || {});
      } catch (e) {
        console.error('Error al cargar datos de licencia:', e);
      }
    }

    // Cargar datos de documentos (vencimientos)
    const documentosStr = localStorage.getItem(STORAGE_KEY_DOCUMENTOS);
    if (documentosStr) {
      try {
        const docs = JSON.parse(documentosStr);
        setDocumentos(prev => ({
          ...prev,
          soatVencimiento: docs.soatVencimiento || '',
          revisionVencimiento: docs.revisionVencimiento || '',
          polizaVencimiento: docs.polizaVencimiento || '',
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
      setDatosGuardados(true);
    }
  }, [conductor]);

  useEffect(() => {
    if (datosGPS.nombreGPS || datosGPS.usuario) {
      localStorage.setItem(STORAGE_KEY_GPS, JSON.stringify(datosGPS));
    }
  }, [datosGPS]);

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
    
    // Guardar la firma como base64
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
    // Validar conflicto de email (mismo email con diferente cédula)
    if (cedulaValidacion.emailConflict) {
      alert('El correo electrónico ya está registrado con otra cédula. Por favor verifica los datos.');
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
    if (!hasFirma || !firmaConductor) {
      alert('Debe firmar el formulario antes de enviarlo');
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
    const itemsSaludConObservacionPositiva = [43, 44, 45]; // Items donde "Sí" requiere observación
    for (const item of todosLosItems) {
      const estado = itemsVerificacion[item.id];
      const esItemSalud = itemsSaludConObservacionPositiva.includes(item.id);
      
      // Para items de salud (43, 44, 45): si responde "Sí" (cumple = true), requiere observación
      // Para otros items: si responde "No" (cumple = false), requiere observación
      const requiereObservacion = esItemSalud 
        ? estado?.cumple === true 
        : estado?.cumple === false;
      
      if (requiereObservacion && (!estado?.observacion || estado.observacion.trim() === '')) {
        const mensajeItem = esItemSalud 
          ? `Ha indicado "Sí" en "${item.nombre}". Por favor explique en la observación.`
          : `El item "${item.nombre}" no cumple. Debe agregar una observación.`;
        alert(mensajeItem);
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
      limpiarFirma();
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
    // Items 43, 44, 45 son preguntas de salud donde "Sí" indica un problema
    // Para estos items, la observación es requerida cuando responden "Sí" (cumple === true)
    // Para el resto, la observación es requerida cuando responden "No" (cumple === false)
    const esItemSalud = [43, 44, 45].includes(item.id);
    const requiereObservacion = esItemSalud 
      ? estado.cumple === true  // Sí = tiene problema, requiere explicación
      : estado.cumple === false; // No cumple, requiere observación
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
                className={`flex-1 min-w-[150px] sm:min-w-[200px] px-3 py-2 bg-white/5 border rounded-lg text-white text-sm focus:outline-none transition-colors ${requiereObservacion ? 'border-red-400/70 focus:border-red-500 bg-red-500/10' : 'border-white/10 focus:border-yellow-400'}`}
                placeholder={requiereObservacion ? '⚠️ Requerida...' : 'Observación...'}
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
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-center bg-gradient-to-r from-yellow-400 to-yellow-300 bg-clip-text text-transparent mb-1 sm:mb-2 md:mb-4 leading-tight">
              {INFO_FORMATO.titulo}
            </h1>
            <p className="text-center text-gray-300 text-xs sm:text-sm md:text-base">Control Diario del Vehículo - Tractocamión</p>
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
            <section className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-yellow-400">👤 Datos del Conductor</h2>
                {datosGuardados && <span className="text-xs text-green-400 bg-green-500/20 px-2 sm:px-3 py-1 rounded-full">✓ Guardados</span>}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs sm:text-sm font-medium text-gray-400 mb-1">Nombre Completo <span className="text-red-400">*</span></label>
                  <input type="text" value={conductor.nombreCompleto} onChange={(e) => setConductor(prev => ({ ...prev, nombreCompleto: e.target.value }))} className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-yellow-400 transition-colors" placeholder="Nombre completo" required />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-400 mb-1">
                    <span className="flex flex-wrap items-center gap-1">
                      Cédula <span className="text-red-400">*</span>
                      {cedulaValidacion.checking && <span className="text-yellow-400 text-xs">⏳</span>}
                      {cedulaValidacion.exists === true && !cedulaValidacion.emailConflict && <span className="text-blue-400 text-xs">✓ Existente</span>}
                      {cedulaValidacion.exists === false && !cedulaValidacion.emailConflict && <span className="text-green-400 text-xs">✓ Nuevo</span>}
                    </span>
                  </label>
                  <input 
                    type="text" 
                    inputMode="numeric"
                    value={conductor.cedula} 
                    onChange={(e) => {
                      setConductor(prev => ({ ...prev, cedula: e.target.value }));
                      setCedulaValidacion({ checking: false, exists: null, message: '', emailConflict: false, emailMessage: '' });
                    }}
                    onBlur={(e) => verificarCedula(e.target.value)}
                    className={`w-full px-3 py-2.5 bg-white/5 border rounded-lg text-white text-sm focus:outline-none transition-colors ${
                      cedulaValidacion.emailConflict
                        ? 'border-red-400/50 focus:border-red-400'
                        : cedulaValidacion.exists === true 
                          ? 'border-blue-400/50 focus:border-blue-400' 
                          : cedulaValidacion.exists === false 
                            ? 'border-green-400/50 focus:border-green-400'
                            : 'border-white/10 focus:border-yellow-400'
                    }`}
                    placeholder="Número de cédula" 
                    required 
                  />
                  {cedulaValidacion.exists === true && !cedulaValidacion.emailConflict && (
                    <p className="mt-1 text-xs text-blue-300">
                      Conductor registrado. Datos se actualizarán.
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-400 mb-1">Teléfono <span className="text-red-400">*</span></label>
                  <input type="tel" inputMode="tel" value={conductor.telefono} onChange={(e) => setConductor(prev => ({ ...prev, telefono: e.target.value }))} className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-yellow-400 transition-colors" placeholder="3001234567" required />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs sm:text-sm font-medium text-gray-400 mb-1">
                    <span className="flex flex-wrap items-center gap-1">
                      Email <span className="text-red-400">*</span>
                      {cedulaValidacion.emailConflict && <span className="text-red-400 text-xs">⚠️ Ya registrado</span>}
                    </span>
                  </label>
                  <input 
                    type="email" 
                    inputMode="email"
                    value={conductor.email} 
                    onChange={(e) => {
                      setConductor(prev => ({ ...prev, email: e.target.value }));
                      if (cedulaValidacion.emailConflict) {
                        setCedulaValidacion(prev => ({ ...prev, emailConflict: false, emailMessage: '' }));
                      }
                    }}
                    onBlur={(e) => {
                      if (conductor.cedula.length >= 5) {
                        verificarCedula(conductor.cedula, e.target.value);
                      }
                    }}
                    className={`w-full px-3 py-2.5 bg-white/5 border rounded-lg text-white text-sm focus:outline-none transition-colors ${
                      cedulaValidacion.emailConflict
                        ? 'border-red-400/50 focus:border-red-400'
                        : 'border-white/10 focus:border-yellow-400'
                    }`}
                    placeholder="correo@ejemplo.com" 
                    required 
                  />
                  {cedulaValidacion.emailConflict && (
                    <p className="mt-1 text-xs text-red-400 font-medium">
                      ⚠️ {cedulaValidacion.emailMessage}. Por favor verifica los datos o usa otro correo.
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-400 mb-1">Edad</label>
                  <input type="number" value={conductor.edad} onChange={(e) => setConductor(prev => ({ ...prev, edad: e.target.value }))} className="w-full px-3 sm:px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-yellow-400 transition-colors" placeholder="Años" />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-400 mb-1">RH</label>
                  <select 
                    value={conductor.rh} 
                    onChange={(e) => setConductor(prev => ({ ...prev, rh: e.target.value }))} 
                    className="w-full px-3 sm:px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-yellow-400 transition-colors"
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
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-400 mb-1">EPS</label>
                  <select 
                    value={conductor.eps === 'Otra' || (!['', 'Sura EPS', 'Nueva EPS', 'Sanitas', 'Compensar', 'Famisanar', 'Salud Total', 'Coomeva EPS', 'Medimás', 'Aliansalud', 'Comfenalco Valle', 'SOS EPS', 'Mutual Ser', 'Coosalud', 'Emssanar', 'Asmet Salud', 'Cajacopi', 'Capital Salud', 'Savia Salud'].includes(conductor.eps) && conductor.eps) ? 'Otra' : conductor.eps} 
                    onChange={(e) => {
                      if (e.target.value === 'Otra') {
                        setConductor(prev => ({ ...prev, eps: 'Otra' }));
                      } else {
                        setConductor(prev => ({ ...prev, eps: e.target.value }));
                        setEpsOtra('');
                      }
                    }} 
                    className="w-full px-3 sm:px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-yellow-400 transition-colors"
                  >
                    <option value="" className="bg-slate-800">Seleccionar EPS</option>
                    <option value="Sura EPS" className="bg-slate-800">Sura EPS</option>
                    <option value="Nueva EPS" className="bg-slate-800">Nueva EPS</option>
                    <option value="Sanitas" className="bg-slate-800">Sanitas</option>
                    <option value="Compensar" className="bg-slate-800">Compensar</option>
                    <option value="Famisanar" className="bg-slate-800">Famisanar</option>
                    <option value="Salud Total" className="bg-slate-800">Salud Total</option>
                    <option value="Coomeva EPS" className="bg-slate-800">Coomeva EPS</option>
                    <option value="Medimás" className="bg-slate-800">Medimás</option>
                    <option value="Aliansalud" className="bg-slate-800">Aliansalud</option>
                    <option value="Comfenalco Valle" className="bg-slate-800">Comfenalco Valle</option>
                    <option value="SOS EPS" className="bg-slate-800">SOS EPS</option>
                    <option value="Mutual Ser" className="bg-slate-800">Mutual Ser</option>
                    <option value="Coosalud" className="bg-slate-800">Coosalud</option>
                    <option value="Emssanar" className="bg-slate-800">Emssanar</option>
                    <option value="Asmet Salud" className="bg-slate-800">Asmet Salud</option>
                    <option value="Cajacopi" className="bg-slate-800">Cajacopi</option>
                    <option value="Capital Salud" className="bg-slate-800">Capital Salud</option>
                    <option value="Savia Salud" className="bg-slate-800">Savia Salud</option>
                    <option value="Otra" className="bg-slate-800">Otra</option>
                  </select>
                  {(conductor.eps === 'Otra' || (!['', 'Sura EPS', 'Nueva EPS', 'Sanitas', 'Compensar', 'Famisanar', 'Salud Total', 'Coomeva EPS', 'Medimás', 'Aliansalud', 'Comfenalco Valle', 'SOS EPS', 'Mutual Ser', 'Coosalud', 'Emssanar', 'Asmet Salud', 'Cajacopi', 'Capital Salud', 'Savia Salud'].includes(conductor.eps) && conductor.eps)) && (
                    <input 
                      type="text" 
                      value={conductor.eps === 'Otra' ? epsOtra : conductor.eps}
                      onChange={(e) => {
                        setEpsOtra(e.target.value);
                        setConductor(prev => ({ ...prev, eps: e.target.value || 'Otra' }));
                      }}
                      placeholder="Especificar EPS"
                      className="w-full mt-2 px-3 sm:px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-yellow-400 transition-colors"
                    />
                  )}
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-400 mb-1">ARL</label>
                  <select 
                    value={conductor.arl === 'Otra' || (!['', 'Sura ARL', 'Positiva ARL', 'Colmena Seguros', 'Seguros Bolívar ARL', 'AXA Colpatria ARL', 'Liberty Seguros ARL', 'Alfa ARL', 'Aurora ARL', 'Equidad Seguros ARL'].includes(conductor.arl) && conductor.arl) ? 'Otra' : conductor.arl}
                    onChange={(e) => {
                      if (e.target.value === 'Otra') {
                        setConductor(prev => ({ ...prev, arl: 'Otra' }));
                      } else {
                        setConductor(prev => ({ ...prev, arl: e.target.value }));
                        setArlOtra('');
                      }
                    }} 
                    className="w-full px-3 sm:px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-yellow-400 transition-colors"
                  >
                    <option value="" className="bg-slate-800">Seleccionar ARL</option>
                    <option value="Sura ARL" className="bg-slate-800">Sura ARL</option>
                    <option value="Positiva ARL" className="bg-slate-800">Positiva ARL</option>
                    <option value="Colmena Seguros" className="bg-slate-800">Colmena Seguros</option>
                    <option value="Seguros Bolívar ARL" className="bg-slate-800">Seguros Bolívar ARL</option>
                    <option value="AXA Colpatria ARL" className="bg-slate-800">AXA Colpatria ARL</option>
                    <option value="Liberty Seguros ARL" className="bg-slate-800">Liberty Seguros ARL</option>
                    <option value="Alfa ARL" className="bg-slate-800">Alfa ARL</option>
                    <option value="Aurora ARL" className="bg-slate-800">Aurora ARL</option>
                    <option value="Equidad Seguros ARL" className="bg-slate-800">Equidad Seguros ARL</option>
                    <option value="Otra" className="bg-slate-800">Otra</option>
                  </select>
                  {(conductor.arl === 'Otra' || (!['', 'Sura ARL', 'Positiva ARL', 'Colmena Seguros', 'Seguros Bolívar ARL', 'AXA Colpatria ARL', 'Liberty Seguros ARL', 'Alfa ARL', 'Aurora ARL', 'Equidad Seguros ARL'].includes(conductor.arl) && conductor.arl)) && (
                    <input 
                      type="text" 
                      value={conductor.arl === 'Otra' ? arlOtra : conductor.arl}
                      onChange={(e) => {
                        setArlOtra(e.target.value);
                        setConductor(prev => ({ ...prev, arl: e.target.value || 'Otra' }));
                      }}
                      placeholder="Especificar ARL"
                      className="w-full mt-2 px-3 sm:px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-yellow-400 transition-colors"
                    />
                  )}
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-400 mb-1">Fondo de Pensión</label>
                  <select 
                    value={conductor.fondoPension === 'Otra' || (!['', 'Porvenir', 'Protección', 'Colfondos', 'Skandia', 'Old Mutual', 'Colpensiones'].includes(conductor.fondoPension) && conductor.fondoPension) ? 'Otra' : conductor.fondoPension}
                    onChange={(e) => {
                      if (e.target.value === 'Otra') {
                        setConductor(prev => ({ ...prev, fondoPension: 'Otra' }));
                      } else {
                        setConductor(prev => ({ ...prev, fondoPension: e.target.value }));
                        setFondoPensionOtra('');
                      }
                    }} 
                    className="w-full px-3 sm:px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-yellow-400 transition-colors"
                  >
                    <option value="" className="bg-slate-800">Seleccionar Fondo</option>
                    <option value="Porvenir" className="bg-slate-800">Porvenir</option>
                    <option value="Protección" className="bg-slate-800">Protección</option>
                    <option value="Colfondos" className="bg-slate-800">Colfondos</option>
                    <option value="Skandia" className="bg-slate-800">Skandia</option>
                    <option value="Old Mutual" className="bg-slate-800">Old Mutual</option>
                    <option value="Colpensiones" className="bg-slate-800">Colpensiones</option>
                    <option value="Otra" className="bg-slate-800">Otra</option>
                  </select>
                  {(conductor.fondoPension === 'Otra' || (!['', 'Porvenir', 'Protección', 'Colfondos', 'Skandia', 'Old Mutual', 'Colpensiones'].includes(conductor.fondoPension) && conductor.fondoPension)) && (
                    <input 
                      type="text" 
                      value={conductor.fondoPension === 'Otra' ? fondoPensionOtra : conductor.fondoPension}
                      onChange={(e) => {
                        setFondoPensionOtra(e.target.value);
                        setConductor(prev => ({ ...prev, fondoPension: e.target.value || 'Otra' }));
                      }}
                      placeholder="Especificar Fondo de Pensión"
                      className="w-full mt-2 px-3 sm:px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-yellow-400 transition-colors"
                    />
                  )}
                </div>
              </div>
            </section>

            {/* 3. DOCUMENTOS REQUERIDOS */}
            <section className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-yellow-400 mb-4 sm:mb-6">📄 Documentos Requeridos</h2>
              <div className="space-y-3">
                {/* SOAT */}
                <div className="p-3 sm:p-4 bg-white/5 rounded-lg border border-white/10">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <span className="flex-1 text-gray-200 text-sm font-medium">Seguro Obligatorio (SOAT)</span>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-3 bg-slate-800/50 rounded-lg px-3 py-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" name="soat" checked={documentos.soatCumple === true} onChange={() => setDocumentos(prev => ({ ...prev, soatCumple: true }))} className="w-5 h-5 accent-green-500" />
                          <span className="text-green-400 text-sm">Sí</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" name="soat" checked={documentos.soatCumple === false} onChange={() => setDocumentos(prev => ({ ...prev, soatCumple: false }))} className="w-5 h-5 accent-red-500" />
                          <span className="text-red-400 text-sm">No</span>
                        </label>
                      </div>
                      <input type="date" value={documentos.soatVencimiento} onChange={(e) => setDocumentos(prev => ({ ...prev, soatVencimiento: e.target.value }))} className="w-36 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-yellow-400" />
                    </div>
                  </div>
                </div>
                {/* RTM */}
                <div className="p-3 sm:p-4 bg-white/5 rounded-lg border border-white/10">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <span className="flex-1 text-gray-200 text-sm font-medium">Revisión Técnico Mecánica</span>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-3 bg-slate-800/50 rounded-lg px-3 py-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" name="revision" checked={documentos.revisionCumple === true} onChange={() => setDocumentos(prev => ({ ...prev, revisionCumple: true }))} className="w-5 h-5 accent-green-500" />
                          <span className="text-green-400 text-sm">Sí</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" name="revision" checked={documentos.revisionCumple === false} onChange={() => setDocumentos(prev => ({ ...prev, revisionCumple: false }))} className="w-5 h-5 accent-red-500" />
                          <span className="text-red-400 text-sm">No</span>
                        </label>
                      </div>
                      <input type="date" value={documentos.revisionVencimiento} onChange={(e) => setDocumentos(prev => ({ ...prev, revisionVencimiento: e.target.value }))} className="w-36 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-yellow-400" />
                    </div>
                  </div>
                </div>
                {/* Póliza */}
                <div className="p-3 sm:p-4 bg-white/5 rounded-lg border border-white/10">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <span className="flex-1 text-gray-200 text-sm font-medium">Póliza Contra Todo Riesgo</span>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-3 bg-slate-800/50 rounded-lg px-3 py-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" name="poliza" checked={documentos.polizaCumple === true} onChange={() => setDocumentos(prev => ({ ...prev, polizaCumple: true }))} className="w-5 h-5 accent-green-500" />
                          <span className="text-green-400 text-sm">Sí</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" name="poliza" checked={documentos.polizaCumple === false} onChange={() => setDocumentos(prev => ({ ...prev, polizaCumple: false }))} className="w-5 h-5 accent-red-500" />
                          <span className="text-red-400 text-sm">No</span>
                        </label>
                      </div>
                      <input type="date" value={documentos.polizaVencimiento} onChange={(e) => setDocumentos(prev => ({ ...prev, polizaVencimiento: e.target.value }))} className="w-36 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-yellow-400" />
                    </div>
                  </div>
                </div>
                {/* Licencia */}
                <div className="p-3 sm:p-4 bg-white/5 rounded-lg border border-white/10">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <span className="flex-1 text-gray-200 text-sm font-medium">Licencia de Conducción</span>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-3 bg-slate-800/50 rounded-lg px-3 py-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" name="licencia" checked={documentos.licenciaCumple === true} onChange={() => setDocumentos(prev => ({ ...prev, licenciaCumple: true }))} className="w-5 h-5 accent-green-500" />
                          <span className="text-green-400 text-sm">Sí</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" name="licencia" checked={documentos.licenciaCumple === false} onChange={() => setDocumentos(prev => ({ ...prev, licenciaCumple: false }))} className="w-5 h-5 accent-red-500" />
                          <span className="text-red-400 text-sm">No</span>
                        </label>
                      </div>
                      <span className="text-gray-500 text-xs italic w-36 text-center">Ver categorías</span>
                    </div>
                  </div>
                </div>
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
            <section className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-yellow-400 mb-4 sm:mb-6">🚚 Vehículo</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">Placa <span className="text-red-400">*</span></label>
                  <input type="text" value={vehiculo.placa} onChange={(e) => setVehiculo(prev => ({ ...prev, placa: e.target.value.toUpperCase() }))} className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white uppercase text-sm focus:outline-none focus:border-yellow-400 transition-colors" placeholder="ABC123" maxLength={6} required />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">No. Tarjeta</label>
                  <input type="text" value={vehiculo.tarjetaPropiedad} onChange={(e) => setVehiculo(prev => ({ ...prev, tarjetaPropiedad: e.target.value.toUpperCase() }))} className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white uppercase text-sm focus:outline-none focus:border-yellow-400 transition-colors" placeholder="Número" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">Marca</label>
                  <input type="text" value={vehiculo.marca} onChange={(e) => setVehiculo(prev => ({ ...prev, marca: e.target.value }))} className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-yellow-400 transition-colors" placeholder="Kenworth" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">Línea</label>
                  <input type="text" value={vehiculo.linea} onChange={(e) => setVehiculo(prev => ({ ...prev, linea: e.target.value }))} className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-yellow-400 transition-colors" placeholder="T800" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">Modelo</label>
                  <input type="text" value={vehiculo.modelo} onChange={(e) => setVehiculo(prev => ({ ...prev, modelo: e.target.value }))} className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-yellow-400 transition-colors" placeholder="2024" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">Color</label>
                  <input type="text" value={vehiculo.color} onChange={(e) => setVehiculo(prev => ({ ...prev, color: e.target.value }))} className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-yellow-400 transition-colors" placeholder="Blanco" />
                </div>
              </div>
            </section>

            {/* 5. DATOS DEL REMOLQUE */}
            <section className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-yellow-400 mb-4 sm:mb-6">🚛 Remolque</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
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
            <section className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-yellow-400 mb-4 sm:mb-6">📍 GPS</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">Nombre del GPS</label>
                  <input type="text" value={datosGPS.nombreGPS} onChange={(e) => setDatosGPS(prev => ({ ...prev, nombreGPS: e.target.value }))} className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-yellow-400 transition-colors" placeholder="GPS Modelo X" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">Usuario</label>
                  <input type="text" value={datosGPS.usuario} onChange={(e) => setDatosGPS(prev => ({ ...prev, usuario: e.target.value }))} className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-yellow-400 transition-colors" placeholder="Usuario" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">Contraseña</label>
                  <input type="password" value={datosGPS.contrasena} onChange={(e) => setDatosGPS(prev => ({ ...prev, contrasena: e.target.value }))} className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-yellow-400 transition-colors" placeholder="••••••" />
                </div>
              </div>
              <div className="mt-3 p-3 bg-yellow-500/10 border border-yellow-400/20 rounded-xl">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={datosGPS.autorizacionMonitoreo}
                    onChange={(e) => setDatosGPS(prev => ({ ...prev, autorizacionMonitoreo: e.target.checked }))}
                    className="w-5 h-5 mt-0.5 accent-yellow-500 flex-shrink-0"
                    required
                  />
                  <div className="text-xs sm:text-sm text-gray-300">
                    <span className="font-medium text-yellow-400">Autorizo monitoreo:</span> Acepto el uso de datos del GPS para seguimiento del servicio. <span className="text-red-400">*</span>
                  </div>
                </label>
              </div>
            </section>

            {/* 7. HORAS DE DESCANSO Y KILOMETRAJE */}
            <div className="grid grid-cols-2 gap-3 sm:gap-6">
              <section className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6">
                <h2 className="text-sm sm:text-lg md:text-xl font-bold text-yellow-400 mb-3 sm:mb-4 text-center">😴 Horas de Descanso</h2>
                <input type="number" inputMode="numeric" value={horasDormir} onChange={(e) => setHorasDormir(e.target.value)} className="w-full px-3 py-2 sm:py-3 bg-white/5 border border-white/10 rounded-xl text-white text-center text-xl sm:text-3xl font-bold focus:outline-none focus:border-yellow-400 transition-colors" min="0" max="24" />
                <p className="text-center text-gray-500 mt-2 text-xs">Antes del turno</p>
              </section>
              <section className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6">
                <h2 className="text-sm sm:text-lg md:text-xl font-bold text-yellow-400 mb-3 sm:mb-4 text-center">📊 Km Inicial</h2>
                <input type="number" inputMode="numeric" value={kilometrajeInicial} onChange={(e) => setKilometrajeInicial(e.target.value)} className="w-full px-3 py-2 sm:py-3 bg-white/5 border border-white/10 rounded-xl text-white text-center text-xl sm:text-3xl font-bold focus:outline-none focus:border-yellow-400 transition-colors" placeholder="0" />
                <p className="text-center text-gray-500 mt-2 text-xs">Odómetro al inicio</p>
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
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-yellow-400 mb-4 sm:mb-6">✍️ Firma del Conductor</h2>
              <div className="bg-white/5 p-3 sm:p-6 rounded-xl border border-white/10">
                <p className="text-gray-400 mb-4 text-xs sm:text-sm">
                  Al firmar, certifico que toda la información proporcionada es veraz y que he realizado la inspección pre-operacional del vehículo antes de iniciar la jornada.
                </p>
                
                {/* Canvas de firma */}
                <div className="relative">
                  <canvas
                    ref={canvasRef}
                    width={600}
                    height={200}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                    className="w-full bg-white border-2 border-dashed border-gray-300 rounded-xl cursor-crosshair touch-none"
                    style={{ maxHeight: '150px' }}
                  />
                  
                  {!hasFirma && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <p className="text-gray-400 text-sm sm:text-lg">Firme aquí</p>
                    </div>
                  )}
                </div>
                
                {/* Botón para limpiar */}
                <div className="flex items-center justify-between mt-3 sm:mt-4">
                  <div className="flex items-center gap-2">
                    {hasFirma && (
                      <span className="text-green-400 text-xs sm:text-sm flex items-center gap-1">
                        ✓ Firma registrada
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={limpiarFirma}
                    className="px-3 sm:px-4 py-1.5 sm:py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors text-xs sm:text-sm flex items-center gap-2"
                  >
                    🗑️ <span className="hidden sm:inline">Limpiar</span> firma
                  </button>
                </div>
                
                {/* Nombre del conductor */}
                {conductor.nombreCompleto && (
                  <p className="mt-3 sm:mt-4 text-center text-gray-400 text-xs sm:text-sm border-t border-white/10 pt-3 sm:pt-4">
                    <span className="font-semibold text-white">{conductor.nombreCompleto}</span>
                    <br />
                    C.C. {conductor.cedula}
                  </p>
                )}
              </div>
            </section>

            {/* POLÍTICAS DE PRIVACIDAD Y COOKIES */}
            <section className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-yellow-400 mb-3 sm:mb-4">📋 Términos y Condiciones</h2>
              <div className="space-y-3">
                <label className="flex items-start gap-3 cursor-pointer group p-2 rounded-lg hover:bg-white/5 transition-colors">
                  <input
                    type="checkbox"
                    checked={aceptoPoliticas}
                    onChange={(e) => setAceptoPoliticas(e.target.checked)}
                    className="mt-0.5 w-5 h-5 flex-shrink-0 rounded border-white/20 bg-white/5 text-yellow-400 focus:ring-yellow-400 focus:ring-offset-0 cursor-pointer"
                  />
                  <span className="text-xs sm:text-sm text-gray-300 group-hover:text-white transition-colors">
                    <span className="text-red-400">*</span> Acepto la{' '}
                    <a href="/legal/politica-privacidad" target="_blank" className="text-yellow-400 hover:text-yellow-300 underline">
                      Política de Privacidad
                    </a>{' '}
                    y{' '}
                    <a href="/legal/tratamiento-datos" target="_blank" className="text-yellow-400 hover:text-yellow-300 underline">
                      Tratamiento de Datos
                    </a>
                  </span>
                </label>
                <label className="flex items-start gap-3 cursor-pointer group p-2 rounded-lg hover:bg-white/5 transition-colors">
                  <input
                    type="checkbox"
                    checked={aceptoCookies}
                    onChange={(e) => setAceptoCookies(e.target.checked)}
                    className="mt-0.5 w-5 h-5 flex-shrink-0 rounded border-white/20 bg-white/5 text-yellow-400 focus:ring-yellow-400 focus:ring-offset-0 cursor-pointer"
                  />
                  <span className="text-xs sm:text-sm text-gray-300 group-hover:text-white transition-colors">
                    <span className="text-red-400">*</span> Acepto{' '}
                    <a href="/legal/politica-cookies" target="_blank" className="text-yellow-400 hover:text-yellow-300 underline">
                      cookies
                    </a>{' '}
                    para almacenar preferencias
                  </span>
                </label>
              </div>
            </section>

            {/* BOTÓN DE ENVÍO */}
            <div className="flex justify-center pb-4">
              <button type="submit" disabled={isLoading || cedulaValidacion.emailConflict} className={`w-full sm:w-auto px-8 sm:px-12 py-3 sm:py-4 rounded-xl sm:rounded-2xl text-base sm:text-xl font-bold shadow-xl transition-all ${isLoading || cedulaValidacion.emailConflict ? 'bg-gray-600 cursor-not-allowed text-gray-400' : 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-black hover:shadow-yellow-500/30 hover:shadow-2xl active:scale-95 sm:hover:scale-105'}`}>
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2 sm:gap-3">
                    <svg className="animate-spin h-5 w-5 sm:h-6 sm:w-6" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>
                    Guardando...
                  </span>
                ) : cedulaValidacion.emailConflict ? '⚠️ Corrige el email' : '📤 Enviar Inspección'}
              </button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
