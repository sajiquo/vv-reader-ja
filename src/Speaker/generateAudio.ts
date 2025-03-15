import * as vscode from "vscode";
import {
  audioQueryAudioQueryPost,
  getSynthesisSynthesisPostUrl,
  type synthesisSynthesisPostResponse,
} from "../gen/endpoints/vOICEVOXEngine";
import type { AudioQuery, SynthesisSynthesisPostParams } from "../gen/models";
import { logger } from "../logger";

// Orval generated code handles only text (JSON) inputs and outputs.
// Add snipet for handling binary data (wav) here.
// NOTE: This code can be generated from Orval transformer settings.
const getSynthesisSynthesisPostBlob = async (
  audioQuery: AudioQuery,
  params: SynthesisSynthesisPostParams,
  options?: RequestInit,
): Promise<synthesisSynthesisPostResponse> => {
  const res = await fetch(getSynthesisSynthesisPostUrl(params), {
    ...options,
    method: "POST",
    headers: { "Content-Type": "application/json", ...options?.headers },
    body: JSON.stringify(audioQuery),
  });

  const body = [204, 205, 304].includes(res.status) ? null : await res.blob();
  const data: synthesisSynthesisPostResponse["data"] = body ?? {};

  return {
    data,
    status: res.status,
    headers: res.headers,
  } as synthesisSynthesisPostResponse;
};

export const generateAudio = async (text?: string) => {
  if (!text) return;
  try {
    const queryRes = await audioQueryAudioQueryPost({
      text,
      // TODO: ここに適切なパラメータを設定する
      speaker: 14,
    });
    if (queryRes.status !== 200) {
      throw new Error("Failed to generate audio");
    }
    const audioRes = await getSynthesisSynthesisPostBlob(
      { ...queryRes.data, speedScale: 1.3 },
      {
        speaker: 14,
      },
    );
    if (audioRes.status !== 200) {
      throw new Error("Failed to generate audio");
    }
    logger.debug("generated audio");
    return audioRes.data;
  } catch (e) {
    vscode.window.showErrorMessage("Failed to generate audio");
  }
};
