/* eslint-disable no-unused-vars */
import { PromptState } from '../types/typing'

export enum RoleEnum {
  USER = 'user',
  AI = 'ai'
}

export enum TypeEnum {
  ProductStatus = 'productStatus',
  BatchOverview = 'batchOverview',
  WaferMapConfig = 'waferMapConfig',
  DailyReport = 'dailyReport'
}



export const DefaultState: PromptState = {
  prompt: '',
  attachment: '',
  deviceId: '',
  dateStart: '',
  dateEnd: ''
}
