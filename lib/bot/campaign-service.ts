const BACKEND_API_URL = process.env.BACKEND_API_URL || 'https://softwareinterview.tryasp.net';

/**
 * Safely parse API response, handling both JSON and HTML error responses
 */
async function parseResponse(response: Response): Promise<any> {
  const contentType = response.headers.get('content-type') || '';
  
  // If content-type is JSON, parse as JSON
  if (contentType.includes('application/json')) {
    try {
      return await response.json();
    } catch (error) {
      // Even if content-type says JSON, parsing might fail
      console.error('[CAMPAIGN_SERVICE] Failed to parse JSON response:', error);
      throw new Error('Sunucudan geçersiz JSON yanıtı alındı');
    }
  }
  
  // If content-type is HTML or text, it's likely an error page
  if (contentType.includes('text/html') || contentType.includes('text/')) {
    const text = await response.text();
    
    // Try to extract error message from HTML if possible
    // Common patterns in error pages
    const titleMatch = text.match(/<title[^>]*>([^<]+)<\/title>/i);
    const h1Match = text.match(/<h1[^>]*>([^<]+)<\/h1>/i);
    const errorMatch = text.match(/error[^>]*>([^<]+)/i);
    
    let errorMessage = 'Sunucu hatası oluştu';
    if (titleMatch) {
      errorMessage = titleMatch[1].trim();
    } else if (h1Match) {
      errorMessage = h1Match[1].trim();
    } else if (errorMatch) {
      errorMessage = errorMatch[1].trim();
    }
    
    console.error('[CAMPAIGN_SERVICE] Received HTML error response:', {
      status: response.status,
      statusText: response.statusText,
      contentType,
      message: errorMessage,
    });
    
    throw new Error(`${errorMessage} (HTTP ${response.status})`);
  }
  
  // For other content types, try to parse as text first
  try {
    const text = await response.text();
    // Try to parse as JSON even if content-type wasn't set correctly
    try {
      return JSON.parse(text);
    } catch {
      throw new Error(`Beklenmeyen yanıt formatı: ${contentType}`);
    }
  } catch (error: any) {
    throw new Error(error.message || 'Yanıt işlenirken bir hata oluştu');
  }
}

export interface CreateCampaignRequest {
  name: string;
  activityType: string;
  botCount: number;
  totalActivities: number;
  durationHours: number;
  config?: Record<string, any>;
}

export interface CreateRecurringCampaignRequest {
  name: string;
  activityType: string;
  botCount: number;
  totalActivities: number;
  durationHours: number;
  recurringPattern?: string;
  config?: Record<string, any>;
}

export interface Campaign {
  id: string;
  name: string;
  activityType: string;
  status: string;
  botCount: number;
  totalActivities: number;
  durationHours: number;
  startTime: string;
  endTime: string;
  totalExecuted?: number;
  successfulCount?: number;
  failedCount?: number;
  createdAt?: string;
}

export interface CampaignStatus {
  exists: boolean;
  id?: string;
  name?: string;
  activityType?: string;
  status?: string;
  botCount?: number;
  totalActivities?: number;
  durationHours?: number;
  startTime?: string;
  endTime?: string;
  totalExecuted?: number;
  successfulCount?: number;
  failedCount?: number;
  scheduledJobs?: number;
  config?: Record<string, any>;
}

/**
 * Create a new bot campaign
 */
export async function createCampaign(request: CreateCampaignRequest): Promise<{ success: boolean; campaign?: Campaign; message?: string }> {
  try {
    const response = await fetch(`${BACKEND_API_URL}/Admin/CreateBotCampaign`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    const data = await parseResponse(response);

    if (!response.ok) {
      return {
        success: false,
        message: data.message || 'Kampanya oluşturulurken bir hata oluştu',
      };
    }

    return {
      success: true,
      campaign: data.campaign,
      message: data.message || 'Kampanya başarıyla oluşturuldu',
    };
  } catch (error: any) {
    console.error('[CAMPAIGN_SERVICE] Error creating campaign:', error);
    return {
      success: false,
      message: error.message || 'Kampanya oluşturulurken bir hata oluştu',
    };
  }
}

/**
 * Get all campaigns
 */
export async function getCampaigns(status?: string): Promise<{ success: boolean; campaigns?: Campaign[]; message?: string }> {
  try {
    const url = status
      ? `${BACKEND_API_URL}/Admin/GetBotCampaigns?status=${encodeURIComponent(status)}`
      : `${BACKEND_API_URL}/Admin/GetBotCampaigns`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await parseResponse(response);

    if (!response.ok) {
      return {
        success: false,
        message: data.message || 'Kampanyalar getirilirken bir hata oluştu',
      };
    }

    return {
      success: true,
      campaigns: data.campaigns || [],
    };
  } catch (error: any) {
    console.error('[CAMPAIGN_SERVICE] Error getting campaigns:', error);
    return {
      success: false,
      message: error.message || 'Kampanyalar getirilirken bir hata oluştu',
    };
  }
}

/**
 * Get campaign status
 */
export async function getCampaignStatus(campaignId: string): Promise<{ success: boolean; status?: CampaignStatus; message?: string }> {
  try {
    const response = await fetch(`${BACKEND_API_URL}/Admin/GetBotCampaignStatus/${campaignId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await parseResponse(response);

    if (!response.ok) {
      return {
        success: false,
        message: data.message || 'Kampanya durumu getirilirken bir hata oluştu',
      };
    }

    return {
      success: true,
      status: data.status,
    };
  } catch (error: any) {
    console.error('[CAMPAIGN_SERVICE] Error getting campaign status:', error);
    return {
      success: false,
      message: error.message || 'Kampanya durumu getirilirken bir hata oluştu',
    };
  }
}

/**
 * Create a recurring bot campaign
 */
export async function createRecurringCampaign(request: CreateRecurringCampaignRequest): Promise<{ success: boolean; campaign?: Campaign; message?: string }> {
  try {
    const response = await fetch(`${BACKEND_API_URL}/Admin/CreateRecurringBotCampaign`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    const data = await parseResponse(response);

    if (!response.ok) {
      return {
        success: false,
        message: data.message || 'Tekrarlayan kampanya oluşturulurken bir hata oluştu',
      };
    }

    return {
      success: true,
      campaign: data.campaign,
      message: data.message || 'Tekrarlayan kampanya başarıyla oluşturuldu',
    };
  } catch (error: any) {
    console.error('[CAMPAIGN_SERVICE] Error creating recurring campaign:', error);
    return {
      success: false,
      message: error.message || 'Tekrarlayan kampanya oluşturulurken bir hata oluştu',
    };
  }
}

/**
 * Cancel a campaign
 */
export async function cancelCampaign(campaignId: string): Promise<{ success: boolean; message?: string }> {
  try {
    const response = await fetch(`${BACKEND_API_URL}/Admin/CancelBotCampaign`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ campaignId }),
    });

    const data = await parseResponse(response);

    if (!response.ok) {
      return {
        success: false,
        message: data.message || 'Kampanya iptal edilirken bir hata oluştu',
      };
    }

    return {
      success: true,
      message: data.message || 'Kampanya başarıyla iptal edildi',
    };
  } catch (error: any) {
    console.error('[CAMPAIGN_SERVICE] Error cancelling campaign:', error);
    return {
      success: false,
      message: error.message || 'Kampanya iptal edilirken bir hata oluştu',
    };
  }
}

/**
 * Stop a recurring campaign
 */
export async function stopRecurringCampaign(campaignId: string): Promise<{ success: boolean; message?: string }> {
  try {
    const response = await fetch(`${BACKEND_API_URL}/Admin/StopRecurringBotCampaign`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ campaignId }),
    });

    const data = await parseResponse(response);

    if (!response.ok) {
      return {
        success: false,
        message: data.message || 'Tekrarlayan kampanya durdurulurken bir hata oluştu',
      };
    }

    return {
      success: true,
      message: data.message || 'Tekrarlayan kampanya başarıyla durduruldu',
    };
  } catch (error: any) {
    console.error('[CAMPAIGN_SERVICE] Error stopping recurring campaign:', error);
    return {
      success: false,
      message: error.message || 'Tekrarlayan kampanya durdurulurken bir hata oluştu',
    };
  }
}

