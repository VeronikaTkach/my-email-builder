import React, { useState, useCallback, FC, useEffect, useRef } from 'react'
import { Puck, Render, type Data } from '@measured/puck'
import '@measured/puck/puck.css'
import { renderToStaticMarkup } from 'react-dom/server'

import { config } from './puck.config'
import type { EmailData } from './puck.config'

interface HtmlModalProps {
  html: string
  onClose: () => void
  onSend: (to: string, html: string) => void
  sending: boolean
  sendResult: string
}

const HtmlModal: FC<HtmlModalProps> = ({
  html,
  onClose,
  onSend,
  sending,
  sendResult,
}) => {
  const [recipient, setRecipient] = useState('')

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#fff',
          padding: 16,
          width: '80%',
          height: '80%',
          overflow: 'auto',
          borderRadius: 8,
        }}
      >
        <h2>Сгенерированный HTML</h2>
        <textarea
          readOnly
          value={html}
          style={{
            width: '100%',
            height: '50%',
            fontFamily: 'monospace',
            fontSize: 12,
            marginTop: 8,
          }}
        />
        <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
          <input
            type="email"
            placeholder="Email получателя"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            style={{ flex: 1, padding: 6 }}
          />
          <button
            onClick={() => onSend(recipient, html)}
            disabled={sending || !recipient}
            style={{
              padding: '6px 12px',
              background: '#28a745',
              color: '#fff',
              border: 'none',
              borderRadius: 4,
              cursor: sending || !recipient ? 'default' : 'pointer',
              opacity: sending || !recipient ? 0.6 : 1,
            }}
          >
            {sending ? 'Отправка…' : 'Отправить'}
          </button>
        </div>
        {sendResult && (
          <p style={{ marginTop: 12, color: sending ? '#000' : '#a00' }}>
            {sendResult}
          </p>
        )}
        <button
          onClick={onClose}
          style={{
            marginTop: 16,
            padding: '6px 12px',
            background: '#005FCC',
            color: '#fff',
            border: 'none',
            borderRadius: 4,
            cursor: 'pointer',
          }}
        >
          Закрыть
        </button>
      </div>
    </div>
  )
}

export default function Editor() {
  const [data, setData] = useState<Partial<Data<EmailData>>>(() => ({} as any))
  const [html, setHtml] = useState('')
  const [isModalOpen, setModalOpen] = useState(false)
  const [sending, setSending] = useState(false)
  const [sendResult, setSendResult] = useState('')
  const [sideTab, setSideTab] = useState<'components' | 'outline'>('components')

  // Ref для левой панели (ищем ее в DOM, чтобы вычислить позицию вкладок)
  const leftPanelRef = useRef<HTMLDivElement | null>(null)
  const [panelRect, setPanelRect] = useState<{top: number, left: number, width: number} | null>(null)

  // Находим левую панель после монтирования
  useEffect(() => {
    const id = setInterval(() => {
      const panel = document.querySelector('[class*="PuckLayout-leftSideBar"]') as HTMLDivElement
      if (panel) {
        leftPanelRef.current = panel
        const rect = panel.getBoundingClientRect()
        setPanelRect({ top: rect.top, left: rect.left, width: rect.width })
        clearInterval(id)
      }
    }, 200)
    return () => clearInterval(id)
  }, [])

  // Переключаем видимость верхних панелей (components/outline)
  useEffect(() => {
    const style = document.createElement('style')
    style.innerHTML = `
      [class*="PuckLayout-leftSideBar"] > div:nth-child(1) {
        display: ${sideTab === 'components' ? 'block' : 'none'} !important;
      }
      [class*="PuckLayout-leftSideBar"] > div:nth-child(2) {
        display: ${sideTab === 'outline' ? 'block' : 'none'} !important;
      }
    `
    document.head.appendChild(style)
    return () => {
      document.head.removeChild(style)
    }
  }, [sideTab])

  // Генерация HTML из Puck-данных
  const handleGetHtml = useCallback(() => {
    const fullData = data as Data<EmailData>
    const markup = renderToStaticMarkup(
      <Render config={config} data={fullData} />
    )
    setHtml(`<!DOCTYPE html>\n<html>\n<body>\n${markup}\n</body>\n</html>`)
    setModalOpen(true)
    setSendResult('')
  }, [data])

  // Отправка готового HTML на бэкенд
  const handleSend = useCallback(
    async (to: string, html: string) => {
      setSending(true)
      setSendResult('')
      try {
        const res = await fetch('/email/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ to, html }),
        })
        if (!res.ok) {
          const text = await res.text()
          throw new Error(text || res.statusText)
        }
        setSendResult('Письмо успешно отправлено!')
      } catch (err: any) {
        setSendResult('Ошибка: ' + err.message)
      } finally {
        setSending(false)
      }
    },
    []
  )

  return (
    <>
      <div
        style={{
          display: 'flex',
          minHeight: '80vh',
          background: '#fafcff'
        }}
      >
        {/* Левая колонка: вкладки + Puck */}
        <div
          style={{
            minWidth: 320,
            maxWidth: 380,
            width: 340,
            background: '#fafcff',
            borderRight: '1px solid #eaeaea',
            display: 'flex',
            flexDirection: 'column',
            height: '100vh',
          }}
        >
          {/* Вкладки */}
          <div
            style={{
              display: 'flex',
              borderBottom: '1px solid #eaeaea',
              background: '#f5f9ff',
              borderTopLeftRadius: 8,
              borderTopRightRadius: 8,
              overflow: 'hidden',
              minHeight: 48,
              zIndex: 2,
              position: 'relative',
            }}
          >
            <button
              onClick={() => setSideTab('components')}
              style={{
                flex: 1,
                padding: 10,
                background: sideTab === 'components' ? '#005FCC' : 'transparent',
                color: sideTab === 'components' ? '#fff' : '#222',
                border: 'none',
                borderBottom: sideTab === 'components'
                  ? '3px solid #005FCC'
                  : '3px solid transparent',
                cursor: 'pointer',
                fontWeight: sideTab === 'components' ? 600 : 400,
                transition: 'all 0.15s',
              }}
            >
              Компоненты
            </button>
            <button
              onClick={() => setSideTab('outline')}
              style={{
                flex: 1,
                padding: 10,
                background: sideTab === 'outline' ? '#005FCC' : 'transparent',
                color: sideTab === 'outline' ? '#fff' : '#222',
                border: 'none',
                borderBottom: sideTab === 'outline'
                  ? '3px solid #005FCC'
                  : '3px solid transparent',
                cursor: 'pointer',
                fontWeight: sideTab === 'outline' ? 600 : 400,
                transition: 'all 0.15s',
              }}
            >
              Структура
            </button>
          </div>

          {/* Сам редактор Puck, теперь под вкладками */}
          <div style={{ flex: 1, minHeight: 0 }}>
            <Puck
              config={config}
              data={data}
              onPublish={setData}
              overrides={{
                fields: ({ children }) => (
                  <>
                    {children}
                    <button
                      onClick={handleGetHtml}
                      style={{
                        display: 'block',
                        width: '100%',
                        marginTop: 16,
                        padding: '8px',
                        background: '#005FCC',
                        color: '#fff',
                        border: 'none',
                        borderRadius: 4,
                        cursor: 'pointer',
                      }}
                    >
                      Получить HTML
                    </button>
                  </>
                ),
              }}
            />
          </div>
        </div>
        {/* Правая часть — content */}
        <div style={{ flex: 1, background: '#fff' }}>

        </div>
      </div>

      {isModalOpen && (
        <HtmlModal
          html={html}
          onClose={() => setModalOpen(false)}
          onSend={handleSend}
          sending={sending}
          sendResult={sendResult}
        />
      )}
    </>
  )
}
