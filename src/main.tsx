import { createRoot } from 'react-dom/client'
import 'normalize.css'

import App from './App'


const Root: React.FC = () => {
  return (
      <App />
  )
}
createRoot(document.getElementById('root')!).render(<Root />)
