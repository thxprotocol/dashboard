import { AccountPlanType } from '../types/account';

export const plans = [
    {
        type: AccountPlanType.Free,
        name: 'Free',
        text: 'No-cost. $0/month',
    },
    {
        type: AccountPlanType.Basic,
        name: 'Basic',
        text: 'Individuals. $89/month',
    },
    {
        type: AccountPlanType.Premium,
        name: 'Premium',
        text: 'Advanced commmunity engagement',
    },
];
