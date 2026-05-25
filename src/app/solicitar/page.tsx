import styles from './page.module.css';
import { createEndoso } from '@/app/actions/endoso';

export default function SolicitarPage() {
  return (
    <main className="container">
      <div className={styles.formContainer}>
        <div className={styles.header}>
          <h1>Solicitud de Endoso Municipal</h1>
          <p>Complete la información a continuación para formalizar su petición de Kiosco.</p>
        </div>

        <form action={createEndoso} className={styles.formGrid}>
          <div className={styles.formGroup} style={{ gridColumn: '1 / -1' }}>
            <label>Identificación de Solicitante / Entidad</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(100px, 1fr) 2fr 2fr', gap: '1rem', marginTop: '0.5rem' }}>
              <select id="titulo" name="titulo" required>
                <option value="Sr.">Sr.</option>
                <option value="Sra.">Sra.</option>
                <option value="Srta.">Srta.</option>
                <option value="Entidad">Entidad (Sin Trato)</option>
              </select>
              <input type="text" id="nombre" name="nombre" required placeholder="Nombre (Ej. Juan / Asoc. XYZ)" />
              <input type="text" id="apellidos" name="apellidos" placeholder="Apellidos (Dejar en blanco si es Entidad)" />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="email">Correo Electrónico</label>
            <input type="email" id="email" name="email" required placeholder="ejemplo@correo.com" />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="telefono">Teléfono</label>
            <input type="tel" id="telefono" name="telefono" required placeholder="(787) 555-5555" />
          </div>

          <div className={`${styles.formGroup} ${styles.fullWidth}`}>
            <label htmlFor="direccion">Dirección Postal o Física</label>
            <input type="text" id="direccion" name="direccion" required placeholder="Calle, Número, Pueblo, Código Postal" />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="actividad">Nombre de la Actividad</label>
            <input type="text" id="actividad" name="actividad" required placeholder="Ej. Fiestas Patronales / Torneo Softball" />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="ubicacion">Ubicación del Kiosco / Evento</label>
            <input type="text" id="ubicacion" name="ubicacion" required placeholder="Ej. Plaza Pública, Complejo Deportivo" />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="tipo_venta">Tipo de Venta</label>
            <select id="tipo_venta" name="tipo_venta" required>
              <option value="">-- Seleccione el tipo --</option>
              <option value="Comida">Comida (o Comida y Refrescos)</option>
              <option value="Bebida">Bebidas Alcohólicas</option>
              <option value="Sin fines de lucro">Sin Fines de Lucro</option>
              <option value="Pica">Pica de Caballos / Juegos</option>
              <option value="Miscelaneo">Artículos Misceláneos / Comercial</option>
              <option value="Artesano">Artesanos Autorizados</option>
            </select>
          </div>

          <div className={`${styles.formGroup} ${styles.fullWidth}`}>
            <button type="submit" className={`btn-primary ${styles.submitBtn}`}>
              Someter Solicitud
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
