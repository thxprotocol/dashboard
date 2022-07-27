import { IPool } from '@/store/modules/pools';

export const getRoutes = (pool: IPool) => {
    const routes = [
        {
            path: 'metadata',
            label: 'Metadata',
            iconClasses: 'fas fa-palette',
            visible: pool.isNFTPool,
        },
        {
            path: 'rewards',
            label: 'Rewards',
            iconClasses: 'fas fa-award',
            visible: pool.isDefaultPool || pool.isNFTPool,
        },
        {
            path: 'payments',
            label: 'Payments',
            iconClasses: 'fas fa-money-check-alt',
            visible: pool.isDefaultPool,
        },
        {
            path: 'promotions',
            label: 'Promotions',
            iconClasses: 'fas fa-tags',
            visible: pool.isDefaultPool,
        },
        {
            path: 'widgets',
            label: 'Widgets',
            iconClasses: 'fas fa-code',
            visible: pool.isDefaultPool,
        },
        {
            path: 'members',
            label: 'Members',
            iconClasses: 'fas fa-user',
            visible: pool.isDefaultPool || pool.isNFTPool,
        },
        {
            path: 'transactions',
            label: 'Analytics',
            iconClasses: 'fas fa-chart-line',
            visible: pool.isDefaultPool,
        },
        {
            path: 'erc20swaps',
            label: 'Swaps',
            iconClasses: 'fas fa-sync',
            visible: pool.isDefaultPool,
        },
        {
            path: 'theme',
            label: 'Theme',
            iconClasses: 'fas fa-palette',
            visible: pool.isDefaultPool || pool.isNFTPool,
        },
        {
            path: 'clients',
            label: 'Authorization',
            iconClasses: 'fas fa-key',
            visible: pool.isDefaultPool || pool.isNFTPool,
        },
        {
            path: 'info',
            label: 'Information',
            iconClasses: 'fas fa-info-circle',
            visible: pool.isDefaultPool || pool.isNFTPool,
        },
    ];

    return routes.filter((r: { visible: boolean }) => r.visible);
};
