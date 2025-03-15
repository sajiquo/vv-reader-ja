import * as vscode from "vscode";
import { checkVV } from "./checkVV";
import { createSpeaker } from "./speaker/speaker";

const speaker = createSpeaker();

export function activate(context: vscode.ExtensionContext) {
  checkVV();

  context.subscriptions.push(
    vscode.commands.registerCommand("vv-reader-ja.checkVersion", checkVV),
  );
  context.subscriptions.push(
    vscode.commands.registerTextEditorCommand(
      "vv-reader-ja.speakSelected",
      speaker.speak,
    ),
  );

  context.subscriptions.push(
    vscode.commands.registerTextEditorCommand(
      "vv-reader-ja.stopSpeaking",
      speaker.stop,
    ),
  );

  const actionProvider: vscode.CodeActionProvider = {
    provideCodeActions: (document, range) => {
      if (!document.getText(range)) {
        return;
      }
      const action = new vscode.CodeAction(
        "Speak",
        vscode.CodeActionKind.Empty,
      );
      action.command = {
        command: "vv-reader-ja.speakSelected",
        title: "Speak",
      };
      if (speaker.isSpeaking()) {
        action.disabled = { reason: "Already speaking" };
      }
      return [action];
    },
  };

  for (const language of ["markdown", "novel"]) {
    context.subscriptions.push(
      vscode.languages.registerCodeActionsProvider(language, actionProvider),
    );
  }
}

export function deactivate() {
  speaker.stop();
}
