import * as React from 'react';
import { disconnectMutationObserver, resetLoadingObserver } from '../utils/observer';
/**
 * Adds ability to scroll to a child component with an ID corresponding to a URL hash ID
 */
const HashLinkObserver = ({ isPageLoading, smoothScroll = true }) => {
    const scrollIntoViewOptions = smoothScroll
        ? { behavior: 'smooth' }
        : undefined;
    /**
     * If there is a hash ID in the URL scroll to the corresponding element if it exists, otherwise:
     *  - create a new observer to check for the element when the DOM changes (loads)
     *  - set a timeout that will disconnect the observer
     */
    React.useEffect(() => {
        const OBSERVER_TIMEOUT_MS = 5000;
        const hash = window.location.hash;
        let loadingObserver;
        let observerTimeout;
        if (!hash || isPageLoading) {
            return;
        }
        const elementId = hash.slice(1);
        const element = document.getElementById(elementId);
        if (element) {
            element.setAttribute('tabindex', '-1');
            element.scrollIntoView(scrollIntoViewOptions);
            element.focus();
            return;
        }
        // If there is a hash ID but no element, re-check after each DOM mutation
        loadingObserver = new MutationObserver((_, observer) => {
            const missingElement = document.getElementById(elementId);
            if (missingElement) {
                missingElement.setAttribute('tabindex', '-1');
                missingElement.scrollIntoView(scrollIntoViewOptions);
                missingElement.focus();
                resetLoadingObserver(observer, observerTimeout);
            }
        });
        loadingObserver.observe(document, { childList: true, subtree: true });
        // Disconnect the observer after `OBSERVER_TIMEOUT_MS`
        observerTimeout = window.setTimeout(() => disconnectMutationObserver(loadingObserver), OBSERVER_TIMEOUT_MS);
        return () => {
            resetLoadingObserver(loadingObserver, observerTimeout);
        };
    }, [window.location.href, isPageLoading]);
    return null;
};
export default HashLinkObserver;
