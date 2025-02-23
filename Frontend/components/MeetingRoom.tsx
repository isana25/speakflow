'use client';
import { useState, useEffect } from 'react';
import {
  CallControls,
  CallParticipantsList,
  CallStatsButton,
  CallingState,
  PaginatedGridLayout,
  SpeakerLayout,
  useCallStateHooks,
  useCall,
} from '@stream-io/video-react-sdk';
import { useRouter, useSearchParams } from 'next/navigation';
import { Users, LayoutList, Mic } from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import Loader from './Loader';
import EndCallButton from './EndCallButton';
import { cn } from '@/lib/utils';
import { startSpeechRecognition } from '@/utils/speechToText';
import { useUser } from "@clerk/nextjs";
import LanguageSelector from './LanguageSelector';

// Define the custom event type for the transcription
type CustomEvent = {
  type: 'transcription';
  text: string;
  userId: string; // Add userId to the transcription event
};

type CallLayoutType = 'grid' | 'speaker-left' | 'speaker-right';

const MeetingRoom = () => {
  const searchParams = useSearchParams();
  const isPersonalRoom = !!searchParams.get('personal');
  const router = useRouter();
  const [layout, setLayout] = useState<CallLayoutType>('speaker-left');
  const [showParticipants, setShowParticipants] = useState(false);
  const { useCallCallingState } = useCallStateHooks();
  const callingState = useCallCallingState();
  const call = useCall(); // Get the current call instance
  
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const { user } = useUser();
  
  const [selectedLanguage, setSelectedLanguage] = useState<string>('en-US'); // State to track selected language
  
  const handleLanguageChange = (languageCode: string) => {
    setSelectedLanguage(languageCode); // Update language when the user selects a new language
  };

  // Function to call the translation API
  const translateText = async (text: string, targetLanguage: string) => {
    const response = await fetch('http://127.0.0.1:5000/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        target_language: targetLanguage, // Send target language to the API
      }),
    });

    if (!response.ok) {
      console.error('Failed to fetch translation');
      return text; // If translation fails, return the original text
    }

    const data = await response.json();
    console.log('Translated text:', data.translated_text);
    return data.translated_text; // Return translated text
  };

  useEffect(() => {
    let recognition: any;
    if (isListening) {
      console.log('Speech recognition started...');
      recognition = startSpeechRecognition(async (text) => {
        
        // Broadcast the transcript to all participants with the correct event type
        if (call) {
          const customEvent: CustomEvent = {
            type: 'transcription', // Correct event type
            text: text, // Transcribed text
            userId: user.id, // Include the user ID to identify the speaker
          };
          console.log('Sending transcript to other participants:', text); // Log sent text
          call.sendCustomEvent(customEvent); // Send custom event with typed data
        }

        // Translate the transcription to the target language for the other participants
        var translatedText = await translateText(text, selectedLanguage);
        if (user) {
          translatedText = `[${user.username}]: ` + translatedText;
          console.log("Current User in Meeting:", user.username); // or user.email, user.id, etc.
        }
        // Send the translated text to the other participants
        if (call) {
          const customEvent: CustomEvent = {
            type: 'transcription',
            text: translatedText,
            userId: user.id, // Still include the user ID to identify the speaker
          };
          call.sendCustomEvent(customEvent);
        }
      }, selectedLanguage); // Pass selected language to startSpeechRecognition
    }
    return () => {
      recognition && recognition.stop();
    };
  }, [isListening, call, selectedLanguage, user?.id]); // Add user.id to the dependency array

  useEffect(() => {
    if (!call) return;
  
    // Listen for custom events to receive transcription data
    const unsubscribe = call.on('custom', (event: any) => {
      const payload = event.custom;
      if (payload.type === 'transcription') {
        // Only append if it's not the local user's transcription
        if (payload.userId !== user?.id && payload.text !== transcript) {
          console.log('Received transcription:', payload.text); // Log received text
          setTranscript((prev) => prev + ' ' + payload.text); // Append received transcription
        }
      }
    });
  
    // Unsubscribe when the component unmounts or no longer needs to listen
    return () => {
      unsubscribe();
    };
  }, [call, transcript, user?.id]);

  if (callingState !== CallingState.JOINED) return <Loader />;

  const CallLayout = () => {
    switch (layout) {
      case 'grid':
        return <PaginatedGridLayout />;
      case 'speaker-right':
        return <SpeakerLayout participantsBarPosition="left" />;
      default:
        return <SpeakerLayout participantsBarPosition="right" />;
    }
  };

  return (
    <section className="relative h-screen w-full overflow-hidden pt-4 text-white">
      <div className="relative flex size-full items-center justify-center">
        <div className="flex size-full max-w-[1000px] items-center">
          <CallLayout />
        </div>
        <div
          className={cn('h-[calc(100vh-86px)] hidden ml-2', {
            'show-block': showParticipants,
          })}
        >
          <CallParticipantsList onClose={() => setShowParticipants(false)} />
        </div>
      </div>

      {/* Video layout and call controls */}
      <div className="fixed bottom-0 flex w-full items-center justify-center gap-5">
        <CallControls onLeave={() => router.push(`/`)} />

        <DropdownMenu>
          <div className="flex items-center">
            <DropdownMenuTrigger className="cursor-pointer rounded-2xl bg-[#19232d] px-4 py-2 hover:bg-[#4c535b]">
              <LayoutList size={20} className="text-white" />
            </DropdownMenuTrigger>
          </div>
          <DropdownMenuContent className="border-dark-1 bg-dark-1 text-white">
            {['Grid', 'Speaker-Left', 'Speaker-Right'].map((item, index) => (
              <div key={index}>
                <DropdownMenuItem
                  onClick={() => setLayout(item.toLowerCase() as CallLayoutType)}
                >
                  {item}
                </DropdownMenuItem>
                <DropdownMenuSeparator className="border-dark-1" />
              </div>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <CallStatsButton />

        <button onClick={() => setShowParticipants((prev) => !prev)}>
          <div className="cursor-pointer rounded-2xl bg-[#19232d] px-4 py-2 hover:bg-[#4c535b]">
            <Users size={20} className="text-white" />
          </div>
        </button>

        {/* Speech Recognition Button */}
        <button onClick={() => setIsListening((prev) => !prev)}>
          <div className={`cursor-pointer rounded-2xl px-4 py-2 ${isListening ? 'bg-green-600' : 'bg-[#19232d] hover:bg-[#4c535b]'}`}>
            <Mic size={20} className="text-white" />
          </div>
        </button>
        <LanguageSelector onLanguageChange={handleLanguageChange} /> {/* Pass language change handler */}
        {!isPersonalRoom && <EndCallButton />}
      </div>

      {/* Display Transcription for All Participants */}
      {transcript && (
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 w-[80%] max-h-[50vh] overflow-y-auto bg-black bg-opacity-70 text-white p-4 rounded-lg text-lg font-semibold shadow-lg z-50">
          {transcript}
        </div>
      )}
    </section>
  );
};

export default MeetingRoom;
