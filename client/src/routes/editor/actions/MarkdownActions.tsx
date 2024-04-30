import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $convertToMarkdownString, TRANSFORMERS } from "@lexical/markdown";
import { $getTextContent } from "lexical";

export const MarkdownActions = () => {
  const [editor] = useLexicalComposerContext();

  const handleOnClick = () => {
    editor.update(() => {
      // Node -> Markdown
      const markdown = $convertToMarkdownString(TRANSFORMERS);
      console.log({ markdown });
      const textContent = $getTextContent();
      console.log({ textContent });
    });
  };

  return (
    <div style={{ marginTop: "10px" }}>
      <div>
        <button onClick={handleOnClick}>EXPORT TO MARKDOWN</button>
      </div>
    </div>
  );
};
