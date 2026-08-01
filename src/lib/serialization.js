export function buildExportPayload(blocks, images) {
  const imageMap = new Map(images.map((img) => [img.label, img]))
  return blocks.map((block) => {
    let html = block.html
    for (const [label, img] of imageMap) {
      let src = img.sourceType === 'url' ? img.url : img.data
      if (img.sourceType === 'base64' && src && !src.startsWith('data:')) {
        src = `data:image/png;base64,${src}`
      }
      html = html.split(`{{${label}}}`).join(src ?? `{{${label}}}`)
    }
    return { id: block.id, html }
  })
}
