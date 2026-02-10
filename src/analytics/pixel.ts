// Utility to track Meta Pixel events safely

// Define the standard Facebook Pixel types
type PixelEventName =
    | 'PageView'
    | 'ViewContent'
    | 'AddToCart'
    | 'Lead'
    | 'InitiateCheckout'
    | 'Purchase'
    | 'CompleteRegistration'
    | 'Contact'
    | 'CustomEvent';

interface PixelEventData {
    content_name?: string;
    content_category?: string;
    content_ids?: string[];
    content_type?: string;
    value?: number;
    currency?: string;
    eventID?: string; // For CAPI deduplication
    [key: string]: any;
}

// Global definition for fbq
declare global {
    interface Window {
        fbq: (
            action: string,
            eventName: string,
            params?: any,
            options?: { eventID?: string; test_event_code?: string }
        ) => void;
    }
}


export const initPixel = (pixelId: string) => {
    if (typeof window !== 'undefined' && window.fbq) {
        // Get test_event_code from env
        const testCode = import.meta.env.REACT_APP_META_TEST_EVENT_CODE;

        // Initialize with test_event_code in options (4th parameter)
        // Syntax: fbq('init', pixelId, userData, options)
        const options = testCode ? { test_event_code: testCode } : {};

        console.log('[Pixel] Initializing with options:', options);
        window.fbq('init', pixelId, {}, options);
    }
};

export const trackPixelEvent = (eventName: PixelEventName, data?: PixelEventData) => {
    console.log(`[Pixel] Tracking event: ${eventName}`, data);
    if (typeof window !== 'undefined' && window.fbq) {
        const params = { ...data };

        // Extract eventID from params for deduplication with server-side events
        const eventID = params.eventID;
        if (eventID) {
            delete params.eventID;
        }

        // Build options object with eventID
        // Note: test_event_code is set globally in init, no need to pass it per-event
        const options: any = {};
        if (eventID) options.eventID = eventID;

        console.log(`[Pixel] Calling fbq('track', '${eventName}', ${JSON.stringify(params)}, ${JSON.stringify(options)})`);
        window.fbq('track', eventName, params, options);
    } else {
        console.warn(`[Pixel] window.fbq not found for event: ${eventName}`);
        // In dev or if blocked, we might want to log this
        if (import.meta.env.DEV) {
            console.log(`[Meta Pixel] ${eventName}`, data);
        }
    }
};
