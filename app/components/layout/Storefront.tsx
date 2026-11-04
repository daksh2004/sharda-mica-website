import {
  IconArrowUpRight,
  IconBrandWhatsapp,
  IconLock,
  IconMenu2,
  IconMessageCircle,
  IconPhone,
  IconShoppingBag,
  IconX,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router";

import {
  EnquiryCartProvider,
  STORE,
  products,
  categories,
  whatsappHref,
} from "@/lib/store";
import { useEnquiryCart } from "@/lib/store";

const links = [
  { to: "/", label: "Home" },
  { to: "/products", label: "Products" },
  { to: "/kitchen-hardware", label: "Modular Kitchen & Hardware" },
  { to: "/contact", label: "Contact" },
];
export function StorefrontLayout({ children }: { children: React.ReactNode }) {
  return (
    <EnquiryCartProvider>
      <StorefrontFrame>{children}</StorefrontFrame>
    </EnquiryCartProvider>
  );
}
function StorefrontFrame({ children }: { children: React.ReactNode }) {
  const { count } = useEnquiryCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  useEffect(() => setMobileOpen(false), [location.pathname]);
  return (
    <div className="min-h-screen min-h-[100dvh] w-full min-w-0 overflow-x-clip bg-[#fffdf5] text-[#292b25]">
      <div className="bg-[#34452e] px-4 py-2 text-center text-xs text-white sm:text-left">
        <div className="mx-auto flex w-full min-w-0 max-w-7xl flex-col items-center justify-center gap-x-5 gap-y-1 sm:flex-row sm:flex-wrap sm:justify-between">
          <span>Serving Jabalpur for 30+ years</span>
          <span className="flex w-full min-w-0 max-w-full flex-wrap items-center justify-center gap-x-3 gap-y-1 sm:w-auto">
            <a href="tel:+919424312979" className="max-w-full break-words hover:underline">
              Mobile: {STORE.mobile}
            </a>
            <a href="tel:+919039012979" className="max-w-full break-words hover:underline">
              Additional mobile: {STORE.alternateMobile}
            </a>
            <a
              href="mailto:shardamica@gmail.com"
              className="hidden hover:underline sm:inline"
            >
              shardamica@gmail.com
            </a>
          </span>
        </div>
      </div>
      <header className="sticky top-0 z-30 border-b border-[#e9e4d7] bg-[#fffdf5]/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <Link
            to="/"
            className="flex items-center gap-3"
            aria-label="Sharda Mica Palace home"
          >
            <img
              src="/brand/sharda-mica-palace-logo.png"
              alt="Sharda Mica Palace"
              className="h-12 w-32 object-contain sm:w-40"
            />
          </Link>
          <nav
            className="hidden items-center gap-7 md:flex"
            aria-label="Main navigation"
          >
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === "/"}
                className={({ isActive }) =>
                  `text-sm transition hover:text-[#745a32] ${isActive ? "font-semibold text-[#34452e]" : "text-[#65665f]"}`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Link
              to="/cart"
              className="relative inline-flex h-10 items-center gap-2 rounded-md border border-[#d8d2c4] px-3 text-sm font-semibold text-[#34452e] hover:bg-[#f5f1e7]"
              aria-label={`Enquiry cart, ${count} items`}
            >
              <IconShoppingBag size={18} />
              <span className="hidden sm:inline">Enquiry</span>
              <span className="flex min-w-5 items-center justify-center rounded-full bg-[#34452e] px-1 text-xs text-white">
                {count}
              </span>
            </Link>
            <button
              className="inline-flex size-10 items-center justify-center rounded-md border border-[#d8d2c4] md:hidden"
              aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((v) => !v)}
            >
              {mobileOpen ? <IconX size={20} /> : <IconMenu2 size={20} />}
            </button>
          </div>
        </div>
        {mobileOpen && (
          <nav
            className="border-t border-[#e9e4d7] bg-[#fffdf5] px-4 py-3 md:hidden"
            aria-label="Mobile navigation"
          >
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === "/"}
                className="block rounded px-3 py-3 text-sm font-medium text-[#34452e] hover:bg-[#f5f1e7]"
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        )}
      </header>
      <main>{children}</main>
      <footer className="mt-16 bg-[#263421] text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
          <div>
            <Link to="/" className="inline-flex rounded bg-[#fffdf5] p-2">
              <img
                src="/brand/sharda-mica-palace-logo.png"
                alt="Sharda Mica Palace"
                className="h-20 w-44 object-contain"
                loading="lazy"
              />
            </Link>
            <p className="mt-3 max-w-xs text-sm leading-6 text-white/70">
              Plywood, laminates, doors, carpentry materials, and modular kitchen
              accessories in Jabalpur.
            </p>
            <p className="mt-3 text-sm text-[#e8d9b4]">
              Retail & wholesale · 30+ years
            </p>
          </div>
          <div>
            <h2 className="text-sm font-bold">Explore</h2>
            <div className="mt-3 grid gap-2 text-sm text-white/75">
              <Link to="/products">Products</Link>
              <Link to="/kitchen-hardware">Modular Kitchen & Carpentry Materials</Link>
              <Link to="/about">About Us</Link>
              <Link to="/contact">Contact Us</Link>
            </div>
          </div>
          <div>
            <h2 className="text-sm font-bold">Information</h2>
            <div className="mt-3 grid gap-2 text-sm text-white/75">
              <Link to="/privacy">Privacy Policy</Link>
              <Link to="/terms">Terms & Conditions</Link>
              <Link
                to="/admin"
                className="inline-flex items-center gap-1.5 hover:text-white"
                aria-label="Admin preview, sign-in required"
              >
                <IconLock size={14} stroke={1.8} aria-hidden="true" />
                Admin preview
              </Link>
            </div>
          </div>
          <div>
            <h2 className="text-sm font-bold">Visit or contact</h2>
            <p className="mt-3 text-sm leading-6 text-white/75">
              {STORE.address}
            </p>
            <a
              className="mt-2 block text-sm text-white/90"
              href="tel:+917614921170"
            >
              Tel: {STORE.phone}
            </a>
            <a
              className="mt-1 block text-sm text-white/90"
              href="tel:+919424312979"
            >
              Mobile: {STORE.mobile}
            </a>
            <a
              className="mt-1 block text-sm text-white/90"
              href="tel:+919039012979"
            >
              Additional mobile: {STORE.alternateMobile}
            </a>
            <a
              className="mt-1 block text-sm text-white/90"
              href="mailto:shardamica@gmail.com"
            >
              {STORE.email}
            </a>
          </div>
        </div>
        <div className="border-t border-white/15 px-4 py-4 text-center text-xs text-white/55">
          © {new Date().getFullYear()} Sharda Mica Palace · Jabalpur, Madhya
          Pradesh
        </div>
      </footer>
      <AssistantWidget />
    </div>
  );
}

function AssistantWidget() {
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState("");

  const [history, setHistory] = useState<{ q: string; a: string }[]>([]);
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  function respond(q: string) {
    const normalized = q.toLowerCase();
    let response =
      "I can help you browse our product categories or prepare an enquiry. Current prices, stock, sizes and specifications are confirmed by the store.";
    if (/price|cost|stock|available|availability/.test(normalized))
      response =
        "Our website does not have confirmed live prices or stock. Add the item to your enquiry cart and ask Sharda Mica Palace to confirm current pricing and availability.";
    else if (
      /plywood|board|laminate|sunmica|door|hinge|basket|chimney|hob|adhesive|fevicol|hardware/.test(
        normalized,
      )
    ) {
      const p = products.filter((x) =>
        normalized
          .split(/\W+/)
          .some(
            (term) =>
              term.length > 3 &&
              (x.name.toLowerCase().includes(term) ||
                x.category.toLowerCase().includes(term)),
          ),
      );
      response = p.length
        ? `You can browse ${[...new Set(p.map((x) => x.category))].join(", ")} in our catalog. Product details and current options can be confirmed by the store.`
        : "We carry plywood, laminates, doors, carpentry materials, modular kitchen accessories and wood adhesives. Please contact the store to confirm a specific item.";
    } else if (/wholesale|bulk|contractor/.test(normalized))
      response =
        "Retail and wholesale enquiries are welcome. Share your product and quantity requirements through our contact form or WhatsApp.";
    else if (/contact|phone|address|location/.test(normalized))
      response = `${STORE.address}. Phone ${STORE.phone}; mobile numbers ${STORE.mobile} and ${STORE.alternateMobile}.`;
    setHistory((h) => [...h, { q, a: response }]);
    setQuestion("");
  }
  return (
    <>
      <button
        onClick={() => setOpen((v) => !v)}
        className="storefront-assistant-trigger fixed z-40 flex items-center gap-2 rounded-full bg-[#34452e] px-4 py-3 text-sm font-semibold text-white shadow-lg hover:bg-[#263421] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c8a779]"
        aria-expanded={open}
        aria-controls="sharda-assistant"
      >
        <IconMessageCircle size={19} />
        <span className="hidden sm:inline">How can we help?</span>
        <span className="sm:hidden">Help</span>
      </button>
      {open && (
        <section
          id="sharda-assistant"
          role="dialog"
          aria-label="Sharda Assistant"
          className="storefront-assistant-panel fixed z-40 flex max-h-[70dvh] flex-col overflow-hidden rounded-xl border border-[#d9d1bf] bg-[#fffdf5] shadow-2xl"
        >
          <div className="flex items-center justify-between bg-[#34452e] px-4 py-3 text-white">
            <div>
              <h2 className="font-semibold">Sharda Assistant</h2>
              <p className="text-xs text-white/70">
                Product and store information
              </p>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close assistant"
              className="rounded p-1 hover:bg-white/10"
            >
              <IconX size={18} />
            </button>
          </div>
          <div className="flex-1 space-y-3 overflow-auto p-4 text-sm">
            <p className="rounded-lg bg-[#f3efdf] p-3">
              Namaste! Welcome to Sharda Mica Palace. How can we help you today?
              Ask about plywood, laminates, doors, carpentry materials, modular kitchen
              accessories or wholesale enquiries.
            </p>
            {history.map((item, i) => (
              <div key={i} className="space-y-2">
                <p className="ml-8 rounded-lg bg-[#e7ebdf] p-3">{item.q}</p>
                <p className="rounded-lg bg-[#f3efdf] p-3">{item.a}</p>
              </div>
            ))}

            <div className="flex flex-wrap gap-2">
              {[
                "Plywood & laminates",
                "Modular Kitchen accessories",
                "Wholesale enquiry",
                "Contact the store",
              ].map((text) => (
                <button
                  key={text}
                  onClick={() => respond(text)}
                  className="rounded-full border border-[#c9cdbf] px-3 py-1.5 text-xs text-[#34452e] hover:bg-[#f3efdf]"
                >
                  {text}
                </button>
              ))}
            </div>
            <p className="text-xs text-[#77786f]">
              This local guide uses the product information on this site. It
              does not check live inventory or send enquiries.
            </p>
          </div>
          <form
            className="flex gap-2 border-t border-[#e5dfd1] p-3"
            onSubmit={(e) => {
              e.preventDefault();
              if (question.trim()) respond(question.trim());
            }}
          >
            <input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              aria-label="Ask Sharda Assistant"
              placeholder="Ask about products…"
              className="min-w-0 flex-1 rounded-md border border-[#d9d1bf] bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#78945a]"
            />
            <button className="rounded-md bg-[#34452e] px-3 text-sm font-semibold text-white">
              Ask
            </button>
          </form>
          <div className="flex justify-between border-t border-[#e5dfd1] px-4 py-2 text-xs">
            <a
              href="tel:+919424312979"
              className="inline-flex items-center gap-1 text-[#34452e]"
            >
              <IconPhone size={14} />
              Call
            </a>
            <a
              href={whatsappHref(
                "Namaste, I have a question for Sharda Mica Palace.",
              )}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-[#34452e]"
            >
              <IconBrandWhatsapp size={14} />
              WhatsApp
              <IconArrowUpRight size={12} />
            </a>
          </div>
        </section>
      )}
    </>
  );
}





