/**
 * Definiciones vectoriales y coordenadas por defecto permanentes para alumnos (Sin sobreposiciones)
 */

(function(window) {

  const COMPONENTS = [
    {
      id: 'esp32',
      name: 'ESP32 DevKit V1',
      width: 200,
      height: 370,
      initialX: 30,
      initialY: 30,
      imageSrc: './img/esp32.png',
      pins: [
        // 15 Pines Izquierda (Alineados a x = 33)
        { id: 'esp32_en', name: 'EN', x: 33, y: 64, type: 'gpio', labelOffsetX: 14, labelAnchor: 'start' },
        { id: 'esp32_vp', name: 'VP', x: 33, y: 83, type: 'gpio', labelOffsetX: 14, labelAnchor: 'start' },
        { id: 'esp32_vn', name: 'VN', x: 33, y: 102, type: 'gpio', labelOffsetX: 14, labelAnchor: 'start' },
        { id: 'esp32_d34', name: 'D34', x: 33, y: 121, type: 'gpio', labelOffsetX: 14, labelAnchor: 'start' },
        { id: 'esp32_d35', name: 'D35', x: 33, y: 140, type: 'gpio', labelOffsetX: 14, labelAnchor: 'start' },
        { id: 'esp32_d32', name: 'D32', x: 33, y: 159, type: 'gpio', labelOffsetX: 14, labelAnchor: 'start' },
        { id: 'esp32_d33', name: 'D33', x: 33, y: 178, type: 'gpio', labelOffsetX: 14, labelAnchor: 'start' },
        { id: 'esp32_d25', name: 'D25', x: 33, y: 197, type: 'gpio', labelOffsetX: 14, labelAnchor: 'start' },
        { id: 'esp32_gpio26', name: 'D26', x: 33, y: 216, type: 'gpio', labelOffsetX: 14, labelAnchor: 'start' },
        { id: 'esp32_gpio27', name: 'D27', x: 33, y: 235, type: 'gpio', labelOffsetX: 14, labelAnchor: 'start' },
        { id: 'esp32_gpio14', name: 'D14', x: 33, y: 254, type: 'gpio', labelOffsetX: 14, labelAnchor: 'start' },
        { id: 'esp32_gpio12', name: 'D12', x: 33, y: 273, type: 'gpio', labelOffsetX: 14, labelAnchor: 'start' },
        { id: 'esp32_gpio13', name: 'D13', x: 33, y: 292, type: 'gpio', labelOffsetX: 14, labelAnchor: 'start' },
        { id: 'esp32_gnd', name: 'GND', x: 33, y: 311, type: 'gnd', labelOffsetX: 14, labelAnchor: 'start' },
        { id: 'esp32_5v', name: 'VIN', x: 33, y: 330, type: 'power', labelOffsetX: 14, labelAnchor: 'start' },

        // 15 Pines Derecha (Alineados a x = 167)
        { id: 'esp32_3v3', name: '3V3', x: 167, y: 64, type: 'power', labelOffsetX: -14, labelAnchor: 'end' },
        { id: 'esp32_gnd2', name: 'GND', x: 167, y: 83, type: 'gnd', labelOffsetX: -14, labelAnchor: 'end' },
        { id: 'esp32_d15', name: 'D15', x: 167, y: 102, type: 'gpio', labelOffsetX: -14, labelAnchor: 'end' },
        { id: 'esp32_d2', name: 'D2', x: 167, y: 121, type: 'gpio', labelOffsetX: -14, labelAnchor: 'end' },
        { id: 'esp32_d4', name: 'D4', x: 167, y: 140, type: 'gpio', labelOffsetX: -14, labelAnchor: 'end' },
        { id: 'esp32_rx2', name: 'RX2', x: 167, y: 159, type: 'gpio', labelOffsetX: -14, labelAnchor: 'end' },
        { id: 'esp32_tx2', name: 'TX2', x: 167, y: 178, type: 'gpio', labelOffsetX: -14, labelAnchor: 'end' },
        { id: 'esp32_d5', name: 'D5', x: 167, y: 197, type: 'gpio', labelOffsetX: -14, labelAnchor: 'end' },
        { id: 'esp32_d18', name: 'D18', x: 167, y: 216, type: 'gpio', labelOffsetX: -14, labelAnchor: 'end' },
        { id: 'esp32_d19', name: 'D19', x: 167, y: 235, type: 'gpio', labelOffsetX: -14, labelAnchor: 'end' },
        { id: 'esp32_d21', name: 'D21', x: 167, y: 254, type: 'gpio', labelOffsetX: -14, labelAnchor: 'end' },
        { id: 'esp32_rx0', name: 'RX0', x: 167, y: 273, type: 'gpio', labelOffsetX: -14, labelAnchor: 'end' },
        { id: 'esp32_tx0', name: 'TX0', x: 167, y: 292, type: 'gpio', labelOffsetX: -14, labelAnchor: 'end' },
        { id: 'esp32_d22', name: 'D22', x: 167, y: 311, type: 'gpio', labelOffsetX: -14, labelAnchor: 'end' },
        { id: 'esp32_d23', name: 'D23', x: 167, y: 330, type: 'gpio', labelOffsetX: -14, labelAnchor: 'end' }
      ]
    },
    {
      id: 'l298n',
      name: 'Puente H L298N',
      width: 220,
      height: 220,
      initialX: 250,
      initialY: 30,
      imageSrc: './img/l298n.png',
      pins: [
        // Bornes de Alimentación (Arriba)
        { id: 'l298n_12v', name: '12V', x: 96, y: 64, type: 'power', labelOffsetX: 0, labelOffsetY: -18, labelAnchor: 'middle' },
        { id: 'l298n_gnd', name: 'GND', x: 115, y: 64, type: 'gnd', labelOffsetX: 0, labelOffsetY: -18, labelAnchor: 'middle' },
        { id: 'l298n_5v', name: '5V', x: 132, y: 64, type: 'power', labelOffsetX: 0, labelOffsetY: -18, labelAnchor: 'middle' },

        // Pines Lógicos IN1..IN4 (Abajo Izquierda)
        { id: 'l298n_in1', name: 'IN1', x: 57, y: 125, type: 'input', labelOffsetX: 16, labelAnchor: 'start' },
        { id: 'l298n_in2', name: 'IN2', x: 57, y: 139, type: 'input', labelOffsetX: 16, labelAnchor: 'start' },
        { id: 'l298n_in3', name: 'IN3', x: 57, y: 153, type: 'input', labelOffsetX: 16, labelAnchor: 'start' },
        { id: 'l298n_in4', name: 'IN4', x: 57, y: 167, type: 'input', labelOffsetX: 16, labelAnchor: 'start' },

        // Bornes OUT1..OUT4 (Abajo Derecha)
        { id: 'l298n_out1', name: 'OUT1', x: 92, y: 172, type: 'output', labelOffsetX: 0, labelOffsetY: 18, labelAnchor: 'middle' },
        { id: 'l298n_out2', name: 'OUT2', x: 110, y: 172, type: 'output', labelOffsetX: 0, labelOffsetY: 18, labelAnchor: 'middle' },
        { id: 'l298n_out3', name: 'OUT3', x: 136, y: 172, type: 'output', labelOffsetX: 0, labelOffsetY: 18, labelAnchor: 'middle' },
        { id: 'l298n_out4', name: 'OUT4', x: 154, y: 172, type: 'output', labelOffsetX: 0, labelOffsetY: 18, labelAnchor: 'middle' }
      ]
    },
    {
      id: 'lm2596',
      name: 'Regulador LM2596',
      width: 210,
      height: 120,
      initialX: 30,
      initialY: 430,
      imageSrc: './img/lm2596.png',
      pins: [
        { id: 'lm2596_in_pos', name: 'IN+', x: 25, y: 35, type: 'power', labelOffsetX: 16, labelAnchor: 'start' },
        { id: 'lm2596_in_neg', name: 'IN-', x: 25, y: 85, type: 'gnd', labelOffsetX: 16, labelAnchor: 'start' },
        { id: 'lm2596_out_pos', name: 'OUT+', x: 185, y: 35, type: 'power', labelOffsetX: -16, labelAnchor: 'end' },
        { id: 'lm2596_out_neg', name: 'OUT-', x: 185, y: 85, type: 'gnd', labelOffsetX: -16, labelAnchor: 'end' }
      ]
    },
    {
      id: 'battery',
      name: 'Portapilas Litio (3x 18650)',
      width: 220,
      height: 130,
      initialX: 260,
      initialY: 430,
      imageSrc: './img/battery.png',
      pins: [
        // Conexión exacta en las puntas peladas de los cables rojo (+) y negro (-)
        { id: 'bat_pos', name: '12V', x: 152, y: 138, type: 'power', labelOffsetX: 16, labelOffsetY: 3, labelAnchor: 'start' },
        { id: 'bat_neg', name: 'GND', x: 180, y: 152, type: 'gnd', labelOffsetX: 16, labelOffsetY: 3, labelAnchor: 'start' }
      ]
    },
    {
      id: 'switch',
      name: 'Interruptor SPST',
      width: 140,
      height: 140,
      initialX: 500,
      initialY: 430,
      imageSrc: './img/switch.png',
      pins: [
        { id: 'sw_in', name: 'Pin A', x: 45, y: 115, type: 'switch', labelOffsetX: -14, labelOffsetY: 3, labelAnchor: 'end' },
        { id: 'sw_out', name: 'Pin B', x: 95, y: 115, type: 'switch', labelOffsetX: 14, labelOffsetY: 3, labelAnchor: 'start' }
      ]
    },
    {
      id: 'motorA',
      name: 'Motoreductor A (Izq.)',
      width: 170,
      height: 125,
      initialX: 500,
      initialY: 30,
      imageSrc: './img/motor.png',
      pins: [
        { id: 'motA_pos', name: 'M1+', x: 142, y: 55, type: 'motor', labelOffsetX: -16, labelAnchor: 'end' },
        { id: 'motA_neg', name: 'M1-', x: 142, y: 85, type: 'motor', labelOffsetX: -16, labelAnchor: 'end' }
      ]
    },
    {
      id: 'motorB',
      name: 'Motoreductor B (Der.)',
      width: 170,
      height: 125,
      initialX: 500,
      initialY: 175,
      imageSrc: './img/motor.png',
      pins: [
        { id: 'motB_pos', name: 'M2+', x: 142, y: 55, type: 'motor', labelOffsetX: -16, labelAnchor: 'end' },
        { id: 'motB_neg', name: 'M2-', x: 142, y: 85, type: 'motor', labelOffsetX: -16, labelAnchor: 'end' }
      ]
    },
    {
      id: 'sg90',
      name: 'Servomotor SG90',
      width: 160,
      height: 140,
      initialX: 680,
      initialY: 30,
      imageSrc: './img/sg90.png',
      pins: [
        { id: 'sg90_vcc', name: 'VCC', x: 115, y: 115, type: 'power', labelOffsetX: -14, labelOffsetY: 3, labelAnchor: 'end' },
        { id: 'sg90_gnd', name: 'GND', x: 135, y: 115, type: 'gnd', labelOffsetX: 0, labelOffsetY: 16, labelAnchor: 'middle' },
        { id: 'sg90_pwm', name: 'PWM', x: 155, y: 115, type: 'signal', labelOffsetX: 14, labelOffsetY: 3, labelAnchor: 'start' }
      ]
    }
  ];

  window.ComponentsData = COMPONENTS;

})(window);
