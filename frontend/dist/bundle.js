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
    getDefaultRealms() {
        return this.realms.slice(0, this.limit - 1);
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
function displayDefaultRealms(typedValue, list) {
    typedValue = typedValue.charAt(0).toUpperCase() + typedValue.slice(1);
    const matchedRealm = typedValue.split('-')[1];
    if (matchedRealm === null || matchedRealm === void 0 ? void 0 : matchedRealm.length) {
        const matchingRealms = _realmService__WEBPACK_IMPORTED_MODULE_1__.RealmServiceSingleton.getMatchingRealms(matchedRealm);
        matchingRealms.forEach(realm => {
            const matchingRealm = matchedRealm.charAt(0).toUpperCase() + matchedRealm.slice(1);
            const profile = typedValue.split('-')[0] + '-';
            const item = document.createElement("div");
            item.innerHTML = "<strong>" + profile + matchingRealm + "</strong>";
            item.innerHTML += realm.name.substr(matchingRealm.length);
            addItem(list, item, typedValue.split('-')[0], realm.slug, realm.region);
        });
    }
    else {
        _realmService__WEBPACK_IMPORTED_MODULE_1__.RealmServiceSingleton.getDefaultRealms().forEach(realm => {
            const item = document.createElement("div");
            item.innerHTML = "<strong>" + typedValue + "</strong>";
            item.innerHTML += typedValue.includes('-') ? realm.name : ' - ' + realm.name;
            addItem(list, item, typedValue, realm.slug, realm.region);
        });
    }
}
async function autocomplete(input) {
    input.addEventListener("input", async function (e) {
        closeAllLists();
        const typedValue = this.value;
        if (!typedValue)
            return false;
        const list = document.createElement('div');
        list.setAttribute("id", this.id + "autocomplete-list");
        list.setAttribute("class", "autocomplete-items");
        this.parentNode.appendChild(list);
        if (typedValue.length > 2) {
            const response = await fetch(`http://localhost:8080/api/v1/character/search?q=${typedValue}`);
            const characters = await response.json();
            if (characters.length) {
                characters.forEach(character => {
                    const item = document.createElement("div");
                    item.innerHTML = character.name + '-' + character.realm;
                    addItem(list, item, character.name, character.realm_slug, character.region);
                });
            }
            else {
                displayDefaultRealms(typedValue, list);
            }
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
    if (!response.ok) {
        console.error('Profile not found');
    }
    const user = await response.json();
    setBackground(user.media.main);
    setProfileName(user.name, user.class, user.faction);
    setAvatar(user.media.avatar);
    setItemLevel(user.item_level);
    setProfileTitle(user);
    setPvpStatistics(user.pvp_statistcs);
    setCardVisibility();
}
function setBackground(url) {
    const background = document.getElementsByClassName('background')[0];
    background.style['background-image'] = `url(${url})`;
}
function setProfileName(username, userClass, faction) {
    var _a;
    const name = document.getElementById('name');
    removeChildren(name);
    name.textContent = username;
    name.style.color = (_a = classColors.get(userClass)) !== null && _a !== void 0 ? _a : '#FFFFFF';
    const logo = document.createElement('img');
    logo.src = faction === 'Alliance' ? 'assets/Logo-alliance.png' : 'assets/Logo-horde.png';
    name.appendChild(logo);
}
function setAvatar(avatarUrl) {
    const avatar = document.getElementById('avatar');
    removeChildren(avatar);
    const img = document.createElement('img');
    img.src = avatarUrl;
    avatar.appendChild(img);
}
function setItemLevel(level) {
    const itemLvl = document.getElementById('item-lvl');
    itemLvl.textContent = `${level} ILVL`;
}
function setProfileTitle(user) {
    const characterTitle = document.getElementById('character-title');
    const guild = user.guild ? `<${user.guild}>` : '';
    characterTitle.textContent = `${user.level} ${user.race} ${user.spec} ${user.class} ${guild} ${user.realm}`;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9wdnAvLi9zcmMvc2VydmljZXMvcmVhbG1TZXJ2aWNlLnRzIiwid2VicGFjazovL3B2cC8uL3NyYy9zZXJ2aWNlcy9zZWFyY2hTZXJ2aWNlLnRzIiwid2VicGFjazovL3B2cC8uL3NyYy9zZXJ2aWNlcy91c2VyU2VydmljZS50cyIsIndlYnBhY2s6Ly9wdnAvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vcHZwL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9wdnAvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9wdnAvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9wdnAvLi9zcmMvbWFpbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUVBLE1BQU0sWUFBWTtJQUlkO1FBRlMsVUFBSyxHQUFHLEVBQUUsQ0FBQztRQUdoQixJQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztJQUM1QixDQUFDO0lBRUQsS0FBSyxDQUFDLGdCQUFnQjtRQUNsQixNQUFNLFFBQVEsR0FBRyxNQUFNLEtBQUssQ0FBQyxxQ0FBcUMsQ0FBQyxDQUFDO1FBQ3BFLElBQUcsQ0FBQyxRQUFRLENBQUMsRUFBRSxFQUFFO1lBQ2IsT0FBTyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQztTQUMxQjtRQUNELE1BQU0sTUFBTSxHQUFZLE1BQU0sUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDO1FBQzlDLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO0lBQ3pCLENBQUM7SUFHTSxTQUFTO1FBQ1osT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDO0lBQ3ZCLENBQUM7SUFFRCxpQkFBaUIsQ0FBQyxVQUFrQjtRQUNoQyxNQUFNLGNBQWMsR0FBRyxFQUFFO1FBQ3pCLEtBQUksTUFBTSxLQUFLLElB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QixNQUFNLEtBQUssR0FBRyxRQUFRLENBQUMsc0JBQXNCLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDdEQsS0FBSSxNQUFNLElBQUksSUFBSSxLQUFLLEVBQUU7UUFDcEIsSUFBb0IsQ0FBQyxLQUFLLENBQUMsVUFBVSxHQUFHLFNBQVM7S0FDckQ7QUFDTCxDQUFDOzs7Ozs7O1VDakhEO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3JCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHdDQUF3Qyx5Q0FBeUM7V0FDakY7V0FDQTtXQUNBLEU7Ozs7O1dDUEEsd0Y7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0Esc0RBQXNELGtCQUFrQjtXQUN4RTtXQUNBLCtDQUErQyxjQUFjO1dBQzdELEU7Ozs7Ozs7Ozs7OztBQ05vRDtBQUVwRCxDQUFDLEtBQUssSUFBSSxFQUFFO0lBQ1IsSUFBSTtRQUNBLE1BQU0sZ0VBQVksQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBcUIsQ0FBQyxDQUFDO0tBQzVFO0lBQUMsT0FBTyxDQUFDLEVBQUU7UUFDUixPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQ3BCO0FBQ0wsQ0FBQyxDQUFDLEVBQUUsQ0FBQyIsImZpbGUiOiJidW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBSZWFsbSB9IGZyb20gXCIuLi9tb2RlbHMvcmVhbG1cIjtcblxuY2xhc3MgUmVhbG1TZXJ2aWNlIHtcbiAgICByZWFsbXM6IFJlYWxtW11cbiAgICByZWFkb25seSBsaW1pdCA9IDEwO1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuaW5pdGlhbGl6ZVJlYWxtcygpO1xuICAgIH1cblxuICAgIGFzeW5jIGluaXRpYWxpemVSZWFsbXMoKSB7XG4gICAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goYGh0dHA6Ly9sb2NhbGhvc3Q6ODA4MC9hcGkvdjEvcmVhbG1zYCk7XG4gICAgICAgIGlmKCFyZXNwb25zZS5vaykge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcignZXJyb3InKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCByZWFsbXM6IFJlYWxtW10gPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XG4gICAgICAgIHRoaXMucmVhbG1zID0gcmVhbG1zO1xuICAgIH1cblxuXG4gICAgcHVibGljIGdldFJlYWxtcygpOiBSZWFsbVtdIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucmVhbG1zO1xuICAgIH1cbiAgICBcbiAgICBnZXRNYXRjaGluZ1JlYWxtcyh0eXBlZFJlYWxtOiBzdHJpbmcpOiBSZWFsbVtdIHtcbiAgICAgICAgY29uc3QgbWF0Y2hpbmdSZWFsbXMgPSBbXVxuICAgICAgICBmb3IoY29uc3QgcmVhbG0gb2YgdGhpcy5yZWFsbXMpIHtcbiAgICAgICAgICAgIGlmKHJlYWxtLm5hbWUuc3Vic3RyKDAsIHR5cGVkUmVhbG0ubGVuZ3RoKS50b1VwcGVyQ2FzZSgpID09PSB0eXBlZFJlYWxtLnRvVXBwZXJDYXNlKCkpIHtcbiAgICAgICAgICAgICAgICBtYXRjaGluZ1JlYWxtcy5wdXNoKHJlYWxtKTtcbiAgICAgICAgICAgICAgICBpZihtYXRjaGluZ1JlYWxtcy5sZW5ndGggPiA5KXtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBtYXRjaGluZ1JlYWxtc1xuICAgIH1cbiAgICBcbiAgICBnZXREZWZhdWx0UmVhbG1zKCk6IFJlYWxtW10ge1xuICAgICAgICByZXR1cm4gdGhpcy5yZWFsbXMuc2xpY2UoMCwgdGhpcy5saW1pdCAtIDEpO1xuICAgIH1cbn1cblxuZXhwb3J0IGNvbnN0IFJlYWxtU2VydmljZVNpbmdsZXRvbiA9IG5ldyBSZWFsbVNlcnZpY2UoKTsiLCJpbXBvcnQgZ2V0VXNlciBmcm9tICcuL3VzZXJTZXJ2aWNlJztcbmltcG9ydCB7IFJlYWxtU2VydmljZVNpbmdsZXRvbiBhcyBSZWFsbVNlcnZpY2V9IGZyb20gJy4vcmVhbG1TZXJ2aWNlJ1xuXG5mdW5jdGlvbiBjbG9zZUFsbExpc3RzKCkge1xuICAgIGNvbnN0IGl0ZW1zID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnYXV0b2NvbXBsZXRlLWl0ZW1zJyk7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBpdGVtcy5sZW5ndGg7IGkrKykge1xuICAgICAgICBpdGVtc1tpXS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGl0ZW1zW2ldKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGFkZEl0ZW0obGlzdCwgaXRlbSwgcHJvZmlsZSwgcmVhbG0sIHJlZ2lvbikge1xuICAgIGl0ZW0uZGF0YXNldC5wcm9maWxlID0gcHJvZmlsZTtcbiAgICBpdGVtLmRhdGFzZXQucmVhbG0gPSByZWFsbTtcbiAgICBpdGVtLmRhdGFzZXQucmVnaW9uID0gcmVnaW9uO1xuICAgIGxpc3QuYXBwZW5kQ2hpbGQoaXRlbSk7XG4gICAgaXRlbS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgaWYoZS50YXJnZXQuZGF0YXNldCl7XG4gICAgICAgICAgICBnZXRVc2VyKGUudGFyZ2V0LmRhdGFzZXQucHJvZmlsZSwgZS50YXJnZXQuZGF0YXNldC5yZWFsbSwgZS50YXJnZXQuZGF0YXNldC5yZWdpb24pO1xuICAgICAgICB9XG4gICAgICAgIGNsb3NlQWxsTGlzdHMoKTtcbiAgICB9KVxufVxuXG5mdW5jdGlvbiBkaXNwbGF5RGVmYXVsdFJlYWxtcyh0eXBlZFZhbHVlLCBsaXN0KSB7XG4gICAgdHlwZWRWYWx1ZSA9IHR5cGVkVmFsdWUuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyB0eXBlZFZhbHVlLnNsaWNlKDEpO1xuICAgIGNvbnN0IG1hdGNoZWRSZWFsbSA9IHR5cGVkVmFsdWUuc3BsaXQoJy0nKVsxXTtcbiAgICBpZihtYXRjaGVkUmVhbG0/Lmxlbmd0aCkge1xuICAgICAgICBjb25zdCBtYXRjaGluZ1JlYWxtcyA9IFJlYWxtU2VydmljZS5nZXRNYXRjaGluZ1JlYWxtcyhtYXRjaGVkUmVhbG0pO1xuICAgICAgICBtYXRjaGluZ1JlYWxtcy5mb3JFYWNoKHJlYWxtID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG1hdGNoaW5nUmVhbG0gPSBtYXRjaGVkUmVhbG0uY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBtYXRjaGVkUmVhbG0uc2xpY2UoMSk7XG4gICAgICAgICAgICBjb25zdCBwcm9maWxlID0gdHlwZWRWYWx1ZS5zcGxpdCgnLScpWzBdICsgJy0nO1xuICAgICAgICAgICAgY29uc3QgaXRlbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgICAgICBpdGVtLmlubmVySFRNTCA9IFwiPHN0cm9uZz5cIiArIHByb2ZpbGUgKyBtYXRjaGluZ1JlYWxtICsgXCI8L3N0cm9uZz5cIjtcbiAgICAgICAgICAgIGl0ZW0uaW5uZXJIVE1MICs9IHJlYWxtLm5hbWUuc3Vic3RyKG1hdGNoaW5nUmVhbG0ubGVuZ3RoKTtcbiAgICAgICAgICAgIGFkZEl0ZW0obGlzdCwgaXRlbSwgdHlwZWRWYWx1ZS5zcGxpdCgnLScpWzBdLCByZWFsbS5zbHVnLCByZWFsbS5yZWdpb24pO1xuICAgICAgICB9KVxuICAgIH0gZWxzZSB7XG4gICAgICAgIFJlYWxtU2VydmljZS5nZXREZWZhdWx0UmVhbG1zKCkuZm9yRWFjaChyZWFsbSA9PiB7XG4gICAgICAgICAgICBjb25zdCBpdGVtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgICAgIGl0ZW0uaW5uZXJIVE1MID0gXCI8c3Ryb25nPlwiICsgdHlwZWRWYWx1ZSArIFwiPC9zdHJvbmc+XCI7XG4gICAgICAgICAgICBpdGVtLmlubmVySFRNTCArPSB0eXBlZFZhbHVlLmluY2x1ZGVzKCctJykgPyAgcmVhbG0ubmFtZSA6ICcgLSAnICsgcmVhbG0ubmFtZTtcbiAgICAgICAgICAgIGFkZEl0ZW0obGlzdCwgaXRlbSwgdHlwZWRWYWx1ZSwgcmVhbG0uc2x1ZywgcmVhbG0ucmVnaW9uKTtcbiAgICAgICAgfSlcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIGF1dG9jb21wbGV0ZShpbnB1dDogSFRNTElucHV0RWxlbWVudCkge1xuICAgIGlucHV0LmFkZEV2ZW50TGlzdGVuZXIoXCJpbnB1dFwiLCBhc3luYyBmdW5jdGlvbihlKSB7XG4gICAgICAgIGNsb3NlQWxsTGlzdHMoKTtcblxuICAgICAgICBjb25zdCB0eXBlZFZhbHVlID0gdGhpcy52YWx1ZTtcbiAgICAgICAgaWYoIXR5cGVkVmFsdWUpIHJldHVybiBmYWxzZTtcblxuICAgICAgICBjb25zdCBsaXN0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIGxpc3Quc2V0QXR0cmlidXRlKFwiaWRcIiwgdGhpcy5pZCArIFwiYXV0b2NvbXBsZXRlLWxpc3RcIik7XG4gICAgICAgIGxpc3Quc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgXCJhdXRvY29tcGxldGUtaXRlbXNcIik7XG4gICAgICAgIHRoaXMucGFyZW50Tm9kZS5hcHBlbmRDaGlsZChsaXN0KTtcblxuICAgICAgICBpZih0eXBlZFZhbHVlLmxlbmd0aCA+IDIpe1xuICAgICAgICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChgaHR0cDovL2xvY2FsaG9zdDo4MDgwL2FwaS92MS9jaGFyYWN0ZXIvc2VhcmNoP3E9JHt0eXBlZFZhbHVlfWApO1xuICAgICAgICAgICAgY29uc3QgY2hhcmFjdGVycyA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcbiAgICAgICAgICAgIGlmKGNoYXJhY3RlcnMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgY2hhcmFjdGVycy5mb3JFYWNoKGNoYXJhY3RlciA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGl0ZW0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICAgICAgICAgICAgICBpdGVtLmlubmVySFRNTCA9IGNoYXJhY3Rlci5uYW1lICsgJy0nICsgY2hhcmFjdGVyLnJlYWxtO1xuICAgICAgICAgICAgICAgICAgICBhZGRJdGVtKGxpc3QsIGl0ZW0sIGNoYXJhY3Rlci5uYW1lLCBjaGFyYWN0ZXIucmVhbG1fc2x1ZywgY2hhcmFjdGVyLnJlZ2lvbik7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZGlzcGxheURlZmF1bHRSZWFsbXModHlwZWRWYWx1ZSwgbGlzdCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KVxuXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICBjbG9zZUFsbExpc3RzKClcbiAgICB9KVxufVxuXG4iLCJpbXBvcnQgeyBQVlBTdGF0aWNzIH0gZnJvbSBcIi4uL21vZGVscy9zdGF0aXN0aWNzXCI7XG5pbXBvcnQgeyBVc2VyIH0gZnJvbSBcIi4uL21vZGVscy91c2VyXCI7XG5cbmNvbnN0IGNsYXNzQ29sb3JzID0gbmV3IE1hcChbXG4gICAgWydEZWF0aCBLbmlnaHQnLCAnI0M0MUUzQSddLFxuICAgIFsnRGVtb24gSHVudGVyJywgJyNBMzMwQzknXSxcbiAgICBbJ0RydWlkJywgJyNGRjdDMEEnXSxcbiAgICBbJ0h1bnRlcicsICcjQUFEMzcyJ10sXG4gICAgWydNYWdlJywgJyMzRkM3RUInXSxcbiAgICBbJ01vbmsnLCAnIzAwRkY5OCddLFxuICAgIFsnUGFsYWRpbicsICcjRjQ4Q0JBJ10sXG4gICAgWydQcmllc3QnLCAnI0ZGRkZGRiddLFxuICAgIFsnUm9ndWUnLCAnI0ZGRjQ2OCddLFxuICAgIFsnU2hhbWFuJywgJyMwMDcwREQnXSxcbiAgICBbJ1dhcmxvY2snLCAnIzg3ODhFRSddLFxuICAgIFsnV2FycmlvcicsICcjQzY5QjZEJ10sXG5dKVxuXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBnZXRVc2VyKHByb2ZpbGVOYW1lOiBzdHJpbmcsIHJlYWxtU2x1Zzogc3RyaW5nLCByZWdpb246IHN0cmluZykgeyBcbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKGBodHRwOi8vbG9jYWxob3N0OjgwODAvYXBpL3YxL2NoYXJhY3Rlci8ke3JlZ2lvbn0vJHtyZWFsbVNsdWd9LyR7cHJvZmlsZU5hbWV9YCk7XG5cbiAgICBpZighcmVzcG9uc2Uub2spIHtcbiAgICAgICAgY29uc29sZS5lcnJvcignUHJvZmlsZSBub3QgZm91bmQnKTtcbiAgICB9XG5cbiAgICBjb25zdCB1c2VyOiBVc2VyID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xuICAgIFxuICAgIHNldEJhY2tncm91bmQodXNlci5tZWRpYS5tYWluKTtcbiAgICBzZXRQcm9maWxlTmFtZSh1c2VyLm5hbWUsIHVzZXIuY2xhc3MsIHVzZXIuZmFjdGlvbik7XG4gICAgc2V0QXZhdGFyKHVzZXIubWVkaWEuYXZhdGFyKTtcbiAgICBzZXRJdGVtTGV2ZWwodXNlci5pdGVtX2xldmVsKTtcbiAgICBzZXRQcm9maWxlVGl0bGUodXNlcik7XG5cbiAgICBzZXRQdnBTdGF0aXN0aWNzKHVzZXIucHZwX3N0YXRpc3Rjcyk7XG5cbiAgICBzZXRDYXJkVmlzaWJpbGl0eSgpXG59XG5cbmZ1bmN0aW9uIHNldEJhY2tncm91bmQodXJsOiBzdHJpbmcpIHtcbiAgICBjb25zdCBiYWNrZ3JvdW5kID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnYmFja2dyb3VuZCcpWzBdIGFzIEhUTUxFbGVtZW50O1xuICAgIGJhY2tncm91bmQuc3R5bGVbJ2JhY2tncm91bmQtaW1hZ2UnXSA9IGB1cmwoJHt1cmx9KWBcbn1cblxuZnVuY3Rpb24gc2V0UHJvZmlsZU5hbWUodXNlcm5hbWU6IHN0cmluZywgdXNlckNsYXNzOiBzdHJpbmcsIGZhY3Rpb246IHN0cmluZykge1xuICAgIGNvbnN0IG5hbWUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbmFtZScpO1xuICAgIHJlbW92ZUNoaWxkcmVuKG5hbWUpO1xuXG4gICAgbmFtZS50ZXh0Q29udGVudCA9IHVzZXJuYW1lO1xuICAgIG5hbWUuc3R5bGUuY29sb3IgPSBjbGFzc0NvbG9ycy5nZXQodXNlckNsYXNzKSA/PyAnI0ZGRkZGRic7XG5cbiAgICBjb25zdCBsb2dvID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW1nJyk7XG4gICAgbG9nby5zcmMgPSBmYWN0aW9uID09PSAnQWxsaWFuY2UnID8gJ2Fzc2V0cy9Mb2dvLWFsbGlhbmNlLnBuZycgOiAnYXNzZXRzL0xvZ28taG9yZGUucG5nJztcbiAgICBuYW1lLmFwcGVuZENoaWxkKGxvZ28pXG59XG5cbmZ1bmN0aW9uIHNldEF2YXRhcihhdmF0YXJVcmw6IHN0cmluZykge1xuICAgIGNvbnN0IGF2YXRhciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhdmF0YXInKTtcbiAgICByZW1vdmVDaGlsZHJlbihhdmF0YXIpO1xuICAgIGNvbnN0IGltZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2ltZycpO1xuICAgIGltZy5zcmMgPSBhdmF0YXJVcmw7XG4gICAgYXZhdGFyLmFwcGVuZENoaWxkKGltZyk7XG59XG5cbmZ1bmN0aW9uIHNldEl0ZW1MZXZlbChsZXZlbDogbnVtYmVyKSB7XG4gICAgY29uc3QgaXRlbUx2bCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdpdGVtLWx2bCcpO1xuICAgIGl0ZW1MdmwudGV4dENvbnRlbnQgPSBgJHtsZXZlbH0gSUxWTGBcbn1cblxuZnVuY3Rpb24gc2V0UHJvZmlsZVRpdGxlKHVzZXI6IFVzZXIpIHtcbiAgICBjb25zdCBjaGFyYWN0ZXJUaXRsZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjaGFyYWN0ZXItdGl0bGUnKTtcbiAgICBjb25zdCBndWlsZCA9IHVzZXIuZ3VpbGQgPyBgPCR7dXNlci5ndWlsZH0+YCA6ICcnXG4gICAgY2hhcmFjdGVyVGl0bGUudGV4dENvbnRlbnQgPSBgJHt1c2VyLmxldmVsfSAke3VzZXIucmFjZX0gJHt1c2VyLnNwZWN9ICR7dXNlci5jbGFzc30gJHtndWlsZH0gJHt1c2VyLnJlYWxtfWBcbn1cblxuZnVuY3Rpb24gcmVtb3ZlQ2hpbGRyZW4obm9kZTogSFRNTEVsZW1lbnQpIHtcbiAgICB3aGlsZSAobm9kZS5maXJzdENoaWxkKSB7XG4gICAgICAgIG5vZGUucmVtb3ZlQ2hpbGQobm9kZS5sYXN0Q2hpbGQpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gc2V0UHZwU3RhdGlzdGljcyhwdnBzdGF0czogUFZQU3RhdGljcykge1xuICAgIGNvbnN0IHRhYmxlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcInRhYmxlXCIpO1xuICAgIHJlbW92ZUNoaWxkcmVuKHRhYmxlKTtcbiAgICBjb25zdCB0aGVhZCA9IHRhYmxlLmNyZWF0ZVRIZWFkKCk7XG4gICAgY29uc3QgY29scyA9IFsnJywgJ0N1cnJlbnQgUmF0aW5nJywgJ1NlYXNvbiBIaWdoJywgJ0hpZ2hlc3QgUmF0aW5nJ11cbiAgICBjb25zdCBoZWFkZXJSb3cgPSB0aGVhZC5pbnNlcnRSb3coKTtcbiAgICBjb2xzLmZvckVhY2goY29sID0+IHtcbiAgICAgICAgY29uc3QgdGggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0aCcpO1xuICAgICAgICBjb25zdCB0ZXh0ID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoY29sKTtcbiAgICAgICAgdGguYXBwZW5kQ2hpbGQodGV4dCk7XG4gICAgICAgIGhlYWRlclJvdy5hcHBlbmRDaGlsZCh0aCk7XG4gICAgfSlcblxuICAgIE9iamVjdC5lbnRyaWVzKHB2cHN0YXRzKS5mb3JFYWNoKChba2V5LCB2YWx1ZV0pID0+IHtcbiAgICAgICAgY29uc3Qgcm93ID0gdGFibGUuaW5zZXJ0Um93KCk7XG4gICAgICAgIGluc2VydENlbGwocm93LCBrZXkpO1xuICAgICAgICBpbnNlcnRDZWxsKHJvdywgdmFsdWUuY3VycmVudF9yYXRpbmcpO1xuICAgICAgICBpbnNlcnRDZWxsKHJvdywgdmFsdWUuc2Vhc29uX2hpZ2hlc3RfcmF0aW5nKTtcbiAgICAgICAgaW5zZXJ0Q2VsbChyb3csIHZhbHVlLmhpZ2hlc3RfcmF0aW5nKTtcbiAgICB9KVxufVxuXG5mdW5jdGlvbiBpbnNlcnRDZWxsKHJvdzogSFRNTFRhYmxlUm93RWxlbWVudCwgc3RhdDogYW55KSB7XG4gICAgY29uc3QgY2VsbCA9IHJvdy5pbnNlcnRDZWxsKCk7XG4gICAgY29uc3QgdGV4dCA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHN0YXQpO1xuICAgIGNlbGwuYXBwZW5kQ2hpbGQodGV4dClcbn1cblxuZnVuY3Rpb24gc2V0Q2FyZFZpc2liaWxpdHkoKTogdm9pZCB7XG4gICAgY29uc3QgY2FyZHMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdjYXJkJyk7XG4gICAgZm9yKGNvbnN0IGNhcmQgb2YgY2FyZHMpIHtcbiAgICAgICAgKGNhcmQgYXMgSFRNTEVsZW1lbnQpLnN0eWxlLnZpc2liaWxpdHkgPSAndmlzaWJsZScgXG4gICAgfVxufVxuXG5cbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdGlmKF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0pIHtcblx0XHRyZXR1cm4gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCBhdXRvY29tcGxldGUgZnJvbSBcIi4vc2VydmljZXMvc2VhcmNoU2VydmljZVwiO1xuXG4oYXN5bmMgKCkgPT4ge1xuICAgIHRyeSB7XG4gICAgICAgIGF3YWl0IGF1dG9jb21wbGV0ZShkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImlucHV0XCIpIGFzIEhUTUxJbnB1dEVsZW1lbnQpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihlKTtcbiAgICB9XG59KSgpO1xuIl0sInNvdXJjZVJvb3QiOiIifQ==