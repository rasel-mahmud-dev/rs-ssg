# {{PROJECT_NAME}} - RS-SSG Framework

A revolutionary React Static Site Generation framework that combines the power of React, Vite, and Tailwind CSS to deliver lightning-fast, SEO-optimized websites with zero setup hassle.

![RS-SSG Framework](https://img.shields.io/badge/RS--SSG-Framework-blue?style=for-the-badge&logo=react)
![Build Status](https://img.shields.io/github/actions/workflow/status/raselmahmuddev/rs-ssg/ci.yml?style=for-the-badge)
![License](https://img.shields.io/badge/license-MIT-green?style=for-the-badge)
![Version](https://img.shields.io/npm/v/rs-ssg?style=for-the-badge)

## 🌟 Why RS-SSG?

Traditional React apps struggle with SEO because search engines can't easily parse client-side rendered content. RS-SSG solves this by pre-rendering all your pages to static HTML during build time, giving you:

- **🚀 Instant page loads** with pre-generated HTML content
- **📈 Superior SEO performance** with fully crawlable content
- **🎯 Perfect Google ranking** with complete content accessibility
- **⚡ Blazing fast development** with Vite's instant HMR
- **🎨 Beautiful styling** with Tailwind CSS integration

Stop compromising between React's developer experience and SEO requirements!

## 🚀 Quick Start

Get your SEO-optimized React site running in under 60 seconds:

```bash
# Install RS-SSG globally
pnpm add -g rs-ssg

# Create a new project
rs-ssg init your-project-name

# Navigate to project directory
cd your-project-name

# Install dependencies
pnpm install

# Start development
rs-ssg dev
```

Open [http://localhost:3000](http://localhost:3000) to see your site running with hot reload enabled.

## 📦 Command Reference

| Command | Description |
|---------|-------------|
| `rs-ssg init [name]` | Create a new RS-SSG project |
| `rs-ssg dev` | Start development server with hot reload |
| `rs-ssg build` | Build production-optimized static site |
| `rs-ssg preview` | Preview production build locally |
| `rs-ssg serve` | Serve production build (after building) |

## 🏗️ Project Structure

RS-SSG provides a sensible default structure that just works:

```
your-project/
├── src/
│   ├── components/          # Reusable React components
│   ├── pages/              # Page components (auto-routed)
│   │   ├── index.jsx       # Homepage (/) 
│   │   ├── about.jsx       # About page (/about)
│   │   └── blog/
│   │       ├── index.jsx   # Blog listing (/blog)
│   │       └── [slug].jsx  # Dynamic blog posts (/blog/:slug)
│   ├── layouts/            # Layout components
│   ├── styles/             # Global styles & Tailwind config
│   ├── utils/              # Helper functions
│   └── main.jsx            # Application entry point
├── public/                 # Static assets (images, fonts, etc.)
├── dist/                   # Production build output (auto-generated)
├── rs-ssg.config.js        # Framework configuration
└── package.json            # Dependencies and scripts
```

## ⚡ Key Features

### Zero-Config Setup
RS-SSG works out of the box with sensible defaults. No need to spend hours configuring build tools.

### Automatic Routing
The framework automatically creates routes based on your file structure in the `pages` directory.

### SEO Optimization
Every page is pre-rendered as static HTML, making your content immediately available to search engines.

### Blazing Fast Performance
Leveraging Vite's ultra-fast development server and optimized production builds.

### Tailwind CSS Integration
Pre-configured with Tailwind CSS for rapid, utility-first styling.

### Dynamic Path Generation
Easily create dynamic routes using file naming conventions like `[slug].jsx` or `[id].jsx`.

### Image Optimization
Automatic image optimization and lazy loading for optimal performance.

## 🔧 Configuration

Customize RS-SSG through the `rs-ssg.config.js` file:

```javascript
// rs-ssg.config.js
export default {
  // Source directory (default: 'src')
  sourceDir: 'src',
  
  // Output directory (default: 'dist')
  outDir: 'dist',
  
  // Base public path (default: '/')
  base: '/',
  
  // Customize Vite config
  vite: {
    // Vite configuration overrides
  },
  
  // SEO defaults for all pages
  seo: {
    title: 'My Website',
    description: 'An awesome website built with RS-SSG',
    image: '/og-image.png'
  }
}
```

## 🎨 Creating Pages

Create pages by adding components to the `src/pages` directory:

```jsx
// src/pages/about.jsx
import React from 'react';

export default function About() {
  return (
    <div>
      <h1>About Us</h1>
      <p>Learn more about our company.</p>
    </div>
  );
}

// This function runs at build time to generate static props
export async function getStaticProps() {
  // Fetch data from API, CMS, etc.
  const data = await fetchData();
  
  return {
    props: {
      data
    }
  };
}
```

## 📝 Dynamic Routes

Create dynamic routes using square brackets in filenames:

```jsx
// src/pages/blog/[slug].jsx
import React from 'react';

export default function BlogPost({ post }) {
  return (
    <article>
      <h1>{post.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
    </article>
  );
}

// Generate static paths for all blog posts
export async function getStaticPaths() {
  const posts = await fetchAllPosts();
  
  return {
    paths: posts.map(post => ({
      params: { slug: post.slug }
    })),
    fallback: false
  };
}

// Fetch data for specific blog post
export async function getStaticProps({ params }) {
  const post = await fetchPostBySlug(params.slug);
  
  return {
    props: {
      post
    }
  };
}
```
 

## 📊 Performance Benchmarks

RS-SSG generates websites that consistently score 90+ on Lighthouse performance tests:

- ⚡ 100/100 Performance
- 🔍 100/100 SEO
- 📱 100/100 Accessibility
- ♿ 100/100 Best Practices

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](https://github.com/raselmahmuddev/rs-ssg/blob/main/CONTRIBUTING.md) for details.

## 📄 License

RS-SSG is [MIT licensed](https://github.com/raselmahmuddev/rs-ssg/blob/main/LICENSE).

## 🆘 Support

- 📚 [Documentation](https://rs-ssg.dev/docs)
- 🐛 [Issue Tracker](https://github.com/raselmahmuddev/rs-ssg/issues)
- 💬 [Discord Community](https://discord.gg/rs-ssg)

---

Built with ❤️ by [Rasel Mahmud](https://github.com/raselmahmuddev) and contributors.

**Stop compromising between developer experience and SEO. Get both with RS-SSG.**