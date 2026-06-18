import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

/**
 * Export a DOM element to PDF
 * @param {string} elementId - The ID of the DOM element to export
 * @param {string} filename - The PDF filename (without .pdf)
 */
export const exportElementToPDF = async (elementId, filename = 'X-Suite-Report') => {
  const element = document.getElementById(elementId)
  if (!element) {
    console.error('Element not found:', elementId)
    return
  }

  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
      logging: false,
      windowWidth: 800
    })

    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    })

    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()
    const margin = 10
    const contentWidth = pageWidth - (margin * 2)
    const imgWidth = contentWidth
    const imgHeight = (canvas.height * imgWidth) / canvas.width

    let heightLeft = imgHeight
    let position = margin

    pdf.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight)
    heightLeft -= (pageHeight - margin * 2)

    while (heightLeft > 0) {
      position = heightLeft - imgHeight
      pdf.addPage()
      pdf.addImage(imgData, 'PNG', margin, position + margin, imgWidth, imgHeight)
      heightLeft -= (pageHeight - margin * 2)
    }

    pdf.save(`${filename}.pdf`)
  } catch (err) {
    console.error('PDF export failed:', err)
    alert('PDF export failed. Please try again.')
  }
}

/**
 * Export a Vue component ref's root element to PDF
 */
export const exportRefToPDF = async (ref, filename = 'X-Suite-Report') => {
  if (!ref?.value) {
    console.error('Ref not found or not mounted')
    return
  }

  const element = ref.value.$el || ref.value
  if (!element) return

  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
      logging: false
    })

    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })

    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()
    const margin = 10
    const contentWidth = pageWidth - margin * 2
    const imgWidth = contentWidth
    const imgHeight = (canvas.height * imgWidth) / canvas.width

    let heightLeft = imgHeight
    let yOffset = margin

    pdf.addImage(imgData, 'PNG', margin, yOffset, imgWidth, imgHeight)
    heightLeft -= (pageHeight - margin * 2)

    while (heightLeft > 0) {
      yOffset = heightLeft - imgHeight
      pdf.addPage()
      pdf.addImage(imgData, 'PNG', margin, yOffset + margin, imgWidth, imgHeight)
      heightLeft -= (pageHeight - margin * 2)
    }

    pdf.save(`${filename}.pdf`)
  } catch (err) {
    console.error('PDF export error:', err)
    alert('PDF export failed. Please try again.')
  }
}
