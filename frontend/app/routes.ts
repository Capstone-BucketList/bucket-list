import {type RouteConfig, index, route, layout} from "@react-router/dev/routes";

export default [
    layout('layouts/main.tsx', [
    index('routes/home/home.tsx'),
    route('/community', 'routes/community/community.tsx'),
    route('/groups', 'routes/groups/groups.tsx'),
    route('/scrapbook', 'routes/scrapbook/scrapbook.tsx'),
    route('/profile', 'routes/profile/profile.tsx'),
    route('/dashboard', 'routes/profile/dashboard.tsx'),
    //route('/dashboard/:addWanderList', 'routes/profile/wanderlist.tsx'),
    route('/signup','routes/signup/signup.tsx'),
    route('/login','routes/login/login.tsx'),
        route('/logout','routes/logout/logout.tsx'),
            //route('/settings','routes/setting/setting.tsx')
        route("/settings", "routes/setting/my-profile.tsx"),
        route('/community/follow', 'routes/community/followprofile.tsx'),
        route('/dashboard/unfollow', 'routes/profile/unfollowprofile.tsx'),
        route('/dashboard/createpost', 'routes/profile/createpost.tsx'),
    ]),
] satisfies RouteConfig;

