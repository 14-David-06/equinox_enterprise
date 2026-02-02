import LegalLayout from '@/components/LegalLayout';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Términos y Condiciones | Equinox Logística y Transporte',
  description: 'Términos y condiciones de uso de la plataforma de Equinox Logística y Transporte S.A.S.',
};

export default function TerminosCondiciones() {
  return (
    <LegalLayout title="Términos y Condiciones de Uso" lastUpdated="1 de febrero de 2026">
      <section className="space-y-6 text-gray-300">
        <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
          <p className="text-sm italic">
            Por favor, lea estos términos y condiciones cuidadosamente antes de utilizar 
            nuestra plataforma. El uso de este sitio web implica la aceptación de estos términos.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white mb-3">1. Definiciones</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>&quot;EQUINOX&quot; o &quot;la Empresa&quot;:</strong> EQUINOX LOGÍSTICA Y TRANSPORTE S.A.S., NIT [NÚMERO DE NIT]</li>
            <li><strong>&quot;Plataforma&quot;:</strong> El sitio web, aplicaciones y servicios digitales de EQUINOX</li>
            <li><strong>&quot;Usuario&quot;:</strong> Toda persona que acceda o utilice la Plataforma</li>
            <li><strong>&quot;Conductor&quot;:</strong> Persona que utiliza la Plataforma para registrar inspecciones</li>
            <li><strong>&quot;Contenido&quot;:</strong> Toda la información, textos, imágenes y datos en la Plataforma</li>
            <li><strong>&quot;Servicios&quot;:</strong> Las funcionalidades ofrecidas a través de la Plataforma</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white mb-3">2. Aceptación de Términos</h2>
          <p>
            Al acceder y utilizar esta Plataforma, usted acepta estar sujeto a estos Términos y 
            Condiciones, nuestra Política de Privacidad y nuestra Política de Cookies. Si no está 
            de acuerdo con alguno de estos términos, no debe usar la Plataforma.
          </p>
          <p className="mt-3">
            EQUINOX se reserva el derecho de modificar estos términos en cualquier momento. 
            El uso continuado de la Plataforma después de dichas modificaciones constituye 
            su aceptación de los nuevos términos.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white mb-3">3. Descripción del Servicio</h2>
          <p className="mb-3">
            EQUINOX proporciona una plataforma digital para:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Registro de inspecciones pre-operacionales de vehículos</li>
            <li>Gestión de información de conductores</li>
            <li>Verificación de documentación vehicular</li>
            <li>Control de cumplimiento normativo en transporte</li>
            <li>Generación de reportes e históricos de operación</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white mb-3">4. Requisitos de Uso</h2>
          <p className="mb-3">Para utilizar la Plataforma, usted debe:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Ser mayor de 18 años</li>
            <li>Poseer licencia de conducción válida y vigente (para conductores)</li>
            <li>Proporcionar información veraz y actualizada</li>
            <li>Mantener la confidencialidad de sus credenciales de acceso</li>
            <li>Utilizar la Plataforma solo para los fines previstos</li>
            <li>Cumplir con todas las leyes y regulaciones aplicables</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white mb-3">5. Obligaciones del Usuario</h2>
          <p className="mb-3">El Usuario se compromete a:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Proporcionar datos personales veraces, exactos y actualizados</li>
            <li>Actualizar su información cuando sea necesario</li>
            <li>Realizar las inspecciones pre-operacionales de manera honesta y diligente</li>
            <li>No falsificar información sobre el estado del vehículo</li>
            <li>Notificar cualquier irregularidad o problema detectado</li>
            <li>No compartir sus credenciales de acceso con terceros</li>
            <li>No intentar vulnerar la seguridad de la Plataforma</li>
            <li>No utilizar la Plataforma para fines ilícitos</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white mb-3">6. Responsabilidad por la Información</h2>
          <p>
            El Usuario es el único responsable de la veracidad, exactitud y legalidad de la 
            información que proporcione a través de la Plataforma. EQUINOX no será responsable 
            por daños o perjuicios derivados de información falsa, inexacta o incompleta 
            proporcionada por los usuarios.
          </p>
          <div className="mt-4 p-4 bg-red-400/10 border border-red-400/30 rounded-lg">
            <p className="text-sm text-red-400">
              <strong>⚠️ Advertencia:</strong> Falsificar información en las inspecciones 
              pre-operacionales puede constituir un delito y conlleva responsabilidades civiles 
              y penales, además de sanciones administrativas de las autoridades de transporte.
            </p>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white mb-3">7. Propiedad Intelectual</h2>
          <p>
            Todo el contenido de la Plataforma, incluyendo pero no limitado a textos, gráficos, 
            logos, iconos, imágenes, software y código fuente, es propiedad de EQUINOX o de sus 
            licenciantes y está protegido por las leyes de propiedad intelectual.
          </p>
          <p className="mt-3">
            Queda prohibida la reproducción, distribución, modificación o uso no autorizado 
            del contenido sin el consentimiento previo y por escrito de EQUINOX.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white mb-3">8. Disponibilidad del Servicio</h2>
          <p>
            EQUINOX se esfuerza por mantener la Plataforma disponible de forma continua. 
            Sin embargo, no garantizamos:
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-3">
            <li>Disponibilidad ininterrumpida del servicio</li>
            <li>Ausencia de errores o fallos técnicos</li>
            <li>Que la Plataforma esté libre de virus o componentes dañinos</li>
            <li>La compatibilidad con todos los dispositivos o navegadores</li>
          </ul>
          <p className="mt-3">
            EQUINOX podrá suspender temporalmente el servicio para mantenimiento, 
            actualizaciones o por causas de fuerza mayor.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white mb-3">9. Limitación de Responsabilidad</h2>
          <p>
            En la máxima medida permitida por la ley, EQUINOX no será responsable por:
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-3">
            <li>Daños indirectos, incidentales, especiales o consecuentes</li>
            <li>Pérdida de datos, beneficios o ingresos</li>
            <li>Interrupciones del servicio o errores técnicos</li>
            <li>Acciones de terceros que afecten la Plataforma</li>
            <li>Uso indebido de la información por parte de los usuarios</li>
            <li>Incumplimiento de las inspecciones por parte de los conductores</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white mb-3">10. Indemnización</h2>
          <p>
            El Usuario acepta indemnizar y mantener indemne a EQUINOX, sus directores, empleados 
            y agentes, de cualquier reclamación, daño, pérdida o gasto (incluidos honorarios 
            de abogados) que surja de:
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-3">
            <li>El incumplimiento de estos Términos y Condiciones</li>
            <li>La violación de derechos de terceros</li>
            <li>El uso indebido de la Plataforma</li>
            <li>La falsificación de información</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white mb-3">11. Suspensión y Terminación</h2>
          <p>
            EQUINOX se reserva el derecho de suspender o terminar el acceso de un Usuario 
            a la Plataforma, sin previo aviso, cuando:
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-3">
            <li>Incumpla estos Términos y Condiciones</li>
            <li>Proporcione información falsa o engañosa</li>
            <li>Realice actividades fraudulentas o ilegales</li>
            <li>Comprometa la seguridad de la Plataforma</li>
            <li>Afecte negativamente a otros usuarios o a EQUINOX</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white mb-3">12. Protección de Datos</h2>
          <p>
            El tratamiento de datos personales se rige por nuestra Política de Privacidad y 
            la normatividad colombiana de protección de datos (Ley 1581 de 2012 y normas 
            complementarias). Al usar la Plataforma, usted acepta dicho tratamiento.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white mb-3">13. Ley Aplicable y Jurisdicción</h2>
          <p>
            Estos Términos y Condiciones se rigen por las leyes de la República de Colombia. 
            Cualquier controversia será sometida a la jurisdicción de los tribunales competentes 
            de [CIUDAD], Colombia.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white mb-3">14. Divisibilidad</h2>
          <p>
            Si alguna disposición de estos Términos y Condiciones se considera inválida o 
            inaplicable, las disposiciones restantes continuarán en pleno vigor y efecto.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white mb-3">15. Acuerdo Completo</h2>
          <p>
            Estos Términos y Condiciones, junto con la Política de Privacidad y la Política 
            de Cookies, constituyen el acuerdo completo entre usted y EQUINOX respecto al 
            uso de la Plataforma.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white mb-3">16. Contacto</h2>
          <p className="mb-3">
            Para consultas sobre estos Términos y Condiciones:
          </p>
          <div className="bg-white/5 p-4 rounded-lg space-y-2">
            <p><strong>EQUINOX LOGÍSTICA Y TRANSPORTE S.A.S.</strong></p>
            <p><strong>Correo electrónico:</strong> legal@equinox.com.co</p>
            <p><strong>Teléfono:</strong> [TELÉFONO DE CONTACTO]</p>
            <p><strong>Dirección:</strong> [DIRECCIÓN FÍSICA]</p>
          </div>
        </div>

        <div className="mt-8 p-4 bg-yellow-400/10 border border-yellow-400/30 rounded-lg">
          <p className="text-sm text-yellow-400">
            <strong>Aceptación:</strong> Al utilizar nuestra Plataforma, usted confirma que ha 
            leído, entendido y aceptado estos Términos y Condiciones en su totalidad.
          </p>
        </div>
      </section>
    </LegalLayout>
  );
}
