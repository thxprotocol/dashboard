import axios from 'axios';
import { Module, VuexModule, Action, Mutation } from 'vuex-module-decorators';
import { User, UserManager } from 'oidc-client';

export class SignupRequest {
    firstName!: string;
    lastName!: string;
    email!: string;
    address!: string;
}

export class Account {
    privateKey = '';
    address = '';
    email = '';
    firstName = '';
    lastName = '';
    assetPools: string[] = [];
    burnProofs: string[] = [];
    registrationAccessTokens: string[] = [];
}
export interface UserProfile {
    address: string;
    privateKey: string;
    burnProofs: string[];
    memberships: string[];
    registrationAccessTokens: string[];
}

const config: any = {
    authority: process.env.VUE_APP_API_ROOT,
    client_id: process.env.VUE_APP_OIDC_CLIENT_ID,
    client_secret: process.env.VUE_APP_OIDC_CLIENT_SECRET,
    redirect_uri: `${process.env.VUE_APP_BASE_URL}/signin-oidc`,
    response_type: 'code',

    id_token_signed_response_alg: 'RS256',
    post_logout_redirect_uri: process.env.VUE_APP_BASE_URL,

    silent_redirect_uri: `${process.env.VUE_APP_BASE_URL}/silent-renew`,
    automaticSilentRenew: true,

    loadUserInfo: true,
    scope: 'openid user dashboard',
};

@Module({ namespaced: true })
class AccountModule extends VuexModule {
    userManager: UserManager = new UserManager(config);
    _user!: User;
    _profile: UserProfile | null = null;

    get user() {
        return this._user;
    }

    get privateKey() {
        if (!this.user) {
            return '';
        }
        return sessionStorage.getItem(`thx:wallet:user:${this.user.profile.sub}:key`);
    }

    get profile() {
        return this._profile;
    }

    @Mutation
    setUser(user: User) {
        this._user = user;
    }

    @Mutation
    setUserProfile(profile: UserProfile) {
        this._profile = profile;
    }

    @Action
    async getUser() {
        try {
            const user = await this.userManager.getUser();

            this.context.commit('setUser', user);

            return user;
        } catch (e) {
            return e;
        }
    }

    @Action
    async getProfile() {
        try {
            const r = await axios({
                method: 'GET',
                url: '/account',
            });

            if (r.status !== 200) {
                throw Error('GET /account failed.');
            }

            this.context.commit('setUserProfile', r.data);

            return r.data;
        } catch (e) {
            return e;
        }
    }

    @Action
    async update(data: UserProfile) {
        try {
            const r = await axios({
                method: 'PATCH',
                url: '/account',
                data,
            });

            if (r.status !== 200) {
                throw Error('PATCH /account failed.');
            }

            this.context.commit('setUserProfile', r.data);
        } catch (e) {
            return e;
        }
    }

    @Action
    async signinRedirect(payload: { signupToken: string }) {
        try {
            await this.userManager.clearStaleState();

            return await this.userManager.signinRedirect(
                payload.signupToken
                    ? {
                          extraQueryParams: { signup_token: payload.signupToken },
                      }
                    : {},
            );
        } catch (e) {
            return e;
        }
    }

    @Action
    async signupRedirect() {
        try {
            await this.userManager.clearStaleState();

            return await this.userManager.signinRedirect({
                prompt: 'create',
                extraQueryParams: { email: 'peter@peterpolman.nl' },
            });
        } catch (e) {
            return e;
        }
    }

    @Action
    async signinRedirectCallback() {
        try {
            const user = await this.userManager.signinRedirectCallback();

            this.context.commit('setUser', user);

            return user;
        } catch (e) {
            return e;
        }
    }

    @Action
    async signoutRedirect() {
        try {
            await this.userManager.signoutRedirect({});

            this.context.commit('setUser', null);
        } catch (e) {
            return e;
        }
    }

    @Action
    async signout() {
        try {
            await this.userManager.removeUser();
            await this.userManager.clearStaleState();

            await axios({
                method: 'GET',
                url: config.authority + '/session/end',
            });
        } catch (e) {
            return e;
        }
    }

    @Action
    async signinSilent() {
        try {
            return await this.userManager.signinSilent();
        } catch (e) {
            return e;
        }
    }
}

export default AccountModule;
