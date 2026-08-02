// TTS Service and Web Audio Sound Effects Synthesizer

class TTSService {
  constructor() {
    this.synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
    this.audioCtx = null;
    this.exerciseMusicInterval = null;
    this.currentTrack = 'ambient'; // 'ambient', 'piano', 'retro'
  }

  initAudioContext() {
    if (!this.audioCtx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.audioCtx = new AudioCtx();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  speak(text, lang = 'zh') {
    if (!this.synth) return;
    this.synth.cancel(); // Cancel ongoing speech

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang === 'zh' ? 'zh-TW' : 'en-US';
    utterance.rate = 0.95; // Slightly slower for elderly comprehension
    utterance.pitch = 1.0;

    this.synth.speak(utterance);
  }

  // Web Audio Synthesizer Chimes
  playChime(type = 'success') {
    this.initAudioContext();
    if (!this.audioCtx) return;

    const now = this.audioCtx.currentTime;
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.connect(gain);
    gain.connect(this.audioCtx.destination);

    if (type === 'success') {
      // Gentle Arpeggio: C5 - E5 - G5 - C6
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.setValueAtTime(659.25, now + 0.1); // E5
      osc.frequency.setValueAtTime(783.99, now + 0.2); // G5
      osc.frequency.setValueAtTime(1046.50, now + 0.3); // C6

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

      osc.start(now);
      osc.stop(now + 0.6);
    } else if (type === 'rainbow') {
      // Celebration Glissando
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(1200, now + 0.5);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

      osc.start(now);
      osc.stop(now + 0.5);
    } else if (type === 'apple') {
      // Cheerful reward chime
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, now); // D5
      osc.frequency.setValueAtTime(880.00, now + 0.15); // A5

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

      osc.start(now);
      osc.stop(now + 0.5);
    } else if (type === 'warning') {
      // SOS Loud Alert Alarm
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.setValueAtTime(660, now + 0.2);
      osc.frequency.setValueAtTime(880, now + 0.4);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

      osc.start(now);
      osc.stop(now + 0.6);
    } else {
      // Standard notification click
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

      osc.start(now);
      osc.stop(now + 0.2);
    }
  }

  // Soothing Exercise Background Music Synthesizer (Ambient, Piano, Retro)
  playExerciseMusic(track = 'ambient') {
    this.initAudioContext();
    if (!this.audioCtx) return;
    this.stopExerciseMusic();
    this.currentTrack = track;

    let step = 0;
    const chordsAmbient = [261.63, 329.63, 392.00, 523.25]; // C major
    const chordsPiano = [349.23, 440.00, 523.25, 698.46]; // F major
    const chordsRetro = [392.00, 493.88, 587.33, 783.99]; // G major

    this.exerciseMusicInterval = setInterval(() => {
      if (!this.audioCtx) return;
      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      let activeChords = chordsAmbient;
      if (this.currentTrack === 'piano') activeChords = chordsPiano;
      if (this.currentTrack === 'retro') activeChords = chordsRetro;

      const freq = activeChords[step % activeChords.length];
      osc.type = this.currentTrack === 'piano' ? 'sine' : (this.currentTrack === 'retro' ? 'triangle' : 'sine');
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);

      osc.start(now);
      osc.stop(now + 0.8);

      step++;
    }, 700);
  }

  stopExerciseMusic() {
    if (this.exerciseMusicInterval) {
      clearInterval(this.exerciseMusicInterval);
      this.exerciseMusicInterval = null;
    }
  }
}

export const tts = new TTSService();
