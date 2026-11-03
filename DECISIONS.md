# Project decisions

The original interaction and authentication decisions were superseded by the user's storefront brief. This app is a public, guest-first retail and wholesale enquiry website. Product enquiries use a browser-local cart and a customer-reviewed WhatsApp draft; the storefront does not require sign-in.

## Interaction model

- Public website routes provide the primary customer experience.
- Sharda Assistant is a local FAQ and navigation fallback until an AI provider is actually configured for customer support.

## Authentication

- Guest browsing, product search, enquiry cart and WhatsApp contact remain public.
- Do not add or require accounts for storefront use.
