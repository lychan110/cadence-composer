export function buildTemplatePayload(state, { includeBase64 = false } = {}) {
  return {
    version: 2,
    blocks: state.blocks,
    tags: state.tags,
    images: state.images.map((img) => ({
      id: img.id,
      label: img.label,
      sourceType: img.sourceType,
      url: img.url,
      data: includeBase64 ? img.data : undefined,
      byteLength: includeBase64 ? img.byteLength : undefined,
    })),
    // CSV data + mapping are durable template state: the template is the
    // asset, and the data bridge is part of it. Render output is derived and
    // recomputable, so it is deliberately not persisted.
    csvRows: state.csvRows,
    csvHeaders: state.csvHeaders,
    csvMapping: state.csvMapping,
  }
}

export function hydrateTemplatePayload(data) {
  if (data.version !== 1 && data.version !== 2) {
    throw new Error('Unsupported template version')
  }
  return {
    blocks: data.blocks ?? [],
    tags: data.tags ?? [],
    images: data.images ?? [],
    csvRows: data.csvRows ?? [],
    csvHeaders: data.csvHeaders ?? [],
    csvMapping: data.csvMapping ?? {},
  }
}

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
