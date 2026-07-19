// Mirrors the sanitizer used by the public site (smartrent-fe) so admin
// previews strip the same disallowed tags the public page will strip.
const allowedTags = new Set([
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'p',
  'a',
  'img',
  'ul',
  'ol',
  'li',
  'strong',
  'em',
  'blockquote',
  'code',
  'pre',
  'table',
  'thead',
  'tbody',
  'tr',
  'th',
  'td',
  'br',
  'hr',
  'div',
  'span',
])

/** Tags whose entire subtree should be stripped (not just unwrapped). */
const removableTags = new Set(['script', 'style', 'iframe', 'object', 'embed'])

export const sanitizeHtml = (html: string): string => {
  if (typeof globalThis.window === 'undefined') return html

  const doc = new DOMParser().parseFromString(html, 'text/html')
  const walker = doc.createTreeWalker(doc.body, NodeFilter.SHOW_ELEMENT)
  const nodesToProcess: Element[] = []

  while (walker.nextNode()) {
    const node = walker.currentNode as Element
    if (!allowedTags.has(node.tagName.toLowerCase())) {
      nodesToProcess.push(node)
    }
  }

  for (const node of nodesToProcess) {
    if (!node.parentNode) continue

    if (removableTags.has(node.tagName.toLowerCase())) {
      node.remove()
    } else {
      // Unwrap: keep child nodes, remove the disallowed wrapper
      while (node.firstChild) {
        node.parentNode.insertBefore(node.firstChild, node)
      }
      node.remove()
    }
  }

  return doc.body.innerHTML
}
