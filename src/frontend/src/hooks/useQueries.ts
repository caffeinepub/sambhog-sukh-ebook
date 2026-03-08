import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  FeaturesSection,
  HeroSection,
  PageContent,
  PricingSection,
  Testimonial,
} from "../backend.d";

const STORAGE_KEY = "sambhog_sukh_page_content";

const DEFAULT_CONTENT: PageContent = {
  heroSection: {
    bookTitle: "सम्भोग सुख",
    subtitle: "पूर्ण मार्गदर्शिका: वैवाहिक जीवन के आयुर्वेदिक और प्राकृतिक रहस्य",
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
    lifestyleImageUrl: "/assets/uploads/received_4442140009374418-1.jpeg",
    bonusItems: [
      "बोनस: विशेष आयुर्वेदिक नुस्खे",
      "बोनस: 30 दिन का प्लान",
      "बोनस: विशेषज्ञ सलाह गाइड",
      "बोनस: आजीवन अपडेट",
    ],
  },
  ebookCoverImageUrl: "/assets/uploads/1772906864272-1-1.png",
  pricingSection: {
    originalPrice: BigInt(199),
    discountedPrice: BigInt(49),
    upiLink: "healthgyan1@ybl",
    qrCodeImageUrl: "/assets/uploads/Screenshot_2026_0308_113647-2.jpg",
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

// ─── LocalStorage helpers ────────────────────────────────────────────────────

function loadFromStorage(): PageContent | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    // Restore BigInt fields
    parsed.pricingSection.originalPrice = BigInt(
      parsed.pricingSection.originalPrice,
    );
    parsed.pricingSection.discountedPrice = BigInt(
      parsed.pricingSection.discountedPrice,
    );
    return parsed as PageContent;
  } catch {
    return null;
  }
}

function saveToStorage(content: PageContent): void {
  try {
    // Serialize BigInt as string for JSON
    const serializable = {
      ...content,
      pricingSection: {
        ...content.pricingSection,
        originalPrice: Number(content.pricingSection.originalPrice),
        discountedPrice: Number(content.pricingSection.discountedPrice),
      },
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(serializable));
  } catch {
    // ignore storage errors
  }
}

// ─── Hooks ───────────────────────────────────────────────────────────────────

export function usePageContent() {
  return useQuery<PageContent>({
    queryKey: ["pageContent"],
    queryFn: async () => {
      const stored = loadFromStorage();
      if (stored?.heroSection?.bookTitle) {
        // Always use the latest default images and UPI from code
        return {
          ...stored,
          ebookCoverImageUrl: DEFAULT_CONTENT.ebookCoverImageUrl,
          featuresSection: {
            ...stored.featuresSection,
            lifestyleImageUrl:
              DEFAULT_CONTENT.featuresSection.lifestyleImageUrl,
          },
          pricingSection: {
            ...stored.pricingSection,
            qrCodeImageUrl: DEFAULT_CONTENT.pricingSection.qrCodeImageUrl,
            upiLink: DEFAULT_CONTENT.pricingSection.upiLink,
          },
        };
      }
      return DEFAULT_CONTENT;
    },
    staleTime: Number.POSITIVE_INFINITY,
    placeholderData: DEFAULT_CONTENT,
  });
}

export function useUpdateHeroSection() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (hero: HeroSection) => {
      const current =
        qc.getQueryData<PageContent>(["pageContent"]) ?? DEFAULT_CONTENT;
      const updated = { ...current, heroSection: hero };
      saveToStorage(updated);
      qc.setQueryData(["pageContent"], updated);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["pageContent"] }),
  });
}

export function useUpdateFeaturesSection() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (features: FeaturesSection) => {
      const current =
        qc.getQueryData<PageContent>(["pageContent"]) ?? DEFAULT_CONTENT;
      const updated = { ...current, featuresSection: features };
      saveToStorage(updated);
      qc.setQueryData(["pageContent"], updated);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["pageContent"] }),
  });
}

export function useUpdatePricingSection() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (pricing: PricingSection) => {
      const current =
        qc.getQueryData<PageContent>(["pageContent"]) ?? DEFAULT_CONTENT;
      const updated = { ...current, pricingSection: pricing };
      saveToStorage(updated);
      qc.setQueryData(["pageContent"], updated);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["pageContent"] }),
  });
}

export function useReplaceTestimonials() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (testimonials: Testimonial[]) => {
      const current =
        qc.getQueryData<PageContent>(["pageContent"]) ?? DEFAULT_CONTENT;
      const updated = { ...current, testimonials };
      saveToStorage(updated);
      qc.setQueryData(["pageContent"], updated);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["pageContent"] }),
  });
}

export function useUpdateEbookCover() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (url: string) => {
      const current =
        qc.getQueryData<PageContent>(["pageContent"]) ?? DEFAULT_CONTENT;
      const updated = { ...current, ebookCoverImageUrl: url };
      saveToStorage(updated);
      qc.setQueryData(["pageContent"], updated);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["pageContent"] }),
  });
}
