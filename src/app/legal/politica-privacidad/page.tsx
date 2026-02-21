import LegalLayout from '@/components/LegalLayout';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Política de Privacidad | Equinox Logística y Transporte',
  description: 'Política de privacidad y protección de datos personales de Equinox Logística y Transporte S.A.S.',
};

export default function PoliticaPrivacidad() {
  return (
    <LegalLayout title="Política de Privacidad" lastUpdated="1 de febrero de 2026">
      <section className="space-y-6 text-gray-300">
        <div>
          <h2 className="text-xl font-semibold text-white mb-3">1. Información General</h2>
          <p>
            <strong className="text-yellow-400">EQUINOX LOGÍSTICA Y TRANSPORTE S.A.S.</strong>, identificada con 
            NIT 901.870.510-5, con domicilio en Cll 12 Cra 4 #78, Colombia (en adelante &quot;EQUINOX&quot; o &quot;la Empresa&quot;), 
            en cumplimiento de la Ley 1581 de 2012 y el Decreto 1377 de 2013, presenta su Política de 
            Privacidad para el tratamiento de datos personales.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white mb-3">2. Responsable del Tratamiento</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Razón Social:</strong> EQUINOX LOGÍSTICA Y TRANSPORTE S.A.S.</li>
            <li><strong>NIT:</strong> 901.870.510-5</li>
            <li><strong>Dirección:</strong> Cll 12 Cra 4 #78, Colombia</li>
            <li><strong>Teléfono:</strong> +57 320 217 5321</li>
            <li><strong>Correo electrónico:</strong> equinoxlogisticaytransporte@gmail.com</li>
            <li><strong>Sitio web:</strong> www.equinox.com.co</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white mb-3">3. Definiciones</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Dato Personal:</strong> Cualquier información vinculada o que pueda asociarse a una persona natural.</li>
            <li><strong>Titular:</strong> Persona natural cuyos datos personales sean objeto de tratamiento.</li>
            <li><strong>Tratamiento:</strong> Cualquier operación sobre datos personales (recolección, almacenamiento, uso, circulación, supresión).</li>
            <li><strong>Autorización:</strong> Consentimiento previo, expreso e informado del Titular para el tratamiento de sus datos.</li>
            <li><strong>Encargado del Tratamiento:</strong> Persona que realice el tratamiento de datos por cuenta del Responsable.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white mb-3">4. Datos Personales que Recolectamos</h2>
          <p className="mb-3">EQUINOX recolecta y trata los siguientes tipos de datos personales:</p>
          
          <h3 className="text-lg font-medium text-yellow-400 mb-2">4.1 Datos de Conductores</h3>
          <ul className="list-disc pl-6 space-y-1 mb-4">
            <li>Nombre completo y número de cédula</li>
            <li>Información de contacto (teléfono, correo electrónico)</li>
            <li>Edad y grupo sanguíneo (RH)</li>
            <li>Información de seguridad social (EPS, ARL, Fondo de Pensión)</li>
            <li>Información de licencia de conducción (categorías, vigencia)</li>
            <li>Firma digital</li>
          </ul>

          <h3 className="text-lg font-medium text-yellow-400 mb-2">4.2 Datos de Vehículos</h3>
          <ul className="list-disc pl-6 space-y-1 mb-4">
            <li>Placa, marca, línea, modelo y color</li>
            <li>Número de tarjeta de propiedad</li>
            <li>Información de documentos (SOAT, RTM, Póliza)</li>
          </ul>

          <h3 className="text-lg font-medium text-yellow-400 mb-2">4.3 Datos Técnicos</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li>Dirección IP</li>
            <li>Información del navegador (User Agent)</li>
            <li>Datos de GPS y geolocalización</li>
            <li>Fecha y hora de acceso</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white mb-3">5. Finalidades del Tratamiento</h2>
          <p className="mb-3">Los datos personales serán utilizados para:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Gestionar las inspecciones pre-operacionales de vehículos</li>
            <li>Verificar el cumplimiento de requisitos legales de conductores y vehículos</li>
            <li>Garantizar la seguridad vial y cumplimiento normativo</li>
            <li>Mantener registros históricos de operaciones</li>
            <li>Cumplir con obligaciones legales y regulatorias</li>
            <li>Comunicarse con los titulares sobre asuntos relacionados con el servicio</li>
            <li>Mejorar nuestros servicios y plataforma</li>
            <li>Prevenir fraudes y garantizar la seguridad de la información</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white mb-3">6. Derechos de los Titulares</h2>
          <p className="mb-3">De acuerdo con la Ley 1581 de 2012, los titulares tienen derecho a:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Conocer:</strong> Acceder a sus datos personales que hayan sido objeto de tratamiento.</li>
            <li><strong>Actualizar:</strong> Solicitar la actualización de sus datos cuando estén incompletos o inexactos.</li>
            <li><strong>Rectificar:</strong> Corregir información personal que sea inexacta.</li>
            <li><strong>Suprimir:</strong> Solicitar la eliminación de sus datos cuando no se respeten los principios legales.</li>
            <li><strong>Revocar:</strong> Revocar la autorización otorgada para el tratamiento de sus datos.</li>
            <li><strong>Consultar:</strong> Presentar consultas gratuitas sobre el uso de sus datos.</li>
            <li><strong>Reclamar:</strong> Presentar quejas ante la Superintendencia de Industria y Comercio.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white mb-3">7. Procedimiento para Ejercer Derechos</h2>
          <p>
            Para ejercer sus derechos, el titular puede enviar una solicitud al correo electrónico 
            <strong className="text-yellow-400"> protecciondatos@equinox.com.co</strong> indicando:
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-3">
            <li>Nombre completo y número de identificación</li>
            <li>Descripción de los hechos que dan lugar a la solicitud</li>
            <li>Derecho que desea ejercer</li>
            <li>Dirección física o electrónica para notificaciones</li>
            <li>Documentos que soporten la solicitud (si aplica)</li>
          </ul>
          <p className="mt-3">
            Las consultas serán atendidas en un término máximo de diez (10) días hábiles. 
            Los reclamos serán atendidos en un término máximo de quince (15) días hábiles.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white mb-3">8. Medidas de Seguridad</h2>
          <p>
            EQUINOX implementa medidas técnicas, humanas y administrativas para proteger los datos personales:
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-3">
            <li>Cifrado de datos en tránsito y en reposo</li>
            <li>Control de acceso basado en roles</li>
            <li>Monitoreo y auditoría de accesos</li>
            <li>Copias de seguridad periódicas</li>
            <li>Capacitación del personal en protección de datos</li>
            <li>Protocolos de respuesta ante incidentes de seguridad</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white mb-3">9. Transferencia y Transmisión de Datos</h2>
          <p>
            EQUINOX podrá transferir o transmitir datos personales a terceros únicamente cuando:
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-3">
            <li>Sea necesario para cumplir con obligaciones legales</li>
            <li>Se cuente con autorización previa del titular</li>
            <li>Sea requerido por autoridades competentes</li>
            <li>Sea necesario para la prestación del servicio contratado</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white mb-3">10. Vigencia</h2>
          <p>
            Esta política entra en vigencia a partir del 1 de febrero de 2026. Los datos personales 
            serán conservados durante el tiempo necesario para cumplir con las finalidades descritas 
            y los plazos legales aplicables.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white mb-3">11. Modificaciones</h2>
          <p>
            EQUINOX se reserva el derecho de modificar esta política en cualquier momento. 
            Las modificaciones serán publicadas en nuestro sitio web y, cuando sea significativo, 
            se notificará a los titulares por los medios disponibles.
          </p>
        </div>

        <div className="mt-8 p-4 bg-yellow-400/10 border border-yellow-400/30 rounded-lg">
          <p className="text-sm text-yellow-400">
            <strong>Contacto:</strong> Para cualquier consulta sobre esta política, comuníquese con 
            nosotros al correo equinoxlogisticaytransporte@gmail.com o al teléfono +57 320 217 5321
          </p>
        </div>
      </section>
    </LegalLayout>
  );
}
