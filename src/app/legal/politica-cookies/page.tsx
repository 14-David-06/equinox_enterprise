import LegalLayout from '@/components/LegalLayout';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Política de Cookies | Equinox Logística y Transporte',
  description: 'Información sobre el uso de cookies en la plataforma de Equinox Logística y Transporte S.A.S.',
};

export default function PoliticaCookies() {
  return (
    <LegalLayout title="Política de Cookies" lastUpdated="1 de febrero de 2026">
      <section className="space-y-6 text-gray-300">
        <div>
          <h2 className="text-xl font-semibold text-white mb-3">1. ¿Qué son las Cookies?</h2>
          <p>
            Las cookies son pequeños archivos de texto que se almacenan en su dispositivo (ordenador, 
            tablet o móvil) cuando visita nuestro sitio web. Estas cookies permiten que el sitio 
            recuerde sus acciones y preferencias durante un período de tiempo, para que no tenga 
            que volver a configurarlas cada vez que regrese.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white mb-3">2. ¿Qué Cookies Utilizamos?</h2>
          
          <h3 className="text-lg font-medium text-yellow-400 mb-2 mt-4">2.1 Cookies Esenciales</h3>
          <p className="mb-3">
            Son necesarias para el funcionamiento básico del sitio web. Sin estas cookies, 
            el sitio no podría funcionar correctamente.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-white/10 rounded-lg overflow-hidden">
              <thead className="bg-white/10">
                <tr>
                  <th className="px-4 py-2 text-left text-yellow-400">Cookie</th>
                  <th className="px-4 py-2 text-left text-yellow-400">Propósito</th>
                  <th className="px-4 py-2 text-left text-yellow-400">Duración</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                <tr>
                  <td className="px-4 py-2">session_token</td>
                  <td className="px-4 py-2">Mantener la sesión del usuario</td>
                  <td className="px-4 py-2">Sesión</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">csrf_token</td>
                  <td className="px-4 py-2">Seguridad contra ataques CSRF</td>
                  <td className="px-4 py-2">Sesión</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">auth_token</td>
                  <td className="px-4 py-2">Autenticación de usuario</td>
                  <td className="px-4 py-2">7 días</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className="text-lg font-medium text-yellow-400 mb-2 mt-6">2.2 Cookies de Preferencias</h3>
          <p className="mb-3">
            Permiten recordar las preferencias del usuario para mejorar su experiencia.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-white/10 rounded-lg overflow-hidden">
              <thead className="bg-white/10">
                <tr>
                  <th className="px-4 py-2 text-left text-yellow-400">Cookie</th>
                  <th className="px-4 py-2 text-left text-yellow-400">Propósito</th>
                  <th className="px-4 py-2 text-left text-yellow-400">Duración</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                <tr>
                  <td className="px-4 py-2">conductor_data</td>
                  <td className="px-4 py-2">Guardar datos del conductor para formularios</td>
                  <td className="px-4 py-2">30 días</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">theme_preference</td>
                  <td className="px-4 py-2">Preferencia de tema visual</td>
                  <td className="px-4 py-2">1 año</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">cookie_consent</td>
                  <td className="px-4 py-2">Registro de aceptación de cookies</td>
                  <td className="px-4 py-2">1 año</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className="text-lg font-medium text-yellow-400 mb-2 mt-6">2.3 Almacenamiento Local (LocalStorage)</h3>
          <p className="mb-3">
            Además de cookies, utilizamos almacenamiento local del navegador para:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Guardar datos del conductor para agilizar el llenado de formularios</li>
            <li>Almacenar preferencias de la aplicación</li>
            <li>Mantener datos temporales durante la sesión</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white mb-3">3. Cookies de Terceros</h2>
          <p className="mb-3">
            Actualmente, nuestro sitio web no utiliza cookies de terceros para publicidad o 
            seguimiento. Sin embargo, algunos servicios pueden establecer sus propias cookies:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Airtable:</strong> Para la gestión de datos de formularios</li>
            <li><strong>Vercel:</strong> Para análisis de rendimiento del sitio (si aplica)</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white mb-3">4. Base Legal</h2>
          <p>
            El uso de cookies se fundamenta en:
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-3">
            <li><strong>Cookies esenciales:</strong> Interés legítimo para el funcionamiento del servicio</li>
            <li><strong>Cookies de preferencias:</strong> Consentimiento del usuario</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white mb-3">5. ¿Cómo Gestionar las Cookies?</h2>
          
          <h3 className="text-lg font-medium text-yellow-400 mb-2 mt-4">5.1 A través de su navegador</h3>
          <p className="mb-3">
            Puede configurar su navegador para bloquear o eliminar cookies:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Chrome:</strong> Configuración → Privacidad y seguridad → Cookies y otros datos de sitios
            </li>
            <li>
              <strong>Firefox:</strong> Opciones → Privacidad y seguridad → Cookies y datos del sitio
            </li>
            <li>
              <strong>Safari:</strong> Preferencias → Privacidad → Gestionar datos de sitios web
            </li>
            <li>
              <strong>Edge:</strong> Configuración → Privacidad y servicios → Cookies
            </li>
          </ul>

          <h3 className="text-lg font-medium text-yellow-400 mb-2 mt-6">5.2 Eliminar datos almacenados</h3>
          <p>
            Para eliminar los datos guardados en LocalStorage, puede usar las herramientas de 
            desarrollador de su navegador (F12) → Aplicación → Almacenamiento local → Limpiar.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white mb-3">6. Consecuencias de Desactivar Cookies</h2>
          <p>
            Si desactiva las cookies esenciales, es posible que:
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-3">
            <li>No pueda acceder a ciertas funcionalidades del sitio</li>
            <li>La sesión no se mantenga entre páginas</li>
            <li>Deba ingresar sus datos cada vez que use un formulario</li>
            <li>Algunas funciones de seguridad no operen correctamente</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white mb-3">7. Actualizaciones</h2>
          <p>
            Esta política puede actualizarse periódicamente. Le recomendamos revisarla 
            regularmente. La fecha de última actualización se indica al inicio de este documento.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white mb-3">8. Contacto</h2>
          <p>
            Si tiene preguntas sobre nuestra política de cookies, contáctenos en:
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-3">
            <li><strong>Email:</strong> protecciondatos@equinox.com.co</li>
            <li><strong>Teléfono:</strong> [TELÉFONO DE CONTACTO]</li>
          </ul>
        </div>

        <div className="mt-8 p-4 bg-yellow-400/10 border border-yellow-400/30 rounded-lg">
          <p className="text-sm text-yellow-400">
            <strong>Nota:</strong> Al continuar navegando en nuestro sitio después de ver el 
            aviso de cookies, usted acepta el uso de las mismas según lo descrito en esta política.
          </p>
        </div>
      </section>
    </LegalLayout>
  );
}
