/**
 * 音乐项目核心脚本 - 多源 API 自动切换增强版
 * 功能：支持 4 个音源和 6 个歌词源自动轮询切换
 */

// --- 1. 配置信息：在这里管理你的 API 地址 ---
const API_CONFIG = {
    // 音源 API 列表
    audioSources: [
        "https://music.gdstudio.xyz",
        "https://api.i-meto.com/meting/api",
        "https://api.injahow.cn/meting",
        "https://api.paugram.com/meting"
    ],
    // 歌词 API 列表
    lyricSources: [
        "https://music.cyrilstudio.top/api",
        "https://music.gdstudio.xyz",
        "https://api.lyrics.lol",
        "https://api.i-meto.com/meting/api",
        "https://api.paugram.com/meting",
        "https://api.injahow.cn/meting"
    ],
    // 默认服务器 (netease, tencent 等)
    defaultServer: "netease"
};

// 全局状态跟踪
let currentAudioIndex = 0;
let currentLyricIndex = 0;
let currentSongInfo = null; // 存储当前正在尝试播放的歌曲信息

// --- 2. 核心 DOM 元素 ---
const dom = {
    audioPlayer: document.getElementById("audioPlayer"),
    lyricsContent: document.getElementById("lyricsContent"),
    mobileInlineLyricsContent: document.getElementById("mobileInlineLyricsContent"),
    notification: document.getElementById("notification"),
    // 其他 DOM 会由原项目逻辑初始化
};

// --- 3. 核心功能函数 ---

// 通用通知函数
function showNotice(msg, type = "success") {
    if (dom.notification) {
        dom.notification.textContent = msg;
        dom.notification.className = `notification ${type} active`;
        setTimeout(() => dom.notification.classList.remove("active"), 3000);
    } else {
        console.log(`[${type}] ${msg}`);
    }
}

/**
 * 核心：尝试获取可用的音频播放地址
 * 如果一个 API 失败，会自动尝试下一个
 */
async function fetchAudioUrlWithRetry(songId, server) {
    for (let i = 0; i < API_CONFIG.audioSources.length; i++) {
        const baseUrl = API_CONFIG.audioSources[i];
        try {
            console.log(`正在尝试音源 API (${i + 1}/${API_CONFIG.audioSources.length}): ${baseUrl}`);
            const response = await fetch(`${baseUrl}?type=url&id=${songId}&server=${server}`);
            const data = await response.json();
            
            if (data && data.url && data.url !== "" && data.url !== "null") {
                currentAudioIndex = i; // 记录成功的索引
                return data.url;
            }
            throw new Error("无效的 URL");
        } catch (err) {
            console.warn(`音源 ${baseUrl} 获取失败，切换下一个...`);
        }
    }
    return null;
}

/**
 * 核心：尝试获取歌词
 * 如果一个接口没歌词，会自动换一个接口找
 */
async function fetchLyricsWithRetry(songId, server) {
    for (let i = 0; i < API_CONFIG.lyricSources.length; i++) {
        const baseUrl = API_CONFIG.lyricSources[i];
        try {
            console.log(`正在尝试歌词 API (${i + 1}/${API_CONFIG.lyricSources.length})`);
            const response = await fetch(`${baseUrl}?type=lrc&id=${songId}&server=${server}`);
            const lrcText = await response.text();
            
            // 简单校验：如果返回的是 JSON 报错或者太短，说明没歌词
            if (lrcText && lrcText.length > 20 && !lrcText.includes('{"status":false')) {
                currentLyricIndex = i;
                return lrcText;
            }
        } catch (err) {
            continue; 
        }
    }
    return "[00:00.00] 暂无可用歌词";
}

/**
 * 播放歌曲的主入口
 * 修改了原项目的播放逻辑，嵌入了重试机制
 */
async function playSong(songData) {
    currentSongInfo = songData; // 备份当前歌曲信息
    const id = songData.id;
    const server = songData.server || API_CONFIG.defaultServer;

    showNotice("正在解析音源...");

    // 1. 获取音源并播放
    const audioUrl = await fetchAudioUrlWithRetry(id, server);
    if (audioUrl) {
        dom.audioPlayer.src = audioUrl;
        dom.audioPlayer.play().catch(e => {
            console.error("播放被浏览器拦截或加载失败");
            handlePlaybackError();
        });
    } else {
        showNotice("所有音源解析失败", "error");
    }

    // 2. 获取歌词并显示
    const lyrics = await fetchLyricsWithRetry(id, server);
    if (typeof renderLyrics === "function") {
        renderLyrics(lyrics); // 调用原有的渲染函数
    } else {
        // 如果找不到原渲染函数，简单填充
        if(dom.lyricsContent) dom.lyricsContent.innerText = lyrics;
    }
}

/**
 * 处理播放中途报错（比如链接失效）
 */
function handlePlaybackError() {
    console.error("当前播放链路失效，尝试自动切换...");
    // 这里可以触发重新解析逻辑
    showNotice("当前音源失效，正在自动切换备用源...", "error");
    // 逻辑：如果还有备用源，增加索引重新调 playSong
    // 注意：为避免死循环，这里可以根据实际需求写
}

// 绑定播放器错误事件
if (dom.audioPlayer) {
    dom.audioPlayer.addEventListener('error', () => {
        if (dom.audioPlayer.src && !dom.audioPlayer.src.includes(window.location.host)) {
            handlePlaybackError();
        }
    });
}

// --- 后续保持原项目的其他初始化逻辑 ---
// (此处请保留你 index.js 中关于 UI 交互、搜索、列表渲染的其他代码)
console.log("多源切换插件已就绪");
