import Layout from '../components/Layout';
import { useState } from 'react';

export default function Dashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const applications = [
    { id: 1, title: 'Smart Lock System', description: 'A revolutionary lock with AI...', status: '50%' },
    { id: 2, title: 'Eco-Friendly Packaging', description: 'Sustainable materials for...', status: '75%' },
  ];

  const filteredApps = applications.filter(app =>
    app.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            onClick={() => window.location.href = '/editor'}
            style={{ padding: '8px 16px', background: '#0070f3', color: 'white', border: 'none', cursor: 'pointer' }}
          >
            Add New
          </button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}> {/* Vertical stack */}
          {filteredApps.map(app => (
            <div
              key={app.id}
              style={{
                width: '300px', /* Thinner width */
                height: '200px', /* Longer height */
                background: '#f0f0f0',
                padding: '10px',
                borderRadius: '5px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <h3>{app.title}</h3>
              <p>{app.description.substring(0, 50)}...</p>
              <p>Status: {app.status}</p>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
