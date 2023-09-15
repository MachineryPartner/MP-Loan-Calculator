// Populate Accordions with FAQ questions

"use strict";
window.addEventListener('DOMContentLoaded', () => {
    const cmsData = document.querySelector('[fs-element="cms_faq"]');
    if (!cmsData)
        return;
    const cmsQuestions = document.querySelectorAll('[fs-element="cms_faq"] > h3');
    const cmsAnswers = document.querySelectorAll('[fs-element="cms_faq"] > p');
    const accordionWrapper = document.querySelector('.faq_wrapper');
    const accordionHeaderTitle = document.querySelector('.faq_header-title');
    const insertAfter = (newElement, referenceElement) => {
        var _a;
        (_a = referenceElement === null || referenceElement === void 0 ? void 0 : referenceElement.parentNode) === null || _a === void 0 ? void 0 : _a.insertBefore(newElement, referenceElement.nextSibling);
    };
    cmsQuestions.forEach(function (value, index) {
        if (index !== 0) {
            const wrapperClone = accordionWrapper === null || accordionWrapper === void 0 ? void 0 : accordionWrapper.cloneNode(true);
            insertAfter(wrapperClone, accordionWrapper === null || accordionWrapper === void 0 ? void 0 : accordionWrapper.nextSibling);
        }
    });
    const faqContents = document.querySelectorAll('.faq_content');
    const faqWrappers = document.querySelectorAll('.faq_wrapper');
    const faqParagraphs = document.querySelectorAll('[fs-element="accordion-paragraph"]');
    const arrows = document.querySelectorAll('.faq_header-arrow');
    const faqHeaders = document.querySelectorAll('.faq_header-title');
    faqContents.forEach(function (faqContent, index) {
        const faqParagraph = faqParagraphs[index];
        const faqHeader = faqHeaders[index];
        const cmsAnswer = cmsAnswers[index];
        const cmsQuestion = cmsQuestions[index];
        faqHeader.innerHTML = cmsQuestion.innerHTML;
        faqParagraph.innerHTML = cmsAnswer.innerHTML;
        const faqWrapper = faqWrappers[index];
        faqWrapper.onclick = () => {
            const arrow = arrows[index];
            if (faqContent.style.height === '0rem') {
                faqContent.style.height = 'auto';
                arrow.style.transform = 'rotate(180deg)';
                arrow.style.transition = 'transform 500ms ease';
            }
            else {
                faqContent.style.height = '0rem';
                arrow.style.transform = 'rotate(-0deg)';
                arrow.style.transition = 'transform 500ms ease';
                console.log('yo');
            }
        };
    });
});