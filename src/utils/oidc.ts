import { BASE_URL } from './secrets';
export const ADMIN_SCOPE = 'openid account:read account:write asset_pools:read asset_pools:write rewards:read members:read members:write withdrawals:write';
export const DASHBOARD_SCOPE = 'openid asset_pools:read asset_pools:write withdrawals:read rewards:write deposits:read deposits:write promotions:read promotions:write';
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
    scope: DASHBOARD_SCOPE
};
