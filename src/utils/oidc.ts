import { BASE_URL } from './secrets';

export const config: any = {
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
