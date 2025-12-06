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
 * Converts mm to pixels (1mm ≈ 3.779527559 pixels at 96 DPI)
 */
function mmToPixels(mm: number): number {
  return mm * 3.779527559;
}

/**
 * Parses a CSS value (px, rem, em) and converts it to pixels, then applies scale
 */
function parseAndScaleCSSValue(value: string, scaleFactor: number): string | null {
  if (!value || value === '0' || value === '0px' || value === 'normal' || value === 'auto') {
    return null;
  }
  
  // Try to parse as number with unit
  const match = value.match(/^([\d.]+)(px|rem|em|pt)$/);
  if (match) {
    const numValue = parseFloat(match[1]);
    const unit = match[2];
    
    if (!isNaN(numValue) && numValue > 0) {
      // Convert rem/em to px (assuming 16px base font size)
      let pixels = numValue;
      if (unit === 'rem' || unit === 'em') {
        pixels = numValue * 16; // Base font size
      } else if (unit === 'pt') {
        pixels = numValue * 1.333; // 1pt = 1.333px
      }
      
      // Apply scale and return as px
      return `${pixels * scaleFactor}px`;
    }
  }
  
  return null;
}

/**
 * Applies scale factor to all child elements' font sizes, padding, margins, and gaps
 */
function applyScaleToElement(element: HTMLElement, scaleFactor: number): Map<HTMLElement, any> {
  const originalStyles = new Map<HTMLElement, any>();
  
  // Recursively apply scale to all elements
  const applyScale = (el: HTMLElement) => {
    const computedStyle = window.getComputedStyle(el);
    const style = el.style;
    
    // Store original styles
    const original = {
      fontSize: style.fontSize || '',
      paddingTop: style.paddingTop || '',
      paddingRight: style.paddingRight || '',
      paddingBottom: style.paddingBottom || '',
      paddingLeft: style.paddingLeft || '',
      marginTop: style.marginTop || '',
      marginRight: style.marginRight || '',
      marginBottom: style.marginBottom || '',
      marginLeft: style.marginLeft || '',
      lineHeight: style.lineHeight || '',
      gap: style.gap || '',
      rowGap: style.rowGap || '',
      columnGap: style.columnGap || '',
    };
    
    originalStyles.set(el, original);
    
    // Apply scale to font size
    const scaledFontSize = parseAndScaleCSSValue(computedStyle.fontSize, scaleFactor);
    if (scaledFontSize) {
      style.fontSize = scaledFontSize;
    }
    
    // Apply scale to padding
    ['paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft'].forEach(prop => {
      const value = computedStyle[prop as keyof CSSStyleDeclaration] as string;
      const scaledValue = parseAndScaleCSSValue(value, scaleFactor);
      if (scaledValue) {
        (style as any)[prop] = scaledValue;
      }
    });
    
    // Apply scale to margin
    ['marginTop', 'marginRight', 'marginBottom', 'marginLeft'].forEach(prop => {
      const value = computedStyle[prop as keyof CSSStyleDeclaration] as string;
      const scaledValue = parseAndScaleCSSValue(value, scaleFactor);
      if (scaledValue) {
        (style as any)[prop] = scaledValue;
      }
    });
    
    // Apply scale to line height
    if (computedStyle.lineHeight && computedStyle.lineHeight !== 'normal') {
      const scaledLineHeight = parseAndScaleCSSValue(computedStyle.lineHeight, scaleFactor);
      if (scaledLineHeight) {
        style.lineHeight = scaledLineHeight;
      }
    }
    
    // Apply scale to gap (for flexbox/grid)
    if (computedStyle.gap && computedStyle.gap !== 'normal') {
      const scaledGap = parseAndScaleCSSValue(computedStyle.gap, scaleFactor);
      if (scaledGap) {
        style.gap = scaledGap;
      }
    }
    
    // Apply scale to row-gap and column-gap separately
    if (computedStyle.rowGap && computedStyle.rowGap !== 'normal') {
      const scaledRowGap = parseAndScaleCSSValue(computedStyle.rowGap, scaleFactor);
      if (scaledRowGap) {
        style.rowGap = scaledRowGap;
      }
    }
    
    if (computedStyle.columnGap && computedStyle.columnGap !== 'normal') {
      const scaledColumnGap = parseAndScaleCSSValue(computedStyle.columnGap, scaleFactor);
      if (scaledColumnGap) {
        style.columnGap = scaledColumnGap;
      }
    }
    
    // Recursively apply to children
    Array.from(el.children).forEach(child => {
      if (child instanceof HTMLElement) {
        applyScale(child);
      }
    });
  };
  
  applyScale(element);
  return originalStyles;
}

/**
 * Restores original styles to all elements
 */
function restoreOriginalStyles(originalStyles: Map<HTMLElement, any>) {
  originalStyles.forEach((original, element) => {
    const style = element.style;
    // Restore all properties, clearing if original was empty
    style.fontSize = original.fontSize || '';
    style.paddingTop = original.paddingTop || '';
    style.paddingRight = original.paddingRight || '';
    style.paddingBottom = original.paddingBottom || '';
    style.paddingLeft = original.paddingLeft || '';
    style.marginTop = original.marginTop || '';
    style.marginRight = original.marginRight || '';
    style.marginBottom = original.marginBottom || '';
    style.marginLeft = original.marginLeft || '';
    style.lineHeight = original.lineHeight || '';
    style.gap = original.gap || '';
    style.rowGap = original.rowGap || '';
    style.columnGap = original.columnGap || '';
  });
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
    // Store original styles and class name
    const originalClassName = element.className;
    const originalStyles = {
      display: element.style.display,
      transform: element.style.transform,
      scale: element.style.scale,
      position: element.style.position,
      visibility: element.style.visibility,
      opacity: element.style.opacity,
    };

    // Temporarily remove scale classes and make element fully visible at full scale for PDF generation
    // Remove Tailwind scale classes that might interfere
    element.className = element.className.replace(/scale-\[.*?\]|scale-\d+/g, '').trim();
    element.style.display = 'block';
    element.style.transform = 'scale(1)';
    element.style.position = 'absolute';
    element.style.visibility = 'visible';
    element.style.opacity = '1';
    element.style.left = '-9999px'; // Move off-screen but keep in DOM
    element.style.top = '0';

    // Wait a bit for styles to apply
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Check if content height exceeds A4 height (297mm)
    const a4HeightPixels = mmToPixels(297);
    const contentHeight = element.scrollHeight || element.offsetHeight;
    let scaleFactor: number | null = null;
    let scaledStyles: Map<HTMLElement, any> | null = null;

    // If content is taller than A4, calculate and apply scale factor
    if (contentHeight > a4HeightPixels) {
      // Calculate scale factor: 297mm / contentHeight
      scaleFactor = a4HeightPixels / contentHeight;
      
      // Clamp scale factor between 0.7 and 0.95
      scaleFactor = Math.max(0.7, Math.min(0.95, scaleFactor));
      
      // Apply scale to all child elements
      scaledStyles = applyScaleToElement(element, scaleFactor);
      
      // Wait for scaled styles to apply
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

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

    // Restore scaled styles if they were applied
    if (scaledStyles) {
      restoreOriginalStyles(scaledStyles);
    }

    // Restore original styles and class name
    element.className = originalClassName;
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
    // The element is designed to be 210mm wide, so we maintain that width
    // and scale height proportionally
    const ratio = imgWidth / imgHeight;
    
    // Start with A4 width (210mm)
    let pdfImgWidth = pdfWidth;
    let pdfImgHeight = pdfWidth / ratio;

    // If content is taller than A4 height, scale down everything proportionally
    // to fit within one page while preserving format
    if (pdfImgHeight > pdfHeight) {
      // Calculate scale factor to fit height within A4
      const scaleFactor = pdfHeight / pdfImgHeight;
      pdfImgHeight = pdfHeight;
      pdfImgWidth = pdfImgWidth * scaleFactor;
    }

    // Create PDF
    const pdf = new jsPDF({
      orientation: orientation,
      unit: 'mm',
      format: format,
    });

    // Convert canvas to image data
    const imgData = canvas.toDataURL('image/png', quality);

    // Center the image horizontally if it's narrower than page width
    const xPosition = (pdfWidth - pdfImgWidth) / 2;

    // Add image to PDF (single page, scaled to fit)
    pdf.addImage(imgData, 'PNG', xPosition, 0, pdfImgWidth, pdfImgHeight);

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

      // If content is taller than A4 height, scale down to fit within one page
      // This ensures format is preserved and everything fits on one A4 page
      if (pdfImgHeight > pdfHeight) {
        const scaleFactor = pdfHeight / pdfImgHeight;
        pdfImgHeight = pdfHeight;
        pdfImgWidth = pdfImgWidth * scaleFactor;
      }

      const imgData = canvas.toDataURL('image/png', quality);

      if (!isFirstPage) {
        pdf.addPage();
      }

      // Center the image horizontally if it's narrower than page width
      const xPosition = (pdfWidth - pdfImgWidth) / 2;

      // Add image to PDF (single page per element, scaled to fit)
      pdf.addImage(imgData, 'PNG', xPosition, 0, pdfImgWidth, pdfImgHeight);

      isFirstPage = false;
    } catch (error) {
      console.error(`Error processing element ${elementId}:`, error);
      // Continue with next element
    }
  }

  pdf.save(filename);
}

