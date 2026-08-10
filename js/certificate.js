/**
 * Generador de Plano de Conexiones Sintético
 * Genera y muestra la dirección MAC única del PC/Dispositivo
 */

(function(window) {

  /**
   * Genera o recupera la Dirección MAC única simulada basada en la huella de hardware del equipo
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
   * Genera un código hash único basado en los datos del alumno, MAC y circuito
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
   * Muestra el Plano de Conexiones Sintético
   */
  function showCertificateModal(studentName, studentRut, netlist, wires) {
    const macAddress = getDeviceMacAddress();
    const hash = generateVerificationHash(studentName, studentRut, macAddress, Date.now(), netlist);

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

  window.CertificateGenerator = {
    showCertificateModal,
    downloadCertificateAsImage
  };

})(window);
