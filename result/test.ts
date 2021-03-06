
export interface IThird {
    fourth: boolean;
}
export interface IRew {
    rew_name: string;
    third: IThird;
}
export interface IRewards {
    tel: string;
    rew: IRew;
}
export interface IActivityDoublexxxDetailDataListRewards {
    type: number;
}
export interface IList {
    rewards: IActivityDoublexxxDetailDataListRewards;
}
export interface IActivityDoublexxxDetail {
    chance: number;
    rest_amount: number;
    my_reward_count: number;
    rewards: IRewards[];
    invest_url: string;
    is_login: boolean;
    activity_status: number;
    list: IList[];
}