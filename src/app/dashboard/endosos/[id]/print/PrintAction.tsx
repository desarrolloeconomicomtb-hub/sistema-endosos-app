'use client';

interface PrintActionProps {
  endoso: any;
  escudoBase64: string;
  logoBase64: string;
  firmaNombre: string;
  firmaPuesto: string;
  firmaExtension: string;
  firmaEmail: string;
  issueDateActual: string;
  addresseeLine: string;
  saludo: string;
}

export default function PrintAction({
  endoso,
  escudoBase64,
  logoBase64,
  firmaNombre,
  firmaPuesto,
  firmaExtension,
  firmaEmail,
  issueDateActual,
  addresseeLine,
  saludo
}: PrintActionProps) {
  const exportToWord = () => {
    // Generate clean Word-compatible HTML with tables for headers and inline styles
    const documentHtml = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta charset="utf-8">
        <title>Carta de Endoso</title>
        <!--[if gte mso 9]>
        <xml>
          <w:WordDocument>
            <w:View>Print</w:View>
            <w:Zoom>100</w:Zoom>
          </w:WordDocument>
        </xml>
        <![endif]-->
        <style>
          @page {
            size: letter;
            margin: 1.0in 1.0in 1.0in 1.0in;
          }
          body {
            font-family: 'Times New Roman', serif;
            font-size: 11pt;
            line-height: 1.5;
            color: #000;
          }
          p {
            margin: 0 0 12pt 0;
            text-align: justify;
            font-size: 11pt;
            line-height: 1.5;
          }
        </style>
      </head>
      <body>
        <!-- Header Table (Word-friendly columns) -->
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 25px; font-family: Arial, sans-serif;">
          <tr>
            <td width="30%" align="center" valign="top" style="text-align: center; font-size: 8pt; line-height: 1.2;">
              <img src="data:image/png;base64,${escudoBase64}" width="70" height="70" style="margin-bottom: 5px; display: block; margin-left: auto; margin-right: auto;" /><br />
              <b>Hon. Bernardo "Betito" Márquez García</b><br />
              <i>Alcalde</i>
            </td>
            <td width="40%" align="center" valign="middle" style="text-align: center; font-size: 11pt; line-height: 1.3; font-family: Arial, sans-serif;">
              Gobierno de Puerto Rico<br />
              <b style="font-size: 13pt; color: #1b5e20;">Municipio Autónomo de Toa Baja</b><br />
              <i style="font-weight: bold;">Oficina del ${firmaPuesto.toLowerCase().includes("vicealcalde") ? "Vicealcalde" : "Alcalde"}</i>
            </td>
            <td width="30%" align="right" valign="top" style="text-align: right;">
              <img src="data:image/png;base64,${logoBase64}" width="95" style="object-fit: contain;" />
            </td>
          </tr>
        </table>

        <!-- Date -->
        <div style="margin-bottom: 20px; font-size: 11pt;">
          ${issueDateActual}
        </div>

        <!-- Control Number -->
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 20px; font-family: Arial, sans-serif;">
          <tr>
            <td align="right">
              <div style="border: 1px solid #1b5e20; padding: 4px 12px; font-weight: bold; font-size: 9.5pt; color: #1b5e20; display: inline-block;">
                Núm. Control: ${endoso.controlNumber.replace(/-/g, ' ')}
              </div>
            </td>
          </tr>
        </table>

        <!-- Addressee -->
        <div style="margin-bottom: 20px; font-size: 11pt; line-height: 1.3;">
          ${addresseeLine ? `<b style="display: block;">${addresseeLine}</b>` : ''}
          <b style="display: block;">${endoso.companyName}</b>
          <span style="display: block;">${endoso.ubicacion || 'Toa Baja, PR'}</span>
        </div>

        <!-- Salutation -->
        <div style="margin-bottom: 15px; font-weight: bold; font-size: 11pt;">
          ${saludo}
        </div>

        <!-- Body Paragraphs -->
        <p>
          Reciba un cordial saludo de parte de todos los que laboramos en el Municipio de Toa Baja. Hemos recibido su petición para participar en la categoría denominada <strong>${endoso.evento?.nombre || 'Evento No Asignado'}</strong>, a celebrarse los días ${endoso.evento?.fechas || '15, 16 y 17 de mayo de 2026'}, en ${endoso.evento?.ubicacion || 'el Balneario de Punta Salinas, Toa Baja, Puerto Rico'}${endoso.tarima ? ` (área adyacente a ${endoso.tarima})` : ''}.
        </p>

        <p>
          El Municipio de Toa Baja ha evaluado su petición y no tiene objeción en que opere (1) quiosco provisional para la venta de <strong>${endoso.descripcion || '[Descripción de venta]'}</strong>. No obstante, el otorgamiento de este endoso está sujeto a que se cumplan con todos los requerimientos establecidos por ley, reglamento u ordenanza en vigor aplicable, así como realizar los trámites correspondientes con el personal de la Oficina de Finanzas Municipales.
        </p>

        <p>
          Igualmente, si su intención es la venta de bebidas alcohólicas, deberá obtener el endoso o licencia correspondiente otorgada por el Departamento de Hacienda para esos fines.
        </p>

        <p>
          Este endoso representa un visto bueno del Municipio en la obtención de cualquier permiso, licencia y/o trámite gubernamental requerido para que el proponente lleve a cabo su propósito.
        </p>

        <p>
          El Municipio interesa mantener el más alto grado de coordinación y logística para asegurar que esta categoría tenga el éxito que todos esperamos. Confiamos en que la aportación que usted pueda brindar para el desarrollo de la <strong>${endoso.evento?.nombre || 'Evento Especial'}</strong> la convierta en un evento que sea considerado por nuestros ciudadanos un verdadero Orgullo Llanero.
        </p>

        <!-- Sign-off -->
        <div style="margin-top: 25px; margin-bottom: 75px; font-size: 11pt;">
          Cordialmente,
        </div>

        <!-- Signature -->
        <div style="font-size: 11pt; line-height: 1.3;">
          <b>${firmaNombre}</b><br />
          ${firmaPuesto}<br />
          Municipio Autónomo de Toa Baja
        </div>

        <!-- Footer -->
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-top: 60px; border-top: 2px solid #1b5e20; padding-top: 8px; font-family: Arial, sans-serif;">
          <tr>
            <td align="center" style="font-size: 7.5pt; color: #555; text-align: center;">
              Dirección: Apartado 2359, Toa Baja, P.R. 00951 &nbsp;&nbsp;|&nbsp;&nbsp; Teléfono: (787) 261-0202 &nbsp;&nbsp;|&nbsp;&nbsp; Extensión: ${firmaExtension} &nbsp;&nbsp;|&nbsp;&nbsp; Correo Electrónico: ${firmaEmail}
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    // Create Blob with MS Word MIME Type
    const blob = new Blob(['\ufeff' + documentHtml], {
      type: 'application/msword'
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Carta_Endoso_${endoso.controlNumber.replace(/-/g, '_')}.doc`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="print:hidden fixed top-4 right-4 bg-gray-100 p-4 rounded-lg shadow-lg flex flex-col gap-2 max-w-sm border border-gray-200">
      <h3 className="font-bold text-gray-800 text-sm">Vista de Impresión / Descarga</h3>
      <p className="text-xs text-gray-600 mb-2">Configure su impresora para tamaño Carta o descargue el documento directamente en formato Word.</p>
      
      <button 
        onClick={() => window.print()}
        className="w-full bg-[#2e5e2e] hover:bg-[#1b3d1b] text-white px-4 py-2 rounded-md font-bold text-sm transition-colors"
      >
        Imprimir Carta
      </button>

      <button 
        onClick={exportToWord}
        className="w-full bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-md font-bold text-sm transition-colors"
      >
        Descargar Word (.doc)
      </button>
    </div>
  );
}
