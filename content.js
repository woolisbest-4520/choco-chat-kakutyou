function injectCustomStyles() {
    chrome.storage.local.get(['myMsgColor'], (res) => {
        const myColor = res.myMsgColor || '#3498db'; // デフォルトは青

        let styleTag = document.getElementById('choco-left-blue-style');
        if (!styleTag) {
            styleTag = document.createElement('style');
            styleTag.id = 'choco-left-blue-style';
            document.head.appendChild(styleTag);
        }

        styleTag.innerHTML = `
            /* 自分のメッセージ (own-message) を左側に強制する */
            .message-container.own-message {
                margin-left: 0 !important;
                margin-right: auto !important;
                background-color: ${myColor} !important;
                color: white !important;
                border-left: 4px solid rgba(0,0,0,0.2) !important;
                border-right: none !important;
                text-align: left !important;
            }

            /* メッセージ内の名前や時間も左揃えに */
            .own-message .message-header {
                justify-content: flex-start !important;
            }

            /* 逆に他人のメッセージを少し透過させるなどして区別 */
            .message-container:not(.own-message) {
                margin-left: auto !important;
                margin-right: 0 !important;
                background-color: #f0f0f0 !important;
                color: #333 !important;
            }
        `;
    });
}

// 実行と監視
injectCustomStyles();
chrome.storage.onChanged.addListener(injectCustomStyles);
