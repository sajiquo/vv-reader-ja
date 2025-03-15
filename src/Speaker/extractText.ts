import * as vscode from "vscode";

export const extractText = () => {
  const activeEditor = vscode.window.activeTextEditor;
  if (!activeEditor) {
    vscode.window.showErrorMessage("No active file");
    return;
  }
  console.log("extracted Text");
  return activeEditor.document.getText(activeEditor.selection);
};
