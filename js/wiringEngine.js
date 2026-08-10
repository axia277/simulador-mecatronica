/**
 * Motor de Cableado e Interacción Táctil SVG Estilo Wokwi
 * Edición Estudiante: Coordenadas Definitivas Calibradas Fijas, Persistencia LocalStorage y Zoom Táctil
 */

(function(window) {

  const STORAGE_KEY = 'mecatronica_sim_state_v6';

  let svgCanvas = null;
  let activePin = null;
  let selectedWireId = null;
  let currentColor = '#ef4444';
  let wires = [];
  let componentsState = [];

  // Zoom & Pan State
  let zoomScale = 1.0;
  let panX = 0;
  let panY = 0;
  let initialPinchDistance = null;

  function initWiringEngine(svgElementId) {
    svgCanvas = document.getElementById(svgElementId);
    if (!svgCanvas) return;

    componentsState = JSON.parse(JSON.stringify(window.ComponentsData || []));

    loadSavedState();

    svgCanvas.addEventListener('click', (e) => {
      if (e.target === svgCanvas || e.target.id === 'workspaceBg') {
        selectedWireId = null;
        renderAll();
      }
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedWireId) {
          removeWire(selectedWireId);
        }
      }
    });

    svgCanvas.addEventListener('touchstart', handleTouchStart, { passive: false });
    svgCanvas.addEventListener('touchmove', handleTouchMove, { passive: false });
    svgCanvas.addEventListener('touchend', handleTouchEnd);

    window.addEventListener('resize', renderAll);
    renderAll();
  }

  /* --- Persistencia LocalStorage para Cables y Posición --- */
  function saveCurrentState() {
    try {
      const stateToSave = {
        wires: wires,
        compPositions: componentsState.map(c => ({ id: c.id, x: c.initialX, y: c.initialY }))
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
    } catch (err) {
      console.warn('No se pudo guardar el estado en localStorage:', err);
    }
  }

  function loadSavedState() {
    try {
      const savedRaw = localStorage.getItem(STORAGE_KEY);
      if (!savedRaw) return;
      const saved = JSON.parse(savedRaw);
      if (saved.wires && Array.isArray(saved.wires)) {
        wires = saved.wires;
      }
      if (saved.compPositions && Array.isArray(saved.compPositions)) {
        saved.compPositions.forEach(pos => {
          const comp = componentsState.find(c => c.id === pos.id);
          if (comp) {
            comp.initialX = pos.x;
            comp.initialY = pos.y;
          }
        });
      }
    } catch (err) {
      console.warn('Error al cargar estado de localStorage:', err);
    }
  }

  /* --- Zoom & Pan --- */
  function zoomIn() {
    zoomScale = Math.min(2.5, zoomScale + 0.2);
    applyTransform();
  }

  function zoomOut() {
    zoomScale = Math.max(0.5, zoomScale - 0.2);
    applyTransform();
  }

  function resetZoom() {
    zoomScale = 1.0;
    panX = 0;
    panY = 0;
    applyTransform();
  }

  function applyTransform() {
    const mainGroup = document.getElementById('mainTransformGroup');
    if (mainGroup) {
      mainGroup.setAttribute('transform', `translate(${panX}, ${panY}) scale(${zoomScale})`);
    }
  }

  function handleTouchStart(e) {
    if (e.touches.length === 2) {
      e.preventDefault();
      initialPinchDistance = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
    }
  }

  function handleTouchMove(e) {
    if (e.touches.length === 2 && initialPinchDistance) {
      e.preventDefault();
      const currentDist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const factor = currentDist / initialPinchDistance;
      zoomScale = Math.max(0.5, Math.min(2.5, zoomScale * factor));
      initialPinchDistance = currentDist;
      applyTransform();
    }
  }

  function handleTouchEnd() {
    initialPinchDistance = null;
  }

  function setWireColor(colorHex) {
    currentColor = colorHex;
    if (selectedWireId) {
      const wire = wires.find(w => w.id === selectedWireId);
      if (wire) {
        wire.color = colorHex;
        saveCurrentState();
        renderAll();
      }
    }
  }

  function getSVGPoint(e) {
    if (!svgCanvas) return { x: 0, y: 0 };
    const pt = svgCanvas.createSVGPoint();
    const evt = e.touches && e.touches.length > 0 ? e.touches[0] : e;
    pt.x = evt.clientX;
    pt.y = evt.clientY;
    const ctm = svgCanvas.getScreenCTM();
    if (!ctm) return { x: 0, y: 0 };
    const raw = pt.matrixTransform(ctm.inverse());
    return {
      x: (raw.x - panX) / zoomScale,
      y: (raw.y - panY) / zoomScale
    };
  }

  function renderAll() {
    if (!svgCanvas) return;
    svgCanvas.innerHTML = '';

    const bg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    bg.setAttribute('id', 'workspaceBg');
    bg.setAttribute('width', '100%');
    bg.setAttribute('height', '100%');
    bg.setAttribute('fill', '#ffffff');
    bg.setAttribute('pointer-events', 'all');
    svgCanvas.appendChild(bg);

    const mainGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    mainGroup.setAttribute('id', 'mainTransformGroup');
    mainGroup.setAttribute('transform', `translate(${panX}, ${panY}) scale(${zoomScale})`);
    svgCanvas.appendChild(mainGroup);

    const compGroupLayer = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    compGroupLayer.setAttribute('id', 'componentsLayer');
    mainGroup.appendChild(compGroupLayer);

    const wiresGroupLayer = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    wiresGroupLayer.setAttribute('id', 'wiresLayer');
    mainGroup.appendChild(wiresGroupLayer);

    componentsState.forEach(comp => {
      renderComponent(compGroupLayer, comp);
    });

    renderWires(wiresGroupLayer);
  }

  function renderComponent(layer, comp) {
    const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    group.setAttribute('class', 'comp-group');
    group.setAttribute('transform', `translate(${comp.initialX}, ${comp.initialY})`);
    group.setAttribute('data-comp-id', comp.id);

    const scale = comp.scale || 1.0;
    const rotation = comp.rotation || 0;

    // Foto real como fondo SIN SOMBRA
    if (comp.imageSrc) {
      const img = document.createElementNS('http://www.w3.org/2000/svg', 'image');
      img.setAttribute('href', comp.imageSrc);
      img.setAttribute('width', comp.width * scale);
      img.setAttribute('height', comp.height * scale);
      img.setAttribute('transform', `rotate(${rotation} ${ (comp.width * scale)/2 } ${ (comp.height * scale)/2 })`);
      img.setAttribute('preserveAspectRatio', 'xMidYMid meet');
      group.appendChild(img);
    }

    // Título arriba con alto contraste
    const titleBg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    titleBg.setAttribute('x', 6);
    titleBg.setAttribute('y', -18);
    titleBg.setAttribute('width', (comp.width * scale) - 12);
    titleBg.setAttribute('height', 16);
    titleBg.setAttribute('rx', 4);
    titleBg.setAttribute('fill', '#0f172a');
    group.appendChild(titleBg);

    const title = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    title.setAttribute('x', (comp.width * scale) / 2);
    title.setAttribute('y', -6);
    title.setAttribute('fill', '#38bdf8');
    title.setAttribute('font-size', '9.5');
    title.setAttribute('font-weight', 'bold');
    title.setAttribute('font-family', 'sans-serif');
    title.setAttribute('text-anchor', 'middle');
    title.textContent = comp.name;
    group.appendChild(title);

    // Pines Interactivos
    comp.pins.forEach(pin => {
      const pinGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');

      const pinCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      pinCircle.setAttribute('class', 'terminal-pin');
      if (activePin && activePin.pin.id === pin.id) {
        pinCircle.classList.add('pin-active');
      }
      pinCircle.setAttribute('cx', pin.x * scale);
      pinCircle.setAttribute('cy', pin.y * scale);
      pinCircle.setAttribute('r', 6.5);
      pinCircle.setAttribute('fill', '#0f172a');
      pinCircle.setAttribute('stroke', '#38bdf8');
      pinCircle.setAttribute('stroke-width', 2);
      pinCircle.setAttribute('data-pin-id', pin.id);
      pinCircle.setAttribute('data-comp-id', comp.id);

      pinCircle.addEventListener('click', (e) => {
        e.stopPropagation();
        handlePinClick(comp, pin);
      });

      pinGroup.appendChild(pinCircle);

      if (pin.name) {
        const anchor = pin.labelAnchor || 'start';
        const labelX = (pin.x * scale) + (pin.labelOffsetX !== undefined ? pin.labelOffsetX : 12);
        const labelY = (pin.y * scale) + (pin.labelOffsetY !== undefined ? pin.labelOffsetY : 3);
        const textWidth = pin.name.length * 6 + 6;

        let bgX = labelX;
        if (anchor === 'end') bgX = labelX - textWidth;
        else if (anchor === 'middle') bgX = labelX - textWidth / 2;

        const labelBg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        labelBg.setAttribute('x', bgX);
        labelBg.setAttribute('y', labelY - 9);
        labelBg.setAttribute('width', textWidth);
        labelBg.setAttribute('height', 12);
        labelBg.setAttribute('rx', 2);
        labelBg.setAttribute('fill', '#0f172a');

        const pinLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        pinLabel.setAttribute('x', bgX + textWidth / 2);
        pinLabel.setAttribute('y', labelY);
        pinLabel.setAttribute('fill', '#38bdf8');
        pinLabel.setAttribute('font-size', '8');
        pinLabel.setAttribute('font-weight', 'bold');
        pinLabel.setAttribute('font-family', 'monospace');
        pinLabel.setAttribute('text-anchor', 'middle');
        pinLabel.textContent = pin.name;

        pinGroup.appendChild(labelBg);
        pinGroup.appendChild(pinLabel);
      }

      group.appendChild(pinGroup);
    });

    enableDrag(group, comp);
    layer.appendChild(group);
  }

  function handlePinClick(comp, pin) {
    selectedWireId = null;

    if (!activePin) {
      activePin = { comp, pin };
      renderAll();
    } else {
      if (activePin.pin.id === pin.id) {
        activePin = null;
        renderAll();
        return;
      }
      createWire(activePin, { comp, pin });
      activePin = null;
      renderAll();
    }
  }

  function createWire(from, to) {
    const wireId = `wire_${Date.now()}_${Math.floor(Math.random()*1000)}`;
    const newWire = {
      id: wireId,
      fromCompId: from.comp.id,
      fromPinId: from.pin.id,
      toCompId: to.comp.id,
      toPinId: to.pin.id,
      color: currentColor
    };
    wires.push(newWire);
    selectedWireId = wireId;
    saveCurrentState();
  }

  function renderWires(wiresLayer) {
    wires.forEach(w => {
      const fromPos = getAbsolutePinPos(w.fromCompId, w.fromPinId);
      const toPos = getAbsolutePinPos(w.toCompId, w.toPinId);

      if (!fromPos || !toPos) return;

      const isSelected = (selectedWireId === w.id);
      const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');

      const distance = Math.hypot(toPos.x - fromPos.x, toPos.y - fromPos.y);
      const droop = Math.min(130, Math.max(35, distance * 0.35));

      const cx1 = fromPos.x;
      const cy1 = fromPos.y + droop;
      const cx2 = toPos.x;
      const cy2 = toPos.y + droop;

      const d = `M ${fromPos.x} ${fromPos.y} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${toPos.x} ${toPos.y}`;

      if (isSelected) {
        const glow = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        glow.setAttribute('d', d);
        glow.setAttribute('stroke', '#0284c7');
        glow.setAttribute('stroke-width', 9);
        glow.setAttribute('stroke-dasharray', '6, 4');
        glow.setAttribute('fill', 'none');
        group.appendChild(glow);
      }

      const outline = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      outline.setAttribute('d', d);
      outline.setAttribute('stroke', 'rgba(0,0,0,0.6)');
      outline.setAttribute('stroke-width', 6);
      outline.setAttribute('fill', 'none');
      group.appendChild(outline);

      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', d);
      path.setAttribute('stroke', w.color);
      path.setAttribute('stroke-width', isSelected ? 5 : 4);
      path.setAttribute('fill', 'none');
      path.setAttribute('class', 'circuit-wire');
      path.setAttribute('data-wire-id', w.id);

      path.addEventListener('click', (e) => {
        e.stopPropagation();
        selectedWireId = w.id;
        renderAll();
      });

      group.appendChild(path);

      const t1 = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      t1.setAttribute('cx', fromPos.x); t1.setAttribute('cy', fromPos.y);
      t1.setAttribute('r', isSelected ? 5 : 4); t1.setAttribute('fill', w.color);
      t1.setAttribute('stroke', '#ffffff'); t1.setAttribute('stroke-width', 1.5);
      group.appendChild(t1);

      const t2 = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      t2.setAttribute('cx', toPos.x); t2.setAttribute('cy', toPos.y);
      t2.setAttribute('r', isSelected ? 5 : 4); t2.setAttribute('fill', w.color);
      t2.setAttribute('stroke', '#ffffff'); t2.setAttribute('stroke-width', 1.5);
      group.appendChild(t2);

      wiresLayer.appendChild(group);
    });
  }

  function removeSelectedWire() {
    if (selectedWireId) {
      removeWire(selectedWireId);
    }
  }

  function removeWire(wireId) {
    wires = wires.filter(w => w.id !== wireId);
    if (selectedWireId === wireId) {
      selectedWireId = null;
    }
    saveCurrentState();
    renderAll();
  }

  function clearAllWires() {
    wires = [];
    activePin = null;
    selectedWireId = null;
    saveCurrentState();
    renderAll();
  }

  function getAbsolutePinPos(compId, pinId) {
    const comp = componentsState.find(c => c.id === compId);
    if (!comp) return null;
    const pin = comp.pins.find(p => p.id === pinId);
    if (!pin) return null;

    const scale = comp.scale || 1.0;
    return {
      x: comp.initialX + (pin.x * scale),
      y: comp.initialY + (pin.y * scale)
    };
  }

  function enableDrag(groupElement, comp) {
    let isDragging = false;
    let offsetSVGX = 0;
    let offsetSVGY = 0;

    const onStart = (e) => {
      if (e.target && e.target.classList.contains('terminal-pin')) return;

      isDragging = true;
      selectedWireId = null;
      const pt = getSVGPoint(e);
      offsetSVGX = pt.x - comp.initialX;
      offsetSVGY = pt.y - comp.initialY;
    };

    const onMove = (e) => {
      if (!isDragging) return;
      const pt = getSVGPoint(e);

      comp.initialX = pt.x - offsetSVGX;
      comp.initialY = pt.y - offsetSVGY;

      comp.initialX = Math.max(-50, Math.min(1200, comp.initialX));
      comp.initialY = Math.max(-50, Math.min(1200, comp.initialY));

      groupElement.setAttribute('transform', `translate(${comp.initialX}, ${comp.initialY})`);
      
      const wiresLayer = document.getElementById('wiresLayer');
      if (wiresLayer) {
        wiresLayer.innerHTML = '';
        renderWires(wiresLayer);
      }
    };

    const onEnd = () => {
      if (isDragging) {
        isDragging = false;
        saveCurrentState();
        renderAll();
      }
    };

    groupElement.addEventListener('mousedown', onStart);
    groupElement.addEventListener('touchstart', onStart, { passive: true });

    window.addEventListener('mousemove', onMove);
    window.addEventListener('touchmove', onMove, { passive: true });

    window.addEventListener('mouseup', onEnd);
    window.addEventListener('touchend', onEnd);
  }

  function getConnectedNetlist() {
    return wires.map(w => ({
      from: w.fromPinId,
      to: w.toPinId,
      color: w.color
    }));
  }

  window.WiringEngine = {
    initWiringEngine,
    setWireColor,
    removeSelectedWire,
    clearAllWires,
    zoomIn,
    zoomOut,
    resetZoom,
    getSelectedWireId: () => selectedWireId,
    getConnectedNetlist,
    getWires: () => wires,
    getComponents: () => componentsState
  };

})(window);
