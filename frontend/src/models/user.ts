import { PVPStatics } from "./statistics";

export interface User {
    id: number;
    renown_level: number;
    item_level: number;
    level: number;
    name: string;
    realm: string;
    faction: string;
    class: string;
    covenant: string;
    gender: string;
    race: string;
    spec: string;
    guild: string;
    media: {
        avatar: string;
        main: string;
    }
    pvp_statistcs: PVPStatics
}
