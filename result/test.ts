
interface IThird {
    fourth: boolean;
}
interface IRew {
    rew_name: string;
    third: IThird;
}
interface IRewards {
    tel: string;
    rew: IRew;
    type: number;
}
interface IActivityDoublexxxDetailListRewardsRewThird {
    fourth: boolean;
}
interface IActivityDoublexxxDetailListRewardsRew {
    rew_name: string;
    third: IActivityDoublexxxDetailListRewardsRewThird;
}
interface IActivityDoublexxxDetailListRewards {
    tel: string;
    rew: IActivityDoublexxxDetailListRewardsRew;
    type: number;
}
interface IList {
    rewards: IActivityDoublexxxDetailListRewards;
}
interface IActivityDoublexxxDetail {
    chance: number;
    rest_amount: number;
    my_reward_count: number;
    rewards: IRewards[];
    invest_url: string;
    is_login: boolean;
    activity_status: number;
    list: IList[];
}