import * as Papa from 'papaparse'

export function parseCsv(file, parse = Papa.parse) {
  return new Promise((resolve, reject) => {
    parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        resolve({
          rows: results.data,
          headers: results.meta.fields ?? [],
        })
      },
      error: (err) => reject(err),
    })
  })
}