
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
}
interface IDataListRewards {
    type: number;
}
interface IList {
    rewards: IDataListRewards;
}
interface I {
    chance: number;
    rest_amount: number;
    my_reward_count: number;
    rewards: IRewards[];
    invest_url: string;
    is_login: boolean;
    activity_status: number;
    list: IList[];
}
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
}
interface IDataListRewards {
    type: number;
}
interface IList {
    rewards: IDataListRewards;
}
interface I {
    chance: number;
    rest_amount: number;
    my_reward_count: number;
    rewards: IRewards[];
    invest_url: string;
    is_login: boolean;
    activity_status: number;
    list: IList[];
}