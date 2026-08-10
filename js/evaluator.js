/**
 * Evaluador de Topología Eléctrica y Generador de Desafíos de Investigación en Google
 */

(function(window) {

  /**
   * Evalúa las conexiones del circuito.
   * @param {Array} netlist - Arreglo de conexiones [{ from, to, color }]
   * @returns {Object} { isValid, challenge: { searchPhrase, clue } }
   */
  function evaluateCircuit(netlist) {
    if (!netlist || netlist.length === 0) {
      return {
        isValid: false,
        challenge: {
          searchPhrase: 'Cómo alimentar un circuito con ESP32, puente H L298N y motores DC',
          clue: 'Comienza conectando la fuente de poder (Portapilas de Litio) a través del interruptor de encendido.'
        }
      };
    }

    // Construir componentes conexos (Nets) con puentes internos reales (LM2596 GND & ESP32 GND)
    const nets = buildNets(netlist);

    // 1. Regla de Tierra Común (GND Unificado)
    const gndPins = ['bat_neg', 'lm2596_in_neg', 'lm2596_out_neg', 'l298n_gnd', 'esp32_gnd', 'sg90_gnd'];
    const missingGNDs = checkNetInclusion(nets, gndPins);

    if (missingGNDs.length > 0) {
      return {
        isValid: false,
        challenge: {
          searchPhrase: 'Por qué es obligatorio unificar las tierras GND cuando se usan dos fuentes de voltaje distintas en mecatrónica',
          clue: 'Pista: Revisa si el ESP32, el regulador LM2596, la batería y el puente H comparten el mismo punto de referencia de retorno eléctrico.'
        }
      };
    }

    // 2. Regla de Alimentación de Potencia (Batería -> Switch -> LM2596 IN+ / L298N 12V)
    const isPowerConnected = checkPowerChain(nets);
    if (!isPowerConnected) {
      return {
        isValid: false,
        challenge: {
          searchPhrase: 'Esquema de conexión interruptor SPST con regulador buck LM2596 y puente H L298N',
          clue: 'Pista: El polo positivo de la batería (+12V) debe pasar por el interruptor antes de alimentar la entrada IN+ del regulador y el borne 12V del motor driver.'
        }
      };
    }

    // 3. Regla de 5V Regulados (LM2596 OUT+ -> ESP32 VIN & SG90 VCC)
    const isRegulated5VOk = checkConnectedTogether(nets, ['lm2596_out_pos', 'esp32_5v', 'sg90_vcc']);
    if (!isRegulated5VOk) {
      return {
        isValid: false,
        challenge: {
          searchPhrase: 'Cómo alimentar ESP32 DevKit y servomotor SG90 con regulador de voltaje LM2596 a 5V',
          clue: 'Pista: Verifica que la salida limpia regulada a 5V (OUT+) del LM2596 energice el pin VIN del microcontrolador y el cable VCC del servomotor.'
        }
      };
    }

    // 4. Regla de Conexión de Motores DC (L298N OUT1/OUT2 -> Motor A | OUT3/OUT4 -> Motor B)
    // Polaridad relativa (+ / -) flexible
    const isMotorAOk = 
      (checkPairConnection(nets, 'l298n_out1', 'motA_pos') && checkPairConnection(nets, 'l298n_out2', 'motA_neg')) ||
      (checkPairConnection(nets, 'l298n_out1', 'motA_neg') && checkPairConnection(nets, 'l298n_out2', 'motA_pos'));

    const isMotorBOk = 
      (checkPairConnection(nets, 'l298n_out3', 'motB_pos') && checkPairConnection(nets, 'l298n_out4', 'motB_neg')) ||
      (checkPairConnection(nets, 'l298n_out3', 'motB_neg') && checkPairConnection(nets, 'l298n_out4', 'motB_pos'));

    if (!isMotorAOk || !isMotorBOk) {
      return {
        isValid: false,
        challenge: {
          searchPhrase: 'Conexión de motoreductores DC a bornes de salida OUT1 OUT2 OUT3 OUT4 de puente H L298N',
          clue: 'Pista: Comprueba que las salidas de potencia del L298N lleguen a los terminales de cada uno de los 2 motores DC (OUT1/OUT2 a Motor A, OUT3/OUT4 a Motor B).'
        }
      };
    }

    // 5. Regla de Líneas de Control ESP32 (GPIOs a L298N IN1..IN4 y Servo PWM)
    // Permite cualquier pin GPIO/PWM disponible del ESP32 de forma flexible
    const isControlOk = checkControlLines(nets);
    if (!isControlOk) {
      return {
        isValid: false,
        challenge: {
          searchPhrase: 'Pines de control GPIO ESP32 con entradas IN1 IN2 IN3 IN4 de L298N y PWM servomotor SG90',
          clue: 'Pista: Asegúrate de conectar las entradas IN1, IN2, IN3 e IN4 del L298N y el cable de señal PWM del servo a cualquier pin GPIO digital del ESP32.'
        }
      };
    }

    // ¡Circuito 100% Correcto!
    return {
      isValid: true,
      challenge: null
    };
  }

  // Funciones auxiliares de grafos / Netlist
  function buildNets(netlist) {
    const parent = {};

    function find(i) {
      if (!parent[i]) parent[i] = i;
      if (parent[i] === i) return i;
      return parent[i] = find(parent[i]);
    }

    function union(i, j) {
      const rootI = find(i);
      const rootJ = find(j);
      if (rootI !== rootJ) {
        parent[rootI] = rootJ;
      }
    }

    // Puente interno de Tierra común en el LM2596 (IN- y OUT- están unidos en la PCB real)
    union('lm2596_in_neg', 'lm2596_out_neg');

    // Puente interno de GND en el ESP32
    union('esp32_gnd', 'esp32_gnd2');

    netlist.forEach(w => {
      union(w.from, w.to);
    });

    const nets = {};
    Object.keys(parent).forEach(pin => {
      const root = find(pin);
      if (!nets[root]) nets[root] = [];
      nets[root].push(pin);
    });

    return Object.values(nets);
  }

  function checkConnectedTogether(nets, pinList) {
    return nets.some(net => pinList.every(pin => net.includes(pin)));
  }

  function checkPairConnection(nets, pinA, pinB) {
    return nets.some(net => net.includes(pinA) && net.includes(pinB));
  }

  function checkNetInclusion(nets, pinList) {
    const gndNet = nets.find(net => net.includes('bat_neg'));
    if (!gndNet) return pinList;
    return pinList.filter(pin => !gndNet.includes(pin));
  }

  function checkPowerChain(nets) {
    const batPosNet = nets.find(net => net.includes('bat_pos'));
    if (!batPosNet || !batPosNet.includes('sw_in')) return false;

    const swOutNet = nets.find(net => net.includes('sw_out'));
    if (!swOutNet) return false;

    return swOutNet.includes('lm2596_in_pos') && swOutNet.includes('l298n_12v');
  }

  function checkControlLines(nets) {
    const esp32GpioPins = [
      'esp32_gpio12', 'esp32_gpio13', 'esp32_gpio14', 'esp32_gpio27', 'esp32_gpio26',
      'esp32_d15', 'esp32_d2', 'esp32_d4', 'esp32_rx2', 'esp32_tx2', 'esp32_d5',
      'esp32_d18', 'esp32_d19', 'esp32_d21', 'esp32_d22', 'esp32_d23', 'esp32_d25',
      'esp32_d32', 'esp32_d33', 'esp32_d34', 'esp32_d35', 'esp32_vp', 'esp32_vn',
      'esp32_en', 'esp32_rx0', 'esp32_tx0'
    ];

    const in1Ok = esp32GpioPins.some(gpio => checkPairConnection(nets, gpio, 'l298n_in1'));
    const in2Ok = esp32GpioPins.some(gpio => checkPairConnection(nets, gpio, 'l298n_in2'));
    const in3Ok = esp32GpioPins.some(gpio => checkPairConnection(nets, gpio, 'l298n_in3'));
    const in4Ok = esp32GpioPins.some(gpio => checkPairConnection(nets, gpio, 'l298n_in4'));
    const servoOk = esp32GpioPins.some(gpio => checkPairConnection(nets, gpio, 'sg90_pwm'));

    return in1Ok && in2Ok && in3Ok && in4Ok && servoOk;
  }

  window.CircuitEvaluator = { evaluateCircuit };

})(window);
