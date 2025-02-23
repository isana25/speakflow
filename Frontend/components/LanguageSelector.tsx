'use client';
import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Globe } from 'lucide-react';

const languages = {
  English: 'en-US',
  French: 'fr-FR',
  Spanish: 'es-ES',
  German: 'de-DE',
  Italian: 'it-IT',
  Portuguese: 'pt-PT',
  // Add more languages as needed
};

const LanguageSelector = ({ onLanguageChange }: { onLanguageChange: (languageCode: string) => void }) => {
  const [selectedLanguage, setSelectedLanguage] = useState<string>('en-US'); // Default to English
  
  const handleLanguageChange = (languageCode: string) => {
    setSelectedLanguage(languageCode);
    onLanguageChange(languageCode); // Pass the selected language to the parent component
    console.log('Selected Language:', languageCode);
  };

  return (
    <DropdownMenu>
      <div className="flex items-center">
        <DropdownMenuTrigger className="cursor-pointer rounded-2xl bg-[#19232d] px-4 py-2 hover:bg-[#4c535b]">
          <Globe size={20} className="text-white" />
        </DropdownMenuTrigger>
      </div>
      <DropdownMenuContent className="border-dark-1 bg-dark-1 text-white">
        {Object.entries(languages).map(([language, code]) => (
          <div key={code}>
            <DropdownMenuItem
              onClick={() => handleLanguageChange(code)}
              className={selectedLanguage === code ? 'bg-green-500' : ''} // Green background for selected language
            >
              {language}
            </DropdownMenuItem>
            <DropdownMenuSeparator className="border-dark-1" />
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSelector;
