import { Vue } from 'vue-property-decorator';
import axios from 'axios';
import { Module, VuexModule, Action, Mutation } from 'vuex-module-decorators';

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

    constructor(data: any) {
        this.id = data.id;
        this.withdrawAmount = data.withdrawAmount;
        this.withdrawDuration = data.withdrawDuration;
        this.state = data.state;
        this.poolAddress = data.poolAddress;
        this.poll = data.poll;
    }
}

export interface IRewards {
    [address: string]: { [id: string]: Reward };
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
                this.context.commit('set', new Reward({ ...reward, ...{ poolAddress: address } }));
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
    }: {
        address: string;
        withdrawAmount: number;
        withdrawDuration: number;
    }) {
        try {
            const r = await axios({
                method: 'POST',
                url: '/rewards',
                headers: {
                    AssetPool: address,
                },
                data: {
                    withdrawAmount: withdrawAmount,
                    withdrawDuration: withdrawDuration,
                },
            });

            if (r.status !== 200) {
                throw new Error('POST rewards failed');
            }
            this.context.commit('set', new Reward({ ...r.data, ...{ poolAddress: address } }));
        } catch (e) {
            console.log(e);
            debugger;
        }
    }
}

export default RewardModule;
