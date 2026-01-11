function applyStyles() {
  chrome.storage.local.get(['chatConfig'], (result) => {
    const config = result.chatConfig;
    if (!config) return;

    // 既存のカスタムスタイルがあるか確認、なければ作成
    let styleTag = document.getElementById('choco-custom-style');
    if (!styleTag) {
      styleTag = document.createElement('style');
      styleTag.id = 'choco-custom-style';
      document.head.appendChild(styleTag);
    }

    // ストレージの値に基づいてCSSを動的に生成
    styleTag.innerHTML = `
      :root {
        --choco-main-color: ${config.mainColor} !important;
        --choco-radius: ${config.borderRadius} !important;
        --choco-font-size: ${config.fontSize} !important;
      }

      /* 既存のクラスを上書き */
      .message-container {
        border-radius: var(--choco-radius) !important;
        font-size: var(--choco-font-size) !important;
        border: 1px solid rgba(0,0,0,0.05) !important;
      }

      .message-container.own-message {
        background-color: var(--choco-main-color) !important;
        color: white !important;
      }

      .chat-header {
        background-color: var(--choco-main-color) !important;
      }

      #send-btn {
        background-color: var(--choco-main-color) !important;
      }
    `;
  });
}

// ページ読み込み時と、ストレージ変更時に実行
applyStyles();
chrome.storage.onChanged.addListener((changes) => {
  if (changes.chatConfig) {
    applyStyles();
  }
});
