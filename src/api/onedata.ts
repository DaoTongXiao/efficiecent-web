import axios from 'axios'
import { getAuthToken } from '@/utils/auth'

const api = axios.create({
  baseURL: '/datasetapi'
})

/**
 * 创建数据集
 * @param params
 * @returns {Promise<unknown>}
 */
export const createDataset = async (params: unknown) => {
  const res = await api.post('/v1/dataSet', params, {
    headers: {
      Authorization: getAuthToken()
    }
  })
  return res.data
}


export interface OneDataApiResponse {
  msg: string;
  traceId: string;
  code: number;
  permissions: string[];
  roles: string[];
  user: OneDataUser;
}

export interface OneDataUser {
  createBy: string | null;
  createTime: string | null;
  updateBy: string | null;
  updateTime: string | null;
  userId: number;
  leaderId: number | null;
  teachManager: string | null;
  subCompanyCode: string | null;
  subCompanyName: string | null;
  grade: string | null;
  positionCode: string | null;
  positionName: string | null;
  workingLocation: string | null;
  deptId: number;
  userName: string;
  nickName: string;
  email: string;
  phonenumber: string;
  sex: string;
  avatar: string;
  salt: string | null;
  status: string;
  delFlag: string;
  loginIp: string;
  loginDate: string | null;
  expireDate: string | null;
  dept: OneDataDept;
  roles: OneDataRole[];
  roleIds: number[] | null;
  postIds: number[] | null;
  companyCode: string;
  subCustomerCode: string;
  root: boolean;
  admin: boolean;
}

export interface OneDataDept {
  createBy: string | null;
  createTime: string | null;
  deptId: number;
  parentId: number;
  ancestors: string;
  deptCode: string;
  deptName: string;
  deptNameEn: string | null;
  orgLevel: string | null;
  orderNum: string;
  leaderId: number | null;
  leader: string | null;
  phone: string | null;
  email: string | null;
  status: string;
  delFlag: string | null;
  parentName: string | null;
  companyCode: string | null;
  subCustomerCode: string | null;
  children: OneDataDept[];
}

export interface OneDataRole {
  createBy: string | null;
  createTime: string | null;
  roleId: number;
  roleName: string;
  roleKey: string;
  roleSort: string;
  dataScope: string;
  roleType: string | null;
  dataAccessScope: string;
  menuCheckStrictly: boolean;
  deptCheckStrictly: boolean;
  status: string;
  delFlag: string | null;
  flag: boolean;
  menuIds: number[] | null;
  deptIds: number[] | null;
  companyCode: string | null;
  admin: boolean;
}
