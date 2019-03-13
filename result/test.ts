
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
interface undefinedThird {
    fourth: boolean;
}
interface undefinedRew {
    rew_name: string;
    third: undefinedThird;
}
interface undefinedRewards {
    tel: string;
    rew: undefinedRew;
    type: number;
}
interface IList {
    rewards: undefinedRewards;
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