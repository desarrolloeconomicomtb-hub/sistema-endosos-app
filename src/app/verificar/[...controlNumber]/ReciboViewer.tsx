'use client';

import { useState } from 'react';
import { Download, Eye, EyeOff, FileText } from 'lucide-react';

interface ReciboItemProps {
  label: string;
  identificador: string;
  url: string;
  defaultFilename: string;
}

function ReciboItem({ label, identificador, url, defaultFilename }: ReciboItemProps) {
  const [showPreview, setShowPreview] = useState(false);

  const isPdf = url.startsWith('data:application/pdf');
  const isImage = url.startsWith('data:image/');

  // Determine extension
  let fileExtension = 'pdf';
  if (isImage) {
    if (url.includes('png')) fileExtension = 'png';
    else if (url.includes('jpeg') || url.includes('jpg')) fileExtension = 'jpg';
    else if (url.includes('gif')) fileExtension = 'gif';
    else fileExtension = 'png'; // default
  }
  const downloadName = `${defaultFilename.replace(/\s+/g, '_')}_${identificador || 'recibo'}.${fileExtension}`;

  return (
    <div className="border border-green-100 rounded-xl bg-green-50 overflow-hidden shadow-sm">
      {/* Header / Actions Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 gap-3 bg-green-50/50">
        <div className="flex items-start gap-2.5">
          <FileText className="w-5 h-5 text-[#2e5e2e] shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-xs text-gray-800 leading-tight uppercase tracking-wider">{label}</h4>
            {identificador && (
              <p className="text-[11px] text-green-800 font-semibold mt-0.5">Control/Núm: {identificador}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          {(isPdf || isImage) && (
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-green-200 text-[#2e5e2e] hover:bg-green-100/50 text-xs font-bold rounded-lg transition-all shadow-sm"
              type="button"
            >
              {showPreview ? (
                <>
                  <EyeOff className="w-3.5 h-3.5" />
                  <span>Cerrar</span>
                </>
              ) : (
                <>
                  <Eye className="w-3.5 h-3.5" />
                  <span>Ver</span>
                </>
              )}
            </button>
          )}

          <a
            href={url}
            download={downloadName}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2e5e2e] text-white hover:bg-[#1b3d1b] text-xs font-bold rounded-lg transition-all shadow-sm"
            title="Descargar archivo"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Descargar</span>
          </a>
        </div>
      </div>

      {/* Preview Area */}
      {showPreview && (
        <div className="border-t border-green-100 bg-white p-3">
          {isPdf ? (
            <div className="flex flex-col gap-2">
              <iframe
                src={url}
                className="w-full h-[350px] border border-gray-200 rounded-lg shadow-inner bg-gray-50"
                title={label}
              />
              <p className="text-[11px] text-gray-500 text-center">
                ¿No puedes visualizar el PDF correctamente en tu dispositivo?{' '}
                <a href={url} download={downloadName} className="text-[#2e5e2e] font-bold underline">
                  Descárgalo haciendo clic aquí.
                </a>
              </p>
            </div>
          ) : isImage ? (
            <div className="flex flex-col items-center gap-2">
              <img
                src={url}
                alt={label}
                className="w-full max-h-[350px] object-contain border border-gray-100 rounded-lg bg-gray-50 shadow-inner"
              />
              <p className="text-[11px] text-gray-500 text-center">
                Si deseas guardarlo en alta resolución, utiliza el botón de descargar.
              </p>
            </div>
          ) : (
            <div className="p-4 text-center text-xs text-gray-500">
              Formato no compatible para previsualización directa. Por favor descargue el archivo.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

interface ReciboViewerProps {
  reciboPatenteUrl?: string | null;
  reciboPatente?: string | null;
  reciboAmbulanteUrl?: string | null;
  reciboAmbulante?: string | null;
  reciboBebidasUrl?: string | null;
  reciboBebidas?: string | null;
  companyName?: string;
}

export default function ReciboViewer({
  reciboPatenteUrl,
  reciboPatente,
  reciboAmbulanteUrl,
  reciboAmbulante,
  reciboBebidasUrl,
  reciboBebidas,
  companyName = 'Negocio',
}: ReciboViewerProps) {
  const hasDocuments = !!(reciboPatenteUrl || reciboAmbulanteUrl || reciboBebidasUrl);

  if (!hasDocuments) return null;

  return (
    <div className="mt-6 pt-6 border-t border-gray-100 text-left space-y-4">
      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Recibos de Pago Digitalizados</p>
      <div className="flex flex-col gap-3">
        {reciboPatenteUrl && (
          <ReciboItem
            label="Recibo Patente"
            identificador={reciboPatente || ''}
            url={reciboPatenteUrl}
            defaultFilename={`Patente_${companyName}`}
          />
        )}
        {reciboAmbulanteUrl && (
          <ReciboItem
            label="Recibo Ambulante"
            identificador={reciboAmbulante || ''}
            url={reciboAmbulanteUrl}
            defaultFilename={`Ambulante_${companyName}`}
          />
        )}
        {reciboBebidasUrl && (
          <ReciboItem
            label="Recibo Bebidas"
            identificador={reciboBebidas || ''}
            url={reciboBebidasUrl}
            defaultFilename={`Bebidas_${companyName}`}
          />
        )}
      </div>
    </div>
  );
}
