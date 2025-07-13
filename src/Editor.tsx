import React, { useState, useCallback, FC, useEffect } from 'react'
import { Puck, Render, type Data } from '@measured/puck'
import '@measured/puck/puck.css'
import { renderToStaticMarkup } from 'react-dom/server'

import { config } from './puck.config'
import type { EmailData } from './puck.config'
import TabsSwitcher from './TabsSwitcher'

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
        onClick={e => e.stopPropagation()}
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
            onChange={e => setRecipient(e.target.value)}
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

const Editor: FC = () => {
  const [data, setData] = useState<Partial<Data<EmailData>>>({})
  const [html, setHtml] = useState('')
  const [isModalOpen, setModalOpen] = useState(false)
  const [sending, setSending] = useState(false)
  const [sendResult, setSendResult] = useState('')
  const [sideTab, setSideTab] = useState<'components' | 'outline'>('components')

  // Управляем отображением вкладок Puck через CSS-in-JS
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
      {/* Вкладки фиксированно у левого края! */}
      <TabsSwitcher sideTab={sideTab} setSideTab={setSideTab} />
      <style>{`
        [data-rfd-droppable-id^="component-list:"] {
          display: grid !important;
          grid-template-columns: 1fr 1fr !important;
          gap: 12px !important;
          margin-top: 12px !important;
          align-items: stretch !important;
        }
        [data-rfd-draggable-id^="component-list:"] {
          background: #fff !important;
          border-radius: 12px !important;
          box-shadow: 0 1px 4px rgba(30,50,100,0.08) !important;
          aspect-ratio: 1 / 1 !important;
          min-width: 0 !important;
          width: 100% !important;
          height: auto !important;
          padding: 0 !important;
          margin: 0 !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          font-size: 15px !important;
          cursor: grab;
          transition: box-shadow 0.18s;
        }
        [data-rfd-draggable-id^="component-list:"]:hover {
          box-shadow: 0 4px 12px rgba(30,50,100,0.14) !important;
        }
        /* Внутри draggable блока - верстка по колонке, все по центру */
        [data-rfd-draggable-id^="component-list:"] {
          display: flex !important;
          flex-direction: column !important;
          align-items: center !important;
          justify-content: flex-start !important;
          padding: 18px 6px 10px 6px !important;
          gap: 6px !important;
        }

        /* Иконка - svg или img, берем первый потомок если надо */
        [data-rfd-draggable-id^="component-list:"] svg,
        [data-rfd-draggable-id^="component-list:"] img {
          display: block;
          margin-bottom: 8px;
          width: 32px;
          height: 32px;
          object-fit: contain;
          color: #283042;
          opacity: 0.9;
        }

        /* Название */
        [data-rfd-draggable-id^="component-list:"] span,
        [data-rfd-draggable-id^="component-list:"] .DrawerItem-label {
          font-size: 16px !important;
          color: #3d4352;
          text-align: center;
          font-weight: 500;
          margin-bottom: 7px !important;
        }

        /* Точечки (drag handle) - ищем div с aria-label, можно уточнить селектор если надо */
        [data-rfd-draggable-id^="component-list:"] [aria-label*="Перетащить"],
        [data-rfd-draggable-id^="component-list:"] [aria-label*="drag"] {
          margin-top: auto !important;
          display: flex !important;
          justify-content: center !important;
          opacity: 0.5;
          margin-bottom: 2px;
        }

      `}</style>

      <div
        style={{
          display: 'flex',
          minHeight: '80vh',
          background: '#fafcff',
        }}
      >
        {/* Левая панель — без вкладок! */}
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
          {/* Только Puck */}
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
        {/* Правая часть — workspace */}
        <div style={{ flex: 1, background: '#fff' }} />
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

export default Editor
