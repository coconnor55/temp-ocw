'use client';
import Layout from '../components/Layout'; // Add this import
import { PanelGroup, Panel } from 'react-resizable-panels';
import Sidebar from '../components/Sidebar';
import { useState, useEffect } from 'react';
import debounce from 'lodash.debounce';
import { Disclosure } from '@headlessui/react';

export default function Editor() {
  const [mainContent, setMainContent] = useState('');
  const [insertedBoxes, setInsertedBoxes] = useState([]);
  const [checkmarks, setCheckmarks] = useState({});

  const analyzeInput = debounce((text) => {
    // Mock AI logic...
    const wordCount = text.split(' ').length;
    setCheckmarks({
      Title: wordCount > 50,
      'Cross-Reference to Related Applications': wordCount > 100,
      Background: wordCount > 200,
      // ...
    });
  }, 1000);

  useEffect(() => {
    analyzeInput(mainContent);
  }, [mainContent]);

  const handleSectionClick = (section) => {
    // ...
  };

  const handleDialogClose = (section, content) => {
    if (content) {
      setInsertedBoxes((prev) => [...prev, { section, content }]);
      setMainContent((prev) => `${prev}\n\n[Inserted: ${section}]`);
    }
  };

  return (
    <Layout> {/* Wrap here */}
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
