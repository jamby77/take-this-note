import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { InitialConfigType, LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { CodeNode } from "@lexical/code";
import { ListItemNode, ListNode } from "@lexical/list";
import { LinkNode } from "@lexical/link";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { TRANSFORMERS } from "@lexical/markdown";
import ToolbarPlugin from "./plugins/ToolbarPlugin.tsx";
import TreeViewPlugin from "./plugins/TreeViewPlugin.tsx";
import "./editor.css";
import { MarkdownActions } from "./actions/MarkdownActions.tsx";
import theme from "./EditorTheme.ts";

// Catch any errors that occur during Lexical updates and log them
// or throw them as needed. If you don't throw them, Lexical will
// try to recover gracefully without losing user data.
function onError(error: Error | string) {
  console.error(error);
}

function Placeholder() {
  return <div className="editor-placeholder">Enter some rich text...</div>;
}

const initialConfig: InitialConfigType = {
  namespace: "NotesEditor",
  theme,
  nodes: [HeadingNode, QuoteNode, CodeNode, ListNode, ListItemNode, LinkNode],
  onError,
};

export function Editor() {
  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="editor-container">
        <ToolbarPlugin />
        <div className="editor-inner">
          <RichTextPlugin
            contentEditable={<ContentEditable className="editor-input" />}
            placeholder={<Placeholder />}
            ErrorBoundary={LexicalErrorBoundary}
          />
          <HistoryPlugin />
          <OnChangePlugin
            onChange={(...args) => {
              console.log({ args });
            }}
          />
          <AutoFocusPlugin />
          <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
          <MarkdownActions />
        </div>
      </div>
      <TreeViewPlugin />
    </LexicalComposer>
  );
}
