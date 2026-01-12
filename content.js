(function() {
    // 1. 基本UIと固定レイアウトのスタイル注入
    const baseStyle = document.createElement('style');
    baseStyle.innerHTML = `
        #custom-config-trigger {
            position: fixed; left: 15px; bottom: 85px; width: 45px; height: 45px;
            background: #3498db; color: white; border-radius: 50%;
            display: flex; align-items: center; justify-content: center;
            cursor: pointer; box-shadow: 0 4px 12px rgba(0,0,0,0.2); z-index: 10000;
            font-size: 20px; transition: 0.2s;
        }
        #custom-config-panel {
            position: fixed; left: 15px; bottom: 140px; width: 240px;
            background: white; border-radius: 12px; box-shadow: 0 8px 24px rgba(0,0,0,0.2);
            padding: 18px; z-index: 10000; display: none; font-family: sans-serif;
        }
        #custom-config-panel.show { display: block; }
        .config-section { margin-bottom: 15px; }
        .config-section h3 { margin: 0 0 10px 0; font-size: 14px; color: #333; border-left: 4px solid #3498db; padding-left: 8px; }
        .config-item { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; }
        .config-item label { font-size: 12px; color: #666; }
        .config-item input { cursor: pointer; }
        #save-btn { width: 100%; padding: 8px; background: #3498db; color: white; border: none; border-radius: 5px; cursor: pointer; margin-top: 5px; }
        
        /* メッセージ配置の強制変更 */
        .message-container.own-message { margin-left: 0 !important; margin-right: auto !important; text-align: left !important; }
        .message-container:not(.own-message) { margin-left: auto !important; margin-right: 0 !important; }
    `;
    document.head.appendChild(baseStyle);

    // 2. 設定パネルのHTML作成
    const panel = document.createElement('div');
    panel.id = 'custom-config-panel';
    panel.innerHTML = `
        <div class="config-section">
            <h3>背景・文字</h3>
            <div class="config-item"><label>全体の背景色</label><input type="color" id="bgColor" value="#ffffff"></div>
            <div class="config-item"><label>文字サイズ</label><input type="range" id="fontSize" min="10" max="24" value="14"></div>
        </div>
        <div class="config-section">
            <h3>自分 (左側)</h3>
            <div class="config-item"><label>バブル色</label><input type="color" id="myColor" value="#3498db"></div>
            <div class="config-item"><label>文字色</label><input type="color" id="myTextColor" value="#ffffff"></div>
        </div>
        <div class="config-section">
            <h3>相手 (右側)</h3>
            <div class="config-item"><label>バブル色</label><input type="color" id="otherColor" value="#f0f0f0"></div>
            <div class="config-item"><label>文字色</label><input type="color" id="otherTextColor" value="#333333"></div>
        </div>
        <button id="save-btn">設定を保存</button>
    `;

    const trigger = document.createElement('div');
    trigger.id = 'custom-config-trigger';
    trigger.innerHTML = '⚙️';
    trigger.onclick = () => panel.classList.toggle('show');

    document.body.appendChild(panel);
    document.body.appendChild(trigger);

    // 3. 動的スタイル適用のためのタグ
    const dynamicStyle = document.createElement('style');
    document.head.appendChild(dynamicStyle);

    function updateStyles(cfg) {
        dynamicStyle.innerHTML = `
            body, .chat-container { background-color: ${cfg.bgColor} !important; }
            .message-container { font-size: ${cfg.fontSize}px !important; max-width: 85% !important; }
            
            /* 自分の投稿 */
            .message-container.own-message { 
                background-color: ${cfg.myColor} !important; 
                color: ${cfg.myTextColor} !important; 
            }
            .own-message .message-text, .own-message .message-name, .own-message .message-time { color: ${cfg.myTextColor} !important; }

            /* 他人の投稿 */
            .message-container:not(.own-message) { 
                background-color: ${cfg.otherColor} !important; 
                color: ${cfg.otherTextColor} !important; 
            }
            .message-container:not(.own-message) .message-text, 
            .message-container:not(.own-message) .message-name, 
            .message-container:not(.own-message) .message-time { color: ${cfg.otherTextColor} !important; }
        `;
    }

    // 保存と読み込み
    const ids = ['bgColor', 'fontSize', 'myColor', 'myTextColor', 'otherColor', 'otherTextColor'];
    
    chrome.storage.local.get(['chatConfig'], (res) => {
        const cfg = res.chatConfig || {
            bgColor: '#ffffff', fontSize: '14',
            myColor: '#3498db', myTextColor: '#ffffff',
            otherColor: '#f0f0f0', otherTextColor: '#333333'
        };
        ids.forEach(id => document.getElementById(id).value = cfg[id]);
        updateStyles(cfg);
    });

    document.getElementById('save-btn').onclick = () => {
        const newCfg = {};
        ids.forEach(id => newCfg[id] = document.getElementById(id).value);
        chrome.storage.local.set({ chatConfig: newCfg }, () => {
            updateStyles(newCfg);
            panel.classList.remove('show');
        });
    };
})();
