/**
 * 全局媒体管理器
 * 确保同一时间只有一个媒体在播放
 */
import { ref, readonly } from 'vue'

type MediaElement = HTMLAudioElement | HTMLVideoElement
type MediaType = 'audio' | 'video'

interface MediaInstance {
    id: string
    type: MediaType
    element: MediaElement
    pause: () => void
}

const mediaInstances = new Map<string, MediaInstance>()
const currentPlayingId = ref<string | null>(null)
let idCounter = 0

function generateId(type: MediaType): string {
    return `${type}-${++idCounter}-${Date.now()}`
}

function registerMedia(type: MediaType, element: MediaElement, pauseFn: () => void): string {
    const id = generateId(type)
    mediaInstances.set(id, { id, type, element, pause: pauseFn })
    return id
}

function unregisterMedia(id: string): void {
    if (currentPlayingId.value === id) currentPlayingId.value = null
    mediaInstances.delete(id)
}

function notifyPlay(id: string): void {
    mediaInstances.forEach((instance, instanceId) => {
        if (instanceId !== id) {
            try { instance.pause() } catch {}
        }
    })
    currentPlayingId.value = id
}

function notifyPause(id: string): void {
    if (currentPlayingId.value === id) currentPlayingId.value = null
}

function getCurrentPlayingId(): Readonly<typeof currentPlayingId> {
    return readonly(currentPlayingId)
}

function pauseAll(): void {
    mediaInstances.forEach(instance => {
        try { instance.pause() } catch {}
    })
    currentPlayingId.value = null
}

export const mediaManager = {
    registerMedia,
    unregisterMedia,
    notifyPlay,
    notifyPause,
    getCurrentPlayingId,
    pauseAll
}

export default mediaManager
