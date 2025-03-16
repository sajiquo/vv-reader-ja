import path from "node:path";
import * as vscode from "vscode";
import { logger } from "../logger";
import { type Maybe, just } from "../maybe";
import type { SpeakerContext } from "./ctx";

export const saveAsTmpFile = async (
  ctx: SpeakerContext,
  audio: Maybe<Blob>,
): Promise<Maybe<boolean>> => {
  if (!audio) return just(false);
  const filePath = path.join(
    vscode.workspace.workspaceFolders?.[0]?.uri.fsPath ?? "",
    ".vvreader",
    "voice.wav",
  );
  const fileUri = vscode.Uri.file(filePath);
  await vscode.workspace.fs.writeFile(
    fileUri,
    new Uint8Array(await audio.arrayBuffer()),
  );
  logger.debug("saved temporary file");
  ctx.temporaryFilePath = fileUri.fsPath;
  return just(true);
};

export const deleteTmpFile = async (ctx: SpeakerContext) => {
  const filePath = ctx.temporaryFilePath;
  if (!filePath) return;
  await vscode.workspace.fs.delete(vscode.Uri.file(filePath));
  logger.debug("deleted temporary file");
  ctx.temporaryFilePath = null;
};
