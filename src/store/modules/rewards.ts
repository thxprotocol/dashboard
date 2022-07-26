import { Vue } from 'vue-property-decorator';
import axios from 'axios';
import { Module, VuexModule, Action, Mutation } from 'vuex-module-decorators';
import { IRewardCondition, IRewards, Reward } from '@/types/rewards';

@Module({ namespaced: true })
class RewardModule extends VuexModule {
    _all: IRewards = {};

    get all() {
        return this._all;
    }

    @Mutation
    set(reward: Reward) {
        if (!this._all[reward.poolId]) {
            Vue.set(this._all, reward.poolId, {});
        }
        Vue.set(this._all[reward.poolId], reward.id, reward);
    }

    @Action({ rawError: true })
    async list(poolId: string) {
        const r = await axios({
            method: 'GET',
            url: '/rewards',
            headers: { 'X-PoolId': poolId },
        });

        for (const reward of r.data) {
            this.context.commit('set', reward);
        }
    }

    @Action({ rawError: true })
    async create(payload: {
        slug: string;
        title: string;
        poolId: string;
        erc721metadataId: string;
        withdrawLimit: number;
        withdrawAmount: number;
        withdrawDuration: number;
        withdrawUnlockDate: Date;
        isClaimOnce: boolean;
        isMembershipRequired: boolean;
        withdrawCondition?: IRewardCondition;
        expiryDate?: string;
        amount: number;
    }) {
        const r = await axios({
            method: 'POST',
            url: '/rewards',
            headers: { 'X-PoolId': payload.poolId },
            data: {
                slug: payload.slug,
                title: payload.title,
                expiryDate: payload.expiryDate,
                erc721metadataId: payload.erc721metadataId,
                withdrawLimit: payload.withdrawLimit,
                withdrawAmount: payload.withdrawAmount,
                withdrawDuration: payload.withdrawDuration,
                withdrawCondition: payload.withdrawCondition,
                withdrawUnlockDate: payload.withdrawUnlockDate,
                isClaimOnce: payload.isClaimOnce,
                isMembershipRequired: payload.isMembershipRequired,
                amount: payload.amount,
            },
        });

        this.context.commit('set', r.data);
    }

    @Action({ rawError: true })
    async update({ reward, data }: { reward: Reward; data: any }) {
        const r = await axios({
            method: 'PATCH',
            url: `/rewards/${reward.id}`,
            headers: { 'X-PoolId': reward.poolId },
            data,
        });

        this.context.commit('set', r.data);
    }

    @Action({ rawError: true })
    async getQRCodes({ reward }: { reward: Reward }) {
        const { status, data } = await axios({
            method: 'GET',
            url: `/rewards/${reward.id}/claims/qrcode`,
            headers: { 'X-PoolId': reward.poolId },
            responseType: 'blob',
        });
        // Check if job has been queued, meaning file is not available yet
        if (status === 201) return true;
        // Check if response is zip file, meaning job has completed
        if (status === 200 && data.type == 'application/zip') {
            // Fake an anchor click to trigger a download in the browser
            const anchor = document.createElement('a');
            anchor.href = window.URL.createObjectURL(new Blob([data]));
            anchor.setAttribute('download', `${reward._id}_qrcodes.zip`);
            document.body.appendChild(anchor);
            anchor.click();
        }
    }
}

export default RewardModule;
