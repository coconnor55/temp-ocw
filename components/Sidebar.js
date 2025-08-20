import { useState } from 'react';
import { Disclosure } from '@headlessui/react';
import SectionDialog from './SectionDialog';

export default function Sidebar({ checkmarks, onSectionClick, onDialogClose, appType }) {
  const [activeSection, setActiveSection] = useState(null);

  // Define lists based on application type
  const sections = appType === 'provisional'
    ? ['Title', 'Background', 'Summary of the Invention', 'Detailed Description'] // Provisional list
    : [
        'Title',
        'Cross-Reference to Related Applications',
        'Background',
        'Summary of the Invention',
        'Brief Description of the Drawings',
        'Detailed Description of the Invention',
        'Claims',
        'Abstract'
      ]; // Non-provisional list

  return (
    <div>
      <h2 style={{ textAlign: 'center', marginBottom: '10px' }}>
        {appType === 'provisional' ? 'Provisional' : 'Non-Provisional'} Patent Sections
      </h2>
      <ul style={{ listStyle: 'none', padding: '10px' }}>
        {sections.map((section) => (
          <li
            key={section}
            onClick={() => {
              setActiveSection(section);
              onSectionClick(section);
            }}
            style={{ cursor: 'pointer', marginBottom: '10px', display: 'flex', alignItems: 'center' }}
          >
            {checkmarks[section] ? '✅' : '⬜'} {section}
          </li>
        ))}
      </ul>
      {activeSection && (
        <SectionDialog
          section={activeSection}
          onClose={(content) => {
            onDialogClose(activeSection, content);
            setActiveSection(null);
          }}
        />
      )}
    </div>
  );
}
