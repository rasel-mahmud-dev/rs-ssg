function generateRobotsTxt({
                               baseUrl = "https://example.com",
                               allow = ["/"],
                               disallow = [],
                               sitemap = "/sitemap.xml",
                               userAgent = "*"
                           } = {}) {
    let content = `User-agent: ${userAgent}\n`;

    allow.forEach(path => {
        content += `Allow: ${path}\n`;
    });

    disallow.forEach(path => {
        content += `Disallow: ${path}\n`;
    });

    if (sitemap) {
        content += `Sitemap: ${baseUrl}${sitemap}\n`;
    }

    return content;
}

export default generateRobotsTxt;