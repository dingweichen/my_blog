import { onMounted, onUnmounted, nextTick } from 'vue';

// 动态导入 svg-pan-zoom，避免 SSR 时加载
let svgPanZoom = null;

// pan-zoom 的通用配置
const panZoomOptions = {
  panEnabled: true,
  zoomEnabled: true,
  controlIconsEnabled: false,
  fit: true,
  center: true,
  minZoom: 0.5,
  maxZoom: 5,
};

let modalElement = null;
let modalPanZoomInstance = null;
let zoomDisplay = null;

// SVG 图标字符串
const fullscreenIconSVG = `<svg viewBox="0 0 24 24"><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/></svg>`;
const closeIconSVG = `<svg viewBox="0 0 24 24"><path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"/></svg>`;

/**
 * 异步加载 svg-pan-zoom
 */
async function loadSvgPanZoom() {
  if (!svgPanZoom && typeof window !== 'undefined') {
    const module = await import('svg-pan-zoom');
    svgPanZoom = module.default;
  }
  return svgPanZoom;
}

/**
 * 创建并获取全局唯一的模态框元素
 */
function getOrCreateModal() {
  if (modalElement) {
    return modalElement;
  }
  const modal = document.createElement('div');
  modal.id = 'mermaid-fullscreen-modal';
  modal.className = 'mermaid-modal-overlay';
  modal.innerHTML = `
    <div class="mermaid-modal-content">
      <div id="mermaid-modal-body"></div>
      <div class="mermaid-modal-zoom-display">100%</div>
      <button class="mermaid-modal-close-btn">${closeIconSVG}</button>
    </div>
  `;
  document.body.appendChild(modal);
  modal.addEventListener('click', e => {
    if (e.target === modal) {
      closeModal();
    }
  });
  modalElement = modal;
  return modal;
}

/**
 * 打开模态框并显示指定的 SVG
 */
async function openModal(svgElement) {
  const panZoom = await loadSvgPanZoom();
  if (!panZoom) return;

  const modal = getOrCreateModal();
  const modalBody = modal.querySelector('#mermaid-modal-body');

  modalBody.innerHTML = '';
  const clonedSvg = svgElement.cloneNode(true);
  modalBody.appendChild(clonedSvg);

  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';

  nextTick(() => {
    zoomDisplay = modal.querySelector('.mermaid-modal-zoom-display');
    modalPanZoomInstance = panZoom(clonedSvg, {
      ...panZoomOptions,
      viewportSelector: '#mermaid-modal-body',
      onZoom: scale => {
        if (zoomDisplay) {
          zoomDisplay.textContent = `${Math.round(scale * 100)}%`;
        }
      },
    });

    if (zoomDisplay && modalPanZoomInstance) {
      const initialScale = modalPanZoomInstance.getZoom();
      zoomDisplay.textContent = `${Math.round(initialScale * 100)}%`;
    }

    const closeButton = modal.querySelector('.mermaid-modal-close-btn');
    if (closeButton) {
      closeButton.replaceWith(closeButton.cloneNode(true));
      const newCloseButton = modal.querySelector('.mermaid-modal-close-btn');
      newCloseButton.addEventListener('click', e => {
        e.stopPropagation();
        closeModal();
      });
    }

    if (zoomDisplay) {
      zoomDisplay.replaceWith(zoomDisplay.cloneNode(true));
      const newZoomDisplay = modal.querySelector('.mermaid-modal-zoom-display');
      newZoomDisplay.addEventListener('click', e => {
        e.stopPropagation();
        if (modalPanZoomInstance) {
          modalPanZoomInstance.resetZoom();
          modalPanZoomInstance.center();
          const scale = modalPanZoomInstance.getZoom();
          newZoomDisplay.textContent = `${Math.round(scale * 100)}%`;
        }
      });
      zoomDisplay = newZoomDisplay;
    }
  });
}

/**
 * 关闭模态框并进行清理
 */
function closeModal() {
  if (!modalElement) return;

  if (modalPanZoomInstance) {
    modalPanZoomInstance.destroy();
    modalPanZoomInstance = null;
  }

  zoomDisplay = null;
  modalElement.style.display = 'none';
  document.body.style.overflow = '';
  const modalBody = modalElement.querySelector('#mermaid-modal-body');
  modalBody.innerHTML = '';
}

/**
 * 在 Mermaid 容器上添加缩放显示和全屏按钮
 */
function addControlElements(container) {
  if (container.querySelector('.mermaid-fullscreen-btn')) return;

  const zoomDisplay = document.createElement('div');
  zoomDisplay.className = 'mermaid-inline-zoom-display';
  zoomDisplay.textContent = '100%';
  container.appendChild(zoomDisplay);

  const button = document.createElement('button');
  button.className = 'mermaid-fullscreen-btn';
  button.innerHTML = fullscreenIconSVG;
  button.title = '全屏查看';
  button.addEventListener('click', e => {
    e.stopPropagation();
    const svg = container.querySelector('svg');
    if (svg) {
      openModal(svg);
    }
  });
  container.appendChild(button);
}

/**
 * 初始化页面内联的 Mermaid 图表
 */
async function initializeInlineMermaid(container) {
  const panZoom = await loadSvgPanZoom();
  if (!panZoom) return;

  const svg = container.querySelector('svg');
  if (svg && !svg.hasAttribute('data-pan-zoom-initialized')) {
    const inlineZoomDisplay = container.querySelector(
      '.mermaid-inline-zoom-display'
    );
    const panZoomInstance = panZoom(svg, {
      ...panZoomOptions,
      controlIconsEnabled: false,
      onZoom: scale => {
        if (inlineZoomDisplay) {
          inlineZoomDisplay.textContent = `${Math.round(scale * 100)}%`;
        }
      },
    });

    if (inlineZoomDisplay && panZoomInstance) {
      const initialScale = panZoomInstance.getZoom();
      inlineZoomDisplay.textContent = `${Math.round(initialScale * 100)}%`;

      inlineZoomDisplay.addEventListener('click', e => {
        e.stopPropagation();
        panZoomInstance.resetZoom();
        panZoomInstance.center();
        const scale = panZoomInstance.getZoom();
        inlineZoomDisplay.textContent = `${Math.round(scale * 100)}%`;
      });
    }
    svg.setAttribute('data-pan-zoom-initialized', 'true');
  }
}

/**
 * 扫描并处理页面上所有的 Mermaid 容器
 */
function processAllMermaidContainers() {
  const containers = document.querySelectorAll('.mermaid');
  containers.forEach(container => {
    addControlElements(container);
    initializeInlineMermaid(container);
  });
}

const observer =
  typeof window !== 'undefined'
    ? new MutationObserver(processAllMermaidContainers)
    : null;

// 存储原始的 history 方法
let originalPushState = null;
let originalReplaceState = null;
let isHistoryPatched = false;

export function useMermaidPanZoom() {
  let routeChangeHandler = null;

  onMounted(() => {
    // 只在客户端执行
    if (typeof window === 'undefined') return;

    nextTick(() => {
      processAllMermaidContainers();
      if (observer) {
        observer.observe(document.body, { childList: true, subtree: true });
      }
    });

    routeChangeHandler = () => {
      nextTick(processAllMermaidContainers);
    };

    window.addEventListener('popstate', routeChangeHandler);

    if (!isHistoryPatched) {
      originalPushState = history.pushState;
      originalReplaceState = history.replaceState;

      history.pushState = function (...args) {
        originalPushState.apply(history, args);
        setTimeout(() => {
          nextTick(processAllMermaidContainers);
        }, 0);
      };

      history.replaceState = function (...args) {
        originalReplaceState.apply(history, args);
        setTimeout(() => {
          nextTick(processAllMermaidContainers);
        }, 0);
      };

      isHistoryPatched = true;
    }
  });

  onUnmounted(() => {
    if (typeof window === 'undefined') return;

    if (observer) {
      observer.disconnect();
    }

    if (routeChangeHandler) {
      window.removeEventListener('popstate', routeChangeHandler);
    }

    if (modalElement && modalElement.style.display !== 'none') {
      closeModal();
    }
  });

  const cleanup = () => {
    if (
      typeof window !== 'undefined' &&
      isHistoryPatched &&
      originalPushState &&
      originalReplaceState
    ) {
      history.pushState = originalPushState;
      history.replaceState = originalReplaceState;
      isHistoryPatched = false;
      originalPushState = null;
      originalReplaceState = null;
    }
  };

  return { cleanup };
}
