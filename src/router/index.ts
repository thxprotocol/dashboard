import store from '@/store';
import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
    {
        path: '/',
        redirect: '/pools',
    },
    {
        path: '/pools',
        component: () => import('../views/Home.vue'),
        meta: {
            requiresAuth: true,
        },
    },
    {
        name: 'pool',
        path: '/pool/:address',
        component: () => import('../views/AssetPool.vue'),
        meta: {
            requiresAuth: true,
        },
        children: [
            {
                path: 'info',
                component: () => import('../views/AssetPool/Info.vue'),
            },
            {
                path: 'rewards',
                component: () => import('../views/AssetPool/Rewards.vue'),
            },
            {
                path: 'widgets',
                component: () => import('../views/AssetPool/Widgets.vue'),
            },
            {
                path: 'authorization',
                component: () => import('../views/AssetPool/Authorization.vue'),
            },
        ],
    },
    {
        path: '/integrations',
        name: 'Integrations',
        component: () => import('../views/Integrations.vue'),
        meta: {
            requiresAuth: true,
        },
    },
    {
        path: '/account',
        component: () => import('../views/Account.vue'),
    },
    {
        path: '/signup',
        component: () => import('../views/Signup.vue'),
    },
    {
        path: '/verify',
        meta: {
            requiresAuth: true,
        },
    },
    {
        path: '/login',
        component: () => import('../views/Signin.vue'),
    },
    {
        path: '/signin-oidc',
        component: () => import('../views/SigninRedirect.vue'),
    },
    {
        path: '/silent-renew',
        component: () => import('../views/SilentRenew.vue'),
    },
    {
        path: '/account',
        name: 'Account',
        component: () => import('../views/Account.vue'),
        meta: {
            requiresAuth: true,
        },
    },
];

const router = new VueRouter({
    mode: 'history',
    routes,
});

router.beforeEach(async (to, from, next) => {
    const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);

    if (to.query.passwordResetToken) {
        await store.dispatch('account/signinRedirect', {
            passwordResetToken: to.query.passwordResetToken,
        });
    }

    try {
        const user = await store.dispatch('account/getUser');

        if (requiresAuth && !user) {
            await store.dispatch('account/signinRedirect', {
                signupToken: to.query.signup_token || null,
            });
        } else {
            return next();
        }
    } catch (err) {
        console.error(err);
    }
});

export default router;
