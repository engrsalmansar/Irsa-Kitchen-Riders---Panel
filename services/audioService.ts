// A reliable alarm sound URL.
const ALARM_URL = 'https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3';

class AudioService {
  private audio: HTMLAudioElement;
  private isPlaying: boolean = false;

  constructor() {
    this.audio = new Audio(ALARM_URL);
    this.audio.loop = true;
    this.audio.preload = 'auto';
  }

  playRing() {
    if (this.isPlaying) return;
    
    // User interaction is required to play audio. 
    // We assume this is called after some interaction or inside an authorized context.
    this.audio.play().then(() => {
      this.isPlaying = true;
    }).catch(err => {
      console.error("Audio playback failed (likely needs user interaction first):", err);
    });
  }

  stopRing() {
    this.audio.pause();
    this.audio.currentTime = 0;
    this.isPlaying = false;
  }
}

export const audioService = new AudioService();

export const requestNotificationPermission = async () => {
  if (!("Notification" in window)) {
    return;
  }
  if (Notification.permission !== "granted") {
    await Notification.requestPermission();
  }
};

export const sendNotification = (title: string, body: string) => {
  if (Notification.permission === "granted") {
    new Notification(title, { body });
  }
};