import type { ProductPhoto } from "@/lib/store";

const suppliedPhoto = (filename: string, alt: string): ProductPhoto[] => [
  { src: `/images/products/${filename}.jpg`, alt },
];

export const productPhotos = {
  commercialPlywood: suppliedPhoto("commercial-plywood", "Commercial Plywood"),
  blockBoard: suppliedPhoto("block-board", "Block Board"),
  teakPlywood: suppliedPhoto("teak-plywood", "Teak Plywood"),
  shutteringPlywood: suppliedPhoto("shuttering-plywood", "Shuttering Plywood"),
  blockMarinePlywood: suppliedPhoto(
    "block-marine-plywood",
    "Block Marine Plywood",
  ),
  flushDoors: suppliedPhoto("flush-doors", "Flush Doors"),
  isiDoors: suppliedPhoto("isi-doors", "ISI Doors"),
  doorSkin: suppliedPhoto("door-skin", "Door Skin"),
  hinges: suppliedPhoto("hinges", "Hinges"),
  doorFittings: suppliedPhoto("door-fittings", "Door Fittings"),
  cabinetHardware: suppliedPhoto("cabinet-hardware", "Cabinet Hardware"),
  furnitureHardware: suppliedPhoto("furniture-hardware", "Furniture Hardware"),
  modularKitchenWireBaskets: suppliedPhoto(
    "modular-kitchen-wire-baskets",
    "Modular Kitchen Wire Baskets",
  ),
  modularKitchenAccessories: suppliedPhoto(
    "modular-kitchen-accessories",
    "Modular Kitchen Accessories",
  ),
  kitchenTandemBox: suppliedPhoto(
    "modular-kitchen-tandem-box",
    "Modular Kitchen Tandem Box",
  ),
  kitchenChimneys: suppliedPhoto(
    "modular-kitchen-chimneys-gas-stoves-hobs",
    "Modular Kitchen Chimneys, Gas Stoves & Hobs",
  ),
  kitchenShutters: suppliedPhoto(
    "modular-kitchen-shutters",
    "Modular Kitchen Shutters",
  ),
  wardrobeFittings: suppliedPhoto("wardrobe-fittings", "Wardrobe Fittings"),
  bedFittings: suppliedPhoto("bed-fittings", "Bed Fittings"),
  glassProfiles: suppliedPhoto("glass-profiles", "Glass Profiles"),
  kitchenAcrylicShutters: suppliedPhoto(
    "modular-kitchen-acrylic-shutters-alt",
    "Modular Kitchen Acrylic Shutters",
  ),
  kitchenPuShutters: suppliedPhoto(
    "modular-kitchen-pu-shutters",
    "Modular Kitchen PU Shutters",
  ),
  charcoalLouvers: suppliedPhoto("charcoal-louvers", "Charcoal Louvers"),
  pvcLouvers: suppliedPhoto("pvc-louvers", "PVC Louvers"),
  woodAdhesive: suppliedPhoto("wood-adhesive", "Wood Adhesive"),
};
