// Google Analytics 4 Configuration
declare global {
  interface Window {
    gtag: (...args: unknown[]) => void
  }
}

export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID || 'G-XXXXXXXXXX'

// Initialize Google Analytics
export const initGA = () => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_TRACKING_ID, {
      page_title: document.title,
      page_location: window.location.href,
    })
  }
}

// Track page views
export const trackPageView = (url: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_TRACKING_ID, {
      page_path: url,
    })
  }
}

// Track custom events
export const trackEvent = (action: string, category: string, label?: string, value?: number) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    })
  }
}

// Track social media clicks
export const trackSocialClick = (platform: string, campaign: string) => {
  trackEvent('click', 'social_media', `${platform}_${campaign}`)
}

// Track UTM parameters
export const trackUTMParams = () => {
  if (typeof window !== 'undefined') {
    const urlParams = new URLSearchParams(window.location.search)
    const utmSource = urlParams.get('utm_source')
    const utmMedium = urlParams.get('utm_medium')
    const utmCampaign = urlParams.get('utm_campaign')
    
    if (utmSource || utmMedium || utmCampaign) {
      trackEvent('page_view', 'utm_tracking', `${utmSource}_${utmMedium}_${utmCampaign}`)
    }
  }
}

// Get UTM parameters from URL
export const getUTMParams = () => {
  if (typeof window !== 'undefined') {
    const urlParams = new URLSearchParams(window.location.search)
    return {
      source: urlParams.get('utm_source'),
      medium: urlParams.get('utm_medium'),
      campaign: urlParams.get('utm_campaign'),
      term: urlParams.get('utm_term'),
      content: urlParams.get('utm_content'),
    }
  }
  return null
} 