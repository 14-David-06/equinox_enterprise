import LegalLayout from '@/components/LegalLayout';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tratamiento de Datos Personales | Equinox Logística y Transporte',
  description: 'Autorización para el tratamiento de datos personales de Equinox Logística y Transporte S.A.S.',
};

export default function TratamientoDatos() {
  return (
    <LegalLayout title="Autorización para el Tratamiento de Datos Personales" lastUpdated="1 de febrero de 2026">
      <section className="space-y-6 text-gray-300">
        <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
          <p className="text-sm italic">
            Este documento constituye la autorización para el tratamiento de datos personales 
            conforme a lo establecido en la Ley 1581 de 2012 y el Decreto 1377 de 2013.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white mb-3">1. Identificación del Responsable</h2>
          <p>
            <strong className="text-yellow-400">EQUINOX LOGÍSTICA Y TRANSPORTE S.A.S.</strong>, sociedad comercial 
            identificada con NIT [NÚMERO DE NIT], con domicilio principal en [DIRECCIÓN], Colombia, 
            actuará como responsable del tratamiento de los datos personales que usted proporcione.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white mb-3">2. Datos Objeto de Tratamiento</h2>
          <p className="mb-3">
            Mediante la aceptación de este documento, usted autoriza el tratamiento de los siguientes datos:
          </p>
          
          <h3 className="text-lg font-medium text-yellow-400 mb-2">Datos de Identificación</h3>
          <ul className="list-disc pl-6 space-y-1 mb-4">
            <li>Nombre completo</li>
            <li>Número de cédula de ciudadanía</li>
            <li>Fecha de nacimiento / Edad</li>
            <li>Grupo sanguíneo (RH)</li>
          </ul>

          <h3 className="text-lg font-medium text-yellow-400 mb-2">Datos de Contacto</h3>
          <ul className="list-disc pl-6 space-y-1 mb-4">
            <li>Número de teléfono celular</li>
            <li>Correo electrónico</li>
            <li>Dirección de residencia (si aplica)</li>
          </ul>

          <h3 className="text-lg font-medium text-yellow-400 mb-2">Datos Laborales y de Seguridad Social</h3>
          <ul className="list-disc pl-6 space-y-1 mb-4">
            <li>Entidad Promotora de Salud (EPS)</li>
            <li>Administradora de Riesgos Laborales (ARL)</li>
            <li>Fondo de Pensiones</li>
          </ul>

          <h3 className="text-lg font-medium text-yellow-400 mb-2">Datos de Licencia de Conducción</h3>
          <ul className="list-disc pl-6 space-y-1 mb-4">
            <li>Categorías de licencia</li>
            <li>Fechas de vigencia</li>
            <li>Restricciones (si aplica)</li>
          </ul>

          <h3 className="text-lg font-medium text-yellow-400 mb-2">Datos Sensibles</h3>
          <ul className="list-disc pl-6 space-y-1 mb-4">
            <li>Información de salud relacionada con capacidad para conducir</li>
            <li>Firma digital</li>
          </ul>

          <h3 className="text-lg font-medium text-yellow-400 mb-2">Datos Técnicos</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li>Dirección IP de conexión</li>
            <li>Información del dispositivo y navegador</li>
            <li>Datos de geolocalización (GPS)</li>
            <li>Registros de acceso y actividad</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white mb-3">3. Finalidades del Tratamiento</h2>
          <p className="mb-3">Sus datos personales serán utilizados para:</p>
          
          <h3 className="text-lg font-medium text-yellow-400 mb-2">Finalidades Principales</h3>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li>Registrar y gestionar inspecciones pre-operacionales de vehículos</li>
            <li>Verificar la habilitación legal del conductor para operar vehículos</li>
            <li>Confirmar la vigencia de documentos obligatorios (licencia, SOAT, RTM, póliza)</li>
            <li>Garantizar el cumplimiento de normativas de seguridad vial</li>
            <li>Mantener registros históricos para auditorías y control interno</li>
            <li>Cumplir con requerimientos de autoridades de tránsito y transporte</li>
          </ul>

          <h3 className="text-lg font-medium text-yellow-400 mb-2">Finalidades Secundarias</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>Comunicaciones sobre el estado de sus registros e inspecciones</li>
            <li>Notificaciones de vencimiento de documentos</li>
            <li>Mejora de nuestros servicios y plataforma</li>
            <li>Análisis estadísticos agregados (sin identificación individual)</li>
            <li>Atención de peticiones, quejas, reclamos y sugerencias</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white mb-3">4. Tratamiento de Datos Sensibles</h2>
          <p>
            Los datos sensibles (información de salud y firma) serán tratados con especial 
            protección y únicamente para las siguientes finalidades:
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-3">
            <li>Verificar condiciones de salud que afecten la capacidad de conducción</li>
            <li>Cumplir con obligaciones en materia de seguridad y salud en el trabajo</li>
            <li>Autenticar la identidad del conductor mediante firma digital</li>
            <li>Atender emergencias médicas en caso necesario</li>
          </ul>
          <p className="mt-3">
            <strong className="text-yellow-400">Nota:</strong> El suministro de datos sensibles es voluntario, 
            excepto cuando sea requerido por ley.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white mb-3">5. Transferencia de Datos</h2>
          <p className="mb-3">
            Sus datos podrán ser compartidos con:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Autoridades de tránsito y transporte cuando sea requerido por ley</li>
            <li>Entidades de control y vigilancia que lo soliciten</li>
            <li>Empresas clientes para verificación de conductores autorizados</li>
            <li>Proveedores de servicios tecnológicos (bajo contratos de confidencialidad)</li>
            <li>Compañías de seguros en caso de siniestros</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white mb-3">6. Tiempo de Conservación</h2>
          <p>
            Los datos serán conservados durante:
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-3">
            <li><strong>Datos de inspecciones:</strong> Mínimo 5 años (obligación legal de transporte)</li>
            <li><strong>Datos de conductores activos:</strong> Durante la relación comercial + 2 años</li>
            <li><strong>Datos de conductores inactivos:</strong> 2 años desde la última actividad</li>
            <li><strong>Registros de acceso:</strong> 6 meses</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white mb-3">7. Derechos del Titular</h2>
          <p className="mb-3">
            Como titular de los datos, usted tiene derecho a:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Conocer, actualizar y rectificar sus datos personales</li>
            <li>Solicitar prueba de la autorización otorgada</li>
            <li>Ser informado sobre el uso dado a sus datos</li>
            <li>Revocar la autorización y/o solicitar la supresión de sus datos</li>
            <li>Presentar quejas ante la Superintendencia de Industria y Comercio</li>
            <li>Acceder gratuitamente a sus datos personales</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white mb-3">8. Canales de Atención</h2>
          <p className="mb-3">
            Para ejercer sus derechos, puede contactarnos a través de:
          </p>
          <div className="bg-white/5 p-4 rounded-lg space-y-2">
            <p><strong>Correo electrónico:</strong> protecciondatos@equinox.com.co</p>
            <p><strong>Teléfono:</strong> [TELÉFONO DE CONTACTO]</p>
            <p><strong>Dirección:</strong> [DIRECCIÓN FÍSICA]</p>
            <p><strong>Horario de atención:</strong> Lunes a Viernes, 8:00 a.m. a 5:00 p.m.</p>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white mb-3">9. Declaración de Autorización</h2>
          <div className="p-4 bg-yellow-400/10 border border-yellow-400/30 rounded-lg">
            <p className="text-sm">
              Al marcar la casilla de aceptación en los formularios de EQUINOX, usted declara que:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-3 text-sm">
              <li>Ha leído y comprendido esta autorización</li>
              <li>Otorga su consentimiento libre, previo, expreso e informado</li>
              <li>Autoriza el tratamiento de sus datos para las finalidades descritas</li>
              <li>Reconoce que puede revocar esta autorización en cualquier momento</li>
              <li>Certifica que los datos proporcionados son veraces y actuales</li>
            </ul>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white mb-3">10. Marco Legal</h2>
          <p>
            Este documento se rige por las siguientes normas colombianas:
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-3">
            <li>Constitución Política de Colombia, Artículo 15</li>
            <li>Ley 1581 de 2012 - Régimen General de Protección de Datos Personales</li>
            <li>Decreto 1377 de 2013 - Reglamentario de la Ley 1581</li>
            <li>Decreto 1074 de 2015 - Decreto Único Reglamentario del Sector Comercio</li>
            <li>Circular Externa 002 de 2015 de la SIC</li>
          </ul>
        </div>
      </section>
    </LegalLayout>
  );
}
