
import React, { useState, useCallback } from 'react';
import Login from './views/Login';
import AdminDashboard from './views/AdminDashboard';
import UserDashboard from './views/UserDashboard';
import { Role, Key, HistoryLog, Settings, Server } from './types';

const App: React.FC = () => {
  const [keys, setKeys] = useState<Key[]>([
    { id: 'admin-initial', value: 'Gxyenn969', role: Role.DEVELOPER, username: 'Gxyenn 正式' },
  ]);

  const [historyLog, setHistoryLog] = useState<HistoryLog[]>([]);

  const [settings, setSettings] = useState<Settings>({
    botToken: '8497754611:AAFh5HmKMNsa5wJtCMO2l1YEdV4_PkEFsFg',
    chatId: '7197301814',
    mongoURI: 'mongodb+srv://gxyennvelybug:Gxyenn969@cluster0.ixqwvz1.mongodb.net/?appName=Cluster0',
  });

  const [servers, setServers] = useState<Server[]>([
    { id: '1', serverName: 'Server 1', commandFormat: '/test1 ${target}' },
    { id: '2', serverName: 'Server 2', commandFormat: '/bug ${target}' },
  ]);

  const [auth, setAuth] = useState<{
    isAuthenticated: boolean;
    role: Role | null;
    key: string | null;
  }>({
    isAuthenticated: false,
    role: null,
    key: null,
  });

  const handleLogin = useCallback((key: string) => {
    const foundKey = keys.find(k => k.value === key);
    if (foundKey) {
      setAuth({ isAuthenticated: true, role: foundKey.role, key: foundKey.value });
    }
  }, [keys]);
  
  const findRole = (key: string): Role | null => {
    const foundKey = keys.find(k => k.value === key);
    return foundKey ? foundKey.role : null;
  };

  const handleLogout = useCallback(() => {
    setAuth({ isAuthenticated: false, role: null, key: null });
  }, []);

  const renderContent = () => {
    if (!auth.isAuthenticated) {
      return <Login onLogin={handleLogin} keys={keys} />;
    }

    if (auth.role === Role.ADMIN || auth.role === Role.CREATOR || auth.role === Role.DEVELOPER) {
      return <AdminDashboard onLogout={handleLogout} keys={keys} setKeys={setKeys} currentRole={auth.role} currentKey={auth.key} historyLog={historyLog} setHistoryLog={setHistoryLog} settings={settings} setSettings={setSettings} servers={servers} setServers={setServers} />;
    }

    if (auth.role === Role.USER) {
      return <UserDashboard onLogout={handleLogout} botToken={settings.botToken} chatId={settings.chatId} servers={servers} />;
    }
    
    return <Login onLogin={handleLogin} keys={keys}/>;
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4">
      {renderContent()}
       <footer className="fixed bottom-4 left-1/2 -translate-x-1/2">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-900/60 border border-gray-700 rounded-full text-gray-400 text-xs">
              Gxyenn 正式
          </div>
      </footer>
    </div>
  );
};

export default App;