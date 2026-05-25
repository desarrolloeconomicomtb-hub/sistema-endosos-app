'use client';

export default function PrintButton() {
  return (
    <button 
      onClick={() => window.print()} 
      className="btn-primary" 
      style={{padding: '0.75rem 2rem', fontSize: '1.1rem'}}
    >
      🖨️ Imprimir Documento
    </button>
  );
}
