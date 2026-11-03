import { Link } from "react-router";

import { STORE } from "@/lib/store";
export function meta() {
  return [
    { title: "Privacy Policy | Sharda Mica Palace" },
    {
      name: "description",
      content:
        "Privacy information for browsing Sharda Mica Palace's product enquiry website.",
    },
  ];
}
export default function PrivacyPage() {
  return (
    <article className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
      <nav className="mb-6 text-xs text-[#77786f]">
        <Link to="/">Home</Link>
        <span className="px-2">/</span>Privacy Policy
      </nav>
      <p className="text-xs font-bold uppercase tracking-[.16em] text-[#745a32]">
        Website information
      </p>
      <h1 className="mt-2 font-serif text-4xl font-semibold text-[#34452e]">
        Privacy Policy
      </h1>
      <p className="mt-3 text-sm text-[#77786f]">
        Draft for business review · Updated October 2026
      </p>
      <div className="mt-8 space-y-7 text-sm leading-6 text-[#55574f]">
        <section>
          <h2 className="font-serif text-xl font-semibold text-[#34452e]">
            Browsing and enquiry cart
          </h2>
          <p className="mt-2">
            You can browse this website without creating an account. If you add
            products to the enquiry cart, the site stores product IDs,
            quantities and any specifications or notes you enter in local
            browser storage so the cart can remain available on your next visit.
            You can remove items or clear the cart on the Enquiry Cart page, or
            clear this site's browser data. If browser storage is unavailable,
            the cart works for the current session and may not persist after you
            close the browser.
          </p>
        </section>
        <section>
          <h2 className="font-serif text-xl font-semibold text-[#34452e]">
            WhatsApp and contact
          </h2>
          <p className="mt-2">
            When you submit the contact form, the name, mobile number, customer
            type and enquiry details you provide are saved in the store inbox so
            the team can review and respond. If you opt in, product and cart
            WhatsApp handoff requests also save the requested products and any
            notes you type. Avoid putting your name or phone in product notes;
            use the contact form to send those details. A saved request is not
            a confirmed order or proof that a WhatsApp message was sent. You review and send the WhatsApp draft
            yourself, and information sent through WhatsApp is handled under
            WhatsApp's own policies.
          </p>
        </section>
        <section>
          <h2 className="font-serif text-xl font-semibold text-[#34452e]">
            Services and customer records
          </h2>
          <p className="mt-2">
            This website does not provide customer accounts, accept payments,
            confirm live inventory or prices, or record orders. Saved enquiry
            details are visible only to the authorized store admin account. The
            Sharda Assistant is a local FAQ and category guide; it does not send
            your question to an AI service or check live inventory. No
            advertising analytics or third-party error-monitoring service is
            configured in this storefront.
          </p>
        </section>
        <section>
          <h2 className="font-serif text-xl font-semibold text-[#34452e]">
            Your choices and questions
          </h2>
          <p className="mt-2">
            You can clear your local cart at any time. For privacy questions or
            a request about a saved enquiry, contact Sharda Mica Palace at{" "}
            <a className="underline" href={`mailto:${STORE.email}`}>
              {STORE.email}
            </a>{" "}
            or at {STORE.address}.
          </p>
        </section>
        <p className="border-l-2 border-[#c8a779] bg-[#f7f2e6] p-4 text-xs">
          This practical draft should be reviewed by the business before
          publication.
        </p>
      </div>
    </article>
  );
}
