import {ReactNode} from "react";

export interface Config  {
    projectRoot: string
    frameworkPath: string,
    version: string
    buildDir: string
}

export interface RSConfig {
    plugins?: Plugin[]
    build?: BuildConfig
    dev?: DevConfig
    router?: RouterConfig
    server?: ServerConfig
}

export interface Plugin {
    name: string
    setup: (api: PluginAPI) => void | Promise<void>
    enforce?: 'pre' | 'post'
    apply?: 'build' | 'serve' | ((config: RSConfig, env: ConfigEnv) => boolean)
}

export interface PluginAPI {
    addMiddleware: (middleware: Middleware) => void
    addRoute: (route: RouteConfig) => void
    modifyConfig: (modifier: (config: RSConfig) => RSConfig) => void
    onBuildStart: (callback: () => void | Promise<void>) => void
    onBuildEnd: (callback: () => void | Promise<void>) => void
}

export interface Route {
    path: string,
    entry: string,
    component: ReactNode,
    title: string
}

export interface BuildConfig {
    outDir?: string
    sourcemap?: boolean
    minify?: boolean
    target?: string | string[]
    rollupOptions?: Record<string, any>
}

export interface DevConfig {
    port?: number
    host?: string
    open?: boolean
    server?: {
        middlewareMode?: boolean
        hmr?: boolean | { port?: number }
    }
}

export interface RouterConfig {
    type?: 'file-based' | 'manual'
    pagesDir?: string
    layoutsDir?: string
    middleware?: string[]
    trailingSlash?: boolean
}

export interface ServerConfig {
    port?: number
    host?: string
    cors?: boolean | CorsOptions
}

export interface CorsOptions {
    origin?: string | string[] | boolean
    methods?: string[]
    credentials?: boolean
}

export interface RouteConfig {
    path: string
    component: string
    layout?: string
    middleware?: string[]
    props?: Record<string, any>
}

export interface ConfigEnv {
    mode: 'development' | 'production' | 'test'
    command: 'build' | 'serve'
}

export interface Middleware {
    name: string
    handler: (req: any, res: any, next: any) => void
    path?: string
}