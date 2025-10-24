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
