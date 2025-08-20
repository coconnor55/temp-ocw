'use client';
import Layout from '../components/Layout';
import { PanelGroup, Panel, PanelResizeHandle } from 'react-resizable-panels';
import Sidebar from '../components/Sidebar';
import { useState, useEffect } from 'react';
import debounce from 'lodash.debounce';
import { Disclosure } from '@headlessui/react';
import { supabase } from '../utils/supabase';
import Auth from '../components/Auth';
//import '../styles/editor.css';

export default function Editor() {
  const [mainContent, setMainContent] = useState('');
  const [insertedBoxes, setInsertedBoxes] = useState([]);
  const [checkmarks, setCheckmarks] = useState({});
  const [user, setUser] = useState(null);
  const [appType, setAppType] = useState('provisional'); // Default, update from Supabase

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

  // Fetch application data (assuming navigated from Dashboard with app ID)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const appId = params.get('id');
    if (user && appId) {
      const fetchApplication = async () => {
        const { data, error } = await supabase
          .from('applications')
          .select('type')
          .eq('id', appId)
          .eq('user_id', user.id)
          .single();
        if (error) console.error('Fetch error:', error);
        else setAppType(data.type);
      };
      fetchApplication();
    }
  }, [user]);

  const analyzeInput = debounce((text) => {
    const wordCount = text.split(' ').length;
    const baseCheckmarks = {
      Title: wordCount > 50,
      'Background': wordCount > 100,
      'Summary of the Invention': wordCount > 200,
      'Detailed Description': wordCount > 300,
    };
    if (appType === 'non-provisional') {
      Object.assign(baseCheckmarks, {
        'Cross-Reference to Related Applications': wordCount > 400,
        'Brief Description of the Drawings': wordCount > 500,
        'Claims': wordCount > 600,
        'Abstract': wordCount > 700,
      });
    }
    setCheckmarks(baseCheckmarks);
  }, 1000);

  useEffect(() => {
    analyzeInput(mainContent);
  }, [mainContent, appType]);

  const handleSectionClick = (section) => {
    // ...
  };

  const handleDialogClose = (section, content) => {
    if (content) {
      setInsertedBoxes((prev) => [...prev, { section, content }]);
      setMainContent((prev) => `${prev}\n\n[Inserted: ${section}]`);
    }
  };

  const handleSave = () => {
    const draft = { mainContent, insertedBoxes };
    localStorage.setItem('patentDraft', JSON.stringify(draft));
    alert('Draft saved locally!');
  };

  const handleExport = () => {
    const draft = { mainContent, insertedBoxes };
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(draft));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute('href', dataStr);
    downloadAnchorNode.setAttribute('download', 'patent_draft.json');
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  if (!user) {
    return <Auth onAuthSuccess={(u) => setUser(u)} />;
  }

  if (user.user_metadata?.tier !== 'paid' && appType === 'non-provisional') {
    console.log('Free tier limits applied: Non-provisional restricted');
    // Could redirect or disable features
  }

  return (
    <Layout>
      <PanelGroup direction="horizontal" style={{ height: 'calc(100vh - 90px)' }}>
        <Panel defaultSize={70} minSize={50} className="main-panel resizable-panel">
          <textarea
            style={{ width: '100%', height: '100%', padding: '10px' }}
            placeholder="Describe your invention..."
            value={mainContent}
            onChange={(e) => setMainContent(e.target.value)}
          />
          {insertedBoxes.map((box, idx) => (
            <Disclosure key={idx}>
              {({ open }) => (
                <>
                  <Disclosure.Button style={{ background: '#ffe', padding: '5px', margin: '5px 0', cursor: 'pointer' }}>
                    {box.section} {open ? '▼' : '▶'}
                  </Disclosure.Button>
                  <Disclosure.Panel style={{ padding: '10px', border: '1px solid #ccc' }}>{box.content}</Disclosure.Panel>
                </>
              )}
            </Disclosure>
          ))}
        </Panel>
        <PanelResizeHandle className="resize-handle" />
        <Panel defaultSize={30} minSize={20} className="sidebar-panel resizable-panel">
          <Sidebar checkmarks={checkmarks} onSectionClick={handleSectionClick} onDialogClose={handleDialogClose} appType={appType} />
        </Panel>
      </PanelGroup>
      <div style={{ position: 'fixed', bottom: '10px', right: '10px' }}>
        <button onClick={handleSave}>Save</button>
        <button onClick={handleExport}>Export</button>
      </div>
    </Layout>
  );
}
