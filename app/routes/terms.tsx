import { Link } from "react-router";

import { STORE } from "@/lib/store";
export function meta() {
  return [
    { title: "Terms & Conditions | Sharda Mica Palace" },
    {
      name: "description",
      content:
        "Draft terms for enquiries and product information from Sharda Mica Palace.",
    },
  ];
}
const sections = [
  [
    "Product information and specifications",
    "Product descriptions on this website are general category information. Designs, dimensions, specifications, brands and product options should be confirmed with Sharda Mica Palace before purchase.",
  ],
  [
    "Prices and availability",
    "Prices and availability are not confirmed on this website. Any quotation is subject to confirmation by the store and may depend on the requested product and quantity.",
  ],
  [
    "Retail and wholesale quotations",
    "Customers may request retail or wholesale pricing through WhatsApp or the contact details on this website. A request for a quote does not create a confirmed order.",
  ],
  [
    "Order confirmation",
    "An order is confirmed only after the store and customer agree on the products, specifications, price and other applicable details directly.",
  ],
  [
    "Delivery or collection",
    "Delivery and collection arrangements, including timing and charges if applicable, should be confirmed with the store at the time of order.",
  ],
  [
    "Returns, exchanges and warranty",
    "Returns, exchanges and any applicable manufacturer warranty or claim process must be discussed with the store and confirmed for the specific product before purchase. No policy or coverage is promised by this draft.",
  ],
  [
    "Contact",
    "For questions, contact Sharda Mica Palace at {STORE.address}, telephone {STORE.phone}, mobile {STORE.mobile}, additional mobile {STORE.alternateMobile}, or {STORE.email}.",
  ],
];
export default function TermsPage() {
  return (
    <article className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
      <nav className="mb-6 text-xs text-[#77786f]">
        <Link to="/">Home</Link>
        <span className="px-2">/</span>Terms & Conditions
      </nav>
      <p className="text-xs font-bold uppercase tracking-[.16em] text-[#745a32]">
        Website information
      </p>
      <h1 className="mt-2 font-serif text-4xl font-semibold text-[#34452e]">
        Terms & Conditions
      </h1>
      <p className="mt-3 text-sm text-[#77786f]">
        Initial draft for owner review · Not legal advice
      </p>
      <div className="mt-8 space-y-6 text-sm leading-6 text-[#55574f]">
        {sections.map(([title, body]) => (
          <section key={title}>
            <h2 className="font-serif text-xl font-semibold text-[#34452e]">
              {title}
            </h2>
            <p className="mt-2">
              {body
                .replace("{STORE.address}", STORE.address)
                .replace("{STORE.phone}", STORE.phone)
                .replace("{STORE.mobile}", STORE.mobile)
                .replace("{STORE.alternateMobile}", STORE.alternateMobile)
                .replace("{STORE.email}", STORE.email)}
            </p>
          </section>
        ))}
      </div>
      <p className="mt-8 border-l-2 border-[#c8a779] bg-[#f7f2e6] p-4 text-xs leading-5 text-[#5e5c53]">
        These terms are an editable starting point and require review and
        approval by the business before publication. Product-specific return,
        exchange and warranty conditions should be confirmed with the owner.
      </p>
    </article>
  );
}
