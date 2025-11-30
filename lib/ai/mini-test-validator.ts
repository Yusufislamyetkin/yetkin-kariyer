/**
 * Mini Test Format Validator
 * Validates MINI_TEST action format and provides detailed error information
 */

export type ValidationErrorCategory = 
  | 'MISSING_QUESTION'
  | 'MISSING_OPTIONS'
  | 'INSUFFICIENT_OPTIONS'
  | 'INVALID_INDEX'
  | 'INVALID_FORMAT'
  | 'EMPTY_OPTIONS';

export interface ValidationError {
  category: ValidationErrorCategory;
  message: string;
  details?: any;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
  data?: {
    question: string;
    options: string[];
    correctIndex: number;
  };
}

/**
 * Validates a mini_test action data structure
 */
export function validateMiniTestAction(action: any): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationError[] = [];

  // Check if action has data
  if (!action || typeof action !== 'object') {
    return {
      isValid: false,
      errors: [{
        category: 'INVALID_FORMAT',
        message: 'Action data is missing or invalid',
      }],
      warnings: [],
    };
  }

  // Check for nested question structure
  const questionData = action.question || action;
  
  // Validate question text
  const questionText = questionData.text || questionData.question || '';
  if (!questionText || typeof questionText !== 'string' || questionText.trim().length === 0) {
    errors.push({
      category: 'MISSING_QUESTION',
      message: 'Question text is missing or empty',
    });
  }

  // Validate options
  const options = questionData.options || [];
  if (!Array.isArray(options)) {
    errors.push({
      category: 'INVALID_FORMAT',
      message: 'Options must be an array',
    });
    return {
      isValid: false,
      errors,
      warnings,
    };
  }

  // Filter out empty options
  const validOptions = options.filter((opt: any) => {
    if (typeof opt === 'string') return opt.trim().length > 0;
    if (opt && typeof opt === 'object') {
      return (opt.text || opt.label || '').trim().length > 0;
    }
    return false;
  });

  // Normalize options (extract text from objects if needed)
  const normalizedOptions = validOptions.map((opt: any) => {
    if (typeof opt === 'string') return opt.trim();
    if (opt && typeof opt === 'object') {
      return (opt.text || opt.label || '').trim();
    }
    return '';
  }).filter(opt => opt.length > 0);

  // Check option count
  if (normalizedOptions.length === 0) {
    errors.push({
      category: 'MISSING_OPTIONS',
      message: 'No valid options found',
    });
  } else if (normalizedOptions.length < 4) {
    errors.push({
      category: 'INSUFFICIENT_OPTIONS',
      message: `Only ${normalizedOptions.length} option(s) provided, 4 required`,
      details: { provided: normalizedOptions.length, required: 4 },
    });
  } else if (normalizedOptions.length > 4) {
    warnings.push({
      category: 'INVALID_FORMAT',
      message: `More than 4 options provided (${normalizedOptions.length}), using first 4`,
      details: { provided: normalizedOptions.length },
    });
  }

  // Validate correct index
  const correctIndex = questionData.correctIndex ?? action.correctIndex ?? null;
  if (correctIndex === null || correctIndex === undefined) {
    errors.push({
      category: 'INVALID_INDEX',
      message: 'Correct answer index is missing',
    });
  } else {
    const indexNum = typeof correctIndex === 'string' ? parseInt(correctIndex, 10) : correctIndex;
    if (isNaN(indexNum) || indexNum < 0 || indexNum >= 4) {
      errors.push({
        category: 'INVALID_INDEX',
        message: `Invalid correct index: ${correctIndex}. Must be 0-3`,
        details: { provided: correctIndex, validRange: [0, 3] },
      });
    }
  }

  // If we have critical errors, don't return data
  if (errors.length > 0) {
    return {
      isValid: false,
      errors,
      warnings,
    };
  }

  // Return validated data (use first 4 options if more provided)
  const finalOptions = normalizedOptions.slice(0, 4);
  const finalIndex = typeof correctIndex === 'string' 
    ? parseInt(correctIndex, 10) 
    : (correctIndex as number);

  return {
    isValid: true,
    errors: [],
    warnings,
    data: {
      question: questionText.trim(),
      options: finalOptions,
      correctIndex: finalIndex,
    },
  };
}

/**
 * Generates a user-friendly error message from validation errors
 */
export function getValidationErrorMessage(result: ValidationResult): string {
  if (result.isValid) {
    return '';
  }

  const errorMessages = result.errors.map(err => {
    switch (err.category) {
      case 'MISSING_QUESTION':
        return 'Soru metni eksik veya boş.';
      case 'MISSING_OPTIONS':
        return 'Hiçbir seçenek bulunamadı.';
      case 'INSUFFICIENT_OPTIONS':
        return `Sadece ${err.details?.provided || 0} seçenek var, 4 seçenek gerekiyor.`;
      case 'INVALID_INDEX':
        return `Geçersiz doğru cevap index'i. 0-3 arası olmalı.`;
      case 'INVALID_FORMAT':
        return 'Test sorusu formatı geçersiz.';
      case 'EMPTY_OPTIONS':
        return 'Boş seçenekler bulundu.';
      default:
        return err.message;
    }
  });

  return errorMessages.join(' ');
}

/**
 * Generates a correction message for AI based on validation errors
 */
export function generateAICorrectionMessage(result: ValidationResult): string {
  if (result.isValid) {
    return '';
  }

  const corrections: string[] = [];
  
  corrections.push('MINI_TEST format hatası tespit edildi. Lütfen aşağıdaki düzeltmeleri yap:');
  corrections.push('');

  for (const error of result.errors) {
    switch (error.category) {
      case 'MISSING_QUESTION':
        corrections.push('- SORU METNİ EKSİK: [MINI_TEST: soru_metni, A, B, C, D, doğru_index] formatında soru metni ekle!');
        break;
      case 'MISSING_OPTIONS':
      case 'INSUFFICIENT_OPTIONS':
        corrections.push(`- SEÇENEKLER EKSİK: MUTLAKA 4 seçenek (A, B, C, D) olmalı! Format: [MINI_TEST: soru, A_şıkkı, B_şıkkı, C_şıkkı, D_şıkkı, doğru_index]`);
        break;
      case 'INVALID_INDEX':
        corrections.push(`- DOĞRU CEVAP İNDEX'İ EKSİK/GEÇERSİZ: Son parametre olarak 0-3 arası bir sayı ekle! (0=A, 1=B, 2=C, 3=D)`);
        break;
      case 'INVALID_FORMAT':
        corrections.push('- FORMAT HATASI: [MINI_TEST: soru, A, B, C, D, doğru_index] formatını kullan!');
        break;
    }
  }

  corrections.push('');
  corrections.push('DOĞRU FORMAT ÖRNEĞİ:');
  corrections.push('[MINI_TEST: Python\'da liste nasıl tanımlanır?, my_list = [], my_list = {}, my_list = (), my_list = <>, 0]');

  return corrections.join('\n');
}

