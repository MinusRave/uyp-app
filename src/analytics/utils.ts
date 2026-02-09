export const captureFbclid = () => {
    if (typeof window === 'undefined') return;

    const urlParams = new URLSearchParams(window.location.search);
    const fbclid = urlParams.get('fbclid');

    if (fbclid) {
        console.log('[Analytics] Capturing fbclid:', fbclid);
        localStorage.setItem('fbclid', fbclid);
    }

    // Capture UTMs
    const utmParams = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
    utmParams.forEach(param => {
        const val = urlParams.get(param);
        if (val) {
            console.log(`[Analytics] Capturing ${param}:`, val);
            localStorage.setItem(param, val);
        }
    });

    // Capture Referrer (only if internal navigation didn't overwrite it, essentially on first load)
    if (document.referrer && !document.referrer.includes(window.location.hostname)) {
        // Only save if it's external
        localStorage.setItem('referrer', document.referrer);
    }
};

export const getFbclid = (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('fbclid');
};

export const getUtmParams = () => {
    if (typeof window === 'undefined') return {};
    return {
        utm_source: localStorage.getItem('utm_source'),
        utm_medium: localStorage.getItem('utm_medium'),
        utm_campaign: localStorage.getItem('utm_campaign'),
        utm_content: localStorage.getItem('utm_content'),
        utm_term: localStorage.getItem('utm_term'),
        referrer: localStorage.getItem('referrer'),
    };
};
