export enum AccountPlanType {
    Solo = 0,
    Community = 1,
    Creator = 2,
}

export interface IAccount {
    privateKey: string;
    address: string;
    youtube: any;
    firstName: string;
    lastName: string;
    company: string;
    plan: AccountPlanType;
}
export interface IAccountUpdates {
    address: string;
    googleAccessToken: string;
}

export interface IYoutube {
    channels: any;
    videos: any;
}

export interface ITwitter {
    tweets: any;
    users: any;
}

export interface ISpotify {
    playlists: any;
    items: any;
    users: any;
}
