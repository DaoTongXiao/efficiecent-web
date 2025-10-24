import dayjs from 'dayjs'
import type { Dayjs } from 'dayjs'
import { TypeEnum } from '@/config/constant'
import useDeviceStore from '@/store/deviceStore'
import { App, Button, Calendar, List, Spin } from 'antd'
import { CloseOutlined } from '@ant-design/icons'
import { useInitializeDevicesData} from '@/hooks/useProductAction'
import React, { useEffect, useState } from 'react'
import './styles.scss'

export type DeviceParam = {
  deviceId: string | null
  dateStart: string
  dateEnd: string
  prompt: string
}

type DeviceSelectorProps = {
  eventType: string
  visible: boolean
  close?: (value: boolean) => void
  save?: (param: DeviceParam) => void
}

/**
 * 设备选择器
 * @param param
 * @returns {FC}
 */
const DeviceSelector: React.FC<DeviceSelectorProps> = ({
  visible,
  eventType,
  save,
  close
}: DeviceSelectorProps) => {
  const { notification } = App.useApp()
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null)
  const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null]>([
    dayjs().add(-7, 'days'),
    dayjs()
  ])
  const { devices } = useDeviceStore()
  const { initDevices, loading} = useInitializeDevicesData()
  //
  const [selectingDate, setSelectingDate] = useState<'start' | 'end'>('start')

  /**
   * 保存选择
   */
  const onSave = () => {
    let prompt = ''
    switch (eventType) {
      case TypeEnum.ProductStatus: {
        prompt = [
          '查看',
          selectedDevice,
          '在',
          dayjs(dateRange[0]).format('YYYY-MM-DD'),
          '到',
          dayjs(dateRange[1]).format('YYYY-MM-DD'),
          '范围内的生产状况'
        ].join('')
        break
      }
      case TypeEnum.BatchOverview: {
        prompt = [
          '查看',
          selectedDevice,
          '在',
          dayjs(dateRange[0]).format('YYYY-MM-DD'),
          '到',
          dayjs(dateRange[1]).format('YYYY-MM-DD'),
          '范围内的批次概览'
        ].join('')
        break
      }
    }
    if (!selectedDevice) {
      notification.warning({
        message: '消息提示',
        description: '请选择一个设备'
      })
      return
    }
    if (!dateRange[0] || !dateRange[1]) {
      notification.warning({
        message: '消息提示',
        description: '请选择完整的日期范围'
      })
      return
    }
    if (save) {
      save({
        deviceId: selectedDevice,
        dateStart: dayjs(dateRange[0]).format('YYYY-MM-DD'),
        dateEnd: dayjs(dateRange[1]).format('YYYY-MM-DD'),
        prompt
      })
    }
  }

  // 更新设备选择
  const handleDeviceSelect = (deviceId: string) => {
    setSelectedDevice(deviceId)
  }

  // 处理日期选择
  const handleDateSelect = (date: Dayjs, calendarType: 'start' | 'end') => {
    const newRange: [Dayjs | null, Dayjs | null] = [...dateRange]

    if (calendarType === 'start') {
      newRange[0] = date
      // 如果开始日期晚于结束日期，重置结束日期
      if (newRange[1] && date.isAfter(newRange[1])) {
        newRange[1] = null
      }
      setSelectingDate('end') // 选择完开始日期后自动切换到选择结束日期
    } else {
      newRange[1] = date
      // 如果结束日期早于开始日期，重置开始日期
      if (newRange[0] && date.isBefore(newRange[0])) {
        newRange[0] = null
      }
    }

    setDateRange(newRange)
  }

  /**
   * 初始化数据
   */
  const initData = async () => {
    const message = await initDevices()
    if (!message.success) {
      notification.error({
        message: message?.message
      })
    }
  }
  useEffect(() => {
    initData()
  },[])

  return (
    <div
      className="device-selector-container-inline"
      style={{ display: visible ? 'block' : 'none' }}
    >
      <div className="device-selector-header">
        <h2>选择设备和时间范围</h2>
        <div className="header-buttons">
          <Button type="primary" onClick={onSave}>
            保存
          </Button>
          <Button
            type="text"
            icon={<CloseOutlined />}
            className="close-button"
            onClick={() => close && close(false)}
          />
        </div>
      </div>
      <div className="device-selector-content">
        <div className="device-list-section">
          <h3>选择Device</h3>
          <Spin spinning={loading}>
            <List
              className="device-list"
              size="small"
              bordered
              dataSource={devices}
              renderItem={(item) => (
                <List.Item
                  className={selectedDevice === item.id ? 'selected' : ''}
                  onClick={() => handleDeviceSelect(item.id)}
                >
                  {item.name}
                </List.Item>
              )}
            />
          </Spin>
        </div>

        <div className="date-range-section">
          <h3>选择时间范围</h3>
          <div className="calendars-container">
            <div className="calendar-wrapper">
              <div className="calendar-title">
                <h4>开始日期</h4>
                <div
                  className={`calendar-indicator ${selectingDate === 'start' ? 'active' : ''}`}
                ></div>
              </div>
              <Calendar
                fullscreen={false}
                onSelect={(date) => handleDateSelect(date, 'start')}
                value={dateRange[0] || undefined}
              />
            </div>
            <div className="calendar-wrapper">
              <div className="calendar-title">
                <h4>结束日期</h4>
                <div
                  className={`calendar-indicator ${selectingDate === 'end' ? 'active' : ''}`}
                ></div>
              </div>
              <Calendar
                fullscreen={false}
                onSelect={(date) => handleDateSelect(date, 'end')}
                value={dateRange[1] || undefined}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DeviceSelector
