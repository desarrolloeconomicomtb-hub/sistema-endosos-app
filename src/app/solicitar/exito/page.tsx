import styles from '../page.module.css';
import Link from 'next/link';

export default async function ExitoPage({ searchParams }: { searchParams: Promise<{ numero?: string }> }) {
  const resolvedParams = await searchParams;
  const numeroControl = resolvedParams.numero || 'MTB-EM-XXXX-YYYY';

  return (
    <main className="container">
      <div className={`${styles.formContainer} ${styles.successContainer}`}>
        <div className={styles.successIcon}>✓</div>
        <h2>¡Solicitud Recibida Exitosamente!</h2>
        <p>Su petición de endoso ha sido registrada en el sistema. Guarde este número de control para futuras referencias:</p>
        
        <div className={styles.controlNumber}>
          {numeroControl}
        </div>

        <p>
          Pronto estaremos evaluando su solicitud. Si requiere hacer el pago de derechos, por favor 
          acérquese a la Oficina de Recaudaciones de Finanzas Municipales, refiriendo su número de control.
        </p>
        
        <div style={{ marginTop: '2rem' }}>
          <Link href="/" className="btn-secondary">
            Volver al Inicio
          </Link>
        </div>
      </div>
    </main>
  );
}
