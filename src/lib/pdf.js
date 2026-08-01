export function printCurrentRow(html) {
  const win = window.open('', '_blank')
  if (!win) return
  win.document.write(`<!doctype html><html><head><title>Print</title></head><body>${html}</body></html>`)
  win.document.close()
  win.focus()
  win.print()
}
