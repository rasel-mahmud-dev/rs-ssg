
function generateSitemap(urls, baseUrl = "https://example.com") {
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${urls
        .map(
            url => `<url>
      <loc>${baseUrl}${url}</loc>
      <lastmod>${new Date().toISOString()}</lastmod>
    </url>`
        )
        .join("\n")}
  </urlset>`;
    return xml;
}

export default  generateSitemap;

