import { appBasePath } from "@agent-native/core/client/api-path";
import { useAgentRouteState } from "@agent-native/core/client/navigation";

import { TAB_ID } from "@/lib/tab-id";

const routeByView: Record<string, string> = {
  home: "/",
  products: "/products",
  kitchen: "/kitchen-hardware",
  "kitchen-hardware": "/kitchen-hardware",
  cart: "/cart",
  contact: "/contact",
  about: "/about",
  privacy: "/privacy",
  terms: "/terms",
};

export interface NavigationState {
  view?: string;
  path?: string;
  publicPath?: string;
  threadId?: string;
}

export function useNavigationState() {
  useAgentRouteState<NavigationState>({
    browserTabId: TAB_ID,
    requestSource: TAB_ID,
    getNavigationState: ({ pathname }) => navigationStateForPath(pathname),
    getCommandPath: commandPathForNavigation,
  });
}

export function pathForCommand(command: NavigationState): string {
  const path = safeLocalPath(command?.path);
  if (path) return path;

  const view = command?.view?.trim().toLowerCase();
  return (view && routeByView[view]) || "/";
}

export function navigationStateForPath(
  pathname: string,
  configuredBase = appBasePath(),
): NavigationState {
  const basePath = normalizeBasePath(configuredBase);
  const localPath = stripBasePath(normalizePathname(pathname), basePath);
  const path = localPath || "/";

  return {
    view: viewForPath(path),
    path,
    publicPath: withBasePath(path, basePath),
  };
}

export function commandPathForNavigation(
  command: NavigationState,
  configuredBase = appBasePath(),
): string {
  const path = safeLocalPath(command?.path);
  if (!path) return pathForCommand(command);

  const basePath = normalizeBasePath(configuredBase);
  if (!basePath) return path;

  const publicPath = safeLocalPath(command?.publicPath);
  if (publicPath && publicPath === path) {
    return stripBasePath(path, basePath);
  }

  const view = command?.view?.trim().toLowerCase();
  const localViewPath = view ? routeByView[view] : undefined;
  if (localViewPath) {
    const mountedViewPath = withBasePath(localViewPath, basePath);
    if (hasPathPrefix(pathnameWithoutSuffix(path), mountedViewPath)) {
      return stripBasePath(path, basePath);
    }
  }

  return path;
}

function viewForPath(path: string): string {
  const pathname = path.split(/[?#]/, 1)[0] || "/";
  if (pathname === "/") return "home";
  const route = Object.entries(routeByView).find(
    ([, routePath]) => routePath === pathname,
  );
  return route?.[0] ?? "home";
}

function safeLocalPath(value: unknown): string | undefined {
  if (
    typeof value !== "string" ||
    !value.startsWith("/") ||
    value.startsWith("//") ||
    value.includes("\\") ||
    /[\u0000-\u001f\u007f]/.test(value)
  ) {
    return undefined;
  }
  return value;
}

function normalizePathname(pathname: string): string {
  return safeLocalPath(pathname) ?? "/";
}

function pathnameWithoutSuffix(path: string): string {
  const suffixIndex = path.search(/[?#]/);
  return suffixIndex === -1 ? path : path.slice(0, suffixIndex);
}

function normalizeBasePath(value: string): string {
  if (!value || value === "/") return "";
  const withLeadingSlash = value.startsWith("/") ? value : `/${value}`;
  return withLeadingSlash.replace(/\/+$/, "");
}

function withBasePath(path: string, basePath: string): string {
  return basePath ? `${basePath}${path === "/" ? "" : path}` || "/" : path;
}

function stripBasePath(path: string, basePath: string): string {
  if (!basePath || !hasPathPrefix(path, basePath)) return path;
  return path.slice(basePath.length) || "/";
}

function hasPathPrefix(path: string, prefix: string): boolean {
  return path === prefix || path.startsWith(`${prefix}/`);
}
