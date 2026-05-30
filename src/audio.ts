// Simple Web Audio API Synthesizer for Primary School Quiz Game
class QuizAudioEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  private initContext() {
    if (!this.ctx) {
      // Create audio context on user interaction
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  public setMute(muted: boolean) {
    this.isMuted = muted;
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }

  public getMuteState(): boolean {
    return this.isMuted;
  }

  // "Ting" Sound for Correct Answers
  public playCorrect() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      
      // Dual-tone chime for a richer sound
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gainNode = this.ctx.createGain();

      osc1.type = "sine";
      osc1.frequency.setValueAtTime(523.25, now); // C5
      osc1.frequency.exponentialRampToValueAtTime(1046.50, now + 0.15); // C6

      osc2.type = "sine";
      osc2.frequency.setValueAtTime(659.25, now); // E5
      osc2.frequency.exponentialRampToValueAtTime(1318.50, now + 0.15); // E6

      gainNode.gain.setValueAtTime(0.001, now);
      gainNode.gain.linearRampToValueAtTime(0.2, now + 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

      osc1.connect(gainNode);
      osc2.connect(gainNode);
      gainNode.connect(this.ctx.destination);

      osc1.start(now);
      osc2.start(now);

      osc1.stop(now + 0.5);
      osc2.stop(now + 0.5);
    } catch (e) {
      console.warn("Audio context not supported yet or user gestured needed:", e);
    }
  }

  // "Oop" Sound for Wrong Answers
  public playWrong() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gainNode = this.ctx.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(180, now); // G3
      osc.frequency.linearRampToValueAtTime(90, now + 0.25); // Slump down in frequency

      gainNode.gain.setValueAtTime(0.001, now);
      gainNode.gain.linearRampToValueAtTime(0.25, now + 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.connect(gainNode);
      gainNode.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.4);
    } catch (e) {
      console.warn("Audio context not supported yet or user gestured needed:", e);
    }
  }

  // Playful victory fanfare for completion!
  public playVictory() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const playTone = (freq: number, start: number, duration: number) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gainNode = this.ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, start);

        gainNode.gain.setValueAtTime(0.001, start);
        gainNode.gain.linearRampToValueAtTime(0.15, start + 0.05);
        gainNode.gain.exponentialRampToValueAtTime(0.001, start + duration - 0.01);

        osc.connect(gainNode);
        gainNode.connect(this.ctx.destination);

        osc.start(start);
        osc.stop(start + duration);
      };

      // Play C5, E5, G5, C6 arpeggio
      playTone(523.25, now, 0.15); // C5
      playTone(659.25, now + 0.15, 0.15); // E5
      playTone(783.99, now + 0.3, 0.15); // G5
      playTone(1046.50, now + 0.45, 0.4); // C6
    } catch (e) {
      console.warn("Fanfare error:", e);
    }
  }
}

export const sound = new QuizAudioEngine();
