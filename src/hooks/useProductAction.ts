import { getDeviceList } from '@/api/tools' // 假设修正为 getDeviceList
import useDeviceStore, { type Device } from '@/store/deviceStore'
import { getAuthToken } from '@/utils/auth'
import dayjs from 'dayjs'
import { useRequest } from 'ahooks'

/**
 * useInitializeData
 */
export const useInitializeDevicesData = () => {
  const { devices, expire, setData } = useDeviceStore()

  // 处理设备列表的独立函数
  const handleDevices = async () => {
    // 如果设备已存在且未过期，直接返回
    if (devices.length > 0 && dayjs().unix() < Number(expire)) {
      return { success: true }
    }
    try {
      const { data } = await getDeviceList()
      if (Array.isArray(data)) {
        const deviceList: Device[] = data.map((element) => ({
          id: element,
          name: element
        }))
        setData(deviceList)
        return { success: true }
      }
      return { success: false, message: '设备列表获取失败' }
    } catch (error) {
      console.error(error)
      return { success: false, message: '设备列表获取失败' }
    }
    // 如果失败，可以根据需要抛出错误或记录日志
  }

  const { loading, runAsync } = useRequest(handleDevices, { manual: true })

  /**
   * initData
   * 初始化用户和设备数据
   * @returns {Promise<{success: boolean, message?: string}>}
   */
  const initDevices = async (): Promise<{
    success: boolean
    message?: string
  }> => {
    // 按照优先级从不同来源获取 token
    const token =
      getAuthToken() || new URLSearchParams(window.location.search).get('token')

    // 如果存在 token，则执行数据获取
    if (token) {
      const message = await runAsync()
      return message
    } else {
      return { success: false, message: '请先登录' }
    }
  }

  return {
    loading,
    initDevices // 重命名为 initData 以反映完整职责
  }
}
