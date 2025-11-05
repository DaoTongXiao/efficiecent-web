import React from 'react'

type SearchResult = {
  title: string
  link: string
  snippet: string
  source: string
  published_date: string | null
}

type Props = {
  data: SearchResult[]
}

export const SearchResults: React.FC<Props> = ({ data }) => {
  if (!Array.isArray(data) || data.length === 0) {
    return <p>无搜索结果</p>
  }

  return (
    <div style={{ padding: '10px' }}>
      <h3>搜索结果</h3>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {data.map((item, index) => (
          <li key={index} style={{ marginBottom: '15px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
            <a
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: 'none', color: '#007bff', fontWeight: 'bold' }}
            >
              {item.title}
            </a>
            <p style={{ margin: '5px 0', color: '#666' }}>{item.snippet}</p>
            <small style={{ color: '#999' }}>
              来源: {item.source}
              {item.published_date && ` | 发布日期: ${item.published_date}`}
            </small>
          </li>
        ))}
      </ul>
    </div>
  )
}