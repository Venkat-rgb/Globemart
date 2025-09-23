export const markdownToText = (markdown) => {
  return (
    markdown
      // Remove headings (##, ###, etc.)
      .replace(/^#{1,6}\s*/gm, "")
      // Remove bold/italic markers (**text**, *text*, _text_)
      .replace(/(\*\*|__)(.*?)\1/g, "$2")
      .replace(/(\*|_)(.*?)\1/g, "$2")
      // Remove list markers (-, *, +)
      .replace(/^\s*[-*+]\s+/gm, "")
      // Remove blockquotes (>)
      .replace(/^\s*>+\s?/gm, "")
      // Remove inline code/backticks
      .replace(/```[\s\S]*?```/g, "")
      .replace(/`{1,3}([^`]*)`{1,3}/g, "$1")
      // Remove extra newlines
      .replace(/\n/g, " ")
      // Collapse multiple spaces
      .replace(/\s+/g, " ")
      // .replace(/\n{2,}/g, "\n")
      .trim()
  );
};
