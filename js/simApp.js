/**
 * Inicializador del Simulador de Circuitos Mecatrónicos y Controlador UI
 */

(function(window) {

  let studentName = '';
  let studentRut = '';

  function boot() {
    if (window.WiringEngine) {
      window.WiringEngine.initWiringEngine('svgCanvas');
    }

    // Selectores de Color de Cable
    const colorBtns = document.querySelectorAll('.color-btn');
    colorBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        colorBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const color = btn.getAttribute('data-color');
        if (window.WiringEngine) {
          window.WiringEngine.setWireColor(color);
        }
      });
    });

    // Botón Eliminar Cable Seleccionado
    const btnDeleteSelected = document.getElementById('btnDeleteSelected');
    if (btnDeleteSelected) {
      btnDeleteSelected.addEventListener('click', () => {
        if (window.WiringEngine) {
          window.WiringEngine.removeSelectedWire();
        }
      });
    }

    // Botón Borrar Todo
    const btnClear = document.getElementById('btnClear');
    if (btnClear) {
      btnClear.addEventListener('click', () => {
        if (confirm('¿Deseas borrar todas las conexiones y reiniciar el lienzo?')) {
          if (window.WiringEngine) window.WiringEngine.clearAllWires();
        }
      });
    }

    // Botones de Zoom para Celular y Pantalla
    const btnZoomIn = document.getElementById('btnZoomIn');
    if (btnZoomIn) {
      btnZoomIn.addEventListener('click', () => {
        if (window.WiringEngine) window.WiringEngine.zoomIn();
      });
    }

    const btnZoomOut = document.getElementById('btnZoomOut');
    if (btnZoomOut) {
      btnZoomOut.addEventListener('click', () => {
        if (window.WiringEngine) window.WiringEngine.zoomOut();
      });
    }

    const btnZoomReset = document.getElementById('btnZoomReset');
    if (btnZoomReset) {
      btnZoomReset.addEventListener('click', () => {
        if (window.WiringEngine) window.WiringEngine.resetZoom();
      });
    }

    // Botón de Verificación de Circuito
    const btnVerify = document.getElementById('btnVerify');
    if (btnVerify) {
      btnVerify.addEventListener('click', () => {
        verifyAndProcess();
      });
    }

    // Modales y Cierre
    const challengeModal = document.getElementById('challengeModal');
    const btnCloseChallenge = document.getElementById('btnCloseChallenge');
    if (btnCloseChallenge && challengeModal) {
      btnCloseChallenge.addEventListener('click', () => {
        challengeModal.classList.remove('active');
      });
    }

    const certificateModal = document.getElementById('certificateModal');
    const btnCloseCertificate = document.getElementById('btnCloseCertificate');
    if (btnCloseCertificate && certificateModal) {
      btnCloseCertificate.addEventListener('click', () => {
        certificateModal.classList.remove('active');
      });
    }

    const btnDownloadCert = document.getElementById('btnDownloadCert');
    if (btnDownloadCert) {
      btnDownloadCert.addEventListener('click', () => {
        if (window.CertificateGenerator) {
          window.CertificateGenerator.downloadCertificateAsImage();
        }
      });
    }
  }

  function verifyAndProcess() {
    const Engine = window.WiringEngine;
    const Evaluator = window.CircuitEvaluator;

    if (!Engine || !Evaluator) return;

    const netlist = Engine.getConnectedNetlist();
    const evalRes = Evaluator.evaluateCircuit(netlist);

    if (!evalRes.isValid) {
      showChallengeModal(evalRes.challenge);
    } else {
      promptStudentData(netlist);
    }
  }

  function showChallengeModal(challenge) {
    const modal = document.getElementById('challengeModal');
    const searchElem = document.getElementById('challengeSearchPhrase');
    const clueElem = document.getElementById('challengeClueText');

    if (!modal || !searchElem || !clueElem) return;

    searchElem.textContent = challenge.searchPhrase;
    clueElem.textContent = challenge.clue;

    modal.classList.add('active');
  }

  function promptStudentData(netlist) {
    studentName = prompt('¡Circuito 100% Correcto!\n\nIngresa tu Nombre y Apellido para generar el Plano de Conexiones Oficial:', studentName || 'Juan Pérez');
    if (!studentName) return;

    studentRut = prompt('Ingresa tu RUT o Número de Matrícula:', studentRut || '12.345.678-9');
    if (!studentRut) return;

    if (window.CertificateGenerator) {
      const wires = window.WiringEngine.getWires();
      window.CertificateGenerator.showCertificateModal(studentName, studentRut, netlist, wires);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

})(window);
