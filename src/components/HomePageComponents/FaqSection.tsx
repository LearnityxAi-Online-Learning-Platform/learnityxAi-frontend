'use client';

import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import styles from './HomePageComponents.module.scss';

interface FaqItem {
    id: number;
    question: string;
    answer: string;
}

export default function FaqSection(): React.JSX.Element {
    const [openId, setOpenId] = useState<number | null>(null);

    const faqs: FaqItem[] = [
        {
            id: 1,
            question: "What courses does Learnityx AI offer?",
            answer: "Learnityx AI offers a wide range of courses in Artificial Intelligence, Machine Learning, Data Science, Programming, Cloud Computing, and more. Our courses are designed by industry experts and updated regularly to match current industry standards."
        },
        {
            id: 2,
            question: "How do I enroll in a course?",
            answer: "Enrolling is simple! Browse our course catalog, select the course you're interested in, and click the 'Enroll Now' button. You'll need to create an account or log in, then complete the payment process. Once enrolled, you'll have immediate access to the course materials."
        },
        {
            id: 3,
            question: "Are there any prerequisites for the courses?",
            answer: "Prerequisites vary by course. Each course page clearly lists any required knowledge or skills. Some beginner courses have no prerequisites, while advanced courses may require foundational knowledge. We recommend checking the course details before enrolling."
        },
        {
            id: 4,
            question: "Can I get a certificate after completing a course?",
            answer: "Yes! Upon successful completion of a course, you'll receive a verified certificate that you can share on LinkedIn, add to your resume, or showcase to potential employers. Our certificates are recognized by industry leaders worldwide."
        },
        {
            id: 5,
            question: "What is the refund policy?",
            answer: "We offer a 30-day money-back guarantee on all courses. If you're not satisfied with your purchase for any reason, you can request a full refund within 30 days of enrollment. No questions asked!"
        },
        {
            id: 6,
            question: "How long do I have access to the course materials?",
            answer: "Once you enroll in a course, you have lifetime access to all course materials, including videos, assignments, resources, and future updates. Learn at your own pace and revisit the content whenever you need a refresher."
        },
        {
            id: 7,
            question: "Do you offer corporate or team training?",
            answer: "Yes! We offer special corporate packages for teams and organizations. Our enterprise solutions include custom learning paths, team management tools, progress tracking, and dedicated support. Contact our sales team for more information."
        },
        {
            id: 8,
            question: "Is there a mobile app available?",
            answer: "Our platform is fully responsive and works seamlessly on all devices. While we're currently developing native mobile apps for iOS and Android, you can access all courses and features through your mobile browser with an excellent user experience."
        }
    ];

    const toggleFaq = (id: number) => {
        setOpenId(openId === id ? null : id);
    };

    return (
        <section className={`${styles.faqSection} py-8 sm:py-10 lg:py-12`}>
            <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">

                {/* Section Header */}
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-12 sm:mb-14 lg:mb-16">
                    <div className="max-w-2xl">
                        <div className="flex items-center gap-3 mb-3">
                            <HelpCircle className={`${styles.gradientText} w-8 h-8 sm:w-9 sm:h-9`} />
                            <h2 className={`${styles.faqHeading} text-3xl sm:text-4xl lg:text-5xl font-black leading-tight`}>
                                Frequently Asked <span className={styles.gradientText}>Questions</span>
                            </h2>
                        </div>
                        <p className={`${styles.faqSubheading} text-base sm:text-lg`}>
                            Got questions? We&apos;ve got answers. Find everything you need to know about our courses and platform.
                        </p>
                    </div>
                </div>

                {/* FAQ Accordion */}
                <div className="space-y-3 sm:space-y-4">
                    {faqs.map((faq) => (
                        <div
                            key={faq.id}
                            className={`${styles.faqCard} rounded-xl sm:rounded-2xl overflow-hidden transition-all duration-300`}
                        >
                            {/* Question Button */}
                            <button
                                onClick={() => toggleFaq(faq.id)}
                                className="w-full flex items-center justify-between gap-4 p-5 sm:p-6 lg:p-7 text-left transition-all duration-300"
                                aria-expanded={openId === faq.id}
                            >
                                <h3 className={`${styles.faqQuestion} text-base sm:text-lg lg:text-xl font-bold flex-1 leading-snug`}>
                                    {faq.question}
                                </h3>
                                <div className={`${styles.faqIconWrapper} shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-300`}>
                                    {openId === faq.id ? (
                                        <ChevronUp className={`${styles.faqIcon} w-5 h-5 sm:w-6 sm:h-6`} />
                                    ) : (
                                        <ChevronDown className={`${styles.faqIcon} w-5 h-5 sm:w-6 sm:h-6`} />
                                    )}
                                </div>
                            </button>

                            {/* Answer Content */}
                            <div
                                className={`transition-all duration-300 ease-in-out ${
                                    openId === faq.id
                                        ? 'max-h-96 opacity-100'
                                        : 'max-h-0 opacity-0 overflow-hidden'
                                }`}
                            >
                                <div className={`${styles.faqAnswer} px-5 sm:px-6 lg:px-7 pb-5 sm:pb-6 lg:pb-7 pt-0`}>
                                    <div className={`${styles.faqDivider} h-px w-full mb-4 sm:mb-5`}></div>
                                    <p className="text-sm sm:text-base lg:text-lg leading-relaxed">
                                        {faq.answer}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}