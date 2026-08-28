import { ref, nextTick } from 'vue'

export const useScroll = () => {
  const scrollRef = ref<HTMLDivElement | null>(null)
  // 视口滚动到顶部
  const scrollToTop = async () => {
    await nextTick()
    if (scrollRef.value) {
      scrollRef.value.scrollIntoView({
        block: 'start',
        behavior: 'smooth'
      })
    }
  }
  // 视口滚动到指定元素
  const scrollById = async (id: string) => {
    await nextTick()
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({
        block: 'center',
        behavior: 'smooth'
      })
    }
  }
  //容器滚动到底部
  const scrollBottom=async ()=>{
    await nextTick()
    if(!scrollRef)return 
    scrollRef.value?.scrollTo({
      top:scrollRef.value.scrollHeight,
      behavior:'smooth'
    })
  }
  //容器滚动到顶部
    const scrollTop=async ()=>{
    await nextTick()
    if(!scrollRef)return 
    scrollRef.value?.scrollTo({
      top:0,
      behavior:'smooth'
    })
  }
  return {
    scrollRef,
    scrollToTop,
    scrollById,
    scrollBottom,
    scrollTop
  }
}
