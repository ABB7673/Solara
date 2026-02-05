(function () {
    if (!window.__SOLARA_IS_MOBILE) {
        return;
    }

    // 主题和字体大小管理
    const ThemeManager = {
        // 可用主题列表
        themes: [
            { id: 'white', name: '经典白', class: 'theme-white' },
            { id: 'black', name: '深邃黑', class: 'theme-black' },
            { id: 'light-blue', name: '淡蓝色', class: 'theme-light-blue' },
            { id: 'light-green', name: '淡绿色', class: 'theme-light-green' },
            { id: 'huawei-1', name: '华为红', class: 'theme-huawei-1' },
            { id: 'huawei-2', name: '华为蓝', class: 'theme-huawei-2' },
            { id: 'ios-1', name: 'iOS浅色', class: 'theme-ios-1' },
            { id: 'ios-2', name: 'iOS深色', class: 'theme-ios-2' }
        ],
        
        // 字体大小选项
        fontSizes: [
            { id: 'small', name: '小', class: 'font-small' },
            { id: 'normal', name: '中', class: 'font-normal' },
            { id: 'large', name: '大', class: 'font-large' },
            { id: 'xlarge', name: '特大', class: 'font-xlarge' }
        ],

        // 从localStorage加载设置
        loadSettings() {
            const savedTheme = localStorage.getItem('solara-mobile-theme') || 'white';
            const savedFontSize = localStorage.getItem('solara-mobile-fontsize') || 'normal';
            return { theme: savedTheme, fontSize: savedFontSize };
        },

        // 保存设置到localStorage
        saveSettings(theme, fontSize) {
            localStorage.setItem('solara-mobile-theme', theme);
            localStorage.setItem('solara-mobile-fontsize', fontSize);
        },

        // 应用主题
        applyTheme(themeId) {
            const body = document.body;
            if (!body) return;
            
            // 移除所有主题类
            this.themes.forEach(t => body.classList.remove(t.class));
            
            // 添加新主题类
            const theme = this.themes.find(t => t.id === themeId);
            if (theme) {
                body.classList.add(theme.class);
            }
            
            // 更新设置面板中的选中状态
            this.updateThemeUI(themeId);
        },

        // 应用字体大小
        applyFontSize(sizeId) {
            const body = document.body;
            if (!body) return;
            
            // 移除所有字体大小类
            this.fontSizes.forEach(f => body.classList.remove(f.class));
            
            // 添加新字体大小类
            const fontSize = this.fontSizes.find(f => f.id === sizeId);
            if (fontSize) {
                body.classList.add(fontSize.class);
            }
            
            // 更新设置面板中的选中状态
            this.updateFontSizeUI(sizeId);
        },

        // 更新主题UI
        updateThemeUI(activeThemeId) {
            document.querySelectorAll('.mobile-theme-item').forEach(item => {
                if (item.dataset.theme === activeThemeId) {
                    item.classList.add('active');
                } else {
                    item.classList.remove('active');
                }
            });
        },

        // 更新字体大小UI
        updateFontSizeUI(activeSizeId) {
            document.querySelectorAll('.mobile-font-size-btn').forEach(btn => {
                if (btn.dataset.size === activeSizeId) {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });
        },

        // 初始化设置
        init() {
            const settings = this.loadSettings();
            this.applyTheme(settings.theme);
            this.applyFontSize(settings.fontSize);
        },

        // 创建设置面板HTML
        createSettingsPanel() {
            const panel = document.createElement('div');
            panel.className = 'mobile-settings-panel';
            panel.id = 'mobileSettingsPanel';
            panel.setAttribute('aria-hidden', 'true');
            
            panel.innerHTML = `
                <div class="mobile-settings-header">
                    <h2 class="mobile-settings-title">设置</h2>
                    <button class="mobile-settings-close" id="mobileSettingsClose" aria-label="关闭设置">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="mobile-settings-content">
                    <div class="mobile-settings-section">
                        <div class="mobile-settings-section-title">主题颜色</div>
                        <div class="mobile-theme-grid">
                            ${this.themes.map(theme => `
                                <div class="mobile-theme-item ${theme.class} ${theme.id === 'white' ? 'active' : ''}" 
                                     data-theme="${theme.id}" 
                                     title="${theme.name}"
                                     role="button"
                                     tabindex="0"
                                     aria-label="选择主题：${theme.name}">
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    
                    <div class="mobile-settings-section">
                        <div class="mobile-settings-section-title">字体大小</div>
                        <div class="mobile-font-size-options">
                            ${this.fontSizes.map(size => `
                                <button class="mobile-font-size-btn ${size.id === 'normal' ? 'active' : ''}" 
                                        data-size="${size.id}"
                                        aria-label="字体大小：${size.name}">
                                    ${size.name}
                                </button>
                            `).join('')}
                        </div>
                    </div>
                </div>
            `;
            
            return panel;
        },

        // 绑定设置面板事件
        bindSettingsEvents() {
            // 主题选择
            document.querySelectorAll('.mobile-theme-item').forEach(item => {
                item.addEventListener('click', () => {
                    const themeId = item.dataset.theme;
                    this.applyTheme(themeId);
                    this.saveSettings(themeId, this.loadSettings().fontSize);
                });
                
                // 键盘支持
                item.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        const themeId = item.dataset.theme;
                        this.applyTheme(themeId);
                        this.saveSettings(themeId, this.loadSettings().fontSize);
                    }
                });
            });

            // 字体大小选择
            document.querySelectorAll('.mobile-font-size-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const sizeId = btn.dataset.size;
                    this.applyFontSize(sizeId);
                    this.saveSettings(this.loadSettings().theme, sizeId);
                });
            });

            // 关闭按钮
            const closeBtn = document.getElementById('mobileSettingsClose');
            if (closeBtn) {
                closeBtn.addEventListener('click', () => {
                    this.closeSettingsPanel();
                });
            }

            // 点击遮罩关闭
            this.panel.addEventListener('click', (e) => {
                if (e.target === this.panel) {
                    this.closeSettingsPanel();
                }
            });
        },

        // 打开设置面板
        openSettingsPanel() {
            if (!this.panel) {
                this.panel = this.createSettingsPanel();
                document.body.appendChild(this.panel);
                this.bindSettingsEvents();
                
                // 同步当前状态到UI
                const settings = this.loadSettings();
                this.updateThemeUI(settings.theme);
                this.updateFontSizeUI(settings.fontSize);
            }
            
            document.body.classList.add('mobile-settings-open');
            this.panel.setAttribute('aria-hidden', 'false');
            
            // 关闭其他面板
            if (window.SolaraMobileBridge) {
                window.SolaraMobileBridge.handlers.closeSearch && window.SolaraMobileBridge.handlers.closeSearch();
                window.SolaraMobileBridge.handlers.closePanel && window.SolaraMobileBridge.handlers.closePanel();
            }
        },

        // 关闭设置面板
        closeSettingsPanel() {
            document.body.classList.remove('mobile-settings-open');
            if (this.panel) {
                this.panel.setAttribute('aria-hidden', 'true');
            }
        },

        // 切换设置面板
        toggleSettingsPanel() {
            if (document.body.classList.contains('mobile-settings-open')) {
                this.closeSettingsPanel();
            } else {
                this.openSettingsPanel();
            }
        }
    };

    // 将ThemeManager挂载到全局
    window.SolaraThemeManager = ThemeManager;

    // 在DOM加载完成后初始化
    const initTheme = () => {
        ThemeManager.init();
        
        // 添加设置按钮到工具栏
        const toolbar = document.getElementById('mobileToolbar');
        if (toolbar) {
            const settingsBtn = document.createElement('button');
            settingsBtn.className = 'mobile-toolbar__button';
            settingsBtn.id = 'mobileSettingsToggle';
            settingsBtn.type = 'button';
            settingsBtn.setAttribute('aria-label', '打开设置');
            settingsBtn.innerHTML = '<i class="fas fa-cog" aria-hidden="true"></i>';
            settingsBtn.style.order = '-1'; // 放在最左边
            
            settingsBtn.addEventListener('click', () => {
                ThemeManager.toggleSettingsPanel();
            });
            
            // 插入到工具栏最前面
            toolbar.insertBefore(settingsBtn, toolbar.firstChild);
        }
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initTheme);
    } else {
        initTheme();
    }

    const bridge = window.SolaraMobileBridge || {};
    bridge.handlers = bridge.handlers || {};
    bridge.queue = Array.isArray(bridge.queue) ? bridge.queue : [];
    window.SolaraMobileBridge = bridge;

    // ... 保留原有的所有代码 ...
    
    // 在closeAllMobileOverlaysImpl中添加关闭设置面板
    const originalCloseAll = bridge.handlers.closeAllOverlays;
    bridge.handlers.closeAllOverlays = function() {
        ThemeManager.closeSettingsPanel();
        if (originalCloseAll) originalCloseAll();
    };
})();

(function () {
    if (!window.__SOLARA_IS_MOBILE) {
        return;
    }

    const bridge = window.SolaraMobileBridge || {};
    bridge.handlers = bridge.handlers || {};
    bridge.queue = Array.isArray(bridge.queue) ? bridge.queue : [];
    window.SolaraMobileBridge = bridge;

    const dom = window.SolaraDom || {};
    let initialized = false;

    function updateMobileToolbarTitleImpl() {
        if (!dom.mobileToolbarTitle) {
            return;
        }
        dom.mobileToolbarTitle.textContent = "solar";
    }

    function updateMobileOverlayScrim() {
        if (!dom.mobileOverlayScrim || !document.body) {
            return;
        }
        const hasOverlay = document.body.classList.contains("mobile-search-open") ||
            document.body.classList.contains("mobile-panel-open");
        dom.mobileOverlayScrim.setAttribute("aria-hidden", hasOverlay ? "false" : "true");
    }

    function openMobileSearchImpl() {
        if (!document.body) {
            return;
        }
        document.body.classList.add("mobile-search-open");
        document.body.classList.remove("mobile-panel-open");
        if (dom.searchArea) {
            dom.searchArea.setAttribute("aria-hidden", "false");
        }
        updateMobileOverlayScrim();
        if (dom.searchInput) {
            window.requestAnimationFrame(() => {
                try {
                    dom.searchInput.focus({ preventScroll: true });
                } catch (error) {
                    dom.searchInput.focus();
                }
            });
        }
    }

    function closeMobileSearchImpl() {
        if (!document.body) {
            return;
        }
        document.body.classList.remove("mobile-search-open");
        const toggleSearchMode = window.toggleSearchMode;
        if (typeof toggleSearchMode === "function") {
            toggleSearchMode(false);
        } else if (typeof window.hideSearchResults === "function") {
            window.hideSearchResults();
        }
        if (dom.searchArea) {
            dom.searchArea.setAttribute("aria-hidden", "true");
        }
        if (dom.searchInput) {
            dom.searchInput.blur();
        }
        updateMobileOverlayScrim();
    }

    function toggleMobileSearchImpl() {
        if (!document.body) {
            return;
        }
        if (document.body.classList.contains("mobile-search-open")) {
            closeMobileSearchImpl();
        } else {
            openMobileSearchImpl();
        }
    }

    function normalizePanelView(view) {
        return view === "lyrics" ? "playlist" : (view || "playlist");
    }

    function openMobilePanelImpl(view = "playlist") {
        if (!document.body) {
            return;
        }
        const targetView = normalizePanelView(view);
        if (typeof window.switchMobileView === "function") {
            window.switchMobileView(targetView);
        }
        closeMobileSearchImpl();
        document.body.classList.add("mobile-panel-open");
        document.body.setAttribute("data-mobile-panel-view", targetView);
        updateMobileOverlayScrim();
    }

    function closeMobilePanelImpl() {
        if (!document.body) {
            return;
        }
        document.body.classList.remove("mobile-panel-open");
        updateMobileOverlayScrim();
    }

    function toggleMobilePanelImpl(view = "playlist") {
        if (!document.body) {
            return;
        }
        const isOpen = document.body.classList.contains("mobile-panel-open");
        const currentView = document.body.getAttribute("data-mobile-panel-view") || "playlist";
        const targetView = normalizePanelView(view);
        if (isOpen && (!targetView || currentView === targetView)) {
            closeMobilePanelImpl();
        } else {
            openMobilePanelImpl(targetView || currentView || "playlist");
        }
    }

    function closeAllMobileOverlaysImpl() {
        closeMobileSearchImpl();
        closeMobilePanelImpl();
    }

    function initializeMobileUIImpl() {
        if (initialized || !document.body) {
            return;
        }
        initialized = true;

        document.body.classList.add("mobile-view");
        const initialView = "playlist";
        document.body.setAttribute("data-mobile-panel-view", initialView);
        if (dom.mobilePanelTitle) {
            dom.mobilePanelTitle.textContent = "播放列表";
        }
        if (dom.lyrics) {
            dom.lyrics.classList.remove("active");
        }
        if (dom.playlist) {
            dom.playlist.classList.add("active");
        }

        updateMobileToolbarTitleImpl();

        if (dom.mobileSearchToggle) {
            dom.mobileSearchToggle.addEventListener("click", toggleMobileSearchImpl);
        }
        if (dom.mobileSearchClose) {
            dom.mobileSearchClose.addEventListener("click", closeMobileSearchImpl);
        }
        if (dom.mobilePanelClose) {
            dom.mobilePanelClose.addEventListener("click", closeMobilePanelImpl);
        }
        if (dom.mobileQueueToggle) {
            dom.mobileQueueToggle.addEventListener("click", () => openMobilePanelImpl("playlist"));
        }
        const handleGlobalPointerDown = (event) => {
            if (!document.body) {
                return;
            }
            const hasOverlay = document.body.classList.contains("mobile-search-open") ||
                document.body.classList.contains("mobile-panel-open");
            if (!hasOverlay) {
                return;
            }

            const target = event.target;
            if (dom.mobilePanel && (dom.mobilePanel === target || dom.mobilePanel.contains(target))) {
                return;
            }
            if (dom.searchArea && (dom.searchArea === target || dom.searchArea.contains(target))) {
                return;
            }
            if (dom.playerQualityMenu && dom.playerQualityMenu.contains(target)) {
                return;
            }
            if (target && typeof target.closest === "function" && target.closest(".quality-menu")) {
                return;
            }

            closeAllMobileOverlaysImpl();
        };

        document.addEventListener("pointerdown", handleGlobalPointerDown, true);
        if (dom.searchArea) {
            dom.searchArea.setAttribute("aria-hidden", "true");
        }
        if (dom.mobileOverlayScrim) {
            dom.mobileOverlayScrim.setAttribute("aria-hidden", "true");
        }

        updateMobileOverlayScrim();
    }

    bridge.handlers.updateToolbarTitle = updateMobileToolbarTitleImpl;
    bridge.handlers.openSearch = openMobileSearchImpl;
    bridge.handlers.closeSearch = closeMobileSearchImpl;
    bridge.handlers.toggleSearch = toggleMobileSearchImpl;
    bridge.handlers.openPanel = openMobilePanelImpl;
    bridge.handlers.closePanel = closeMobilePanelImpl;
    bridge.handlers.togglePanel = toggleMobilePanelImpl;
    bridge.handlers.closeAllOverlays = closeAllMobileOverlaysImpl;
    bridge.handlers.initialize = initializeMobileUIImpl;

    if (bridge.queue.length) {
        const pending = bridge.queue.splice(0, bridge.queue.length);
        for (const entry of pending) {
            const handler = bridge.handlers[entry.name];
            if (typeof handler === "function") {
                handler(...(entry.args || []));
            }
        }
    }
})();
