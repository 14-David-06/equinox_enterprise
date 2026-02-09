'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface Inspeccion {
  id: string;
  createdAt: string;
  // Propiedades mapeadas
  nombreConductor: string;
  cedula: string;
  edad: string;
  rh: string;
  arl: string;
  eps: string;
  fondoPension: string;
  placaVehiculo: string;
  marcaVehiculo: string;
  lineaVehiculo: string;
  modeloVehiculo: string;
  placaRemolque: string | null;
  marcaRemolque: string | null;
  claseRemolque: string | null;
  modeloRemolque: string | null;
  horasDormir: string;
  // Salud (extraídas de Items Verificacion items 42-46)
  descansoAppropiado: string;
  tomaMedicacion: string;
  ansiedadEstres: string;
  problemasVisuales: string;
  estadoSalud: string;
  // Documentos
  soatEstado: string;
  soatVencimiento: string | null;
  revisionTecnicaEstado: string;
  revisionTecnicaVencimiento: string | null;
  polizaEstado: string;
  polizaVencimiento: string | null;
  licenciaEstado: string;
  licenciaVencimiento: string | null;
  categorias: string | null;
  // Estado preoperacional
  estadoPreoperacional: string;
  docPreoperacional: string | null;
  // Items verificacion raw
  itemsVerificacion: Record<string, { cumple: boolean | null; observacion: string }>;
  itemsNoCumplen: number;
  // Revisión HSEQ
  firmaHSEQ: string | null;
  nombreHSEQ: string | null;
  fechaRevision: string | null;
  observacionesRevision: string | null;
  // Fecha inspeccion
  fechaInspeccion: string | null;
  codigoInspeccion: string | null;
}

interface User {
  id: string;
  nombre: string;
  cedula: string;
  rol: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [inspecciones, setInspecciones] = useState<Inspeccion[]>([]);
  const [loading, setLoading] = useState(true);
  const [authChecking, setAuthChecking] = useState(true);
  
  // Estados para filtros y vista
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInspection, setSelectedInspection] = useState<Inspeccion | null>(null);
  const [filterBy, setFilterBy] = useState<'all' | 'today' | 'week' | 'month'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'conductor' | 'placa'>('date');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  // Estados para revisión HSEQ
  const [reviewMode, setReviewMode] = useState(false);
  const [reviewAction, setReviewAction] = useState<'Aprobado' | 'Rechazado' | null>(null);
  const [reviewObservaciones, setReviewObservaciones] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);
  const [firmaHSEQData, setFirmaHSEQData] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  // Verificar autenticación
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/me', { credentials: 'include' });
        const data = await res.json();
        
        if (!data.authenticated) {
          router.push('/login');
          return;
        }
        
        setUser(data.user);
      } catch (error) {
        // Error de autenticación - redirigir silenciosamente
        router.push('/login');
      } finally {
        setAuthChecking(false);
      }
    };

    checkAuth();
  }, [router]);

  // Cargar inspecciones
  useEffect(() => {
    const loadInspecciones = async () => {
      if (!user) return;
      
      try {
        const res = await fetch('/api/inspecciones', { credentials: 'include' });
        
        if (!res.ok) {
          throw new Error('Error al cargar inspecciones');
        }
        
        const data = await res.json();
        
        // Mapear los datos de Airtable a las propiedades planas que espera el dashboard
        const inspeccionesMapeadas = data.map((record: any) => {
          // Parsear Items Verificacion para extraer salud (items 42-46)
          let itemsVerificacion: Record<string, { cumple: boolean | null; observacion: string }> = {};
          try {
            const raw = record['Items Verificacion'];
            itemsVerificacion = typeof raw === 'string' ? JSON.parse(raw) : (raw || {});
          } catch { /* ignore */ }
          
          // Extraer datos de salud de items 42-46
          const item42 = itemsVerificacion['42']; // Descanso apropiado
          const item43 = itemsVerificacion['43']; // Bajo tratamiento medico
          const item44 = itemsVerificacion['44']; // Ansiedad/depresion
          const item45 = itemsVerificacion['45']; // Trastorno visual
          const item46 = itemsVerificacion['46']; // Condiciones de salud
          
          const descansoAppropiado = item42 ? (item42.cumple ? 'Sí' : 'No') : 'N/A';
          const tomaMedicacion = item43 ? (item43.cumple ? 'Sí' : 'No') : 'No';
          const ansiedadEstres = item44 ? (item44.cumple ? 'No' : 'Sí') : 'No';
          const problemasVisuales = item45 ? (item45.cumple ? 'No' : 'Sí') : 'No';
          const estadoSalud = item46 ? (item46.cumple ? 'Bueno' : 'Malo') : 'Bueno';
          
          // Contar items no cumplen
          const itemsNoCumplen = Object.values(itemsVerificacion).filter(
            (item: any) => item.cumple === false
          ).length;

          // Doc preoperacional
          const docField = record['Doc Preoperacional'];
          let docUrl: string | null = null;
          if (Array.isArray(docField) && docField.length > 0) {
            docUrl = docField[0].url;
          }

          return {
            id: record.id,
            createdAt: record['Fecha Creacion'] || record['Fecha Inspeccion'] || '',
            // Conductor
            nombreConductor: record['Conductor Nombre'] || 'Sin nombre',
            cedula: record['Conductor Cedula'] || 'Sin cédula',
            edad: record['Conductor Edad'] || 'N/A',
            rh: record['RH'] || 'N/A',
            arl: record['ARL'] || 'N/A',
            eps: record['EPS'] || 'N/A',
            fondoPension: record['Fondo Pension'] || 'N/A',
            // Vehículo
            placaVehiculo: record['Vehiculo Placa'] || 'Sin placa',
            marcaVehiculo: record['Vehiculo Marca'] || 'N/A',
            lineaVehiculo: record['Vehiculo Linea'] || 'N/A',
            modeloVehiculo: record['Vehiculo Modelo'] || 'N/A',
            // Remolque
            placaRemolque: record['Remolque Placa'] || null,
            marcaRemolque: record['Remolque Marca'] || null,
            claseRemolque: record['Remolque Clase'] || null,
            modeloRemolque: record['Remolque Modelo'] || null,
            // Condiciones de salud (extraídas de Items Verificacion)
            horasDormir: record['Horas Dormir'] || null,
            descansoAppropiado,
            tomaMedicacion,
            ansiedadEstres,
            problemasVisuales,
            estadoSalud,
            // Estados de documentos
            soatEstado: record['SOAT Cumple'] ? 'Vigente' : 'Vencido',
            soatVencimiento: record['SOAT Vencimiento'] || null,
            revisionTecnicaEstado: record['RTM Cumple'] ? 'Vigente' : 'Vencido',
            revisionTecnicaVencimiento: record['RTM Vencimiento'] || null,
            polizaEstado: record['Poliza Cumple'] ? 'Vigente' : 'Vencido',
            polizaVencimiento: record['Poliza Vencimiento'] || null,
            licenciaEstado: record['Licencia Cumple'] ? 'Vigente' : 'Vencido',
            licenciaVencimiento: record['Licencia Vencimiento'] || null,
            // Categorías
            categorias: (() => {
              const cats = record['Categorias Licencia'];
              if (!cats) return null;
              if (Array.isArray(cats)) return cats.join(', ');
              if (typeof cats === 'string') {
                try {
                  const parsed = JSON.parse(cats);
                  return Array.isArray(parsed) ? parsed.join(', ') : cats;
                } catch { return cats; }
              }
              return null;
            })(),
            // Estado preoperacional
            estadoPreoperacional: record['Estado Preoperacional'] || 'Solicitado',
            docPreoperacional: docUrl,
            // Items
            itemsVerificacion,
            itemsNoCumplen,
            // Revisión HSEQ
            firmaHSEQ: record['Firma HSEQ'] || null,
            nombreHSEQ: record['Nombre HSEQ'] || null,
            fechaRevision: record['Fecha Revision'] || null,
            observacionesRevision: record['Observaciones Revision'] || null,
            // Fecha
            fechaInspeccion: record['Fecha Inspeccion'] || null,
            codigoInspeccion: record['Codigo Inspeccion'] || null,
          };
        });
        
        setInspecciones(inspeccionesMapeadas);
      } catch (error) {
        console.error('Error al cargar inspecciones:', error);
        // Error al cargar inspecciones - continuar con array vacío
      } finally {
        setLoading(false);
      }
    };

    loadInspecciones();
  }, [user]);

  // Canvas drawing functions for HSEQ signature - must be before early returns
  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, []);

  if (authChecking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto mb-4"></div>
          <p className="text-white">Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black">
        <Navbar />
        <div className="pt-32 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto mb-4"></div>
            <p className="text-white">Cargando inspecciones...</p>
          </div>
        </div>
      </div>
    );
  }

  // Funciones de filtrado y ordenamiento
  const getFilteredInspecciones = () => {
    let filtered = inspecciones;
    
    // Filtrar por búsqueda
    if (searchTerm) {
      filtered = filtered.filter(insp => 
        insp.nombreConductor?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        insp.cedula?.includes(searchTerm) ||
        insp.placaVehiculo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        insp.marcaVehiculo?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filtrar por fecha
    if (filterBy !== 'all') {
      const now = new Date();
      filtered = filtered.filter(insp => {
        const created = new Date(insp.createdAt);
        switch (filterBy) {
          case 'today':
            return created.toDateString() === now.toDateString();
          case 'week':
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            return created >= weekAgo;
          case 'month':
            return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
          default:
            return true;
        }
      });
    }
    
    // Ordenar - Solicitado (pendiente de revisión) primero, luego por criterio seleccionado
    filtered.sort((a, b) => {
      // Primero: pendientes de revisión arriba
      const aIsPending = a.estadoPreoperacional === 'Solicitado' ? 0 : 1;
      const bIsPending = b.estadoPreoperacional === 'Solicitado' ? 0 : 1;
      if (aIsPending !== bIsPending) return aIsPending - bIsPending;
      
      switch (sortBy) {
        case 'date':
          return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
        case 'conductor':
          return (a.nombreConductor || '').localeCompare(b.nombreConductor || '');
        case 'placa':
          return (a.placaVehiculo || '').localeCompare(b.placaVehiculo || '');
        default:
          return 0;
      }
    });
    
    return filtered;
  };

  const filteredInspecciones = getFilteredInspecciones();
  const totalPages = Math.ceil(filteredInspecciones.length / itemsPerPage);
  const paginatedInspecciones = filteredInspecciones.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getStatusBadge = (status?: string) => {
    if (!status) return <span className="px-2 py-1 rounded-full text-xs bg-gray-500/20 text-gray-400">Sin datos</span>;
    
    const statusColors = {
      'Vigente': 'bg-green-500/20 text-green-400',
      'Vencido': 'bg-red-500/20 text-red-400',
      'Por vencer': 'bg-yellow-500/20 text-yellow-400',
      'Bueno': 'bg-green-500/20 text-green-400',
      'Regular': 'bg-yellow-500/20 text-yellow-400',
      'Malo': 'bg-red-500/20 text-red-400',
      'Sí': 'bg-red-500/20 text-red-400',
      'No': 'bg-green-500/20 text-green-400'
    };
    
    const colorClass = statusColors[status as keyof typeof statusColors] || 'bg-gray-500/20 text-gray-400';
    return <span className={`px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}>{status}</span>;
  };

  const getEstadoBadge = (estado: string) => {
    const colors: Record<string, string> = {
      'Solicitado': 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
      'Aprobado': 'bg-green-500/20 text-green-400 border border-green-500/30',
      'Rechazado': 'bg-red-500/20 text-red-400 border border-red-500/30',
    };
    const colorClass = colors[estado] || 'bg-gray-500/20 text-gray-400 border border-gray-500/30';
    return <span className={`px-2 py-1 rounded-full text-xs font-semibold ${colorClass}`}>{estado}</span>;
  };

  // Canvas coordinate helper - accounts for CSS scaling vs internal resolution
  const getCanvasCoords = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    if ('touches' in e) {
      const touch = e.touches[0];
      return { x: (touch.clientX - rect.left) * scaleX, y: (touch.clientY - rect.top) * scaleY };
    }
    return { x: (e.clientX - rect.left) * scaleX, y: (e.clientY - rect.top) * scaleY };
  };

  // Canvas drawing event handlers
  const startDraw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    setIsDrawing(true);
    const { x, y } = getCanvasCoords(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const { x, y } = getCanvasCoords(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDraw = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) {
      setFirmaHSEQData(canvas.toDataURL('image/png'));
    }
  };

  const clearCanvas = () => {
    setFirmaHSEQData(null);
    initCanvas();
  };

  const handleReview = async () => {
    if (!selectedInspection || !reviewAction || !firmaHSEQData) return;
    
    setReviewLoading(true);
    try {
      const res = await fetch('/api/preoperacional/review', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          recordId: selectedInspection.id,
          accion: reviewAction,
          firmaHSEQ: firmaHSEQData,
          observaciones: reviewObservaciones,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al procesar');

      // Actualizar la inspección localmente con el nuevo PDF y estado
      setInspecciones(prev => prev.map(insp => 
        insp.id === selectedInspection.id 
          ? { 
              ...insp, 
              estadoPreoperacional: reviewAction, 
              nombreHSEQ: user?.nombre || 'HSEQ', 
              fechaRevision: new Date().toISOString().split('T')[0],
              docPreoperacional: data.data?.pdfUrl || insp.docPreoperacional,
            }
          : insp
      ));

      alert(`Inspección ${reviewAction === 'Aprobado' ? 'aprobada' : 'rechazada'} exitosamente`);
      setSelectedInspection(null);
      setReviewMode(false);
      setReviewAction(null);
      setReviewObservaciones('');
      setFirmaHSEQData(null);
    } catch (error) {
      console.error('Error en revisión:', error);
      alert('Error al procesar la revisión. Intente de nuevo.');
    } finally {
      setReviewLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black">
      <Navbar />
      
      <main className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-7xl">
          {/* Header */}
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl sm:rounded-3xl p-6 mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div className="mb-4 lg:mb-0">
                <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-300 bg-clip-text text-transparent mb-2">
                  Dashboard Preoperativos
                </h1>
                <p className="text-gray-300">
                  Bienvenido, <span className="text-yellow-400 font-semibold">{user?.nombre}</span>
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm text-gray-400">Total inspecciones</p>
                  <p className="text-2xl font-bold text-white">{inspecciones.length}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Estadísticas */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-4">
              <h3 className="text-sm font-medium text-gray-400 mb-1">Hoy</h3>
              <p className="text-2xl font-bold text-white">
                {inspecciones.filter(insp => {
                  if (!insp.createdAt) return false;
                  const created = new Date(insp.createdAt);
                  const now = new Date();
                  return created.toDateString() === now.toDateString();
                }).length}
              </p>
            </div>
            
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-4">
              <h3 className="text-sm font-medium text-gray-400 mb-1">Esta Semana</h3>
              <p className="text-2xl font-bold text-white">
                {inspecciones.filter(insp => {
                  if (!insp.createdAt) return false;
                  const created = new Date(insp.createdAt);
                  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
                  return created >= weekAgo;
                }).length}
              </p>
            </div>
            
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-4">
              <h3 className="text-sm font-medium text-gray-400 mb-1">Este Mes</h3>
              <p className="text-2xl font-bold text-white">
                {inspecciones.filter(insp => {
                  if (!insp.createdAt) return false;
                  const created = new Date(insp.createdAt);
                  const now = new Date();
                  return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
                }).length}
              </p>
            </div>

            <div className="backdrop-blur-xl bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
              <h3 className="text-sm font-medium text-yellow-400 mb-1">Pendientes</h3>
              <p className="text-2xl font-bold text-yellow-400">
                {inspecciones.filter(insp => insp.estadoPreoperacional === 'Solicitado').length}
              </p>
            </div>

            <div className="backdrop-blur-xl bg-green-500/10 border border-green-500/20 rounded-xl p-4">
              <h3 className="text-sm font-medium text-green-400 mb-1">Aprobadas</h3>
              <p className="text-2xl font-bold text-green-400">
                {inspecciones.filter(insp => insp.estadoPreoperacional === 'Aprobado').length}
              </p>
            </div>
          </div>

          {/* Controles y Filtros */}
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-4 mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              {/* Búsqueda */}
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Buscar por conductor, cédula o placa..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 pl-10 text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400 transition-colors"
                  />
                  <svg className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>

              {/* Filtros */}
              <div className="flex items-center space-x-4">
                <select
                  value={filterBy}
                  onChange={(e) => setFilterBy(e.target.value as any)}
                  className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-yellow-400"
                >
                  <option value="all">Todas las fechas</option>
                  <option value="today">Hoy</option>
                  <option value="week">Esta semana</option>
                  <option value="month">Este mes</option>
                </select>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-yellow-400"
                >
                  <option value="date">Ordenar por fecha</option>
                  <option value="conductor">Ordenar por conductor</option>
                  <option value="placa">Ordenar por placa</option>
                </select>

                <div className="flex bg-white/5 border border-white/10 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('table')}
                    className={`px-3 py-1 rounded text-sm transition-colors ${
                      viewMode === 'table' ? 'bg-yellow-400 text-black' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    Tabla
                  </button>
                  <button
                    onClick={() => setViewMode('cards')}
                    className={`px-3 py-1 rounded text-sm transition-colors ${
                      viewMode === 'cards' ? 'bg-yellow-400 text-black' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    Tarjetas
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Lista de Inspecciones */}
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
            {inspecciones.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-yellow-400/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <p className="text-gray-400 text-lg mb-2">No hay inspecciones registradas</p>
                <p className="text-gray-500">Las inspecciones aparecerán aquí una vez que se registren</p>
              </div>
            ) : filteredInspecciones.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-gray-400 text-lg">No se encontraron inspecciones con los filtros aplicados</p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setFilterBy('all');
                  }}
                  className="mt-4 px-4 py-2 bg-yellow-400 text-black rounded-lg hover:bg-yellow-500 transition-colors"
                >
                  Limpiar filtros
                </button>
              </div>
            ) : (
              <>
                {viewMode === 'table' ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-white/5">
                        <tr>
                          <th className="px-6 py-4 text-left text-xs font-medium text-yellow-400 uppercase tracking-wider">Fecha</th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-yellow-400 uppercase tracking-wider">Conductor</th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-yellow-400 uppercase tracking-wider">Vehículo</th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-yellow-400 uppercase tracking-wider">Documentos</th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-yellow-400 uppercase tracking-wider">Estado Salud</th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-yellow-400 uppercase tracking-wider">Estado</th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-yellow-400 uppercase tracking-wider">Acciones</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {paginatedInspecciones.map((insp) => (
                          <tr key={insp.id} className="hover:bg-white/5 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-white">
                                {insp.createdAt ? new Date(insp.createdAt + (insp.createdAt.includes('T') ? '' : 'T12:00:00')).toLocaleDateString('es-ES', {
                                  day: '2-digit',
                                  month: '2-digit',
                                  year: 'numeric'
                                }) : 'Sin fecha'}
                              </div>
                              {insp.codigoInspeccion && (
                                <div className="text-xs text-yellow-400/70">{insp.codigoInspeccion}</div>
                              )}
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm font-medium text-white">{insp.nombreConductor || 'Sin nombre'}</div>
                              <div className="text-sm text-gray-400">CC: {insp.cedula || 'Sin cédula'}</div>
                              <div className="text-xs text-gray-500">RH: {insp.rh || 'N/A'}</div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm font-medium text-white">{insp.placaVehiculo || 'Sin placa'}</div>
                              <div className="text-sm text-gray-400">{insp.marcaVehiculo} {insp.lineaVehiculo}</div>
                              <div className="text-xs text-gray-500">Modelo: {insp.modeloVehiculo || 'N/A'}</div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="space-y-1">
                                <div className="flex items-center space-x-2">
                                  <span className="text-xs text-gray-400">SOAT:</span>
                                  {getStatusBadge(insp.soatEstado)}
                                </div>
                                <div className="flex items-center space-x-2">
                                  <span className="text-xs text-gray-400">RTM:</span>
                                  {getStatusBadge(insp.revisionTecnicaEstado)}
                                </div>
                                <div className="flex items-center space-x-2">
                                  <span className="text-xs text-gray-400">Licencia:</span>
                                  {getStatusBadge(insp.licenciaEstado)}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="space-y-2">
                                {getStatusBadge(insp.estadoSalud)}
                                <div className="text-xs space-y-1">
                                  <div className="flex items-center">
                                    <span className="text-gray-400 mr-2">Medicación:</span>
                                    {getStatusBadge(insp.tomaMedicacion)}
                                  </div>
                                  <div className="flex items-center">
                                    <span className="text-gray-400 mr-2">Ansiedad:</span>
                                    {getStatusBadge(insp.ansiedadEstres)}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              {getEstadoBadge(insp.estadoPreoperacional)}
                              {insp.nombreHSEQ && (
                                <div className="text-xs text-gray-500 mt-1">Por: {insp.nombreHSEQ}</div>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap space-y-1">
                              <button
                                onClick={() => {
                                  setSelectedInspection(insp);
                                  setReviewMode(false);
                                  setReviewAction(null);
                                  setReviewObservaciones('');
                                  setFirmaHSEQData(null);
                                }}
                                className="block text-yellow-400 hover:text-yellow-300 text-sm font-medium transition-colors"
                              >
                                Ver detalles
                              </button>
                              {insp.docPreoperacional && (
                                <a
                                  href={insp.docPreoperacional}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="block text-blue-400 hover:text-blue-300 text-xs transition-colors"
                                >
                                  Ver PDF
                                </a>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="p-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {paginatedInspecciones.map((insp) => (
                      <div key={insp.id} className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-colors">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-lg font-semibold text-white">{insp.nombreConductor || 'Sin nombre'}</h3>
                            <p className="text-sm text-gray-400">CC: {insp.cedula}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-xs text-gray-500 mb-1">
                              {insp.createdAt ? new Date(insp.createdAt + (insp.createdAt.includes('T') ? '' : 'T12:00:00')).toLocaleDateString('es-ES') : 'Sin fecha'}
                            </div>
                            {getEstadoBadge(insp.estadoPreoperacional)}
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          <div>
                            <p className="text-sm text-gray-400 mb-1">Vehículo</p>
                            <p className="text-white">{insp.placaVehiculo} - {insp.marcaVehiculo}</p>
                          </div>
                          
                          <div>
                            <p className="text-sm text-gray-400 mb-2">Estado de Salud</p>
                            {getStatusBadge(insp.estadoSalud)}
                          </div>
                          
                          <button
                            onClick={() => {
                              setSelectedInspection(insp);
                              setReviewMode(false);
                              setReviewAction(null);
                              setReviewObservaciones('');
                              setFirmaHSEQData(null);
                            }}
                            className="w-full mt-4 bg-yellow-400 text-black py-2 px-4 rounded-lg hover:bg-yellow-500 transition-colors text-sm font-medium"
                          >
                            Ver detalles completos
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Paginación */}
                {totalPages > 1 && (
                  <div className="px-6 py-4 bg-white/5 border-t border-white/10">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-400">
                        Mostrando {(currentPage - 1) * itemsPerPage + 1} a {Math.min(currentPage * itemsPerPage, filteredInspecciones.length)} de {filteredInspecciones.length} inspecciones
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                          disabled={currentPage === 1}
                          className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/10 transition-colors"
                        >
                          Anterior
                        </button>
                        
                        <div className="flex items-center space-x-1">
                          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            const pageNum = i + 1;
                            return (
                              <button
                                key={pageNum}
                                onClick={() => setCurrentPage(pageNum)}
                                className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                                  currentPage === pageNum
                                    ? 'bg-yellow-400 text-black'
                                    : 'bg-white/5 text-white hover:bg-white/10'
                                }`}
                              >
                                {pageNum}
                              </button>
                            );
                          })}
                        </div>
                        
                        <button
                          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                          disabled={currentPage === totalPages}
                          className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/10 transition-colors"
                        >
                          Siguiente
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>

      {/* Modal de Detalles + Revisión HSEQ */}
      {selectedInspection && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-white/10 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-slate-900 border-b border-white/10 px-6 py-4 flex items-center justify-between z-10">
              <div>
                <h2 className="text-2xl font-bold text-white">Detalles de Inspección</h2>
                <div className="flex items-center space-x-3 mt-1">
                  {selectedInspection.codigoInspeccion && (
                    <span className="text-xs text-gray-400">{selectedInspection.codigoInspeccion}</span>
                  )}
                  {getEstadoBadge(selectedInspection.estadoPreoperacional)}
                </div>
              </div>
              <button
                onClick={() => { setSelectedInspection(null); setReviewMode(false); }}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6 space-y-8">
              {/* Información General */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white/5 rounded-xl p-4">
                  <h3 className="text-lg font-semibold text-yellow-400 mb-3">Información del Conductor</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Nombre:</span>
                      <span className="text-white">{selectedInspection.nombreConductor}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Cédula:</span>
                      <span className="text-white">{selectedInspection.cedula}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">RH:</span>
                      <span className="text-white">{selectedInspection.rh}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">ARL:</span>
                      <span className="text-white">{selectedInspection.arl}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">EPS:</span>
                      <span className="text-white">{selectedInspection.eps}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Fondo de Pensión:</span>
                      <span className="text-white">{selectedInspection.fondoPension}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 rounded-xl p-4">
                  <h3 className="text-lg font-semibold text-yellow-400 mb-3">Información del Vehículo</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Placa:</span>
                      <span className="text-white">{selectedInspection.placaVehiculo}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Marca:</span>
                      <span className="text-white">{selectedInspection.marcaVehiculo}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Línea:</span>
                      <span className="text-white">{selectedInspection.lineaVehiculo}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Modelo:</span>
                      <span className="text-white">{selectedInspection.modeloVehiculo}</span>
                    </div>
                  </div>

                  {selectedInspection.placaRemolque && (
                    <>
                      <h4 className="text-md font-semibold text-yellow-400 mt-4 mb-2">Remolque</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Placa:</span>
                          <span className="text-white">{selectedInspection.placaRemolque}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Marca:</span>
                          <span className="text-white">{selectedInspection.marcaRemolque || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Clase:</span>
                          <span className="text-white">{selectedInspection.claseRemolque || 'N/A'}</span>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Estado de Documentos */}
              <div className="bg-white/5 rounded-xl p-4">
                <h3 className="text-lg font-semibold text-yellow-400 mb-4">Estado de Documentos</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-400 mb-2">SOAT</p>
                    {getStatusBadge(selectedInspection.soatEstado)}
                    {selectedInspection.soatVencimiento && (
                      <p className="text-xs text-gray-500 mt-1">Vence: {selectedInspection.soatVencimiento}</p>
                    )}
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-400 mb-2">RTM</p>
                    {getStatusBadge(selectedInspection.revisionTecnicaEstado)}
                    {selectedInspection.revisionTecnicaVencimiento && (
                      <p className="text-xs text-gray-500 mt-1">Vence: {selectedInspection.revisionTecnicaVencimiento}</p>
                    )}
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-400 mb-2">Póliza</p>
                    {getStatusBadge(selectedInspection.polizaEstado)}
                    {selectedInspection.polizaVencimiento && (
                      <p className="text-xs text-gray-500 mt-1">Vence: {selectedInspection.polizaVencimiento}</p>
                    )}
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-400 mb-2">Licencia</p>
                    {getStatusBadge(selectedInspection.licenciaEstado)}
                    {selectedInspection.licenciaVencimiento && (
                      <p className="text-xs text-gray-500 mt-1">Vence: {selectedInspection.licenciaVencimiento}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Estado de Salud */}
              <div className="bg-white/5 rounded-xl p-4">
                <h3 className="text-lg font-semibold text-yellow-400 mb-4">Estado de Salud y Condiciones</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-400 mb-2">Estado General</p>
                    {getStatusBadge(selectedInspection.estadoSalud)}
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-400 mb-2">Toma Medicación</p>
                    {getStatusBadge(selectedInspection.tomaMedicacion)}
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-400 mb-2">Ansiedad/Estrés</p>
                    {getStatusBadge(selectedInspection.ansiedadEstres)}
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-400 mb-2">Problemas Visuales</p>
                    {getStatusBadge(selectedInspection.problemasVisuales)}
                  </div>
                </div>
                
                {selectedInspection.horasDormir && (
                  <div className="mt-4 text-center">
                    <p className="text-sm text-gray-400">Horas de sueño</p>
                    <p className="text-lg font-semibold text-white">{selectedInspection.horasDormir} horas</p>
                  </div>
                )}
              </div>

              {/* Items de verificación resumen */}
              <div className="bg-white/5 rounded-xl p-4">
                <h3 className="text-lg font-semibold text-yellow-400 mb-3">Verificación del Vehículo</h3>
                <div className="flex items-center space-x-4">
                  <div className={`text-center px-4 py-2 rounded-lg ${selectedInspection.itemsNoCumplen === 0 ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                    <p className={`text-2xl font-bold ${selectedInspection.itemsNoCumplen === 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {selectedInspection.itemsNoCumplen}
                    </p>
                    <p className="text-xs text-gray-400">Items No Cumplen</p>
                  </div>
                  <div className="text-center px-4 py-2 rounded-lg bg-green-500/20">
                    <p className="text-2xl font-bold text-green-400">
                      {Object.values(selectedInspection.itemsVerificacion).filter((i: any) => i.cumple === true).length}
                    </p>
                    <p className="text-xs text-gray-400">Items Cumplen</p>
                  </div>
                </div>
              </div>

              {/* Información de Revisión HSEQ (si ya fue revisado) */}
              {selectedInspection.estadoPreoperacional !== 'Solicitado' && selectedInspection.nombreHSEQ && (
                <div className={`rounded-xl p-4 ${selectedInspection.estadoPreoperacional === 'Aprobado' ? 'bg-green-500/10 border border-green-500/20' : 'bg-red-500/10 border border-red-500/20'}`}>
                  <h3 className="text-lg font-semibold text-yellow-400 mb-3">Revisión HSEQ</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">Revisado por:</span>
                      <p className="text-white font-medium">{selectedInspection.nombreHSEQ}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Fecha revisión:</span>
                      <p className="text-white">{selectedInspection.fechaRevision || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Decisión:</span>
                      <p className="mt-1">{getEstadoBadge(selectedInspection.estadoPreoperacional)}</p>
                    </div>
                  </div>
                  {selectedInspection.observacionesRevision && (
                    <div className="mt-3">
                      <span className="text-gray-400 text-sm">Observaciones:</span>
                      <p className="text-white text-sm mt-1">{selectedInspection.observacionesRevision}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Botones de Revisión HSEQ */}
              {selectedInspection.estadoPreoperacional === 'Solicitado' && !reviewMode && (
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
                  <h3 className="text-lg font-semibold text-yellow-400 mb-3">Revisión HSEQ</h3>
                  <p className="text-gray-300 text-sm mb-4">Esta inspección está pendiente de revisión. Seleccione una acción:</p>
                  <div className="flex space-x-4">
                    <button
                      onClick={() => { setReviewMode(true); setReviewAction('Aprobado'); setTimeout(initCanvas, 100); }}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-xl font-semibold transition-colors flex items-center justify-center space-x-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                      <span>Aprobar</span>
                    </button>
                    <button
                      onClick={() => { setReviewMode(true); setReviewAction('Rechazado'); setTimeout(initCanvas, 100); }}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 px-6 rounded-xl font-semibold transition-colors flex items-center justify-center space-x-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                      <span>Rechazar</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Formulario de Revisión */}
              {reviewMode && reviewAction && (
                <div className={`rounded-xl p-6 border ${reviewAction === 'Aprobado' ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
                  <h3 className="text-lg font-semibold text-white mb-4">
                    {reviewAction === 'Aprobado' ? '✅ Aprobar Inspección' : '❌ Rechazar Inspección'}
                  </h3>
                  
                  {/* Observaciones */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Observaciones {reviewAction === 'Rechazado' ? '(requeridas)' : '(opcional)'}
                    </label>
                    <textarea
                      value={reviewObservaciones}
                      onChange={(e) => setReviewObservaciones(e.target.value)}
                      rows={3}
                      className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400 transition-colors"
                      placeholder="Escriba sus observaciones aquí..."
                    />
                  </div>

                  {/* Firma HSEQ */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Firma Digital HSEQ <span className="text-red-400">*</span>
                    </label>
                    <p className="text-xs text-gray-500 mb-2">Firmando como: <span className="text-yellow-400">{user?.nombre}</span></p>
                    <div className="relative">
                      <canvas
                        ref={canvasRef}
                        width={500}
                        height={150}
                        className="w-full bg-white rounded-lg border-2 border-white/20 cursor-crosshair touch-none"
                        onMouseDown={startDraw}
                        onMouseMove={draw}
                        onMouseUp={stopDraw}
                        onMouseLeave={stopDraw}
                        onTouchStart={startDraw}
                        onTouchMove={draw}
                        onTouchEnd={stopDraw}
                      />
                      <button
                        type="button"
                        onClick={clearCanvas}
                        className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-xs hover:bg-black/70 transition-colors"
                      >
                        Limpiar
                      </button>
                    </div>
                    {!firmaHSEQData && (
                      <p className="text-xs text-red-400 mt-1">Debe firmar para continuar</p>
                    )}
                  </div>

                  {/* Botones de acción */}
                  <div className="flex space-x-4">
                    <button
                      onClick={handleReview}
                      disabled={reviewLoading || !firmaHSEQData || (reviewAction === 'Rechazado' && !reviewObservaciones.trim())}
                      className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                        reviewAction === 'Aprobado'
                          ? 'bg-green-600 hover:bg-green-700 text-white'
                          : 'bg-red-600 hover:bg-red-700 text-white'
                      }`}
                    >
                      {reviewLoading ? (
                        <span className="flex items-center justify-center space-x-2">
                          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>
                          <span>Procesando...</span>
                        </span>
                      ) : (
                        `Confirmar ${reviewAction === 'Aprobado' ? 'Aprobación' : 'Rechazo'}`
                      )}
                    </button>
                    <button
                      onClick={() => { setReviewMode(false); setReviewAction(null); setReviewObservaciones(''); setFirmaHSEQData(null); }}
                      className="px-6 py-3 bg-white/10 text-gray-300 rounded-xl hover:bg-white/20 transition-colors"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              )}

              {/* Link al PDF */}
              {selectedInspection.docPreoperacional && (
                <div className="bg-white/5 rounded-xl p-4">
                  <h3 className="text-lg font-semibold text-yellow-400 mb-3">Documento</h3>
                  <a
                    href={selectedInspection.docPreoperacional}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    <span>Ver PDF Preoperacional</span>
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      <Footer />
    </div>
  );
}