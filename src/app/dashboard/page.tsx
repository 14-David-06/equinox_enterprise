'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface Inspeccion {
  id: string;
  createdAt: string;
  nombreConductor?: string;
  cedula?: string;
  placaVehiculo?: string;
  marcaVehiculo?: string;
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black">
      <Navbar />
      
      <main className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-7xl">
          {/* Header */}
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl sm:rounded-3xl p-6 mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-center bg-gradient-to-r from-yellow-400 to-yellow-300 bg-clip-text text-transparent mb-4">
              Dashboard Preoperativos
            </h1>
            <p className="text-center text-gray-300">
              Bienvenido, <span className="text-yellow-400 font-semibold">{user?.nombre}</span>
            </p>
            <p className="text-center text-gray-400 text-sm">
              Total de inspecciones: {inspecciones.length}
            </p>
          </div>

          {/* Estadísticas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-yellow-400 mb-2">Total Inspecciones</h3>
              <p className="text-3xl font-bold text-white">{inspecciones.length}</p>
            </div>
            
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-green-400 mb-2">Este Mes</h3>
              <p className="text-3xl font-bold text-white">
                {inspecciones.filter(insp => {
                  const created = new Date(insp.createdAt);
                  const now = new Date();
                  return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
                }).length}
              </p>
            </div>
            
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-blue-400 mb-2">Hoy</h3>
              <p className="text-3xl font-bold text-white">
                {inspecciones.filter(insp => {
                  const created = new Date(insp.createdAt);
                  const now = new Date();
                  return created.toDateString() === now.toDateString();
                }).length}
              </p>
            </div>
          </div>

          {/* Lista de Inspecciones */}
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-6">Inspecciones Recientes</h2>
            
            {inspecciones.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-400 text-lg">No hay inspecciones registradas</p>
                <p className="text-gray-500 mt-2">Las inspecciones aparecerán aquí una vez que se registren</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="pb-3 text-yellow-400 font-semibold">Fecha</th>
                      <th className="pb-3 text-yellow-400 font-semibold">Conductor</th>
                      <th className="pb-3 text-yellow-400 font-semibold">Cédula</th>
                      <th className="pb-3 text-yellow-400 font-semibold">Placa</th>
                      <th className="pb-3 text-yellow-400 font-semibold">Vehículo</th>
                      <th className="pb-3 text-yellow-400 font-semibold">Estado Salud</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inspecciones.slice(0, 20).map((insp) => (
                      <tr key={insp.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="py-3 text-gray-300">
                          {new Date(insp.createdAt).toLocaleDateString('es-ES', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric'
                          })}
                        </td>
                        <td className="py-3 text-white">{insp.nombreConductor || '-'}</td>
                        <td className="py-3 text-gray-300">{insp.cedula || '-'}</td>
                        <td className="py-3 text-gray-300">{insp.placaVehiculo || '-'}</td>
                        <td className="py-3 text-gray-300">{insp.marcaVehiculo || '-'}</td>
                        <td className="py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            insp.estadoSalud === 'Bueno' 
                              ? 'bg-green-500/20 text-green-400' 
                              : insp.estadoSalud === 'Regular'
                              ? 'bg-yellow-500/20 text-yellow-400'
                              : 'bg-gray-500/20 text-gray-400'
                          }`}>
                            {insp.estadoSalud || 'No especificado'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}