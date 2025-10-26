
import React, { useState, useCallback, useEffect } from 'react';
import Login from './views/Login';
import AdminDashboard from './views/AdminDashboard';
import UserDashboard from './views/UserDashboard';
import Spinner from './components/Spinner';
import { Role, Key, HistoryLog, Settings, Server } from './types';

const App: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [keys, setKeys] = useState<Key[]>([]);
  const [historyLog, setHistoryLog] = useState<HistoryLog[]>([]);
  const [settings, setSettings] = useState<Settings>({ botToken: '', chatId: '' });
  const [servers, setServers] = useState<Server[]>([]);

  const [auth, setAuth] = useState<{
    isAuthenticated: boolean;
    role: Role | null;
    key: string | null;
  }>({
    isAuthenticated: false,
    role: null,
    key: null,
  });

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [keysRes, historyRes, settingsRes, serversRes] = await Promise.all([
        fetch('/api/keys'),
        fetch('/api/history'),
        fetch('/api/settings'),
        fetch('/api/servers'),
      ]);

      if (!keysRes.ok || !historyRes.ok || !settingsRes.ok || !serversRes.ok) {
        throw new Error('Failed to fetch initial application data.');
      }
      
      const keysData = await keysRes.json();
      const historyData = await historyRes.json();
      const settingsData = await settingsRes.json();
      const serversData = await serversRes.json();

      setKeys(keysData);
      setHistoryLog(historyData);
      setSettings(settingsData);
      setServers(serversData);

    } catch (e) {
      setError(e instanceof Error ? e.message : 'An unknown error occurred.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleLogin = useCallback((keyData: Key) => {
    setAuth({ isAuthenticated: true, role: keyData.role, key: keyData.value });
  }, []);

  const handleLogout = useCallback(() => {
    setAuth({ isAuthenticated: false, role: null, key: null });
  }, []);

  // --- API Handlers ---

  const handleAddKey = async (key: Omit<Key, 'id'>) => {
    const response = await fetch('/api/keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(key)
    });
    const newKey = await response.json();
    setKeys(prev => [...prev, newKey]);
  };

  const handleDeleteKey = async (id: string) => {
    await fetch(`/api/keys?id=${id}`, { method: 'DELETE' });
    setKeys(prev => prev.filter(k => k.id !== id));
  };
  
  const handleUpdateKey = async (key: Key) => {
    // Note: Vercel serverless functions don't easily support PUT/PATCH with query params.
    // A more robust API would have /api/keys/[id]. For now, we'll delete and re-add.
    await handleDeleteKey(key.id);
    const { id, ...keyData } = key;
    await handleAddKey(keyData);
  }

  const handleAddServer = async (server: Omit<Server, 'id'>) => {
    const response = await fetch('/api/servers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(server)
    });
    const newServer = await response.json();
    setServers(prev => [...prev, newServer]);
  };

  const handleDeleteServer = async (id: string) => {
    await fetch(`/api/servers?id=${id}`, { method: 'DELETE' });
    setServers(prev => prev.filter(s => s.id !== id));
  };
  
  const handleAddHistoryLog = async (log: Omit<HistoryLog, 'id'>) => {
     const response = await fetch('/api/history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(log)
    });
    const newLog = await response.json();
    setHistoryLog(prev => [newLog, ...prev]);
  };

  const handleClearHistory = async () => {
      await fetch('/api/history', { method: 'DELETE' });
      setHistoryLog([]);
  };

  const handleSaveSettings = async (newSettings: Settings) => {
    await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newSettings)
    });
    setSettings(newSettings);
  };
  
  const renderContent = () => {
    if (loading) {
      return <Spinner />;
    }
    if (error) {
        return <div className="text-center text-red-400">
            <h2 className="text-xl font-semibold">Error</h2>
            <p>{error}</p>
            <button onClick={fetchData} className="mt-4 px-4 py-2 bg-violet-600 rounded-md hover:bg-violet-700">Try Again</button>
        </div>
    }

    if (!auth.isAuthenticated) {
      return <Login onLogin={handleLogin} />;
    }

    if (auth.role === Role.ADMIN || auth.role === Role.CREATOR || auth.role === Role.DEVELOPER) {
      return <AdminDashboard 
        onLogout={handleLogout} 
        keys={keys} 
        onAddKey={handleAddKey}
        onDeleteKey={handleDeleteKey}
        onUpdateKey={handleUpdateKey}
        currentRole={auth.role} 
        currentKey={auth.key} 
        historyLog={historyLog} 
        onAddHistoryLog={handleAddHistoryLog}
        onClearHistory={handleClearHistory}
        settings={settings} 
        onSaveSettings={handleSaveSettings}
        servers={servers} 
        onAddServer={handleAddServer}
        onDeleteServer={handleDeleteServer}
      />;
    }

    if (auth.role === Role.USER) {
      return <UserDashboard onLogout={handleLogout} botToken={settings.botToken} chatId={settings.chatId} servers={servers} />;
    }
    
    return <Login onLogin={handleLogin}/>;
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
