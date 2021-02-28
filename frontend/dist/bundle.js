/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/user.ts":
/*!*********************!*\
  !*** ./src/user.ts ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "getUser": () => (/* binding */ getUser)
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
async function getUser(profileName) {
    var _a;
    const region = 'eu';
    const realmSlug = 'silvermoon';
    const response = await fetch(`http://localhost:8080/api/v1/character/${region}/${realmSlug}/${profileName}`);
    if (!response.ok) {
        console.error('error');
    }
    const user = await response.json();
    const color = (_a = classColors.get(user.class)) !== null && _a !== void 0 ? _a : '#FFFFFF';
    const background = document.getElementsByClassName('background')[0];
    background.style['background-image'] = `url(${user.media.main})`;
    const name = document.getElementById('name');
    removeChildren(name);
    name.textContent = user.name;
    name.style.color = color;
    const logo = document.createElement('img');
    logo.src = user.faction === 'Alliance' ? 'assets/Logo-alliance.png' : 'assets/Logo-horde.png';
    name.appendChild(logo);
    const avatar = document.getElementById('avatar');
    removeChildren(avatar);
    const img = document.createElement('img');
    img.src = user.media.avatar;
    avatar.appendChild(img);
    const itemLvl = document.getElementById('item-lvl');
    itemLvl.textContent = `${user.item_level} ILVL`;
    const characterTitle = document.getElementById('character-title');
    const guild = user.guild ? `<${user.guild}>` : '';
    characterTitle.textContent = `${user.level} ${user.race} ${user.spec} ${user.class} ${guild} ${user.realm}`;
    getPvpStatistics(user.pvp_statistcs);
    const cards = document.getElementsByClassName('card');
    for (const card of cards) {
        card.style.visibility = 'visible';
    }
}
function removeChildren(node) {
    while (node.firstChild) {
        node.removeChild(node.lastChild);
    }
}
function getPvpStatistics(pvpstats) {
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
/* harmony import */ var _user__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./user */ "./src/user.ts");

function closeAllLists() {
    const items = document.getElementsByClassName('autocomplete-items');
    for (let i = 0; i < items.length; i++) {
        items[i].parentNode.removeChild(items[i]);
    }
}
function autocomplete(input, defaultRealms) {
    input.addEventListener("input", function (e) {
        closeAllLists();
        const typedValue = this.value;
        if (!typedValue)
            return false;
        const list = document.createElement('div');
        list.setAttribute("id", this.id + "autocomplete-list");
        list.setAttribute("class", "autocomplete-items");
        this.parentNode.appendChild(list);
        // if eli send me nothing, then UI display typed - realm
        // limit to 10 
        const matchedRealm = typedValue.split('-')[1];
        if (matchedRealm === null || matchedRealm === void 0 ? void 0 : matchedRealm.length) {
            const matchingRealms = getMatchingRealms(defaultRealms, matchedRealm);
            matchingRealms.forEach(realm => {
                const matchingRealm = matchedRealm.charAt(0).toUpperCase() + matchedRealm.slice(1);
                const profile = typedValue.split('-')[0] + '-';
                const item = document.createElement("div");
                item.innerHTML = "<strong>" + profile + matchingRealm + "</strong>";
                item.innerHTML += realm.substr(matchingRealm.length);
                list.appendChild(item);
                item.addEventListener('click', function (e) {
                    input.value = (this.getElementsByTagName("input"))[0].value;
                    (0,_user__WEBPACK_IMPORTED_MODULE_0__.getUser)(input.value);
                    closeAllLists();
                });
            });
        }
        else {
            defaultRealms.slice(0, 9).forEach(realm => {
                const item = document.createElement("div");
                item.innerHTML = "<strong>" + typedValue + "</strong>";
                item.innerHTML += realm;
                list.appendChild(item);
                item.addEventListener('click', function (e) {
                    input.value = (this.getElementsByTagName("input"))[0].value;
                    (0,_user__WEBPACK_IMPORTED_MODULE_0__.getUser)(input.value);
                    closeAllLists();
                });
            });
        }
    });
    document.addEventListener('click', function (e) {
        closeAllLists();
    });
}
function getMatchingRealms(realms, typedRealm) {
    const matchingRealms = [];
    for (const realm of realms) {
        if (realm.toUpperCase().includes(typedRealm === null || typedRealm === void 0 ? void 0 : typedRealm.toUpperCase())) {
            matchingRealms.push(realm);
            if (matchingRealms.length > 9) {
                break;
            }
        }
    }
    return matchingRealms;
}
async function getRealms() {
    const response = await fetch(`http://localhost:8080/api/v1/realms`);
    if (!response.ok) {
        console.error('error');
    }
    const realms = await response.json();
    return realms.map(realm => {
        return realm.name;
    });
}
(async () => {
    try {
        var defaultRealms = await getRealms();
        autocomplete(document.getElementById("input"), defaultRealms);
    }
    catch (e) {
        // Deal with the fact the chain failed
    }
})();

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9wdnAvLi9zcmMvdXNlci50cyIsIndlYnBhY2s6Ly9wdnAvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vcHZwL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9wdnAvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9wdnAvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9wdnAvLi9zcmMvbWFpbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQXVDQSxNQUFNLFdBQVcsR0FBRyxJQUFJLEdBQUcsQ0FBQztJQUN4QixDQUFDLGNBQWMsRUFBRSxTQUFTLENBQUM7SUFDM0IsQ0FBQyxjQUFjLEVBQUUsU0FBUyxDQUFDO0lBQzNCLENBQUMsT0FBTyxFQUFFLFNBQVMsQ0FBQztJQUNwQixDQUFDLFFBQVEsRUFBRSxTQUFTLENBQUM7SUFDckIsQ0FBQyxNQUFNLEVBQUUsU0FBUyxDQUFDO0lBQ25CLENBQUMsTUFBTSxFQUFFLFNBQVMsQ0FBQztJQUNuQixDQUFDLFNBQVMsRUFBRSxTQUFTLENBQUM7SUFDdEIsQ0FBQyxRQUFRLEVBQUUsU0FBUyxDQUFDO0lBQ3JCLENBQUMsT0FBTyxFQUFFLFNBQVMsQ0FBQztJQUNwQixDQUFDLFFBQVEsRUFBRSxTQUFTLENBQUM7SUFDckIsQ0FBQyxTQUFTLEVBQUUsU0FBUyxDQUFDO0lBQ3RCLENBQUMsU0FBUyxFQUFFLFNBQVMsQ0FBQztDQUN6QixDQUFDO0FBRUssS0FBSyxVQUFVLE9BQU8sQ0FBQyxXQUFtQjs7SUFDN0MsTUFBTSxNQUFNLEdBQUcsSUFBSTtJQUNuQixNQUFNLFNBQVMsR0FBRyxZQUFZO0lBQzlCLE1BQU0sUUFBUSxHQUFHLE1BQU0sS0FBSyxDQUFDLDBDQUEwQyxNQUFNLElBQUksU0FBUyxJQUFJLFdBQVcsRUFBRSxD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QUMsVUFBVSxhQUFWLFVBQVUsdUJBQVYsVUFBVSxDQUFFLFdBQVcsR0FBRyxFQUFFO1lBQ3hELGNBQWMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDM0IsSUFBRyxjQUFjLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBQztnQkFDekIsTUFBTTthQUNUO1NBQ0o7S0FDSjtJQUNELE9BQU8sY0FBYztBQUN6QixDQUFDO0FBRUQsS0FBSyxVQUFVLFNBQVM7SUFDcEIsTUFBTSxRQUFRLEdBQUcsTUFBTSxLQUFLLENBQUMscUNBQXFDLENBQUMsQ0FBQztJQUNwRSxJQUFHLENBQUMsUUFBUSxDQUFDLEVBQUUsRUFBRTtRQUNiLE9BQU8sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7S0FDMUI7SUFFRCxNQUFNLE1BQU0sR0FBWSxNQUFNLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUU5QyxPQUFPLE1BQU0sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEVBQUU7UUFDdEIsT0FBTyxLQUFLLENBQUMsSUFBSTtJQUNyQixDQUFDLENBQUM7QUFDTixDQUFDO0FBRUQsQ0FBQyxLQUFLLElBQUksRUFBRTtJQUNSLElBQUk7UUFDQSxJQUFJLGFBQWEsR0FBRyxNQUFNLFNBQVMsRUFBRSxDQUFDO1FBQ3RDLFlBQVksQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBcUIsRUFBRSxhQUFhLENBQUMsQ0FBQztLQUNyRjtJQUFDLE9BQU8sQ0FBQyxFQUFFO1FBQ1Isc0NBQXNDO0tBQ3pDO0FBQ0wsQ0FBQyxDQUFDLEVBQUUsQ0FBQyIsImZpbGUiOiJidW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbnRlcmZhY2UgVXNlciB7XG4gICAgaWQ6IG51bWJlcjtcbiAgICByZW5vd25fbGV2ZWw6IG51bWJlcjtcbiAgICBpdGVtX2xldmVsOiBzdHJpbmc7XG4gICAgbGV2ZWw6IG51bWJlcjtcbiAgICBuYW1lOiBzdHJpbmc7XG4gICAgcmVhbG06IHN0cmluZztcbiAgICBmYWN0aW9uOiBzdHJpbmc7XG4gICAgY2xhc3M6IHN0cmluZztcbiAgICBjb3ZlbmFudDogc3RyaW5nO1xuICAgIGdlbmRlcjogc3RyaW5nO1xuICAgIHJhY2U6IHN0cmluZztcbiAgICBzcGVjOiBzdHJpbmc7XG4gICAgZ3VpbGQ6IHN0cmluZztcbiAgICBtZWRpYToge1xuICAgICAgICBhdmF0YXI6IHN0cmluZztcbiAgICAgICAgbWFpbjogc3RyaW5nO1xuICAgIH1cbiAgICBwdnBfc3RhdGlzdGNzOiBQVlBTdGF0aWNzXG59XG5cbmludGVyZmFjZSBQVlBTdGF0aWNzIHtcbiAgICBcIjJ2MlwiOiB7XG4gICAgICAgIGhpZ2hlc3RfcmF0aW5nOiBudW1iZXI7XG4gICAgICAgIGN1cnJlbnRfcmF0aW5nOiBudW1iZXI7XG4gICAgICAgIHNlYXNvbl9oaWdoZXN0X3JhdGluZzogbnVtYmVyO1xuICAgIH1cbiAgICBcIjN2M1wiOiB7XG4gICAgICAgIGhpZ2hlc3RfcmF0aW5nOiBudW1iZXI7XG4gICAgICAgIGN1cnJlbnRfcmF0aW5nOiBudW1iZXI7XG4gICAgICAgIHNlYXNvbl9oaWdoZXN0X3JhdGluZzogbnVtYmVyO1xuICAgIH1cbiAgICBcInJiZ1wiOiB7XG4gICAgICAgIGhpZ2hlc3RfcmF0aW5nOiBudW1iZXI7XG4gICAgICAgIGN1cnJlbnRfcmF0aW5nOiBudW1iZXI7XG4gICAgICAgIHNlYXNvbl9oaWdoZXN0X3JhdGluZzogbnVtYmVyO1xuICAgIH1cbn1cblxuY29uc3QgY2xhc3NDb2xvcnMgPSBuZXcgTWFwKFtcbiAgICBbJ0RlYXRoIEtuaWdodCcsICcjQzQxRTNBJ10sXG4gICAgWydEZW1vbiBIdW50ZXInLCAnI0EzMzBDOSddLFxuICAgIFsnRHJ1aWQnLCAnI0ZGN0MwQSddLFxuICAgIFsnSHVudGVyJywgJyNBQUQzNzInXSxcbiAgICBbJ01hZ2UnLCAnIzNGQzdFQiddLFxuICAgIFsnTW9uaycsICcjMDBGRjk4J10sXG4gICAgWydQYWxhZGluJywgJyNGNDhDQkEnXSxcbiAgICBbJ1ByaWVzdCcsICcjRkZGRkZGJ10sXG4gICAgWydSb2d1ZScsICcjRkZGNDY4J10sXG4gICAgWydTaGFtYW4nLCAnIzAwNzBERCddLFxuICAgIFsnV2FybG9jaycsICcjODc4OEVFJ10sXG4gICAgWydXYXJyaW9yJywgJyNDNjlCNkQnXSxcbl0pXG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZXRVc2VyKHByb2ZpbGVOYW1lOiBzdHJpbmcpIHsgXG4gICAgY29uc3QgcmVnaW9uID0gJ2V1J1xuICAgIGNvbnN0IHJlYWxtU2x1ZyA9ICdzaWx2ZXJtb29uJ1xuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goYGh0dHA6Ly9sb2NhbGhvc3Q6ODA4MC9hcGkvdjEvY2hhcmFjdGVyLyR7cmVnaW9ufS8ke3JlYWxtU2x1Z30vJHtwcm9maWxlTmFtZX1gKTtcblxuICAgIGlmKCFyZXNwb25zZS5vaykge1xuICAgICAgICBjb25zb2xlLmVycm9yKCdlcnJvcicpO1xuICAgIH1cblxuICAgIGNvbnN0IHVzZXI6IFVzZXIgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XG4gICAgY29uc3QgY29sb3IgPSBjbGFzc0NvbG9ycy5nZXQodXNlci5jbGFzcykgPz8gJyNGRkZGRkYnO1xuICAgIFxuICAgIGNvbnN0IGJhY2tncm91bmQgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdiYWNrZ3JvdW5kJylbMF0gYXMgSFRNTEVsZW1lbnQ7XG4gICAgYmFja2dyb3VuZC5zdHlsZVsnYmFja2dyb3VuZC1pbWFnZSddID0gYHVybCgke3VzZXIubWVkaWEubWFpbn0pYFxuXG4gICAgY29uc3QgbmFtZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCduYW1lJyk7XG4gICAgcmVtb3ZlQ2hpbGRyZW4obmFtZSk7XG5cbiAgICBuYW1lLnRleHRDb250ZW50ID0gdXNlci5uYW1lO1xuICAgIG5hbWUuc3R5bGUuY29sb3IgPSBjb2xvcjtcbiAgICBjb25zdCBsb2dvID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW1nJyk7XG4gICAgbG9nby5zcmMgPSB1c2VyLmZhY3Rpb24gPT09ICdBbGxpYW5jZScgPyAnYXNzZXRzL0xvZ28tYWxsaWFuY2UucG5nJyA6ICdhc3NldHMvTG9nby1ob3JkZS5wbmcnO1xuICAgIG5hbWUuYXBwZW5kQ2hpbGQobG9nbylcblxuICAgIGNvbnN0IGF2YXRhciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhdmF0YXInKTtcbiAgICByZW1vdmVDaGlsZHJlbihhdmF0YXIpO1xuICAgIGNvbnN0IGltZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2ltZycpO1xuICAgIGltZy5zcmMgPSB1c2VyLm1lZGlhLmF2YXRhcjtcbiAgICBhdmF0YXIuYXBwZW5kQ2hpbGQoaW1nKTtcblxuICAgIGNvbnN0IGl0ZW1MdmwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaXRlbS1sdmwnKTtcbiAgICBpdGVtTHZsLnRleHRDb250ZW50ID0gYCR7dXNlci5pdGVtX2xldmVsfSBJTFZMYFxuXG4gICAgY29uc3QgY2hhcmFjdGVyVGl0bGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2hhcmFjdGVyLXRpdGxlJyk7XG4gICAgY29uc3QgZ3VpbGQgPSB1c2VyLmd1aWxkID8gYDwke3VzZXIuZ3VpbGR9PmAgOiAnJ1xuICAgIGNoYXJhY3RlclRpdGxlLnRleHRDb250ZW50ID0gYCR7dXNlci5sZXZlbH0gJHt1c2VyLnJhY2V9ICR7dXNlci5zcGVjfSAke3VzZXIuY2xhc3N9ICR7Z3VpbGR9ICR7dXNlci5yZWFsbX1gXG5cbiAgICBnZXRQdnBTdGF0aXN0aWNzKHVzZXIucHZwX3N0YXRpc3Rjcyk7XG5cbiAgICBjb25zdCBjYXJkcyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2NhcmQnKTtcbiAgICBmb3IoY29uc3QgY2FyZCBvZiBjYXJkcykge1xuICAgICAgICAoY2FyZCBhcyBIVE1MRWxlbWVudCkuc3R5bGUudmlzaWJpbGl0eSA9ICd2aXNpYmxlJyBcbiAgICB9XG59XG5cbmZ1bmN0aW9uIHJlbW92ZUNoaWxkcmVuKG5vZGU6IEhUTUxFbGVtZW50KSB7XG4gICAgd2hpbGUgKG5vZGUuZmlyc3RDaGlsZCkge1xuICAgICAgICBub2RlLnJlbW92ZUNoaWxkKG5vZGUubGFzdENoaWxkKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGdldFB2cFN0YXRpc3RpY3MocHZwc3RhdHM6IFBWUFN0YXRpY3MpIHtcbiAgICBjb25zdCB0YWJsZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJ0YWJsZVwiKTtcbiAgICByZW1vdmVDaGlsZHJlbih0YWJsZSk7XG4gICAgY29uc3QgdGhlYWQgPSB0YWJsZS5jcmVhdGVUSGVhZCgpO1xuICAgIGNvbnN0IGNvbHMgPSBbJycsICdDdXJyZW50IFJhdGluZycsICdTZWFzb24gSGlnaCcsICdIaWdoZXN0IFJhdGluZyddXG4gICAgY29uc3QgaGVhZGVyUm93ID0gdGhlYWQuaW5zZXJ0Um93KCk7XG4gICAgY29scy5mb3JFYWNoKGNvbCA9PiB7XG4gICAgICAgIGNvbnN0IHRoID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGgnKTtcbiAgICAgICAgY29uc3QgdGV4dCA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGNvbCk7XG4gICAgICAgIHRoLmFwcGVuZENoaWxkKHRleHQpO1xuICAgICAgICBoZWFkZXJSb3cuYXBwZW5kQ2hpbGQodGgpO1xuICAgIH0pXG5cbiAgICBPYmplY3QuZW50cmllcyhwdnBzdGF0cykuZm9yRWFjaCgoW2tleSwgdmFsdWVdKSA9PiB7XG4gICAgICAgIGNvbnN0IHJvdyA9IHRhYmxlLmluc2VydFJvdygpO1xuICAgICAgICBpbnNlcnRDZWxsKHJvdywga2V5KTtcbiAgICAgICAgaW5zZXJ0Q2VsbChyb3csIHZhbHVlLmN1cnJlbnRfcmF0aW5nKTtcbiAgICAgICAgaW5zZXJ0Q2VsbChyb3csIHZhbHVlLnNlYXNvbl9oaWdoZXN0X3JhdGluZyk7XG4gICAgICAgIGluc2VydENlbGwocm93LCB2YWx1ZS5oaWdoZXN0X3JhdGluZyk7XG4gICAgfSlcbn1cblxuZnVuY3Rpb24gaW5zZXJ0Q2VsbChyb3c6IEhUTUxUYWJsZVJvd0VsZW1lbnQsIHN0YXQ6IGFueSkge1xuICAgIGNvbnN0IGNlbGwgPSByb3cuaW5zZXJ0Q2VsbCgpO1xuICAgIGNvbnN0IHRleHQgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShzdGF0KTtcbiAgICBjZWxsLmFwcGVuZENoaWxkKHRleHQpXG59XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHRpZihfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdKSB7XG5cdFx0cmV0dXJuIF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0uZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQge2dldFVzZXJ9IGZyb20gJy4vdXNlcic7XG5cblxuZnVuY3Rpb24gY2xvc2VBbGxMaXN0cygpIHtcbiAgICBjb25zdCBpdGVtcyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2F1dG9jb21wbGV0ZS1pdGVtcycpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaXRlbXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaXRlbXNbaV0ucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChpdGVtc1tpXSk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBhdXRvY29tcGxldGUoaW5wdXQ6IEhUTUxJbnB1dEVsZW1lbnQsIGRlZmF1bHRSZWFsbXM6IHN0cmluZ1tdKSB7XG4gICAgaW5wdXQuYWRkRXZlbnRMaXN0ZW5lcihcImlucHV0XCIsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgY2xvc2VBbGxMaXN0cygpO1xuXG4gICAgICAgIGNvbnN0IHR5cGVkVmFsdWUgPSB0aGlzLnZhbHVlO1xuICAgICAgICBpZighdHlwZWRWYWx1ZSkgcmV0dXJuIGZhbHNlO1xuXG4gICAgICAgIGNvbnN0IGxpc3QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgbGlzdC5zZXRBdHRyaWJ1dGUoXCJpZFwiLCB0aGlzLmlkICsgXCJhdXRvY29tcGxldGUtbGlzdFwiKTtcbiAgICAgICAgbGlzdC5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBcImF1dG9jb21wbGV0ZS1pdGVtc1wiKTtcbiAgICAgICAgdGhpcy5wYXJlbnROb2RlLmFwcGVuZENoaWxkKGxpc3QpO1xuXG4gICAgICAgIC8vIGlmIGVsaSBzZW5kIG1lIG5vdGhpbmcsIHRoZW4gVUkgZGlzcGxheSB0eXBlZCAtIHJlYWxtXG4gICAgICAgIC8vIGxpbWl0IHRvIDEwIFxuICAgICAgICBjb25zdCBtYXRjaGVkUmVhbG0gPSB0eXBlZFZhbHVlLnNwbGl0KCctJylbMV07XG4gICAgICAgIGlmKG1hdGNoZWRSZWFsbT8ubGVuZ3RoKSB7XG4gICAgICAgICAgICBjb25zdCBtYXRjaGluZ1JlYWxtcyA9IGdldE1hdGNoaW5nUmVhbG1zKGRlZmF1bHRSZWFsbXMsIG1hdGNoZWRSZWFsbSk7XG4gICAgICAgICAgICBtYXRjaGluZ1JlYWxtcy5mb3JFYWNoKHJlYWxtID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBtYXRjaGluZ1JlYWxtID0gbWF0Y2hlZFJlYWxtLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgbWF0Y2hlZFJlYWxtLnNsaWNlKDEpO1xuICAgICAgICAgICAgICAgIGNvbnN0IHByb2ZpbGUgPSB0eXBlZFZhbHVlLnNwbGl0KCctJylbMF0gKyAnLSc7XG4gICAgICAgICAgICAgICAgY29uc3QgaXRlbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG5cbiAgICAgICAgICAgICAgICBpdGVtLmlubmVySFRNTCA9IFwiPHN0cm9uZz5cIiArIHByb2ZpbGUgKyBtYXRjaGluZ1JlYWxtICsgXCI8L3N0cm9uZz5cIjtcbiAgICAgICAgICAgICAgICBpdGVtLmlubmVySFRNTCArPSByZWFsbS5zdWJzdHIobWF0Y2hpbmdSZWFsbS5sZW5ndGgpO1xuICAgICAgICAgICAgICAgIGxpc3QuYXBwZW5kQ2hpbGQoaXRlbSk7XG4gICAgICAgICAgICAgICAgaXRlbS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgaW5wdXQudmFsdWUgPSAodGhpcy5nZXRFbGVtZW50c0J5VGFnTmFtZShcImlucHV0XCIpKVswXS52YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgZ2V0VXNlcihpbnB1dC52YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgIGNsb3NlQWxsTGlzdHMoKTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGRlZmF1bHRSZWFsbXMuc2xpY2UoMCwgOSkuZm9yRWFjaChyZWFsbSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgaXRlbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG5cbiAgICAgICAgICAgICAgICBpdGVtLmlubmVySFRNTCA9IFwiPHN0cm9uZz5cIiArIHR5cGVkVmFsdWUgKyBcIjwvc3Ryb25nPlwiO1xuICAgICAgICAgICAgICAgIGl0ZW0uaW5uZXJIVE1MICs9IHJlYWxtXG4gICAgICAgICAgICAgICAgbGlzdC5hcHBlbmRDaGlsZChpdGVtKTtcbiAgICAgICAgICAgICAgICBpdGVtLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgICAgICAgICBpbnB1dC52YWx1ZSA9ICh0aGlzLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiaW5wdXRcIikpWzBdLnZhbHVlO1xuICAgICAgICAgICAgICAgICAgICBnZXRVc2VyKGlucHV0LnZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgY2xvc2VBbGxMaXN0cygpO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgfSlcblxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgY2xvc2VBbGxMaXN0cygpXG4gICAgfSlcbn1cblxuaW50ZXJmYWNlIFJlYWxtIHtcbiAgICBuYW1lOiBzdHJpbmdcbiAgICBzbHVnOiBzdHJpbmdcbiAgICByZWdpb246IHN0cmluZ1xufVxuXG5mdW5jdGlvbiBnZXRNYXRjaGluZ1JlYWxtcyhyZWFsbXM6IHN0cmluZ1tdLCB0eXBlZFJlYWxtOiBzdHJpbmcpOiBzdHJpbmdbXSB7XG4gICAgY29uc3QgbWF0Y2hpbmdSZWFsbXMgPSBbXVxuICAgIGZvcihjb25zdCByZWFsbSBvZiByZWFsbXMpIHtcbiAgICAgICAgaWYocmVhbG0udG9VcHBlckNhc2UoKS5pbmNsdWRlcyh0eXBlZFJlYWxtPy50b1VwcGVyQ2FzZSgpKSkge1xuICAgICAgICAgICAgbWF0Y2hpbmdSZWFsbXMucHVzaChyZWFsbSk7XG4gICAgICAgICAgICBpZihtYXRjaGluZ1JlYWxtcy5sZW5ndGggPiA5KXtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbWF0Y2hpbmdSZWFsbXNcbn1cblxuYXN5bmMgZnVuY3Rpb24gZ2V0UmVhbG1zKCk6IFByb21pc2U8c3RyaW5nW10+IHtcbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKGBodHRwOi8vbG9jYWxob3N0OjgwODAvYXBpL3YxL3JlYWxtc2ApO1xuICAgIGlmKCFyZXNwb25zZS5vaykge1xuICAgICAgICBjb25zb2xlLmVycm9yKCdlcnJvcicpO1xuICAgIH1cblxuICAgIGNvbnN0IHJlYWxtczogUmVhbG1bXSA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcbiAgICBcbiAgICByZXR1cm4gcmVhbG1zLm1hcChyZWFsbSA9PiB7XG4gICAgICAgIHJldHVybiByZWFsbS5uYW1lXG4gICAgfSlcbn1cblxuKGFzeW5jICgpID0+IHtcbiAgICB0cnkge1xuICAgICAgICB2YXIgZGVmYXVsdFJlYWxtcyA9IGF3YWl0IGdldFJlYWxtcygpO1xuICAgICAgICBhdXRvY29tcGxldGUoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJpbnB1dFwiKSBhcyBIVE1MSW5wdXRFbGVtZW50LCBkZWZhdWx0UmVhbG1zKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIC8vIERlYWwgd2l0aCB0aGUgZmFjdCB0aGUgY2hhaW4gZmFpbGVkXG4gICAgfVxufSkoKTtcbiJdLCJzb3VyY2VSb290IjoiIn0=