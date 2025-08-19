import { useState } from 'react';
import { Disclosure } from '@headlessui/react'; // For accordion-style expansion if needed
import SectionDialog from './SectionDialog';

export default function Sidebar({ checkmarks, onSectionClick }) {
  const sections = [
    'Title',
    'Cross-Reference to Related Applications',
    'Background',
    'Summary of the Invention',
    'Brief Description of the Drawings',
    'Detailed Description of the Invention',
    'Claims',
    'Abstract'
  ];
  const [activeSection, setActiveSection] = useState(null);

  return (
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
      {activeSection && (
        <SectionDialog
          section={activeSection}
          onClose={() => setActiveSection(null)}
          // Pass AI dialog props here
        />
      )}
    </ul>
  );
}
