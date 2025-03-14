export function useExportCsv() {
    /**
     * Export data to CSV file
     * @param header Array of column headers
     * @param data Array of data rows (each row is an array of values)
     * @param filename Filename without extension
     */
    function exportToCsv(header: string[], data: any[][], filename: string = 'export') {
      // Create CSV content
      const csvContent = [
        header.join(','),
        ...data.map(row => row.join(','))
      ].join('\n')
      
      // Create a blob and download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.setAttribute('href', url)
      link.setAttribute('download', `${filename}.csv`)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  
    return {
      exportToCsv
    }
  }