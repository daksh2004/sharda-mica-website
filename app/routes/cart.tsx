import {
  IconArrowRight,
  IconMinus,
  IconPlus,
  IconShoppingBag,
  IconTrash,
} from "@tabler/icons-react";
import { useState } from "react";
import { Link } from "react-router";
import { actionErrorMessage, useActionMutation } from "@agent-native/core/client/hooks";

import { cartMessage, useCatalogProducts, useEnquiryCart, whatsappHref } from "@/lib/store";
export function meta() {
  return [
    { title: "Enquiry Cart | Sharda Mica Palace" },
    {
      name: "description",
      content:
        "Review your product enquiry and contact Sharda Mica Palace for current pricing and availability.",
    },
  ];
}
export default function CartPage() {
  const cart = useEnquiryCart();
  const products = useCatalogProducts();
  const saveEnquiry = useActionMutation("create-store-enquiry");
  const [consent, setConsent] = useState(false);
  const [savedMessage, setSavedMessage] = useState("");
  const [error, setError] = useState("");
  const lines = cart.lines
    .map((line) => ({
      line,
      product: products.find((p) => p.id === line.productId),
    }))
    .filter((x) => x.product);
  const message = cartMessage(lines.map((x) => x.line), products);
  async function saveCartEnquiry() {
    setError("");
    try {
      await saveEnquiry.mutateAsync({
        source: "cart",
        message,
        consent,
      });
      setSavedMessage(message);
    } catch (caught) {
      setError(actionErrorMessage(caught) ?? "We could not save this enquiry. Please check your connection and try again.");
    }
  }
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
      <nav className="mb-6 text-xs text-[#77786f]">
        <Link to="/">Home</Link>
        <span className="px-2">/</span>Enquiry Cart
      </nav>
      <h1 className="font-serif text-3xl font-semibold text-[#34452e] sm:text-4xl">
        Your Product Enquiry Cart
      </h1>
      <p className="mt-2 text-sm text-[#62635c]">
        Review the items below, save your enquiry to the store inbox, then open its WhatsApp draft.
      </p>
      {!cart.storageAvailable && (
        <p
          role="status"
          className="mt-4 border-l-2 border-[#c8a779] bg-[#f7f2e6] px-3 py-2 text-sm"
        >
          Your enquiry cart is available for this session, but it may not be
          saved after you close the browser.
        </p>
      )}
      {lines.length === 0 ? (
        <div className="mt-10 border border-dashed border-[#d8d1c3] bg-[#faf8f1] px-5 py-14 text-center">
          <IconShoppingBag size={36} className="mx-auto text-[#78945a]" />
          <h2 className="mt-4 font-serif text-2xl font-semibold text-[#34452e]">
            Your enquiry cart is empty.
          </h2>
          <p className="mt-2 text-sm text-[#686960]">
            Explore our plywood, laminates, doors and hardware collection.
          </p>
          <Link
            to="/products"
            className="mt-5 inline-flex items-center gap-2 bg-[#34452e] px-5 py-3 text-sm font-semibold text-white"
          >
            Browse Products
            <IconArrowRight size={16} />
          </Link>
        </div>
      ) : (
        <>
          <div className="mt-8 space-y-4">
            {lines.map(({ line, product }) => (
              <article
                key={line.productId}
                className="grid gap-4 border border-[#e4dfd2] bg-white p-4 sm:grid-cols-[1fr_auto] sm:items-start"
              >
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-[.14em] text-[#8a7752]">
                    {product!.category}
                  </span>
                  <h2 className="mt-1 font-serif text-xl font-semibold text-[#34452e]">
                    {product!.name}
                  </h2>
                  <p className="mt-1 text-sm text-[#66675f]">
                    Price on Request
                  </p>
                  <label className="mt-4 block text-xs font-semibold text-[#55574f]">
                    Specification
                    <input
                      value={line.specification}
                      onChange={(e) =>
                        cart.update(line.productId, {
                          specification: e.target.value,
                        })
                      }
                      placeholder="Optional size, finish or model"
                      className="mt-1 w-full max-w-lg border border-[#ddd7ca] px-3 py-2 text-sm font-normal outline-none focus:border-[#78945a]"
                    />
                  </label>
                  <label className="mt-3 block text-xs font-semibold text-[#55574f]">
                    Requirement notes
                    <textarea
                      rows={2}
                      value={line.notes}
                      onChange={(e) =>
                        cart.update(line.productId, { notes: e.target.value })
                      }
                      placeholder="Optional notes"
                      className="mt-1 w-full max-w-lg border border-[#ddd7ca] px-3 py-2 text-sm font-normal outline-none focus:border-[#78945a]"
                    />
                  </label>
                </div>
                <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end">
                  <div className="flex items-center border border-[#ddd7ca]">
                    <button
                      onClick={() =>
                        cart.update(line.productId, {
                          quantity: line.quantity - 1,
                        })
                      }
                      aria-label={`Decrease ${product!.name} quantity`}
                      disabled={line.quantity <= 1}
                      className="p-2 disabled:opacity-40"
                    >
                      <IconMinus size={15} />
                    </button>
                    <span className="min-w-8 text-center text-sm">
                      {line.quantity}
                    </span>
                    <button
                      onClick={() =>
                        cart.update(line.productId, {
                          quantity: line.quantity + 1,
                        })
                      }
                      aria-label={`Increase ${product!.name} quantity`}
                      className="p-2"
                    >
                      <IconPlus size={15} />
                    </button>
                  </div>
                  <button
                    onClick={() => cart.remove(line.productId)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#785339] underline underline-offset-2"
                  >
                    <IconTrash size={15} />
                    Remove
                  </button>
                </div>
              </article>
            ))}
          </div>
          <div className="mt-7 border-t border-[#e4dfd2] pt-5">
            <p className="text-sm font-semibold text-[#34452e]">
              Final pricing and availability will be confirmed by Sharda Mica
              Palace.
            </p>
            <p className="mt-1 text-xs text-[#77786f]">
              Saving records the items and notes in the store inbox. WhatsApp
              opens afterward as a draft for you to review and send.
            </p>
            {savedMessage === message && (
              <p role="status" className="mt-3 border-l-2 border-[#78945a] bg-[#eff1e8] px-3 py-2 text-sm text-[#34452e]">
                Enquiry saved to the store inbox. You can now open the WhatsApp draft.
              </p>
            )}
            <label className="mt-4 flex items-start gap-2 text-xs leading-5 text-[#55574f]">
              <input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} className="mt-1 accent-[#34452e]" />
              <span>I agree to save this product list and its notes in the store inbox before opening WhatsApp. <Link to="/privacy" className="font-semibold underline">Privacy Policy</Link>.</span>
            </label>
            {error && <p role="alert" className="mt-3 border-l-2 border-[#a44d38] bg-[#fbefeb] px-3 py-2 text-sm text-[#783a2b]">{error}</p>}
            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                to="/products"
                className="border border-[#b5b6a9] px-4 py-3 text-sm font-semibold text-[#34452e]"
              >
                Continue Shopping
              </Link>
              <button
                onClick={() => cart.clear()}
                className="border border-[#b5b6a9] px-4 py-3 text-sm font-semibold text-[#55574f]"
              >
                Clear Cart
              </button>
              {savedMessage === message ? (
                <a href={whatsappHref(message)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 bg-[#34452e] px-5 py-3 text-sm font-semibold text-white">
                  Open WhatsApp draft <IconArrowRight size={16} />
                </a>
              ) : (
                <button type="button" onClick={() => void saveCartEnquiry()} disabled={!consent || saveEnquiry.isPending} className="inline-flex items-center gap-2 bg-[#34452e] px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60">
                  {saveEnquiry.isPending ? "Saving enquiry…" : "Save enquiry to inbox"}
                  <IconArrowRight size={16} />
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
import React from "react";
