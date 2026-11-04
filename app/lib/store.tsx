import { useActionQuery } from "@agent-native/core/client/hooks";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

import { productPhotos } from "@/lib/product-photos";

export const categories = [
  "Plywood & Boards",
  "Laminates",
  "Doors",
  "Carpentry Materials",
  "Modular Kitchen",
  "Louvers",
  "Adhesives",
] as const;
export type Category = (typeof categories)[number];
export type ProductPhoto = {
  src: string;
  alt: string;
};
export type Product = {
  id: string;
  name: string;
  category: Category;
  description: string;
  image: string;
  unit: string | null;
  price: null;
  variants: string[];
  availability: null;
  requiresQuote: true;
  photos: ProductPhoto[];
};
type AddedStoreProduct = {
  id: string;
  name: string;
  category: string;
  description: string;
  imageUrl: string;
};

const product = (
  id: string,
  name: string,
  category: Category,
  description: string,
  image: string,
  photos: ProductPhoto[] = [],
): Product => ({
  id,
  name,
  category,
  description,
  image,
  unit: null,
  price: null,
  variants: [],
  availability: null,
  requiresQuote: true,
  photos,
});
export const products: Product[] = [
  product(
    "commercial-plywood",
    "Commercial Plywood",
    "Plywood & Boards",
    "Plywood for furniture and interior projects. Confirm grade and thickness with the store.",
    "plywood",
    productPhotos.commercialPlywood,
  ),
  product(
    "block-board",
    "Block Board",
    "Plywood & Boards",
    "Board material for furniture and interior applications.",
    "board",
    productPhotos.blockBoard,
  ),
  product(
    "teak-plywood",
    "Teak Plywood",
    "Plywood & Boards",
    "Teak plywood. Ask the store to confirm available specifications.",
    "plywood",
    productPhotos.teakPlywood,
  ),
  product(
    "shuttering-plywood",
    "Shuttering Plywood",
    "Plywood & Boards",
    "Shuttering plywood. Current specifications are confirmed on enquiry.",
    "board",
    productPhotos.shutteringPlywood,
  ),
  product(
    "block-marine-plywood",
    "Block Marine Plywood",
    "Plywood & Boards",
    "Ask the store to confirm available grades and specifications.",
    "plywood",
    productPhotos.blockMarinePlywood,
  ),
  product(
    "decorative-laminates",
    "Decorative Laminates",
    "Laminates",
    "Decorative laminate sheets. Designs and finishes vary; please enquire.",
    "laminate",
    [
      {
        src: "/products/laminates/decorative-laminates.png",
        alt: "Decorative Laminates",
      },
    ],
  ),
  product(
    "sunmica",
    "Sunmica",
    "Laminates",
    "Sunmica laminate options. Ask about current designs and finishes.",
    "laminate",
    [{ src: "/products/laminates/sunmica.png", alt: "Sunmica" }],
  ),
  product(
    "flush-doors",
    "Flush Doors",
    "Doors",
    "Flush door options. Confirm size, finish and availability with the store.",
    "door",
    productPhotos.flushDoors,
  ),
  product(
    "isi-doors",
    "ISI Doors",
    "Doors",
    "ISI doors. Ask the store to confirm available models and specifications.",
    "door",
    productPhotos.isiDoors,
  ),
  product(
    "door-skin",
    "Door Skin",
    "Doors",
    "Door skin options. Current designs are confirmed on enquiry.",
    "door",
    productPhotos.doorSkin,
  ),
  product(
    "hinges",
    "Hinges",
    "Carpentry Materials",
    "Hinges for doors and cabinetry. Share your requirement for a suitable option.",
    "hardware",
    productPhotos.hinges,
  ),
  product(
    "door-fittings",
    "Door Fittings",
    "Carpentry Materials",
    "Door hardware and fittings for carpentry projects.",
    "hardware",
    productPhotos.doorFittings,
  ),
  product(
    "cabinet-hardware",
    "Cabinet Hardware",
    "Carpentry Materials",
    "Cabinet hardware and related carpenter accessories.",
    "hardware",
    productPhotos.cabinetHardware,
  ),
  product(
    "furniture-hardware",
    "Furniture Hardware",
    "Carpentry Materials",
    "Share the fitting or hardware item you need; options are confirmed by the store.",
    "hardware",
    productPhotos.furnitureHardware,
  ),
  product(
    "wardrobe-fittings",
    "Wardrobe Fittings",
    "Carpentry Materials",
    "Ask the store to confirm current wardrobe fitting options.",
    "hardware",
    productPhotos.wardrobeFittings,
  ),
  product(
    "bed-fittings",
    "Bed Fittings",
    "Carpentry Materials",
    "Ask the store to confirm fitting options for your requirement.",
    "hardware",
    productPhotos.bedFittings,
  ),
  product(
    "glass-profiles",
    "Glass Profiles",
    "Carpentry Materials",
    "Profile options and finishes are confirmed by the store.",
    "hardware",
    productPhotos.glassProfiles,
  ),
  product(
    "modular-kitchen-wire-baskets",
    "Modular Kitchen Wire Baskets",
    "Modular Kitchen",
    "Ask the store to confirm current basket options and configurations.",
    "kitchen",
    productPhotos.modularKitchenWireBaskets,
  ),
  product(
    "modular-kitchen-accessories",
    "Modular Kitchen Accessories",
    "Modular Kitchen",
    "Share the storage or fitting item you need; options are confirmed by the store.",
    "kitchen",
    productPhotos.modularKitchenAccessories,
  ),
  product(
    "kitchen-tandem-box",
    "Modular Kitchen Tandem Box",
    "Modular Kitchen",
    "Ask the store to confirm current tandem box options.",
    "kitchen",
    productPhotos.kitchenTandemBox,
  ),
  product(
    "kitchen-chimneys-gas-stoves-hobs",
    "Modular Kitchen Chimneys, Gas Stoves & Hobs",
    "Modular Kitchen",
    "Models and availability are confirmed directly by the store.",
    "kitchen",
    productPhotos.kitchenChimneys,
  ),
  product(
    "modular-kitchen-shutters",
    "Modular Kitchen Shutters",
    "Modular Kitchen",
    "Ask the store to confirm current shutter designs and finishes.",
    "kitchen",
    productPhotos.kitchenShutters,
  ),
  product(
    "acrylic-shutters",
    "Modular Kitchen Acrylic Shutters",
    "Modular Kitchen",
    "Ask the store to confirm available colours, finishes and options.",
    "kitchen",
    productPhotos.kitchenAcrylicShutters,
  ),
  product(
    "pu-shutters",
    "Modular Kitchen PU Shutters",
    "Modular Kitchen",
    "Ask the store to confirm available colours, finishes and options.",
    "kitchen",
    productPhotos.kitchenPuShutters,
  ),
  product(
    "charcoal-louvers",
    "Charcoal Louvers",
    "Louvers",
    "Dark louvre designs shown for reference; confirm exact finish and availability with the store.",
    "hardware",
    productPhotos.charcoalLouvers,
  ),
  product(
    "pvc-louvers",
    "PVC Louvers",
    "Louvers",
    "Browse the supplied louvre design photos; confirm specifications and availability with the store.",
    "hardware",
    productPhotos.pvcLouvers,
  ),
  product(
    "modular-kitchen-wicker-basket",
    "Modular Kitchen Wicker Basket",
    "Modular Kitchen",
    "Ask the store to confirm current basket options and availability.",
    "kitchen",
    [{ src: "/products/kitchen/wicker_basket.webp", alt: "Wicker Basket" }],
  ),
  product(
    "modular-kitchen-dustbin-holder",
    "Modular Kitchen Dustbin Holder",
    "Modular Kitchen",
    "Ask the store to confirm current holder options and availability.",
    "kitchen",
    [{ src: "/products/kitchen/dustbin_holder.webp", alt: "Dustbin Holder" }],
  ),
  product(
    "modular-kitchen-gas-trolley",
    "Modular Kitchen Gas Trolley",
    "Modular Kitchen",
    "Ask the store to confirm current trolley options and availability.",
    "kitchen",
    [{ src: "/products/kitchen/gas_trolley.webp", alt: "Gas Trolley" }],
  ),
  product(
    "modular-kitchen-ss-attachments",
    "Modular Kitchen SS Attachments",
    "Modular Kitchen",
    "Ask the store to confirm current attachment options and availability.",
    "kitchen",
    [{ src: "/products/kitchen/ss_attachments.webp", alt: "SS Attachments" }],
  ),
  product(
    "modular-kitchen-ss-combo",
    "Modular Kitchen SS Combo",
    "Modular Kitchen",
    "Ask the store to confirm current combo options and availability.",
    "kitchen",
    [{ src: "/products/kitchen/ss_combo.webp", alt: "SS Combo" }],
  ),
  product(
    "modular-kitchen-detergent-rack",
    "Modular Kitchen Detergent Rack",
    "Modular Kitchen",
    "Ask the store to confirm current rack options and availability.",
    "kitchen",
    [{ src: "/products/kitchen/detergent_rack.webp", alt: "Detergent Rack" }],
  ),
  product(
    "modular-kitchen-pvc-cutlery-tray",
    "Modular Kitchen PVC Cutlery Tray",
    "Modular Kitchen",
    "Ask the store to confirm current tray options and availability.",
    "kitchen",
    [
      {
        src: "/products/kitchen/pvc_cutlery_tray.webp",
        alt: "PVC Cutlery Tray",
      },
    ],
  ),
  product(
    "modular-kitchen-adjustable-wooden-cutlery",
    "Modular Kitchen Adjustable Wooden Cutlery",
    "Modular Kitchen",
    "Ask the store to confirm current cutlery options and availability.",
    "kitchen",
    [
      {
        src: "/products/kitchen/adjustable_wooden_cutlery.webp",
        alt: "Adjustable Wooden Cutlery",
      },
    ],
  ),
  product(
    "modular-kitchen-glass-pantry-unit",
    "Modular Kitchen Glass Pantry Unit",
    "Modular Kitchen",
    "Ask the store to confirm current pantry unit options and availability.",
    "kitchen",
    [
      {
        src: "/products/kitchen/glass_pantry_unit.webp",
        alt: "Glass Pantry Unit",
      },
    ],
  ),
  product(
    "modular-kitchen-dish-rack",
    "Modular Kitchen Dish Rack",
    "Modular Kitchen",
    "Ask the store to confirm current dish rack options and availability.",
    "kitchen",
    [{ src: "/products/kitchen/dish_rack.webp", alt: "Dish Rack" }],
  ),
  product(
    "bed-fitting",
    "Bed Fitting",
    "Carpentry Materials",
    "Ask the store to confirm current bed fitting options and availability.",
    "hardware",
    [{ src: "/products/kitchen/bed_fitting.webp", alt: "Bed Fitting" }],
  ),
  product(
    "wardrobe-lifter",
    "Wardrobe Lifter",
    "Carpentry Materials",
    "Ask the store to confirm current wardrobe fitting options and availability.",
    "hardware",
    [{ src: "/products/kitchen/wardrobe_lifter.webp", alt: "Wardrobe Lifter" }],
  ),
  product(
    "self-support-screw",
    "Self Support Screw",
    "Carpentry Materials",
    "Ask the store to confirm current screw and fitting options.",
    "hardware",
    [
      {
        src: "/products/kitchen/self_support_screw.webp",
        alt: "Self Support Screw",
      },
    ],
  ),
  product(
    "glass-profiles-supplied",
    "Glass Profiles",
    "Carpentry Materials",
    "Browse the supplied glass profile images; ask the store to confirm available options.",
    "hardware",
    [
      {
        src: "/products/kitchen/glass_profile_45mm.webp",
        alt: "Glass Profile",
      },
      {
        src: "/products/kitchen/glass_profile_22mm.webp",
        alt: "Glass Profile",
      },
    ],
  ),
  product(
    "g-profile",
    "G-Profile",
    "Carpentry Materials",
    "Ask the store to confirm current profile options and availability.",
    "hardware",
    [{ src: "/products/kitchen/g_profile.webp", alt: "G-Profile" }],
  ),
  product(
    "j-profile",
    "J-Profile",
    "Carpentry Materials",
    "Ask the store to confirm current profile options and availability.",
    "hardware",
    [{ src: "/products/kitchen/j_profile.webp", alt: "J-Profile" }],
  ),
  product(
    "glass-handle-profiles",
    "Glass Handle Profiles",
    "Carpentry Materials",
    "Browse the supplied handle profile images; ask the store to confirm available options.",
    "hardware",
    [
      {
        src: "/products/kitchen/glass_handle_profile_40mm.webp",
        alt: "Glass Handle Profile",
      },
      {
        src: "/products/kitchen/glass_handle_profile_68mm.webp",
        alt: "Glass Handle Profile",
      },
    ],
  ),
  product(
    "l-patti",
    "L-Patti",
    "Carpentry Materials",
    "Ask the store to confirm current L-Patti options and availability.",
    "hardware",
    [{ src: "/products/kitchen/l_patti.webp", alt: "L-Patti" }],
  ),
  product(
    "profile-connector",
    "Profile Connector",
    "Carpentry Materials",
    "Ask the store to confirm current profile connector options and availability.",
    "hardware",
    [
      {
        src: "/products/kitchen/profile_connector.webp",
        alt: "Profile Connector",
      },
    ],
  ),
  product(
    "profile-handle",
    "Profile Handle",
    "Carpentry Materials",
    "Ask the store to confirm current profile handle options and availability.",
    "hardware",
    [{ src: "/products/kitchen/profile_handle.webp", alt: "Profile Handle" }],
  ),
  product(
    "door-straightener",
    "Door Straightener",
    "Carpentry Materials",
    "Ask the store to confirm current door straightener options and availability.",
    "hardware",
    [
      {
        src: "/products/carpenter-hardware/door_straightener.png",
        alt: "Door Straightener",
      },
    ],
  ),
  product(
    "wood-adhesive",
    "Fevicol / Wood Adhesive",
    "Adhesives",
    "Wood adhesive options. Please ask the store about current products and pack sizes.",
    "adhesive",
    productPhotos.woodAdhesive,
  ),
];

export function useCatalogProducts() {
  const { data: catalogData } = useActionQuery("list-store-products", {});
  return useMemo<Product[]>(() => {
    const activeCatalogIds = catalogData
      ? new Set<string>(catalogData.activeCatalogIds)
      : null;
    return [
      ...products.filter(
        (item) => !activeCatalogIds || activeCatalogIds.has(item.id),
      ),
      ...(catalogData?.addedProducts ?? []).map((item: AddedStoreProduct) => ({
        id: item.id,
        name: item.name,
        category: ([
          "Carpenter Hardware",
          "Carpentry & Furniture Hardware",
        ].includes(item.category)
          ? "Carpentry Materials"
          : item.category) as Category,
        description: item.description,
        image: "uploaded-product",
        unit: null,
        price: null,
        variants: [],
        availability: null,
        requiresQuote: true as const,
        photos: [{ src: item.imageUrl, alt: item.name }],
      })),
    ];
  }, [catalogData]);
}

export const STORE = {
  name: "Sharda Mica Palace",
  proprietor: "Gulabrai Hinduja",
  address: "Ukhari Chowk, MR 4 Road, Jabalpur, Madhya Pradesh, India",
  phone: "0761-4921170",
  mobile: "+91 94243 12979",
  alternateMobile: "+91 90390 12979",
  email: "shardamica@gmail.com",
  whatsapp: "919424312979",
} as const;

export type CartLine = {
  productId: string;
  quantity: number;
  specification: string;
  notes: string;
};
const STORAGE_KEY = "smp_enquiry_cart_v1";
function validLines(value: unknown): CartLine[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    if (!item || typeof item !== "object") return [];
    const row = item as Record<string, unknown>;
    const productId = String(row.productId ?? "");
    const quantity = Number(row.quantity);
    if (
      !(
        products.some((p) => p.id === productId) ||
        /^added-[a-f0-9-]{36}$/i.test(productId)
      ) ||
      !Number.isInteger(quantity) ||
      quantity < 1 ||
      quantity > 999
    )
      return [];
    return [
      {
        productId,
        quantity,
        specification:
          typeof row.specification === "string"
            ? row.specification.slice(0, 240)
            : "",
        notes: typeof row.notes === "string" ? row.notes.slice(0, 500) : "",
      },
    ];
  });
}
function restore(): CartLine[] {
  try {
    return validLines(
      JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "[]"),
    );
  } catch {
    return [];
  }
}

type CartContextValue = {
  lines: CartLine[];
  storageAvailable: boolean;
  add: (id: string, specification?: string) => void;
  update: (
    id: string,
    patch: Partial<Pick<CartLine, "quantity" | "specification" | "notes">>,
  ) => void;
  remove: (id: string) => void;
  clear: () => void;
  count: number;
};
const CartContext = createContext<CartContextValue | null>(null);
export function EnquiryCartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [ready, setReady] = useState(false);
  const [storageAvailable, setStorageAvailable] = useState(true);
  useEffect(() => {
    setLines(restore());
    setReady(true);
    try {
      window.localStorage.setItem("smp_storage_probe", "1");
      window.localStorage.removeItem("smp_storage_probe");
    } catch {
      setStorageAvailable(false);
    }
  }, []);
  useEffect(() => {
    if (ready)
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
      } catch {
        setStorageAvailable(false);
      }
  }, [lines, ready]);
  const value = useMemo<CartContextValue>(
    () => ({
      lines,
      storageAvailable,
      count: lines.reduce((n, row) => n + row.quantity, 0),
      add: (id, specification = "") =>
        setLines((prev) => {
          const found = prev.find((x) => x.productId === id);
          return found
            ? prev.map((x) =>
                x === found
                  ? {
                      ...x,
                      quantity: Math.min(999, x.quantity + 1),
                      specification: found.specification || specification,
                    }
                  : x,
              )
            : [
                ...prev,
                { productId: id, quantity: 1, specification, notes: "" },
              ];
        }),
      update: (id, patch) =>
        setLines((prev) =>
          prev.map((x) =>
            x.productId === id
              ? {
                  ...x,
                  ...patch,
                  quantity:
                    patch.quantity === undefined
                      ? x.quantity
                      : Math.max(
                          1,
                          Math.min(
                            999,
                            Math.floor(Number(patch.quantity) || 1),
                          ),
                        ),
                }
              : x,
          ),
        ),
      remove: (id) =>
        setLines((prev) => prev.filter((x) => x.productId !== id)),
      clear: () => setLines([]),
    }),
    [lines, storageAvailable],
  );
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
export function useEnquiryCart() {
  const value = useContext(CartContext);
  if (!value)
    throw new Error("useEnquiryCart must be used within EnquiryCartProvider");
  return value;
}

export function whatsappHref(message: string) {
  return `https://wa.me/${STORE.whatsapp}?text=${encodeURIComponent(message)}`;
}
export function cartMessage(lines: CartLine[], catalog: Product[] = products) {
  const items = lines
    .map((line) => {
      const p = catalog.find((x) => x.id === line.productId);
      return p
        ? `• ${p.name} — Qty: ${line.quantity}${line.specification ? `\n  Specification: ${line.specification}` : ""}${line.notes ? `\n  Notes: ${line.notes}` : ""}`
        : "";
    })
    .filter(Boolean)
    .join("\n");
  return `${STORE.name} — Product Enquiry\n\n${items}\n\nPlease confirm current pricing and availability.`;
}
