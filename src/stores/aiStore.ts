import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
export const useAiStore = defineStore('ai', () => {
    //是否折叠
    const isFold = ref(false)
    //切换折叠
    const toggleFold = () => {
        isFold.value = !isFold.value
    }
    const foldStatus = computed(() => {
        return isFold.value
    })
    //Ai控制器
    interface ControllerItem {
        ctrl: AbortController
        tempId: string
    }
    const controllersMap = new Map<string, ControllerItem>()  //key为临时id，value为控制器项对象{ctrl:控制器,tempId:ai占位符的temp_id}
    //正在运行的控制器
    const currentControllerKey = ref<string | null>(null)
    //获取当前的ai占位符的temp_id
    const getCurrentTempId =(ctrlKey:string)=>{
        const controllerItem = controllersMap.get(ctrlKey)
        if (controllerItem) {
            return controllerItem.tempId
        }
        return ''
    }
    //创建控制器
    const createController = (ctrlKey: string, tempId: string) => {
        console.log('创建控制器', ctrlKey)
        const newController = new AbortController()
        controllersMap.set(ctrlKey, {ctrl: newController, tempId})
        currentControllerKey.value = ctrlKey
        return newController
    }
    //删除单个控制器（切换会话/关闭页面/正常响应结束）
    const removeOneController = (ctrlKey: string, force: boolean = false) => {
        console.log('删除控制器', ctrlKey)
        const controller = controllersMap.get(ctrlKey)
        if (controller && force) {
            controller.ctrl.abort()
        }
        controllersMap.delete(ctrlKey)
        if (ctrlKey === currentControllerKey.value) {
            currentControllerKey.value = null
        }
    }
    //删除所有控制器（退出登录/注销账号）
    const removeAllControllers = () => {
        controllersMap.forEach(controller => controller.ctrl.abort())
        controllersMap.clear()
        currentControllerKey.value = null
    }
    return {
        foldStatus,
        toggleFold,
        getCurrentTempId,
        createController,
        removeOneController,
        removeAllControllers,
        currentControllerKey
    }
})