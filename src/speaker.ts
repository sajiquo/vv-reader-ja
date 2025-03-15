import { extractText } from "./Speaker/extractText";
import { generateAudio } from "./Speaker/generateAudio";
import { generatePlayer } from "./Speaker/playAudio";
import { saveAsTmpFile } from "./Speaker/saveAudio";

const player = generatePlayer();

export const speakSelected = async () => {
  if (player.isPlaying()) return;
  player.play(await saveAsTmpFile(await generateAudio(extractText())));
};

export const stopSpeaking = () => {
  player.stop();
};
