// todo add for conf
export default function indent(indentLevel: number, spacesPerIndent?: number) {
  const indentBy: string = ` `.repeat(spacesPerIndent !== undefined ? spacesPerIndent : 2)
  const indent: string = indentBy.repeat(indentLevel !== undefined ? indentLevel : 1)
  return indent
}