import React from 'react';

type Props = {
  sideTab: 'components' | 'outline';
  setSideTab: (tab: 'components' | 'outline') => void;
};

const TabsSwitcher: React.FC<Props> = ({ sideTab, setSideTab }) => (
  <div
    style={{
      position: 'fixed',
      top: 72,
      left: 2,
      zIndex: 2000,
      display: 'flex',
      background: '#f5f9ff',
      borderRadius: 8,
      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
      border: '1px solid #eaeaea',
      overflow: 'hidden',
      minHeight: 48,
      // minWidth: 320,
      // maxWidth: 420,
      width: 316,
    }}
  >
    <button
      onClick={() => setSideTab('components')}
      style={{
        flex: 1,
        padding: '12px 0',
        background: sideTab === 'components' ? '#005FCC' : 'transparent',
        color: sideTab === 'components' ? '#fff' : '#222',
        border: 'none',
        borderBottom: sideTab === 'components'
          ? '3px solid #005FCC'
          : '3px solid transparent',
        cursor: 'pointer',
        fontWeight: sideTab === 'components' ? 600 : 400,
        fontSize: 18,
        transition: 'all 0.15s',
      }}
    >
      Контент
    </button>
    <button
      onClick={() => setSideTab('outline')}
      style={{
        flex: 1,
        padding: '12px 0',
        background: sideTab === 'outline' ? '#005FCC' : 'transparent',
        color: sideTab === 'outline' ? '#fff' : '#222',
        border: 'none',
        borderBottom: sideTab === 'outline'
          ? '3px solid #005FCC'
          : '3px solid transparent',
        cursor: 'pointer',
        fontWeight: sideTab === 'outline' ? 600 : 400,
        fontSize: 18,
        transition: 'all 0.15s',
      }}
    >
      Модули
    </button>
  </div>
);

export default TabsSwitcher;
