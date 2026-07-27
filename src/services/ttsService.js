// TTS & Web Audio Service for CareMate

class TTSService {
  constructor() {
    this.synth = window.speechSynthesis || null;
    this.voiceEnabled = true;
    this.audioCtx = null;
    this.musicTimer = null;
    this.isMusicPlaying = false;
  }

  initAudioContext() {
    if (!this.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.audioCtx = new AudioContext();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  playChime(type = 'notification') {
    try {
      this.initAudioContext();
      if (!this.audioCtx) return;

      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      const now = this.audioCtx.currentTime;

      if (type === 'rainbow') {
        // Arpeggio Fanfare for Rainbow Celebration
        const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51]; // C5 E5 G5 C6 E6
        notes.forEach((freq, idx) => {
          const o = this.audioCtx.createOscillator();
          const g = this.audioCtx.createGain();
          o.type = 'triangle';
          o.frequency.value = freq;
          o.connect(g);
          g.connect(this.audioCtx.destination);
          g.gain.setValueAtTime(0.2, now + idx * 0.08);
          g.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.4);
          o.start(now + idx * 0.08);
          o.stop(now + idx * 0.08 + 0.4);
        });
      } else if (type === 'apple') {
        // Bright Apple Pick Sound
        osc.frequency.setValueAtTime(880, now); // A5
        osc.frequency.setValueAtTime(1760, now + 0.08); // A6
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
      } else if (type === 'alert') {
        // High pitch double beep
        osc.frequency.setValueAtTime(880, now);
        osc.frequency.setValueAtTime(1046.5, now + 0.15);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
        osc.start(now);
        osc.stop(now + 0.35);
      } else if (type === 'success') {
        osc.frequency.setValueAtTime(523.25, now);
        osc.frequency.setValueAtTime(659.25, now + 0.1);
        osc.frequency.setValueAtTime(783.99, now + 0.2);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
        osc.start(now);
        osc.stop(now + 0.5);
      } else {
        osc.frequency.setValueAtTime(587.33, now);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
        osc.start(now);
        osc.stop(now + 0.25);
      }
    } catch (e) {
      console.warn("Audio playback error:", e);
    }
  }

  // Soothing Exercise Background Music Generator using Web Audio API
  startExerciseMusic() {
    if (this.isMusicPlaying) return;
    this.initAudioContext();
    if (!this.audioCtx) return;

    this.isMusicPlaying = true;
    const melody = [261.63, 329.63, 392.00, 523.25, 392.00, 329.63]; // C4, E4, G4, C5...
    let step = 0;

    this.musicTimer = setInterval(() => {
      if (!this.isMusicPlaying || !this.audioCtx) return;
      try {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.value = melody[step % melody.length];
        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        const now = this.audioCtx.currentTime;
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
        osc.start(now);
        osc.stop(now + 0.6);
        step++;
      } catch (err) {
        console.warn(err);
      }
    }, 650);
  }

  stopExerciseMusic() {
    this.isMusicPlaying = false;
    if (this.musicTimer) {
      clearInterval(this.musicTimer);
      this.musicTimer = null;
    }
  }

  speak(text, lang = 'zh-TW') {
    if (!this.voiceEnabled || !this.synth) return;

    setTimeout(() => {
      try {
        this.synth.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = lang === 'zh' ? 'zh-TW' : (lang === 'en' ? 'en-US' : lang);
        utterance.rate = 0.9;
        utterance.pitch = 1.05;

        const voices = this.synth.getVoices();
        if (voices && voices.length > 0) {
          const targetLang = lang.startsWith('zh') ? 'zh' : 'en';
          const matchedVoice = voices.find(v => v.lang.toLowerCase().includes(targetLang));
          if (matchedVoice) {
            utterance.voice = matchedVoice;
          }
        }

        this.synth.speak(utterance);
      } catch (err) {
        console.warn("TTS Error:", err);
      }
    }, 150);
  }

  setVoiceEnabled(enabled) {
    this.voiceEnabled = enabled;
    if (!enabled && this.synth) {
      this.synth.cancel();
    }
  }
}

export const tts = new TTSService();
