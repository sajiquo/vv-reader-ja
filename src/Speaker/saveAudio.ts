import path from "node:path";
import * as vscode from "vscode";
import { logger } from "../logger";

export const saveAsTmpFile = async (audio?: Blob) => {
  if (!audio) return;

  const filePath = path.join(
    vscode.workspace.workspaceFolders?.[0]?.uri.fsPath ?? "",
    "sample.wav",
  );
  const fileUri = vscode.Uri.file(filePath);
  await vscode.workspace.fs.writeFile(
    fileUri,
    new Uint8Array(await audio.arrayBuffer()),
  );
  logger.debug("saved temporal file");
  return fileUri.fsPath;
};
