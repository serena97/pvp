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
]);
async function getUser() {
    var _a;
    const response = await fetch('https://cc00df208b9c.ngrok.io/api/v1/eu/stormscale/devzx');
    if (!response.ok) {
        console.error('error');
    }
    const user = await response.json();
    const color = (_a = classColors.get(user.class)) !== null && _a !== void 0 ? _a : '#FFFFFF';
    const background = document.getElementsByClassName('background')[0];
    background.style['background-image'] = `url(${user.media.main})`;
    const name = document.getElementById('name');
    name.textContent = user.name;
    name.style.color = color;
    const logo = document.createElement('img');
    logo.src = user.faction === 'Alliance' ? 'assets/Logo-alliance.png' : 'assets/Logo-horde.png';
    name.appendChild(logo);
    const avatar = document.getElementById('avatar');
    const img = document.createElement('img');
    img.src = user.media.avatar;
    avatar.appendChild(img);
    const itemLvl = document.getElementById('item-lvl');
    itemLvl.textContent = `${user.item_level} ILVL`;
    const characterTitle = document.getElementById('character-title');
    const guild = user.guild ? `<${user.guild}>` : '';
    characterTitle.textContent = `${user.level} ${user.race} ${user.spec} ${user.class} ${guild} ${user.realm}`;
}
getUser();
//# sourceMappingURL=index.js.map