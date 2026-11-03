import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  loadTemplateMcpConformance,
  providerSchemaViolations,
  templateMcpCatalogModes,
  type TemplateMcpConformance,
} from "@agent-native/core/testing";
import { beforeAll, describe, expect, it } from "vitest";

import * as actionRegistry from "../.generated/actions-registry";

const projectRoot = fileURLToPath(new URL("..", import.meta.url));

describe("Chat MCP catalogs", () => {
  let template: TemplateMcpConformance;

  beforeAll(async () => {
    const registryPath = path.resolve(
      projectRoot,
      ".generated/actions-registry.ts",
    );
    template = await loadTemplateMcpConformance(projectRoot, async (file) => {
      if (path.resolve(file) === registryPath) return actionRegistry;
      throw new Error(`Unexpected conformance module: ${file}`);
    });
  }, 180_000);

  it.each(templateMcpCatalogModes(projectRoot))(
    "advertises only schemas that pass every pinned provider rule in the %s catalog",
    async (mode) => {
      const tools = await template.listCatalog(mode);
      expect(tools.length).toBeGreaterThan(0);
      expect(tools.flatMap((tool) => providerSchemaViolations(tool))).toEqual(
        [],
      );
    },
    60_000,
  );
});
