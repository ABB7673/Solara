const dom = {
    container: document.getElementById("mainContainer"),
    backgroundStage: document.getElementById("backgroundStage"),
    backgroundBaseLayer: document.getElementById("backgroundBaseLayer"),
    backgroundTransitionLayer: document.getElementById("backgroundTransitionLayer"),
    playlist: document.getElementById("playlist"),
    playlistItems: document.getElementById("playlistItems"),
    favorites: document.getElementById("favorites"),
    favoriteItems: document.getElementById("favoriteItems"),
    lyrics: document.getElementById("lyrics"),
    lyricsScroll: document.getElementById("lyricsScroll"),
    lyricsContent: document.getElementById("lyricsContent"),
    mobileInlineLyrics: document.getElementById("mobileInlineLyrics"),
    mobileInlineLyricsScroll: document.getElementById("mobileInlineLyricsScroll"),
    mobileInlineLyricsContent: document.getElementById("mobileInlineLyricsContent"),
    audioPlayer: document.getElementById("audioPlayer"),
    themeToggleButton: document.getElementById("themeToggleButton"),
    loadOnlineBtn: document.getElementById("loadOnlineBtn"),
    showPlaylistBtn: document.getElementById("showPlaylistBtn"),
    showLyricsBtn: document.getElementById("showLyricsBtn"),
    searchInput: document.getElementById("searchInput"),
    searchBtn: document.getElementById("searchBtn"),
    sourceSelectButton: document.getElementById("sourceSelectButton"),
    sourceSelectLabel: document.getElementById("sourceSelectLabel"),
    sourceMenu: document.getElementById("sourceMenu"),
    searchResults: document.getElementById("searchResults"),
    searchResultsList: document.getElementById("searchResultsList"),
    notification: document.getElementById("notification"),
    albumCover: document.getElementById("albumCover"),
    currentSongTitle: document.getElementById("currentSongTitle"),
    currentSongArtist: document.getElementById("currentSongArtist"),
    debugInfo: document.getElementById("debugInfo"),
    importSelectedBtn: document.getElementById("importSelectedBtn"),
    importSelectedCount: document.getElementById("importSelectedCount"),
    importSelectedMenu: document.getElementById("importSelectedMenu"),
    importToPlaylist: document.getElementById("importToPlaylist"),
    importToFavorites: document.getElementById("importToFavorites"),
    importPlaylistBtn: document.getElementById("importPlaylistBtn"),
    exportPlaylistBtn: document.getElementById("exportPlaylistBtn"),
    importPlaylistInput: document.getElementById("importPlaylistInput"),
    clearPlaylistBtn: document.getElementById("clearPlaylistBtn"),
    mobileImportPlaylistBtn: document.getElementById("mobileImportPlaylistBtn"),
    mobileExportPlaylistBtn: document.getElementById("mobileExportPlaylistBtn"),
    playModeBtn: document.getElementById("playModeBtn"),
    playPauseBtn: document.getElementById("playPauseBtn"),
    progressBar: document.getElementById("progressBar"),
    currentTimeDisplay: document.getElementById("currentTimeDisplay"),
    durationDisplay: document.getElementById("durationDisplay"),
    volumeSlider: document.getElementById("volumeSlider"),
    volumeIcon: document.getElementById("volumeIcon"),
    qualityToggle: document.getElementById("qualityToggle"),
    playerQualityMenu: document.getElementById("playerQualityMenu"),
    qualityLabel: document.getElementById("qualityLabel"),
    mobileToolbarTitle: document.getElementById("mobileToolbarTitle"),
    mobileSearchToggle: document.getElementById("mobileSearchToggle"),
    mobileSearchClose: document.getElementById("mobileSearchClose"),
    mobilePanelClose: document.getElementById("mobilePanelClose"),
    mobileClearPlaylistBtn: document.getElementById("mobileClearPlaylistBtn"),
    mobilePlaylistActions: document.getElementById("mobilePlaylistActions"),
    mobileFavoritesActions: document.getElementById("mobileFavoritesActions"),
    mobileAddAllFavoritesBtn: document.getElementById("mobileAddAllFavoritesBtn"),
    mobileImportFavoritesBtn: document.getElementById("mobileImportFavoritesBtn"),
    mobileExportFavoritesBtn: document.getElementById("mobileExportFavoritesBtn"),
    mobileClearFavoritesBtn: document.getElementById("mobileClearFavoritesBtn"),
    mobileOverlayScrim: document.getElementById("mobileOverlayScrim"),
    mobileExploreButton: document.getElementById("mobileExploreButton"),
    mobileQualityToggle: document.getElementById("mobileQualityToggle"),
    mobileQualityLabel: document.getElementById("mobileQualityLabel"),
    mobilePanel: document.getElementById("mobilePanel"),
    mobileQueueToggle: document.getElementById("mobileQueueToggle"),
    shuffleToggleBtn: document.getElementById("shuffleToggleBtn"),
    searchArea: document.getElementById("searchArea"),
    libraryTabs: Array.from(document.querySelectorAll(".playlist-tab[data-target]")),
    addAllFavoritesBtn: document.getElementById("addAllFavoritesBtn"),
    importFavoritesBtn: document.getElementById("importFavoritesBtn"),
    exportFavoritesBtn: document.getElementById("exportFavoritesBtn"),
    importFavoritesInput: document.getElementById("importFavoritesInput"),
    clearFavoritesBtn: document.getElementById("clearFavoritesBtn"),
    currentFavoriteToggle: document.getElementById("currentFavoriteToggle"),
    // 新增搜索类型相关DOM
    searchTypeWrapper: document.getElementById("searchTypeWrapper"),
    searchTypeButton: document.getElementById("searchTypeButton"),
    searchTypeLabel: document.getElementById("searchTypeLabel"),
    searchTypeMenu: document.getElementById("searchTypeMenu"),
};
window.SolaraDom = dom;
const isMobileView = Boolean(window.__SOLARA_IS_MOBILE);
const mobileBridge = window.SolaraMobileBridge || {};
mobileBridge.handlers = mobileBridge.handlers || {};
mobileBridge.queue = Array.isArray(mobileBridge.queue) ? mobileBridge.queue : [];
window.SolaraMobileBridge = mobileBridge;
function invokeMobileHook(name, ...args) {
    if (!isMobileView) {
        return undefined;
    }
    const handler = mobileBridge.handlers[name];
    if (typeof handler === "function") {
        return handler(...args);
    }
    mobileBridge.queue.push({ name, args });
    return undefined;
}
function initializeMobileUI() {
    return invokeMobileHook("initialize");
}
function updateMobileToolbarTitle() {
    return invokeMobileHook("updateToolbarTitle");
}
function runAfterOverlayFrame(callback) {
    if (typeof callback !== "function" || !isMobileView) {
        return;
    }
    const runner = () => {
        if (!document.body) {
            return;
        }
        callback();
    };
    if (typeof window.requestAnimationFrame === "function") {
        window.requestAnimationFrame(runner);
    } else {
        window.setTimeout(runner, 0);
    }
}
function syncMobileOverlayVisibility() {
    if (!isMobileView || !document.body) {
        return;
    }
    const searchOpen = document.body.classList.contains("mobile-search-open");
    const panelOpen = document.body.classList.contains("mobile-panel-open");
    if (dom.searchArea) {
        dom.searchArea.setAttribute("aria-hidden", searchOpen ? "false" : "true");
    }
    if (dom.mobileOverlayScrim) {
        dom.mobileOverlayScrim.setAttribute("aria-hidden", (searchOpen || panelOpen) ? "false" : "true");
    }
}
function updateMobileClearPlaylistVisibility() {
    if (!isMobileView) {
        return;
    }
    const button = dom.mobileClearPlaylistBtn;
    if (!button) {
        return;
    }
    const playlistElement = dom.playlist;
    const body = document.body;
    const currentView = body ? body.getAttribute("data-mobile-panel-view") : null;
    const isPlaylistView = !body || !currentView || currentView === "playlist";
    const playlistSongs = (typeof state !== "undefined" && Array.isArray(state.playlistSongs)) ? state.playlistSongs : [];
    const isEmpty = playlistSongs.length === 0 || !playlistElement || playlistElement.classList.contains("empty");
    const isPlaylistVisible = Boolean(playlistElement && !playlistElement.hasAttribute("hidden"));
    const shouldShow = isPlaylistView && isPlaylistVisible && !isEmpty;
    button.hidden = !shouldShow;
    button.setAttribute("aria-hidden", shouldShow ? "false" : "true");
}
function updateMobileLibraryActionVisibility(showFavorites) {
    if (!isMobileView) {
        return;
    }
    const playlistGroup = dom.mobilePlaylistActions;
    const favoritesGroup = dom.mobileFavoritesActions;
    const showFavoritesGroup = Boolean(showFavorites);
    if (playlistGroup) {
        if (showFavoritesGroup) {
            playlistGroup.setAttribute("hidden", "");
            playlistGroup.setAttribute("aria-hidden", "true");
        } else {
            playlistGroup.removeAttribute("hidden");
            playlistGroup.setAttribute("aria-hidden", "false");
        }
    }
    if (favoritesGroup) {
        if (showFavoritesGroup) {
            favoritesGroup.removeAttribute("hidden");
            favoritesGroup.setAttribute("aria-hidden", "false");
        } else {
            favoritesGroup.setAttribute("hidden", "");
            favoritesGroup.setAttribute("aria-hidden", "true");
        }
    }
}
function forceCloseMobileSearchOverlay() {
    if (!isMobileView || !document.body) {
        return;
    }
    document.body.classList.remove("mobile-search-open");
    if (dom.searchInput) {
        dom.searchInput.blur();
    }
    syncMobileOverlayVisibility();
}
function forceCloseMobilePanelOverlay() {
    if (!isMobileView || !document.body) {
        return;
    }
    document.body.classList.remove("mobile-panel-open");
    syncMobileOverlayVisibility();
}
function openMobileSearch() {
    return invokeMobileHook("openSearch");
}
function closeMobileSearch() {
    const result = invokeMobileHook("closeSearch");
    runAfterOverlayFrame(forceCloseMobileSearchOverlay);
    return result;
}
function toggleMobileSearch() {
    return invokeMobileHook("toggleSearch");
}
function openMobilePanel(view = "playlist") {
    return invokeMobileHook("openPanel", view);
}
function closeMobilePanel() {
    const result = invokeMobileHook("closePanel");
    runAfterOverlayFrame(forceCloseMobilePanelOverlay);
    return result;
}
function toggleMobilePanel(view = "playlist") {
    return invokeMobileHook("togglePanel", view);
}
function closeAllMobileOverlays() {
    const result = invokeMobileHook("closeAllOverlays");
    runAfterOverlayFrame(() => {
        forceCloseMobileSearchOverlay();
        forceCloseMobilePanelOverlay();
    });
    return result;
}
function updateMobileInlineLyricsAria(isOpen) {
    if (!dom.mobileInlineLyrics) {
        return;
    }
    dom.mobileInlineLyrics.setAttribute("aria-hidden", isOpen ? "false" : "true");
}
function setMobileInlineLyricsOpen(isOpen) {
    if (!isMobileView || !document.body || !dom.mobileInlineLyrics) {
        return;
    }
    state.isMobileInlineLyricsOpen = Boolean(isOpen);
    document.body.classList.toggle("mobile-inline-lyrics-open", Boolean(isOpen));
    updateMobileInlineLyricsAria(Boolean(isOpen));
}
function hasInlineLyricsContent() {
    const content = dom.mobileInlineLyricsContent;
    if (!content) {
        return false;
    }
    return content.textContent.trim().length > 0;
}
function canOpenMobileInlineLyrics() {
    if (!isMobileView || !document.body) {
        return false;
    }
    const hasSong = Boolean(state.currentSong);
    return hasSong && hasInlineLyricsContent();
}
function closeMobileInlineLyrics(options = {}) {
    if (!isMobileView || !document.body) {
        return false;
    }
    if (!document.body.classList.contains("mobile-inline-lyrics-open")) {
        updateMobileInlineLyricsAria(false);
        state.isMobileInlineLyricsOpen = false;
        return false;
    }
    setMobileInlineLyricsOpen(false);
    if (options.force) {
        state.userScrolledLyrics = false;
    }
    return true;
}
function openMobileInlineLyrics() {
    if (!isMobileView || !document.body) {
        return false;
    }
    if (!canOpenMobileInlineLyrics()) {
        return false;
    }
    setMobileInlineLyricsOpen(true);
    state.userScrolledLyrics = false;
    window.requestAnimationFrame(() => {
        const container = dom.mobileInlineLyricsScroll || dom.mobileInlineLyrics;
        const activeLyric = dom.mobileInlineLyricsContent?.querySelector(".current") ||
            dom.mobileInlineLyricsContent?.querySelector("div[data-index]");
        if (container && activeLyric) {
            scrollToCurrentLyric(activeLyric, container);
        }
    });
    syncLyrics();
    return true;
}
function toggleMobileInlineLyrics() {
    if (!isMobileView || !document.body) {
        return;
    }
    if (document.body.classList.contains("mobile-inline-lyrics-open")) {
        closeMobileInlineLyrics();
    } else {
        openMobileInlineLyrics();
    }
}
const PLACEHOLDER_HTML = `<div class="placeholder"><<i class="fas fa-music"></</i></div>`;
const paletteCache = new Map();
const PALETTE_STORAGE_KEY = "paletteCache.v1";
let paletteAbortController = null;
const BACKGROUND_TRANSITION_DURATION = 850;
let backgroundTransitionTimer = null;
const PALETTE_APPLY_DELAY = 140;
let pendingPaletteTimer = null;
let deferredPaletteHandle = null;
let deferredPaletteType = "";
let deferredPaletteUrl = null;
const themeDefaults = {
    light: {
        gradient: "",
        primaryColor: "",
        primaryColorDark: "",
    },
    dark: {
        gradient: "",
        primaryColor: "",
        primaryColorDark: "",
    }
};
let paletteRequestId = 0;
const REMOTE_STORAGE_ENDPOINT = "/api/storage";
let remoteSyncEnabled = false;
const STORAGE_KEYS_TO_SYNC = new Set([
    "playlistSongs",
    "currentTrackIndex",
    "playMode",
    "playbackQuality",
    "playerVolume",
    "currentPlaylist",
    "currentList",
    "currentSong",
    "currentPlaybackTime",
    "favoriteSongs",
    "currentFavoriteIndex",
    "favoritePlayMode",
    "favoritePlaybackTime",
    "searchSource",
    "lastSearchState.v1",
    "searchType", // 新增搜索类型存储
]);
function createPersistentStorageClient() {
    let availabilityPromise = null;
    let remoteAvailable = false;
    const checkAvailability = async () => {
        if (availabilityPromise) {
            return availabilityPromise;
        }
        availabilityPromise = (async () => {
            try {
                const url = new URL(REMOTE_STORAGE_ENDPOINT, window.location.origin);
                url.searchParams.set("status", "1");
                const response = await fetch(url.toString(), { method: "GET" });
                if (!response.ok) {
                    return false;
                }
                const result = await response.json().catch(() => ({}));
                remoteAvailable = Boolean(result && result.d1Available);
                return remoteAvailable;
            } catch (error) {
                console.warn("检查远程存储可用性失败", error);
                return false;
            }
        })();
        return availabilityPromise;
    };
    const getItems = async (keys = []) => {
        const available = await checkAvailability();
        if (!available || !Array.isArray(keys) || keys.length === 0) {
            return null;
        }
        try {
            const url = new URL(REMOTE_STORAGE_ENDPOINT, window.location.origin);
            url.searchParams.set("keys", keys.join(","));
            const response = await fetch(url.toString(), { method: "GET" });
            if (!response.ok) {
                return null;
            }
            return await response.json();
        } catch (error) {
            console.warn("获取远程存储数据失败", error);
            return null;
        }
    };
    const setItems = async (items) => {
        const available = await checkAvailability();
        if (!available || !items || typeof items !== "object") {
            return false;
        }
        try {
            await fetch(REMOTE_STORAGE_ENDPOINT, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ data: items }),
            });
            return true;
        } catch (error) {
            console.warn("写入远程存储失败", error);
            return false;
        }
    };
    const removeItems = async (keys = []) => {
        const available = await checkAvailability();
        if (!available || !Array.isArray(keys) || keys.length === 0) {
            return false;
        }
        try {
            await fetch(REMOTE_STORAGE_ENDPOINT, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ keys }),
            });
            return true;
        } catch (error) {
            console.warn("删除远程存储数据失败", error);
            return false;
        }
    };
    return {
        checkAvailability,
        getItems,
        setItems,
        removeItems,
    };
}
const persistentStorage = createPersistentStorageClient();
function shouldSyncStorageKey(key) {
    return STORAGE_KEYS_TO_SYNC.has(key);
}
function persistStorageItems(items) {
    if (!items || typeof items !== "object") {
        return;
    }
    persistentStorage.setItems(items).catch((error) => {
        console.warn("同步远程存储失败", error);
    });
}
function removePersistentItems(keys = []) {
    if (!Array.isArray(keys) || keys.length === 0) {
        return;
    }
    persistentStorage.removeItems(keys).catch((error) => {
        console.warn("移除远程存储数据失败", error);
    });
}
function safeGetLocalStorage(key) {
    try {
        return localStorage.getItem(key);
    } catch (error) {
        console.warn(`读取本地存储失败: ${key}`, error);
        return null;
    }
}
function safeSetLocalStorage(key, value, options = {}) {
    const { skipRemote = false } = options;
    try {
        localStorage.setItem(key, value);
    } catch (error) {
        console.warn(`写入本地存储失败: ${key}`, error);
    }
    if (!skipRemote && remoteSyncEnabled && shouldSyncStorageKey(key)) {
        persistStorageItems({ [key]: value });
    }
}
function safeRemoveLocalStorage(key, options = {}) {
    const { skipRemote = false } = options;
    try {
        localStorage.removeItem(key);
    } catch (error) {
        console.warn(`移除本地存储失败: ${key}`, error);
    }
    if (!skipRemote && remoteSyncEnabled && shouldSyncStorageKey(key)) {
        removePersistentItems([key]);
    }
}
function parseJSON(value, fallback) {
    if (!value) return fallback;
    try {
        const parsed = JSON.parse(value);
        return parsed;
    } catch (error) {
        console.warn("解析本地存储 JSON 失败", error);
        return fallback;
    }
}
function cloneSearchResults(results) {
    if (!Array.isArray(results)) {
        return [];
    }
    try {
        return JSON.parse(JSON.stringify(results));
    } catch (error) {
        console.warn("复制搜索结果失败，回退到浅拷贝", error);
        return results.map((item) => {
            if (item && typeof item === "object") {
                return { ...item };
            }
            return item;
        });
    }
}
function sanitizeStoredSearchState(data, defaultSource = SOURCE_OPTIONS[0].value) {
    if (!data || typeof data !== "object") {
        return null;
    }
    const keyword = typeof data.keyword === "string" ? data.keyword : "";
    const sourceValue = typeof data.source === "string" ? data.source : defaultSource;
    const source = normalizeSource(sourceValue);
    const page = Number.isInteger(data.page) && data.page > 0 ? data.page : 1;
    const hasMore = typeof data.hasMore === "boolean" ? data.hasMore : true;
    const results = cloneSearchResults(data.results);
    // 新增搜索类型
    const searchType = typeof data.searchType === "string" ? data.searchType : SEARCH_TYPE_OPTIONS[0].value;
    return { keyword, source, page, hasMore, results, searchType };
}
function loadStoredPalettes() {
    const stored = safeGetLocalStorage(PALETTE_STORAGE_KEY);
    if (!stored) {
        return;
    }
    try {
        const entries = JSON.parse(stored);
        if (Array.isArray(entries)) {
            for (const entry of entries) {
                if (Array.isArray(entry) && typeof entry[0] === "string" && entry[1] && typeof entry[1] === "object") {
                    paletteCache.set(entry[0], entry[1]);
                }
            }
        }
    } catch (error) {
        console.warn("解析调色板缓存失败", error);
    }
}
function persistPaletteCache() {
    const maxEntries = 20;
    const entries = Array.from(paletteCache.entries()).slice(-maxEntries);
    try {
        safeSetLocalStorage(PALETTE_STORAGE_KEY, JSON.stringify(entries));
    } catch (error) {
        console.warn("保存调色板缓存失败", error);
    }
}
function preferHttpsUrl(url) {
    if (!url || typeof url !== "string") return url;
    try {
        const parsedUrl = new URL(url, window.location.href);
        if (parsedUrl.protocol === "http:" && window.location.protocol === "https:") {
            parsedUrl.protocol = "https:";
            return parsedUrl.toString();
        }
        return parsedUrl.toString();
    } catch (error) {
        if (window.location.protocol === "https:" && url.startsWith("http://")) {
            return "https://" + url.substring("http://".length);
        }
        return url;
    }
}
function toAbsoluteUrl(url) {
    if (!url) {
        return "";
    }
    try {
        const absolute = new URL(url, window.location.href);
        return absolute.href;
    } catch (_) {
        return url;
    }
}
function buildAudioProxyUrl(url) {
    if (!url || typeof url !== "string") return url;
    try {
        const parsedUrl = new URL(url, window.location.href);
        if (parsedUrl.protocol === "https:") {
            return parsedUrl.toString();
        }
        if (parsedUrl.protocol === "http:" && /(^|\.)kuwo\.cn$/i.test(parsedUrl.hostname)) {
            return `${API.baseUrl}?target=${encodeURIComponent(parsedUrl.toString())}`;
        }
        return parsedUrl.toString();
    } catch (error) {
        console.warn("无法解析音频地址，跳过代理", error);
        return url;
    }
}
// 新增搜索类型选项
const SEARCH_TYPE_OPTIONS = [
    { value: "all", label: "综合" },
    { value: "playlist", label: "歌单" },
    { value: "artist", label: "歌手" },
    { value: "song", label: "单曲" },
    { value: "album", label: "专辑" }
];
// 音源API配置（默认+4个备份）
const AUDIO_API_LIST = [
    { baseUrl: "/proxy", name: "GD音乐台" },
    { baseUrl: "https://api.i-meto.com/meting/api", name: "i-meto" },
    { baseUrl: "https://api.injahow.cn/meting/", name: "injahow" },
    { baseUrl: "https://api.paugram.com/meting/", name: "paugram" },
    { baseUrl: "https://music.cyrilstudio.top/api", name: "cyrilstudio" }
];
// 歌词API配置（默认+4个备份）
const LYRIC_API_LIST = [
    { baseUrl: "/proxy", name: "GD音乐台" },
    { baseUrl: "https://api.lyrics.lol", name: "lyrics.lol" },
    { baseUrl: "https://api.i-meto.com/meting/api", name: "i-meto" },
    { baseUrl: "https://api.paugram.com/meting/", name: "paugram" },
    { baseUrl: "https://api.injahow.cn/meting/", name: "injahow" }
];
const SOURCE_OPTIONS = [
    { value: "netease", label: "网易云音乐" },
    { value: "kuwo", label: "酷我音乐" },
    { value: "joox", label: "JOOX音乐" }
];
function normalizeSource(value) {
    const allowed = SOURCE_OPTIONS.map(option => option.value);
    return allowed.includes(value) ? value : SOURCE_OPTIONS[0].value;
}
// 新增：归一化搜索类型
function normalizeSearchType(value) {
    const allowed = SEARCH_TYPE_OPTIONS.map(option => option.value);
    return allowed.includes(value) ? value : SEARCH_TYPE_OPTIONS[0].value;
}
const QUALITY_OPTIONS = [
    { value: "128", label: "标准音质", description: "128 kbps" },
    { value: "192", label: "高品音质", description: "192 kbps" },
    { value: "320", label: "极高音质", description: "320 kbps" },
    { value: "999", label: "无损音质", description: "FLAC" }
];
function normalizeQuality(value) {
    const match = QUALITY_OPTIONS.find(option => option.value === value);
    return match ? match.value : "320";
}
const savedPlaylistSongs = (() => {
    const stored = safeGetLocalStorage("playlistSongs");
    const playlist = parseJSON(stored, []);
    return Array.isArray(playlist) ? playlist : [];
})();
const PLAYLIST_EXPORT_VERSION = 1;
const savedFavoriteSongs = (() => {
    const stored = safeGetLocalStorage("favoriteSongs");
    const favorites = parseJSON(stored, []);
    return Array.isArray(favorites) ? favorites : [];
})();
const FAVORITE_EXPORT_VERSION = 1;
const savedCurrentFavoriteIndex = (() => {
    const stored = safeGetLocalStorage("currentFavoriteIndex");
    const index = Number.parseInt(stored, 10);
    return Number.isInteger(index) && index >= 0 ? index : 0;
})();
const savedFavoritePlayMode = (() => {
    const stored = safeGetLocalStorage("favoritePlayMode");
    const normalized = stored === "order" ? "list" : stored;
    const modes = ["list", "single", "random"];
    return modes.includes(normalized) ? normalized : "list";
})();
const savedFavoritePlaybackTime = (() => {
    const stored = safeGetLocalStorage("favoritePlaybackTime");
    const time = Number.parseFloat(stored);
    return Number.isFinite(time) && time >= 0 ? time : 0;
})();
const savedCurrentList = (() => {
    const stored = safeGetLocalStorage("currentList");
    return stored === "favorite" ? "favorite" : "playlist";
})();
const savedCurrentTrackIndex = (() => {
    const stored = safeGetLocalStorage("currentTrackIndex");
    const index = Number.parseInt(stored, 10);
    return Number.isInteger(index) ? index : -1;
})();
const savedPlayMode = (() => {
    const stored = safeGetLocalStorage("playMode");
    const modes = ["list", "single", "random"];
    return modes.includes(stored) ? stored : "list";
})();
const savedPlaybackQuality = normalizeQuality(safeGetLocalStorage("playbackQuality"));
const savedVolume = (() => {
    const stored = safeGetLocalStorage("playerVolume");
    const volume = Number.parseFloat(stored);
    if (Number.isFinite(volume)) {
        return Math.min(Math.max(volume, 0), 1);
    }
    return 0.8;
})();
const savedSearchSource = (() => {
    const stored = safeGetLocalStorage("searchSource");
    return normalizeSource(stored);
})();
// 新增：读取保存的搜索类型
const savedSearchType = (() => {
    const stored = safeGetLocalStorage("searchType");
    return normalizeSearchType(stored);
})();
const LAST_SEARCH_STATE_STORAGE_KEY = "lastSearchState.v1";
const savedLastSearchState = (() => {
    const stored = safeGetLocalStorage(LAST_SEARCH_STATE_STORAGE_KEY);
    const parsed = parseJSON(stored, null);
    return sanitizeStoredSearchState(parsed, savedSearchSource || SOURCE_OPTIONS[0].value);
})();
let lastSearchStateCache = savedLastSearchState
    ? { ...savedLastSearchState, results: cloneSearchResults(savedLastSearchState.results) }
    : null;
const savedPlaybackTime = (() => {
    const stored = safeGetLocalStorage("currentPlaybackTime");
    const time = Number.parseFloat(stored);
    return Number.isFinite(time) && time >= 0 ? time : 0;
})();
const savedCurrentSong = (() => {
    const stored = safeGetLocalStorage("currentSong");
    return parseJSON(stored, null);
})();
const savedCurrentPlaylist = (() => {
    const stored = safeGetLocalStorage("currentPlaylist");
    const playlists = ["playlist", "online", "search", "favorites"];
    return playlists.includes(stored) ? stored : "playlist";
})();
// API核心配置（支持切换）
const API = {
    currentAudioApiIndex: 0, // 当前使用的音频API索引
    currentLyricApiIndex: 0, // 当前使用的歌词API索引
    getCurrentAudioApi() {
        return AUDIO_API_LIST[this.currentAudioApiIndex];
    },
    getCurrentLyricApi() {
        return LYRIC_API_LIST[this.currentLyricApiIndex];
    },
    switchNextAudioApi() {
        this.currentAudioApiIndex = (this.currentAudioApiIndex + 1) % AUDIO_API_LIST.length;
        return this.getCurrentAudioApi();
    },
    switchNextLyricApi() {
        this.currentLyricApiIndex = (this.currentLyricApiIndex + 1) % LYRIC_API_LIST.length;
        return this.getCurrentLyricApi();
    },
    generateSignature: () => {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    },
    fetchJson: async (url) => {
        try {
            const response = await fetch(url, {
                headers: {
                    "Accept": "application/json",
                },
            });
            if (!response.ok) {
                throw new Error(`Request failed with status ${response.status}`);
            }
            const text = await response.text();
            try {
                return JSON.parse(text);
            } catch (parseError) {
                console.warn("JSON parse failed, returning raw text", parseError);
                return text;
            }
        } catch (error) {
            console.error("API request error:", error);
            throw error;
        }
    },
    // 新增搜索类型参数
    search: async (keyword, source = "netease", searchType = "all", count = 20, page = 1) => {
        const signature = API.generateSignature();
        const currentApi = API.getCurrentAudioApi();
        let url = "";
        
        // 根据搜索类型和API构造不同URL
        if (currentApi.baseUrl.includes("meting")) {
            // Meting类API格式
            const typeMap = {
                all: "search",
                song: "song",
                artist: "artist",
                album: "album",
                playlist: "playlist"
            };
            const apiType = typeMap[searchType] || "search";
            url = `${currentApi.baseUrl}?server=${source}&type=${apiType}&keyword=${encodeURIComponent(keyword)}&count=${count}&page=${page}&s=${signature}`;
        } else {
            // 原GD音乐台格式
            url = `${currentApi.baseUrl}?types=search&source=${source}&searchType=${searchType}&name=${encodeURIComponent(keyword)}&count=${count}&pages=${page}&s=${signature}`;
        }
        
        try {
            debugLog(`API请求: ${url} (API: ${currentApi.name}, 搜索类型: ${searchType})`);
            const data = await API.fetchJson(url);
            debugLog(`API响应: ${JSON.stringify(data).substring(0, 200)}...`);
            
            // 统一格式化返回结果
            let formattedResults = [];
            if (Array.isArray(data)) {
                formattedResults = data.map(song => ({
                    id: song.id || song.songid || "",
                    name: song.name || song.title || "未知歌曲",
                    artist: song.artist || song.singers || "未知艺术家",
                    album: song.album || song.albumname || "",
                    pic_id: song.pic_id || song.pic || "",
                    url_id: song.url_id || song.songid || "",
                    lyric_id: song.lyric_id || song.id || song.songid || "",
                    source: song.source || source,
                }));
            } else if (data && data.result && Array.isArray(data.result.songs)) {
                // 适配部分API的嵌套格式
                formattedResults = data.result.songs.map(song => ({
                    id: song.id,
                    name: song.name,
                    artist: Array.isArray(song.ar) ? song.ar.map(a => a.name).join(" / ") : song.artist,
                    album: song.al?.name || "",
                    pic_id: song.al?.pic_str || song.al?.pic || "",
                    url_id: song.id,
                    lyric_id: song.id,
                    source: source,
                }));
            }
            
            if (!Array.isArray(formattedResults) || formattedResults.length === 0) {
                throw new Error("搜索结果格式错误或无结果");
            }
            return formattedResults;
        } catch (error) {
            debugLog(`API错误: ${error.message}`);
            throw error;
        }
    },
    getRadarPlaylist: async (playlistId = "3778678", options = {}) => {
        const signature = API.generateSignature();
        let limit = 50;
        let offset = 0;
        if (typeof options === "number") {
            limit = options;
        } else if (options && typeof options === "object") {
            if (Number.isFinite(options.limit)) {
                limit = options.limit;
            } else if (Number.isFinite(options.count)) {
                limit = options.count;
            }
            if (Number.isFinite(options.offset)) {
                offset = options.offset;
            }
        }
        limit = Math.max(1, Math.min(200, Math.trunc(limit)) || 50);
        offset = Math.max(0, Math.trunc(offset) || 0);
        const currentApi = API.getCurrentAudioApi();
        const params = new URLSearchParams({
            types: "playlist",
            id: playlistId,
            limit: String(limit),
            offset: String(offset),
            s: signature,
        });
        const url = `${currentApi.baseUrl}?${params.toString()}`;
        try {
            const data = await API.fetchJson(url);
            const tracks = data && data.playlist && Array.isArray(data.playlist.tracks)
                ? data.playlist.tracks.slice(0, limit)
                : [];
            if (tracks.length === 0) throw new Error("No tracks found");
            return tracks.map(track => ({
                id: track.id,
                name: track.name,
                artist: Array.isArray(track.ar) ? track.ar.map(artist => artist.name).join(" / ") : "",
                source: "netease",
                lyric_id: track.id,
                pic_id: track.al?.pic_str || track.al?.pic || track.al?.picUrl || "",
            }));
        } catch (error) {
            console.error("API request failed:", error);
            throw error;
        }
    },
    // 音频播放地址（支持自动切换API）
    getSongUrl: (song, quality = "320") => {
        const signature = API.generateSignature();
        const currentApi = API.getCurrentAudioApi();
        if (currentApi.baseUrl.includes("meting")) {
            return `${currentApi.baseUrl}?server=${song.source || "netease"}&type=url&id=${song.id}&br=${quality}&auth=${signature}`;
        }
        return `${currentApi.baseUrl}?types=url&id=${song.id}&source=${song.source || "netease"}&br=${quality}&s=${signature}`;
    },
    // 歌词获取（支持自动切换API）
    getLyric: async (song) => {
        const signature = API.generateSignature();
        let currentApi = API.getCurrentLyricApi();
        let lyricData = null;
        
        // 循环尝试所有歌词API
        for (let i = 0; i < LYRIC_API_LIST.length; i++) {
            try {
                let url = "";
                if (currentApi.baseUrl.includes("meting")) {
                    url = `${currentApi.baseUrl}?server=${song.source || "netease"}&type=lrc&id=${song.lyric_id || song.id}&auth=${signature}`;
                } else if (currentApi.baseUrl.includes("lyrics.lol")) {
                    url = `${currentApi.baseUrl}/search?artist=${encodeURIComponent(song.artist)}&title=${encodeURIComponent(song.name)}`;
                } else {
                    url = `${currentApi.baseUrl}?types=lyric&id=${song.lyric_id || song.id}&source=${song.source || "netease"}&s=${signature}`;
                }
                
                debugLog(`获取歌词: ${url} (API: ${currentApi.name})`);
                const data = await API.fetchJson(url);
                
                // 适配不同API的歌词格式
                if (data && data.lyric) {
                    lyricData = { lyric: data.lyric };
                    break;
                } else if (data && data.data && data.data.lyrics) {
                    lyricData = { lyric: data.data.lyrics };
                    break;
                } else if (data && Array.isArray(data) && data[0] && data[0].lyrics) {
                    lyricData = { lyric: data[0].lyrics };
                    break;
                }
                
                // 当前API失败，切换到下一个
                debugLog(`歌词API ${currentApi.name} 失败，切换到下一个`);
                currentApi = API.switchNextLyricApi();
            } catch (error) {
                debugLog(`歌词API ${currentApi.name} 异常: ${error.message}`);
                currentApi = API.switchNextLyricApi();
            }
        }
        
        if (!lyricData) {
            throw new Error("所有歌词API均失败");
        }
        return lyricData;
    },
    getPicUrl: (song) => {
        const signature = API.generateSignature();
        const currentApi = API.getCurrentAudioApi();
        if (currentApi.baseUrl.includes("meting")) {
            return `${currentApi.baseUrl}?server=${song.source || "netease"}&type=pic&id=${song.pic_id}&size=300&auth=${signature}`;
        }
        return `${currentApi.baseUrl}?types=pic&id=${song.pic_id}&source=${song.source || "netease"}&size=300&s=${signature}`;
    }
};
Object.freeze(API);
const state = {
    onlineSongs: [],
    searchResults: cloneSearchResults(savedLastSearchState?.results) || [],
    renderedSearchCount: 0,
    currentTrackIndex: savedCurrentTrackIndex,
    currentAudioUrl: null,
    lyricsData: [],
    currentLyricLine: -1,
    currentPlaylist: savedCurrentPlaylist, // 'online', 'search', or 'playlist'
    searchPage: savedLastSearchState?.page || 1,
    searchKeyword: savedLastSearchState?.keyword || "",
    searchSource: savedLastSearchState ? savedLastSearchState.source : savedSearchSource,
    searchType: savedLastSearchState ? savedLastSearchState.searchType : savedSearchType, // 新增搜索类型状态
    hasMoreResults: typeof savedLastSearchState?.hasMore === "boolean" ? savedLastSearchState.hasMore : true,
    currentSong: savedCurrentSong,
    currentArtworkUrl: null,
    debugMode: false,
    isSearchMode: false,
    playlistSongs: savedPlaylistSongs,
    playMode: savedPlayMode,
    playlistLastNonRandomMode: savedPlayMode === "random" ? "list" : savedPlayMode,
    favoriteSongs: savedFavoriteSongs,
    currentFavoriteIndex: savedCurrentFavoriteIndex,
    currentList: savedCurrentList,
    favoritePlayMode: savedFavoritePlayMode,
    favoriteLastNonRandomMode: savedFavoritePlayMode === "random" ? "list" : savedFavoritePlayMode,
    favoritePlaybackTime: savedFavoritePlaybackTime,
    playbackQuality: savedPlaybackQuality,
    volume: savedVolume,
    currentPlaybackTime: savedPlaybackTime,
    lastSavedPlaybackTime: savedPlaybackTime,
    favoriteLastSavedPlaybackTime: savedFavoritePlaybackTime,
    pendingSeekTime: null,
    isSeeking: false,
    qualityMenuOpen: false,
    sourceMenuOpen: false,
    searchTypeMenuOpen: false, // 新增搜索类型菜单状态
    userScrolledLyrics: false,
    lyricsScrollTimeout: null,
    themeDefaultsCaptured: false,
    dynamicPalette: null,
    currentPaletteImage: null,
    pendingPaletteData: null,
    pendingPaletteImage: null,
    pendingPaletteImmediate: false,
    pendingPaletteReady: false,
    audioReadyForPalette: true,
    currentGradient: '',
    isMobileInlineLyricsOpen: false,
    selectedSearchResults: new Set(),
};
let importSelectedMenuOutsideHandler = null;
if (state.currentList === "favorite" && (!Array.isArray(state.favoriteSongs) || state.favoriteSongs.length === 0)) {
    state.currentList = "playlist";
}
if (state.currentList === "favorite") {
    state.currentPlaylist = "favorites";
}
state.favoriteSongs = ensureFavoriteSongsArray()
    .map((song) => sanitizeImportedSong(song) || song)
    .filter((song) => song && typeof song === "object");
if (!Array.isArray(state.favoriteSongs) || state.favoriteSongs.length === 0) {
    state.currentFavoriteIndex = 0;
} else if (state.currentFavoriteIndex >= state.favoriteSongs.length) {
    state.currentFavoriteIndex = state.favoriteSongs.length - 1;
}
saveFavoriteState();
async function bootstrapPersistentStorage() {
    try {
        const remoteKeys = Array.from(STORAGE_KEYS_TO_SYNC);
        const snapshot = await persistentStorage.getItems(remoteKeys);
        if (!snapshot || !snapshot.d1Available || !snapshot.data) {
            return;
        }
        applyPersistentSnapshotFromRemote(snapshot.data);
    } catch (error) {
        console.warn("加载远程存储失败", error);
    } finally {
        remoteSyncEnabled = true;
    }
}
function applyPersistentSnapshotFromRemote(data) {
    if (!data || typeof data !== "object") {
        return;
    }
    let playlistUpdated = false;
    if (typeof data.playlistSongs === "string") {
        const playlist = parseJSON(data.playlistSongs, []);
        if (Array.isArray(playlist)) {
            state.playlistSongs = playlist;
            safeSetLocalStorage("playlistSongs", data.playlistSongs, { skipRemote: true });
            playlistUpdated = true;
        }
    }
    if (typeof data.currentTrackIndex === "string") {
        const index = Number.parseInt(data.currentTrackIndex, 10);
        if (Number.isInteger(index)) {
            state.currentTrackIndex = index;
            safeSetLocalStorage("currentTrackIndex", data.currentTrackIndex, { skipRemote: true });
        }
    }
    if (typeof data.playMode === "string") {
        state.playMode = ["list", "single", "random"].includes(data.playMode) ? data.playMode : state.playMode;
        safeSetLocalStorage("playMode", state.playMode, { skipRemote: true });
    }
    if (typeof data.playbackQuality === "string") {
        state.playbackQuality = normalizeQuality(data.playbackQuality);
        safeSetLocalStorage("playbackQuality", state.playbackQuality, { skipRemote: true });
    }
    if (typeof data.playerVolume === "string") {
        const volume = Number.parseFloat(data.playerVolume);
        if (Number.isFinite(volume)) {
            const clamped = Math.min(Math.max(volume, 0), 1);
            state.volume = clamped;
            safeSetLocalStorage("playerVolume", String(clamped), { skipRemote: true });
        }
    }
    if (typeof data.currentPlaylist === "string") {
        state.currentPlaylist = data.currentPlaylist;
        safeSetLocalStorage("currentPlaylist", data.currentPlaylist, { skipRemote: true });
    }
    if (typeof data.currentList === "string") {
        state.currentList = data.currentList === "favorite"

        state.currentList = data.currentList === "favorite" ? "favorite" : "playlist";
        safeSetLocalStorage("currentList", state.currentList, { skipRemote: true });
    }
    if (typeof data.currentSong === "string") {
        const song = parseJSON(data.currentSong, null);
        if (song && typeof song === "object") {
            state.currentSong = song;
            safeSetLocalStorage("currentSong", data.currentSong, { skipRemote: true });
        }
    }
    if (typeof data.currentPlaybackTime === "string") {
        const time = Number.parseFloat(data.currentPlaybackTime);
        if (Number.isFinite(time) && time >= 0) {
            state.currentPlaybackTime = time;
            safeSetLocalStorage("currentPlaybackTime", String(time), { skipRemote: true });
        }
    }
    if (typeof data.favoriteSongs === "string") {
        const favorites = parseJSON(data.favoriteSongs, []);
        if (Array.isArray(favorites)) {
            state.favoriteSongs = favorites;
            safeSetLocalStorage("favoriteSongs", data.favoriteSongs, { skipRemote: true });
        }
    }
    if (typeof data.currentFavoriteIndex === "string") {
        const index = Number.parseInt(data.currentFavoriteIndex, 10);
        if (Number.isInteger(index) && index >= 0) {
            state.currentFavoriteIndex = index;
            safeSetLocalStorage("currentFavoriteIndex", String(index), { skipRemote: true });
        }
    }
    if (typeof data.favoritePlayMode === "string") {
        state.favoritePlayMode = ["list", "single", "random"].includes(data.favoritePlayMode) ? data.favoritePlayMode : state.favoritePlayMode;
        safeSetLocalStorage("favoritePlayMode", state.favoritePlayMode, { skipRemote: true });
    }
    if (typeof data.favoritePlaybackTime === "string") {
        const time = Number.parseFloat(data.favoritePlaybackTime);
        if (Number.isFinite(time) && time >= 0) {
            state.favoritePlaybackTime = time;
            safeSetLocalStorage("favoritePlaybackTime", String(time), { skipRemote: true });
        }
    }
    if (typeof data.searchSource === "string") {
        state.searchSource = normalizeSource(data.searchSource);
        safeSetLocalStorage("searchSource", state.searchSource, { skipRemote: true });
    }
    if (typeof data.searchType === "string") {
        state.searchType = normalizeSearchType(data.searchType);
        safeSetLocalStorage("searchType", state.searchType, { skipRemote: true });
    }
    if (playlistUpdated) {
        renderPlaylist();
    }
}

    
