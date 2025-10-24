import dayjs from 'dayjs'
import type { Dayjs } from 'dayjs'
import { App, Button, Calendar } from 'antd'
import { CloseOutlined } from '@ant-design/icons'
import React, { useState } from 'react'
import './styles.scss'

export type DateRangeParam = {
  dateStart: string
  dateEnd: string
}

type DateRangeProps = {
  visible: boolean
  close?: (value: boolean) => void
  save?: (param: DateRangeParam) => void
}

/**
 * 日期范围选择器
 * @param param
 * @returns {FC}
 */
const DateSelector: React.FC<DateRangeProps> = ({
  visible,
  save,
  close
}: DateRangeProps) => {
  const { notification } = App.useApp()
  const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null]>([
    dayjs().add(-7, 'days'),
    dayjs()
  ])

  const [selectingDate, setSelectingDate] = useState<'start' | 'end'>('start')

  /**
   * 保存选择
   */
  const onSave = () => {
    if (!dateRange[0] || !dateRange[1]) {
      notification.warning({
        message: '消息提示',
        description: '请选择完整的日期范围'
      })
      return
    }
    if (save) {
      save({
        dateStart: dayjs(dateRange[0]).format('YYYY-MM-DD'),
        dateEnd: dayjs(dateRange[1]).format('YYYY-MM-DD')
      })
    }
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

  return (
    <div
      className="date-selector-container-inline"
      style={{ display: visible ? 'block' : 'none' }}
    >
      <div className="date-selector-header">
        <h2>选择时间范围</h2>
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
      <div className="date-selector-content">
        <div className="date-range-section">
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

export default DateSelector