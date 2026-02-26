## SlicerVM website

This is the landing page for https://slicervm.com

### Regenerating the OG social card

The OG image (`public/og-image.png`) is a Puppeteer screenshot of the `/og-card` page, so it uses the real site fonts, colors, and logo. It is **not** generated during `npm run build` — run it manually when the hero content or branding changes:

```bash
npm run dev              # start the dev server
npm run og               # screenshot http://localhost:3000/og-card → public/og-image.png
```

To use a different port or URL:

```bash
node hack/generate-og-image.mjs http://localhost:3099
```

Commit the updated `public/og-image.png` after regenerating.

Slicer and SlicerVM are trademarks of OpenFaaS Ltd.
