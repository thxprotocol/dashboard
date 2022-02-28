import { Vue } from 'vue-property-decorator';
import axios from 'axios';
import { Module, VuexModule, Action, Mutation } from 'vuex-module-decorators';
import { AssetPool } from './assetPools';

export enum RewardState {
    Disabled = 0,
    Enabled = 1,
}

interface Poll {
    id: number;
    startTime: number;
    endTime: number;
    totalVoted: number;
    withdrawAmount: number;
    withdrawDuration: number;
    yesCounter: number;
    noCounter: number;
}

export class Reward {
    id: number;
    withdrawAmount: number;
    withdrawDuration: number;
    state: RewardState;
    poolAddress: string;
    poll: Poll;
    withdrawCondition: IRewardCondition;

    constructor(data: any) {
        this.id = data.id;
        this.withdrawAmount = data.withdrawAmount;
        this.withdrawDuration = data.withdrawDuration;
        this.state = data.state;
        this.poolAddress = data.poolAddress;
        this.poll = data.poll;
        this.withdrawCondition = data.withdrawCondition;
    }
}

export interface IRewards {
    [address: string]: { [id: string]: Reward };
}

export enum ChannelType {
    None = 0,
    YouTube = 1,
    Twitter = 2,
    Facebook = 3,
}

export enum ChannelAction {
    YouTubeLike = 0,
    YouTubeSubscribe = 1,
    TwitterLike = 2,
    TwitterRetweet = 3,
    TwitterFollow = 4,
}

export const channelList = [
    {
        type: ChannelType.None,
        name: ChannelType[0],
        logoURI: '',
        actions: [],
    },
    {
        type: ChannelType.YouTube,
        name: ChannelType[1],
        logoURI: require('@/assets/logo-youtube.png'),
        actions: [ChannelAction.YouTubeLike, ChannelAction.YouTubeSubscribe],
    },
    {
        type: ChannelType.Twitter,
        name: ChannelType[2],
        logoURI: require('@/assets/logo-twitter.png'),
        actions: [ChannelAction.TwitterLike, ChannelAction.TwitterRetweet, ChannelAction.TwitterFollow],
    },
];
export const channelActionList = [
    {
        type: ChannelAction.YouTubeLike,
        name: 'Like',
        items: [],
    },
    {
        type: ChannelAction.YouTubeSubscribe,
        name: 'Subscribe',
        items: [],
    },
    {
        type: ChannelAction.TwitterLike,
        name: 'Like',
        items: [],
    },
    {
        type: ChannelAction.TwitterRetweet,
        name: 'Retweet',
        items: [],
    },
    {
        type: ChannelAction.TwitterFollow,
        name: 'Follow',
        items: [],
    },
];

export interface IRewardCondition {
    channelType: ChannelType;
    channelAction: ChannelAction;
    channelItem: any;
}

export interface IChannel {
    type: ChannelType;
    name: string;
    logoURI: string;
    actions: ChannelAction[];
}

export interface IChannelAction {
    type: ChannelAction;
    name: string;
    items: any[];
}

@Module({ namespaced: true })
class RewardModule extends VuexModule {
    _all: IRewards = {};

    get all() {
        return this._all;
    }

    @Mutation
    set(reward: Reward) {
        if (!this._all[reward.poolAddress]) {
            Vue.set(this._all, reward.poolAddress, {});
        }
        Vue.set(this._all[reward.poolAddress], reward.id, reward);
    }

    @Action
    async read(address: string) {
        try {
            const r = await axios({
                method: 'GET',
                url: '/rewards',
                headers: { AssetPool: address },
            });
            if (r.status !== 200) {
                throw new Error('GET all rewards failed');
            }
            for (const reward of r.data) {
                this.context.commit('set', new Reward(reward));
            }
        } catch (e) {
            console.error(e);
        }
    }

    @Action
    async create({
        address,
        withdrawAmount,
        withdrawDuration,
        isClaimOnce,
        isMembershipRequired,
        withdrawCondition,
    }: {
        address: string;
        withdrawAmount: number;
        withdrawDuration: number;
        isClaimOnce: boolean;
        isMembershipRequired: boolean;
        withdrawCondition?: IRewardCondition;
    }) {
        try {
            const r = await axios({
                method: 'POST',
                url: '/rewards',
                headers: {
                    AssetPool: address,
                },
                data: {
                    withdrawAmount,
                    withdrawDuration,
                    withdrawCondition,
                    isClaimOnce,
                    isMembershipRequired,
                },
            });

            if (r.status !== 200) {
                throw new Error('POST rewards failed');
            }
            this.context.commit('set', new Reward(r.data));
        } catch (e) {
            console.log(e);
            debugger;
        }
    }

    @Action
    async finalize(reward: Reward) {
        try {
            const r = await axios({
                method: 'POST',
                url: `/rewards/${reward.id}/poll/finalize`,
                headers: {
                    AssetPool: reward.poolAddress,
                },
            });

            if (r.status !== 200) {
                throw new Error('POST rewards/:id/finalize failed');
            }

            this.context.commit('set', new Reward(r.data));
        } catch (e) {
            console.log(e);
            debugger;
        }
    }

    @Action
    async update({ reward, data }: { reward: Reward; data: any }) {
        try {
            const r = await axios({
                method: 'PATCH',
                url: `/rewards/${reward.id}`,
                headers: {
                    AssetPool: reward.poolAddress,
                },
                data,
            });

            if (r.status !== 200) {
                throw new Error('PATCH rewards failed');
            }

            this.context.commit('set', new Reward(r.data));
        } catch (e) {
            console.log(e);
            debugger;
        }
    }
}

export default RewardModule;
