(function() {
    // 1. スタイルの定義（注入用）
    const style = document.createElement('style');
    style.innerHTML = `
        /* 設定ボタン（左側） */
        #custom-config-trigger {
            position: fixed;
            left: 10px;
            bottom: 80px;
            width: 50px;
            height: 50px;
            background-color: #3498db;
            color: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            box-shadow: 0 4px 10px rgba(0,0,0,0.3);
            z-index: 9999;
            font-size: 20px;
            transition: transform 0.2s;
        }
        #custom-config-trigger:hover { transform: scale(1.1); }

        /* 設定パネル */
        #custom-config-panel {
            position: fixed;
            left: 70px;
            bottom: 80px;
            width: 200px;
            background: white;
            border-radius: 12px;
            box-shadow: 0 5px 20px rgba(0,0,0,0.2);
            padding: 15px;
            z-index: 9999;
            display: none;
            font-family: sans-serif;
            color: #333;
        }
        #custom-config-panel.show { display: block; }
        #custom-config-panel h3 { margin-top: 0; font-size: 14px; border-bottom: 1px solid #eee; padding-bottom: 5px; }
        .config-item { margin-bottom: 10px; }
        .config-item label { display: block; font-size: 11px; color: #666; }
        
        /* 自分のメッセージを左側に青くするスタイル（動的に変化） */
        .message-container.own-message {
            margin-left: 0 !important;
            margin-right: auto !important;
            border-left: 5px solid rgba(0,0,0,0.2) !important;
            text-align: left !important;
            max-width: 80% !important;
        }
    `;
    document.head.appendChild(style);

    // 2. 設定パネルのHTMLを作成
    const panel = document.createElement('div');
    panel.id = 'custom-config-panel';
    panel.innerHTML = `
        <h3>UI設定</h3>
        <div class="config-item">
            <label>自分用カラー (左側)</label>
            <input type="color" id="colorPicker" value="#3498db">
        </div>
        <button id="saveConfig" style="width:100%; cursor:pointer;">適用</button>
    `;

    // 3. トリガーボタンを作成
    const trigger = document.createElement('div');
    trigger.id = 'custom-config-trigger';
    trigger.innerHTML = '⚙️';
    trigger.onclick = () => panel.classList.toggle('show');

    document.body.appendChild(panel);
    document.body.appendChild(trigger);

    // 4. 設定適用ロジック
    const dynamicStyle = document.createElement('style');
    document.head.appendChild(dynamicStyle);

    function apply(color) {
        dynamicStyle.innerHTML = `
            .message-container.own-message {
                background-color: ${color} !important;
                color: white !important;
            }
        `;
    }

    // 初期読み込み
    chrome.storage.local.get(['myColor'], (res) => {
        const c = res.myColor || '#3498db';
        document.getElementById('colorPicker').value = c;
        apply(c);
    });

    // 適用ボタンクリック時
    document.getElementById('saveConfig').onclick = () => {
        const newColor = document.getElementById('colorPicker').value;
        chrome.storage.local.set({ myColor: newColor }, () => {
            apply(newColor);
            panel.classList.remove('show');
        });
    };
})();
