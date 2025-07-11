// src/puck.config.tsx — GUI-конфиг для Puck
import type { Config } from '@measured/puck'
import { DropZone } from '@measured/puck'
import '@measured/puck/puck.css'
import { components } from './puck.components'

// Экспортируем тип интерфейса данных
export interface EmailData {
  TextBlock: { children: string }
  ImageBlock: { src: string; alt?: string }
  ButtonBlock: { text: string; url: string }
  DividerBlock: Record<string, never>
}

// Конфиг Puck для браузера
export const config: Config<EmailData> = {
  root: {
    fields: {},
    render: () => (
      <div style={{ border: '1px dashed #bbb', padding: 8 }}>
        <DropZone zone="root" style={{ display: 'block', minHeight: 200, width: 600 }} />
      </div>
    ),
  },
  components,
}
