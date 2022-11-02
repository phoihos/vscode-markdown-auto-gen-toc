import * as vscode from 'vscode';
import * as MarkdownIt from 'markdown-it';

export interface Configuration {
  includeLevel: number[];
  containerClass: string;
  containerHeaderHtml: string | undefined;
  markerPattern: RegExp;

  slugify(uri: string): string;
  format(content: string, md: MarkdownIt): string;
}

class ConfigurationImpl implements Partial<Configuration> {
  get containerHeaderHtml(): string | undefined {
    const config = vscode.workspace.getConfiguration('markdownAutoTOC');
    const headerHtml = config.get<string>('containerHeaderHtml', '');
    return headerHtml.trim() === '' ? undefined : headerHtml;
  }

  get markerPattern(): RegExp {
    const config = vscode.workspace.getConfiguration('markdownAutoTOC');
    const pattern = config.get<string>('markerPattern', 'TOC');
    return new RegExp(`^\\[\\[${pattern}\\]\\]`, 'im');
  }

  public slugify(heading: string): string {
    // see: vscode/extensions/markdown-language-features/src/slugify.ts
    const slugifiedHeading = encodeURI(
      heading
        .trim()
        .toLowerCase()
        .replace(/\s+/g, '-') // Replace whitespace with -
        // allow-any-unicode-next-line
        .replace(
          /[\]\[\!\/\'\"\#\$\%\&\(\)\*\+\,\.\/\:\;\<\=\>\?\@\\\^\{\|\}\~\`。，、；：？！…—·ˉ¨‘’“”々～‖∶＂＇｀｜〃〔〕〈〉《》「」『』．〖〗【】（）［］｛｝]/g,
          ''
        ) // Remove known punctuators
        .replace(/^\-+/, '') // Remove leading -
        .replace(/\-+$/, '') // Remove trailing -
    );
    return slugifiedHeading;
  }

  public format(content: string, _md: MarkdownIt): string {
    return content;
  }
}

export default function getConfiguration(): Readonly<Configuration> {
  return new Proxy(new ConfigurationImpl() as Configuration, {
    get: function (target: Configuration, prop: keyof Configuration) {
      return target[prop] ?? vscode.workspace.getConfiguration('markdownAutoTOC').get(prop);
    }
  });
}
