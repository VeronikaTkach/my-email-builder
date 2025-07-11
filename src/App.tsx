import { Theme, presetGpnDefault } from '@consta/uikit/Theme';
import Editor from './Editor';

function App() {
  return (
    <Theme preset={presetGpnDefault}>
      <div className="p-4">
        <h1 className="text-xl mb-4">Email Builder</h1>
        <Editor />
      </div>
    </Theme>
  );
}

export default App;
