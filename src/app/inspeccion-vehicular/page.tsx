'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

// ==========================================
// CONFIGURACIÓN DEL FORMATO
// ==========================================
const INFO_FORMATO = {
  codigo: 'HSEQ-FOR-065',
  version: '001',
  fechaEdicion: '25-02-2026',
  empresa: 'TRANSPORTE Y LOGÍSTICA EQUINOX S.A.S.',
  nit: '901.870.510-5',
  titulo: 'INSPECCIÓN VEHICULAR INTEGRAL',
};

// ==========================================
// ITEMS DE INSPECCIÓN PREOPERACIONAL
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

// ==========================================
// ITEMS KIT DE DERRAME
// ==========================================
const ITEMS_KIT_DERRAME = [
  { id: 101, nombre: 'Paños Absorbentes', cantidad: 4 },
  { id: 102, nombre: 'Barrera Absorbente', cantidad: 2 },
  { id: 103, nombre: 'Traje Desechable', cantidad: 1 },
  { id: 104, nombre: 'Bolsa Roja para Recoger Residuos Contaminados', cantidad: 2 },
  { id: 105, nombre: 'Pala Plástica', cantidad: 1 },
  { id: 106, nombre: 'Espátula Plástica', cantidad: 1 },
  { id: 107, nombre: 'Guantes de Nitrilo', cantidad: 1 },
  { id: 108, nombre: 'Gafas Transparentes de Seguridad', cantidad: 1 },
  { id: 109, nombre: 'Cinta de Peligro', cantidad: 1 },
  { id: 110, nombre: 'Martillo de Goma', cantidad: 1 },
  { id: 111, nombre: 'Recogedor de Mano Plástico', cantidad: 1 },
  { id: 112, nombre: 'Respirador un Cartucho o Tapabocas N-95', cantidad: 1 },
  { id: 113, nombre: 'Linterna Recargable', cantidad: 1 },
  { id: 114, nombre: 'Bolsa Granulado Absorbente', cantidad: 1 },
  { id: 115, nombre: 'Masilla Epóxica', cantidad: 1 },
  { id: 116, nombre: 'Desengrasante Biodegradable', cantidad: 1 },
  { id: 117, nombre: 'Chaleco Antireflectivo', cantidad: 1 },
  { id: 118, nombre: 'Conos', cantidad: 1 },
];

const PREGUNTAS_KIT_DERRAME = [
  { id: 119, nombre: '¿El responsable del kit control de derrame conoce el procedimiento para usarlo?' },
  { id: 120, nombre: '¿El kit se encuentra almacenado en un lugar seco y protegido de agentes contaminantes?' },
  { id: 121, nombre: '¿La caneca o morral donde se guarda el kit se encuentra rotulado o señalizado?' },
];

// ==========================================
// ITEMS BOTIQUÍN
// ==========================================
const ITEMS_BOTIQUIN = [
  { id: 201, nombre: 'Gasas', cantidad: 10, tieneVencimiento: true },
  { id: 202, nombre: 'Esparadrapo', cantidad: 1, tieneVencimiento: true },
  { id: 203, nombre: 'Bajalenguas', cantidad: 10, tieneVencimiento: true },
  { id: 204, nombre: 'Guantes de Latex', cantidad: 5, tieneVencimiento: true },
  { id: 205, nombre: 'Aplicadores o Copitos', cantidad: 1, tieneVencimiento: true },
  { id: 206, nombre: 'Venda Elástica 2X5 Yardas', cantidad: 1, tieneVencimiento: true },
  { id: 207, nombre: 'Venda Elástica 3X5 Yardas', cantidad: 1, tieneVencimiento: true },
  { id: 208, nombre: 'Venda Elástica 5X5 Yardas', cantidad: 1, tieneVencimiento: true },
  { id: 209, nombre: 'Venda de Algodón 3X5 Yardas', cantidad: 1, tieneVencimiento: true },
  { id: 210, nombre: 'Venda de Algodón 5X5 Yardas', cantidad: 1, tieneVencimiento: true },
  { id: 211, nombre: 'Yodopovidona (Jabón Quirúrgico)', cantidad: 1, tieneVencimiento: true },
  { id: 212, nombre: 'Solución Salina 250 cc ó 500 cc', cantidad: 1, tieneVencimiento: true },
  { id: 213, nombre: 'Tapabocas', cantidad: 3, tieneVencimiento: true },
  { id: 214, nombre: 'Alcohol Antiséptico Frasco por 275 ml', cantidad: 1, tieneVencimiento: true },
  { id: 215, nombre: 'Curas', cantidad: 5, tieneVencimiento: true },
  { id: 216, nombre: 'Jeringa de 5 ml', cantidad: 1, tieneVencimiento: true },
  { id: 217, nombre: 'Tijeras de Trauma', cantidad: 1, tieneVencimiento: false },
  { id: 218, nombre: 'Parche Ocular', cantidad: 3, tieneVencimiento: true },
  { id: 219, nombre: 'Termómetro', cantidad: 1, tieneVencimiento: false },
  { id: 220, nombre: 'Libreta', cantidad: 1, tieneVencimiento: false },
  { id: 221, nombre: 'Lapicero', cantidad: 1, tieneVencimiento: false },
  { id: 222, nombre: 'Manual de Emergencia', cantidad: 1, tieneVencimiento: false },
];

// ==========================================
// ITEMS EXTINTOR
// ==========================================
const ITEMS_EXTINTOR = [
  { id: 301, nombre: 'Presión' },
  { id: 302, nombre: 'Sello de Garantía' },
  { id: 303, nombre: 'Manómetro' },
  { id: 304, nombre: 'Estado del Cilindro' },
  { id: 305, nombre: 'Manija' },
  { id: 306, nombre: 'Boquilla o Manguera' },
  { id: 307, nombre: 'Anillo de Seguridad' },
  { id: 308, nombre: 'Pin de Seguridad' },
  { id: 309, nombre: 'Pintura' },
  { id: 310, nombre: 'Tarjeta de Inspección' },
];

// Leyenda de calificaciones
const CALIFICACION_INFO = {
  B: { label: 'Bueno', color: 'green', description: 'El elemento está en perfecto estado' },
  R: { label: 'Regular', color: 'yellow', description: 'El elemento presenta desgaste o deterioro menor' },
  M: { label: 'Malo', color: 'red', description: 'El elemento requiere reemplazo inmediato' },
  NT: { label: 'No Tiene', color: 'gray', description: 'El elemento no se encuentra presente' },
};

const CATEGORIAS_LICENCIA = ['A1', 'A2', 'B1', 'B2', 'B3', 'C1', 'C2', 'C3'];

// ==========================================
// INTERFACES
// ==========================================
interface Conductor {
  id: string;
  codigoConductor: string;
  nombreCompleto: string;
  cedula: string;
  telefono: string;
  email: string;
  edad: string;
  rh: string;
  eps: string;
  arl: string;
  fondoPension: string;
  categoriasLicencia: string;
}

interface EstadoItemPreoperacional {
  cumple: boolean | null;
  observacion: string;
}

interface EstadoItemKitDerrame {
  estado: 'B' | 'M' | 'R' | 'NT' | null;
  observacion: string;
}

interface EstadoItemBotiquin {
  estado: 'B' | 'M' | 'R' | 'NT' | null;
  cantidad: string;
  fechaVencimiento: string;
  observacion: string;
}

interface EstadoItemExtintor {
  estado: 'B' | 'R' | 'M' | null;
  observacion: string;
}

interface User {
  cedula: string;
  nombre?: string;
  rol?: string;
}

export default function InspeccionVehicularPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [fechaActual, setFechaActual] = useState('');

  // Lista de conductores
  const [conductores, setConductores] = useState<Conductor[]>([]);
  const [loadingConductores, setLoadingConductores] = useState(true);
  const [conductorSeleccionado, setConductorSeleccionado] = useState<Conductor | null>(null);

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

  // Categorías de licencia
  const [categoriasSeleccionadas, setCategoriasSeleccionadas] = useState<string[]>([]);
  const [vigenciasLicencia, setVigenciasLicencia] = useState<Record<string, string>>({});

  // Condiciones
  const [horasDormir, setHorasDormir] = useState('8');
  const [kilometrajeInicial, setKilometrajeInicial] = useState('');

  // Estados de inspección
  const [itemsPreoperacional, setItemsPreoperacional] = useState<Record<number, EstadoItemPreoperacional>>({});
  const [itemsKitDerrame, setItemsKitDerrame] = useState<Record<number, EstadoItemKitDerrame>>({});
  const [itemsBotiquin, setItemsBotiquin] = useState<Record<number, EstadoItemBotiquin>>({});
  const [itemsExtintor, setItemsExtintor] = useState<Record<number, EstadoItemExtintor>>({});

  // Fechas del extintor
  const [fechaActualExtintor, setFechaActualExtintor] = useState({ dia: '', mes: '', ano: '' });
  const [fechaProximaRecarga, setFechaProximaRecarga] = useState({ dia: '', mes: '', ano: '' });

  // Observaciones generales
  const [observacionesGenerales, setObservacionesGenerales] = useState('');

  // Secciones expandidas
  const [seccionesExpandidas, setSeccionesExpandidas] = useState({
    preoperacional: true,
    kitDerrame: true,
    botiquin: true,
    extintor: true,
  });

  // Firma
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasFirma, setHasFirma] = useState(false);
  const [firmaConductor, setFirmaConductor] = useState('');

  // Modal crear conductor
  const [showCrearConductor, setShowCrearConductor] = useState(false);
  const [creandoConductor, setCreandoConductor] = useState(false);
  const [nuevoConductor, setNuevoConductor] = useState({
    nombreCompleto: '',
    cedula: '',
    telefono: '',
    email: '',
    edad: '',
    rh: '',
    eps: '',
    arl: '',
    fondoPension: '',
    categoriasLicencia: '',
  });

  // Paginación del formulario
  const [paginaActual, setPaginaActual] = useState(1);
  const TOTAL_PAGINAS = 5;
  const pasos = [
    { num: 1, label: 'Datos Generales', icono: '📋' },
    { num: 2, label: 'Preoperacional', icono: '🔍' },
    { num: 3, label: 'Kit de Derrame', icono: '🛢️' },
    { num: 4, label: 'Botiquín', icono: '🩺' },
    { num: 5, label: 'Extintor y Firma', icono: '🧯' },
  ];

  // ==========================================
  // VERIFICAR AUTENTICACIÓN
  // ==========================================
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/me', { credentials: 'include' });
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        } else {
          router.push('/login?redirect=/inspeccion-vehicular');
        }
      } catch (error) {
        console.error('Error checking auth:', error);
        router.push('/login?redirect=/inspeccion-vehicular');
      } finally {
        setIsCheckingAuth(false);
      }
    };
    checkAuth();
  }, [router]);

  // ==========================================
  // CARGAR CONDUCTORES
  // ==========================================
  useEffect(() => {
    const loadConductores = async () => {
      try {
        const res = await fetch('/api/conductores');
        if (res.ok) {
          const data = await res.json();
          setConductores(data.conductores || []);
        }
      } catch (error) {
        console.error('Error loading conductores:', error);
      } finally {
        setLoadingConductores(false);
      }
    };

    if (user) {
      loadConductores();
    }
  }, [user]);

  // ==========================================
  // ESTABLECER FECHA ACTUAL
  // ==========================================
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

  // ==========================================
  // HANDLERS
  // ==========================================
  const handleConductorChange = (conductorId: string) => {
    const conductor = conductores.find(c => c.id === conductorId);
    setConductorSeleccionado(conductor || null);
    
    // Pre-llenar categorías si existen
    if (conductor?.categoriasLicencia) {
      const cats = conductor.categoriasLicencia.split(',').map(c => c.trim());
      setCategoriasSeleccionadas(cats.filter(c => CATEGORIAS_LICENCIA.includes(c)));
    }
  };

  const handleItemPreoperacionalChange = (itemId: number, field: 'cumple' | 'observacion', value: boolean | string) => {
    setItemsPreoperacional(prev => ({
      ...prev,
      [itemId]: {
        cumple: prev[itemId]?.cumple ?? null,
        observacion: prev[itemId]?.observacion ?? '',
        [field]: value,
        ...(field === 'cumple' && value === true ? { observacion: '' } : {}),
      }
    }));
  };

  const handleKitDerrameChange = (itemId: number, field: keyof EstadoItemKitDerrame, value: string | null) => {
    setItemsKitDerrame(prev => ({
      ...prev,
      [itemId]: {
        estado: prev[itemId]?.estado ?? null,
        observacion: prev[itemId]?.observacion ?? '',
        [field]: value,
      }
    }));
  };

  const handleBotiquinChange = (itemId: number, field: keyof EstadoItemBotiquin, value: string) => {
    setItemsBotiquin(prev => ({
      ...prev,
      [itemId]: {
        estado: prev[itemId]?.estado ?? null,
        cantidad: prev[itemId]?.cantidad ?? '',
        fechaVencimiento: prev[itemId]?.fechaVencimiento ?? '',
        observacion: prev[itemId]?.observacion ?? '',
        [field]: value,
      }
    }));
  };

  const handleExtintorChange = (itemId: number, field: keyof EstadoItemExtintor, value: string | null) => {
    setItemsExtintor(prev => ({
      ...prev,
      [itemId]: {
        estado: prev[itemId]?.estado ?? null,
        observacion: prev[itemId]?.observacion ?? '',
        [field]: value,
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

  const toggleSeccion = (seccion: keyof typeof seccionesExpandidas) => {
    setSeccionesExpandidas(prev => ({ ...prev, [seccion]: !prev[seccion] }));
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
  // PRE-LLENAR FORMULARIO PARA PRUEBAS
  // ==========================================
  const preLlenarFormulario = () => {
    // Seleccionar primer conductor si existe
    if (conductores.length > 0) {
      const primerConductor = conductores[0];
      setConductorSeleccionado(primerConductor);
      if (primerConductor.categoriasLicencia) {
        const cats = primerConductor.categoriasLicencia.split(',').map(c => c.trim());
        setCategoriasSeleccionadas(cats.filter(c => CATEGORIAS_LICENCIA.includes(c)));
        const vigsTest: Record<string, string> = {};
        cats.forEach(c => { vigsTest[c] = '2027-06-15'; });
        setVigenciasLicencia(vigsTest);
      }
    }

    // Vehículo
    setVehiculo({ placa: 'ABC123', marca: 'Kenworth', linea: 'T800', modelo: '2024' });

    // Remolque
    setRemolque({ placa: 'R98765', marca: 'Imecol', clase: 'Estacas', modelo: '2023' });

    // Documentos
    setDocumentos({
      soatCumple: true, soatVencimiento: '2027-03-15',
      revisionCumple: true, revisionVencimiento: '2027-01-20',
      polizaCumple: true, polizaVencimiento: '2027-05-10',
      licenciaCumple: true,
    });

    // Condiciones
    setHorasDormir('8');
    setKilometrajeInicial('125000');

    // Items preoperacional - todos cumplen
    const itemsPreop: Record<number, EstadoItemPreoperacional> = {};
    [...ITEMS_SEGURIDAD, ...ITEMS_GENERALES, ...ITEMS_MECANICOS, ...ITEMS_CORREAS, ...ITEMS_HIGIENE, ...ITEMS_SALUD].forEach(item => {
      itemsPreop[item.id] = { cumple: true, observacion: '' };
    });
    setItemsPreoperacional(itemsPreop);

    // Kit de derrame - todos Buenos
    const kitItems: Record<number, EstadoItemKitDerrame> = {};
    [...ITEMS_KIT_DERRAME, ...PREGUNTAS_KIT_DERRAME].forEach(item => {
      kitItems[item.id] = { estado: 'B', observacion: '' };
    });
    setItemsKitDerrame(kitItems);

    // Botiquín - todos Buenos con cantidad
    const botItems: Record<number, EstadoItemBotiquin> = {};
    ITEMS_BOTIQUIN.forEach(item => {
      botItems[item.id] = {
        estado: 'B',
        cantidad: item.cantidad.toString(),
        fechaVencimiento: item.tieneVencimiento ? '2027-08-01' : '',
        observacion: '',
      };
    });
    setItemsBotiquin(botItems);

    // Extintor - todos Buenos
    const extItems: Record<number, EstadoItemExtintor> = {};
    ITEMS_EXTINTOR.forEach(item => {
      extItems[item.id] = { estado: 'B', observacion: '' };
    });
    setItemsExtintor(extItems);

    // Fechas del extintor
    setFechaActualExtintor({ dia: '25', mes: '02', ano: '2026' });
    setFechaProximaRecarga({ dia: '25', mes: '02', ano: '2027' });

    // Observaciones
    setObservacionesGenerales('Prueba de inspección - todos los items OK');

    // Expandir todas las secciones
    setSeccionesExpandidas({ preoperacional: true, kitDerrame: true, botiquin: true, extintor: true });
    setPaginaActual(1);
  };

  const irAPagina = (pagina: number) => {
    setPaginaActual(pagina);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ==========================================
  // CREAR CONDUCTOR
  // ==========================================
  const handleCrearConductor = async () => {
    if (!nuevoConductor.nombreCompleto || !nuevoConductor.cedula) {
      alert('Nombre completo y cédula son obligatorios');
      return;
    }

    setCreandoConductor(true);
    try {
      const res = await fetch('/api/conductores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevoConductor),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Error al crear conductor');
      }

      // Agregar a la lista y seleccionar
      const nuevo = data.conductor as Conductor;
      setConductores(prev => [...prev, nuevo].sort((a, b) => a.nombreCompleto.localeCompare(b.nombreCompleto)));
      setConductorSeleccionado(nuevo);

      // Limpiar y cerrar modal
      setNuevoConductor({ nombreCompleto: '', cedula: '', telefono: '', email: '', edad: '', rh: '', eps: '', arl: '', fondoPension: '', categoriasLicencia: '' });
      setShowCrearConductor(false);
      alert(`Conductor "${nuevo.nombreCompleto}" creado exitosamente`);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Error al crear conductor');
    } finally {
      setCreandoConductor(false);
    }
  };

  // ==========================================
  // VALIDACIÓN Y ENVÍO
  // ==========================================
  const validarFormulario = (): boolean => {
    if (!conductorSeleccionado) {
      alert('Por favor seleccione un conductor');
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
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validarFormulario()) return;
    setIsLoading(true);

    try {
      const dataToSend = {
        conductor: {
          id: conductorSeleccionado?.codigoConductor || conductorSeleccionado?.id,
          cedula: conductorSeleccionado?.cedula,
          nombre: conductorSeleccionado?.nombreCompleto,
          edad: conductorSeleccionado?.edad,
          eps: conductorSeleccionado?.eps,
          arl: conductorSeleccionado?.arl,
          fondoPension: conductorSeleccionado?.fondoPension,
          rh: conductorSeleccionado?.rh,
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
        itemsVerificacion: itemsPreoperacional,
        kitDerrame: itemsKitDerrame,
        botiquin: itemsBotiquin,
        extintor: {
          items: itemsExtintor,
          fechaActual: fechaActualExtintor,
          fechaProximaRecarga: fechaProximaRecarga,
        },
        firma: firmaConductor,
        observacionesGenerales,
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

      alert(`Inspección registrada correctamente\n\nCódigo: ${result.data?.codigoInspeccion || 'Generado'}`);
      
      // Limpiar formulario
      setConductorSeleccionado(null);
      setVehiculo({ placa: '', marca: '', linea: '', modelo: '' });
      setRemolque({ placa: '', marca: '', clase: '', modelo: '' });
      setDocumentos({ soatCumple: null, soatVencimiento: '', revisionCumple: null, revisionVencimiento: '', polizaCumple: null, polizaVencimiento: '', licenciaCumple: null });
      setCategoriasSeleccionadas([]);
      setVigenciasLicencia({});
      setItemsPreoperacional({});
      setItemsKitDerrame({});
      setItemsBotiquin({});
      setItemsExtintor({});
      setFechaActualExtintor({ dia: '', mes: '', ano: '' });
      setFechaProximaRecarga({ dia: '', mes: '', ano: '' });
      setObservacionesGenerales('');
      limpiarFirma();
    } catch (error) {
      console.error('Error al guardar:', error);
      alert(`${error instanceof Error ? error.message : 'Error al guardar la inspección. Intente nuevamente.'}`);
    } finally {
      setIsLoading(false);
    }
  };

  // ==========================================
  // COMPONENTES DE RENDER
  // ==========================================
  const EstadoButton = ({ 
    estado, 
    selected, 
    onClick 
  }: { 
    estado: 'B' | 'R' | 'M' | 'NT'; 
    selected: boolean; 
    onClick: () => void;
  }) => {
    const colores = {
      B: 'bg-green-500 hover:bg-green-600',
      R: 'bg-yellow-500 hover:bg-yellow-600 text-black',
      M: 'bg-red-500 hover:bg-red-600',
      NT: 'bg-gray-500 hover:bg-gray-600',
    };
    const labels = { B: 'B', R: 'R', M: 'M', NT: 'NT' };
    
    return (
      <button
        type="button"
        onClick={onClick}
        className={`w-9 h-9 rounded-lg font-bold text-xs transition-all ${
          selected 
            ? `${colores[estado]} ring-2 ring-white scale-110 shadow-lg` 
            : 'bg-white/10 text-gray-400 hover:bg-white/20'
        }`}
      >
        {labels[estado]}
      </button>
    );
  };

  const renderItemPreoperacional = (item: { id: number; nombre: string }) => {
    const estado = itemsPreoperacional[item.id] || { cumple: null, observacion: '' };
    const requiereObservacion = estado.cumple === false;
    
    return (
      <div key={item.id} className="p-3 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors">
        <div className="flex items-start gap-3">
          <span className="flex-shrink-0 w-7 h-7 flex items-center justify-center bg-yellow-500/20 text-yellow-400 font-mono text-xs font-bold rounded">
            {item.id}
          </span>
          <div className="flex-1 min-w-0">
            <p className="text-gray-200 text-sm leading-relaxed mb-2">{item.nombre}</p>
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-3 bg-slate-800/50 rounded-lg px-2 py-1.5">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input 
                    type="radio" 
                    name={`preop-${item.id}`} 
                    checked={estado.cumple === true} 
                    onChange={() => handleItemPreoperacionalChange(item.id, 'cumple', true)} 
                    className="w-4 h-4 accent-green-500" 
                  />
                  <span className="text-green-400 text-xs font-medium">Sí</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input 
                    type="radio" 
                    name={`preop-${item.id}`} 
                    checked={estado.cumple === false} 
                    onChange={() => handleItemPreoperacionalChange(item.id, 'cumple', false)} 
                    className="w-4 h-4 accent-red-500" 
                  />
                  <span className="text-red-400 text-xs font-medium">No</span>
                </label>
              </div>
              <input
                type="text"
                value={estado.observacion || ''}
                onChange={(e) => handleItemPreoperacionalChange(item.id, 'observacion', e.target.value)}
                className={`flex-1 min-w-[120px] px-2 py-1.5 bg-white/5 border rounded text-white text-xs focus:outline-none transition-colors ${
                  requiereObservacion 
                    ? 'border-red-400/70 focus:border-red-500 bg-red-500/10' 
                    : 'border-white/10 focus:border-yellow-400'
                }`}
                placeholder={requiereObservacion ? 'Observación requerida' : 'Observación...'}
                required={requiereObservacion}
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderItemKitDerrame = (item: { id: number; nombre: string; cantidad?: number }) => {
    const estado = itemsKitDerrame[item.id] || { estado: null, observacion: '' };
    
    return (
      <div key={item.id} className="p-3 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          {item.cantidad && (
            <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-emerald-500/20 text-emerald-400 font-bold text-sm rounded">
              {item.cantidad}
            </span>
          )}
          <p className="flex-1 text-gray-200 text-sm font-medium">{item.nombre}</p>
          <div className="flex items-center gap-2">
            <EstadoButton estado="B" selected={estado.estado === 'B'} onClick={() => handleKitDerrameChange(item.id, 'estado', 'B')} />
            <EstadoButton estado="M" selected={estado.estado === 'M'} onClick={() => handleKitDerrameChange(item.id, 'estado', 'M')} />
            <EstadoButton estado="R" selected={estado.estado === 'R'} onClick={() => handleKitDerrameChange(item.id, 'estado', 'R')} />
            <EstadoButton estado="NT" selected={estado.estado === 'NT'} onClick={() => handleKitDerrameChange(item.id, 'estado', 'NT')} />
          </div>
          <input
            type="text"
            value={estado.observacion || ''}
            onChange={(e) => handleKitDerrameChange(item.id, 'observacion', e.target.value)}
            className="w-full sm:w-36 px-2 py-1.5 bg-white/5 border border-white/10 rounded text-white text-xs focus:outline-none focus:border-emerald-400"
            placeholder="Observación..."
          />
        </div>
      </div>
    );
  };

  const renderItemBotiquin = (item: { id: number; nombre: string; cantidad: number; tieneVencimiento?: boolean }) => {
    const estado = itemsBotiquin[item.id] || { estado: null, cantidad: '', fechaVencimiento: '', observacion: '' };
    
    return (
      <div key={item.id} className="p-3 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="flex-shrink-0 w-7 h-7 flex items-center justify-center bg-blue-500/20 text-blue-400 font-bold text-sm rounded">
              {item.cantidad}
            </span>
            <p className="flex-1 text-gray-200 text-sm font-medium">{item.nombre}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2 pl-9">
            <div className="flex items-center gap-1">
              <EstadoButton estado="B" selected={estado.estado === 'B'} onClick={() => handleBotiquinChange(item.id, 'estado', 'B')} />
              <EstadoButton estado="R" selected={estado.estado === 'R'} onClick={() => handleBotiquinChange(item.id, 'estado', 'R')} />
              <EstadoButton estado="M" selected={estado.estado === 'M'} onClick={() => handleBotiquinChange(item.id, 'estado', 'M')} />
              <EstadoButton estado="NT" selected={estado.estado === 'NT'} onClick={() => handleBotiquinChange(item.id, 'estado', 'NT')} />
            </div>
            <input
              type="number"
              value={estado.cantidad || ''}
              onChange={(e) => handleBotiquinChange(item.id, 'cantidad', e.target.value)}
              className="w-14 px-2 py-1.5 bg-white/5 border border-white/10 rounded text-white text-xs text-center focus:outline-none focus:border-blue-400"
              placeholder="Cant"
              min="0"
            />
            {item.tieneVencimiento && (
              <input
                type="date"
                value={estado.fechaVencimiento || ''}
                onChange={(e) => handleBotiquinChange(item.id, 'fechaVencimiento', e.target.value)}
                className="px-2 py-1.5 bg-white/5 border border-white/10 rounded text-white text-xs focus:outline-none focus:border-blue-400"
              />
            )}
            <input
              type="text"
              value={estado.observacion || ''}
              onChange={(e) => handleBotiquinChange(item.id, 'observacion', e.target.value)}
              className="flex-1 min-w-[80px] px-2 py-1.5 bg-white/5 border border-white/10 rounded text-white text-xs focus:outline-none focus:border-blue-400"
              placeholder="Obs..."
            />
          </div>
        </div>
      </div>
    );
  };

  const renderItemExtintor = (item: { id: number; nombre: string }) => {
    const estado = itemsExtintor[item.id] || { estado: null, observacion: '' };
    
    return (
      <div key={item.id} className="p-3 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          <p className="flex-1 text-gray-200 text-sm font-medium">{item.nombre}</p>
          <div className="flex items-center gap-2">
            <EstadoButton estado="B" selected={estado.estado === 'B'} onClick={() => handleExtintorChange(item.id, 'estado', 'B')} />
            <EstadoButton estado="R" selected={estado.estado === 'R'} onClick={() => handleExtintorChange(item.id, 'estado', 'R')} />
            <EstadoButton estado="M" selected={estado.estado === 'M'} onClick={() => handleExtintorChange(item.id, 'estado', 'M')} />
          </div>
          <input
            type="text"
            value={estado.observacion || ''}
            onChange={(e) => handleExtintorChange(item.id, 'observacion', e.target.value)}
            className="w-full sm:w-36 px-2 py-1.5 bg-white/5 border border-white/10 rounded text-white text-xs focus:outline-none focus:border-red-400"
            placeholder="Observación..."
          />
        </div>
      </div>
    );
  };

  const SeccionColapsable = ({ 
    titulo, 
    icono, 
    color, 
    seccionKey, 
    cantidadItems, 
    children 
  }: { 
    titulo: string; 
    icono: string; 
    color: string; 
    seccionKey: keyof typeof seccionesExpandidas; 
    cantidadItems: number;
    children: React.ReactNode;
  }) => (
    <section className={`backdrop-blur-xl bg-white/5 border border-${color}-500/30 rounded-xl p-4`}>
      <button
        type="button"
        onClick={() => toggleSeccion(seccionKey)}
        className="w-full flex items-center justify-between text-left"
      >
        <h2 className={`text-lg font-bold text-${color}-400 flex items-center gap-2`}>
          <span>{icono}</span>
          <span>{titulo}</span>
          <span className="text-xs font-normal text-gray-500">({cantidadItems} items)</span>
        </h2>
        <span className={`text-${color}-400 text-xl transition-transform ${seccionesExpandidas[seccionKey] ? 'rotate-180' : ''}`}>
          ▼
        </span>
      </button>
      {seccionesExpandidas[seccionKey] && (
        <div className="mt-4 space-y-2">
          {children}
        </div>
      )}
    </section>
  );

  // ==========================================
  // LOADING / AUTH CHECK
  // ==========================================
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-400">Verificando acceso...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black">
      <Navbar />
      <main className="pt-24 sm:pt-32 pb-8 sm:pb-16 px-3 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-7xl">
          
          {/* Header */}
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-4 sm:p-6 mb-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-3">
              <div className="text-center sm:text-left">
                <p className="text-gray-400 text-xs sm:text-sm">{INFO_FORMATO.empresa}</p>
                <p className="text-gray-500 text-xs">NIT: {INFO_FORMATO.nit}</p>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <span className="bg-white/10 px-2 py-1 rounded">{INFO_FORMATO.codigo}</span>
                <span className="bg-white/10 px-2 py-1 rounded">V.{INFO_FORMATO.version}</span>
                <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded">{user.nombre || user.cedula}</span>
              </div>
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-center bg-gradient-to-r from-yellow-400 to-emerald-400 bg-clip-text text-transparent mb-2">
              {INFO_FORMATO.titulo}
            </h1>
            <div className="flex items-center justify-center gap-3">
              <p className="text-gray-300 text-sm capitalize">{fechaActual || 'Cargando fecha...'}</p>
              <button
                type="button"
                onClick={preLlenarFormulario}
                className="px-3 py-1.5 bg-purple-500/20 text-purple-400 border border-purple-500/30 rounded-lg text-xs font-medium hover:bg-purple-500/30 transition-colors flex items-center gap-1.5"
                title="Pre-llenar todos los campos con datos de prueba"
              >
                <span>🧪</span>
                <span>Llenar para pruebas</span>
              </button>
            </div>
          </div>

          {/* Leyenda de Calificación */}
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-3 mb-6">
            <div className="flex flex-wrap items-center gap-4 justify-center">
              <span className="text-xs text-gray-400">Calificación:</span>
              {Object.entries(CALIFICACION_INFO).map(([key, info]) => (
                <div key={key} className="flex items-center gap-1">
                  <span className={`w-6 h-6 flex items-center justify-center rounded font-bold text-xs ${
                    key === 'B' ? 'bg-green-500' :
                    key === 'R' ? 'bg-yellow-500 text-black' :
                    key === 'M' ? 'bg-red-500' : 'bg-gray-500'
                  }`}>
                    {key}
                  </span>
                  <span className="text-gray-400 text-xs">{info.label}</span>
                </div>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* BARRA DE PROGRESO POR PASOS */}
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-gray-400">Paso {paginaActual} de {TOTAL_PAGINAS}</span>
                <span className="text-xs text-yellow-400 font-medium">{pasos[paginaActual - 1].label}</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2 mb-4">
                <div
                  className="bg-gradient-to-r from-yellow-400 to-emerald-400 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(paginaActual / TOTAL_PAGINAS) * 100}%` }}
                />
              </div>
              <div className="flex items-center justify-between">
                {pasos.map((paso) => (
                  <button
                    key={paso.num}
                    type="button"
                    onClick={() => irAPagina(paso.num)}
                    className="flex flex-col items-center gap-1 flex-1"
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                      paginaActual === paso.num
                        ? 'bg-yellow-400 text-black scale-110 shadow-lg shadow-yellow-400/30'
                        : paginaActual > paso.num
                          ? 'bg-emerald-500 text-white'
                          : 'bg-white/10 text-gray-500'
                    }`}>
                      {paginaActual > paso.num ? '✓' : paso.icono}
                    </div>
                    <span className={`text-xs hidden sm:block ${
                      paginaActual === paso.num ? 'text-yellow-400 font-medium' :
                      paginaActual > paso.num ? 'text-emerald-400' : 'text-gray-500'
                    }`}>
                      {paso.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* PÁGINA 1: DATOS GENERALES */}
            {paginaActual === 1 && (<>
            {/* SELECCIÓN DE CONDUCTOR */}
            <section className="backdrop-blur-xl bg-white/5 border border-yellow-500/30 rounded-xl p-4">
              <h2 className="text-lg font-bold text-yellow-400 mb-4 flex items-center gap-2">
                <span>👤</span>
                <span>Seleccionar Conductor</span>
              </h2>
              
              {loadingConductores ? (
                <div className="flex items-center gap-2 text-gray-400">
                  <div className="animate-spin w-5 h-5 border-2 border-yellow-400 border-t-transparent rounded-full"></div>
                  <span>Cargando conductores...</span>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1">Conductor <span className="text-red-400">*</span></label>
                    <select
                      value={conductorSeleccionado?.id || ''}
                      onChange={(e) => handleConductorChange(e.target.value)}
                      className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-yellow-400 transition-colors"
                      required
                    >
                      <option value="" className="bg-slate-800">-- Seleccione un conductor --</option>
                      {conductores.map(c => (
                        <option key={c.id} value={c.id} className="bg-slate-800">
                          {c.nombreCompleto} - CC: {c.cedula}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => setShowCrearConductor(true)}
                      className="mt-2 w-full px-3 py-2 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-lg text-sm font-medium hover:bg-emerald-500/30 transition-colors flex items-center justify-center gap-2"
                    >
                      <span className="text-lg">+</span>
                      <span>Crear Nuevo Conductor</span>
                    </button>
                  </div>
                  
                  {conductorSeleccionado && (
                    <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                      <h3 className="text-yellow-400 text-sm font-semibold mb-2">Datos del Conductor</h3>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div><span className="text-gray-400">Cédula:</span> <span className="text-white">{conductorSeleccionado.cedula}</span></div>
                        <div><span className="text-gray-400">Edad:</span> <span className="text-white">{conductorSeleccionado.edad || 'N/A'}</span></div>
                        <div><span className="text-gray-400">RH:</span> <span className="text-white">{conductorSeleccionado.rh || 'N/A'}</span></div>
                        <div><span className="text-gray-400">EPS:</span> <span className="text-white">{conductorSeleccionado.eps || 'N/A'}</span></div>
                        <div><span className="text-gray-400">ARL:</span> <span className="text-white">{conductorSeleccionado.arl || 'N/A'}</span></div>
                        <div><span className="text-gray-400">Fdo. Pensión:</span> <span className="text-white">{conductorSeleccionado.fondoPension || 'N/A'}</span></div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </section>

            {/* DATOS DEL VEHÍCULO */}
            <section className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-4">
              <h2 className="text-lg font-bold text-yellow-400 mb-4 flex items-center gap-2">
                <span>🚛</span>
                <span>Datos del Vehículo</span>
              </h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">Placa <span className="text-red-400">*</span></label>
                  <input 
                    type="text" 
                    value={vehiculo.placa} 
                    onChange={(e) => setVehiculo(prev => ({ ...prev, placa: e.target.value.toUpperCase() }))} 
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm uppercase focus:outline-none focus:border-yellow-400" 
                    placeholder="ABC123" 
                    required 
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">Marca</label>
                  <input 
                    type="text" 
                    value={vehiculo.marca} 
                    onChange={(e) => setVehiculo(prev => ({ ...prev, marca: e.target.value }))} 
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-yellow-400" 
                    placeholder="Kenworth..." 
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">Línea</label>
                  <input 
                    type="text" 
                    value={vehiculo.linea} 
                    onChange={(e) => setVehiculo(prev => ({ ...prev, linea: e.target.value }))} 
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-yellow-400" 
                    placeholder="T800..." 
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">Modelo</label>
                  <input 
                    type="text" 
                    value={vehiculo.modelo} 
                    onChange={(e) => setVehiculo(prev => ({ ...prev, modelo: e.target.value }))} 
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-yellow-400" 
                    placeholder="2024" 
                  />
                </div>
              </div>
            </section>

            {/* DATOS DEL REMOLQUE */}
            <section className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-4">
              <h2 className="text-lg font-bold text-yellow-400 mb-4 flex items-center gap-2">
                <span>🚚</span>
                <span>Datos del Remolque</span>
              </h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">Placa</label>
                  <input 
                    type="text" 
                    value={remolque.placa} 
                    onChange={(e) => setRemolque(prev => ({ ...prev, placa: e.target.value.toUpperCase() }))} 
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm uppercase focus:outline-none focus:border-yellow-400" 
                    placeholder="R12345" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">Marca</label>
                  <input 
                    type="text" 
                    value={remolque.marca} 
                    onChange={(e) => setRemolque(prev => ({ ...prev, marca: e.target.value }))} 
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-yellow-400" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">Clase</label>
                  <input 
                    type="text" 
                    value={remolque.clase} 
                    onChange={(e) => setRemolque(prev => ({ ...prev, clase: e.target.value }))} 
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-yellow-400" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">Modelo</label>
                  <input 
                    type="text" 
                    value={remolque.modelo} 
                    onChange={(e) => setRemolque(prev => ({ ...prev, modelo: e.target.value }))} 
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-yellow-400" 
                  />
                </div>
              </div>
            </section>

            {/* DOCUMENTOS */}
            <section className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-4">
              <h2 className="text-lg font-bold text-yellow-400 mb-4 flex items-center gap-2">
                <span>📄</span>
                <span>Documentos Requeridos</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* SOAT */}
                <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-200 font-medium text-sm">SOAT</span>
                    <div className="flex items-center gap-2">
                      <label className="flex items-center gap-1 cursor-pointer">
                        <input type="radio" name="soat" checked={documentos.soatCumple === true} onChange={() => setDocumentos(prev => ({ ...prev, soatCumple: true }))} className="w-3.5 h-3.5 accent-green-500" />
                        <span className="text-green-400 text-xs">Sí</span>
                      </label>
                      <label className="flex items-center gap-1 cursor-pointer">
                        <input type="radio" name="soat" checked={documentos.soatCumple === false} onChange={() => setDocumentos(prev => ({ ...prev, soatCumple: false }))} className="w-3.5 h-3.5 accent-red-500" />
                        <span className="text-red-400 text-xs">No</span>
                      </label>
                    </div>
                  </div>
                  <input type="date" value={documentos.soatVencimiento} onChange={(e) => setDocumentos(prev => ({ ...prev, soatVencimiento: e.target.value }))} className="w-full px-2 py-1.5 bg-white/5 border border-white/10 rounded text-white text-xs focus:outline-none focus:border-yellow-400" />
                </div>
                
                {/* RTM */}
                <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-200 font-medium text-sm">Revisión Técnico Mecánica</span>
                    <div className="flex items-center gap-2">
                      <label className="flex items-center gap-1 cursor-pointer">
                        <input type="radio" name="rtm" checked={documentos.revisionCumple === true} onChange={() => setDocumentos(prev => ({ ...prev, revisionCumple: true }))} className="w-3.5 h-3.5 accent-green-500" />
                        <span className="text-green-400 text-xs">Sí</span>
                      </label>
                      <label className="flex items-center gap-1 cursor-pointer">
                        <input type="radio" name="rtm" checked={documentos.revisionCumple === false} onChange={() => setDocumentos(prev => ({ ...prev, revisionCumple: false }))} className="w-3.5 h-3.5 accent-red-500" />
                        <span className="text-red-400 text-xs">No</span>
                      </label>
                    </div>
                  </div>
                  <input type="date" value={documentos.revisionVencimiento} onChange={(e) => setDocumentos(prev => ({ ...prev, revisionVencimiento: e.target.value }))} className="w-full px-2 py-1.5 bg-white/5 border border-white/10 rounded text-white text-xs focus:outline-none focus:border-yellow-400" />
                </div>
                
                {/* Póliza */}
                <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-200 font-medium text-sm">Póliza Todo Riesgo</span>
                    <div className="flex items-center gap-2">
                      <label className="flex items-center gap-1 cursor-pointer">
                        <input type="radio" name="poliza" checked={documentos.polizaCumple === true} onChange={() => setDocumentos(prev => ({ ...prev, polizaCumple: true }))} className="w-3.5 h-3.5 accent-green-500" />
                        <span className="text-green-400 text-xs">Sí</span>
                      </label>
                      <label className="flex items-center gap-1 cursor-pointer">
                        <input type="radio" name="poliza" checked={documentos.polizaCumple === false} onChange={() => setDocumentos(prev => ({ ...prev, polizaCumple: false }))} className="w-3.5 h-3.5 accent-red-500" />
                        <span className="text-red-400 text-xs">No</span>
                      </label>
                    </div>
                  </div>
                  <input type="date" value={documentos.polizaVencimiento} onChange={(e) => setDocumentos(prev => ({ ...prev, polizaVencimiento: e.target.value }))} className="w-full px-2 py-1.5 bg-white/5 border border-white/10 rounded text-white text-xs focus:outline-none focus:border-yellow-400" />
                </div>
                
                {/* Licencia */}
                <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-200 font-medium text-sm">Licencia de Conducción</span>
                    <div className="flex items-center gap-2">
                      <label className="flex items-center gap-1 cursor-pointer">
                        <input type="radio" name="licencia" checked={documentos.licenciaCumple === true} onChange={() => setDocumentos(prev => ({ ...prev, licenciaCumple: true }))} className="w-3.5 h-3.5 accent-green-500" />
                        <span className="text-green-400 text-xs">Sí</span>
                      </label>
                      <label className="flex items-center gap-1 cursor-pointer">
                        <input type="radio" name="licencia" checked={documentos.licenciaCumple === false} onChange={() => setDocumentos(prev => ({ ...prev, licenciaCumple: false }))} className="w-3.5 h-3.5 accent-red-500" />
                        <span className="text-red-400 text-xs">No</span>
                      </label>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {CATEGORIAS_LICENCIA.map(cat => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => handleCategoriaToggle(cat)}
                        className={`px-2 py-1 rounded text-xs font-medium transition-all ${
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
                    <div className="space-y-1">
                      {categoriasSeleccionadas.map(cat => (
                        <div key={cat} className="flex items-center gap-2">
                          <span className="text-xs text-gray-400 w-8">{cat}:</span>
                          <input type="date" value={vigenciasLicencia[cat] || ''} onChange={(e) => handleVigenciaChange(cat, e.target.value)} className="flex-1 px-2 py-1 bg-white/5 border border-white/10 rounded text-white text-xs focus:outline-none focus:border-yellow-400" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* CONDICIONES */}
            <section className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-4">
              <h2 className="text-lg font-bold text-yellow-400 mb-4 flex items-center gap-2">
                <span>⚙️</span>
                <span>Condiciones de Operación</span>
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">Horas dedicadas a dormir</label>
                  <input type="number" value={horasDormir} onChange={(e) => setHorasDormir(e.target.value)} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-yellow-400" min="0" max="24" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">Kilometraje Inicial</label>
                  <input type="number" value={kilometrajeInicial} onChange={(e) => setKilometrajeInicial(e.target.value)} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-yellow-400" />
                </div>
              </div>
            </section>

            </>)} {/* FIN PÁGINA 1 */}

            {/* PÁGINA 2: INSPECCIÓN PREOPERACIONAL */}
            {paginaActual === 2 && (
            <SeccionColapsable titulo="INSPECCIÓN PREOPERACIONAL" icono="🔍" color="yellow" seccionKey="preoperacional" cantidadItems={44}>
              <div className="space-y-4">
                <div>
                  <h3 className="text-yellow-400/80 text-sm font-semibold mb-2">Condiciones de Seguridad</h3>
                  <div className="space-y-2">{ITEMS_SEGURIDAD.map(item => renderItemPreoperacional(item))}</div>
                </div>
                <div>
                  <h3 className="text-yellow-400/80 text-sm font-semibold mb-2">Condiciones Generales</h3>
                  <div className="space-y-2">{ITEMS_GENERALES.map(item => renderItemPreoperacional(item))}</div>
                </div>
                <div>
                  <h3 className="text-yellow-400/80 text-sm font-semibold mb-2">Estado Mecánico</h3>
                  <div className="space-y-2">{ITEMS_MECANICOS.map(item => renderItemPreoperacional(item))}</div>
                </div>
                <div>
                  <h3 className="text-yellow-400/80 text-sm font-semibold mb-2">Correas</h3>
                  <div className="space-y-2">{ITEMS_CORREAS.map(item => renderItemPreoperacional(item))}</div>
                </div>
                <div>
                  <h3 className="text-yellow-400/80 text-sm font-semibold mb-2">Higiene</h3>
                  <div className="space-y-2">{ITEMS_HIGIENE.map(item => renderItemPreoperacional(item))}</div>
                </div>
                <div>
                  <h3 className="text-yellow-400/80 text-sm font-semibold mb-2">Condiciones de Salud</h3>
                  <div className="space-y-2">{ITEMS_SALUD.map(item => renderItemPreoperacional(item))}</div>
                </div>
              </div>
            </SeccionColapsable>
            )} {/* FIN PÁGINA 2 */}

            {/* PÁGINA 3: KIT DE DERRAME */}
            {paginaActual === 3 && (
            <SeccionColapsable titulo="KIT CONTROL DE DERRAME" icono="🛢️" color="emerald" seccionKey="kitDerrame" cantidadItems={21}>
              <div className="space-y-2">
                {ITEMS_KIT_DERRAME.map(item => renderItemKitDerrame(item))}
              </div>
              <div className="mt-4 pt-4 border-t border-white/10">
                <h3 className="text-amber-400 text-sm font-semibold mb-2">Preguntas de Verificación</h3>
                <div className="space-y-2">
                  {PREGUNTAS_KIT_DERRAME.map(item => (
                    <div key={item.id} className="p-3 bg-amber-500/10 rounded-lg border border-amber-500/30">
                      <p className="text-amber-200 text-sm mb-2">{item.nombre}</p>
                      <div className="flex flex-wrap items-center gap-2">
                        <div className="flex items-center gap-1">
                          <EstadoButton estado="B" selected={itemsKitDerrame[item.id]?.estado === 'B'} onClick={() => handleKitDerrameChange(item.id, 'estado', 'B')} />
                          <EstadoButton estado="M" selected={itemsKitDerrame[item.id]?.estado === 'M'} onClick={() => handleKitDerrameChange(item.id, 'estado', 'M')} />
                          <EstadoButton estado="R" selected={itemsKitDerrame[item.id]?.estado === 'R'} onClick={() => handleKitDerrameChange(item.id, 'estado', 'R')} />
                          <EstadoButton estado="NT" selected={itemsKitDerrame[item.id]?.estado === 'NT'} onClick={() => handleKitDerrameChange(item.id, 'estado', 'NT')} />
                        </div>
                        <input
                          type="text"
                          value={itemsKitDerrame[item.id]?.observacion || ''}
                          onChange={(e) => handleKitDerrameChange(item.id, 'observacion', e.target.value)}
                          className="flex-1 min-w-[100px] px-2 py-1.5 bg-white/5 border border-white/10 rounded text-white text-xs focus:outline-none focus:border-amber-400"
                          placeholder="Observación..."
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </SeccionColapsable>
            )} {/* FIN PÁGINA 3 */}

            {/* PÁGINA 4: BOTIQUÍN */}
            {paginaActual === 4 && (
            <SeccionColapsable titulo="BOTIQUÍN DE PRIMEROS AUXILIOS" icono="🩺" color="blue" seccionKey="botiquin" cantidadItems={22}>
              <div className="space-y-2">
                {ITEMS_BOTIQUIN.map(item => renderItemBotiquin(item))}
              </div>
            </SeccionColapsable>
            )} {/* FIN PÁGINA 4 */}

            {/* PÁGINA 5: EXTINTOR + OBSERVACIONES + FIRMA */}
            {paginaActual === 5 && (<>
            <SeccionColapsable titulo="EXTINTOR" icono="🧯" color="red" seccionKey="extintor" cantidadItems={10}>
              <div className="space-y-2">
                {ITEMS_EXTINTOR.map(item => renderItemExtintor(item))}
              </div>
              <div className="mt-4 pt-4 border-t border-white/10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3 bg-teal-500/10 rounded-lg border border-teal-500/30">
                    <h3 className="text-teal-400 font-semibold mb-2 text-sm">FECHA ACTUAL DEL EXTINTOR</h3>
                    <div className="grid grid-cols-3 gap-2">
                      <input type="number" value={fechaActualExtintor.dia} onChange={(e) => setFechaActualExtintor(prev => ({ ...prev, dia: e.target.value }))} className="w-full px-2 py-1.5 bg-white/5 border border-white/10 rounded text-white text-xs text-center focus:outline-none focus:border-teal-400" placeholder="DD" min="1" max="31" />
                      <input type="number" value={fechaActualExtintor.mes} onChange={(e) => setFechaActualExtintor(prev => ({ ...prev, mes: e.target.value }))} className="w-full px-2 py-1.5 bg-white/5 border border-white/10 rounded text-white text-xs text-center focus:outline-none focus:border-teal-400" placeholder="MM" min="1" max="12" />
                      <input type="number" value={fechaActualExtintor.ano} onChange={(e) => setFechaActualExtintor(prev => ({ ...prev, ano: e.target.value }))} className="w-full px-2 py-1.5 bg-white/5 border border-white/10 rounded text-white text-xs text-center focus:outline-none focus:border-teal-400" placeholder="AAAA" min="2020" max="2030" />
                    </div>
                  </div>
                  <div className="p-3 bg-orange-500/10 rounded-lg border border-orange-500/30">
                    <h3 className="text-orange-400 font-semibold mb-2 text-sm">FECHA PRÓXIMA RECARGA</h3>
                    <div className="grid grid-cols-3 gap-2">
                      <input type="number" value={fechaProximaRecarga.dia} onChange={(e) => setFechaProximaRecarga(prev => ({ ...prev, dia: e.target.value }))} className="w-full px-2 py-1.5 bg-white/5 border border-white/10 rounded text-white text-xs text-center focus:outline-none focus:border-orange-400" placeholder="DD" min="1" max="31" />
                      <input type="number" value={fechaProximaRecarga.mes} onChange={(e) => setFechaProximaRecarga(prev => ({ ...prev, mes: e.target.value }))} className="w-full px-2 py-1.5 bg-white/5 border border-white/10 rounded text-white text-xs text-center focus:outline-none focus:border-orange-400" placeholder="MM" min="1" max="12" />
                      <input type="number" value={fechaProximaRecarga.ano} onChange={(e) => setFechaProximaRecarga(prev => ({ ...prev, ano: e.target.value }))} className="w-full px-2 py-1.5 bg-white/5 border border-white/10 rounded text-white text-xs text-center focus:outline-none focus:border-orange-400" placeholder="AAAA" min="2020" max="2035" />
                    </div>
                  </div>
                </div>
              </div>
            </SeccionColapsable>

            {/* OBSERVACIONES GENERALES */}
            <section className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-4">
              <h2 className="text-lg font-bold text-gray-300 mb-3 flex items-center gap-2">
                <span>📝</span>
                <span>Observaciones Generales</span>
              </h2>
              <textarea
                value={observacionesGenerales}
                onChange={(e) => setObservacionesGenerales(e.target.value)}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-yellow-400 resize-none"
                rows={3}
                placeholder="Ingrese observaciones adicionales..."
              />
            </section>

            {/* FIRMA */}
            <section className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-4">
              <h2 className="text-lg font-bold text-yellow-400 mb-4 flex items-center gap-2">
                <span>✍️</span>
                <span>Firma del Responsable</span>
              </h2>
              <div className="max-w-md mx-auto">
                <div className="border-2 border-dashed border-white/20 rounded-xl p-3 bg-white">
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
                <div className="mt-2 flex justify-center">
                  <button
                    type="button"
                    onClick={limpiarFirma}
                    className="px-3 py-1.5 bg-red-500/20 text-red-400 rounded-lg text-xs font-medium hover:bg-red-500/30 transition-colors"
                  >
                    Limpiar Firma
                  </button>
                </div>
                {hasFirma && <p className="text-center text-green-400 text-xs mt-2">Firma capturada</p>}
              </div>
            </section>

            </>)} {/* FIN PÁGINA 5 */}

            {/* NAVEGACIÓN ENTRE PÁGINAS */}
            <div className="flex items-center justify-between gap-4 pt-2">
              {paginaActual > 1 ? (
                <button
                  type="button"
                  onClick={() => irAPagina(paginaActual - 1)}
                  className="flex items-center gap-2 px-6 py-3 bg-white/10 text-gray-300 border border-white/20 rounded-xl font-medium hover:bg-white/20 transition-all"
                >
                  ← Anterior
                </button>
              ) : (
                <div />
              )}
              {paginaActual < TOTAL_PAGINAS ? (
                <button
                  type="button"
                  onClick={() => irAPagina(paginaActual + 1)}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-yellow-400 to-emerald-500 text-black font-bold rounded-xl hover:shadow-lg hover:shadow-yellow-500/30 hover:scale-105 transition-all duration-300"
                >
                  Siguiente →
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-8 py-3 bg-gradient-to-r from-yellow-400 to-emerald-500 text-black font-bold text-lg rounded-xl hover:shadow-lg hover:shadow-yellow-500/30 hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Enviando...
                    </span>
                  ) : (
                    '✅ Enviar Inspección Completa'
                  )}
                </button>
              )}
            </div>
          </form>
        </div>
      </main>

      {/* MODAL CREAR CONDUCTOR */}
      {showCrearConductor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold text-emerald-400 flex items-center gap-2">
                <span>👤</span> Crear Nuevo Conductor
              </h2>
              <button
                type="button"
                onClick={() => setShowCrearConductor(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 text-gray-400 hover:bg-red-500/20 hover:text-red-400 transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-gray-400 mb-1">Nombre Completo <span className="text-red-400">*</span></label>
                  <input
                    type="text"
                    value={nuevoConductor.nombreCompleto}
                    onChange={(e) => setNuevoConductor(prev => ({ ...prev, nombreCompleto: e.target.value }))}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-emerald-400"
                    placeholder="Juan Pérez García"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">Cédula <span className="text-red-400">*</span></label>
                  <input
                    type="text"
                    value={nuevoConductor.cedula}
                    onChange={(e) => setNuevoConductor(prev => ({ ...prev, cedula: e.target.value }))}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-emerald-400"
                    placeholder="1234567890"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">Teléfono</label>
                  <input
                    type="text"
                    value={nuevoConductor.telefono}
                    onChange={(e) => setNuevoConductor(prev => ({ ...prev, telefono: e.target.value }))}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-emerald-400"
                    placeholder="3001234567"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-gray-400 mb-1">Email</label>
                  <input
                    type="email"
                    value={nuevoConductor.email}
                    onChange={(e) => setNuevoConductor(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-emerald-400"
                    placeholder="conductor@email.com"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">Edad</label>
                  <input
                    type="text"
                    value={nuevoConductor.edad}
                    onChange={(e) => setNuevoConductor(prev => ({ ...prev, edad: e.target.value }))}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-emerald-400"
                    placeholder="35"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">RH</label>
                  <select
                    value={nuevoConductor.rh}
                    onChange={(e) => setNuevoConductor(prev => ({ ...prev, rh: e.target.value }))}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-emerald-400"
                  >
                    <option value="" className="bg-slate-800">--</option>
                    {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map(rh => (
                      <option key={rh} value={rh} className="bg-slate-800">{rh}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">EPS</label>
                  <input
                    type="text"
                    value={nuevoConductor.eps}
                    onChange={(e) => setNuevoConductor(prev => ({ ...prev, eps: e.target.value }))}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-emerald-400"
                    placeholder="Sura, Sanitas..."
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">ARL</label>
                  <input
                    type="text"
                    value={nuevoConductor.arl}
                    onChange={(e) => setNuevoConductor(prev => ({ ...prev, arl: e.target.value }))}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-emerald-400"
                    placeholder="Sura, Positiva..."
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">Fondo de Pensión</label>
                  <input
                    type="text"
                    value={nuevoConductor.fondoPension}
                    onChange={(e) => setNuevoConductor(prev => ({ ...prev, fondoPension: e.target.value }))}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-emerald-400"
                    placeholder="Porvenir, Protección..."
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">Categorías Licencia</label>
                  <input
                    type="text"
                    value={nuevoConductor.categoriasLicencia}
                    onChange={(e) => setNuevoConductor(prev => ({ ...prev, categoriasLicencia: e.target.value }))}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-emerald-400"
                    placeholder="C1, C2, C3"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowCrearConductor(false)}
                  className="flex-1 px-4 py-2.5 bg-white/5 text-gray-400 border border-white/10 rounded-lg text-sm font-medium hover:bg-white/10 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleCrearConductor}
                  disabled={creandoConductor || !nuevoConductor.nombreCompleto || !nuevoConductor.cedula}
                  className="flex-1 px-4 py-2.5 bg-emerald-500 text-black rounded-lg text-sm font-bold hover:bg-emerald-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {creandoConductor ? (
                    <>
                      <div className="animate-spin w-4 h-4 border-2 border-black border-t-transparent rounded-full"></div>
                      Creando...
                    </>
                  ) : (
                    'Crear Conductor'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
