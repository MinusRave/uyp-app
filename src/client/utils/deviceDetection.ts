export interface DeviceInfo {
    deviceType: 'mobile' | 'tablet' | 'desktop';
    deviceOS: 'iOS' | 'Android' | 'Windows' | 'MacOS' | 'Linux' | 'Other';
    deviceOSVersion: string;
    deviceBrand?: string;
    deviceModel?: string;
    browser: 'Chrome' | 'Safari' | 'Firefox' | 'Edge' | 'Other';
    browserVersion: string;
    screenResolution: string;
    viewportSize: string;
    deviceLanguage: string;
    deviceTimezone: string;
}

/**
 * Parses user agent string to extract device information
 */
export function getDeviceInfo(): DeviceInfo {
    const ua = navigator.userAgent;
    const language = navigator.language || 'en-US';
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';

    // Screen and viewport
    const screenResolution = `${window.screen.width}x${window.screen.height}`;
    const viewportSize = `${window.innerWidth}x${window.innerHeight}`;

    // Detect device type
    const deviceType = getDeviceType(ua);

    // Detect OS
    const { os, osVersion } = getOS(ua);

    // Detect browser
    const { browser, browserVersion } = getBrowser(ua);

    // Detect device brand and model (primarily for mobile)
    const { brand, model } = getDeviceBrandModel(ua, os);

    return {
        deviceType,
        deviceOS: os,
        deviceOSVersion: osVersion,
        deviceBrand: brand,
        deviceModel: model,
        browser,
        browserVersion,
        screenResolution,
        viewportSize,
        deviceLanguage: language,
        deviceTimezone: timezone,
    };
}

function getDeviceType(ua: string): 'mobile' | 'tablet' | 'desktop' {
    // Check for tablet first (more specific)
    if (/(ipad|tablet|playbook|silk)|(android(?!.*mobile))/i.test(ua)) {
        return 'tablet';
    }

    // Check for mobile
    if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
        return 'mobile';
    }

    return 'desktop';
}

function getOS(ua: string): { os: DeviceInfo['deviceOS']; osVersion: string } {
    let os: DeviceInfo['deviceOS'] = 'Other';
    let osVersion = '';

    // iOS
    if (/iPad|iPhone|iPod/.test(ua)) {
        os = 'iOS';
        const match = ua.match(/OS (\d+)[._](\d+)[._]?(\d+)?/);
        if (match) {
            osVersion = `${match[1]}.${match[2]}${match[3] ? '.' + match[3] : ''}`;
        }
    }
    // Android
    else if (/Android/.test(ua)) {
        os = 'Android';
        const match = ua.match(/Android (\d+\.?\d*\.?\d*)/);
        if (match) {
            osVersion = match[1];
        }
    }
    // Windows
    else if (/Windows/.test(ua)) {
        os = 'Windows';
        if (/Windows NT 10.0/.test(ua)) osVersion = '10';
        else if (/Windows NT 11.0/.test(ua)) osVersion = '11';
        else if (/Windows NT 6.3/.test(ua)) osVersion = '8.1';
        else if (/Windows NT 6.2/.test(ua)) osVersion = '8';
        else if (/Windows NT 6.1/.test(ua)) osVersion = '7';
    }
    // MacOS
    else if (/Mac OS X/.test(ua)) {
        os = 'MacOS';
        const match = ua.match(/Mac OS X (\d+)[._](\d+)[._]?(\d+)?/);
        if (match) {
            osVersion = `${match[1]}.${match[2]}${match[3] ? '.' + match[3] : ''}`;
        }
    }
    // Linux
    else if (/Linux/.test(ua)) {
        os = 'Linux';
    }

    return { os, osVersion };
}

function getBrowser(ua: string): { browser: DeviceInfo['browser']; browserVersion: string } {
    let browser: DeviceInfo['browser'] = 'Other';
    let browserVersion = '';

    // Edge (must check before Chrome as it contains Chrome in UA)
    if (/Edg/.test(ua)) {
        browser = 'Edge';
        const match = ua.match(/Edg[\/\s](\d+\.\d+)/);
        if (match) browserVersion = match[1];
    }
    // Chrome
    else if (/Chrome/.test(ua) && !/Edg/.test(ua)) {
        browser = 'Chrome';
        const match = ua.match(/Chrome[\/\s](\d+\.\d+)/);
        if (match) browserVersion = match[1];
    }
    // Safari (must check after Chrome)
    else if (/Safari/.test(ua) && !/Chrome/.test(ua)) {
        browser = 'Safari';
        const match = ua.match(/Version[\/\s](\d+\.\d+)/);
        if (match) browserVersion = match[1];
    }
    // Firefox
    else if (/Firefox/.test(ua)) {
        browser = 'Firefox';
        const match = ua.match(/Firefox[\/\s](\d+\.\d+)/);
        if (match) browserVersion = match[1];
    }

    return { browser, browserVersion };
}

function getDeviceBrandModel(ua: string, os: DeviceInfo['deviceOS']): { brand?: string; model?: string } {
    let brand: string | undefined;
    let model: string | undefined;

    if (os === 'iOS') {
        brand = 'Apple';

        // Detect iPhone model
        if (/iPhone/.test(ua)) {
            // Note: iOS user agents don't expose specific model numbers
            // We can only detect "iPhone" generically
            model = 'iPhone';
        } else if (/iPad/.test(ua)) {
            model = 'iPad';
        } else if (/iPod/.test(ua)) {
            model = 'iPod';
        }
    } else if (os === 'Android') {
        // Try to extract brand and model from Android UA
        // Format examples: "Samsung SM-G998B", "Pixel 7 Pro"

        // Samsung
        if (/Samsung/.test(ua)) {
            brand = 'Samsung';
            const match = ua.match(/Samsung[;\s]([^;)]+)/i) || ua.match(/SM-[A-Z0-9]+/);
            if (match) model = match[1] || match[0];
        }
        // Google Pixel
        else if (/Pixel/.test(ua)) {
            brand = 'Google';
            const match = ua.match(/Pixel( \d+)?( Pro| XL)?/);
            if (match) model = match[0];
        }
        // Huawei
        else if (/Huawei/.test(ua)) {
            brand = 'Huawei';
            const match = ua.match(/Huawei[;\s]([^;)]+)/i);
            if (match) model = match[1];
        }
        // Xiaomi
        else if (/Xiaomi|Mi |Redmi/.test(ua)) {
            brand = 'Xiaomi';
            const match = ua.match(/(Mi |Redmi )([^;)]+)/i);
            if (match) model = match[0];
        }
        // OnePlus
        else if (/OnePlus/.test(ua)) {
            brand = 'OnePlus';
            const match = ua.match(/OnePlus([^;)]+)/i);
            if (match) model = match[0];
        }
    }

    return { brand, model };
}
