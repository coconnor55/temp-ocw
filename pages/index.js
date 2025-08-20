import Layout from '../components/Layout';
import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';
import Modal from 'react-modal';
import Auth from '../components/Auth';

export default function Dashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [applications, setApplications] = useState([]);
  const [user, setUser] = useState(null);
  const [isNewAppModalOpen, setIsNewAppModalOpen] = useState(false);
  const [appType, setAppType] = useState('provisional');
  const [showAuth, setShowAuth] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user);
    };
    getUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user);
    });
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (user) {
      const fetchApplications = async () => {
        const { data, error } = await supabase
          .from('applications')
          .select('*')
          .order('modified_at', { ascending: true });
        if (error) console.error('Fetch error:', error);
        else setApplications(data || []);
      };
      fetchApplications();
    }
  }, [user]);

  const filteredApps = applications.filter(app =>
    app.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddNew = () => {
    if (!user) {
      setShowAuth(true);
    } else {
      setIsNewAppModalOpen(true);
    }
  };

  const handleStartNew = async () => {
    if (user) {
      setError(null); // Clear previous errors
      const { error } = await supabase.from('applications').insert({
        title: 'New Application',
        description: '',
        status: '0%',
        modified_at: new Date().toISOString(),
        user_id: user.id,
        type: appType,
      });
      if (error) {
        console.error('Insert error:', error);
        setError(`Failed to create application: ${error.message}`);
      } else {
        setIsNewAppModalOpen(false);
        window.location.href = '/editor'; // Redirect to editor
      }
    }
  };

  const handleAuthSuccess = (u) => {
    setUser(u);
    setShowAuth(false);
    setIsNewAppModalOpen(true); // Open new app modal after login
  };

  return (
    <Layout>
      <div style={{ padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
          <input
            type="text"
            placeholder="Search Applications..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ padding: '8px', flexGrow: 1, marginRight: '10px' }}
          />
          <button
            onClick={handleAddNew}
            style={{ padding: '8px 16px', background: '#0070f3', color: 'white', border: 'none', cursor: 'pointer' }}
          >
            Add New
          </button>
        </div>
        <Modal
          isOpen={isNewAppModalOpen}
          onRequestClose={() => setIsNewAppModalOpen(false)}
          style={{
            content: {
              top: '50%',
              left: '50%',
              right: 'auto',
              bottom: 'auto',
              marginRight: '-50%',
              transform: 'translate(-50%, -50%)',
              width: '400px',
              height: '200px',
              padding: '20px',
            },
          }}
        >
          <h2>New Application</h2>
          <select value={appType} onChange={(e) => setAppType(e.target.value)}>
            <option value="provisional">Provisional</option>
            <option value="non-provisional">Non-Provisional</option>
          </select>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <button onClick={handleStartNew}>Start</button>
          <button onClick={() => setIsNewAppModalOpen(false)}>Cancel</button>
        </Modal>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {user && filteredApps.map(app => (
            <div
              key={app.id}
              style={{
                width: '300px',
                height: '133px',
                background: '#f0f0f0',
                padding: '10px',
                borderRadius: '5px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                textAlign: 'left',
              }}
            >
              <h3>{app.title}</h3>
              <p>{app.description.substring(0, 50)}...</p>
              <p>Status: {app.status || '0%'}</p>
            </div>
          ))}
          <div
            style={{
              width: '300px',
              height: '133px',
              background: '#f0f0f0',
              padding: '10px',
              borderRadius: '5px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'flex-start',
              textAlign: 'left',
            }}
          >
            <h3>Write Your Next Application</h3>
            <p>Click on Add New above.</p>
          </div>
        </div>
      </div>
      {showAuth && <Auth onAuthSuccess={handleAuthSuccess} />}
    </Layout>
  );
}
