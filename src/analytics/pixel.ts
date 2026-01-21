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
            options?: { eventID?: string }
        ) => void;
    }
}


export const initPixel = (pixelId: string) => {
    if (typeof window !== 'undefined' && window.fbq) {
        window.fbq('init', pixelId);
    }
};

export const trackPixelEvent = (eventName: PixelEventName, data?: PixelEventData) => {
    console.log(`[Pixel] Tracking event: ${eventName}`, data);
    if (typeof window !== 'undefined' && window.fbq) {
        const params = { ...data };

        // Inject Test Event Code if available (for localhost debugging)
        // This ensures Browser events show up in the same Test Events tab as CAPI events
        const testCode = import.meta.env.REACT_APP_META_TEST_EVENT_CODE;
        if (testCode) {
            (params as any).test_event_code = testCode;
        }

        const eventID = params.eventID;

        // Remove eventID from the data payload as it should be passed as a separate option
        if (eventID) {
            delete params.eventID;
        }

        const options = eventID ? { eventID } : undefined;

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
