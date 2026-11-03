import { describe, expect, it } from "vitest";

import {
  commandPathForNavigation,
  navigationStateForPath,
  pathForCommand,
} from "../app/hooks/use-navigation-state";

describe("pathForCommand", () => {
  it("uses the storefront home route even when a chat thread id is supplied", () => {
    expect(pathForCommand({ view: "home", threadId: "thread-one" })).toBe("/");
  });

  it("maps supported storefront views to real routes", () => {
    expect(pathForCommand({ view: "products" })).toBe("/products");
    expect(pathForCommand({ view: "kitchen-hardware" })).toBe(
      "/kitchen-hardware",
    );
    expect(pathForCommand({ view: "cart" })).toBe("/cart");
    expect(pathForCommand({ view: "unknown-view" })).toBe("/");
  });

  it("rejects external or malformed paths and falls back to a real local route", () => {
    expect(pathForCommand({ path: "https://example.com" })).toBe("/");
    expect(pathForCommand({ path: "//example.com" })).toBe("/");
    expect(pathForCommand({ path: "/\\example.com" })).toBe("/");
  });
});

describe("navigationStateForPath", () => {
  it("records local and public paths for a mounted storefront", () => {
    expect(
      navigationStateForPath("/storefront/products", "/storefront"),
    ).toEqual({
      view: "products",
      path: "/products",
      publicPath: "/storefront/products",
    });
  });

  it("preserves query and hash suffixes in the router path", () => {
    expect(navigationStateForPath("/products?sort=name#catalog", "")).toEqual({
      view: "products",
      path: "/products?sort=name#catalog",
      publicPath: "/products?sort=name#catalog",
    });
  });
});

describe("commandPathForNavigation", () => {
  it("converts a mounted public product path to its local route", () => {
    expect(
      commandPathForNavigation(
        {
          view: "products",
          path: "/storefront/products",
          publicPath: "/storefront/products",
        },
        "/storefront",
      ),
    ).toBe("/products");
  });

  it("preserves router-local paths under a mount prefix", () => {
    expect(commandPathForNavigation({ path: "/products" }, "/storefront")).toBe(
      "/products",
    );
  });

  it("preserves query and hash suffixes while normalizing mounted routes", () => {
    expect(
      commandPathForNavigation(
        {
          view: "products",
          path: "/storefront/products?sort=name#catalog",
          publicPath: "/storefront/products",
        },
        "/storefront",
      ),
    ).toBe("/products?sort=name#catalog");
  });

  it("uses the view route when a command has no path", () => {
    expect(commandPathForNavigation({ view: "contact" })).toBe("/contact");
  });
});
