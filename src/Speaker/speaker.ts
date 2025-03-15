import { extractText } from "./extractText";
import { generateAudio } from "./generateAudio";
import { generatePlayer } from "./playAudio";
import { saveAsTmpFile } from "./saveAudio";

const player = generatePlayer();

export const speakSelected = async () => {
  if (player.isPlaying()) return;
  player.play(await saveAsTmpFile(await generateAudio(extractText())));
};

export const stopSpeaking = () => {
  player.stop();
};
