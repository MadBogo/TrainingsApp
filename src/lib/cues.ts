/**
 * Audio + haptic cues for timer transitions. All functions fail silently — cues are
 * nice-to-have and must never break a workout on browsers without the APIs (e.g. iOS
 * has no navigator.vibrate).
 */

let audioCtx: AudioContext | null = null;

/**
 * Browsers only allow audio started from a user gesture. Call this inside the click
 * handler that starts a timer so later programmatic beeps (from ticks) are permitted.
 */
export function primeAudio(): void {
  try {
    audioCtx ??= new AudioContext();
    if (audioCtx.state === "suspended") {
      void audioCtx.resume();
    }
  } catch {
    audioCtx = null;
  }
}

function playTone(frequency: number, durationMs: number, volume = 0.15): void {
  try {
    if (!audioCtx || audioCtx.state !== "running") return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = "sine";
    osc.frequency.value = frequency;
    gain.gain.setValueAtTime(volume, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + durationMs / 1000);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + durationMs / 1000);
  } catch {
    // ignore — cue only
  }
}

function vibrate(pattern: number | number[]): void {
  try {
    navigator.vibrate?.(pattern);
  } catch {
    // ignore — cue only
  }
}

/** Short tick for the 3-2-1 countdown into a transition. */
export function cueCountdown(): void {
  playTone(880, 100);
  vibrate(60);
}

/** Longer, higher tone when a segment (minute, work/rest interval) rolls over. */
export function cueTransition(): void {
  playTone(1320, 250);
  vibrate([80, 40, 80]);
}

/** Distinct completion cue when the whole timer finishes. */
export function cueComplete(): void {
  playTone(1320, 180);
  setTimeout(() => playTone(1760, 300), 200);
  vibrate([100, 50, 100, 50, 200]);
}
