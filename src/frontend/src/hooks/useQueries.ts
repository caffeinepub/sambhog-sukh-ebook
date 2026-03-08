import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  FeaturesSection,
  HeroSection,
  PageContent,
  PricingSection,
  Testimonial,
} from "../backend.d";
import { useActor } from "./useActor";

const DEFAULT_CONTENT: PageContent = {
  heroSection: {
    bookTitle: "सम्भोग सुख:",
    subtitle: "पूर्ण नारीत्रिकं, वैवाहिक जीवन के आयुर्वेदिक और गार्हस्थिक रहस्य",
    tagline: "वो बातें जो कोई आपको नहीं बताता",
    ctaButtonText: "अभी खरीदें",
    ctaLink: "#pricing",
  },
  featuresSection: {
    checkmarkBullets: [
      "आयुर्वेदिक जड़ी-बूटियों के प्राकृतिक उपाय",
      "वैवाहिक जीवन में सुख और समरसता",
      "वैज्ञानिक और प्राचीन ज्ञान का संगम",
      "प्रीमियम डिजिटल गाइड (PDF)",
    ],
    lifestyleImageUrl: "/assets/generated/couple-lifestyle.dim_800x600.jpg",
    bonusItems: [
      "बोनस: विशेष आयुर्वेदिक नुस्खे",
      "बोनस: 30 दिन का प्लान",
      "बोनस: विशेषज्ञ सलाह गाइड",
      "बोनस: आजीवन अपडेट",
    ],
  },
  ebookCoverImageUrl: "/assets/generated/ebook-cover.dim_400x560.png",
  pricingSection: {
    originalPrice: BigInt(299),
    discountedPrice: BigInt(199),
    upiLink: "#buy",
    qrCodeImageUrl: "/assets/generated/qr-placeholder.dim_200x200.png",
  },
  testimonials: [
    {
      name: "राजेश शर्मा",
      quote: "इस पुस्तक ने मेरे वैवाहिक जीवन को बदल दिया। अद्भुत जानकारी!",
      stars: 5,
      location: "दिल्ली",
    },
    {
      name: "प्रिया गुप्ता",
      quote: "आयुर्वेदिक उपायों से जीवन में खुशहाली आई। बहुत उपयोगी पुस्तक।",
      stars: 5,
      location: "मुंबई",
    },
  ],
};

export function usePageContent() {
  const { actor, isFetching } = useActor();
  return useQuery<PageContent>({
    queryKey: ["pageContent"],
    queryFn: async () => {
      if (!actor) return DEFAULT_CONTENT;
      try {
        const data = await actor.getPageContent();
        // If hero section is empty, use defaults
        if (!data.heroSection.bookTitle) return DEFAULT_CONTENT;
        return data;
      } catch {
        return DEFAULT_CONTENT;
      }
    },
    enabled: !isFetching,
    staleTime: 30_000,
    placeholderData: DEFAULT_CONTENT,
  });
}

export function useUpdateHeroSection() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (hero: HeroSection) => actor!.updateHeroSection(hero),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["pageContent"] }),
  });
}

export function useUpdateFeaturesSection() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (features: FeaturesSection) =>
      actor!.updateFeaturesSection(features),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["pageContent"] }),
  });
}

export function useUpdatePricingSection() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (pricing: PricingSection) =>
      actor!.updatePricingSection(pricing),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["pageContent"] }),
  });
}

export function useReplaceTestimonials() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (testimonials: Testimonial[]) =>
      actor!.replaceAllTestimonials(testimonials),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["pageContent"] }),
  });
}

export function useUpdateEbookCover() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (url: string) => actor!.updateEbookCoverImageUrl(url),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["pageContent"] }),
  });
}
