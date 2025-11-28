/**
 * Client-side PDF generation using jsPDF and html2canvas
 * This approach works reliably on Vercel without serverless function limitations
 */

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface PDFOptions {
  filename?: string;
  format?: 'a4' | 'letter';
  orientation?: 'portrait' | 'landscape';
  quality?: number;
  scale?: number;
}

/**
 * Generates PDF from HTML element using html2canvas and jsPDF
 * @param elementId - ID of the HTML element to convert to PDF
 * @param options - PDF generation options
 * @returns Promise that resolves when PDF is generated and downloaded
 */
export async function generatePDFFromElement(
  elementId: string,
  options: PDFOptions = {}
): Promise<void> {
  const {
    filename = 'cv.pdf',
    format = 'a4',
    orientation = 'portrait',
    quality = 0.98,
    scale = 2, // Higher scale = better quality
  } = options;

  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error(`Element with id "${elementId}" not found`);
  }

  try {
    // Store original styles
    const originalStyles = {
      display: element.style.display,
      transform: element.style.transform,
      scale: element.style.scale,
      position: element.style.position,
      visibility: element.style.visibility,
      opacity: element.style.opacity,
    };

    // Temporarily make element fully visible and at full scale for PDF generation
    element.style.display = 'block';
    element.style.transform = 'scale(1)';
    element.style.position = 'absolute';
    element.style.visibility = 'visible';
    element.style.opacity = '1';
    element.style.left = '-9999px'; // Move off-screen but keep in DOM
    element.style.top = '0';

    // Wait a bit for styles to apply
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Convert HTML to canvas
    const canvas = await html2canvas(element, {
      scale: scale,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      width: element.scrollWidth || element.offsetWidth,
      height: element.scrollHeight || element.offsetHeight,
      windowWidth: element.scrollWidth || element.offsetWidth,
      windowHeight: element.scrollHeight || element.offsetHeight,
    });

    // Restore original styles
    element.style.display = originalStyles.display || '';
    element.style.transform = originalStyles.transform || '';
    element.style.position = originalStyles.position || '';
    element.style.visibility = originalStyles.visibility || '';
    element.style.opacity = originalStyles.opacity || '';
    element.style.left = '';
    element.style.top = '';

    // Calculate PDF dimensions
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;

    // A4 dimensions in mm
    const a4Width = 210;
    const a4Height = 297;
    const pdfWidth = format === 'a4' ? a4Width : 216; // Letter width in mm
    const pdfHeight = format === 'a4' ? a4Height : 279; // Letter height in mm

    // Calculate dimensions maintaining aspect ratio
    const ratio = imgWidth / imgHeight;
    let pdfImgWidth = pdfWidth;
    let pdfImgHeight = pdfWidth / ratio;

    // If image height exceeds PDF height, scale down
    if (pdfImgHeight > pdfHeight) {
      pdfImgHeight = pdfHeight;
      pdfImgWidth = pdfHeight * ratio;
    }

    // Create PDF
    const pdf = new jsPDF({
      orientation: orientation,
      unit: 'mm',
      format: format,
    });

    // Convert canvas to image data
    const imgData = canvas.toDataURL('image/png', quality);

    // Add image to PDF
    pdf.addImage(imgData, 'PNG', 0, 0, pdfImgWidth, pdfImgHeight);

    // If content is taller than one page, add additional pages
    const pageHeight = pdf.internal.pageSize.getHeight();
    const pageWidth = pdf.internal.pageSize.getWidth();
    let heightLeft = pdfImgHeight;
    let position = 0;

    // Add pages if needed
    while (heightLeft > 0) {
      if (position < 0) {
        pdf.addPage();
        position = 0;
      }
      pdf.addImage(imgData, 'PNG', 0, position, pdfImgWidth, pdfImgHeight);
      heightLeft -= pageHeight;
      position -= pageHeight;
    }

    // Save PDF
    pdf.save(filename);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error(`PDF oluşturulurken bir hata oluştu: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`);
  }
}

/**
 * Generates PDF from multiple elements (for multi-section CVs)
 */
export async function generatePDFFromElements(
  elementIds: string[],
  options: PDFOptions = {}
): Promise<void> {
  const {
    filename = 'cv.pdf',
    format = 'a4',
    orientation = 'portrait',
    quality = 0.98,
    scale = 2,
  } = options;

  const pdf = new jsPDF({
    orientation: orientation,
    unit: 'mm',
    format: format,
  });

  const a4Width = 210;
  const a4Height = 297;
  const pdfWidth = format === 'a4' ? a4Width : 216;
  const pdfHeight = format === 'a4' ? a4Height : 279;

  let isFirstPage = true;

  for (const elementId of elementIds) {
    const element = document.getElementById(elementId);
    if (!element) {
      console.warn(`Element with id "${elementId}" not found, skipping...`);
      continue;
    }

    try {
      const canvas = await html2canvas(element, {
        scale: scale,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        width: element.scrollWidth,
        height: element.scrollHeight,
      });

      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = imgWidth / imgHeight;
      let pdfImgWidth = pdfWidth;
      let pdfImgHeight = pdfWidth / ratio;

      if (pdfImgHeight > pdfHeight) {
        pdfImgHeight = pdfHeight;
        pdfImgWidth = pdfHeight * ratio;
      }

      const imgData = canvas.toDataURL('image/png', quality);

      if (!isFirstPage) {
        pdf.addPage();
      }

      // Add image to PDF
      pdf.addImage(imgData, 'PNG', 0, 0, pdfImgWidth, pdfImgHeight);

      // Handle multi-page content
      const pageHeight = pdf.internal.pageSize.getHeight();
      let heightLeft = pdfImgHeight;
      let position = 0;

      while (heightLeft > 0) {
        if (position < 0) {
          pdf.addPage();
          position = 0;
        }
        pdf.addImage(imgData, 'PNG', 0, position, pdfImgWidth, pdfImgHeight);
        heightLeft -= pageHeight;
        position -= pageHeight;
      }

      isFirstPage = false;
    } catch (error) {
      console.error(`Error processing element ${elementId}:`, error);
      // Continue with next element
    }
  }

  pdf.save(filename);
}

