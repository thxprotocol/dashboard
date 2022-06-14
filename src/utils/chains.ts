import { ChainInfo } from '@/types/ChainInfo';
import { ChainId } from '@/types/enums/ChainId';

const chainInfo: { [chainId: number]: ChainInfo } = {
    80001: {
        chainId: ChainId.PolygonMumbai,
        name: 'Polygon Mumbai (testnet)',
        logo: require('@/assets/thx_logo_polygon.svg'),
        blockExplorer: 'https://mumbai.polygonscan.com',
    },
    137: {
        chainId: ChainId.Polygon,
        name: 'Polygon',
        logo: require('@/assets/thx_logo_polygon.svg'),
        blockExplorer: 'https://polygonscan.com',
    },
};

if (process.env.NODE_ENV !== 'production') {
    chainInfo[ChainId.Hardhat] = {
        chainId: ChainId.Hardhat,
        name: 'Hardhat',
        logo: require('@/assets/thx_logo_hardhat.svg'),
        blockExplorer: 'https://hardhatscan.com',
    };
}

export { chainInfo };
