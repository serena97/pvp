import autocomplete from "./services/searchService";

(async () => {
    try {
        await autocomplete(document.getElementById("input") as HTMLInputElement);
    } catch (e) {
        console.error(e);
    }
})();
