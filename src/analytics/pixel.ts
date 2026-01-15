// Utility to track Meta Pixel events safely

// Define the standard Facebook Pixel types
type PixelEventName =
    | 'PageView'
    | 'ViewContent'
    | 'Lead'
    | 'InitiateCheckout'
    | 'Purchase'
    | 'CompleteRegistration'
    | 'Contact';

interface PixelEventData {
    content_name?: string;
    content_category?: string;
    content_ids?: string[];
    content_type?: string;
    value?: number;
    currency?: string;
    [key: string]: any;
}

// Global definition for fbq
declare global {
    interface Window {
        fbq: (
            action: string,
            arg2?: any,
            arg3?: any
        ) => void;
    }
}

export const trackPixelEvent = (eventName: PixelEventName, data?: PixelEventData) => {
    if (typeof window !== 'undefined' && window.fbq) {
        window.fbq('track', eventName, data);
    } else {
        // In dev or if blocked, we might want to log this
        if (import.meta.env.DEV) {
            console.log(`[Meta Pixel] ${eventName}`, data);
        }
    }
};
