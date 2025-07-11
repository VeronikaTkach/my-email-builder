// src/puck.server.config.ts
import * as React from 'react'
import type { Config } from '@measured/puck'
import { components } from './puck.components'
import type { EmailData } from './puck.config'

export const serverConfig: Config<EmailData> = {
  // Простейший корень, который только прокидывает детей
  root: {
    fields: {},
    render: ({ children }) =>
      // Оборачиваем в React.Fragment, не используя JSX
      React.createElement(React.Fragment, null, children),
  },

  // Ваши блоки
  components,
}
