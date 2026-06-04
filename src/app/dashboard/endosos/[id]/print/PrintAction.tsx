'use client';

export default function PrintAction() {
  const exportToWord = () => {
    const element = document.getElementById('carta-documento');
    if (!element) return;

    // Get the HTML content of the letter
    const htmlContent = element.innerHTML;

    // Word Document Template containing the HTML + inline styles
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
          body {
            font-family: 'Times New Roman', serif;
            font-size: 11pt;
            line-height: 1.5;
            color: #000;
          }
          header {
            margin-bottom: 30px;
          }
          .footer-box {
            border: 1px solid #d1d5db;
            padding: 6px 10px;
            font-size: 7.5pt;
            text-align: center;
            margin-top: 50px;
          }
        </style>
      </head>
      <body>
        ${htmlContent}
      </body>
      </html>
    `;

    // Create a Blob with Word MIME type and trigger downoad
    const blob = new Blob(['\ufeff' + documentHtml], {
      type: 'application/msword'
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Carta_Endoso.doc';
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
