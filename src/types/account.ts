export interface IAccount {
    privateKey: string;
    address: string;
    youtube: any;
    firstName: string;
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
