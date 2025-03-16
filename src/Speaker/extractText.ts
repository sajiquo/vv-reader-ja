import * as vscode from "vscode";
import { logger } from "../logger";
import { type Maybe, just, nothing } from "../maybe";

export const extractText = (): Maybe<string> => {
  const activeEditor = vscode.window.activeTextEditor;
  if (!activeEditor) {
    vscode.window.showErrorMessage("No active file");
    return nothing();
  }
  logger.debug("extracted Text");
  return just(activeEditor.document.getText(activeEditor.selection));
};
