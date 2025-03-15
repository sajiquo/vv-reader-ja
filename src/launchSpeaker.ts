import { exec } from "node:child_process";
import path from "node:path";
import * as vscode from "vscode";
import {
	audioQueryAudioQueryPost,
	getSynthesisSynthesisPostUrl,
	synthesisSynthesisPost,
	type synthesisSynthesisPostResponse,
} from "./gen/endpoints/vOICEVOXEngine";
import type { AudioQuery, SynthesisSynthesisPostParams } from "./gen/models";

const extractText = () => {
	const activeEditor = vscode.window.activeTextEditor;
	if (!activeEditor) {
		vscode.window.showInformationMessage("No active editor");
		return;
	}
	console.log("extracted Text");
	return activeEditor.document.getText(activeEditor.selection);
};

export const synthesysPostBlob = async (
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

const generateAudio = async (text?: string) => {
	if (!text) return;
	const queryRes = await audioQueryAudioQueryPost({
		text,
		// TODO: ここに適切なパラメータを設定する
		speaker: 14,
	});
	if (queryRes.status !== 200) {
		return;
	}
	console.log(queryRes.data);
	const audioRes = await synthesysPostBlob(
		{ ...queryRes.data, speedScale: 1.3 },
		{
			speaker: 14,
		},
	);
	if (audioRes.status !== 200) {
		return;
	}
	console.log("generated audio");
	return audioRes.data;
};

const saveAsTmpFile = async (audio?: Blob) => {
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
	console.log("saved temporal file");
	return fileUri;
};

const windowsPlayCommand = (path: string) => ` \
Add-Type -assemblyName PresentationCore; \
$mediaPlayer = New-Object System.Windows.Media.MediaPlayer; \
$mediaPlayer.open('${path}'); \
$mediaPlayer.Play(); \
Start-Sleep 1; Start-Sleep -s $mediaPlayer.NaturalDuration.TimeSpan.TotalSeconds; Exit;
`;

const playAudio = (uri?: vscode.Uri) => {
	if (!uri) return;
	const audioPath = uri.fsPath;
	// biome-ignore lint/style/useTemplate: <explanation>
	console.log("playing audio" + audioPath);
	exec(
		`powershell -c ${windowsPlayCommand(audioPath)}`,
		(error, stdout, stderr) => {
			if (error) {
				console.error(`exec error: ${error}`);
				return;
			}
			console.log(`stdout: ${stdout}`);
			console.error(`stderr: ${stderr}`);
		},
	);
};

export const launchSpeaker = async (context: vscode.ExtensionContext) => {
	vscode.window.showInformationMessage("Hello World from vv-reader-ja!");
	playAudio(await saveAsTmpFile(await generateAudio(extractText())));
};
