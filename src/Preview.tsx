// src/Preview.tsx — можно для отдельного превью
import React from 'react'
import { Render, type Data } from '@measured/puck'
import '@measured/puck/puck.css'

import { config } from './puck.config'
import type { EmailData } from './puck.config'

export default function Preview({ data }: { data: Data<EmailData> }) {
  return (
    <div className="prose mx-auto">
      <Render config={config} data={data} />
    </div>
  )
}
