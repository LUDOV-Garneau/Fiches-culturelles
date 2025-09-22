import * as Vite from 'vite';
import './routes-CZR-bKRt.js';
import 'valibot';

type ReactRouterVitePlugin = () => Vite.Plugin[];
/**
 * React Router [Vite plugin.](https://vitejs.dev/guide/using-plugins.html)
 */
declare const reactRouterVitePlugin: ReactRouterVitePlugin;

export { reactRouterVitePlugin as reactRouter };
