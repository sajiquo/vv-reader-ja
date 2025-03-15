import * as vscode from "vscode";
import { logger } from "../logger";

export const extractText = () => {
  const activeEditor = vscode.window.activeTextEditor;
  if (!activeEditor) {
    vscode.window.showErrorMessage("No active file");
    return;
  }
  logger.debug("extracted Text");
  return activeEditor.document.getText(activeEditor.selection);
};
