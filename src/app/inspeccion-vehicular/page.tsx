'use client';
import { useState, useEffect, useRef } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

// ==========================================
// CONFIGURACIÓN DEL FORMATO
// ==========================================
const INFO_FORMATO = {
  codigo: 'HSEQ-FOR-066',
  version: '001',
  fechaEdicion: '25-02-2026',
  empresa: 'TRANSPORTE Y LOGÍSTICA EQUINOX S.A.S.',
  nit: '901.870.510-5',
  titulo: 'INSPECCIÓN DE KIT DE DERRAME, BOTIQUÍN Y EXTINTOR',
};

// ==========================================
// ITEMS KIT DE DERRAME
// ==========================================
const ITEMS_KIT_DERRAME = [
  { id: 1, nombre: 'Paños Absorbentes', cantidad: 4 },
  { id: 2, nombre: 'Barrera Absorbente', cantidad: 2 },
  { id: 3, nombre: 'Traje Desechable', cantidad: 1 },
  { id: 4, nombre: 'Bolsa Roja para Recoger Residuos Contaminados', cantidad: 2 },
  { id: 5, nombre: 'Pala Plástica', cantidad: 1 },
  { id: 6, nombre: 'Espátula Plástica', cantidad: 1 },
  { id: 7, nombre: 'Guantes de Nitrilo', cantidad: 1 },
  { id: 8, nombre: 'Gafas Transparentes de Seguridad', cantidad: 1 },
  { id: 9, nombre: 'Cinta de Peligro', cantidad: 1 },
  { id: 10, nombre: 'Martillo de Goma', cantidad: 1 },
  { id: 11, nombre: 'Recogedor de Mano Plástico', cantidad: 1 },
  { id: 12, nombre: 'Respirador un Cartucho o Tapabocas N-95', cantidad: 1 },
  { id: 13, nombre: 'Linterna Recargable', cantidad: 1 },
  { id: 14, nombre: 'Bolsa Granulado Absorbente', cantidad: 1 },
  { id: 15, nombre: 'Masilla Epóxica', cantidad: 1 },
  { id: 16, nombre: 'Desengrasante Biodegradable', cantidad: 1 },
  { id: 17, nombre: 'Chaleco Antireflectivo', cantidad: 1 },
  { id: 18, nombre: 'Conos', cantidad: 1 },
];

const PREGUNTAS_KIT_DERRAME = [
  { id: 19, nombre: '¿El responsable del kit control de derrame conoce el procedimiento para usarlo?' },
  { id: 20, nombre: '¿El kit se encuentra almacenado en un lugar seco y protegido de agentes contaminantes?' },
  { id: 21, nombre: '¿La caneca o morral donde se guarda el kit se encuentra rotulado o señalizado?' },
];

// ==========================================
// ITEMS BOTIQUÍN
// ==========================================
const ITEMS_BOTIQUIN = [
  { id: 22, nombre: 'Gasas', cantidad: 10, tieneVencimiento: true },
  { id: 23, nombre: 'Esparadrapo', cantidad: 1, tieneVencimiento: true },
  { id: 24, nombre: 'Bajalenguas', cantidad: 10, tieneVencimiento: true },
  { id: 25, nombre: 'Guantes de Latex', cantidad: 5, tieneVencimiento: true },
  { id: 26, nombre: 'Aplicadores o Copitos', cantidad: 1, tieneVencimiento: true },
  { id: 27, nombre: 'Venda Elástica 2X5 Yardas', cantidad: 1, tieneVencimiento: true },
  { id: 28, nombre: 'Venda Elástica 3X5 Yardas', cantidad: 1, tieneVencimiento: true },
  { id: 29, nombre: 'Venda Elástica 5X5 Yardas', cantidad: 1, tieneVencimiento: true },
  { id: 30, nombre: 'Venda de Algodón 3X5 Yardas', cantidad: 1, tieneVencimiento: true },
  { id: 31, nombre: 'Venda de Algodón 5X5 Yardas', cantidad: 1, tieneVencimiento: true },
  { id: 32, nombre: 'Yodopovidona (Jabón Quirúrgico)', cantidad: 1, tieneVencimiento: true },
  { id: 33, nombre: 'Solución Salina 250 cc ó 500 cc', cantidad: 1, tieneVencimiento: true },
  { id: 34, nombre: 'Tapabocas', cantidad: 3, tieneVencimiento: true },
  { id: 35, nombre: 'Alcohol Antiséptico Frasco por 275 ml', cantidad: 1, tieneVencimiento: true },
  { id: 36, nombre: 'Curas', cantidad: 5, tieneVencimiento: true },
  { id: 37, nombre: 'Jeringa de 5 ml', cantidad: 1, tieneVencimiento: true },
  { id: 38, nombre: 'Tijeras de Trauma', cantidad: 1, tieneVencimiento: false },
  { id: 39, nombre: 'Parche Ocular', cantidad: 3, tieneVencimiento: true },
  { id: 40, nombre: 'Termómetro', cantidad: 1, tieneVencimiento: false },
  { id: 41, nombre: 'Libreta', cantidad: 1, tieneVencimiento: false },
  { id: 42, nombre: 'Lapicero', cantidad: 1, tieneVencimiento: false },
  { id: 43, nombre: 'Manual de Emergencia', cantidad: 1, tieneVencimiento: false },
];

// ==========================================
// ITEMS EXTINTOR
// ==========================================
const ITEMS_EXTINTOR = [
  { id: 44, nombre: 'Presión' },
  { id: 45, nombre: 'Sello de Garantía' },
  { id: 46, nombre: 'Manómetro' },
  { id: 47, nombre: 'Estado del Cilindro' },
  { id: 48, nombre: 'Manija' },
  { id: 49, nombre: 'Boquilla o Manguera' },
  { id: 50, nombre: 'Anillo de Seguridad' },
  { id: 51, nombre: 'Pin de Seguridad' },
  { id: 52, nombre: 'Pintura' },
  { id: 53, nombre: 'Tarjeta de Inspección' },
];

// Leyenda de calificaciones
const CALIFICACION_INFO = {
  B: { label: 'Bueno', color: 'green', description: 'El elemento está en perfecto estado' },
  R: { label: 'Regular', color: 'yellow', description: 'El elemento presenta desgaste o deterioro menor' },
  M: { label: 'Malo', color: 'red', description: 'El elemento requiere reemplazo inmediato' },
  NT: { label: 'No Tiene', color: 'gray', description: 'El elemento no se encuentra presente' },
};

// ==========================================
// STORAGE KEYS
// ==========================================
const STORAGE_KEY = 'equinox_conductor_datos';
const STORAGE_KEY_VEHICULO = 'equinox_vehiculo_datos';

// ==========================================
// INTERFACES
// ==========================================
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

export default function InspeccionVehicularPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [datosPreCargados, setDatosPreCargados] = useState(false);
  const [fechaActual, setFechaActual] = useState('');

  // Datos del conductor
  const [conductor, setConductor] = useState({
    nombreCompleto: '',
    cedula: '',
  });

  // Datos del vehículo
  const [vehiculo, setVehiculo] = useState({
    placa: '',
    marca: '',
    linea: '',
    modelo: '',
  });

  // Estados de inspección
  const [itemsKitDerrame, setItemsKitDerrame] = useState<Record<number, EstadoItemKitDerrame>>({});
  const [itemsBotiquin, setItemsBotiquin] = useState<Record<number, EstadoItemBotiquin>>({});
  const [itemsExtintor, setItemsExtintor] = useState<Record<number, EstadoItemExtintor>>({});

  // Fechas del extintor
  const [fechaActualExtintor, setFechaActualExtintor] = useState({ dia: '', mes: '', ano: '' });
  const [fechaProximaRecarga, setFechaProximaRecarga] = useState({ dia: '', mes: '', ano: '' });

  // Observaciones generales
  const [observacionesGenerales, setObservacionesGenerales] = useState('');

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

  // ==========================================
  // HANDLERS PARA KIT DE DERRAME
  // ==========================================
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

  // ==========================================
  // HANDLERS PARA BOTIQUÍN
  // ==========================================
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

  // ==========================================
  // HANDLERS PARA EXTINTOR
  // ==========================================
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
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validarFormulario()) return;
    setIsLoading(true);

    try {
      const dataToSend = {
        conductor: {
          cedula: conductor.cedula,
          nombre: conductor.nombreCompleto,
        },
        vehiculo: {
          placa: vehiculo.placa,
          marca: vehiculo.marca,
          linea: vehiculo.linea,
          modelo: vehiculo.modelo,
        },
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

      alert(`✅ Inspección registrada correctamente\n\nCódigo: ${result.data?.codigoInspeccion || 'Generado'}`);
      
      // Limpiar formulario
      setItemsKitDerrame({});
      setItemsBotiquin({});
      setItemsExtintor({});
      setFechaActualExtintor({ dia: '', mes: '', ano: '' });
      setFechaProximaRecarga({ dia: '', mes: '', ano: '' });
      setObservacionesGenerales('');
      limpiarFirma();
    } catch (error) {
      console.error('Error al guardar:', error);
      alert(`❌ ${error instanceof Error ? error.message : 'Error al guardar la inspección. Intente nuevamente.'}`);
    } finally {
      setIsLoading(false);
    }
  };

  // ==========================================
  // COMPONENTE DE BOTÓN DE ESTADO
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
        className={`w-10 h-10 rounded-lg font-bold text-sm transition-all ${
          selected 
            ? `${colores[estado]} ring-2 ring-white scale-110 shadow-lg` 
            : 'bg-white/10 text-gray-400 hover:bg-white/20'
        }`}
      >
        {labels[estado]}
      </button>
    );
  };

  // ==========================================
  // RENDER DE ITEM KIT DE DERRAME
  // ==========================================
  const renderItemKitDerrame = (item: { id: number; nombre: string; cantidad?: number }) => {
    const estado = itemsKitDerrame[item.id] || { estado: null, observacion: '' };
    
    return (
      <div key={item.id} className="p-3 sm:p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          {/* Cantidad */}
          {item.cantidad && (
            <span className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-emerald-500/20 text-emerald-400 font-bold text-lg rounded-lg">
              {item.cantidad}
            </span>
          )}
          
          {/* Nombre */}
          <div className="flex-1 min-w-0">
            <p className="text-gray-200 text-sm leading-relaxed font-medium">{item.nombre}</p>
          </div>
          
          {/* Estado */}
          <div className="flex items-center gap-2">
            <EstadoButton estado="B" selected={estado.estado === 'B'} onClick={() => handleKitDerrameChange(item.id, 'estado', 'B')} />
            <EstadoButton estado="M" selected={estado.estado === 'M'} onClick={() => handleKitDerrameChange(item.id, 'estado', 'M')} />
            <EstadoButton estado="R" selected={estado.estado === 'R'} onClick={() => handleKitDerrameChange(item.id, 'estado', 'R')} />
            <EstadoButton estado="NT" selected={estado.estado === 'NT'} onClick={() => handleKitDerrameChange(item.id, 'estado', 'NT')} />
          </div>
          
          {/* Observación */}
          <input
            type="text"
            value={estado.observacion || ''}
            onChange={(e) => handleKitDerrameChange(item.id, 'observacion', e.target.value)}
            className="w-full sm:w-48 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-yellow-400 transition-colors"
            placeholder="Observación..."
          />
        </div>
      </div>
    );
  };

  // ==========================================
  // RENDER DE PREGUNTA KIT DE DERRAME
  // ==========================================
  const renderPreguntaKitDerrame = (item: { id: number; nombre: string }) => {
    const estado = itemsKitDerrame[item.id] || { estado: null, observacion: '' };
    
    return (
      <div key={item.id} className="p-3 sm:p-4 bg-amber-500/10 rounded-lg border border-amber-500/30">
        <div className="flex flex-col gap-3">
          <p className="text-amber-200 text-sm leading-relaxed font-medium">{item.nombre}</p>
          <div className="flex flex-wrap items-center gap-3">
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
              className="flex-1 min-w-[150px] px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-yellow-400"
              placeholder="Observación..."
            />
          </div>
        </div>
      </div>
    );
  };

  // ==========================================
  // RENDER DE ITEM BOTIQUÍN
  // ==========================================
  const renderItemBotiquin = (item: { id: number; nombre: string; cantidad: number; tieneVencimiento?: boolean }) => {
    const estado = itemsBotiquin[item.id] || { estado: null, cantidad: '', fechaVencimiento: '', observacion: '' };
    
    return (
      <div key={item.id} className="p-3 sm:p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            {/* Cantidad requerida */}
            <span className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-blue-500/20 text-blue-400 font-bold text-lg rounded-lg">
              {item.cantidad}
            </span>
            
            {/* Nombre */}
            <p className="flex-1 text-gray-200 text-sm leading-relaxed font-medium">{item.nombre}</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3 pl-0 sm:pl-13">
            {/* Estado */}
            <div className="flex items-center gap-2">
              <EstadoButton estado="B" selected={estado.estado === 'B'} onClick={() => handleBotiquinChange(item.id, 'estado', 'B')} />
              <EstadoButton estado="R" selected={estado.estado === 'R'} onClick={() => handleBotiquinChange(item.id, 'estado', 'R')} />
              <EstadoButton estado="M" selected={estado.estado === 'M'} onClick={() => handleBotiquinChange(item.id, 'estado', 'M')} />
              <EstadoButton estado="NT" selected={estado.estado === 'NT'} onClick={() => handleBotiquinChange(item.id, 'estado', 'NT')} />
            </div>
            
            {/* Cantidad actual */}
            <div className="flex items-center gap-1">
              <span className="text-xs text-gray-400">Cant:</span>
              <input
                type="number"
                value={estado.cantidad || ''}
                onChange={(e) => handleBotiquinChange(item.id, 'cantidad', e.target.value)}
                className="w-16 px-2 py-1.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm text-center focus:outline-none focus:border-yellow-400"
                placeholder="0"
                min="0"
              />
            </div>
            
            {/* Fecha de vencimiento */}
            {item.tieneVencimiento && (
              <div className="flex items-center gap-1">
                <span className="text-xs text-gray-400">Vence:</span>
                <input
                  type="date"
                  value={estado.fechaVencimiento || ''}
                  onChange={(e) => handleBotiquinChange(item.id, 'fechaVencimiento', e.target.value)}
                  className="px-2 py-1.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-yellow-400"
                />
              </div>
            )}
            
            {/* Observación */}
            <input
              type="text"
              value={estado.observacion || ''}
              onChange={(e) => handleBotiquinChange(item.id, 'observacion', e.target.value)}
              className="flex-1 min-w-[120px] px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-yellow-400"
              placeholder="Observación..."
            />
          </div>
        </div>
      </div>
    );
  };

  // ==========================================
  // RENDER DE ITEM EXTINTOR
  // ==========================================
  const renderItemExtintor = (item: { id: number; nombre: string }) => {
    const estado = itemsExtintor[item.id] || { estado: null, observacion: '' };
    
    return (
      <div key={item.id} className="p-3 sm:p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          {/* Nombre */}
          <div className="flex-1 min-w-0">
            <p className="text-gray-200 text-sm leading-relaxed font-medium">{item.nombre}</p>
          </div>
          
          {/* Estado */}
          <div className="flex items-center gap-2">
            <EstadoButton estado="B" selected={estado.estado === 'B'} onClick={() => handleExtintorChange(item.id, 'estado', 'B')} />
            <EstadoButton estado="R" selected={estado.estado === 'R'} onClick={() => handleExtintorChange(item.id, 'estado', 'R')} />
            <EstadoButton estado="M" selected={estado.estado === 'M'} onClick={() => handleExtintorChange(item.id, 'estado', 'M')} />
          </div>
          
          {/* Observación */}
          <input
            type="text"
            value={estado.observacion || ''}
            onChange={(e) => handleExtintorChange(item.id, 'observacion', e.target.value)}
            className="w-full sm:w-48 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-yellow-400 transition-colors"
            placeholder="Observación..."
          />
        </div>
      </div>
    );
  };

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
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-center bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent mb-1 sm:mb-2 md:mb-4 leading-tight">
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

          {/* Leyenda de Calificación */}
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-4 mb-6">
            <h3 className="text-sm font-semibold text-gray-300 mb-3">Leyenda de Calificación:</h3>
            <div className="flex flex-wrap gap-4">
              {Object.entries(CALIFICACION_INFO).map(([key, info]) => (
                <div key={key} className="flex items-center gap-2">
                  <span className={`w-8 h-8 flex items-center justify-center rounded-lg font-bold text-sm ${
                    key === 'B' ? 'bg-green-500' :
                    key === 'R' ? 'bg-yellow-500 text-black' :
                    key === 'M' ? 'bg-red-500' : 'bg-gray-500'
                  }`}>
                    {key}
                  </span>
                  <span className="text-gray-400 text-sm">{info.label}</span>
                </div>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
            
            {/* 1. DATOS DEL CONDUCTOR */}
            <section className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-6">
              <h2 className="text-xl sm:text-2xl font-bold text-emerald-400 mb-4 sm:mb-6 flex items-center gap-2">
                <span>👤</span>
                <span>Datos del Responsable</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-400 mb-1">Nombre Completo <span className="text-red-400">*</span></label>
                  <input 
                    type="text" 
                    value={conductor.nombreCompleto} 
                    onChange={(e) => setConductor(prev => ({ ...prev, nombreCompleto: e.target.value }))} 
                    className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-emerald-400 transition-colors" 
                    placeholder="Nombre completo" 
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
                    className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-emerald-400 transition-colors" 
                    placeholder="Número de cédula" 
                    required 
                  />
                </div>
              </div>
            </section>

            {/* 2. DATOS DEL VEHÍCULO */}
            <section className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-6">
              <h2 className="text-xl sm:text-2xl font-bold text-emerald-400 mb-4 sm:mb-6 flex items-center gap-2">
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
                    className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm uppercase focus:outline-none focus:border-emerald-400 transition-colors" 
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
                    className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-emerald-400 transition-colors" 
                    placeholder="Kenworth, Freightliner..." 
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-400 mb-1">Línea</label>
                  <input 
                    type="text" 
                    value={vehiculo.linea} 
                    onChange={(e) => setVehiculo(prev => ({ ...prev, linea: e.target.value }))} 
                    className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-emerald-400 transition-colors" 
                    placeholder="T800, Cascadia..." 
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-400 mb-1">Modelo (Año)</label>
                  <input 
                    type="text" 
                    value={vehiculo.modelo} 
                    onChange={(e) => setVehiculo(prev => ({ ...prev, modelo: e.target.value }))} 
                    className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-emerald-400 transition-colors" 
                    placeholder="2024" 
                  />
                </div>
              </div>
            </section>

            {/* 3. KIT DE DERRAME */}
            <section className="backdrop-blur-xl bg-white/5 border border-emerald-500/30 rounded-xl sm:rounded-2xl p-4 sm:p-6">
              <h2 className="text-xl sm:text-2xl font-bold text-emerald-400 mb-2 flex items-center gap-2">
                <span>🛢️</span>
                <span>KIT CONTROL DE DERRAME</span>
              </h2>
              <p className="text-gray-400 text-sm mb-4">Inspección de elementos del kit de control de derrames</p>
              
              <div className="space-y-3">
                {ITEMS_KIT_DERRAME.map(item => renderItemKitDerrame(item))}
              </div>

              {/* Preguntas del Kit de Derrame */}
              <div className="mt-6 pt-6 border-t border-white/10">
                <h3 className="text-lg font-semibold text-amber-400 mb-4 flex items-center gap-2">
                  <span>❓</span>
                  <span>Preguntas de Verificación</span>
                </h3>
                <div className="space-y-3">
                  {PREGUNTAS_KIT_DERRAME.map(item => renderPreguntaKitDerrame(item))}
                </div>
              </div>
            </section>

            {/* 4. BOTIQUÍN */}
            <section className="backdrop-blur-xl bg-white/5 border border-blue-500/30 rounded-xl sm:rounded-2xl p-4 sm:p-6">
              <h2 className="text-xl sm:text-2xl font-bold text-blue-400 mb-2 flex items-center gap-2">
                <span>🩺</span>
                <span>BOTIQUÍN DE PRIMEROS AUXILIOS</span>
              </h2>
              <p className="text-gray-400 text-sm mb-4">Verificación de elementos y fechas de vencimiento</p>
              
              <div className="space-y-3">
                {ITEMS_BOTIQUIN.map(item => renderItemBotiquin(item))}
              </div>
            </section>

            {/* 5. EXTINTOR */}
            <section className="backdrop-blur-xl bg-white/5 border border-red-500/30 rounded-xl sm:rounded-2xl p-4 sm:p-6">
              <h2 className="text-xl sm:text-2xl font-bold text-red-400 mb-2 flex items-center gap-2">
                <span>🧯</span>
                <span>EXTINTOR</span>
              </h2>
              <p className="text-gray-400 text-sm mb-4">Inspección de aspectos del extintor</p>
              
              <div className="space-y-3">
                {ITEMS_EXTINTOR.map(item => renderItemExtintor(item))}
              </div>

              {/* Fechas del Extintor */}
              <div className="mt-6 pt-6 border-t border-white/10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Fecha Actual del Extintor */}
                  <div className="p-4 bg-teal-500/10 rounded-lg border border-teal-500/30">
                    <h3 className="text-teal-400 font-semibold mb-3 text-sm">FECHA ACTUAL DEL EXTINTOR</h3>
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">Día</label>
                        <input
                          type="number"
                          value={fechaActualExtintor.dia}
                          onChange={(e) => setFechaActualExtintor(prev => ({ ...prev, dia: e.target.value }))}
                          className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm text-center focus:outline-none focus:border-teal-400"
                          placeholder="DD"
                          min="1"
                          max="31"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">Mes</label>
                        <input
                          type="number"
                          value={fechaActualExtintor.mes}
                          onChange={(e) => setFechaActualExtintor(prev => ({ ...prev, mes: e.target.value }))}
                          className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm text-center focus:outline-none focus:border-teal-400"
                          placeholder="MM"
                          min="1"
                          max="12"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">Año</label>
                        <input
                          type="number"
                          value={fechaActualExtintor.ano}
                          onChange={(e) => setFechaActualExtintor(prev => ({ ...prev, ano: e.target.value }))}
                          className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm text-center focus:outline-none focus:border-teal-400"
                          placeholder="AAAA"
                          min="2020"
                          max="2030"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Fecha Próxima Recarga */}
                  <div className="p-4 bg-orange-500/10 rounded-lg border border-orange-500/30">
                    <h3 className="text-orange-400 font-semibold mb-3 text-sm">FECHA PRÓXIMA RECARGA</h3>
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">Día</label>
                        <input
                          type="number"
                          value={fechaProximaRecarga.dia}
                          onChange={(e) => setFechaProximaRecarga(prev => ({ ...prev, dia: e.target.value }))}
                          className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm text-center focus:outline-none focus:border-orange-400"
                          placeholder="DD"
                          min="1"
                          max="31"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">Mes</label>
                        <input
                          type="number"
                          value={fechaProximaRecarga.mes}
                          onChange={(e) => setFechaProximaRecarga(prev => ({ ...prev, mes: e.target.value }))}
                          className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm text-center focus:outline-none focus:border-orange-400"
                          placeholder="MM"
                          min="1"
                          max="12"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">Año</label>
                        <input
                          type="number"
                          value={fechaProximaRecarga.ano}
                          onChange={(e) => setFechaProximaRecarga(prev => ({ ...prev, ano: e.target.value }))}
                          className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm text-center focus:outline-none focus:border-orange-400"
                          placeholder="AAAA"
                          min="2020"
                          max="2035"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* OBSERVACIONES GENERALES */}
            <section className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-300 mb-4 flex items-center gap-2">
                <span>📝</span>
                <span>Observaciones Generales</span>
              </h2>
              <textarea
                value={observacionesGenerales}
                onChange={(e) => setObservacionesGenerales(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-emerald-400 transition-colors resize-none"
                rows={4}
                placeholder="Ingrese cualquier observación adicional sobre la inspección..."
              />
            </section>

            {/* FIRMA DEL RESPONSABLE */}
            <section className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-6">
              <h2 className="text-xl sm:text-2xl font-bold text-emerald-400 mb-4 sm:mb-6 flex items-center gap-2">
                <span>✍️</span>
                <span>Firma del Responsable</span>
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
                className="px-8 py-4 bg-gradient-to-r from-emerald-400 to-teal-500 text-black font-bold text-lg rounded-xl hover:shadow-lg hover:shadow-emerald-500/30 hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
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
