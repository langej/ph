import { Base } from '@utils/Base'
import { CONTEXT, type RouterState } from './declarations/Context'

type RouteMatch = {
    route: HTMLElement
    params: Record<string, string>
}

const normalizePath = (path: string) => {
    const normalized = path.replace(/\/+$/, '')
    return normalized || '/'
}

const matchRoute = (route: HTMLElement, pathname: string): RouteMatch | undefined => {
    const path = route.getAttribute('path')
    if (!path) return
    if (path === '*') return { route, params: {} }

    const routeSegments = normalizePath(path).split('/').filter(Boolean)
    const pathSegments = normalizePath(pathname).split('/').filter(Boolean)
    if (routeSegments.length !== pathSegments.length) return

    const params: Record<string, string> = {}
    for (let index = 0; index < routeSegments.length; index++) {
        const routeSegment = routeSegments[index]
        const pathSegment = pathSegments[index]
        if (routeSegment.startsWith(':')) {
            params[routeSegment.slice(1)] = decodeURIComponent(pathSegment)
        } else if (routeSegment !== pathSegment) {
            return
        }
    }

    return { route, params }
}

export class PhRouter extends Base {
    mount() {
        this.style.display = 'contents'
        this.render()

        const onPopState = () => this.render()
        window.addEventListener('popstate', onPopState)
        this.onRemove(() => window.removeEventListener('popstate', onPopState))

        const onNavigate = (event: Event) => {
            const { path, replace } = (event as CustomEvent<{ path: string; replace?: boolean }>).detail
            this.navigate(path, replace)
        }
        document.addEventListener('ph:navigate', onNavigate)
        this.onRemove(() => document.removeEventListener('ph:navigate', onNavigate))

        this.on('click', (event) => {
            const mouseEvent = event as MouseEvent
            const target = mouseEvent.target
            const link = target instanceof Element ? target.closest<HTMLAnchorElement>('a[href]') : undefined
            if (
                !link ||
                mouseEvent.defaultPrevented ||
                mouseEvent.button !== 0 ||
                mouseEvent.metaKey ||
                mouseEvent.ctrlKey ||
                mouseEvent.shiftKey ||
                mouseEvent.altKey
            )
                return
            if (link.target || link.hasAttribute('download')) return

            const url = new URL(link.getAttribute('href')!, window.location.href)
            if (url.origin !== window.location.origin) return

            event.preventDefault()
            this.navigate(`${url.pathname}${url.search}${url.hash}`)
        })
    }

    navigate(path: string, replace = false) {
        window.history[replace ? 'replaceState' : 'pushState']({}, '', path)
        this.render()
    }

    render() {
        const routes = Array.from(this.children).filter((child): child is HTMLElement => child instanceof HTMLElement && child.hasAttribute('path'))
        const match = routes.map((route) => matchRoute(route, window.location.pathname)).find(Boolean)

        for (const route of routes) {
            const isActive = route === match?.route
            route.hidden = !isActive
            route.style.display = isActive ? '' : 'none'
        }
        const router: RouterState = {
            pathname: window.location.pathname,
            search: window.location.search,
            hash: window.location.hash,
            params: match?.params ?? {},
            route: match?.route,
            push: (path) => this.navigate(path),
            replace: (path) => this.navigate(path, true),
            back: () => window.history.back(),
            forward: () => window.history.forward(),
        }
        document[CONTEXT].router = router
        if (match) this.emit('routechange', { path: window.location.pathname, params: match.params, route: match.route })
    }
}
