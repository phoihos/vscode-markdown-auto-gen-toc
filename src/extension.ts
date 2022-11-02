// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as MarkdownIt from 'markdown-it';
const markdownItAutoTOC = require('markdown-it-table-of-contents');

import getConfiguration from './configuration';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate() {
  const config = getConfiguration();

  return {
    extendMarkdownIt(md: MarkdownIt) {
      // NOTE: spread operator does not work for property getter
      const options = {
        includeLevel: config.includeLevel,
        containerClass: config.containerClass,
        containerHeaderHtml: config.containerHeaderHtml,
        markerPattern: config.markerPattern,
        slugify: config.slugify,
        format: config.format
      };

      return md.use(markdownItAutoTOC, options);
    }
  };
}

// this method is called when your extension is deactivated
export function deactivate() {}
