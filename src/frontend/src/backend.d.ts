import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface PricingSection {
    originalPrice: bigint;
    upiLink: string;
    qrCodeImageUrl: string;
    discountedPrice: bigint;
}
export interface HeroSection {
    bookTitle: string;
    tagline: string;
    ctaButtonText: string;
    ctaLink: string;
    subtitle: string;
}
export interface FeaturesSection {
    checkmarkBullets: Array<string>;
    lifestyleImageUrl: string;
    bonusItems: Array<string>;
}
export interface PageContent {
    featuresSection: FeaturesSection;
    ebookCoverImageUrl: string;
    heroSection: HeroSection;
    pricingSection: PricingSection;
    testimonials: Array<Testimonial>;
}
export interface Testimonial {
    name: string;
    quote: string;
    stars: number;
    location?: string;
}
export interface backendInterface {
    addOrUpdateTestimonial(testimonial: Testimonial): Promise<void>;
    deleteTestimonial(name: string): Promise<void>;
    getPageContent(): Promise<PageContent>;
    getTestimonialsSortedByStars(): Promise<Array<Testimonial>>;
    replaceAllTestimonials(newTestimonials: Array<Testimonial>): Promise<void>;
    updateEbookCoverImageUrl(newUrl: string): Promise<void>;
    updateFeaturesSection(newFeatures: FeaturesSection): Promise<void>;
    updateHeroSection(newHero: HeroSection): Promise<void>;
    updatePricingSection(newPricing: PricingSection): Promise<void>;
}
