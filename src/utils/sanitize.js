import DOMPurify from "dompurify";

// an empty allow-lists strips every tag and attribute, so a pasted <script> becomes plain text
export function sanitizeInput(input) {
  return DOMPurify.sanitize(input.trim(), {ALLOWED_TAGS: [], ALLOWED_ATTR: []});
}