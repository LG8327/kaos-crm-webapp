'use client'

import { useEffect, useState } from 'react'

export default function LocalStorageDebug() {
  const [storage, setStorage] = useState<any>({})
  
  useEffect(() => {
    const checkStorage = () => {
      const data: any = {}
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key) {
          try {
            data[key] = JSON.parse(localStorage.getItem(key) || '')
          } catch {
            data[key] = localStorage.getItem(key)
          }
        }
      }
      setStorage(data)
    }
    
    checkStorage()
    const interval = setInterval(checkStorage, 1000)
    return () => clearInterval(interval)
  }, [])

  const clearStorage = () => {
    localStorage.clear()
    setStorage({})
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: '10px',
      right: '10px',
      backgroundColor: '#1a1a1a',
      border: '1px solid #333',
      borderRadius: '8px',
      padding: '12px',
      maxWidth: '300px',
      maxHeight: '200px',
      overflow: 'auto',
      fontSize: '12px',
      color: '#fff',
      zIndex: 10000
    }}>
      <div style={{ marginBottom: '8px', fontWeight: 'bold' }}>
        LocalStorage Debug
        <button 
          onClick={clearStorage}
          style={{
            marginLeft: '8px',
            padding: '2px 6px',
            fontSize: '10px',
            backgroundColor: '#dc2626',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Clear
        </button>
      </div>
      <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
        {JSON.stringify(storage, null, 2)}
      </pre>
    </div>
  )
}
