/**
 * Sound effects utilities. Genera sonidos programáticamente usando Web Audio API.
 * Sin dependencias externas, respeta volumen del dispositivo.
 */

const audioContext = typeof window !== "undefined" ? new (window.AudioContext || (window as any).webkitAudioContext)() : null;

/**
 * Reproducer un beep/tone simple (para catch)
 */
export function playCatchSound() {
  if (!audioContext || audioContext.state === "suspended") return;

  try {
    const now = audioContext.currentTime;
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();

    osc.connect(gain);
    gain.connect(audioContext.destination);

    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(600, now + 0.1);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);

    osc.start(now);
    osc.stop(now + 0.1);
  } catch (err) {
    console.warn("Sound error:", err);
  }
}

/**
 * Reproducer sonido de milestone/reward (más dramático)
 */
export function playMilestoneSound() {
  if (!audioContext || audioContext.state === "suspended") return;

  try {
    const now = audioContext.currentTime;
    // Dos tonos ascendentes
    [0, 0.15].forEach((delay, i) => {
      const osc = audioContext!.createOscillator();
      const gain = audioContext!.createGain();

      osc.connect(gain);
      gain.connect(audioContext!.destination);

      const freq = 600 + i * 300;
      osc.frequency.setValueAtTime(freq, now + delay);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.3, now + delay + 0.15);

      gain.gain.setValueAtTime(0.2, now + delay);
      gain.gain.exponentialRampToValueAtTime(0.01, now + delay + 0.15);

      osc.start(now + delay);
      osc.stop(now + delay + 0.15);
    });
  } catch (err) {
    console.warn("Sound error:", err);
  }
}

/**
 * Resume audio context si está suspendido (requerido por navegadores)
 */
export function resumeAudioContext() {
  if (!audioContext) return;
  if (audioContext.state === "suspended") {
    audioContext.resume();
  }
}
