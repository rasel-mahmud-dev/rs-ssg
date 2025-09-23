# RS-SSG

A modern React Static Site Generator that combines the power of React, Vite, Esbuild, and Tailwind CSS for building lightning-fast, SEO-optimized websites.

[![npm version](https://badge.fury.io/js/rs-ssg.svg)](https://www.npmjs.com/package/rs-ssg)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

- **⚡ Blazing Fast** - Leverage Vite's ultra-fast development server and optimized production builds
- **🔍 SEO Optimized** - Pre-rendered HTML makes your content immediately available to search engines
- **⚙️ Zero Config** - Works out of the box with sensible defaults
- **🚀 Array-based Routing** - Automatic route generation with lazy loading
- **💅 CSS Support** - Built-in support for Tailwind CSS, CSS modules, and Sass
- **🖼️ Image Optimization** - Automatic image optimization and lazy loading
- **📱 Modern Stack** - React + Vite + Tailwind CSS

## Quick Start

### Installation

Install RS-SSG globally:

```bash
# Using npm
npm install -g rs-ssg

# Using yarn
yarn global add rs-ssg

# Using pnpm
pnpm add -g rs-ssg
```

### Create a New Project

```bash
rs-ssg init my-project
cd my-project
```

### Start Development Server

```bash
# Using npm
npm run dev

# Using yarn
yarn dev

# Using pnpm
pnpm dev

# Or using global command
rs-ssg dev
```

Your site will be available at `http://localhost:3000`

## Project Structure

```
my-project/
├── dist/                 # Generated static files
├── public/              # Static assets
├── src/
│   ├── components/      # Reusable React components
│   ├── pages/          # Page components
│   ├── App.jsx         # Main application component
│   ├── client.jsx      # Client-side hydration entry
│   ├── index.css       # Global styles
│   └── routes.js       # Route definitions
├── index.html          # HTML template
├── ssg.config.js       # RS-SSG configuration
└── package.json
```

## Routing

RS-SSG uses an array-based routing system with automatic code splitting:

```javascript
// src/routes.js
import { lazy } from "react";

const routes = [
    {
        path: '/',
        component: lazy(() => import('./pages/Home.jsx')),
        entry: "./src/pages/Home.jsx",
    },
    {
        path: '/about',
        component: lazy(() => import('./pages/About.jsx')),
        entry: "./src/pages/About.jsx",
    },
    {
        path: '/blogs/:slug',
        component: lazy(() => import('./pages/BlogPost.jsx')),
        entry: "./src/pages/BlogPost.jsx",
    },
];

export default routes;
```

### Dynamic Routes

Create dynamic routes using parameter notation:

```javascript
// Route configuration
{
    path: '/blogs/:slug',
    component: lazy(() => import('./pages/BlogPost.jsx')),
    entry: "./src/pages/BlogPost.jsx",
}
```

```javascript
// src/pages/BlogPost.jsx
export default function BlogPost({ data }) {
    const slug = data?.id;
    
    return (
        <article>
            <h1>{data.title}</h1>
            <div dangerouslySetInnerHTML={{ __html: data.content }} />
        </article>
    );
}

// Generate static paths for all blog posts
export async function getStaticPaths() {
    const posts = await fetchAllPosts();
    
    return {
        paths: posts.map(post => ({
            params: { id: post.id }
        })),
        fallback: false
    };
}

// Fetch data for specific blog post
export async function getStaticProps({ params }) {
    const post = await fetchPostById(params.id);
    
    return {
        props: { post }
    };
}
```

## SEO Optimization

RS-SSG includes a powerful SEO component for managing meta tags:

```javascript
import { Seo } from "rs-ssg";

function MyPage() {
    return (
        <>
            <Seo>
                <title>My Page Title</title>
                <meta name="description" content="Page description" />
                <meta name="keywords" content="react, ssg, static site" />
                <meta property="og:title" content="My Page Title" />
                <meta property="og:description" content="Page description" />
                <meta property="og:image" content="/og-image.jpg" />
            </Seo>
            
            <div>
                {/* Your page content */}
            </div>
        </>
    );
}
```

## Configuration

Configure RS-SSG using `ssg.config.js`:

```javascript
// ssg.config.js
export default {
    outputDir: 'dist',
    port: 4173,
    devPort: 3000,
    siteName: 'My App',
    siteUrl: 'https://mysite.com',
    
    seo: {
        title: 'My Site',
        description: 'My awesome static site',
        keywords: 'react, ssg, static',
        author: 'Your Name',
        ogImage: '/og-image.jpg',
        themeColor: '#000000',
        
        icons: {
            favicon: '/favicon.ico',
            appleTouchIcon: '/apple-touch-icon.png',
        }
    }
};
```

## Build & Deploy

### Build for Production

```bash
npm run build
```

### Preview Built Site

```bash
npm run preview
# or
rs-ssg preview
```

### Deploy

The built files in the `dist` directory can be deployed to any static hosting service:

- **Vercel**: `vercel --prod`
- **Netlify**: Drag and drop `dist` folder
- **GitHub Pages**: Push `dist` contents to `gh-pages` branch
- **Firebase**: `firebase deploy`

## Examples

### Basic Page Component

```javascript
// src/pages/About.jsx
import React from 'react';
import { Seo } from 'rs-ssg';

function About() {
    return (
        <div className="container mx-auto px-4 py-8">
            <Seo>
                <title>About Us - My Site</title>
                <meta name="description" content="Learn more about our company." />
            </Seo>
            <h1 className="text-4xl font-bold mb-4">About Us</h1>
            <p className="text-gray-600">Learn more about our company.</p>
        </div>
    );
}

export default About;
```

### Navigation Component

```javascript
// src/components/Navigation.jsx
import React from 'react';

const Navigation = () => {
    const navItems = [
        { href: '/', label: 'Home' },
        { href: '/about', label: 'About' },
        { href: '/blog', label: 'Blog' },
    ];

    return (
        <nav className="flex space-x-6">
            {navItems.map((item) => (
                <a
                    key={item.href}
                    href={item.href}
                    className="text-gray-700 hover:text-blue-600 transition-colors"
                >
                    {item.label}
                </a>
            ))}
        </nav>
    );
};

export default Navigation;
```

## Links

- **NPM Package**: [https://www.npmjs.com/package/rs-ssg](https://www.npmjs.com/package/rs-ssg)
- **Documentation**: [https://rs-ssg1.web.app/docs](https://rs-ssg1.web.app/docs)
- **GitHub**: [https://github.com/rasel-mahmud-dev/rs-ssg](https://github.com/rasel-mahmud-dev/rs-ssg)

## Requirements

- Node.js 20+
- npm, yarn, or pnpm

 
---

**Built with ❤️ using React, Vite, Esbuild, and Tailwind CSS**