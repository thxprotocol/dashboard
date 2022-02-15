import axios from 'axios';
import { Module, VuexModule, Action, Mutation } from 'vuex-module-decorators';
import { User, UserManager } from 'oidc-client';
import { ChannelType } from './rewards';

const BASE_URL = process.env.VUE_APP_BASE_URL;

export interface IAccount {
    privateKey: string;
    address: string;
    youtube: any;
}
export interface IAccountUpdates {
    address: string;
    googleAccessToken: string;
}

const config: any = {
    authority: process.env.VUE_APP_AUTH_URL,
    client_id: process.env.VUE_APP_OIDC_CLIENT_ID,
    client_secret: process.env.VUE_APP_OIDC_CLIENT_SECRET,
    redirect_uri: `${BASE_URL}/signin-oidc`,
    response_type: 'code',
    id_token_signed_response_alg: 'RS256',
    post_logout_redirect_uri: BASE_URL,
    silent_redirect_uri: `${BASE_URL}/silent-renew`,
    automaticSilentRenew: true,
    loadUserInfo: true,
    scope: 'openid dashboard',
};

export interface IYoutube {
    channels: any;
    videos: any;
}

export interface ITwitter {
    tweets: any;
    users: any;
}

export interface ISpotify {
    songs: any;
}

@Module({ namespaced: true })
class AccountModule extends VuexModule {
    userManager: UserManager = new UserManager(config);
    _user!: User;
    _profile: IAccount | null = null;
    _youtube: IYoutube | null = null;
    _twitter: ITwitter | null = null;
    _spotify: ISpotify | null = null;

    get user() {
        return this._user;
    }

    get profile() {
        return this._profile;
    }

    get youtube() {
        return this._youtube;
    }

    get twitter() {
        return this._twitter;
    }

    get spotify() {
        return this._spotify;
    }

    @Mutation
    setUser(user: User) {
        this._user = user;
    }

    @Mutation
    setAccount(profile: IAccount) {
        this._profile = profile;
    }

    @Mutation
    setYoutube(data: IYoutube) {
        this._youtube = data;
    }

    @Mutation
    setTwitter(data: ITwitter) {
        this._twitter = data;
    }

    @Mutation
    setSpotify(data: ISpotify) {
        this._spotify = data;
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

            this.context.commit('setAccount', r.data);

            return r.data;
        } catch (e) {
            return e;
        }
    }

    @Action
    async getYoutube() {
        try {
            const r = await axios({
                method: 'GET',
                url: '/account/youtube',
            });

            if (r.status !== 200) {
                throw Error('GET /connect/youtube failed.');
            }

            if (r.data.isAuthorized) {
                this.context.commit('setYoutube', r.data);

                return { youtube: r.data, isAuthorized: r.data.isAuthorized };
            }

            return {
                isAuthorized: false,
            };
        } catch (error) {
            return { error };
        }
    }

    @Action
    async getTwitter() {
        try {
            const r = await axios({
                method: 'GET',
                url: '/account/twitter',
            });

            if (r.status !== 200) {
                throw Error('GET /connect/twitter failed.');
            }

            if (r.data.isAuthorized) {
                this.context.commit('setTwitter', r.data);

                return { twitter: r.data, isAuthorized: r.data.isAuthorized };
            }

            return {
                isAuthorized: false,
            };
        } catch (error) {
            return { error };
        }
    }

    @Action
    async getSpotify() {
        try {
            const r = await axios({
                method: 'GET',
                url: '/account/spotify',
            });

            if (r.status !== 200) {
                throw Error('GET /connect/spotify failed.');
            }

            if (r.data.isAuthorized) {
                this.context.commit('setSpotify', r.data);

                return { spotify: r.data };
            }

            return {
                isAuthorized: false,
            };
        } catch (error) {
            return { error };
        }
    }

    @Action
    async update(data: IAccountUpdates) {
        try {
            const r = await axios({
                method: 'PATCH',
                url: '/account',
                data,
            });

            if (r.status !== 200) {
                throw Error('PATCH /account failed.');
            }

            this.context.commit('setAccount', r.data);
        } catch (e) {
            return e;
        }
    }

    @Action
    async connectRedirect(channel: ChannelType) {
        try {
            await this.userManager.signinRedirect({
                extraQueryParams: { channel, prompt: 'connect', return_url: BASE_URL + '/integrations' },
            });
        } catch (error) {
            return { error };
        }
    }

    @Action
    async signinRedirect(payload: { signupToken: string; signupEmail: string; passwordResetToken: string }) {
        try {
            const extraQueryParams: any = {
                return_url: BASE_URL,
            };

            if (payload.signupToken) {
                extraQueryParams['prompt'] = 'confirm';
                extraQueryParams['signup_token'] = payload.signupToken;
            }

            if (payload.passwordResetToken) {
                extraQueryParams['prompt'] = 'reset';
                extraQueryParams['password_reset_token'] = payload.passwordResetToken;
            }

            await this.userManager.clearStaleState();

            return await this.userManager.signinRedirect({
                extraQueryParams,
            });
        } catch (e) {
            return e;
        }
    }

    @Action
    async signupRedirect() {
        try {
            await this.userManager.clearStaleState();
            const url = new URL(window.location.href);
            const signupEmail = url.searchParams.get('signup_email');

            const extraQueryParams: any = {
                prompt: 'create',
                return_url: BASE_URL,
            };

            if (signupEmail) {
                extraQueryParams['signup_email'] = signupEmail;
            }

            return await this.userManager.signinRedirect({
                extraQueryParams,
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
