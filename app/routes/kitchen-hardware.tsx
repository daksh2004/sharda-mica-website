import {
  IconArrowRight,
  IconDoor,
  IconTools,
  IconToolsKitchen2,
} from "@tabler/icons-react";
import { useState } from "react";
import { Link } from "react-router";

import { ProductPhotoViewer } from "@/components/layout/ProductPhotoViewer";
import {
  categories,
  useCatalogProducts,
  useEnquiryCart,
} from "@/lib/store";
import type { Product } from "@/lib/store";

export function meta() {
  return [
    { title: "Modular Kitchen & Carpentry Materials | Sharda Mica Palace" },
    {
      name: "description",
      content:
        "Browse modular kitchen accessories, wire baskets, tandem boxes, louvers and carpentry materials in Jabalpur.",
    },
  ];
}

export default function KitchenHardwarePage() {
  const cart = useEnquiryCart();
  const [notice, setNotice] = useState("");
  const products = useCatalogProducts();
  const modularKitchenProducts = products.filter(
    (item) => item.category === "Modular Kitchen",
  );
  const carpenterHardwareProducts = products.filter(
    (item) => item.category === "Carpentry Materials",
  );

  function addToEnquiry(productName: string, productId: string) {
    cart.add(productId);
    setNotice(productName + " added to your enquiry cart.");
    window.setTimeout(() => setNotice(""), 3500);
  }

  return (
    <>
      <section className="bg-[#f4f1e6]">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 sm:py-16 md:grid-cols-[1.1fr_.9fr] md:items-center">
          <div>
            <nav className="mb-5 text-xs text-[#77786f]">
              <Link to="/">Home</Link>
              <span className="px-2">/</span>Modular Kitchen & Hardware
            </nav>
            <p className="text-xs font-bold uppercase tracking-[.16em] text-[#745a32]">
              Modular kitchen · carpentry materials
            </p>
            <h1 className="mt-3 max-w-xl font-serif text-4xl font-semibold leading-tight text-[#34452e] sm:text-5xl">
              The Details That Complete Every Interior.
            </h1>
            <p className="mt-4 max-w-xl text-base leading-7 text-[#55574f]">
              Explore modular kitchen storage, fittings, shutters, louvers and
              carpentry materials from Sharda Mica Palace, Jabalpur.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a
                href="#modular-kitchen"
                className="bg-[#34452e] px-5 py-3 text-sm font-semibold text-white"
              >
                Explore Modular Kitchen
              </a>
              <a
                href="#carpenter-hardware"
                className="border border-[#9ca28f] bg-[#fffdf5] px-5 py-3 text-sm font-semibold text-[#34452e]"
              >
                Browse Carpentry Materials
              </a>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex aspect-square flex-col justify-between bg-[#d9ddcc] p-4 sm:p-6">
              <IconToolsKitchen2 size={34} className="text-[#34452e]" />
              <span className="font-serif text-xl font-semibold text-[#34452e]">
                Modular kitchen fittings
              </span>
            </div>
            <div className="mt-8 flex aspect-square flex-col justify-between bg-[#e7d9bd] p-4 sm:p-6">
              <IconDoor size={34} className="text-[#745a32]" />
              <span className="font-serif text-xl font-semibold text-[#34452e]">
                Hardware details
              </span>
            </div>
          </div>
        </div>
      </section>

      {notice && (
        <div
          role="status"
          className="mx-auto mt-4 flex max-w-7xl flex-wrap items-center justify-between gap-3 border-l-2 border-[#78945a] bg-[#eff1e8] px-4 py-2 text-sm text-[#34452e] sm:px-6"
        >
          {notice}
          <Link to="/cart" className="font-semibold underline underline-offset-2">
            Review enquiry ({cart.count})
          </Link>
        </div>
      )}

      <ProductSection
        id="modular-kitchen"
        eyebrow="Modular Kitchen"
        title="Storage, fittings & shutters"
        description="Options depend on current availability. Contact the store to confirm product models and details."
        items={modularKitchenProducts}
        onAdd={addToEnquiry}
      />

      <section id="carpenter-hardware" className="scroll-mt-24 bg-[#f4f1e6]">
        <ProductSection
          id="carpenter-hardware-items"
          eyebrow="Carpentry Materials"
          title="Fittings for furniture and doors"
          description="Explore the supplied hardware photos. Ask the store to confirm the available product options."
          items={carpenterHardwareProducts}
          onAdd={addToEnquiry}
          muted
        />
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="flex flex-col justify-between gap-4 border-l-4 border-[#c8a779] bg-[#fbf8ee] p-6 sm:flex-row sm:items-center">
          <div>
            <h2 className="font-serif text-2xl font-semibold text-[#34452e]">
              Looking for Plywood, Laminates or Doors?
            </h2>
            <p className="mt-1 text-sm text-[#66675f]">
              Browse the full materials collection and prepare an enquiry.
            </p>
          </div>
          <Link
            to={"/products?category=" + encodeURIComponent(categories[0])}
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#34452e] underline underline-offset-4"
          >
            Explore products
            <IconArrowRight size={16} />
          </Link>
        </div>
      </section>
    </>
  );
}

function ProductSection({
  id,
  eyebrow,
  title,
  description,
  items,
  onAdd,
  muted = false,
}: {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  items: Product[];
  onAdd: (name: string, id: string) => void;
  muted?: boolean;
}) {
  return (
    <section
      id={id}
      className={
        "mx-auto max-w-7xl scroll-mt-24 px-4 py-14 sm:px-6" +
        (muted ? " lg:py-16" : "")
      }
    >
      <p className="text-xs font-bold uppercase tracking-[.16em] text-[#745a32]">
        {eyebrow}
      </p>
      <h2 className="mt-2 font-serif text-3xl font-semibold text-[#34452e]">
        {title}
      </h2>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-[#62635c]">
        {description}
      </p>
      <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <article
            key={item.id}
            className="flex flex-col border border-[#e4dfd2] bg-[#fffdf5]"
          >
            <ProductPhotoViewer photos={item.photos} name={item.name} />
            <div className="flex flex-1 flex-col p-5">
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.14em] text-[#8a7752]">
                {muted ? (
                  <IconTools size={16} />
                ) : (
                  <IconToolsKitchen2 size={16} />
                )}
                {item.category}
              </div>
              <h3 className="mt-3 font-serif text-xl font-semibold text-[#34452e]">
                {item.name}
              </h3>
              <p className="mt-2 text-sm leading-5 text-[#66675f]">
                {item.description}
              </p>
              <div className="mt-auto border-t border-[#eee9de] pt-4">
                <p className="text-sm font-semibold text-[#745a32]">
                  Price on Request
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
                  <button
                    onClick={() => onAdd(item.name, item.id)}
                    className="text-sm font-semibold text-[#34452e] underline underline-offset-4"
                  >
                    Add to enquiry
                  </button>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
