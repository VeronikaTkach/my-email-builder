import * as React from 'react'
import type { Config } from '@measured/puck'
import { components } from './puck.components'
import type { EmailData } from './puck.config'

export const serverConfig: Config<EmailData> = {
  root: {
    fields: {},
    render: ({ children }) =>
      React.createElement(React.Fragment, null, children),
  },

  components,
}
