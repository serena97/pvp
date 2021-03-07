/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/services/realmService.ts":
/*!**************************************!*\
  !*** ./src/services/realmService.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RealmServiceSingleton": () => (/* binding */ RealmServiceSingleton)
/* harmony export */ });
class RealmService {
    constructor() {
        this.limit = 10;
        this.initializeRealms();
    }
    async initializeRealms() {
        const response = await fetch(`http://localhost:8080/api/v1/realms`);
        if (!response.ok) {
            console.error('error');
        }
        const realms = await response.json();
        this.realms = realms;
    }
    getRealms() {
        return this.realms;
    }
    getMatchingRealms(typedRealm) {
        const matchingRealms = [];
        for (const realm of this.realms) {
            if (realm.name.substr(0, typedRealm.length).toUpperCase() === typedRealm.toUpperCase()) {
                matchingRealms.push(realm);
                if (matchingRealms.length > 9) {
                    break;
                }
            }
        }
        return matchingRealms;
    }
    getDefaultRealms(endIndex = this.limit - 1) {
        return this.realms.slice(0, endIndex);
    }
}
const RealmServiceSingleton = new RealmService();


/***/ }),

/***/ "./src/services/searchService.ts":
/*!***************************************!*\
  !*** ./src/services/searchService.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ autocomplete)
/* harmony export */ });
/* harmony import */ var _userService__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./userService */ "./src/services/userService.ts");
/* harmony import */ var _realmService__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./realmService */ "./src/services/realmService.ts");


function closeAllLists() {
    const items = document.getElementsByClassName('autocomplete-items');
    for (let i = 0; i < items.length; i++) {
        items[i].parentNode.removeChild(items[i]);
    }
}
function addItem(list, item, profile, realm, region) {
    item.innerHTML += `<span><img class="region" src="assets/${region}.svg"></span>`;
    item.dataset.profile = profile;
    item.dataset.realm = realm;
    item.dataset.region = region;
    list.appendChild(item);
    item.addEventListener('click', function (e) {
        if (e.target.dataset) {
            (0,_userService__WEBPACK_IMPORTED_MODULE_0__.default)(e.target.dataset.profile, e.target.dataset.realm, e.target.dataset.region);
        }
        closeAllLists();
    });
}
function displayDefaultRealms(realms, typedProfile, list) {
    realms.forEach(realm => {
        const item = document.createElement("div");
        item.innerHTML = "<strong>" + typedProfile + "</strong>";
        item.innerHTML += ' - ' + realm.name;
        addItem(list, item, typedProfile, realm.slug, realm.region);
    });
}
function displayRealms(typedValue, list) {
    const matchedRealm = typedValue.split('-')[1];
    const typedProfile = typedValue.split('-')[0];
    if (matchedRealm === null || matchedRealm === void 0 ? void 0 : matchedRealm.length) {
        const matchingRealms = _realmService__WEBPACK_IMPORTED_MODULE_1__.RealmServiceSingleton.getMatchingRealms(matchedRealm);
        matchingRealms.forEach(realm => {
            const matchingRealm = matchedRealm.charAt(0).toUpperCase() + matchedRealm.slice(1);
            const profile = typedProfile + ' - ';
            const item = document.createElement("div");
            item.innerHTML = "<strong>" + profile + matchingRealm + "</strong>";
            item.innerHTML += realm.name.substr(matchingRealm.length);
            addItem(list, item, typedProfile, realm.slug, realm.region);
        });
    }
    else {
        const realms = _realmService__WEBPACK_IMPORTED_MODULE_1__.RealmServiceSingleton.getDefaultRealms();
        displayDefaultRealms(realms, typedProfile, list);
    }
}
async function autocomplete(input) {
    input.addEventListener("input", async function (e) {
        closeAllLists();
        let typedValue = this.value.replace(/ /g, '');
        typedValue = typedValue.charAt(0).toUpperCase() + typedValue.slice(1);
        if (!typedValue)
            return false;
        const list = document.createElement('div');
        list.setAttribute("id", this.id + "autocomplete-list");
        list.setAttribute("class", "autocomplete-items");
        this.parentNode.appendChild(list);
        const typedRealm = typedValue.split('-')[1];
        const typedProfile = typedValue.split('-')[0];
        if (typedValue.length > 2) {
            const response = await fetch(`http://localhost:8080/api/v1/character/search?q=${typedProfile}`);
            const characters = await response.json();
            if (characters.length) {
                characters.forEach(character => {
                    if (typedRealm && character.realm.toUpperCase().substring(0, typedRealm.length) !== typedRealm.toUpperCase()) {
                        return;
                    }
                    const item = document.createElement("div");
                    item.innerHTML = "<strong>" + character.name + ' - ' + character.realm + "</strong>";
                    addItem(list, item, character.name, character.realm_slug, character.region);
                });
            }
            displayRealms(typedValue, list);
        }
    });
    document.addEventListener('click', function (e) {
        closeAllLists();
    });
}


/***/ }),

/***/ "./src/services/userService.ts":
/*!*************************************!*\
  !*** ./src/services/userService.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getUser)
/* harmony export */ });
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
async function getUser(profileName, realmSlug, region) {
    const response = await fetch(`http://localhost:8080/api/v1/character/${region}/${realmSlug}/${profileName}`);
    const avatar = document.getElementById('avatar');
    const name = document.getElementById('name');
    const itemLvl = document.getElementById('item-lvl');
    const profileTitle = document.getElementById('character-title');
    [avatar, name, itemLvl, profileTitle].forEach(node => removeChildren(node));
    if (!response.ok) {
        console.error('Profile not found');
        displayUserNotFound(name, profileName);
        return;
    }
    const user = await response.json();
    setBackground(user.media.main);
    setProfileName(name, user.name, user.class, user.faction);
    setAvatar(avatar, user.media.avatar);
    setItemLevel(itemLvl, user.item_level);
    setProfileTitle(profileTitle, user);
    setPvpStatistics(user.pvp_statistcs);
    setCardVisibility();
}
function displayUserNotFound(message, profileName) {
    message.textContent = `${profileName} Not Found`;
    message.style.color = "white";
    const cards = document.getElementsByClassName('card');
    cards[0].style.visibility = 'visible';
    cards[1].style.visibility = 'hidden';
}
function setBackground(url) {
    const background = document.getElementsByClassName('background')[0];
    background.style['background-image'] = `url(${url})`;
}
function setProfileName(name, username, userClass, faction) {
    var _a;
    name.textContent = username;
    name.style.color = (_a = classColors.get(userClass)) !== null && _a !== void 0 ? _a : '#FFFFFF';
    const logo = document.createElement('img');
    logo.src = faction === 'Alliance' ? 'assets/Logo-alliance.png' : 'assets/Logo-horde.png';
    name.appendChild(logo);
}
function setAvatar(avatar, avatarUrl) {
    const img = document.createElement('img');
    img.src = avatarUrl;
    avatar.appendChild(img);
}
function setItemLevel(itemLvl, level) {
    itemLvl.textContent = `${level} ILVL`;
}
function setProfileTitle(profileTitle, user) {
    const guild = user.guild ? `<${user.guild}>` : '';
    profileTitle.textContent = `${user.level} ${user.race} ${user.spec} ${user.class} ${guild} ${user.realm}`;
}
function removeChildren(node) {
    while (node.firstChild) {
        node.removeChild(node.lastChild);
    }
}
function setPvpStatistics(pvpstats) {
    const table = document.querySelector("table");
    removeChildren(table);
    const thead = table.createTHead();
    const cols = ['', 'Current Rating', 'Season High', 'Highest Rating'];
    const headerRow = thead.insertRow();
    cols.forEach(col => {
        const th = document.createElement('th');
        const text = document.createTextNode(col);
        th.appendChild(text);
        headerRow.appendChild(th);
    });
    Object.entries(pvpstats).forEach(([key, value]) => {
        const row = table.insertRow();
        insertCell(row, key);
        insertCell(row, value.current_rating);
        insertCell(row, value.season_highest_rating);
        insertCell(row, value.highest_rating);
    });
}
function insertCell(row, stat) {
    const cell = row.insertCell();
    const text = document.createTextNode(stat);
    cell.appendChild(text);
}
function setCardVisibility() {
    const cards = document.getElementsByClassName('card');
    for (const card of cards) {
        card.style.visibility = 'visible';
    }
}


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _services_searchService__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./services/searchService */ "./src/services/searchService.ts");

(async () => {
    try {
        await (0,_services_searchService__WEBPACK_IMPORTED_MODULE_0__.default)(document.getElementById("input"));
    }
    catch (e) {
        console.error(e);
    }
})();

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9wdnAvLi9zcmMvc2VydmljZXMvcmVhbG1TZXJ2aWNlLnRzIiwid2VicGFjazovL3B2cC8uL3NyYy9zZXJ2aWNlcy9zZWFyY2hTZXJ2aWNlLnRzIiwid2VicGFjazovL3B2cC8uL3NyYy9zZXJ2aWNlcy91c2VyU2VydmljZS50cyIsIndlYnBhY2s6Ly9wdnAvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vcHZwL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9wdnAvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9wdnAvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9wdnAvLi9zcmMvbWFpbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUVBLE1BQU0sWUFBWTtJQUlkO1FBRlMsVUFBSyxHQUFHLEVBQUUsQ0FBQztRQUdoQixJQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztJQUM1QixDQUFDO0lBRUQsS0FBSyxDQUFDLGdCQUFnQjtRQUNsQixNQUFNLFFBQVEsR0FBRyxNQUFNLEtBQUssQ0FBQyxxQ0FBcUMsQ0FBQyxDQUFDO1FBQ3BFLElBQUcsQ0FBQyxRQUFRLENBQUMsRUFBRSxFQUFFO1lBQ2IsT0FBTyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQztTQUMxQjtRQUNELE1BQU0sTUFBTSxHQUFZLE1BQU0sUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDO1FBQzlDLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO0lBQ3pCLENBQUM7SUFHTSxTQUFTO1FBQ1osT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDO0lBQ3ZCLENBQUM7SUFFRCxpQkFBaUIsQ0FBQyxVQUFrQjtRQUNoQyxNQUFNLGNBQWMsR0FBRyxFQUFFO1FBQ3pCLEtBQUksTUFBTSxLQUFLLElB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QUFXLENBQUMsSUFBSSxDQUFDO0FBQzFCLENBQUM7QUFFRCxTQUFTLGlCQUFpQjtJQUN0QixNQUFNLEtBQUssR0FBRyxRQUFRLENBQUMsc0JBQXNCLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDdEQsS0FBSSxNQUFNLElBQUksSUFBSSxLQUFLLEVBQUU7UUFDcEIsSUFBb0IsQ0FBQyxLQUFLLENBQUMsVUFBVSxHQUFHLFNBQVM7S0FDckQ7QUFDTCxDQUFDOzs7Ozs7O1VDM0hEO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3JCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHdDQUF3Qyx5Q0FBeUM7V0FDakY7V0FDQTtXQUNBLEU7Ozs7O1dDUEEsd0Y7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0Esc0RBQXNELGtCQUFrQjtXQUN4RTtXQUNBLCtDQUErQyxjQUFjO1dBQzdELEU7Ozs7Ozs7Ozs7OztBQ05vRDtBQUVwRCxDQUFDLEtBQUssSUFBSSxFQUFFO0lBQ1IsSUFBSTtRQUNBLE1BQU0sZ0VBQVksQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBcUIsQ0FBQyxDQUFDO0tBQzVFO0lBQUMsT0FBTyxDQUFDLEVBQUU7UUFDUixPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQ3BCO0FBQ0wsQ0FBQyxDQUFDLEVBQUUsQ0FBQyIsImZpbGUiOiJidW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBSZWFsbSB9IGZyb20gXCIuLi9tb2RlbHMvcmVhbG1cIjtcblxuY2xhc3MgUmVhbG1TZXJ2aWNlIHtcbiAgICBwcml2YXRlIHJlYWxtczogUmVhbG1bXVxuICAgIHJlYWRvbmx5IGxpbWl0ID0gMTA7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5pbml0aWFsaXplUmVhbG1zKCk7XG4gICAgfVxuXG4gICAgYXN5bmMgaW5pdGlhbGl6ZVJlYWxtcygpIHtcbiAgICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChgaHR0cDovL2xvY2FsaG9zdDo4MDgwL2FwaS92MS9yZWFsbXNgKTtcbiAgICAgICAgaWYoIXJlc3BvbnNlLm9rKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCdlcnJvcicpO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHJlYWxtczogUmVhbG1bXSA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcbiAgICAgICAgdGhpcy5yZWFsbXMgPSByZWFsbXM7XG4gICAgfVxuXG5cbiAgICBwdWJsaWMgZ2V0UmVhbG1zKCk6IFJlYWxtW10ge1xuICAgICAgICByZXR1cm4gdGhpcy5yZWFsbXM7XG4gICAgfVxuICAgIFxuICAgIGdldE1hdGNoaW5nUmVhbG1zKHR5cGVkUmVhbG06IHN0cmluZyk6IFJlYWxtW10ge1xuICAgICAgICBjb25zdCBtYXRjaGluZ1JlYWxtcyA9IFtdXG4gICAgICAgIGZvcihjb25zdCByZWFsbSBvZiB0aGlzLnJlYWxtcykge1xuICAgICAgICAgICAgaWYocmVhbG0ubmFtZS5zdWJzdHIoMCwgdHlwZWRSZWFsbS5sZW5ndGgpLnRvVXBwZXJDYXNlKCkgPT09IHR5cGVkUmVhbG0udG9VcHBlckNhc2UoKSkge1xuICAgICAgICAgICAgICAgIG1hdGNoaW5nUmVhbG1zLnB1c2gocmVhbG0pO1xuICAgICAgICAgICAgICAgIGlmKG1hdGNoaW5nUmVhbG1zLmxlbmd0aCA+IDkpe1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG1hdGNoaW5nUmVhbG1zXG4gICAgfVxuICAgIFxuICAgIGdldERlZmF1bHRSZWFsbXMoZW5kSW5kZXggPSB0aGlzLmxpbWl0IC0gMSk6IFJlYWxtW10ge1xuICAgICAgICByZXR1cm4gdGhpcy5yZWFsbXMuc2xpY2UoMCwgZW5kSW5kZXgpO1xuICAgIH1cbn1cblxuZXhwb3J0IGNvbnN0IFJlYWxtU2VydmljZVNpbmdsZXRvbiA9IG5ldyBSZWFsbVNlcnZpY2UoKTsiLCJpbXBvcnQgZ2V0VXNlciBmcm9tICcuL3VzZXJTZXJ2aWNlJztcbmltcG9ydCB7IFJlYWxtU2VydmljZVNpbmdsZXRvbiBhcyBSZWFsbVNlcnZpY2V9IGZyb20gJy4vcmVhbG1TZXJ2aWNlJ1xuXG5mdW5jdGlvbiBjbG9zZUFsbExpc3RzKCkge1xuICAgIGNvbnN0IGl0ZW1zID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnYXV0b2NvbXBsZXRlLWl0ZW1zJyk7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBpdGVtcy5sZW5ndGg7IGkrKykge1xuICAgICAgICBpdGVtc1tpXS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGl0ZW1zW2ldKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGFkZEl0ZW0obGlzdCwgaXRlbSwgcHJvZmlsZSwgcmVhbG0sIHJlZ2lvbikge1xuICAgIGl0ZW0uaW5uZXJIVE1MICs9IGA8c3Bhbj48aW1nIGNsYXNzPVwicmVnaW9uXCIgc3JjPVwiYXNzZXRzLyR7cmVnaW9ufS5zdmdcIj48L3NwYW4+YFxuICAgIGl0ZW0uZGF0YXNldC5wcm9maWxlID0gcHJvZmlsZTtcbiAgICBpdGVtLmRhdGFzZXQucmVhbG0gPSByZWFsbTtcbiAgICBpdGVtLmRhdGFzZXQucmVnaW9uID0gcmVnaW9uO1xuICAgIGxpc3QuYXBwZW5kQ2hpbGQoaXRlbSk7XG4gICAgaXRlbS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgaWYoZS50YXJnZXQuZGF0YXNldCl7XG4gICAgICAgICAgICBnZXRVc2VyKGUudGFyZ2V0LmRhdGFzZXQucHJvZmlsZSwgZS50YXJnZXQuZGF0YXNldC5yZWFsbSwgZS50YXJnZXQuZGF0YXNldC5yZWdpb24pO1xuICAgICAgICB9XG4gICAgICAgIGNsb3NlQWxsTGlzdHMoKTtcbiAgICB9KVxufVxuXG5mdW5jdGlvbiBkaXNwbGF5RGVmYXVsdFJlYWxtcyhyZWFsbXMsIHR5cGVkUHJvZmlsZSwgbGlzdCkge1xuICAgIHJlYWxtcy5mb3JFYWNoKHJlYWxtID0+IHtcbiAgICAgICAgY29uc3QgaXRlbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgIGl0ZW0uaW5uZXJIVE1MID0gXCI8c3Ryb25nPlwiICsgdHlwZWRQcm9maWxlICsgXCI8L3N0cm9uZz5cIjtcbiAgICAgICAgaXRlbS5pbm5lckhUTUwgKz0gJyAtICcgKyByZWFsbS5uYW1lO1xuICAgICAgICBhZGRJdGVtKGxpc3QsIGl0ZW0sIHR5cGVkUHJvZmlsZSwgcmVhbG0uc2x1ZywgcmVhbG0ucmVnaW9uKTtcbiAgICB9KVxufVxuXG5mdW5jdGlvbiBkaXNwbGF5UmVhbG1zKHR5cGVkVmFsdWUsIGxpc3QpIHtcbiAgICBjb25zdCBtYXRjaGVkUmVhbG0gPSB0eXBlZFZhbHVlLnNwbGl0KCctJylbMV07XG4gICAgY29uc3QgdHlwZWRQcm9maWxlID0gdHlwZWRWYWx1ZS5zcGxpdCgnLScpWzBdO1xuICAgIGlmKG1hdGNoZWRSZWFsbT8ubGVuZ3RoKSB7XG4gICAgICAgIGNvbnN0IG1hdGNoaW5nUmVhbG1zID0gUmVhbG1TZXJ2aWNlLmdldE1hdGNoaW5nUmVhbG1zKG1hdGNoZWRSZWFsbSk7XG4gICAgICAgIG1hdGNoaW5nUmVhbG1zLmZvckVhY2gocmVhbG0gPT4ge1xuICAgICAgICAgICAgY29uc3QgbWF0Y2hpbmdSZWFsbSA9IG1hdGNoZWRSZWFsbS5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIG1hdGNoZWRSZWFsbS5zbGljZSgxKTtcbiAgICAgICAgICAgIGNvbnN0IHByb2ZpbGUgPSB0eXBlZFByb2ZpbGUgKyAnIC0gJztcbiAgICAgICAgICAgIGNvbnN0IGl0ZW0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICAgICAgaXRlbS5pbm5lckhUTUwgPSBcIjxzdHJvbmc+XCIgKyBwcm9maWxlICsgbWF0Y2hpbmdSZWFsbSArIFwiPC9zdHJvbmc+XCI7XG4gICAgICAgICAgICBpdGVtLmlubmVySFRNTCArPSByZWFsbS5uYW1lLnN1YnN0cihtYXRjaGluZ1JlYWxtLmxlbmd0aCk7XG4gICAgICAgICAgICBhZGRJdGVtKGxpc3QsIGl0ZW0sIHR5cGVkUHJvZmlsZSwgcmVhbG0uc2x1ZywgcmVhbG0ucmVnaW9uKTtcbiAgICAgICAgfSlcbiAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCByZWFsbXMgPSBSZWFsbVNlcnZpY2UuZ2V0RGVmYXVsdFJlYWxtcygpO1xuICAgICAgICBkaXNwbGF5RGVmYXVsdFJlYWxtcyhyZWFsbXMsIHR5cGVkUHJvZmlsZSwgbGlzdCk7XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBhdXRvY29tcGxldGUoaW5wdXQ6IEhUTUxJbnB1dEVsZW1lbnQpIHtcbiAgICBpbnB1dC5hZGRFdmVudExpc3RlbmVyKFwiaW5wdXRcIiwgYXN5bmMgZnVuY3Rpb24oZSkge1xuICAgICAgICBjbG9zZUFsbExpc3RzKCk7XG5cbiAgICAgICAgbGV0IHR5cGVkVmFsdWUgPSB0aGlzLnZhbHVlLnJlcGxhY2UoLyAvZywnJyk7XG4gICAgICAgIHR5cGVkVmFsdWUgPSB0eXBlZFZhbHVlLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgdHlwZWRWYWx1ZS5zbGljZSgxKTtcbiAgICAgICAgaWYoIXR5cGVkVmFsdWUpIHJldHVybiBmYWxzZTtcblxuICAgICAgICBjb25zdCBsaXN0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIGxpc3Quc2V0QXR0cmlidXRlKFwiaWRcIiwgdGhpcy5pZCArIFwiYXV0b2NvbXBsZXRlLWxpc3RcIik7XG4gICAgICAgIGxpc3Quc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgXCJhdXRvY29tcGxldGUtaXRlbXNcIik7XG4gICAgICAgIHRoaXMucGFyZW50Tm9kZS5hcHBlbmRDaGlsZChsaXN0KTtcblxuICAgICAgICBjb25zdCB0eXBlZFJlYWxtID0gdHlwZWRWYWx1ZS5zcGxpdCgnLScpWzFdO1xuICAgICAgICBjb25zdCB0eXBlZFByb2ZpbGUgPSB0eXBlZFZhbHVlLnNwbGl0KCctJylbMF07XG5cbiAgICAgICAgaWYodHlwZWRWYWx1ZS5sZW5ndGggPiAyKXtcbiAgICAgICAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goYGh0dHA6Ly9sb2NhbGhvc3Q6ODA4MC9hcGkvdjEvY2hhcmFjdGVyL3NlYXJjaD9xPSR7dHlwZWRQcm9maWxlfWApO1xuICAgICAgICAgICAgY29uc3QgY2hhcmFjdGVycyA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcbiAgICAgICAgICAgIGlmKGNoYXJhY3RlcnMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgY2hhcmFjdGVycy5mb3JFYWNoKGNoYXJhY3RlciA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmKHR5cGVkUmVhbG0gJiYgY2hhcmFjdGVyLnJlYWxtLnRvVXBwZXJDYXNlKCkuc3Vic3RyaW5nKDAsIHR5cGVkUmVhbG0ubGVuZ3RoKSAhPT0gdHlwZWRSZWFsbS50b1VwcGVyQ2FzZSgpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgY29uc3QgaXRlbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgICAgICAgICAgICAgIGl0ZW0uaW5uZXJIVE1MID0gXCI8c3Ryb25nPlwiICsgY2hhcmFjdGVyLm5hbWUgKyAnIC0gJyArIGNoYXJhY3Rlci5yZWFsbSArIFwiPC9zdHJvbmc+XCI7XG4gICAgICAgICAgICAgICAgICAgIGFkZEl0ZW0obGlzdCwgaXRlbSwgY2hhcmFjdGVyLm5hbWUsIGNoYXJhY3Rlci5yZWFsbV9zbHVnLCBjaGFyYWN0ZXIucmVnaW9uKTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZGlzcGxheVJlYWxtcyh0eXBlZFZhbHVlLCBsaXN0KTtcbiAgICAgICAgfVxuICAgIH0pXG5cbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIGNsb3NlQWxsTGlzdHMoKVxuICAgIH0pXG59XG5cbiIsImltcG9ydCB7IFBWUFN0YXRpY3MgfSBmcm9tIFwiLi4vbW9kZWxzL3N0YXRpc3RpY3NcIjtcbmltcG9ydCB7IFVzZXIgfSBmcm9tIFwiLi4vbW9kZWxzL3VzZXJcIjtcblxuY29uc3QgY2xhc3NDb2xvcnMgPSBuZXcgTWFwKFtcbiAgICBbJ0RlYXRoIEtuaWdodCcsICcjQzQxRTNBJ10sXG4gICAgWydEZW1vbiBIdW50ZXInLCAnI0EzMzBDOSddLFxuICAgIFsnRHJ1aWQnLCAnI0ZGN0MwQSddLFxuICAgIFsnSHVudGVyJywgJyNBQUQzNzInXSxcbiAgICBbJ01hZ2UnLCAnIzNGQzdFQiddLFxuICAgIFsnTW9uaycsICcjMDBGRjk4J10sXG4gICAgWydQYWxhZGluJywgJyNGNDhDQkEnXSxcbiAgICBbJ1ByaWVzdCcsICcjRkZGRkZGJ10sXG4gICAgWydSb2d1ZScsICcjRkZGNDY4J10sXG4gICAgWydTaGFtYW4nLCAnIzAwNzBERCddLFxuICAgIFsnV2FybG9jaycsICcjODc4OEVFJ10sXG4gICAgWydXYXJyaW9yJywgJyNDNjlCNkQnXSxcbl0pXG5cbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIGdldFVzZXIocHJvZmlsZU5hbWU6IHN0cmluZywgcmVhbG1TbHVnOiBzdHJpbmcsIHJlZ2lvbjogc3RyaW5nKSB7IFxuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goYGh0dHA6Ly9sb2NhbGhvc3Q6ODA4MC9hcGkvdjEvY2hhcmFjdGVyLyR7cmVnaW9ufS8ke3JlYWxtU2x1Z30vJHtwcm9maWxlTmFtZX1gKTtcbiAgICBcbiAgICBjb25zdCBhdmF0YXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYXZhdGFyJyk7XG4gICAgY29uc3QgbmFtZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCduYW1lJyk7XG4gICAgY29uc3QgaXRlbUx2bCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdpdGVtLWx2bCcpO1xuICAgIGNvbnN0IHByb2ZpbGVUaXRsZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjaGFyYWN0ZXItdGl0bGUnKTtcblxuICAgIFthdmF0YXIsIG5hbWUsIGl0ZW1MdmwsIHByb2ZpbGVUaXRsZV0uZm9yRWFjaChub2RlID0+IHJlbW92ZUNoaWxkcmVuKG5vZGUpKTtcblxuICAgIGlmKCFyZXNwb25zZS5vaykge1xuICAgICAgICBjb25zb2xlLmVycm9yKCdQcm9maWxlIG5vdCBmb3VuZCcpO1xuICAgICAgICBkaXNwbGF5VXNlck5vdEZvdW5kKG5hbWUsIHByb2ZpbGVOYW1lKTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHVzZXI6IFVzZXIgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XG4gICAgXG4gICAgc2V0QmFja2dyb3VuZCh1c2VyLm1lZGlhLm1haW4pO1xuICAgIHNldFByb2ZpbGVOYW1lKG5hbWUsIHVzZXIubmFtZSwgdXNlci5jbGFzcywgdXNlci5mYWN0aW9uKTtcbiAgICBzZXRBdmF0YXIoYXZhdGFyLCB1c2VyLm1lZGlhLmF2YXRhcik7XG4gICAgc2V0SXRlbUxldmVsKGl0ZW1MdmwsIHVzZXIuaXRlbV9sZXZlbCk7XG4gICAgc2V0UHJvZmlsZVRpdGxlKHByb2ZpbGVUaXRsZSwgdXNlcik7XG5cbiAgICBzZXRQdnBTdGF0aXN0aWNzKHVzZXIucHZwX3N0YXRpc3Rjcyk7XG5cbiAgICBzZXRDYXJkVmlzaWJpbGl0eSgpXG59XG5cbmZ1bmN0aW9uIGRpc3BsYXlVc2VyTm90Rm91bmQobWVzc2FnZTogSFRNTEVsZW1lbnQsIHByb2ZpbGVOYW1lOiBzdHJpbmcpIHtcbiAgICBtZXNzYWdlLnRleHRDb250ZW50ID0gYCR7cHJvZmlsZU5hbWV9IE5vdCBGb3VuZGA7XG4gICAgbWVzc2FnZS5zdHlsZS5jb2xvciA9IFwid2hpdGVcIjtcbiAgICBjb25zdCBjYXJkcyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2NhcmQnKSBhcyBIVE1MQ29sbGVjdGlvbk9mPEhUTUxFbGVtZW50PjtcbiAgICBjYXJkc1swXS5zdHlsZS52aXNpYmlsaXR5ID0gJ3Zpc2libGUnIFxuICAgIGNhcmRzWzFdLnN0eWxlLnZpc2liaWxpdHkgPSAnaGlkZGVuJyBcbn1cblxuZnVuY3Rpb24gc2V0QmFja2dyb3VuZCh1cmw6IHN0cmluZykge1xuICAgIGNvbnN0IGJhY2tncm91bmQgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdiYWNrZ3JvdW5kJylbMF0gYXMgSFRNTEVsZW1lbnQ7XG4gICAgYmFja2dyb3VuZC5zdHlsZVsnYmFja2dyb3VuZC1pbWFnZSddID0gYHVybCgke3VybH0pYFxufVxuXG5mdW5jdGlvbiBzZXRQcm9maWxlTmFtZShuYW1lOiBIVE1MRWxlbWVudCwgdXNlcm5hbWU6IHN0cmluZywgdXNlckNsYXNzOiBzdHJpbmcsIGZhY3Rpb246IHN0cmluZykge1xuICAgIG5hbWUudGV4dENvbnRlbnQgPSB1c2VybmFtZTtcbiAgICBuYW1lLnN0eWxlLmNvbG9yID0gY2xhc3NDb2xvcnMuZ2V0KHVzZXJDbGFzcykgPz8gJyNGRkZGRkYnO1xuXG4gICAgY29uc3QgbG9nbyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2ltZycpO1xuICAgIGxvZ28uc3JjID0gZmFjdGlvbiA9PT0gJ0FsbGlhbmNlJyA/ICdhc3NldHMvTG9nby1hbGxpYW5jZS5wbmcnIDogJ2Fzc2V0cy9Mb2dvLWhvcmRlLnBuZyc7XG4gICAgbmFtZS5hcHBlbmRDaGlsZChsb2dvKVxufVxuXG5mdW5jdGlvbiBzZXRBdmF0YXIoYXZhdGFyOiBIVE1MRWxlbWVudCwgYXZhdGFyVXJsOiBzdHJpbmcpIHtcbiAgICBjb25zdCBpbWcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbWcnKTtcbiAgICBpbWcuc3JjID0gYXZhdGFyVXJsO1xuICAgIGF2YXRhci5hcHBlbmRDaGlsZChpbWcpO1xufVxuXG5mdW5jdGlvbiBzZXRJdGVtTGV2ZWwoaXRlbUx2bDogSFRNTEVsZW1lbnQsIGxldmVsOiBudW1iZXIpIHtcbiAgICBpdGVtTHZsLnRleHRDb250ZW50ID0gYCR7bGV2ZWx9IElMVkxgXG59XG5cbmZ1bmN0aW9uIHNldFByb2ZpbGVUaXRsZShwcm9maWxlVGl0bGU6IEhUTUxFbGVtZW50LCB1c2VyOiBVc2VyKSB7XG4gICAgY29uc3QgZ3VpbGQgPSB1c2VyLmd1aWxkID8gYDwke3VzZXIuZ3VpbGR9PmAgOiAnJ1xuICAgIHByb2ZpbGVUaXRsZS50ZXh0Q29udGVudCA9IGAke3VzZXIubGV2ZWx9ICR7dXNlci5yYWNlfSAke3VzZXIuc3BlY30gJHt1c2VyLmNsYXNzfSAke2d1aWxkfSAke3VzZXIucmVhbG19YFxufVxuXG5mdW5jdGlvbiByZW1vdmVDaGlsZHJlbihub2RlOiBIVE1MRWxlbWVudCkge1xuICAgIHdoaWxlIChub2RlLmZpcnN0Q2hpbGQpIHtcbiAgICAgICAgbm9kZS5yZW1vdmVDaGlsZChub2RlLmxhc3RDaGlsZCk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBzZXRQdnBTdGF0aXN0aWNzKHB2cHN0YXRzOiBQVlBTdGF0aWNzKSB7XG4gICAgY29uc3QgdGFibGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwidGFibGVcIik7XG4gICAgcmVtb3ZlQ2hpbGRyZW4odGFibGUpO1xuICAgIGNvbnN0IHRoZWFkID0gdGFibGUuY3JlYXRlVEhlYWQoKTtcbiAgICBjb25zdCBjb2xzID0gWycnLCAnQ3VycmVudCBSYXRpbmcnLCAnU2Vhc29uIEhpZ2gnLCAnSGlnaGVzdCBSYXRpbmcnXVxuICAgIGNvbnN0IGhlYWRlclJvdyA9IHRoZWFkLmluc2VydFJvdygpO1xuICAgIGNvbHMuZm9yRWFjaChjb2wgPT4ge1xuICAgICAgICBjb25zdCB0aCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RoJyk7XG4gICAgICAgIGNvbnN0IHRleHQgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShjb2wpO1xuICAgICAgICB0aC5hcHBlbmRDaGlsZCh0ZXh0KTtcbiAgICAgICAgaGVhZGVyUm93LmFwcGVuZENoaWxkKHRoKTtcbiAgICB9KVxuXG4gICAgT2JqZWN0LmVudHJpZXMocHZwc3RhdHMpLmZvckVhY2goKFtrZXksIHZhbHVlXSkgPT4ge1xuICAgICAgICBjb25zdCByb3cgPSB0YWJsZS5pbnNlcnRSb3coKTtcbiAgICAgICAgaW5zZXJ0Q2VsbChyb3csIGtleSk7XG4gICAgICAgIGluc2VydENlbGwocm93LCB2YWx1ZS5jdXJyZW50X3JhdGluZyk7XG4gICAgICAgIGluc2VydENlbGwocm93LCB2YWx1ZS5zZWFzb25faGlnaGVzdF9yYXRpbmcpO1xuICAgICAgICBpbnNlcnRDZWxsKHJvdywgdmFsdWUuaGlnaGVzdF9yYXRpbmcpO1xuICAgIH0pXG59XG5cbmZ1bmN0aW9uIGluc2VydENlbGwocm93OiBIVE1MVGFibGVSb3dFbGVtZW50LCBzdGF0OiBhbnkpIHtcbiAgICBjb25zdCBjZWxsID0gcm93Lmluc2VydENlbGwoKTtcbiAgICBjb25zdCB0ZXh0ID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoc3RhdCk7XG4gICAgY2VsbC5hcHBlbmRDaGlsZCh0ZXh0KVxufVxuXG5mdW5jdGlvbiBzZXRDYXJkVmlzaWJpbGl0eSgpOiB2b2lkIHtcbiAgICBjb25zdCBjYXJkcyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2NhcmQnKTtcbiAgICBmb3IoY29uc3QgY2FyZCBvZiBjYXJkcykge1xuICAgICAgICAoY2FyZCBhcyBIVE1MRWxlbWVudCkuc3R5bGUudmlzaWJpbGl0eSA9ICd2aXNpYmxlJyBcbiAgICB9XG59XG5cblxuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0aWYoX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSkge1xuXHRcdHJldHVybiBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IGF1dG9jb21wbGV0ZSBmcm9tIFwiLi9zZXJ2aWNlcy9zZWFyY2hTZXJ2aWNlXCI7XG5cbihhc3luYyAoKSA9PiB7XG4gICAgdHJ5IHtcbiAgICAgICAgYXdhaXQgYXV0b2NvbXBsZXRlKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiaW5wdXRcIikgYXMgSFRNTElucHV0RWxlbWVudCk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBjb25zb2xlLmVycm9yKGUpO1xuICAgIH1cbn0pKCk7XG4iXSwic291cmNlUm9vdCI6IiJ9