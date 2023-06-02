export const disconnectMutationObserver = (observer) => {
    if (observer) {
        observer.disconnect();
    }
};
export const resetLoadingObserver = (loadingObserver, observerTimeout) => {
    disconnectMutationObserver(loadingObserver);
    window.clearTimeout(observerTimeout);
};
