export const captureFbclid = () => {
    if (typeof window === 'undefined') return;

    const urlParams = new URLSearchParams(window.location.search);
    const fbclid = urlParams.get('fbclid');

    if (fbclid) {
        console.log('[Analytics] Capturing fbclid:', fbclid);
        localStorage.setItem('fbclid', fbclid);
    }
};

export const getFbclid = (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('fbclid');
};
