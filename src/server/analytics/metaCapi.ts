import { FacebookAdsApi, Pixel, Event, UserData, CustomData, ServerEvent } from 'facebook-nodejs-business-sdk';
import crypto from 'crypto';

/**
 * Meta Conversions API (CAPI) Service
 * 
 * Handles sending server-side events to Meta for better tracking accuracy and deduplication.
 * Requires META_ACCESS_TOKEN and META_PIXEL_ID in environment variables.
 */

const PIXEL_ID = process.env.META_PIXEL_ID;
const ACCESS_TOKEN = process.env.META_ACCESS_TOKEN;

let isInitialized = false;

const initApi = () => {
    if (isInitialized) return;

    if (!ACCESS_TOKEN || !PIXEL_ID) {
        if (process.env.NODE_ENV === 'production') {
            console.warn('Meta CAPI: Missing META_ACCESS_TOKEN or META_PIXEL_ID. CAPI events will not be sent.');
        }
        return;
    }

    try {
        FacebookAdsApi.init(ACCESS_TOKEN);
        isInitialized = true;
    } catch (error) {
        console.error('Meta CAPI: Failed to initialize FacebookAdsApi', error);
    }
};

/**
 * Normalizes and hashes user data (email, phone, etc.) using SHA256 as required by Meta.
 * @param str The string to hash
 * @returns The SHA256 hash of the normalized string
 */
const hashUserData = (str: string): string => {
    if (!str) return '';
    // Normalize: trim and lowercase
    const normalized = str.trim().toLowerCase();
    return crypto.createHash('sha256').update(normalized).digest('hex');
};

export interface CapiUserData {
    email?: string;
    phone?: string;
    firstName?: string; // fn
    lastName?: string; // ln
    clientIp?: string;
    userAgent?: string;
    fbp?: string; // _fbp cookie
    fbc?: string; // _fbc cookie
    externalId?: string; // Unique user ID from our DB
}

export interface CapiEventData {
    eventName: string;
    eventId: string; // REQUIRED for deduplication (must match client-side eventID)
    eventSourceUrl: string;
    userData: CapiUserData;
    customData?: Record<string, any>;
    actionSource?: string; // 'website', 'email', etc. Default 'website'
    testEventCode?: string; // Optional code for testing in Events Manager
}

/**
 * Sends an event to Meta Conversions API
 */
export const sendCapiEvent = async (data: CapiEventData) => {
    // Ensure API is initialized
    initApi();

    if (!isInitialized || !PIXEL_ID) {
        // In development with no keys, just log it
        if (process.env.NODE_ENV !== 'production') {
            console.log(`[Meta CAPI - Mock] Event: ${data.eventName}, EventID: ${data.eventId}`);
        }
        return;
    }

    try {
        const userData = new UserData();

        if (data.userData.email) userData.setEmail(hashUserData(data.userData.email));
        if (data.userData.phone) userData.setPhone(hashUserData(data.userData.phone));
        if (data.userData.firstName) userData.setFirstName(hashUserData(data.userData.firstName));
        if (data.userData.lastName) userData.setLastName(hashUserData(data.userData.lastName));
        if (data.userData.clientIp) userData.setClientIpAddress(data.userData.clientIp);
        if (data.userData.userAgent) userData.setClientUserAgent(data.userData.userAgent);
        if (data.userData.fbp) userData.setFbp(data.userData.fbp);
        if (data.userData.fbc) userData.setFbc(data.userData.fbc);
        if (data.userData.externalId) userData.setExternalId(hashUserData(data.userData.externalId)); // External ID can also be hashed for privacy

        const content = new Content();
        // Populate content if we had products, skipping for now as we use generic CustomData mainly

        const customData = new CustomData();
        if (data.customData) {
            if (data.customData.currency) customData.setCurrency(data.customData.currency);
            if (data.customData.value) customData.setValue(data.customData.value);
            if (data.customData.content_name) customData.setContentName(data.customData.content_name);
            if (data.customData.content_category) customData.setContentCategory(data.customData.content_category);
            if (data.customData.content_ids) customData.setContentIds(data.customData.content_ids);
            if (data.customData.content_type) customData.setContentType(data.customData.content_type);
            // Add other custom properties if needed using custom properties map if SDK supports or mapping known fields
            // Since the strict SDK types might limit arbitrary keys, we focus on standard ones. 
        }

        const serverEvent = new ServerEvent()
            .setEventName(data.eventName)
            .setEventTime(Math.floor(Date.now() / 1000))
            .setUserData(userData)
            .setCustomData(customData)
            .setEventSourceUrl(data.eventSourceUrl)
            .setActionSource(data.actionSource || 'website')
            .setEventId(data.eventId);

        const eventsData = [serverEvent];
        const eventRequest = new EventRequest(ACCESS_TOKEN, PIXEL_ID).setEvents(eventsData);

        // Add test_event_code if provided (or from env)
        const testCode = data.testEventCode || process.env.META_TEST_EVENT_CODE;
        if (testCode) {
            eventRequest.setTestEventCode(testCode);
        }

        const response = await eventRequest.execute();

        // In dev, log success
        if (process.env.NODE_ENV !== 'production') {
            console.log(`[Meta CAPI] Sent ${data.eventName} successfully.`, response);
        }

    } catch (error) {
        console.error(`[Meta CAPI] Error sending event ${data.eventName}:`, error);
    }
};

// Re-export required SDK classes just in case, but usually not needed outside.
// Note: Content and EventRequest are imported from SDK
import { Content, EventRequest } from 'facebook-nodejs-business-sdk';
