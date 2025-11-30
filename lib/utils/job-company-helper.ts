/**
 * İş ilanları için sabit şirket isimleri ve profil fotoğrafları
 */

export interface CompanyInfo {
  name: string;
  profileImage: string;
  initial: string;
}

/**
 * İş ilanı başlığına göre şirket bilgisini döndürür
 */
export function getCompanyInfoForJob(jobTitle: string, description?: string): CompanyInfo {
  const title = jobTitle.toLowerCase();
  const desc = description?.toLowerCase() || '';

  // YTK Career iş ilanlarını kontrol et (başlıkta veya açıklamada ytkncareer/ytk career geçiyorsa)
  if (title.includes('ytk career') || title.includes('ytkncareer') || title.includes('ytkcareer') ||
      desc.includes('ytkncareer') || desc.includes('ytk career')) {
    return {
      name: 'YTK Career',
      profileImage: '/Photos/YtkCareerLogo/ytkncareer.jpeg',
      initial: 'YC'
    };
  }

  // Teknoloji stack'ine göre şirket belirleme
  if (title.includes('.net') || title.includes('backend') || title.includes('c#')) {
    return {
      name: 'I.T Company',
      profileImage: '/images/companies/it-company.png',
      initial: 'IT'
    };
  }

  if (title.includes('full stack') || title.includes('react') || title.includes('node.js') || 
      title.includes('ecommerce') || title.includes('e-commerce')) {
    return {
      name: 'ECommerce Company',
      profileImage: '/images/companies/ecommerce-company.png',
      initial: 'EC'
    };
  }

  if (title.includes('devops') || title.includes('cloud') || title.includes('aws') || title.includes('azure')) {
    return {
      name: 'Cloud Company',
      profileImage: '/images/companies/cloud-company.png',
      initial: 'CC'
    };
  }

  if (title.includes('data') || title.includes('python') || title.includes('analytics')) {
    return {
      name: 'Data Company',
      profileImage: '/images/companies/data-company.png',
      initial: 'DC'
    };
  }

  if (title.includes('mobile') || title.includes('react native') || title.includes('ios') || title.includes('android')) {
    return {
      name: 'Mobile Company',
      profileImage: '/images/companies/mobile-company.png',
      initial: 'MC'
    };
  }

  if (title.includes('vue') || title.includes('frontend')) {
    return {
      name: 'Frontend Company',
      profileImage: '/images/companies/frontend-company.png',
      initial: 'FC'
    };
  }

  if (title.includes('java') || title.includes('spring') || title.includes('enterprise')) {
    return {
      name: 'Enterprise Company',
      profileImage: '/images/companies/enterprise-company.png',
      initial: 'EC'
    };
  }

  if (title.includes('ui/ux') || title.includes('design') || title.includes('ui') || title.includes('ux')) {
    return {
      name: 'Design Company',
      profileImage: '/images/companies/design-company.png',
      initial: 'DC'
    };
  }

  if (title.includes('qa') || title.includes('quality') || title.includes('test') || title.includes('automation')) {
    return {
      name: 'Quality Company',
      profileImage: '/images/companies/quality-company.png',
      initial: 'QC'
    };
  }

  // Varsayılan olarak I.T Company
  return {
    name: 'I.T Company',
    profileImage: '/images/companies/it-company.png',
    initial: 'IT'
  };
}

