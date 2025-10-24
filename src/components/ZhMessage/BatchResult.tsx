import { Button } from 'antd'
import { JumpLink } from './JumpLink'
import { toAiAgentPage } from './utils'

type Conditions = {
  deviceId: string;
  dateStart: string;
  dateEnd: string;
  product?: string;
  lotIds?: string[];
  waferIds?: string[];
};

/**
 * 批次概览的定制结果展示
 */
type BatchResultProps = {
  body: unknown;
};

export const BatchResult: React.FC<BatchResultProps> = ({ body = {} }) => {
  const bodyObj = body as { conditions: Conditions; lotCount: number; waferCount: number; lotList: string[]}
  const { conditions, lotCount, waferCount, lotList = [] } = bodyObj
  return (
    <div>
      <span>
        产品{conditions?.deviceId} 在 {conditions.dateStart} 到 {conditions.dateEnd}时间范围内，共有Lot: {lotCount},
        Wafer {waferCount}
      </span>
      <JumpLink label="跳转YMS分析" type="YMS" params={conditions} />

      <p>各个批次的列表如下：(点击跳转BI分析)</p>
      {lotList.map((lot:string) => (
        <div style={{ display: 'flex', justifyContent: 'space-between', 'marginTop': '10px' }}>
          <JumpLink key={lot} label={lot} type="BI" params={{ ...conditions, lotIds: [lot], waferIds: [] }} />
          <Button type='primary' size='small' onClick={() =>toAiAgentPage(lot)}>AI分析</Button>
        </ div>
      ))}
    </div>
  )
}