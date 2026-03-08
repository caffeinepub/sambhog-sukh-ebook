import { Toaster } from "@/components/ui/sonner";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import type {
  FeaturesSection,
  HeroSection,
  PageContent,
  PricingSection,
  Testimonial,
} from "./backend.d";
import {
  usePageContent,
  useReplaceTestimonials,
  useUpdateFeaturesSection,
  useUpdateHeroSection,
  useUpdatePricingSection,
} from "./hooks/useQueries";

// ─── Helpers ───────────────────────────────────────────────────────────────

function StarRating({ stars, size = 20 }: { stars: number; size?: number }) {
  return (
    <span className="flex gap-0.5" aria-label={`${stars} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <svg
          key={i}
          width={size}
          height={size}
          viewBox="0 0 20 20"
          fill={i <= stars ? "var(--gold-star)" : "oklch(0.85 0 0)"}
          aria-hidden="true"
          role="img"
        >
          <title>{i <= stars ? "Filled star" : "Empty star"}</title>
          <path d="M10 1l2.47 5.01L18 6.91l-4 3.9.94 5.49L10 13.77 5.06 16.3 6 10.81 2 6.91l5.53-.9L10 1z" />
        </svg>
      ))}
    </span>
  );
}

function EditableText({
  value,
  onChange,
  editMode,
  className = "",
  multiline = false,
}: {
  value: string;
  onChange: (v: string) => void;
  editMode: boolean;
  className?: string;
  multiline?: boolean;
}) {
  if (!editMode) {
    return <span className={className}>{value}</span>;
  }
  if (multiline) {
    return (
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${className} bg-transparent border-2 border-dashed border-orange-400 rounded p-1 resize-y w-full outline-none focus:border-teal-600`}
        rows={3}
        style={{
          fontFamily: "inherit",
          fontSize: "inherit",
          lineHeight: "inherit",
        }}
      />
    );
  }
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`${className} bg-transparent border-2 border-dashed border-orange-400 rounded px-1 outline-none focus:border-teal-600 w-full`}
      style={{
        fontFamily: "inherit",
        fontSize: "inherit",
        fontWeight: "inherit",
      }}
    />
  );
}

function EditableImage({
  src,
  alt,
  className = "",
  editMode,
  onChangeUrl,
  imgStyle,
}: {
  src: string;
  alt: string;
  className?: string;
  editMode: boolean;
  onChangeUrl: (url: string) => void;
  imgStyle?: React.CSSProperties;
}) {
  const handleClick = () => {
    if (!editMode) return;
    const url = prompt("Enter new image URL:", src);
    if (url?.trim()) onChangeUrl(url.trim());
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") handleClick();
  };

  if (!editMode) {
    return <img src={src} alt={alt} className={className} style={imgStyle} />;
  }

  return (
    <button
      type="button"
      className="editable-image-wrapper"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      aria-label={`Change image: ${alt}`}
      style={{
        border: "none",
        background: "none",
        padding: 0,
        cursor: "pointer",
        display: "inline-block",
      }}
    >
      <img src={src} alt={alt} className={className} style={imgStyle} />
      <div className="editable-image-overlay">
        <span>🖼 Change Image URL</span>
      </div>
    </button>
  );
}

// ─── UPI Badges ─────────────────────────────────────────────────────────────

function GPay() {
  return (
    <div
      className="upi-badge"
      style={{ background: "#fff", border: "1px solid #e0e0e0" }}
    >
      <span style={{ fontWeight: 800, fontSize: 13, letterSpacing: "-0.02em" }}>
        <span style={{ color: "#4285F4" }}>G</span>
        <span style={{ color: "#EA4335" }}>o</span>
        <span style={{ color: "#FBBC05" }}>o</span>
        <span style={{ color: "#4285F4" }}>g</span>
        <span style={{ color: "#34A853" }}>l</span>
        <span style={{ color: "#EA4335" }}>e</span>
      </span>
      <span style={{ color: "#1A73E8", fontWeight: 700, fontSize: 14 }}>
        Pay
      </span>
    </div>
  );
}

function PhonePe() {
  return (
    <div className="upi-badge" style={{ background: "#5f259f", color: "#fff" }}>
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="white"
        aria-hidden="true"
        role="img"
      >
        <title>PhonePe icon</title>
        <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8zm-.5-13h-1v7h1v-3h2a2 2 0 0 0 0-4zm0 3v-2h2a1 1 0 0 1 0 2z" />
      </svg>
      <span>PhonePe</span>
    </div>
  );
}

function Paytm() {
  return (
    <div className="upi-badge" style={{ background: "#002970", color: "#fff" }}>
      <span style={{ color: "#00b9f1", fontWeight: 800 }}>pay</span>
      <span style={{ fontWeight: 700 }}>tm</span>
    </div>
  );
}

// ─── Sections ────────────────────────────────────────────────────────────────

interface SectionProps {
  content: PageContent;
  editMode: boolean;
  draft: PageContent;
  setDraft: React.Dispatch<React.SetStateAction<PageContent>>;
}

function HeroSectionComp({ content, editMode, draft, setDraft }: SectionProps) {
  const d = editMode ? draft : content;

  const updateHero = (key: keyof HeroSection, value: string) => {
    setDraft((prev) => ({
      ...prev,
      heroSection: { ...prev.heroSection, [key]: value },
    }));
  };

  return (
    <section
      className="relative overflow-hidden"
      style={{ background: "var(--teal)", minHeight: "520px" }}
    >
      {/* Decorative background circles */}
      <div
        className="absolute opacity-10 rounded-full"
        style={{
          width: 400,
          height: 400,
          background: "white",
          top: -100,
          left: -100,
        }}
      />
      <div
        className="absolute opacity-10 rounded-full"
        style={{
          width: 300,
          height: 300,
          background: "var(--orange)",
          bottom: -50,
          right: -50,
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-16 flex flex-col lg:flex-row items-center gap-12">
        {/* Left: Text Content */}
        <motion.div
          className="flex-1 text-white"
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full text-sm font-semibold"
            style={{
              background: "rgba(255,140,0,0.25)",
              color: "var(--orange-light)",
              border: "1px solid rgba(255,140,0,0.4)",
            }}
          >
            <span>🌿</span>
            <span>आयुर्वेदिक ज्ञान</span>
          </div>

          {/* Book Title */}
          <h1
            className="font-black leading-tight mb-3"
            style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", lineHeight: 1.1 }}
          >
            <EditableText
              value={d.heroSection.bookTitle}
              onChange={(v) => updateHero("bookTitle", v)}
              editMode={editMode}
              className="text-white"
            />
          </h1>

          {/* Tagline */}
          <p
            className="text-xl font-semibold mb-3"
            style={{ color: "var(--orange-light)" }}
          >
            <EditableText
              value={d.heroSection.tagline}
              onChange={(v) => updateHero("tagline", v)}
              editMode={editMode}
              className="italic"
            />
          </p>

          {/* Subtitle */}
          <p
            className="text-base mb-8 leading-relaxed max-w-lg"
            style={{ color: "rgba(255,255,255,0.85)" }}
          >
            <EditableText
              value={d.heroSection.subtitle}
              onChange={(v) => updateHero("subtitle", v)}
              editMode={editMode}
              multiline
            />
          </p>

          {/* CTA */}
          <a
            href={d.heroSection.ctaLink}
            data-ocid="hero.primary_button"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold text-lg text-white transition-all duration-200"
            style={{
              background: "var(--orange)",
              boxShadow: "0 6px 24px rgba(255,140,0,0.45)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.transform =
                "translateY(-3px)";
              (e.currentTarget as HTMLElement).style.boxShadow =
                "0 10px 32px rgba(255,140,0,0.6)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.transform =
                "translateY(0)";
              (e.currentTarget as HTMLElement).style.boxShadow =
                "0 6px 24px rgba(255,140,0,0.45)";
            }}
          >
            <span>
              {editMode ? (
                <input
                  type="text"
                  value={draft.heroSection.ctaButtonText}
                  onChange={(e) => updateHero("ctaButtonText", e.target.value)}
                  className="bg-transparent border-b border-white outline-none text-white font-bold"
                />
              ) : (
                d.heroSection.ctaButtonText
              )}
            </span>
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="white"
              aria-hidden="true"
              role="img"
            >
              <title>Arrow right</title>
              <path d="M10 2l8 8-8 8-1.4-1.4L15.2 11H2V9h13.2L8.6 3.4z" />
            </svg>
          </a>

          {/* Trust indicators */}
          <div
            className="flex flex-wrap gap-4 mt-6 text-sm"
            style={{ color: "rgba(255,255,255,0.7)" }}
          >
            <span className="flex items-center gap-1">✅ 10,000+ पाठक</span>
            <span className="flex items-center gap-1">🔒 सुरक्षित भुगतान</span>
            <span className="flex items-center gap-1">📱 तुरंत डाउनलोड</span>
          </div>
        </motion.div>

        {/* Right: eBook Cover */}
        <motion.div
          className="flex-shrink-0"
          initial={{ opacity: 0, x: 40, rotateY: -25 }}
          animate={{ opacity: 1, x: 0, rotateY: 0 }}
          transition={{ duration: 0.9, ease: "easeOut", delay: 0.2 }}
        >
          <EditableImage
            src={d.ebookCoverImageUrl}
            alt="Sambhog Sukh eBook Cover"
            className="book-3d"
            editMode={editMode}
            onChangeUrl={(url) =>
              setDraft((prev) => ({ ...prev, ebookCoverImageUrl: url }))
            }
            imgStyle={{
              width: 260,
              height: 364,
              objectFit: "cover",
              borderRadius: 8,
            }}
          />
        </motion.div>
      </div>

      {/* Wave Bottom */}
      <div
        style={{
          position: "absolute",
          bottom: -1,
          left: 0,
          width: "100%",
          overflow: "hidden",
          lineHeight: 0,
        }}
      >
        <svg
          viewBox="0 0 1440 80"
          preserveAspectRatio="none"
          style={{ display: "block", width: "100%", height: 60 }}
          aria-hidden="true"
          role="img"
        >
          <title>Wave decoration</title>
          <path
            d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z"
            fill="var(--orange)"
          />
        </svg>
      </div>
    </section>
  );
}

function OrangeDivider({ text }: { text?: string }) {
  return (
    <div
      style={{ background: "var(--orange)", position: "relative", zIndex: 1 }}
      className="py-4 text-center"
    >
      <p className="text-white font-bold text-lg tracking-wide">
        {text ?? "✨ सीमित समय का विशेष ऑफर — आज ही पाएं ₹150 की छूट! ✨"}
      </p>
      <div
        style={{
          position: "absolute",
          bottom: -1,
          left: 0,
          width: "100%",
          overflow: "hidden",
        }}
      >
        <svg
          viewBox="0 0 1440 40"
          preserveAspectRatio="none"
          style={{ display: "block", width: "100%", height: 30 }}
          aria-hidden="true"
          role="img"
        >
          <title>Wave decoration</title>
          <path
            d="M0,20 C480,40 960,0 1440,20 L1440,40 L0,40 Z"
            fill="var(--cream)"
          />
        </svg>
      </div>
    </div>
  );
}

// ─── About The Page Section ──────────────────────────────────────────────────

function AboutSection() {
  const paragraphs = [
    {
      id: "intro",
      type: "intro",
      text: "क्या आप अपने निजी जीवन को फिर से खुशहाल और ऊर्जावान बनाना चाहते हैं?",
    },
    {
      id: "body1",
      type: "body",
      text: "आज की व्यस्त जीवनशैली और तनाव का सबसे बड़ा असर हमारे आपसी रिश्तों और शारीरिक स्वास्थ्य पर पड़ता है। यह ई-बुक विशेष रूप से उन पुरुषों के लिए तैयार की गई है जो बिना किसी हानिकारक दवा के, पूरी तरह प्राकृतिक और वैज्ञानिक तरीके से अपने वैवाहिक जीवन में नया जोश भरना चाहते हैं।",
    },
    {
      id: "h1",
      type: "heading",
      text: "इस ई-बुक में आपको क्या मिलेगा?",
    },
    {
      id: "body2",
      type: "body",
      text: "यह कोई साधारण किताब नहीं है, बल्कि एक व्यापक गाइड है जो आपको सिखाती है:",
    },
    {
      id: "pt1",
      type: "point",
      text: "......मानसिक मजबूती: बिस्तर पर होने वाली घबराहट (Performance Anxiety) को जड़ से खत्म करने के मनोवैज्ञानिक तरीके।",
    },
    {
      id: "pt2",
      type: "point",
      text: "......प्राकृतिक उपचार: आयुर्वेद की प्राचीन वाजीकरण पद्धति का सही उपयोग, जैसे अश्वगंधा और मूसली के लाभ।",
    },
    {
      id: "pt3",
      type: "point",
      text: "......व्यावहारिक तकनीकें: पार्टनर के साथ आपसी तालमेल और संतुष्टि के सही तरीके और फोरप्ले का महत्व।",
    },
    {
      id: "pt4",
      type: "point",
      text: "......डाइट और लाइफस्टाइल: वो खास खाद्य पदार्थ जो प्राकृतिक रूप से आपके शरीर की शक्ति और स्टैमिना को बढ़ाते हैं।",
    },
    {
      id: "h2",
      type: "heading",
      text: "आपको यह गाइड क्यों खरीदनी चाहिए?",
    },
    {
      id: "pt5",
      type: "point",
      text: "100% गोपनीय और सुरक्षित: यह एक डिजिटल PDF है जिसे आप पेमेंट के तुरंत बाद डाउनलोड कर सकते हैं। आपकी जानकारी पूरी तरह प्राइवेट रखी जाती है।",
    },
    {
      id: "pt6",
      type: "point",
      text: ".....सच्ची और सटीक जानकारी: इंटरनेट की आधी-अधूरी और भ्रामक जानकारी के बजाय, यह गाइड विज्ञान और आयुर्वेद पर आधारित है।",
    },
    {
      id: "pt7",
      type: "point",
      text: "......नया आत्मविश्वास: यह गाइड आपको न केवल शारीरिक रूप से बल्कि मानसिक रूप से भी बेहतर महसूस कराएगी, जिससे आपके रिश्तों में नयापन आएगा।",
    },
    {
      id: "offer",
      type: "offer",
      text: "सीमित समय का ऑफर:\nअभी यह संपूर्ण मार्गदर्शिका मात्र ₹49 में उपलब्ध है। अपने और अपने पार्टनर के सुखद भविष्य के लिए आज ही निवेश करें।",
    },
    {
      id: "disclaimer",
      type: "disclaimer",
      text: "(Legal Disclaimer)\nयह ई-बुक केवल शैक्षिक जानकारी प्रदान करने के लिए है।",
    },
  ] as const;

  return (
    <section className="py-14" style={{ background: "var(--cream)" }}>
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* Section Title */}
          <div className="flex items-center gap-3 mb-8">
            <div
              className="w-1 rounded-full"
              style={{ height: 40, background: "var(--teal)" }}
            />
            <h2
              className="text-2xl font-black tracking-wide"
              style={{ color: "var(--teal)" }}
            >
              ABOUT THE PAGE
            </h2>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-card space-y-5">
            {paragraphs.map((para) => {
              if (para.type === "intro") {
                return (
                  <p
                    key={para.id}
                    className="text-lg font-bold leading-relaxed"
                    style={{ color: "var(--teal)" }}
                  >
                    {para.text}
                  </p>
                );
              }
              if (para.type === "heading") {
                return (
                  <p
                    key={para.id}
                    className="text-base font-black pt-2"
                    style={{ color: "var(--orange)" }}
                  >
                    {para.text}
                  </p>
                );
              }
              if (para.type === "point") {
                return (
                  <p
                    key={para.id}
                    className="text-sm leading-relaxed text-gray-700 pl-2 border-l-2"
                    style={{ borderColor: "var(--teal)" }}
                  >
                    {para.text}
                  </p>
                );
              }
              if (para.type === "offer") {
                const [offerTitle, offerBody] = para.text.split("\n");
                return (
                  <div
                    key={para.id}
                    className="rounded-xl p-4 mt-2"
                    style={{
                      background: "oklch(0.96 0.04 50)",
                      border: "1px solid var(--orange)",
                    }}
                  >
                    <p
                      className="text-sm leading-relaxed font-bold mb-1"
                      style={{ color: "var(--orange)" }}
                    >
                      {offerTitle}
                    </p>
                    <p className="text-sm leading-relaxed text-gray-700">
                      {offerBody}
                    </p>
                  </div>
                );
              }
              if (para.type === "disclaimer") {
                const [disclTitle, disclBody] = para.text.split("\n");
                return (
                  <div key={para.id} className="pt-2 border-t border-gray-100">
                    <p className="text-xs leading-relaxed font-semibold text-gray-500 mb-0.5">
                      {disclTitle}
                    </p>
                    <p className="text-xs leading-relaxed text-gray-400">
                      {disclBody}
                    </p>
                  </div>
                );
              }
              // body
              return (
                <p
                  key={para.id}
                  className="text-sm leading-relaxed text-gray-700"
                >
                  {para.text}
                </p>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function FeaturesSectionComp({
  content,
  editMode,
  draft,
  setDraft,
}: SectionProps) {
  const d = editMode ? draft : content;

  const updateBullet = (idx: number, value: string) => {
    const bullets = [...draft.featuresSection.checkmarkBullets];
    bullets[idx] = value;
    setDraft((prev) => ({
      ...prev,
      featuresSection: { ...prev.featuresSection, checkmarkBullets: bullets },
    }));
  };

  const updateBonus = (idx: number, value: string) => {
    const bonuses = [...draft.featuresSection.bonusItems];
    bonuses[idx] = value;
    setDraft((prev) => ({
      ...prev,
      featuresSection: { ...prev.featuresSection, bonusItems: bonuses },
    }));
  };

  return (
    <section
      className="py-16"
      style={{ background: "var(--cream)", paddingTop: "3rem" }}
    >
      <div className="max-w-6xl mx-auto px-6">
        <motion.h2
          className="text-center text-3xl font-black mb-10"
          style={{ color: "var(--teal)" }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          इस पुस्तक में क्या पाएंगे?
        </motion.h2>

        <div className="flex flex-col lg:flex-row gap-8 items-stretch">
          {/* Left: Bullets Card */}
          <motion.div
            className="flex-1 bg-white rounded-2xl p-8 shadow-card"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Green Checkmark Bullets */}
            <div className="mb-6">
              <h3
                className="text-lg font-bold mb-4 pb-2 border-b-2"
                style={{ color: "var(--teal)", borderColor: "var(--teal)" }}
              >
                मुख्य विषय
              </h3>
              <ul className="space-y-4">
                {d.featuresSection.checkmarkBullets.map((bullet, idx) => (
                  <li
                    key={bullet || idx}
                    className="flex items-start gap-3"
                    data-ocid={
                      `features.item.${idx + 1}` as `features.item.${1 | 2 | 3 | 4}`
                    }
                  >
                    <span
                      className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-white text-sm font-bold mt-0.5"
                      style={{ background: "var(--green-check)" }}
                    >
                      ✓
                    </span>
                    <span className="flex-1 font-medium text-gray-700">
                      {editMode ? (
                        <input
                          type="text"
                          value={draft.featuresSection.checkmarkBullets[idx]}
                          onChange={(e) => updateBullet(idx, e.target.value)}
                          className="w-full bg-transparent border-b border-dashed border-orange-300 outline-none focus:border-teal-600"
                        />
                      ) : (
                        bullet
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Divider */}
            <div
              className="my-6 border-t-2 border-dashed"
              style={{ borderColor: "oklch(0.88 0.02 80)" }}
            />

            {/* Bonus Items */}
            <div>
              <h3
                className="text-lg font-bold mb-4"
                style={{ color: "var(--orange)" }}
              >
                🎁 बोनस सामग्री
              </h3>
              <ul className="space-y-3">
                {d.featuresSection.bonusItems.map((bonus, idx) => (
                  <li key={bonus || idx} className="flex items-start gap-3">
                    <span className="text-orange-500 font-bold">◆</span>
                    <span className="text-gray-700">
                      {editMode ? (
                        <input
                          type="text"
                          value={draft.featuresSection.bonusItems[idx]}
                          onChange={(e) => updateBonus(idx, e.target.value)}
                          className="w-full bg-transparent border-b border-dashed border-orange-300 outline-none focus:border-teal-600"
                        />
                      ) : (
                        bonus
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Value badge */}
            <div
              className="mt-6 p-4 rounded-xl text-center font-bold"
              style={{
                background: "oklch(0.96 0.03 195)",
                color: "var(--teal)",
              }}
            >
              💡 कुल मूल्य: ₹1500+ का ज्ञान — मात्र ₹49 में!
            </div>
          </motion.div>

          {/* Right: Lifestyle Image */}
          <motion.div
            className="flex-1 relative"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <EditableImage
              src={d.featuresSection.lifestyleImageUrl}
              alt="Happy couple"
              className="w-full h-full rounded-2xl object-cover"
              editMode={editMode}
              onChangeUrl={(url) =>
                setDraft((prev) => ({
                  ...prev,
                  featuresSection: {
                    ...prev.featuresSection,
                    lifestyleImageUrl: url,
                  },
                }))
              }
              imgStyle={{
                width: "100%",
                height: "100%",
                minHeight: 300,
                objectFit: "cover",
                borderRadius: 16,
              }}
            />
            {/* Overlay badge */}
            <div
              className="absolute bottom-4 left-4 right-4 text-center py-3 rounded-xl font-bold text-white"
              style={{
                background: "rgba(0,128,128,0.85)",
                backdropFilter: "blur(4px)",
              }}
            >
              🌟 हजारों खुश दंपतियों का विश्वास
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function PricingSectionComp({
  content,
  editMode,
  draft,
  setDraft,
}: SectionProps) {
  const d = editMode ? draft : content;

  const updatePrice = (
    key: "originalPrice" | "discountedPrice",
    value: string,
  ) => {
    const num = Number.parseInt(value) || 0;
    setDraft((prev) => ({
      ...prev,
      pricingSection: {
        ...prev.pricingSection,
        [key]: BigInt(num),
      },
    }));
  };

  return (
    <section
      id="pricing"
      className="py-16"
      style={{ background: "var(--cream-dark)" }}
    >
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2
            className="text-center text-3xl font-black mb-2"
            style={{ color: "var(--teal)" }}
          >
            अभी खरीदें
          </h2>
          <p className="text-center mb-10 text-gray-500">
            ✅ तुरंत डाउनलोड · 🔒 सुरक्षित भुगतान · 💯 100% संतुष्टि गारंटी
          </p>

          <div className="bg-white rounded-3xl shadow-card overflow-hidden">
            {/* Top accent */}
            <div style={{ background: "var(--teal)", height: 8 }} />

            <div className="p-8 flex flex-col md:flex-row gap-8 items-center">
              {/* QR Code */}
              <div className="flex-shrink-0 text-center">
                <div
                  className="rounded-2xl p-3 inline-block mb-2"
                  style={{ border: "3px solid var(--teal)" }}
                >
                  <EditableImage
                    src={d.pricingSection.qrCodeImageUrl}
                    alt="Payment QR Code"
                    className="rounded-lg"
                    editMode={editMode}
                    onChangeUrl={(url) =>
                      setDraft((prev) => ({
                        ...prev,
                        pricingSection: {
                          ...prev.pricingSection,
                          qrCodeImageUrl: url,
                        },
                      }))
                    }
                    imgStyle={{ width: 160, height: 160, objectFit: "contain" }}
                  />
                </div>
                <p
                  className="font-bold text-sm"
                  style={{ color: "var(--teal)" }}
                >
                  📱 स्कैन करें और भुगतान करें
                </p>
              </div>

              {/* Pricing Details */}
              <div className="flex-1">
                {/* Original price */}
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-gray-400 text-lg price-strike">
                    मूल मूल्य: ₹
                    {editMode ? (
                      <input
                        type="number"
                        value={Number(draft.pricingSection.originalPrice)}
                        onChange={(e) =>
                          updatePrice("originalPrice", e.target.value)
                        }
                        className="w-20 bg-transparent border-b border-dashed border-orange-300 outline-none text-gray-400"
                      />
                    ) : (
                      String(d.pricingSection.originalPrice)
                    )}
                    /-
                  </span>
                  <span
                    className="text-xs font-bold px-2 py-0.5 rounded-full text-white"
                    style={{ background: "#e53e3e" }}
                  >
                    75% OFF
                  </span>
                </div>

                {/* Special price */}
                <div className="flex items-end gap-2 mb-6">
                  <span
                    className="text-6xl font-black"
                    style={{ color: "var(--teal)" }}
                  >
                    ₹
                    {editMode ? (
                      <input
                        type="number"
                        value={Number(draft.pricingSection.discountedPrice)}
                        onChange={(e) =>
                          updatePrice("discountedPrice", e.target.value)
                        }
                        className="w-24 bg-transparent border-b-2 border-dashed border-teal-500 outline-none text-5xl font-black"
                        style={{ color: "var(--teal)" }}
                      />
                    ) : (
                      String(d.pricingSection.discountedPrice)
                    )}
                    /-
                  </span>
                  <span className="text-gray-500 mb-3 text-sm">
                    केवल (आज का विशेष मूल्य)
                  </span>
                </div>

                {/* UPI Icons */}
                <div className="mb-6">
                  <p className="text-sm text-gray-500 mb-3 font-semibold">
                    UPI से भुगतान करें:
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <GPay />
                    <PhonePe />
                    <Paytm />
                  </div>
                </div>

                {/* UPI ID */}
                <div
                  className="rounded-xl p-3 mb-4 text-center"
                  style={{ background: "oklch(0.96 0.03 195)" }}
                >
                  <p className="text-xs text-gray-500 mb-1">UPI लिंक / आईडी</p>
                  <p className="font-bold" style={{ color: "var(--teal)" }}>
                    {editMode ? (
                      <input
                        type="text"
                        value={draft.pricingSection.upiLink}
                        onChange={(e) =>
                          setDraft((prev) => ({
                            ...prev,
                            pricingSection: {
                              ...prev.pricingSection,
                              upiLink: e.target.value,
                            },
                          }))
                        }
                        className="w-full text-center bg-transparent border-b border-dashed border-teal-400 outline-none font-bold"
                        style={{ color: "var(--teal)" }}
                      />
                    ) : (
                      d.pricingSection.upiLink
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* WhatsApp Footer */}
            <div
              className="mx-8 mb-4 rounded-2xl flex items-center justify-center gap-3 py-4 px-6"
              style={{
                background: "linear-gradient(135deg, #25D366 0%, #128C7E 100%)",
                boxShadow: "0 4px 16px rgba(37,211,102,0.35)",
              }}
            >
              {/* WhatsApp Icon */}
              <svg
                width="32"
                height="32"
                viewBox="0 0 32 32"
                fill="none"
                aria-hidden="true"
                role="img"
                style={{ flexShrink: 0 }}
              >
                <title>WhatsApp</title>
                <circle cx="16" cy="16" r="16" fill="white" fillOpacity="0.2" />
                <path
                  d="M16 5C9.925 5 5 9.925 5 16c0 1.95.525 3.775 1.45 5.35L5 27l5.8-1.425A10.95 10.95 0 0 0 16 27c6.075 0 11-4.925 11-11S22.075 5 16 5zm0 20c-1.725 0-3.35-.45-4.75-1.25l-.35-.2-3.45.9.925-3.35-.225-.375A9 9 0 0 1 7 16c0-4.95 4.05-9 9-9s9 4.05 9 9-4.05 9-9 9zm4.95-6.75c-.275-.125-1.6-.8-1.85-.875-.25-.1-.425-.125-.6.125-.175.25-.7.875-.85 1.05-.15.175-.3.2-.575.075-.275-.125-1.15-.425-2.2-1.35-.825-.725-1.375-1.625-1.525-1.9-.15-.275-.025-.425.125-.55.125-.1.275-.275.425-.425.15-.15.175-.25.275-.425.1-.175.05-.325-.025-.45-.075-.125-.6-1.45-.825-1.975-.225-.525-.45-.45-.6-.45-.15 0-.325-.025-.5-.025s-.45.075-.7.35c-.25.275-.95.925-.95 2.25s.975 2.6 1.1 2.775c.125.175 1.9 2.925 4.625 4.1.65.275 1.15.45 1.55.575.65.2 1.25.175 1.7.1.525-.075 1.6-.65 1.825-1.3.225-.65.225-1.2.15-1.3-.075-.1-.25-.175-.525-.3z"
                  fill="white"
                />
              </svg>
              <p className="text-white font-bold text-base leading-snug">
                अपना भुगतान स्क्रीनशॉट भेजें —{" "}
                <span className="text-yellow-200 font-black text-lg tracking-wide">
                  6006401799
                </span>
              </p>
            </div>

            {/* Buy Now Button */}
            <div className="px-8 pb-8 text-center">
              <a
                href={d.pricingSection.upiLink}
                data-ocid="pricing.buy_now_button"
                className="inline-flex items-center justify-center gap-3 w-full max-w-md py-5 rounded-full font-black text-xl text-white transition-all duration-200"
                style={{
                  background: "var(--orange)",
                  boxShadow: "0 8px 28px rgba(255,140,0,0.5)",
                  letterSpacing: "0.03em",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.transform =
                    "translateY(-3px) scale(1.01)";
                  (e.currentTarget as HTMLElement).style.boxShadow =
                    "0 14px 40px rgba(255,140,0,0.65)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.transform =
                    "translateY(0) scale(1)";
                  (e.currentTarget as HTMLElement).style.boxShadow =
                    "0 8px 28px rgba(255,140,0,0.5)";
                }}
              >
                <span>🛒</span>
                <span>अभी खरीदें — केवल ₹49/-</span>
                <span>→</span>
              </a>
              <p className="mt-3 text-xs text-gray-400">
                💳 सभी UPI, नेट बैंकिंग, कार्ड स्वीकृत हैं
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function TestimonialsSectionComp({
  content,
  editMode,
  draft,
  setDraft,
}: SectionProps) {
  const d = editMode ? draft : content;

  const updateTestimonial = (
    idx: number,
    key: keyof Testimonial,
    value: string | number,
  ) => {
    const testimonials = [...draft.testimonials];
    testimonials[idx] = { ...testimonials[idx], [key]: value };
    setDraft((prev) => ({ ...prev, testimonials }));
  };

  return (
    <section className="py-16" style={{ background: "var(--teal)" }}>
      <div className="max-w-5xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-center text-3xl font-black text-white mb-2">
            हमारे पाठकों की राय
          </h2>
          <p
            className="text-center mb-10"
            style={{ color: "rgba(255,255,255,0.7)" }}
          >
            हजारों संतुष्ट पाठक — यहाँ कुछ अनुभव
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {d.testimonials.map((t, idx) => (
              <motion.div
                key={t.name || idx}
                data-ocid={
                  `testimonial.item.${idx + 1}` as `testimonial.item.${1 | 2}`
                }
                className="bg-white rounded-2xl p-6 shadow-lg"
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
              >
                {/* Stars */}
                <div className="mb-3">
                  {editMode ? (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">Stars:</span>
                      <input
                        type="number"
                        min={1}
                        max={5}
                        value={draft.testimonials[idx]?.stars ?? 5}
                        onChange={(e) =>
                          updateTestimonial(
                            idx,
                            "stars",
                            Number.parseInt(e.target.value),
                          )
                        }
                        className="w-12 border rounded p-1 text-sm"
                      />
                    </div>
                  ) : (
                    <StarRating stars={t.stars} />
                  )}
                </div>

                {/* Quote */}
                <blockquote className="text-gray-700 italic mb-4 leading-relaxed">
                  "
                  {editMode ? (
                    <textarea
                      value={draft.testimonials[idx]?.quote ?? ""}
                      onChange={(e) =>
                        updateTestimonial(idx, "quote", e.target.value)
                      }
                      className="w-full bg-gray-50 border rounded p-2 text-sm resize-none"
                      rows={3}
                    />
                  ) : (
                    t.quote
                  )}
                  "
                </blockquote>

                {/* Name + Location */}
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                    style={{ background: "var(--teal)" }}
                  >
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p
                      className="font-bold text-sm"
                      style={{ color: "var(--teal)" }}
                    >
                      {editMode ? (
                        <input
                          type="text"
                          value={draft.testimonials[idx]?.name ?? ""}
                          onChange={(e) =>
                            updateTestimonial(idx, "name", e.target.value)
                          }
                          className="border-b border-dashed border-teal-300 outline-none bg-transparent font-bold"
                          style={{ color: "var(--teal)" }}
                        />
                      ) : (
                        t.name
                      )}
                    </p>
                    {(t.location || editMode) && (
                      <p className="text-xs text-gray-400">
                        📍{" "}
                        {editMode ? (
                          <input
                            type="text"
                            value={draft.testimonials[idx]?.location ?? ""}
                            onChange={(e) =>
                              updateTestimonial(idx, "location", e.target.value)
                            }
                            className="border-b border-dashed border-gray-300 outline-none bg-transparent text-xs"
                          />
                        ) : (
                          t.location
                        )}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Edit Mode Panel ─────────────────────────────────────────────────────────

interface EditPanelProps {
  editMode: boolean;
  onToggle: () => void;
  onSave: () => void;
  onCancel: () => void;
  isSaving: boolean;
}

function EditPanel({
  editMode,
  onToggle,
  onSave,
  onCancel,
  isSaving,
}: EditPanelProps) {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col items-end gap-2">
      {!editMode ? (
        <button
          type="button"
          data-ocid="edit.toggle_button"
          onClick={onToggle}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full text-white text-sm font-bold shadow-teal transition-all hover:scale-105"
          style={{ background: "var(--teal)" }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="white"
            aria-hidden="true"
            role="img"
          >
            <title>Edit icon</title>
            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
          </svg>
          पेज संपादित करें
        </button>
      ) : (
        <AnimatePresence>
          <motion.div
            key="edit-controls"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-2"
          >
            <button
              type="button"
              data-ocid="edit.cancel_button"
              onClick={onCancel}
              className="px-4 py-2 rounded-full text-sm font-bold bg-white shadow text-gray-700 hover:bg-gray-100 transition-colors"
            >
              रद्द करें
            </button>
            <button
              type="button"
              data-ocid="edit.save_button"
              onClick={onSave}
              disabled={isSaving}
              className="flex items-center gap-2 px-5 py-2 rounded-full text-sm font-bold text-white shadow transition-all"
              style={{ background: "var(--orange)" }}
            >
              {isSaving ? (
                <>
                  <svg
                    className="animate-spin"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="3"
                    aria-hidden="true"
                    role="img"
                  >
                    <title>Loading</title>
                    <circle cx="12" cy="12" r="10" opacity="0.25" />
                    <path d="M12 2a10 10 0 0 1 10 10" />
                  </svg>
                  सहेजा जा रहा है...
                </>
              ) : (
                <>
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="white"
                    aria-hidden="true"
                    role="img"
                  >
                    <title>Save icon</title>
                    <path d="M17 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7l-4-4zm-5 16a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm3-10H5V5h10v4z" />
                  </svg>
                  बदलाव सहेजें
                </>
              )}
            </button>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}

// ─── Admin Auth Modal ─────────────────────────────────────────────────────────

function AdminAuthModal({
  onAuth,
  onClose,
}: {
  onAuth: () => void;
  onClose: () => void;
}) {
  const [pw, setPw] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pw === "admin123") {
      onAuth();
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-2xl p-8 w-full max-w-sm shadow-2xl"
      >
        <h3
          className="text-xl font-black mb-1"
          style={{ color: "var(--teal)" }}
        >
          एडमिन एक्सेस
        </h3>
        <p className="text-gray-500 text-sm mb-5">
          पेज संपादित करने के लिए पासवर्ड दर्ज करें
        </p>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            placeholder="पासवर्ड"
            className={`w-full border-2 rounded-xl px-4 py-3 mb-3 outline-none text-base transition-colors ${
              error
                ? "border-red-400 bg-red-50"
                : "border-gray-200 focus:border-teal-500"
            }`}
          />
          {error && (
            <p className="text-red-500 text-sm mb-3 text-center">
              ❌ गलत पासवर्ड
            </p>
          )}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border-2 border-gray-200 text-gray-600 font-semibold hover:bg-gray-50"
            >
              रद्द करें
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl text-white font-bold"
              style={{ background: "var(--teal)" }}
            >
              प्रवेश करें
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

// ─── Footer ──────────────────────────────────────────────────────────────────

function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer
      className="py-8 text-center"
      style={{
        background: "oklch(0.15 0.02 200)",
        color: "rgba(255,255,255,0.7)",
      }}
    >
      <div className="max-w-4xl mx-auto px-6">
        <p className="font-bold text-white text-lg mb-1">सम्भोग सुख</p>
        <p className="text-sm mb-4" style={{ color: "rgba(255,255,255,0.5)" }}>
          आयुर्वेदिक ज्ञान का डिजिटल संग्रह
        </p>
        <div className="flex flex-wrap justify-center gap-6 text-sm mb-4">
          <span className="hover:text-white transition-colors cursor-pointer">
            गोपनीयता नीति
          </span>
          <span className="hover:text-white transition-colors cursor-pointer">
            सेवा शर्तें
          </span>
          <span className="hover:text-white transition-colors cursor-pointer">
            संपर्क करें
          </span>
          <a
            href="#pricing"
            className="hover:text-white transition-colors"
            style={{ color: "var(--orange-light)" }}
          >
            अभी खरीदें
          </a>
        </div>
        <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
          © {year}. Built with ❤️ using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-white transition-colors"
          >
            caffeine.ai
          </a>
        </p>
      </div>
    </footer>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────

export default function App() {
  const { data: content, isLoading } = usePageContent();
  const [editMode, setEditMode] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [draft, setDraft] = useState<PageContent | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const updateHero = useUpdateHeroSection();
  const updateFeatures = useUpdateFeaturesSection();
  const updatePricing = useUpdatePricingSection();
  const replaceTestimonials = useReplaceTestimonials();

  const handleEditToggle = () => {
    setShowAuthModal(true);
  };

  const handleAuth = () => {
    setShowAuthModal(false);
    if (content) {
      setDraft(JSON.parse(JSON.stringify(content)));
    }
    setEditMode(true);
  };

  const handleCancel = useCallback(() => {
    setEditMode(false);
    setDraft(null);
  }, []);

  const handleSave = useCallback(async () => {
    if (!draft) return;
    setIsSaving(true);
    try {
      await Promise.all([
        updateHero.mutateAsync(draft.heroSection),
        updateFeatures.mutateAsync(draft.featuresSection),
        updatePricing.mutateAsync(draft.pricingSection),
        replaceTestimonials.mutateAsync(draft.testimonials),
      ]);
      toast.success("✅ पृष्ठ सफलतापूर्वक सहेजा गया!");
      setEditMode(false);
      setDraft(null);
    } catch {
      toast.error("❌ सहेजने में त्रुटि। पुनः प्रयास करें।");
    } finally {
      setIsSaving(false);
    }
  }, [draft, updateHero, updateFeatures, updatePricing, replaceTestimonials]);

  const currentContent = editMode && draft ? draft : content;

  if (isLoading || !currentContent) {
    return (
      <div
        className="fixed inset-0 flex items-center justify-center"
        style={{ background: "var(--teal)" }}
      >
        <div className="text-center text-white">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-lg font-semibold">लोड हो रहा है...</p>
        </div>
      </div>
    );
  }

  const sectionProps: SectionProps = {
    content: currentContent,
    editMode,
    draft: draft ?? currentContent,
    setDraft: (updater) => {
      setDraft((prev) => {
        const current = prev ?? currentContent;
        if (typeof updater === "function") {
          return updater(current);
        }
        return updater;
      });
    },
  };

  return (
    <>
      <Toaster position="top-center" richColors />

      {showAuthModal && (
        <AdminAuthModal
          onAuth={handleAuth}
          onClose={() => setShowAuthModal(false)}
        />
      )}

      <EditPanel
        editMode={editMode}
        onToggle={handleEditToggle}
        onSave={handleSave}
        onCancel={handleCancel}
        isSaving={isSaving}
      />

      {/* Edit mode banner */}
      <AnimatePresence>
        {editMode && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="sticky top-0 z-40 text-center py-2 text-sm font-semibold text-white"
            style={{ background: "var(--orange)" }}
          >
            ✏️ संपादन मोड सक्रिय — बदलाव करें और "सहेजें" पर क्लिक करें
          </motion.div>
        )}
      </AnimatePresence>

      <main>
        <HeroSectionComp {...sectionProps} />
        <OrangeDivider />
        <AboutSection />
        <FeaturesSectionComp {...sectionProps} />
        <PricingSectionComp {...sectionProps} />
        <TestimonialsSectionComp {...sectionProps} />
      </main>

      <Footer />
    </>
  );
}
