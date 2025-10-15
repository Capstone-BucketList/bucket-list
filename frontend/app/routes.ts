import {type RouteConfig, index, route} from "@react-router/dev/routes";

export default [
    index('routes/home/home.tsx'),
    route('/community', 'routes/community/community.tsx'),
    route('/scrapbook', 'routes/scrapbook/scrapbook.tsx'),
    // route('/profile/:username', 'routes/profile.tsx'),

] satisfies RouteConfig;
