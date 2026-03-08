# Sambhog Sukh eBook Landing Page

## Current State
New project -- no existing code.

## Requested Changes (Diff)

### Add
- Full landing page for eBook "Sambhog Sukh" (सम्भोग सुख)
- Hero section: teal (#008080) background, eBook cover mockup on right, headline + subheadline on left, orange CTA button
- Features section: white/cream background, 4 green checkmark bullet points listing benefits, right side couple lifestyle image
- Bonus/chapter dot-point list below checkmarks (4 items)
- Testimonial section: 2 testimonial cards with name, quote, star rating
- Pricing section: "Ord Price: ₹299" with strikethrough, special price field, QR code placeholder image, UPI payment icons (GPay, PhonePe, Paytm)
- Prominent orange "Buy Now" button linking to UPI payment
- All text and images must be editable inline via an admin/edit mode toggle

### Modify
- N/A (new project)

### Remove
- N/A (new project)

## Implementation Plan
1. Generate eBook cover image (Hindi title, ayurvedic/medical aesthetic)
2. Generate couple lifestyle image for features section
3. Backend: store editable page content (text fields, image URLs) so admin can update
4. Frontend: pixel-faithful recreation of reference layout
   - Hero: teal bg, left text + CTA, right eBook mockup
   - Orange divider banner strip
   - Features: checkmarks left, couple image right, dot-point bonuses
   - Pricing card: QR left, price + UPI icons center/right
   - Buy Now CTA button
   - Testimonial section
5. Edit mode: clicking "Edit" lets admin update any text field or swap images inline
6. All colors: teal (#008080), orange (#FF8C00), white/cream backgrounds
