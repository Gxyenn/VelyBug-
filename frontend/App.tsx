
import React, { useState, useCallback, useEffect } from 'react';
import { apiLogin } from './src/api';
import Login from './views/Login';
import AdminDashboard from './views/AdminDashboard';
import UserDashboard from './views/UserDashboard';
import { Role, Key, HistoryLog, Settings, Server } from './types';

const App: React.FC = () => {
  const [keys, setKeys] = useState<Key[]>([]);

  const [historyLog, setHistoryLog] = useState<HistoryLog[]>([]);

  const [settings, setSettings] = useState<Settings>({ botToken: '', chatId: '', mongoURI: '' });

  const [servers, setServers] = useState<Server[]>([
    { id: '1', serverName: 'Server 1', commandFormat: '/test1 ${target}' },
    { id: '2', serverName: 'Server 2', commandFormat: '/bug ${target}' },
  ]);

  useEffect(() => {
    const saved = localStorage.getItem('vely_key');
    if (saved) {
      // attempt to login with saved key to populate data from backend
      apiLogin(saved).then((res) => {
        try {
          setKeys(res.data.keys || []);
          setServers(res.data.servers || []);
          setSettings(res.data.settings || { botToken: '', chatId: '', mongoURI: '' });
          setHistoryLog(res.data.history || []);
          setAuth({ isAuthenticated: true, role: res.role, key: res.key, username: res.username });
        } catch (e) { console.error(e); }
      }).catch(err => {
        console.warn('Auto-login failed', err);
        localStorage.removeItem('vely_key');
      });
    }
  }, []);

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