export const sanitizeCitations = (summary?: string) => {
  if (!summary) return summary;
  if (summary === "NO_ANSWER_FOUND") return;
  const regex = /\[([^[\]]*)\]$/;
  const match = regex.exec(summary);
  if (!match) {
    return [];
  }
  const parts: string[] = [];
  const extractedArray = match[0];
  const index = match.index;
  const text = summary.slice(0, index);
  parts.push(text);
  parts.push(extractedArray);
  return parts;
};
