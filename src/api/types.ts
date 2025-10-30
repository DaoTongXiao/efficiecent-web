export interface ApiResponse<T = string> {
  code: number
  msg: string
  data: T
}
export interface Report {
  id: number
  file_name: string | null
  dataset_id: string | null
  document_id: string | null
  report_time: string | null
  create_time: string | null
  additional_info: Record<string, unknown>
}

// 助手相关类型定义
export interface Assistant {
  id: number;
  name: string;
  description: string;
  prompt: string;
}

export interface AssistantRequest {
  name: string;
  description: string;
  prompt_text: string;
  created_by: string;
  updated_by: string;
}
