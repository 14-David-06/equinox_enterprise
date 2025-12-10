'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface Inspeccion {
  id: string;
  createdAt: string;
  updatedAt: string;
  
  // Encabezado
  codigo?: string;
  version?: string;
  fechaEdicion?: string;
  fechaInspeccionDesde?: string;
  fechaInspeccionHasta?: string;
  mes?: string;
  anio?: string;
  
  // Documentos
  soatEstado?: string;
  soatVencimiento?: string;
  revisionTecnicaEstado?: string;
  revisionTecnicaVencimiento?: string;
  polizaEstado?: string;
  polizaVencimiento?: string;
  licenciaEstado?: string;
  licenciaVencimiento?: string;
  categorias?: string;
  
  // Conductor
  nombreConductor?: string;
  cedula?: string;
  edad?: string;
  arl?: string;
  eps?: string;
  fondoPension?: string;
  rh?: string;
  
  // Vehículo
  placaVehiculo?: string;
  marcaVehiculo?: string;
  lineaVehiculo?: string;
  modeloVehiculo?: string;
  
  // Remolque
  placaRemolque?: string;
  marcaRemolque?: string;
  claseRemolque?: string;
  modeloRemolque?: string;
  
  // Salud y operación
  horasDormir?: string;
  kilometraje?: string;
  tomaMedicacion?: string;
  ansiedadEstres?: string;
  problemasVisuales?: string;
  estadoSalud?: string;
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
        setInspecciones(data);
      } catch (error) {
        // Error al cargar inspecciones - continuar con array vacío
      } finally {
        setLoading(false);
      }
    };

    loadInspecciones();
  }, [user]);

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
    
    // Ordenar
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
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
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-4">
              <h3 className="text-sm font-medium text-gray-400 mb-1">Hoy</h3>
              <p className="text-2xl font-bold text-white">
                {inspecciones.filter(insp => {
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
                  const created = new Date(insp.createdAt);
                  const now = new Date();
                  return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
                }).length}
              </p>
            </div>

            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-4">
              <h3 className="text-sm font-medium text-gray-400 mb-1">Salud Buena</h3>
              <p className="text-2xl font-bold text-green-400">
                {inspecciones.filter(insp => insp.estadoSalud === 'Bueno').length}
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
                          <th className="px-6 py-4 text-left text-xs font-medium text-yellow-400 uppercase tracking-wider">Acciones</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {paginatedInspecciones.map((insp) => (
                          <tr key={insp.id} className="hover:bg-white/5 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-white">
                                {new Date(insp.createdAt).toLocaleDateString('es-ES', {
                                  day: '2-digit',
                                  month: '2-digit',
                                  year: 'numeric'
                                })}
                              </div>
                              <div className="text-xs text-gray-400">
                                {new Date(insp.createdAt).toLocaleTimeString('es-ES', {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm font-medium text-white">{insp.nombreConductor || 'Sin nombre'}</div>
                              <div className="text-sm text-gray-400">CC: {insp.cedula || 'Sin cédula'}</div>
                              <div className="text-xs text-gray-500">RH: {insp.rh || 'N/A'} | Edad: {insp.edad || 'N/A'}</div>
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
                                  <span className="text-xs text-gray-400">RT:</span>
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
                            <td className="px-6 py-4 whitespace-nowrap">
                              <button
                                onClick={() => setSelectedInspection(insp)}
                                className="text-yellow-400 hover:text-yellow-300 text-sm font-medium transition-colors"
                              >
                                Ver detalles
                              </button>
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
                          <div className="text-xs text-gray-500">
                            {new Date(insp.createdAt).toLocaleDateString('es-ES')}
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
                            onClick={() => setSelectedInspection(insp)}
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

      {/* Modal de Detalles */}
      {selectedInspection && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-white/10 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-slate-900 border-b border-white/10 px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Detalles de Inspección</h2>
              <button
                onClick={() => setSelectedInspection(null)}
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
                      <span className="text-white">{selectedInspection.nombreConductor || 'No especificado'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Cédula:</span>
                      <span className="text-white">{selectedInspection.cedula || 'No especificado'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Edad:</span>
                      <span className="text-white">{selectedInspection.edad || 'No especificado'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">RH:</span>
                      <span className="text-white">{selectedInspection.rh || 'No especificado'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">ARL:</span>
                      <span className="text-white">{selectedInspection.arl || 'No especificado'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">EPS:</span>
                      <span className="text-white">{selectedInspection.eps || 'No especificado'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Fondo de Pensión:</span>
                      <span className="text-white">{selectedInspection.fondoPension || 'No especificado'}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 rounded-xl p-4">
                  <h3 className="text-lg font-semibold text-yellow-400 mb-3">Información del Vehículo</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Placa:</span>
                      <span className="text-white">{selectedInspection.placaVehiculo || 'No especificado'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Marca:</span>
                      <span className="text-white">{selectedInspection.marcaVehiculo || 'No especificado'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Línea:</span>
                      <span className="text-white">{selectedInspection.lineaVehiculo || 'No especificado'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Modelo:</span>
                      <span className="text-white">{selectedInspection.modeloVehiculo || 'No especificado'}</span>
                    </div>
                  </div>

                  {selectedInspection.placaRemolque && (
                    <>
                      <h4 className="text-md font-semibold text-yellow-400 mt-4 mb-2">Remolque</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Placa Remolque:</span>
                          <span className="text-white">{selectedInspection.placaRemolque}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Marca Remolque:</span>
                          <span className="text-white">{selectedInspection.marcaRemolque || 'No especificado'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Clase:</span>
                          <span className="text-white">{selectedInspection.claseRemolque || 'No especificado'}</span>
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
                    <p className="text-sm text-gray-400 mb-2">Revisión Técnica</p>
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

              {/* Información Adicional */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white/5 rounded-xl p-4">
                  <h3 className="text-lg font-semibold text-yellow-400 mb-3">Fechas de Inspección</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Registrada:</span>
                      <span className="text-white">
                        {new Date(selectedInspection.createdAt).toLocaleString('es-ES')}
                      </span>
                    </div>
                    {selectedInspection.fechaInspeccionDesde && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">Desde:</span>
                        <span className="text-white">{selectedInspection.fechaInspeccionDesde}</span>
                      </div>
                    )}
                    {selectedInspection.fechaInspeccionHasta && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">Hasta:</span>
                        <span className="text-white">{selectedInspection.fechaInspeccionHasta}</span>
                      </div>
                    )}
                  </div>
                </div>

                {selectedInspection.categorias && (
                  <div className="bg-white/5 rounded-xl p-4">
                    <h3 className="text-lg font-semibold text-yellow-400 mb-3">Categorías</h3>
                    <div className="text-sm text-white">
                      {selectedInspection.categorias}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      
      <Footer />
    </div>
  );
}