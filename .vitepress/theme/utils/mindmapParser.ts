/**
 * 思维导图解析器
 * 将 Markdown 缩进格式转换为 Mermaid graph LR 格式
 */

interface TreeNode {
  id: string
  text: string
  level: number
  children: TreeNode[]
  parent: TreeNode | null
}

function generateNodeId(index: number): string {
  let id = ''
  let n = index
  do {
    id = String.fromCharCode(65 + (n % 26)) + id
    n = Math.floor(n / 26) - 1
  } while (n >= 0)
  return id
}

function escapeNodeText(text: string): string {
  let cleaned = text
    .replace(/^#+\s*/, '')
    .replace(/^[-*]\s*/, '')
    .trim()

  cleaned = cleaned
    .replace(/"/g, "'")
    .replace(/\[/g, '（')
    .replace(/\]/g, '）')
    .replace(/\(/g, '（')
    .replace(/\)/g, '）')
    .replace(/</g, '＜')
    .replace(/>/g, '＞')
    .replace(/\|/g, '｜')
    .replace(/:/g, '：')

  return cleaned
}

function getIndentLevel(line: string): number {
  const match = line.match(/^(\s*)/)
  const spaces = match ? match[1].length : 0
  return Math.floor(spaces / 2)
}

function getLineInfo(line: string): { type: 'heading' | 'item' | 'empty', level: number, text: string } {
  const trimmed = line.trim()
  if (!trimmed) return { type: 'empty', level: 0, text: '' }

  const headingMatch = trimmed.match(/^(#+)\s*(.*)/)
  if (headingMatch) {
    return { type: 'heading', level: headingMatch[1].length - 1, text: headingMatch[2] }
  }

  const itemMatch = trimmed.match(/^[-*]\s*(.*)/)
  if (itemMatch) {
    return { type: 'item', level: getIndentLevel(line) + 2, text: itemMatch[1] }
  }

  return { type: 'item', level: getIndentLevel(line) + 2, text: trimmed }
}

export function isNativeMermaid(content: string): boolean {
  const trimmed = content.trim()
  const mermaidPatterns = [
    /^(graph|flowchart)\s+(LR|RL|TB|BT|TD)/i,
    /^mindmap\s*$/m,
    /^sequenceDiagram\s*$/m,
    /^classDiagram\s*$/m,
    /^stateDiagram/i,
    /^erDiagram\s*$/m,
    /^pie\s*/i,
    /^gantt\s*$/m
  ]
  return mermaidPatterns.some(pattern => pattern.test(trimmed))
}

export function parseMarkdownToGraph(content: string): string {
  const lines = content.split('\n')
  const nodes: { id: string; text: string; level: number }[] = []
  const edges: { from: string; to: string }[] = []
  const levelStack: Map<number, string> = new Map()
  let nodeIndex = 0

  for (const line of lines) {
    const { type, level, text } = getLineInfo(line)
    if (type === 'empty' || !text) continue

    const nodeId = generateNodeId(nodeIndex)
    const escapedText = escapeNodeText(text)
    nodes.push({ id: nodeId, text: escapedText, level })

    if (level > 0) {
      let parentLevel = level - 1
      while (parentLevel >= 0 && !levelStack.has(parentLevel)) parentLevel--
      if (parentLevel >= 0) {
        edges.push({ from: levelStack.get(parentLevel)!, to: nodeId })
      }
    }

    levelStack.set(level, nodeId)
    for (const [key] of levelStack) {
      if (key > level) levelStack.delete(key)
    }
    nodeIndex++
  }

  const mermaidLines: string[] = ['graph LR']
  for (const node of nodes) mermaidLines.push(`    ${node.id}["${node.text}"]`)
  for (const edge of edges) mermaidLines.push(`    ${edge.from} --> ${edge.to}`)

  return mermaidLines.join('\n')
}

export function convertToMermaid(content: string): string {
  const trimmed = content.trim()
  if (isNativeMermaid(trimmed)) return trimmed
  return parseMarkdownToGraph(trimmed)
}
