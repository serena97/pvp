import { PVPStatics } from "../models/statistics";
import { User } from "../models/user";

const classColors = new Map([
    ['Death Knight', '#C41E3A'],
    ['Demon Hunter', '#A330C9'],
    ['Druid', '#FF7C0A'],
    ['Hunter', '#AAD372'],
    ['Mage', '#3FC7EB'],
    ['Monk', '#00FF98'],
    ['Paladin', '#F48CBA'],
    ['Priest', '#FFFFFF'],
    ['Rogue', '#FFF468'],
    ['Shaman', '#0070DD'],
    ['Warlock', '#8788EE'],
    ['Warrior', '#C69B6D'],
])

export default async function getUser(profileName: string, realmSlug: string, region: string) { 
    const response = await fetch(`http://localhost:8080/api/v1/character/${region}/${realmSlug}/${profileName}`);
    
    const avatar = document.getElementById('avatar');
    const name = document.getElementById('name');
    const itemLvl = document.getElementById('item-lvl');
    const profileTitle = document.getElementById('character-title');

    [avatar, name, itemLvl, profileTitle].forEach(node => removeChildren(node));

    if(!response.ok) {
        console.error('Profile not found');
        displayUserNotFound(name, profileName);
        return;
    }

    const user: User = await response.json();
    
    setBackground(user.media.main);
    setProfileName(name, user.name, user.class, user.faction);
    setAvatar(avatar, user.media.avatar);
    setItemLevel(itemLvl, user.item_level);
    setProfileTitle(profileTitle, user);

    setPvpStatistics(user.pvp_statistcs);

    setCardVisibility()
}

function displayUserNotFound(message: HTMLElement, profileName: string) {
    message.textContent = `${profileName} Not Found`;
    message.style.color = "white";
    const cards = document.getElementsByClassName('card') as HTMLCollectionOf<HTMLElement>;
    cards[0].style.visibility = 'visible' 
    cards[1].style.visibility = 'hidden' 
}

function setBackground(url: string) {
    const background = document.getElementsByClassName('background')[0] as HTMLElement;
    background.style['background-image'] = `url(${url})`
}

function setProfileName(name: HTMLElement, username: string, userClass: string, faction: string) {
    name.textContent = username;
    name.style.color = classColors.get(userClass) ?? '#FFFFFF';

    const logo = document.createElement('img');
    logo.src = faction === 'Alliance' ? 'assets/Logo-alliance.png' : 'assets/Logo-horde.png';
    name.appendChild(logo)
}

function setAvatar(avatar: HTMLElement, avatarUrl: string) {
    const img = document.createElement('img');
    img.src = avatarUrl;
    avatar.appendChild(img);
}

function setItemLevel(itemLvl: HTMLElement, level: number) {
    itemLvl.textContent = `${level} ILVL`
}

function setProfileTitle(profileTitle: HTMLElement, user: User) {
    const guild = user.guild ? `<${user.guild}>` : ''
    profileTitle.textContent = `${user.level} ${user.race} ${user.spec} ${user.class} ${guild} ${user.realm}`
}

function removeChildren(node: HTMLElement) {
    while (node.firstChild) {
        node.removeChild(node.lastChild);
    }
}

function setPvpStatistics(pvpstats: PVPStatics) {
    const table = document.querySelector("table");
    removeChildren(table);
    const thead = table.createTHead();
    const cols = ['', 'Current Rating', 'Season High', 'Highest Rating']
    const headerRow = thead.insertRow();
    cols.forEach(col => {
        const th = document.createElement('th');
        const text = document.createTextNode(col);
        th.appendChild(text);
        headerRow.appendChild(th);
    })

    Object.entries(pvpstats).forEach(([key, value]) => {
        const row = table.insertRow();
        insertCell(row, key);
        insertCell(row, value.current_rating);
        insertCell(row, value.season_highest_rating);
        insertCell(row, value.highest_rating);
    })
}

function insertCell(row: HTMLTableRowElement, stat: any) {
    const cell = row.insertCell();
    const text = document.createTextNode(stat);
    cell.appendChild(text)
}

function setCardVisibility(): void {
    const cards = document.getElementsByClassName('card');
    for(const card of cards) {
        (card as HTMLElement).style.visibility = 'visible' 
    }
}


