import type { NextConfig } from "next";

/**
 * Two builds come out of this repo.
 *
 * Normal (`npm run build`) — the real app: server-rendered, Server Actions,
 * Prisma, staff auth. This is what gets deployed to a Node host.
 *
 * Demo (`DEMO_EXPORT=1 npm run build`) — a fully static click-through of the
 * same UI for GitHub Pages, so the client can browse it without a server.
 * Pages cannot run server code, so the demo build swaps the Server Actions and
 * cookie reads for client-side stand-ins. Ordering does not really happen
 * there; see README.
 */
const isDemoExport = process.env.DEMO_EXPORT === "1";

// A GitHub project site is served from /<repo>, so the base path has to match
// the repo name exactly — `sweet-crust` and `sweet_crust` are different sites.
// scripts/deploy-demo.mjs derives this from the target remote.
const demoBasePath = process.env.DEMO_BASE_PATH ?? "/sweet-crust";

const nextConfig: NextConfig = isDemoExport
  ? {
      output: "export",
      // Readable from client components too, so forms know to fake it and the
      // image loader knows what prefix to add.
      env: { NEXT_PUBLIC_DEMO: "1", NEXT_PUBLIC_BASE_PATH: demoBasePath },
      basePath: demoBasePath,
      // Pages has no image optimizer. A custom loader rather than
      // `unoptimized` because unoptimized images skip basePath entirely and
      // every photo 404s — the loader adds the prefix. See the loader file.
      images: { loader: "custom", loaderFile: "./src/demo/image-loader.ts" },
      // Emit `about/index.html` so paths resolve without a rewrite engine.
      trailingSlash: true,
      // Static export cannot contain a Server Action — even an unused import
      // fails the build. Resolve those four modules to client-safe stubs so
      // the components importing them need no changes at all.
      turbopack: {
        resolveAlias: {
          "@/app/(site)/actions": "./src/demo/site-actions.ts",
          "@/app/(site)/cart/actions": "./src/demo/cart-actions.ts",
          "@/app/admin/actions": "./src/demo/admin-actions.ts",
          "@/app/admin/products/actions": "./src/demo/product-actions.ts",
        },
      },
    }
  : {};

export default nextConfig;
