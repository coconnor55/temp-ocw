'use client';
import Layout from '../components/Layout';
import { PanelGroup, Panel } from 'react-resizable-panels';
import Sidebar from '../components/Sidebar';
import { useState, useEffect } from 'react';
import debounce from 'lodash.debounce';
import { Disclosure } from '@headlessui/react';
import { supabase } from '../utils/supabase'; // Ensure this path matches your project
import Auth from '../components/Auth'; // Assuming you created this

export default function Editor() {
  const [mainContent, setMainContent] = useState('');
  const [insertedBoxes, setInsertedBoxes] = useState([]);
  const [checkmarks, setCheckmarks] = useState({});
  const [user, setUser] = useState(null);

  // Auth check on mount
  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user);
    };
    getUser();

    // Subscribe to auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user);
    });
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Mock AI analysis
  const analyzeInput = debounce((text) => {
    const wordCount = text.split(' ').length;
    setCheckmarks({
      Title: wordCount > 50,
      'Cross-Reference to Related Applications': wordCount > 100,
      Background: wordCount > 200,
      'Summary of the Invention': wordCount > 300,
      'Brief Description of the Drawings': wordCount > 400,
      'Detailed Description of the Invention': wordCount > 500,
      Claims: wordCount > 600,
      Abstract: wordCount > 700,
    });
  }, 1000);

  useEffect(() => {
    analyzeInput(mainContent);
  }, [mainContent]);

  const handleSectionClick = (section) => {
    // Placeholder for section-specific logic
  };

  const handleDialogClose = (section, content) => {
    if (content) {
      setInsertedBoxes((prev) => [...prev, { section, content }]);
      setMainContent((prev) => `${prev}\n\n[Inserted: ${section}]`);
    }
  };

  // Show auth if no user, otherwise render editor
  if (!user) {
    return <Auth onAuthSuccess={(u) => setUser(u)} />;
  }

  // Simple tier check (expand with specific limits later)
  if (user.user_metadata?.tier !== 'paid') {
    // Example: Disable claims or add a warning
    // For now, just log or show a message
    console.log('Free tier limitations applied');
  }

  return (
    <Layout>
      <PanelGroup direction="horizontal" style={{ height: 'calc(100vh - 90px)' }}>
        <Panel defaultSize={70} minSize={50}>
          <textarea
            style={{ width: '100%', height: '50%', padding: '10px' }}
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
        <Panel defaultSize={30} minSize={20}>
          <Sidebar checkmarks={checkmarks} onSectionClick={handleSectionClick} onDialogClose={handleDialogClose} />
        </Panel>
      </PanelGroup>
    </Layout>
  );
}
