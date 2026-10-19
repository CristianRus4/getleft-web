// Repository internals (docs, build scripts, translation catalogs, partials) and pages waiting
// in scheduled/ for their publish date live in the deployed tree because Cloudflare Pages serves the repo root. _routes.json sends only
// those paths here, so every other request stays a plain static-asset hit.
export async function onRequest() {
  return new Response('Not found', {
    status: 404,
    headers: {
      'content-type': 'text/plain; charset=utf-8',
      'x-robots-tag': 'noindex',
      'cache-control': 'no-store',
    },
  });
}
