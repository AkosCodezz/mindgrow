'use client';

import { useRef, useEffect, useState } from 'react';

type Props = {
  value: string;
  onChange: (v: string) => void;
  language: 'html' | 'css' | 'javascript';
};

export default function CodeEditor({ value, onChange, language }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<any>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let disposed = false;

    const loadMonaco = async () => {
      // Load Monaco from CDN
      if (!(window as any).monaco) {
        await new Promise<void>((resolve) => {
          const script = document.createElement('script');
          script.src = 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.45.0/min/vs/loader.min.js';
          script.onload = () => {
            const req = (window as any).require;
            req.config({ paths: { vs: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.45.0/min/vs' } });
            req(['vs/editor/editor.main'], () => resolve());
          };
          document.head.appendChild(script);
        });
      }

      if (disposed || !containerRef.current) return;

      const monaco = (window as any).monaco;

      // Define dark theme
      monaco.editor.defineTheme('coderift-dark', {
        base: 'vs-dark',
        inherit: true,
        rules: [
          { token: 'tag', foreground: 'ff79c6' },
          { token: 'attribute.name', foreground: '50fa7b' },
          { token: 'attribute.value', foreground: 'f1fa8c' },
          { token: 'comment', foreground: '6272a4' },
          { token: 'keyword', foreground: 'ff79c6' },
          { token: 'string', foreground: 'f1fa8c' },
          { token: 'number', foreground: 'bd93f9' },
          { token: 'type', foreground: '8be9fd' },
        ],
        colors: {
          'editor.background': '#1e1e2e',
          'editor.foreground': '#f8f8f2',
          'editor.lineHighlightBackground': '#2a2a3e',
          'editorLineNumber.foreground': '#4a4a5a',
          'editorLineNumber.activeForeground': '#f8f8f2',
          'editor.selectionBackground': '#44475a',
          'editorCursor.foreground': '#f8f8f2',
          'editorSuggestWidget.background': '#1e1e2e',
          'editorSuggestWidget.border': '#44475a',
          'editorSuggestWidget.selectedBackground': '#44475a',
        },
      });

      // Map language
      const langMap: Record<string, string> = { html: 'html', css: 'css', javascript: 'javascript' };

      // Create editor
      const editor = monaco.editor.create(containerRef.current, {
        value,
        language: langMap[language] || 'html',
        theme: 'coderift-dark',
        fontSize: 14,
        lineHeight: 22,
        fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        automaticLayout: true,
        tabSize: 2,
        wordWrap: 'on',
        padding: { top: 12 },
        suggestOnTriggerCharacters: true,
        quickSuggestions: true,
        autoClosingBrackets: 'always',
        autoClosingTags: true,
        formatOnPaste: true,
        renderLineHighlight: 'line',
        smoothScrolling: true,
        cursorBlinking: 'smooth',
        cursorSmoothCaretAnimation: 'on',
        bracketPairColorization: { enabled: true },
        guides: { bracketPairs: true, indentation: true },
        // HTML specific
        ...(language === 'html' ? {
          autoClosingOvertype: 'always',
          linkedEditing: true,
        } : {}),
      });

      editorRef.current = editor;

      // Listen for changes
      editor.onDidChangeModelContent(() => {
        const val = editor.getValue();
        onChange(val);
      });

      setReady(true);
    };

    loadMonaco();

    return () => {
      disposed = true;
      if (editorRef.current) {
        editorRef.current.dispose();
        editorRef.current = null;
      }
    };
  }, [language]);

  // Update value from outside (e.g. reset)
  useEffect(() => {
    if (editorRef.current) {
      const currentVal = editorRef.current.getValue();
      if (currentVal !== value) {
        editorRef.current.setValue(value);
      }
    }
  }, [value]);

  return (
    <div className="h-full w-full relative">
      {!ready && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#1e1e2e] text-neutral-500 text-sm">
          Loading editor...
        </div>
      )}
      <div ref={containerRef} className="h-full w-full" />
    </div>
  );
}
