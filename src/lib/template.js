export function substitute(blocks, tags, mapping) {
  return blocks.map((block) => {
    let html = block.html
    for (const tag of tags) {
      const value = mapping[tag] ?? `{{${tag}}}`
      html = html.split(`{{${tag}}}`).join(value)
    }
    return { ...block, html }
  })
}
