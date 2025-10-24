import { jumpToBi, jumpToYms } from '@guwave/utils'
import { createDataset } from '@/api/onedata'

type Conditions = {
  deviceId: string;
  dateStart: string;
  dateEnd: string;
  product?: string;
  lotIds?: string[];
  waferIds?: string[];
};

type JumpLinkProps = {
  label: string;
  type: 'BI' | 'YMS';
  params: Conditions;
};

export const JumpLink: React.FC<JumpLinkProps> = ({ label, type, params }: JumpLinkProps) => {

  const onClick = async () => {
    switch (type) {
      case 'YMS': {
        //  组装跳转入参结构
        const jumpParams = {
          path: '/dashboard/cp',
          query: {
            product: params?.product,
            deviceId: [params.deviceId],
            lotId: params.lotIds,
            waferId: params.waferIds,
            timeType: 'startTime',
            dateRange: [params.dateStart, params.dateEnd],
            dateType: ''
          },
          options: { tagName: 'yms看板', baseUrl: '/yms/#' }
        }
        // console.log('params', params)
        //  执行跳转方法
        jumpToYms(jumpParams)
        break
      }
      case 'BI': {
        //  创建数据集
        const paramList = [
          {
            name: 'DEVICE_ID',
            operator: 'EQUAL',
            value: params.deviceId
          },
          {
            name: 'LOT_ID',
            operator: 'IN',
            values: params.lotIds
          }
        ]
        if (Array.isArray(params.waferIds) && params.waferIds.length) {
          paramList.push({
            name: 'WAFER_ID',
            operator: 'IN',
            values: params.waferIds
          })
        }

        const config = {
          fromType: 'SYSTEM',
          name: 'ai' + Date.now(),
          config: {
            testAreas: ['CP'],
            dataType: 'testRawData',
            uploadTypes: ['AUTO'],
            extraFilters: [
              {
                operator: 'AND',
                children: paramList
              }
            ]
          }
        }

        const res = await createDataset(config)

        //  组装跳转入参结构
        const jumpParams = {
          path: 'DataManage/Analysis/Edit/',
          query: {
            datasetId: res.data.datasetId
          },
          options: { tagName: '图表分析', baseUrl: '/onedata/' }
        }
        // 执行跳转方法;
        jumpToBi(jumpParams)
        break
      }
    }
  }
  return (
    <div onClick={onClick} style={{ textDecoration: 'underline', cursor: 'pointer', color: 'blue' }}>
      {label}
    </div>
  )
}