/** تلفظ با موتور گفتار خود مرورگر (بدون سرویس خارجی). در صورت نبودن پشتیبانی false برمی‌گرداند. */
export function canSpeak(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

export function speakGerman(text: string): boolean {
  if (!canSpeak()) return false;
  const synth = window.speechSynthesis;
  synth.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "de-DE";
  utterance.rate = 0.9;
  const voice = synth.getVoices().find((v) => v.lang.toLowerCase().startsWith("de"));
  if (voice) utterance.voice = voice;
  synth.speak(utterance);
  return true;
}
