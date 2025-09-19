import { promises as fs } from 'fs'
import { resolve, relative, join, extname } from 'path'
import { createHash } from 'crypto'

export const exists = async (path: string): Promise<boolean> => {
    try {
        await fs.access(path)
        return true
    } catch {
        return false
    }
}

export const ensureDir = async (dir: string): Promise<void> => {
    try {
        await fs.mkdir(dir, { recursive: true })
    } catch (error) {
        if (error.code !== 'EEXIST') {
            throw error
        }
    }
}

export const readJSON = async <T = any>(path: string): Promise<T> => {
    const content = await fs.readFile(path, 'utf-8')
    return JSON.parse(content)
}

export const writeJSON = async (path: string, data: any, space = 2): Promise<void> => {
    const content = JSON.stringify(data, null, space)
    await fs.writeFile(path, content, 'utf-8')
}

export const globby = async (patterns: string | string[], options: { cwd?: string } = {}): Promise<string[]> => {
    // Simple glob implementation - in real scenario, use a proper glob library
    const cwd = options.cwd || process.cwd()
    const files: string[] = []

    const walk = async (dir: string): Promise<void> => {
        const entries = await fs.readdir(dir, { withFileTypes: true })

        for (const entry of entries) {
            const fullPath = join(dir, entry.name)
            const relativePath = relative(cwd, fullPath)

            if (entry.isDirectory()) {
                await walk(fullPath)
            } else {
                files.push(relativePath)
            }
        }
    }

    await walk(cwd)
    return files
}

export const hash = (content: string): string => {
    return createHash('md5').update(content).digest('hex').slice(0, 8)
}

export const debounce = <T extends (...args: any[]) => any>(
    fn: T,
    delay: number
): (...args: Parameters<T>) => void => {
    let timeoutId: NodeJS.Timeout

    return (...args: Parameters<T>) => {
        clearTimeout(timeoutId)
        timeoutId = setTimeout(() => fn.apply(null, args), delay)
    }
}

export const throttle = <T extends (...args: any[]) => any>(
    fn: T,
    limit: number
): (...args: Parameters<T>) => void => {
    let inThrottle: boolean

    return (...args: Parameters<T>) => {
        if (!inThrottle) {
            fn.apply(null, args)
            inThrottle = true
            setTimeout(() => inThrottle = false, limit)
        }
    }
}

export const isValidProjectName = (name: string): boolean => {
    return /^[a-zA-Z0-9_-]+$/.test(name) && name.length > 0
}

export const toCamelCase = (str: string): string => {
    return str.replace(/[-_](.)/g, (_, char) => char.toUpperCase())
}

export const toPascalCase = (str: string): string => {
    return toCamelCase(str).charAt(0).toUpperCase() + toCamelCase(str).slice(1)
}

export const toKebabCase = (str: string): string => {
    return str.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`).replace(/^-/, '')
}
