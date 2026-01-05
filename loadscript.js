// DOM Elements
    const mainContent = document.getElementById('mainContent');
    const mainIframe = document.getElementById('main-iframe');
    const bottomMenu = document.getElementById('bottomMenu');
    const toggleMenu = document.getElementById('toggleMenu');
    const toggleIcon = document.getElementById('toggleIcon');
    const menuContent = document.getElementById('menuContent');
    const notificationContainer = document.getElementById('notificationContainer');
    
    // Menu buttons
    const btnClose = document.getElementById('btnClose');
    const btnAutoClicker = document.getElementById('btnAutoClicker'); // Changed from btnSound
    const autoClickerIcon = document.getElementById('autoClickerIcon'); // Changed from soundIcon
    const btnRefresh = document.getElementById('btnRefresh');
    const btnDownload = document.getElementById('btnDownload');
    const btnFullscreen = document.getElementById('btnFullscreen');
    const btnCloak = document.getElementById('btnCloak');
    
    // Cloak modal elements
    const cloakModal = document.getElementById('cloakModal');
    const closeModal = document.getElementById('closeModal');
    const defaultCloak = document.getElementById('defaultCloak');
    const customCloakOptions = document.getElementById('customCloakOptions');
    const iconGrid = document.getElementById('iconGrid');
    const uploadArea = document.getElementById('uploadArea');
    const fileUpload = document.getElementById('fileUpload');
    const tabName = document.getElementById('tabName');
    const applyCloak = document.getElementById('applyCloak');
    const cancelCloak = document.getElementById('cancelCloak');
    
    // Auto Clicker modal elements
    const autoClickerModal = document.getElementById('autoClickerModal');
    const closeAutoClickerModal = document.getElementById('closeAutoClickerModal');
    const autoClickerStatus = document.getElementById('autoClickerStatus');
    
    // Auto Clicker settings elements
    const cpsInput = document.getElementById('cpsInput');
    const cpsRandomSlider = document.getElementById('cpsRandomSlider');
    const cpsRandomValue = document.getElementById('cpsRandomValue');
    const clickTypeSelect = document.getElementById('clickTypeSelect');
    const clickButtonSelect = document.getElementById('clickButtonSelect');
    const dragClickToggle = document.getElementById('dragClickToggle');
    const dragClickSettings = document.getElementById('dragClickSettings');
    const dragDurationSlider = document.getElementById('dragDurationSlider');
    const dragDurationValue = document.getElementById('dragDurationValue');
    const restDurationSlider = document.getElementById('restDurationSlider');
    const restDurationValue = document.getElementById('restDurationValue');
    const durationRandomSlider = document.getElementById('durationRandomSlider');
    const durationRandomValue = document.getElementById('durationRandomValue');
    const keyboardTypeSelect = document.getElementById('keyboardTypeSelect');
    const triggerKeySettings = document.getElementById('triggerKeySettings');
    const startStopKeySettings = document.getElementById('startStopKeySettings');
    const triggerKeyBtn = document.getElementById('triggerKeyBtn');
    const startKeyBtn = document.getElementById('startKeyBtn');
    const stopKeyBtn = document.getElementById('stopKeyBtn');
    const startAutoClicker = document.getElementById('startAutoClicker');
    const stopAutoClicker = document.getElementById('stopAutoClicker');
    const saveAutoClickerSettings = document.getElementById('saveAutoClickerSettings');
    
    // State variables
    let isMenuExpanded = false;
    let isFullscreen = false;
    let selectedIcon = 'default.png';
    
    // Auto Clicker state variables
    let isAutoClickerActive = false;
    let autoClickerInterval = null;
    let isDragClickActive = false;
    let dragClickTimeout = null;
    let isRecordingKey = false;
    let currentRecordingButton = null;
    
    // Auto Clicker settings
    let autoClickerSettings = {
        cps: 10,
        cpsRandomOffset: 0,
        clickType: 'single',
        clickButton: 'left',
        dragClick: false,
        dragDuration: 2.0,
        restDuration: 1.0,
        durationRandomOffset: 0,
        keyboardType: 'trigger',
        triggerKey: null,
        startKey: null,
        stopKey: null
    };
    
    const iconOptions = [
        { name: 'Default', url: 'https://learn.jimmyqrg.com/cloak-images/default.png' },
        { name: 'Gmail', url: 'https://learn.jimmyqrg.com/cloak-images/gmail.png' },
        { name: 'Drive', url: 'https://learn.jimmyqrg.com/cloak-images/drive.png' },
        { name: 'Docs', url: 'https://learn.jimmyqrg.com/cloak-images/docs.png' },
        { name: 'Forms', url: 'https://learn.jimmyqrg.com/cloak-images/forms.png' },
        { name: 'Pausd', url: 'https://learn.jimmyqrg.com/cloak-images/pausd.png' },
        { name: 'Schoology', url: 'https://learn.jimmyqrg.com/cloak-images/schoology.png' },
        { name: 'JimmyQRG', url: 'https://www.jimmyqrg.com/icon.png' }
    ];
    
    // Initialize the page
    function init() {
        // Apply cloak settings immediately
        applyCloakImmediately();
        
        // Check for ?content= parameter
        checkContentParam();
        
        // Setup event listeners
        setupEventListeners();
        
        // Populate icon grid
        populateIconGrid();
        
        // Load saved cloak settings
        loadCloakSettings();
        
        // Load saved auto clicker settings
        loadAutoClickerSettings();
    }
    
    // Apply cloak immediately (before any other scripts run)
    function applyCloakImmediately() {
        const savedTitle = localStorage.getItem('cloakTabName');
        const savedIcon = localStorage.getItem('cloakIcon');
        const savedDefaultCloak = localStorage.getItem('defaultCloak');
        
        // Only apply custom cloak if default cloak is not enabled
        if (savedDefaultCloak !== 'true') {
            if (savedTitle) {
                document.title = savedTitle;
            }
            
            if (savedIcon) {
                const favicon = document.getElementById('cloakFavicon');
                if (favicon) {
                    favicon.href = savedIcon;
                }
                // Also update all existing favicon links
                const existingFavicons = document.querySelectorAll('link[rel="icon"], link[rel="shortcut icon"]');
                existingFavicons.forEach(link => {
                    link.href = savedIcon;
                });
            }
        }
    }
    
    // Check for ?content= parameter and load URL
    function checkContentParam() {
        const params = new URLSearchParams(window.location.search);
        const raw = params.get('content');
        
        let urlToLoad = 'https://learn.jimmyqrg.com/?page=extend'; // Default URL
        
        if (raw) {
            // Decode and validate URL from ?content= parameter
            let decoded;
            try { 
                decoded = decodeURIComponent(raw); 
            } catch { 
                console.log('Error: could not decode the content parameter.');
                // Use default URL
            }
            
            if (decoded) {
                try { 
                    const url = new URL(decoded);
                    if (["http:", "https:"].includes(url.protocol)) {
                        urlToLoad = url.href;
                    }
                } catch { 
                    console.log('Error: invalid URL in content parameter.');
                }
            }
        }
        
        // Load the URL in the iframe
        mainIframe.src = urlToLoad;
    }
    
    function setupEventListeners() {
        // Toggle menu
        toggleMenu.addEventListener('click', toggleMenuState);
        
        // Click iframe to collapse menu
        mainIframe.addEventListener('click', () => {
            if (isMenuExpanded) {
                collapseMenu();
            }
        });
        
        // ESC key to collapse menu or close modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                if (isMenuExpanded) {
                    collapseMenu();
                }
                
                if (cloakModal.classList.contains('active')) {
                    closeCloakModal();
                }
                
                if (autoClickerModal.classList.contains('active')) {
                    closeAutoClickerModalFunc();
                }
                
                // Also exit fullscreen if active
                if (isFullscreen) {
                    exitFullscreen();
                }
                
                // Stop recording if active
                if (isRecordingKey) {
                    stopRecordingKey();
                }
            }
            
            // Handle auto clicker keyboard shortcuts
            handleAutoClickerKeyPress(e);
        });
        
        // Menu button events
        btnClose.addEventListener('click', () => {
            window.close();
            collapseMenu();
        });
        
        // Auto Clicker button
        btnAutoClicker.addEventListener('click', openAutoClickerModal);
        
        btnRefresh.addEventListener('click', () => {
            mainIframe.contentWindow.location.reload();
            collapseMenu();
        });
        
        btnDownload.addEventListener('click', downloadSource);
        
        btnFullscreen.addEventListener('click', toggleFullscreen);
        
        btnCloak.addEventListener('click', openCloakModal);
        
        // Cloak modal events
        closeModal.addEventListener('click', closeCloakModal);
        cloakModal.addEventListener('click', (e) => {
            if (e.target === cloakModal) {
                closeCloakModal();
            }
        });
        
        defaultCloak.addEventListener('change', toggleCustomCloakOptions);
        
        uploadArea.addEventListener('click', () => {
            fileUpload.click();
        });
        
        fileUpload.addEventListener('change', handleImageUpload);
        
        applyCloak.addEventListener('click', applyCloakSettings);
        cancelCloak.addEventListener('click', () => {
            // Check if default cloak is checked before closing
            if (defaultCloak.checked) {
                resetToDefaultCloak();
            }
            closeCloakModal();
        });
        
        // Auto Clicker modal events
        closeAutoClickerModal.addEventListener('click', closeAutoClickerModalFunc);
        autoClickerModal.addEventListener('click', (e) => {
            if (e.target === autoClickerModal) {
                closeAutoClickerModalFunc();
            }
        });
        
        // Auto Clicker settings events
        cpsInput.addEventListener('input', updateCps);
        cpsRandomSlider.addEventListener('input', updateCpsRandomOffset);
        
        dragClickToggle.addEventListener('change', toggleDragClickSettings);
        
        dragDurationSlider.addEventListener('input', updateDragDuration);
        restDurationSlider.addEventListener('input', updateRestDuration);
        durationRandomSlider.addEventListener('input', updateDurationRandomOffset);
        
        keyboardTypeSelect.addEventListener('change', toggleKeyboardSettings);
        
        // Key binding buttons
        triggerKeyBtn.addEventListener('click', () => startRecordingKey(triggerKeyBtn, 'trigger'));
        startKeyBtn.addEventListener('click', () => startRecordingKey(startKeyBtn, 'start'));
        stopKeyBtn.addEventListener('click', () => startRecordingKey(stopKeyBtn, 'stop'));
        
        // Control buttons
        startAutoClicker.addEventListener('click', startAutoClickerFunc);
        stopAutoClicker.addEventListener('click', stopAutoClickerFunc);
        saveAutoClickerSettings.addEventListener('click', saveAutoClickerSettingsFunc);
        
        // Fullscreen change listener
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
        document.addEventListener('mozfullscreenchange', handleFullscreenChange);
        document.addEventListener('MSFullscreenChange', handleFullscreenChange);
    }
    
    function toggleMenuState() {
        if (isMenuExpanded) {
            collapseMenu();
        } else {
            expandMenu();
        }
    }
    
    function expandMenu() {
        bottomMenu.classList.add('expanded');
        toggleIcon.textContent = 'expand_more';
        isMenuExpanded = true;
    }
    
    function collapseMenu() {
        bottomMenu.classList.remove('expanded');
        toggleIcon.textContent = 'expand_less';
        isMenuExpanded = false;
    }
    
    function openAutoClickerModal() {
        autoClickerModal.classList.add('active');
        collapseMenu();
        updateAutoClickerUI();
    }
    
    function closeAutoClickerModalFunc() {
        autoClickerModal.classList.remove('active');
        if (isRecordingKey) {
            stopRecordingKey();
        }
    }
    
    function updateAutoClickerUI() {
        // Update status indicator
        if (isAutoClickerActive) {
            autoClickerStatus.className = 'status-indicator active';
            autoClickerStatus.querySelector('.status-text').textContent = 'Active';
            startAutoClicker.disabled = true;
            stopAutoClicker.disabled = false;
        } else {
            autoClickerStatus.className = 'status-indicator inactive';
            autoClickerStatus.querySelector('.status-text').textContent = 'Inactive';
            startAutoClicker.disabled = false;
            stopAutoClicker.disabled = true;
        }
        
        // Update button text based on key bindings
        if (autoClickerSettings.triggerKey) {
            triggerKeyBtn.textContent = formatKeyName(autoClickerSettings.triggerKey);
        }
        
        if (autoClickerSettings.startKey) {
            startKeyBtn.textContent = formatKeyName(autoClickerSettings.startKey);
        }
        
        if (autoClickerSettings.stopKey) {
            stopKeyBtn.textContent = formatKeyName(autoClickerSettings.stopKey);
        }
    }
    
    function formatKeyName(key) {
        if (!key) return 'Unbound';
        
        // Common key mappings
        const keyMap = {
            ' ': 'Space',
            'Control': 'Ctrl',
            'Alt': 'Alt',
            'Shift': 'Shift',
            'Meta': 'Meta',
            'Escape': 'Esc',
            'ArrowUp': '↑',
            'ArrowDown': '↓',
            'ArrowLeft': '←',
            'ArrowRight': '→'
        };
        
        return keyMap[key] || key;
    }
    
    function updateCps() {
        autoClickerSettings.cps = parseInt(cpsInput.value) || 10;
        if (autoClickerSettings.cps < 1) autoClickerSettings.cps = 1;
        if (autoClickerSettings.cps > 1000) autoClickerSettings.cps = 1000;
        cpsInput.value = autoClickerSettings.cps;
    }
    
    function updateCpsRandomOffset() {
        const value = parseInt(cpsRandomSlider.value) / 100;
        autoClickerSettings.cpsRandomOffset = value;
        cpsRandomValue.textContent = value.toFixed(2);
    }
    
    function toggleDragClickSettings() {
        autoClickerSettings.dragClick = dragClickToggle.checked;
        if (autoClickerSettings.dragClick) {
            dragClickSettings.classList.add('expanded');
        } else {
            dragClickSettings.classList.remove('expanded');
        }
    }
    
    function updateDragDuration() {
        const value = parseInt(dragDurationSlider.value) / 100;
        autoClickerSettings.dragDuration = value;
        dragDurationValue.textContent = value.toFixed(2);
    }
    
    function updateRestDuration() {
        const value = parseInt(restDurationSlider.value) / 100;
        autoClickerSettings.restDuration = value;
        restDurationValue.textContent = value.toFixed(2);
    }
    
    function updateDurationRandomOffset() {
        const value = parseInt(durationRandomSlider.value) / 100;
        autoClickerSettings.durationRandomOffset = value;
        durationRandomValue.textContent = value.toFixed(2);
    }
    
    function toggleKeyboardSettings() {
        autoClickerSettings.keyboardType = keyboardTypeSelect.value;
        if (autoClickerSettings.keyboardType === 'trigger') {
            triggerKeySettings.style.display = 'block';
            startStopKeySettings.classList.remove('expanded');
        } else {
            triggerKeySettings.style.display = 'none';
            startStopKeySettings.classList.add('expanded');
        }
    }
    
    function startRecordingKey(button, keyType) {
        if (isRecordingKey) {
            stopRecordingKey();
            if (currentRecordingButton === button) return;
        }
        
        isRecordingKey = true;
        currentRecordingButton = button;
        button.textContent = 'RECORDING';
        button.classList.add('recording');
        
        showNotification('Recording Key', 'Press any key to bind. Press ESC to cancel.', 'info');
    }
    
    function stopRecordingKey() {
        if (!isRecordingKey) return;
        
        isRecordingKey = false;
        if (currentRecordingButton) {
            currentRecordingButton.classList.remove('recording');
            
            // Restore previous key text
            const keyType = currentRecordingButton.id.replace('Btn', '').replace('Key', '');
            switch(keyType) {
                case 'trigger':
                    currentRecordingButton.textContent = autoClickerSettings.triggerKey ? formatKeyName(autoClickerSettings.triggerKey) : 'Unbound';
                    break;
                case 'start':
                    currentRecordingButton.textContent = autoClickerSettings.startKey ? formatKeyName(autoClickerSettings.startKey) : 'Unbound';
                    break;
                case 'stop':
                    currentRecordingButton.textContent = autoClickerSettings.stopKey ? formatKeyName(autoClickerSettings.stopKey) : 'Unbound';
                    break;
            }
        }
        currentRecordingButton = null;
    }
    
    function handleAutoClickerKeyPress(e) {
        if (!isRecordingKey) {
            // Check if pressed key matches any bound key
            const key = e.key;
            
            if (autoClickerSettings.keyboardType === 'trigger' && autoClickerSettings.triggerKey === key) {
                if (isAutoClickerActive) {
                    stopAutoClickerFunc();
                } else {
                    startAutoClickerFunc();
                }
                e.preventDefault();
            } else if (autoClickerSettings.keyboardType === 'startStop') {
                if (autoClickerSettings.startKey === key) {
                    startAutoClickerFunc();
                    e.preventDefault();
                } else if (autoClickerSettings.stopKey === key) {
                    stopAutoClickerFunc();
                    e.preventDefault();
                }
            }
            return;
        }
        
        // Handle key recording
        e.preventDefault();
        e.stopPropagation();
        
        if (e.key === 'Escape') {
            stopRecordingKey();
            showNotification('Key Binding Cancelled', 'Key binding was cancelled.', 'warning');
            return;
        }
        
        const key = e.key;
        const buttonId = currentRecordingButton.id;
        
        if (buttonId === 'triggerKeyBtn') {
            autoClickerSettings.triggerKey = key;
            currentRecordingButton.textContent = formatKeyName(key);
            showNotification('Trigger Key Set', `Trigger key set to: ${formatKeyName(key)}`, 'success');
        } else if (buttonId === 'startKeyBtn') {
            autoClickerSettings.startKey = key;
            currentRecordingButton.textContent = formatKeyName(key);
            showNotification('Start Key Set', `Start key set to: ${formatKeyName(key)}`, 'success');
        } else if (buttonId === 'stopKeyBtn') {
            autoClickerSettings.stopKey = key;
            currentRecordingButton.textContent = formatKeyName(key);
            showNotification('Stop Key Set', `Stop key set to: ${formatKeyName(key)}`, 'success');
        }
        
        stopRecordingKey();
    }
    
    function startAutoClickerFunc() {
        if (isAutoClickerActive) return;
        
        // Update settings from UI
        updateCps();
        updateCpsRandomOffset();
        autoClickerSettings.clickType = clickTypeSelect.value;
        autoClickerSettings.clickButton = clickButtonSelect.value;
        autoClickerSettings.dragClick = dragClickToggle.checked;
        updateDragDuration();
        updateRestDuration();
        updateDurationRandomOffset();
        autoClickerSettings.keyboardType = keyboardTypeSelect.value;
        
        isAutoClickerActive = true;
        updateAutoClickerUI();
        
        // Calculate click interval with random offset
        const baseInterval = 1000 / autoClickerSettings.cps;
        const randomOffset = (Math.random() * 2 - 1) * autoClickerSettings.cpsRandomOffset;
        const actualInterval = Math.max(10, baseInterval + randomOffset);
        
        if (autoClickerSettings.dragClick) {
            startDragClick();
        } else {
            autoClickerInterval = setInterval(performClick, actualInterval);
        }
        
        showNotification('Auto Clicker Started', 'Auto clicker is now active.', 'success');
    }
    
    function stopAutoClickerFunc() {
        if (!isAutoClickerActive) return;
        
        isAutoClickerActive = false;
        updateAutoClickerUI();
        
        if (autoClickerInterval) {
            clearInterval(autoClickerInterval);
            autoClickerInterval = null;
        }
        
        if (dragClickTimeout) {
            clearTimeout(dragClickTimeout);
            dragClickTimeout = null;
        }
        
        if (isDragClickActive) {
            isDragClickActive = false;
        }
        
        showNotification('Auto Clicker Stopped', 'Auto clicker has been stopped.', 'info');
    }
    
    function performClick() {
        try {
            const iframeWindow = mainIframe.contentWindow;
            const iframeDocument = mainIframe.contentDocument;
            
            if (!iframeWindow || !iframeDocument) return;
            
            // Get the center of the iframe
            const rect = mainIframe.getBoundingClientRect();
            const x = rect.width / 2;
            const y = rect.height / 2;
            
            // Create mouse events
            const mouseDownEvent = new MouseEvent('mousedown', {
                view: iframeWindow,
                bubbles: true,
                cancelable: true,
                clientX: x,
                clientY: y,
                button: autoClickerSettings.clickButton === 'left' ? 0 : 2
            });
            
            const mouseUpEvent = new MouseEvent('mouseup', {
                view: iframeWindow,
                bubbles: true,
                cancelable: true,
                clientX: x,
                clientY: y,
                button: autoClickerSettings.clickButton === 'left' ? 0 : 2
            });
            
            // Perform click(s)
            if (autoClickerSettings.clickType === 'double') {
                // Double click
                iframeDocument.elementFromPoint(x, y).dispatchEvent(mouseDownEvent);
                iframeDocument.elementFromPoint(x, y).dispatchEvent(mouseUpEvent);
                
                setTimeout(() => {
                    iframeDocument.elementFromPoint(x, y).dispatchEvent(mouseDownEvent);
                    iframeDocument.elementFromPoint(x, y).dispatchEvent(mouseUpEvent);
                }, 50);
            } else {
                // Single click
                iframeDocument.elementFromPoint(x, y).dispatchEvent(mouseDownEvent);
                iframeDocument.elementFromPoint(x, y).dispatchEvent(mouseUpEvent);
            }
            
        } catch (error) {
            console.log('Auto clicker error:', error);
        }
    }
    
    function startDragClick() {
        if (!isAutoClickerActive || !autoClickerSettings.dragClick) return;
        
        isDragClickActive = true;
        performDragClickCycle();
    }
    
    function performDragClickCycle() {
        if (!isAutoClickerActive || !isDragClickActive) return;
        
        // Perform a click
        performClick();
        
        // Calculate next click time with random offset
        const baseInterval = 1000 / autoClickerSettings.cps;
        const randomOffset = (Math.random() * 2 - 1) * autoClickerSettings.cpsRandomOffset;
        const actualInterval = Math.max(10, baseInterval + randomOffset);
        
        // Check if we should pause for drag duration
        if (Math.random() < 0.3) { // 30% chance to start a drag
            const dragDuration = autoClickerSettings.dragDuration * 1000 + 
                (Math.random() * 2 - 1) * autoClickerSettings.durationRandomOffset * 1000;
            const restDuration = autoClickerSettings.restDuration * 1000 + 
                (Math.random() * 2 - 1) * autoClickerSettings.durationRandomOffset * 1000;
            
            // Schedule next click after drag and rest
            dragClickTimeout = setTimeout(() => {
                performDragClickCycle();
            }, dragDuration + restDuration);
        } else {
            // Schedule next click normally
            dragClickTimeout = setTimeout(() => {
                performDragClickCycle();
            }, actualInterval);
        }
    }
    
    function saveAutoClickerSettingsFunc() {
        // Update settings from UI
        updateCps();
        updateCpsRandomOffset();
        autoClickerSettings.clickType = clickTypeSelect.value;
        autoClickerSettings.clickButton = clickButtonSelect.value;
        autoClickerSettings.dragClick = dragClickToggle.checked;
        updateDragDuration();
        updateRestDuration();
        updateDurationRandomOffset();
        autoClickerSettings.keyboardType = keyboardTypeSelect.value;
        
        // Save to localStorage
        localStorage.setItem('autoClickerSettings', JSON.stringify(autoClickerSettings));
        
        showNotification('Settings Saved', 'Auto clicker settings have been saved.', 'success');
    }
    
    function loadAutoClickerSettings() {
        const savedSettings = localStorage.getItem('autoClickerSettings');
        if (savedSettings) {
            try {
                autoClickerSettings = JSON.parse(savedSettings);
                
                // Update UI elements
                cpsInput.value = autoClickerSettings.cps;
                cpsRandomSlider.value = Math.round(autoClickerSettings.cpsRandomOffset * 100);
                cpsRandomValue.textContent = autoClickerSettings.cpsRandomOffset.toFixed(2);
                
                clickTypeSelect.value = autoClickerSettings.clickType;
                clickButtonSelect.value = autoClickerSettings.clickButton;
                
                dragClickToggle.checked = autoClickerSettings.dragClick;
                toggleDragClickSettings();
                
                dragDurationSlider.value = Math.round(autoClickerSettings.dragDuration * 100);
                dragDurationValue.textContent = autoClickerSettings.dragDuration.toFixed(2);
                
                restDurationSlider.value = Math.round(autoClickerSettings.restDuration * 100);
                restDurationValue.textContent = autoClickerSettings.restDuration.toFixed(2);
                
                durationRandomSlider.value = Math.round(autoClickerSettings.durationRandomOffset * 100);
                durationRandomValue.textContent = autoClickerSettings.durationRandomOffset.toFixed(2);
                
                keyboardTypeSelect.value = autoClickerSettings.keyboardType;
                toggleKeyboardSettings();
                
                // Update button texts
                updateAutoClickerUI();
                
            } catch (error) {
                console.log('Error loading auto clicker settings:', error);
            }
        }
    }
    
    async function downloadSource() {
        try {
            // Get current iframe URL
            const iframeUrl = mainIframe.src;
            
            // Try to fetch the source code
            const response = await fetch(iframeUrl);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            
            const sourceCode = await response.text();
            
            // Create a blob and download link
            const blob = new Blob([sourceCode], { type: 'text/html' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'website_source.html';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            showNotification('Download Successful', 'Source code has been downloaded.', 'success');
            
        } catch (error) {
            console.error('Download error:', error);
            
            if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
                showNotification('Unable to fetch source', 'The website source code could not be accessed.', 'error');
            } else {
                showNotification('Unable to download', 'An unknown error occurred while downloading.', 'error');
            }
        }
        
        collapseMenu();
    }
    
    function toggleFullscreen() {
        if (!isFullscreen) {
            enterFullscreen();
        } else {
            exitFullscreen();
        }
        
        collapseMenu();
    }
    
    function enterFullscreen() {
        const iframeElement = mainIframe;
        
        // Use the Fullscreen API
        if (iframeElement.requestFullscreen) {
            iframeElement.requestFullscreen();
        } else if (iframeElement.webkitRequestFullscreen) {
            iframeElement.webkitRequestFullscreen();
        } else if (iframeElement.mozRequestFullScreen) {
            iframeElement.mozRequestFullScreen();
        } else if (iframeElement.msRequestFullscreen) {
            iframeElement.msRequestFullscreen();
        }
        
        isFullscreen = true;
        
        // Update button text/icon
        btnFullscreen.querySelector('.icon').textContent = 'fullscreen_exit';
        btnFullscreen.querySelector('.text').textContent = 'Exit Fullscreen';
    }
    
    function exitFullscreen() {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
        
        isFullscreen = false;
        
        // Update button text/icon
        btnFullscreen.querySelector('.icon').textContent = 'fullscreen';
        btnFullscreen.querySelector('.text').textContent = 'Fullscreen';
        
        collapseMenu();
    }
    
    function handleFullscreenChange() {
        isFullscreen = !!(document.fullscreenElement || 
                        document.webkitFullscreenElement || 
                        document.mozFullScreenElement || 
                        document.msFullscreenElement);
        
        // Update button state
        if (isFullscreen) {
            btnFullscreen.querySelector('.icon').textContent = 'fullscreen_exit';
            btnFullscreen.querySelector('.text').textContent = 'Exit Fullscreen';
        } else {
            btnFullscreen.querySelector('.icon').textContent = 'fullscreen';
            btnFullscreen.querySelector('.text').textContent = 'Fullscreen';
            collapseMenu();
        }
    }
    
    function openCloakModal() {
        cloakModal.classList.add('active');
        collapseMenu();
    }
    
    function closeCloakModal() {
        cloakModal.classList.remove('active');
        loadCloakSettings(); // Reset to saved settings
    }
    
    function toggleCustomCloakOptions() {
        if (defaultCloak.checked) {
            customCloakOptions.classList.remove('expanded');
            // Reset to default immediately when checkbox is checked
            resetToDefaultCloak();
            // Save the setting
            localStorage.setItem('defaultCloak', 'true');
        } else {
            customCloakOptions.classList.add('expanded');
            // Save the setting
            localStorage.setItem('defaultCloak', 'false');
        }
    }
    
    function populateIconGrid() {
        iconGrid.innerHTML = '';
        
        iconOptions.forEach(icon => {
            const iconElement = document.createElement('div');
            iconElement.className = 'icon-option';
            iconElement.dataset.icon = icon.url;
            
            const img = document.createElement('img');
            img.className = 'icon-img';
            img.src = icon.url;
            img.alt = icon.name;
            
            const name = document.createElement('div');
            name.className = 'icon-name';
            name.textContent = icon.name;
            
            iconElement.appendChild(img);
            iconElement.appendChild(name);
            
            iconElement.addEventListener('click', () => {
                document.querySelectorAll('.icon-option').forEach(opt => {
                    opt.classList.remove('selected');
                });
                
                iconElement.classList.add('selected');
                selectedIcon = icon.url;
                
                // Clear any uploaded file
                fileUpload.value = '';
            });
            
            iconGrid.appendChild(iconElement);
        });
        
        // Select the first icon by default
        if (iconGrid.firstElementChild) {
            iconGrid.firstElementChild.classList.add('selected');
        }
    }
    
    function handleImageUpload(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        if (!file.type.startsWith('image/')) {
            showNotification('Invalid File', 'Please upload an image file.', 'error');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = function(event) {
            // Create a custom icon option for the uploaded image
            const iconElement = document.createElement('div');
            iconElement.className = 'icon-option selected';
            
            const img = document.createElement('img');
            img.className = 'icon-img';
            img.src = event.target.result;
            img.alt = 'Custom Image';
            
            const name = document.createElement('div');
            name.className = 'icon-name';
            name.textContent = 'Custom';
            
            iconElement.appendChild(img);
            iconElement.appendChild(name);
            
            // Clear previous selections
            document.querySelectorAll('.icon-option').forEach(opt => {
                opt.classList.remove('selected');
            });
            
            // Add to the grid
            iconGrid.appendChild(iconElement);
            
            // Set as selected
            selectedIcon = event.target.result;
            
            // Scroll to show the new icon
            iconElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            
            // Add click handler
            iconElement.addEventListener('click', () => {
                document.querySelectorAll('.icon-option').forEach(opt => {
                    opt.classList.remove('selected');
                });
                
                iconElement.classList.add('selected');
                selectedIcon = event.target.result;
            });
        };
        
        reader.readAsDataURL(file);
    }
    
    // Add this new function to reset to default cloak
    function resetToDefaultCloak() {
        // Reset tab title to default
        document.title = 'Dashboard | Jimmy Q.R.G.';
        
        // Reset favicon to default
        try {
            const favicon = document.getElementById('cloakFavicon');
            if (favicon) {
                favicon.href = 'https://www.jimmyqrg.com/icon.png';
            }
            // Also update all existing favicon links
            const existingFavicons = document.querySelectorAll('link[rel="icon"], link[rel="shortcut icon"]');
            existingFavicons.forEach(link => {
                link.href = 'https://www.jimmyqrg.com/icon.png';
            });
        } catch (error) {
            console.log('Could not reset favicon:', error);
        }
    }
    
    function loadCloakSettings() {
        // Load saved settings from localStorage
        const savedDefaultCloak = localStorage.getItem('defaultCloak');
        const savedIcon = localStorage.getItem('cloakIcon');
        const savedTabName = localStorage.getItem('cloakTabName');
        
        if (savedDefaultCloak !== null) {
            defaultCloak.checked = savedDefaultCloak === 'true';
            toggleCustomCloakOptions();
            
            // Apply default cloak if it's enabled
            if (defaultCloak.checked === true) {
                resetToDefaultCloak();
            } else if (savedTabName || savedIcon) {
                // Apply custom cloak settings if they exist
                if (savedTabName) {
                    document.title = savedTabName;
                }
                
                if (savedIcon) {
                    try {
                        const favicon = document.getElementById('cloakFavicon');
                        if (favicon) {
                            favicon.href = savedIcon;
                        }
                        // Also update all existing favicon links
                        const existingFavicons = document.querySelectorAll('link[rel="icon"], link[rel="shortcut icon"]');
                        existingFavicons.forEach(link => {
                            link.href = savedIcon;
                        });
                    } catch (error) {
                        console.log('Could not load saved favicon:', error);
                    }
                }
            }
        }
        
        if (savedIcon) {
            selectedIcon = savedIcon;
            
            // Find and select the corresponding icon
            document.querySelectorAll('.icon-option').forEach(opt => {
                opt.classList.remove('selected');
                if (opt.dataset.icon === savedIcon) {
                    opt.classList.add('selected');
                }
            });
        }
        
        if (savedTabName) {
            tabName.value = savedTabName;
        }
    }
    
    function applyCloakSettings() {
        // Save settings
        localStorage.setItem('defaultCloak', defaultCloak.checked);
        localStorage.setItem('cloakIcon', selectedIcon);
        localStorage.setItem('cloakTabName', tabName.value);
        
        // Apply or reset cloak based on default setting
        if (!defaultCloak.checked) {
            // Apply custom cloak settings
            // Change tab title
            if (tabName.value) {
                document.title = tabName.value;
            }
            
            // Try to change favicon
            try {
                const favicon = document.getElementById('cloakFavicon');
                if (favicon) {
                    // If the selected icon is a data URL (uploaded image), use it directly
                    if (selectedIcon.startsWith('data:')) {
                        favicon.href = selectedIcon;
                    } else {
                        // Otherwise, it's a URL
                        favicon.href = selectedIcon;
                    }
                }
                // Also update all existing favicon links
                const existingFavicons = document.querySelectorAll('link[rel="icon"], link[rel="shortcut icon"]');
                existingFavicons.forEach(link => {
                    if (selectedIcon.startsWith('data:')) {
                        link.href = selectedIcon;
                    } else {
                        link.href = selectedIcon;
                    }
                });
            } catch (error) {
                console.log('Could not update favicon:', error);
            }
        } else {
            // Reset to default cloak settings
            resetToDefaultCloak();
        }
        
        closeCloakModal();
    }
    
    function showNotification(title, message, type = 'info') {
        // Remove any existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => {
            notification.remove();
        });
        
        // Create new notification
        const notification = document.createElement('div');
        notification.className = `notification ${type === 'error' ? 'error' : type === 'success' ? 'success' : ''}`;
        
        notification.innerHTML = `
            <div class="notification-title">${title}</div>
            <div class="notification-message">${message}</div>
        `;
        
        notificationContainer.appendChild(notification);
        
        // Show notification
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 5000);
    }
    
    // Initialize the application
    init();
