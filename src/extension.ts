// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import path from 'node:path';

const cats = {
  'Coding Cat': 'https://media.giphy.com/media/JIX9t2j0ZTN9S/giphy.gif',
  'Compiling Cat': 'https://media.giphy.com/media/mlvseq9yvZhba/giphy.gif'
};

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "vscode-lowcode" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('vscode-lowcode.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from vscode-lowcode!');

    // Create and show a new webview
    const panel = vscode.window.createWebviewPanel(
      'OCR',
      'OCR 识别',
      vscode.ViewColumn.One,
      {
        retainContextWhenHidden: true, // 保证 Webview 所在页面进入后台时不被释放
        enableScripts: true, // 运行 JS 执行
      }
    );

    const isProduction = context.extensionMode === vscode.ExtensionMode.Production;
    let srcUrl = '';
    if (isProduction) {
      // const filePath = vscode.Uri.file(
      //   path.join(context.extensionPath, 'dist', 'static/js/main.js')
      // );
      // srcUrl = panel.webview.asWebviewUri(filePath).toString();
      // 生产环境待完善
      srcUrl = 'http://localhost:5173';
    } else {
      srcUrl = 'http://localhost:5173';
    }

    panel.webview.html = getWebviewContent(srcUrl);

    // const updateWebview = () => {
    //   panel.webview.html = getWebviewContent(srcUrl);
    // };

    // updateWebview();
    // const interval = setInterval(updateWebview, 1000);

    // panel.onDidDispose(
    //   () => {
    //     clearInterval(interval);
    //   },
    //   null,
    //   context.subscriptions,
    // );
	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}

function getWebviewContent(srcUri: string) {
  return `<!doctype html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>OCR识别</title>
      <style>
        html,
        body {
            margin: 0;
            padding: 0;
            width: 100%;
            height: 100%;
            background-color:#000000;
            overflow:hidden;
        }
        .webView_iframe {
            width: 100%;
            height: 100%;
            border: none;
        }
        .outer{
          width: 100%;
          height: 100%;
          overflow: hidden;
        }
      </style>
    </head>
    <body>
    <div class="outer">
      <iframe id='WebviewIframe' class="webView_iframe" sandbox="allow-scripts allow-same-origin allow-forms allow-pointer-lock allow-downloads" allow="cross-origin-isolated; clipboard-read; clipboard-write;" src="http://localhost:5173/"></iframe>
    </div>
    </body>
  </html>
  `;
}