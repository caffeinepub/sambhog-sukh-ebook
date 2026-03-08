import Principal "mo:core/Principal";
import Array "mo:core/Array";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";

actor self {
  // Data types
  type HeroSection = {
    bookTitle : Text;
    subtitle : Text;
    tagline : Text;
    ctaButtonText : Text;
    ctaLink : Text;
  };

  type FeaturesSection = {
    checkmarkBullets : [Text];
    bonusItems : [Text];
    lifestyleImageUrl : Text;
  };

  type PricingSection = {
    originalPrice : Nat;
    discountedPrice : Nat;
    upiLink : Text;
    qrCodeImageUrl : Text;
  };

  type Testimonial = {
    name : Text;
    quote : Text;
    stars : Nat8;
    location : ?Text;
  };

  module Testimonial {
    public func compare(testimonial1 : Testimonial, testimonial2 : Testimonial) : Order.Order {
      switch (testimonial1.stars, testimonial2.stars) {
        case (stars1, stars2) {
          if (stars1 < stars2) { #less } else if (stars1 > stars2) { #greater } else {
            switch (testimonial1.name.compare(testimonial2.name)) {
              case (#equal) { testimonial1.quote.compare(testimonial2.quote) };
              case (order) { order };
            };
          };
        };
      };
    };
  };

  type PageContent = {
    heroSection : HeroSection;
    featuresSection : FeaturesSection;
    pricingSection : PricingSection;
    testimonials : [Testimonial];
    ebookCoverImageUrl : Text;
  };

  // Persistent storage
  var pageContent : PageContent = {
    heroSection = {
      bookTitle = "Sambhog Sukh";
      subtitle = "Unlock lasting intimate happiness";
      tagline = "Transform your relationship today";
      ctaButtonText = "Get the eBook";
      ctaLink = "https://example.com/ebook";
    };
    featuresSection = {
      checkmarkBullets = [
        "Expert-approved techniques",
        "Easy-to-follow advice",
        "Science-based approach",
        "Increase intimacy",
      ];
      bonusItems = [
        "Free online consultation",
        "Exclusive video content",
        "Lifetime updates",
        "VIP support",
      ];
      lifestyleImageUrl = "https://example.com/lifestyle.jpg";
    };
    pricingSection = {
      originalPrice = 399;
      discountedPrice = 149;
      upiLink = "upi://pay?pa=example@upi";
      qrCodeImageUrl = "https://example.com/qr.jpg";
    };
    testimonials = [
      {
        name = "Ajay Sharma";
        quote = "This book changed my marriage for the better!";
        stars = 5;
        location = ?"Delhi";
      },
      {
        name = "Meera Patel";
        quote = "Easy to follow and very effective.";
        stars = 4;
        location = ?"Mumbai";
      },
    ];
    ebookCoverImageUrl = "https://example.com/cover.jpg";
  };

  // Admin principal
  let adminPrincipal = Principal.fromActor(self);

  // Query function: Get all page content
  public query ({ caller }) func getPageContent() : async PageContent {
    pageContent;
  };

  // Query function: Get testimonials sorted by stars (highest first)
  public query ({ caller }) func getTestimonialsSortedByStars() : async [Testimonial] {
    pageContent.testimonials.sort().reverse();
  };

  // Admin check helper
  func assertAdmin(caller : Principal) {
    if (caller != adminPrincipal) {
      Runtime.trap("Only the admin can update content");
    };
  };

  // Update Hero section
  public shared ({ caller }) func updateHeroSection(newHero : HeroSection) : async () {
    assertAdmin(caller);
    pageContent := {
      pageContent with
      heroSection = newHero
    };
  };

  // Update Features section
  public shared ({ caller }) func updateFeaturesSection(newFeatures : FeaturesSection) : async () {
    assertAdmin(caller);
    if (newFeatures.checkmarkBullets.size() > 4 or newFeatures.bonusItems.size() > 4) {
      Runtime.trap("Too many items. Max 4 checkmarks and 4 bonuses allowed");
    };
    pageContent := {
      pageContent with
      featuresSection = newFeatures
    };
  };

  // Update Pricing section
  public shared ({ caller }) func updatePricingSection(newPricing : PricingSection) : async () {
    assertAdmin(caller);
    pageContent := {
      pageContent with
      pricingSection = newPricing
    };
  };

  // Add or update a testimonial
  public shared ({ caller }) func addOrUpdateTestimonial(testimonial : Testimonial) : async () {
    assertAdmin(caller);
    let existingIndex = pageContent.testimonials.findIndex(
      func(t) { t.name == testimonial.name }
    );
    pageContent := {
      pageContent with
      testimonials = switch (existingIndex) {
        case (?index) {
          let testimonialArray = pageContent.testimonials.toVarArray<Testimonial>();
          testimonialArray[index] := testimonial;
          testimonialArray.toArray();
        };
        case (null) {
          if (pageContent.testimonials.size() >= 4) {
            Runtime.trap("Maximum 4 testimonials allowed");
          };
          pageContent.testimonials.concat([testimonial]);
        };
      };
    };
  };

  // Delete a testimonial by name
  public shared ({ caller }) func deleteTestimonial(name : Text) : async () {
    assertAdmin(caller);
    let filtered = pageContent.testimonials.filter(
      func(t) { t.name != name }
    );
    if (filtered.size() == pageContent.testimonials.size()) {
      Runtime.trap("Testimonial not found");
    };
    pageContent := {
      pageContent with
      testimonials = filtered;
    };
  };

  // Update eBook cover image URL
  public shared ({ caller }) func updateEbookCoverImageUrl(newUrl : Text) : async () {
    assertAdmin(caller);
    pageContent := {
      pageContent with
      ebookCoverImageUrl = newUrl
    };
  };

  // Admin-only: Replace all testimonials
  public shared ({ caller }) func replaceAllTestimonials(newTestimonials : [Testimonial]) : async () {
    assertAdmin(caller);
    if (newTestimonials.size() > 4) {
      Runtime.trap("Maximum 4 testimonials allowed");
    };
    pageContent := {
      pageContent with
      testimonials = newTestimonials;
    };
  };
};
