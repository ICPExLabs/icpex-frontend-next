/**
 * Sets the HTML document's lang attribute to the specified locale
 * @param locale The language/locale code to set (e.g., 'en', 'zh-CN')
 * @returns void
 */
export const setHtmlPageLang = (locale: string): void => {
    try {
        const htmlElement = document.documentElement;
        if (htmlElement && typeof locale === 'string' && locale.trim().length > 0) {
            htmlElement.lang = locale.trim();
        }
    } catch (error) {
        if (process.env.NODE_ENV === 'development') {
            console.warn('Failed to set HTML lang attribute:', error);
        }
    }
};
