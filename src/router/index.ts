import store from '@/store';
import {
    assertAuthorization,
    redirectAccount,
    redirectConfirmationLink,
    redirectPasswordResetLink,
    redirectSignin,
    redirectSigninSilent,
    redirectSignout,
    redirectSignup,
} from '@/utils/guards';
import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
    {
        path: '/',
        component: () => import('../views/Home.vue'),
        beforeEnter: assertAuthorization,
    },
    {
        path: '/tokens',
        component: () => import('../views/Tokens.vue'),
        beforeEnter: assertAuthorization,
    },
    {
        path: '/nft',
        component: () => import('../views/NFT.vue'),
        beforeEnter: assertAuthorization,
    },
    {
        path: '/pools',
        component: () => import('../views/Pools.vue'),
        beforeEnter: assertAuthorization,
    },
    {
        name: 'pool',
        path: '/pool/:address',
        component: () => import('../views/Pool.vue'),
        beforeEnter: assertAuthorization,
        children: [
            {
                path: 'info',
                component: () => import('../views/pool/Info.vue'),
            },
            {
                path: 'metadata',
                component: () => import('../views/pool/Metadata.vue'),
            },
            {
                path: 'rewards',
                component: () => import('../views/pool/Rewards.vue'),
            },
            {
                path: 'widgets',
                component: () => import('../views/pool/Widgets.vue'),
            },
            {
                path: 'promotions',
                component: () => import('../views/pool/Promotions.vue'),
            },
            {
                path: 'members',
                component: () => import('../views/pool/Members.vue'),
            },
        ],
    },
    {
        path: '/integrations',
        name: 'Integrations',
        component: () => import('../views/Integrations.vue'),
        beforeEnter: assertAuthorization,
    },
    {
        path: '/signin-oidc',
        component: () => import('../views/SigninRedirect.vue'),
    },
    {
        path: '/reset',
        beforeEnter: redirectPasswordResetLink,
    },
    {
        path: '/account',
        beforeEnter: redirectAccount,
    },
    {
        path: '/signup',
        beforeEnter: redirectSignup,
    },

    {
        path: '/signout',
        beforeEnter: redirectSignout,
    },
    {
        path: '/verify',
        beforeEnter: redirectConfirmationLink,
    },
    {
        path: '/signin',
        beforeEnter: redirectSignin,
    },
    {
        path: '/silent-renew',
        beforeEnter: redirectSigninSilent,
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
