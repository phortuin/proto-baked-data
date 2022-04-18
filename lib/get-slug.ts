export function getSlug(path:string): string {
    return path.split('/').pop()
}
