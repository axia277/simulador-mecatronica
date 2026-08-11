/**
 * Generador de Plano de Conexiones y Sistema de Registro Automático de Alumnos (Google Sheets Webhook)
 */

(function(window) {

  const COMPLETION_LOG_KEY = 'mecatronica_completion_master_log_v2';
  
  // URL de Webhook de Google Sheets conectada a la planilla CircuitoAuto
  const GOOGLE_SHEET_WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbzeoapG-lmkeoPaNjn-dmcjM2Y1ypVrovqOc1I8cngpRXfAferhZ3Da8zX4J789rTE/exec';

  /**
   * Genera la dirección MAC simulada del PC
   */
  function getDeviceMacAddress() {
    let mac = localStorage.getItem('sim_device_mac_addr');
    if (!mac) {
      const nav = window.navigator || {};
      const screen = window.screen || {};
      const raw = `${nav.userAgent || ''}_${screen.width}x${screen.height}_${nav.hardwareConcurrency || 4}_${nav.deviceMemory || 8}_${nav.language || ''}`;
      let hash = 0;
      for (let i = 0; i < raw.length; i++) {
        hash = ((hash << 5) - hash) + raw.charCodeAt(i);
        hash |= 0;
      }
      const hex = Math.abs(hash).toString(16).toUpperCase().padStart(8, '0');
      const b1 = hex.substring(0, 2);
      const b2 = hex.substring(2, 4);
      const b3 = hex.substring(4, 6);
      const b4 = hex.substring(6, 8);
      const rand1 = Math.floor(16 + Math.random() * 200).toString(16).toUpperCase().padStart(2, '0');
      const rand2 = Math.floor(16 + Math.random() * 200).toString(16).toUpperCase().padStart(2, '0');
      mac = `${b1}:${b2}:${b3}:${b4}:${rand1}:${rand2}`;
      localStorage.setItem('sim_device_mac_addr', mac);
    }
    return mac;
  }

  /**
   * Genera el código de verificación único
   */
  function generateVerificationHash(name, rut, mac, timestamp, netlist) {
    const raw = `${name.toLowerCase().trim()}_${rut.trim()}_${mac}_${timestamp}_${JSON.stringify(netlist)}`;
    let hash = 0;
    for (let i = 0; i < raw.length; i++) {
      const char = raw.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash |= 0;
    }
    const hex = Math.abs(hash).toString(16).toUpperCase().padStart(8, '0');
    return `VAL-${hex.substring(0, 4)}-${hex.substring(4, 8)}-2026`;
  }

  /**
   * Registra la solución completada del alumno en la memoria local y envía al Webhook (Google Sheets)
   */
  function logStudentCompletion(studentName, studentRut, deviceId, hash, timestamp) {
    const record = {
      fecha: timestamp,
      alumno: studentName,
      rut: studentRut,
      mac_pc: deviceId,
      codigo: hash
    };

    // 1. Guardar en Master Log de LocalStorage
    try {
      const raw = localStorage.getItem(COMPLETION_LOG_KEY);
      const log = raw ? JSON.parse(raw) : [];
      log.push(record);
      localStorage.setItem(COMPLETION_LOG_KEY, JSON.stringify(log));
    } catch (e) {
      console.warn('Error al guardar en registro local:', e);
    }

    // 2. Enviar a la Planilla de Google Sheets (CircuitoAuto)
    if (GOOGLE_SHEET_WEBHOOK_URL) {
      try {
        fetch(GOOGLE_SHEET_WEBHOOK_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify(record)
        }).catch(err => console.warn('Error al enviar a Google Sheets:', err));
      } catch (err) {
        console.warn('Error en fetch Webhook:', err);
      }
    }
  }

  /**
   * Muestra el Plano de Conexiones Sintético y registra al alumno
   */
  function showCertificateModal(studentName, studentRut, netlist, wires) {
    const macAddress = getDeviceMacAddress();
    const timestampStr = new Date().toLocaleString('es-CL');
    const hash = generateVerificationHash(studentName, studentRut, macAddress, Date.now(), netlist);

    // Guardar y notificar a la planilla de Google Sheets automáticamente
    logStudentCompletion(studentName, studentRut, macAddress, hash, timestampStr);

    const modal = document.getElementById('certificateModal');
    const container = document.getElementById('certificateContainer');

    if (!modal || !container) return;

    // SVG mini preview del diagrama de conexiones
    const svgElem = document.getElementById('svgCanvas');
    const svgContent = svgElem ? svgElem.outerHTML : '';

    const qrData = encodeURIComponent(`ALUMNO:${studentName}|RUT:${studentRut}|MAC:${macAddress}|CODE:${hash}`);

    container.innerHTML = `
      <div class="certificate-sheet" id="printSheet">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.75rem; font-size: 0.9rem;">
          <div style="line-height: 1.5;">
            <strong>Alumno:</strong> ${studentName}<br>
            <strong>RUT:</strong> ${studentRut}<br>
            <strong>MAC PC:</strong> <span style="font-family: monospace; font-weight: bold; color: #0284c7;">${macAddress}</span>
          </div>
          <div style="text-align: right; font-size: 0.85rem; color: #1e293b;">
            <strong>Código:</strong> ${hash}
          </div>
        </div>

        <!-- Diagrama del Circuito -->
        <div style="border: 1px solid #cbd5e1; border-radius: 0.5rem; background: #ffffff; padding: 0.25rem; height: 260px; overflow: hidden; position: relative;">
          ${svgContent}
        </div>

        <!-- Código QR -->
        <div style="display: flex; justify-content: flex-end; align-items: center; margin-top: 0.75rem;">
          <img src="https://api.qrserver.com/v1/create-qr-code/?size=60x60&data=${qrData}" alt="QR" style="width: 55px; height: 55px;">
        </div>
      </div>
    `;

    modal.classList.add('active');
  }

  function downloadCertificateAsImage() {
    const printSheet = document.getElementById('printSheet');
    if (!printSheet) return;

    window.print();
  }

  /**
   * Exporta la lista de alumnos aprobados como archivo CSV para Excel
   */
  function exportCompletionLogCSV() {
    try {
      const raw = localStorage.getItem(COMPLETION_LOG_KEY);
      const log = raw ? JSON.parse(raw) : [];

      if (log.length === 0) {
        alert('Aún no hay registros de alumnos que hayan completado el circuito en este equipo.');
        return;
      }

      let csv = 'Fecha,Alumno,RUT,MAC_PC,Codigo_Verificacion\n';
      log.forEach(row => {
        csv += `"${row.fecha}","${row.alumno}","${row.rut}","${row.mac_pc}","${row.codigo}"\n`;
      });

      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Registro_Alumnos_Mecatronica_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      alert('Error al exportar el registro de alumnos.');
    }
  }

  window.CertificateGenerator = {
    showCertificateModal,
    downloadCertificateAsImage,
    exportCompletionLogCSV
  };

})(window);
