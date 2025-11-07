export function CapitalizateText(text) {
  if (!text || typeof text !== "string") return "";
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}
