
interface IRewards {
    mobile: string;
    reward_name: string;
}
interface IActivityDoubleelevenIndex {
    chance: number;
    rest_amount: number;
    my_reward_count: number;
    rewards: IRewards[];
    invest_url: string;
    is_login: boolean;
    activity_status: number;
}
interface IActivityDoublexxxDetailRewards {
    tel: string;
    rew_name: string;
}
interface IActivityDoublexxxDetail {
    chance: number;
    rest_amount: number;
    my_reward_count: number;
    rewards: IActivityDoublexxxDetailRewards[];
    invest_url: string;
    is_login: boolean;
    activity_status: number;
}