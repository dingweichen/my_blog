<template>
  <td ref="cellRef" class="common-cell" @click="handleImgClick">
    <div v-if="code" class="common-code-block">
      <span v-if="lang" class="common-code-lang">{{ lang }}</span>
      <pre><code>{{ code }}</code></pre>
    </div>
    <slot />

    <!-- Lightbox 遮罩 -->
    <Teleport to="body">
      <div
        v-if="lightboxSrc"
        class="lightbox-overlay"
        @click="closeLightbox"
        @wheel.prevent="onWheel"
      >
        <!-- 上一张 -->
        <button
          v-if="imgList.length > 1"
          class="lightbox-nav lightbox-nav--prev"
          title="上一张"
          @click.stop="navigate(-1)"
        >
          ‹
        </button>

        <img
          ref="lightboxImgRef"
          :src="lightboxSrc"
          class="lightbox-img"
          :style="imgStyle"
          @click.stop
          @mousedown.prevent="startDrag"
        />

        <!-- 下一张 -->
        <button
          v-if="imgList.length > 1"
          class="lightbox-nav lightbox-nav--next"
          title="下一张"
          @click.stop="navigate(1)"
        >
          ›
        </button>

        <!-- 图片计数 -->
        <div v-if="imgList.length > 1" class="lightbox-counter">
          {{ currentIndex + 1 }} / {{ imgList.length }}
        </div>

        <!-- 工具栏 -->
        <div class="lightbox-toolbar" @click.stop>
          <button class="lightbox-btn" title="缩小" @click="zoom(-0.2)">－</button>
          <span class="lightbox-scale">{{ Math.round(scale * 100) }}%</span>
          <button class="lightbox-btn" title="放大" @click="zoom(0.2)">＋</button>
          <button class="lightbox-btn" title="重置" @click="resetTransform">⟲</button>
          <div class="lightbox-divider" />
          <button
            class="lightbox-btn"
            :title="isPixelated ? '切换为平滑模式' : '切换为截图清晰模式'"
            @click="toggleRenderMode"
          >{{ isPixelated ? '🖼' : '🔍' }}</button>
          <button class="lightbox-btn" title="关闭" @click="closeLightbox">✕</button>
        </div>
      </div>
    </Teleport>
  </td>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, type CSSProperties } from 'vue'

defineProps<{
  code?: string
  lang?: string
}>()

const cellRef = ref<HTMLElement | null>(null)
const lightboxImgRef = ref<HTMLImageElement | null>(null)

// 图片列表 & 当前索引
const imgList = ref<string[]>([])
const currentIndex = ref(0)
const lightboxSrc = computed(() => imgList.value[currentIndex.value] ?? null)

// 变换状态
const scale = ref(1)
const translateX = ref(0)
const translateY = ref(0)

// 拖拽状态
const isDragging = ref(false)
let dragStartX = 0
let dragStartY = 0
let dragOriginX = 0
let dragOriginY = 0

// 渲染模式：截图模式(pixelated) vs 照片模式(smooth)
const isPixelated = ref(false)

function toggleRenderMode() {
  isPixelated.value = !isPixelated.value
}

const imgStyle = computed(() => ({
  transform: `translate(${translateX.value}px, ${translateY.value}px) scale(${scale.value})`,
  cursor: isDragging.value ? 'grabbing' : 'grab',
  transition: isDragging.value ? 'none' : 'transform 0.15s ease',
  transformOrigin: 'center center',
  imageRendering: (isPixelated.value ? 'pixelated' : 'auto') as CSSProperties['imageRendering'],
}))

function startDrag(e: MouseEvent) {
  isDragging.value = true
  dragStartX = e.clientX
  dragStartY = e.clientY
  dragOriginX = translateX.value
  dragOriginY = translateY.value

  const onMove = (ev: MouseEvent) => {
    if (!isDragging.value) return
    translateX.value = dragOriginX + (ev.clientX - dragStartX)
    translateY.value = dragOriginY + (ev.clientY - dragStartY)
  }
  const onUp = () => {
    isDragging.value = false
    window.removeEventListener('mousemove', onMove)
    window.removeEventListener('mouseup', onUp)
  }
  window.addEventListener('mousemove', onMove)
  window.addEventListener('mouseup', onUp)
}

// 缩放：重置 translate 保持居中
function zoom(delta: number) {
  scale.value = Math.min(Math.max(scale.value + delta, 0.2), 5)
  translateX.value = 0
  translateY.value = 0
}

function onWheel(e: WheelEvent) {
  zoom(e.deltaY > 0 ? -0.15 : 0.15)
}

function resetTransform() {
  scale.value = 1
  translateX.value = 0
  translateY.value = 0
}

// 切换图片
function navigate(dir: 1 | -1) {
  const len = imgList.value.length
  currentIndex.value = (currentIndex.value + dir + len) % len
  resetTransform()
}

function openLightbox(src: string) {
  // 收集单元格内所有图片
  const imgs = cellRef.value?.querySelectorAll('img') ?? []
  imgList.value = Array.from(imgs).map(img => img.src)
  currentIndex.value = imgList.value.indexOf(src)
  if (currentIndex.value === -1) {
    imgList.value = [src]
    currentIndex.value = 0
  }
  resetTransform()
  isPixelated.value = false
  document.body.style.overflow = 'hidden'
}

function closeLightbox() {
  imgList.value = []
  document.body.style.overflow = ''
}

function onKeydown(e: KeyboardEvent) {
  if (!lightboxSrc.value) return
  if (e.key === 'Escape') closeLightbox()
  if (e.key === '+' || e.key === '=') zoom(0.2)
  if (e.key === '-') zoom(-0.2)
  if (e.key === '0') resetTransform()
  if (e.key === 'ArrowLeft') navigate(-1)
  if (e.key === 'ArrowRight') navigate(1)
}

function handleImgClick(e: MouseEvent) {
  const target = e.target as HTMLElement
  if (target.tagName === 'IMG') {
    openLightbox((target as HTMLImageElement).src)
  }
}

onMounted(() => {
  window.addEventListener('keydown', onKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', onKeydown)
  document.body.style.overflow = ''
})
</script>

<script lang="ts">
export default { inheritAttrs: false }
</script>

<style scoped>
.common-cell {
  padding: 12px 14px;
  border: 1px solid var(--vp-c-divider);
  vertical-align: top;
  min-width: 180px;
}

.common-cell :deep(img) {
  max-width: 100%;
  border-radius: 4px;
  display: block;
  margin: 0.4rem 0;
  cursor: zoom-in;
  transition: opacity 0.2s;
}

.common-cell :deep(img:hover) {
  opacity: 0.85;
}

.common-code-block {
  position: relative;
  background-color: var(--vp-code-block-bg);
  border-radius: 8px;
  margin: 0.4rem 0;
  overflow: hidden;
}

.common-code-lang {
  position: absolute;
  top: 8px;
  right: 12px;
  font-size: 0.75rem;
  color: var(--vp-c-text-3);
  font-family: var(--vp-font-family-mono);
}

.common-code-block pre {
  margin: 0;
  padding: 20px 24px;
  overflow-x: auto;
}

.common-code-block pre code {
  font-family: var(--vp-font-family-mono);
  font-size: 0.875rem;
  line-height: 1.6;
  color: var(--vp-code-block-color);
  white-space: pre-wrap;
  word-break: break-all;
  background: transparent;
  padding: 0;
}
</style>

<style>
.lightbox-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: rgba(0, 0, 0, 0.88);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: zoom-out;
  backdrop-filter: blur(4px);
  animation: lightbox-fade-in 0.2s ease;
  user-select: none;
}

.lightbox-img {
  max-width: 90vw;
  max-height: 85vh;
  object-fit: contain;
  border-radius: 8px;
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.5);
  transform-origin: center center;
}

/* 左右切换箭头 */
.lightbox-nav {
  position: fixed;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.45);
  border: none;
  color: #fff;
  font-size: 2.5rem;
  width: 48px;
  height: 64px;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s;
  line-height: 1;
}

.lightbox-nav:hover {
  background: rgba(0, 0, 0, 0.7);
}

.lightbox-nav--prev { left: 16px; }
.lightbox-nav--next { right: 16px; }

/* 图片计数 */
.lightbox-counter {
  position: fixed;
  top: 16px;
  left: 50%;
  transform: translateX(-50%);
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.85rem;
  background: rgba(0, 0, 0, 0.45);
  padding: 3px 12px;
  border-radius: 999px;
}

/* 工具栏 */
.lightbox-toolbar {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 4px;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  border-radius: 999px;
  padding: 6px 12px;
  border: 1px solid rgba(255, 255, 255, 0.15);
}

.lightbox-divider {
  width: 1px;
  height: 18px;
  background: rgba(255, 255, 255, 0.2);
  margin: 0 4px;
}

.lightbox-btn {
  background: transparent;
  border: none;
  color: #fff;
  font-size: 1rem;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s;
}

.lightbox-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.lightbox-scale {
  color: rgba(255, 255, 255, 0.75);
  font-size: 0.8rem;
  min-width: 42px;
  text-align: center;
}

@keyframes lightbox-fade-in {
  from { opacity: 0; }
  to   { opacity: 1; }
}
</style>
