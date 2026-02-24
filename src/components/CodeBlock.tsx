"use client";

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useTheme } from './ThemeProvider';

interface CodeBlockProps {
  language: string;
  children: string;
}

export function CodeBlock({ language, children }: CodeBlockProps) {
  const { theme } = useTheme();
  
  return (
    <SyntaxHighlighter
      language={language}
      style={theme === 'dark' ? oneDark : oneLight}
      customStyle={{
        margin: '1.5rem 0',
        borderRadius: '8px',
        fontSize: '0.9em',
      }}
      showLineNumbers={true}
    >
      {children}
    </SyntaxHighlighter>
  );
}
