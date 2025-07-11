export const components = {
  TextBlock: {
    label: 'Текстовый блок',
    fields: { children: { type: 'text' } },
    defaultProps: { children: 'Новый текстовый блок' },
    render: ({ children }: { children: string }) => (
      <p style={{ margin: 0, color: '#333', lineHeight: 1.4 }}>{children}</p>
    ),
  },

  ImageBlock: {
    label: 'Изображение',
    fields: { src: { type: 'text' }, alt: { type: 'text' } },
    defaultProps: {
      src: 'https://via.placeholder.com/600x200',
      alt: 'Placeholder',
    },
    render: ({ src, alt }: { src: string; alt?: string }) => (
      <img
        src={src}
        alt={alt}
        style={{ display: 'block', width: '100%', height: 'auto', margin: 8 }}
      />
    ),
  },

  ButtonBlock: {
    label: 'Кнопка',
    fields: { text: { type: 'text' }, url: { type: 'text' } },
    defaultProps: { text: 'Нажми меня', url: '#' },
    render: ({ text, url }: { text: string; url: string }) => (
      <table
        role="presentation"
        border={0}
        cellPadding={0}
        cellSpacing={0}
        style={{ margin: '16px 0', width: '100%' }}
      >
        <tbody>
          <tr>
            <td align="center">
              <table
                role="presentation"
                border={0}
                cellPadding={0}
                cellSpacing={0}
                style={{ borderRadius: 4, backgroundColor: '#005FCC' }}
              >
                <tbody>
                  <tr>
                    <td
                      align="center"
                      style={{
                        padding: '12px 24px',
                        fontSize: 16,
                        color: '#fff',
                        fontWeight: 'bold',
                      }}
                    >
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          color: '#fff',
                          textDecoration: 'none',
                          display: 'inline-block',
                        }}
                      >
                        {text}
                      </a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
    ),
  },

  DividerBlock: {
    label: 'Разделитель',
    fields: {},
    defaultProps: {},
    render: () => <hr style={{ borderColor: '#ddd', margin: '16px 0' }} />,
  },
} as const
