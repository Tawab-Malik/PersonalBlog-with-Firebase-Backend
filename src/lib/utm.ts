interface UTMParams {
  source: string;
  medium: string;
  campaign: string;
  term?: string;
  content?: string;
}

export function generateUTMUrl(baseUrl: string, params: UTMParams): string {
  const url = new URL(baseUrl);
  
  url.searchParams.set('utm_source', params.source);
  url.searchParams.set('utm_medium', params.medium);
  url.searchParams.set('utm_campaign', params.campaign);
  
  if (params.term) {
    url.searchParams.set('utm_term', params.term);
  }
  
  if (params.content) {
    url.searchParams.set('utm_content', params.content);
  }
  
  return url.toString();
}

// Predefined UTM configurations for common sources
export const UTM_CONFIGS = {
  facebook: {
    source: 'facebook',
    medium: 'social',
    campaign: 'social_media'
  },
  twitter: {
    source: 'twitter', 
    medium: 'social',
    campaign: 'social_media'
  },
  instagram: {
    source: 'instagram',
    medium: 'social', 
    campaign: 'social_media'
  },
  youtube: {
    source: 'youtube',
    medium: 'video',
    campaign: 'video_content'
  },
  linkedin: {
    source: 'linkedin',
    medium: 'social',
    campaign: 'professional_networking'
  },
  github: {
    source: 'github',
    medium: 'referral',
    campaign: 'developer_community'
  },
  email: {
    source: 'email',
    medium: 'email',
    campaign: 'newsletter'
  },
  google: {
    source: 'google',
    medium: 'organic',
    campaign: 'seo'
  }
} as const;

// Helper function to create UTM URLs for common sources
export function createSocialUTM(baseUrl: string, platform: keyof typeof UTM_CONFIGS, campaign?: string): string {
  const config = UTM_CONFIGS[platform];
  return generateUTMUrl(baseUrl, {
    ...config,
    campaign: campaign || config.campaign
  });
} 