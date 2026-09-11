import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Send,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Volume2,
  Upload,
  User,
  MapPin,
  Phone,
  RotateCcw,
  Check,
  ExternalLink,
  ChevronRight,
  Sparkle
} from 'lucide-react';
import { api } from '../../services/api';
import { Badge } from '../common/Badge';

interface Message {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
  isVoice?: boolean;
}

interface ExtractedData {
  fullName?: string;
  reportType?: string;
  gender?: string;
  age?: string;
  lastKnownLocation?: string;
  sourceContact?: string;
  clothing?: string;
  bodyMarks?: string;
  narrativeDescription?: string;
  urgencyLevel?: 'CRITICAL' | 'HIGH' | 'ROUTINE';
  imageUrl?: string;
  imagePublicId?: string;
  photoFileName?: string;
}

interface NlpReportChatbotProps {
  onReportCreated?: (caseId: string, reportData: any) => void;
  onSwitchToManual?: () => void;
}

export const NlpReportChatbot: React.FC<NlpReportChatbotProps> = ({
  onReportCreated,
  onSwitchToManual
}) => {
  const [selectedLanguage, setSelectedLanguage] = useState<'hi' | 'en' | 'hinglish'>('hi');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-1',
      sender: 'bot',
      text: 'नमस्ते! मैं आपका आपदा राहत सहायक हूँ। कृपया उस व्यक्ति की जानकारी दें जिसकी आप रिपोर्ट दर्ज करना चाहते हैं—जैसे उनका पूरा नाम, वे कहाँ से लापता हुए या कहाँ मिले, और आपका संपर्क फ़ोन नंबर क्या है? आप बोलकर (माइक द्वारा) या नीचे लिखकर बता सकते हैं।',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [inputVal, setInputVal] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedData, setExtractedData] = useState<ExtractedData>({
    reportType: 'Missing Person',
    urgencyLevel: 'HIGH'
  });
  const [missingFields, setMissingFields] = useState<string[]>([
    'Person Full Name',
    'Last Known Location',
    'Contact Phone Number',
    'Gender or Age'
  ]);
  const [isComplete, setIsComplete] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedCaseId, setSubmittedCaseId] = useState<string | null>(null);
  const [submittedReportId, setSubmittedReportId] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [speechActive, setSpeechActive] = useState(false);

  // Switch language mode & prompt user for details in that language
  const handleSelectLanguage = (lang: 'hi' | 'en' | 'hinglish') => {
    setSelectedLanguage(lang);

    let promptQuestion = '';
    if (lang === 'hi') {
      promptQuestion = 'नमस्ते! मैं आपका आपदा राहत सहायक हूँ। कृपया उस व्यक्ति की जानकारी दें जिसकी आप रिपोर्ट दर्ज करना चाहते हैं—जैसे उनका पूरा नाम, वे कहाँ से लापता हुए, उनकी उम्र या लिंग, और आपका संपर्क फ़ोन नंबर क्या है? आप माइक से बोलकर या नीचे लिखकर बता सकते हैं।';
    } else if (lang === 'hinglish') {
      promptQuestion = 'Namaste! Main aapka Disaster Relief Assistant hoon. Kripya us vyakti ki details batayein jinki report aap likhwana chahte hain—jaise unka pura naam kya hai, wo aakhiri baar kahan dekhe gaye the, unki umar, aur aapka contact phone number kya hai? Aap bol kar ya type karke bata sakte hain.';
    } else {
      promptQuestion = 'Hello! I am your Emergency Disaster Intake Assistant. Please provide the details of the person you wish to report—such as their full name, where they were last seen or found, their approximate age/gender, and your contact phone number. You can speak using the microphone or type below.';
    }

    // Clear all previous slots so no previous report is registered
    setExtractedData({
      reportType: 'Missing Person',
      urgencyLevel: 'HIGH'
    });
    setMissingFields([
      'Person Full Name',
      'Last Known Location',
      'Contact Phone Number',
      'Gender or Age'
    ]);
    setIsComplete(false);
    setSubmittedCaseId(null);
    setSubmittedReportId(null);

    setMessages([
      {
        id: `lang-welcome-${Date.now()}`,
        sender: 'bot',
        text: promptQuestion,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  const chatBottomRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      setSpeechSupported(true);
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = selectedLanguage === 'hi' ? 'hi-IN' : 'en-IN';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          transcript += event.results[i][0].transcript;
        }
        setInputVal(transcript);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, [selectedLanguage]);

  // Scroll to bottom when messages update
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isProcessing]);

  // Toggle voice listening
  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.lang = selectedLanguage === 'hi' ? 'hi-IN' : 'en-IN';
        recognitionRef.current.start();
      } catch (err) {
        console.warn('Recognition start err:', err);
      }
    }
  };

  // Speak message out loud using browser TTS
  const speakMessage = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    if (speechActive) {
      setSpeechActive(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    if (selectedLanguage === 'hi' || /[\u0900-\u097F]/.test(text)) {
      utterance.lang = 'hi-IN';
    } else {
      utterance.lang = 'en-US';
    }
    utterance.onend = () => setSpeechActive(false);
    utterance.onerror = () => setSpeechActive(false);
    setSpeechActive(true);
    window.speechSynthesis.speak(utterance);
  };

  // Send message to Gemini NLP backend
  const handleSendMessage = async (textToSend?: string, wasVoice = false) => {
    const text = (textToSend || inputVal).trim();
    if (!text || isProcessing) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isVoice: wasVoice || isListening
    };

    setMessages(prev => [...prev, userMsg]);
    setInputVal('');
    setIsProcessing(true);

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }

    try {
      const historyPayload = messages.map(m => ({
        role: m.sender === 'bot' ? 'assistant' : 'user',
        text: m.text
      }));

      const res = await api.chatIntake({
        message: text,
        history: historyPayload,
        currentFields: extractedData,
        language: selectedLanguage
      });

      if (res && res.reply) {
        const botMsg: Message = {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: res.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, botMsg]);

        // Merge newly extracted fields
        if (res.extracted) {
          setExtractedData(prev => ({
            ...prev,
            ...res.extracted,
            // Retain image if already uploaded
            imageUrl: prev.imageUrl || res.extracted.imageUrl,
            imagePublicId: prev.imagePublicId || res.extracted.imagePublicId,
            photoFileName: prev.photoFileName || res.extracted.photoFileName
          }));
        }

        if (res.missingFields) {
          setMissingFields(res.missingFields);
        }

        setIsComplete(Boolean(res.isComplete));
      }
    } catch (err: any) {
      console.error('[Chatbot Error]:', err);
      const errorMsg: Message = {
        id: `err-${Date.now()}`,
        sender: 'bot',
        text: 'I am experiencing a slight connectivity hiccup with the AI service. Please try repeating or verify your connection.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle Cloudinary Image Upload
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadingImage(true);
      try {
        const uploadRes = await api.uploadImage(file);
        if (uploadRes?.url) {
          setExtractedData(prev => ({
            ...prev,
            imageUrl: uploadRes.url,
            imagePublicId: uploadRes.publicId,
            photoFileName: file.name
          }));
          const photoMsg: Message = {
            id: `bot-photo-${Date.now()}`,
            sender: 'bot',
            text: `Photograph attached successfully: "${file.name}". This will be linked to the facial recognition and matching queue.`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };
          setMessages(prev => [...prev, photoMsg]);
        }
      } catch (err) {
        console.error('Photo upload failed:', err);
      } finally {
        setUploadingImage(false);
      }
    }
  };

  // Submit official report directly to MongoDB
  const handleSubmitReport = async () => {
    if (!extractedData.fullName) return;
    setIsSubmitting(true);

    try {
      const res = await api.submitChatReport({
        extracted: extractedData,
        language: selectedLanguage
      });

      if (res && res.success) {
        setSubmittedCaseId(res.caseId);
        setSubmittedReportId(res.reportId);
        if (onReportCreated) {
          onReportCreated(res.caseId, res.report);
        }
      }
    } catch (err) {
      console.error('Failed to submit chat report:', err);
      alert('Submission encountered an issue. Please review the details or try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset conversation
  const handleReset = () => {
    let resetPrompt = '';
    if (selectedLanguage === 'hi') {
      resetPrompt = 'बातचीत रीसेट कर दी गई है। कृपया उस व्यक्ति की जानकारी दें—जैसे उनका पूरा नाम, वे कहाँ से लापता हुए या मिले, उनकी आयु या लिंग, और आपका संपर्क नंबर?';
    } else if (selectedLanguage === 'hinglish') {
      resetPrompt = 'Conversation reset ho gaya hai. Kripya us vyakti ka pura naam, last seen location, age/gender aur apna contact phone number batayein.';
    } else {
      resetPrompt = 'Conversation reset. Please provide the person’s full name, last known location, age/gender, and your contact phone number.';
    }

    setMessages([
      {
        id: `welcome-reset-${Date.now()}`,
        sender: 'bot',
        text: resetPrompt,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    setExtractedData({
      reportType: 'Missing Person',
      urgencyLevel: 'HIGH'
    });
    setMissingFields([
      'Person Full Name',
      'Last Known Location',
      'Contact Phone Number',
      'Gender or Age'
    ]);
    setIsComplete(false);
    setSubmittedCaseId(null);
    setSubmittedReportId(null);
  };

  // Conversational Intent Starters (Prompts assistant to actively interview user instead of submitting hardcoded data)
  const actionStarters = [
    {
      title: '🚨 लापता व्यक्ति (Report Missing)',
      text: selectedLanguage === 'hi' 
        ? 'मुझे एक नए लापता व्यक्ति की रिपोर्ट दर्ज करवानी है।'
        : selectedLanguage === 'hinglish'
        ? 'Mujhe ek missing person ki report darj karwani hai.'
        : 'I want to report a missing person.'
    },
    {
      title: '🤝 मिला हुआ व्यक्ति (Report Found)',
      text: selectedLanguage === 'hi'
        ? 'मुझे एक मिला हुआ या बचाया गया व्यक्ति मिला है।'
        : selectedLanguage === 'hinglish'
        ? 'Mujhe ek mila hua vyakti mila hai.'
        : 'I have found an unaccompanied or rescued person.'
    },
    {
      title: '🏥 अस्पताल भर्ती (Hospital Intake)',
      text: selectedLanguage === 'hi'
        ? 'अस्पताल में भर्ती किसी व्यक्ति की रिपोर्ट दर्ज करनी है।'
        : selectedLanguage === 'hinglish'
        ? 'Hospital me admit vyakti ki report darj karni hai.'
        : 'I want to report a patient admitted to a triage facility.'
    }
  ];

  // Calculate completeness percentage
  const totalSlots = 5;
  const filledSlots = [
    Boolean(extractedData.fullName),
    Boolean(extractedData.lastKnownLocation),
    Boolean(extractedData.sourceContact),
    Boolean(extractedData.gender || extractedData.age),
    Boolean(extractedData.reportType)
  ].filter(Boolean).length;
  const progressPercent = Math.min(100, Math.round((filledSlots / totalSlots) * 100));

  // If already submitted successfully, show confirmation screen
  if (submittedCaseId) {
    return (
      <div style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-base)',
        borderRadius: '12px',
        padding: '3rem 2rem',
        textAlign: 'center',
        maxWidth: '720px',
        margin: '0 auto',
        boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
      }}>
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          background: 'rgba(34, 197, 94, 0.1)',
          color: '#16a34a',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.5rem auto'
        }}>
          <CheckCircle2 size={36} />
        </div>

        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
          Report Successfully Filed to Live Database!
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '1.75rem', maxWidth: '500px', margin: '0 auto 1.75rem auto' }}>
          The NLP intake assistant has created an official record in MongoDB. Automated correlation and biometric matching have been queued.
        </p>

        <div style={{
          background: 'var(--bg-app)',
          border: '1px solid var(--border-base)',
          borderRadius: '10px',
          padding: '1.25rem',
          maxWidth: '480px',
          margin: '0 auto 2rem auto',
          textAlign: 'left'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-base)' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Generated Case ID</span>
            <span style={{ fontWeight: 700, color: 'var(--primary-color)', fontFamily: 'monospace' }}>{submittedCaseId}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-base)' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Report ID</span>
            <span style={{ fontWeight: 600, color: 'var(--text-primary)', fontFamily: 'monospace' }}>{submittedReportId}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-base)' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Individual</span>
            <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{extractedData.fullName}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Triage Priority</span>
            <Badge variant="crimson">CRITICAL / HIGH</Badge>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => window.location.href = `/cases`}
            style={{
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              border: 'none',
              background: 'var(--primary-color)',
              color: '#ffffff',
              fontWeight: 600,
              fontSize: '0.9rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <span>View Live Cases</span>
            <ExternalLink size={16} />
          </button>
          <button
            onClick={() => window.location.href = `/incident-map`}
            style={{
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              border: '1px solid rgba(225, 29, 72, 0.4)',
              background: 'rgba(225, 29, 72, 0.08)',
              color: '#e11d48',
              fontWeight: 700,
              fontSize: '0.9rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <MapPin size={16} />
            <span>View on India Incident Map</span>
          </button>
          <button
            onClick={handleReset}
            style={{
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              border: '1px solid var(--border-base)',
              background: 'var(--bg-surface)',
              color: 'var(--text-primary)',
              fontWeight: 600,
              fontSize: '0.9rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <RotateCcw size={16} />
            <span>File Another Report</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(340px, 1fr) 380px', gap: '1.5rem', alignItems: 'start' }}>
      
      {/* LEFT COLUMN: Conversational Chat Interface */}
      <div style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-base)',
        borderRadius: '12px',
        display: 'flex',
        flexDirection: 'column',
        height: '660px',
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
      }}>
        
        {/* Chat Header */}
        <div style={{
          padding: '1rem 1.25rem',
          borderBottom: '1px solid var(--border-base)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'var(--bg-app)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 6px rgba(2,132,199,0.25)'
            }}>
              <Sparkles size={20} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                  Disaster Intake Assistant (AI NLP)
                </h3>
                <span style={{
                  fontSize: '0.65rem',
                  background: 'rgba(2, 132, 199, 0.1)',
                  color: '#0284c7',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  fontWeight: 600
                }}>
                  Gemini 3.5 Bilingual
                </span>
              </div>
              <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                English, हिन्दी & Hinglish • Voice & Text
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {/* Language selector toggle */}
            <div style={{ display: 'flex', background: 'var(--bg-surface)', border: '1px solid var(--border-base)', borderRadius: '6px', padding: '2px' }}>
              <button
                type="button"
                onClick={() => handleSelectLanguage('hi')}
                style={{
                  padding: '4px 10px',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  background: selectedLanguage === 'hi' ? 'var(--primary-color)' : 'transparent',
                  color: selectedLanguage === 'hi' ? '#ffffff' : 'var(--text-secondary)'
                }}
              >
                हिन्दी (Hindi)
              </button>
              <button
                type="button"
                onClick={() => handleSelectLanguage('en')}
                style={{
                  padding: '4px 10px',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  background: selectedLanguage === 'en' ? 'var(--primary-color)' : 'transparent',
                  color: selectedLanguage === 'en' ? '#ffffff' : 'var(--text-secondary)'
                }}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => handleSelectLanguage('hinglish')}
                style={{
                  padding: '4px 10px',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  background: selectedLanguage === 'hinglish' ? 'var(--primary-color)' : 'transparent',
                  color: selectedLanguage === 'hinglish' ? '#ffffff' : 'var(--text-secondary)'
                }}
              >
                Hinglish
              </button>
            </div>

            <button
              type="button"
              onClick={handleReset}
              title="Reset conversation"
              style={{
                padding: '6px',
                borderRadius: '6px',
                border: '1px solid var(--border-base)',
                background: 'var(--bg-surface)',
                color: 'var(--text-secondary)',
                cursor: 'pointer'
              }}
            >
              <RotateCcw size={14} />
            </button>
          </div>
        </div>

        {/* Message Stream */}
        <div style={{
          flex: 1,
          padding: '1rem',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          background: 'var(--bg-surface)'
        }}>
          {messages.map((msg) => (
            <div
              key={msg.id}
              style={{
                display: 'flex',
                justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                alignItems: 'flex-start',
                gap: '0.5rem'
              }}
            >
              {msg.sender === 'bot' && (
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: 'rgba(2, 132, 199, 0.1)',
                  color: '#0284c7',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  marginTop: '2px'
                }}>
                  <Sparkle size={14} />
                </div>
              )}

              <div style={{
                maxWidth: '78%',
                borderRadius: '12px',
                padding: '0.75rem 1rem',
                fontSize: '0.88rem',
                lineHeight: 1.45,
                background: msg.sender === 'user' ? 'var(--primary-color)' : 'var(--bg-app)',
                color: msg.sender === 'user' ? '#ffffff' : 'var(--text-primary)',
                border: msg.sender === 'user' ? 'none' : '1px solid var(--border-base)',
                boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                position: 'relative'
              }}>
                <div style={{ wordBreak: 'break-word', whiteSpace: 'pre-wrap' }}>
                  {msg.text}
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  gap: '0.5rem',
                  marginTop: '0.35rem',
                  fontSize: '0.7rem',
                  opacity: 0.75
                }}>
                  {msg.isVoice && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                      <Mic size={10} /> Voice
                    </span>
                  )}
                  <span>{msg.timestamp}</span>

                  {msg.sender === 'bot' && (
                    <button
                      type="button"
                      onClick={() => speakMessage(msg.text)}
                      title="Read aloud"
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: 0,
                        color: 'inherit',
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    >
                      <Volume2 size={12} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

          {isProcessing && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                background: 'rgba(2, 132, 199, 0.1)',
                color: '#0284c7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Sparkles size={14} />
              </div>
              <div style={{
                padding: '0.65rem 1rem',
                background: 'var(--bg-app)',
                border: '1px solid var(--border-base)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <div style={{ display: 'flex', gap: '4px' }}>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--primary-color)', animation: 'pulse 1s infinite' }} />
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--primary-color)', animation: 'pulse 1s infinite 0.2s' }} />
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--primary-color)', animation: 'pulse 1s infinite 0.4s' }} />
                </div>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Extracting details & validating required fields...</span>
              </div>
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* Quick Suggestion Action Starters */}
        {messages.length <= 3 && (
          <div style={{ padding: '0.5rem 1rem', background: 'var(--bg-app)', borderTop: '1px solid var(--border-base)', display: 'flex', gap: '0.5rem', overflowX: 'auto' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', alignSelf: 'center' }}>
              Report Type:
            </span>
            {actionStarters.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendMessage(p.text)}
                style={{
                  padding: '4px 10px',
                  borderRadius: '14px',
                  border: '1px solid var(--border-base)',
                  background: 'var(--bg-surface)',
                  fontSize: '0.72rem',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                {p.title}
              </button>
            ))}
          </div>
        )}

        {/* Live Audio Listening Bar */}
        {isListening && (
          <div style={{
            padding: '0.5rem 1rem',
            background: 'rgba(239, 68, 68, 0.08)',
            borderTop: '1px solid rgba(239, 68, 68, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                background: '#ef4444',
                boxShadow: '0 0 8px #ef4444',
                animation: 'pulse 1s infinite'
              }} />
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#dc2626' }}>
                Listening in {selectedLanguage === 'hi' ? 'Hindi (हिन्दी)' : 'English / Hindi'}... Speak naturally
              </span>
            </div>
            <button
              type="button"
              onClick={toggleListening}
              style={{
                background: '#ef4444',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                padding: '2px 8px',
                fontSize: '0.72rem',
                cursor: 'pointer'
              }}
            >
              Stop & Send
            </button>
          </div>
        )}

        {/* Input Bar */}
        <div style={{
          padding: '0.75rem 1rem',
          borderTop: '1px solid var(--border-base)',
          background: 'var(--bg-surface)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          {/* Voice Microphone Button */}
          {speechSupported && (
            <button
              type="button"
              onClick={toggleListening}
              title={isListening ? 'Stop listening' : 'Start voice input (Hindi / English)'}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                border: isListening ? '2px solid #ef4444' : '1px solid var(--border-base)',
                background: isListening ? 'rgba(239, 68, 68, 0.12)' : 'var(--bg-app)',
                color: isListening ? '#dc2626' : 'var(--text-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                flexShrink: 0,
                transition: 'all 0.2s'
              }}
            >
              {isListening ? <MicOff size={18} /> : <Mic size={18} />}
            </button>
          )}

          {/* Text Input */}
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder={
              selectedLanguage === 'hi'
                ? 'यहाँ बोलें या लिखें (जैसे: मेरा भाई सेक्टर 4 से लापता है...)'
                : 'Speak or type details here (e.g. Ramesh is missing from Sector 4...)'
            }
            style={{
              flex: 1,
              padding: '0.65rem 0.85rem',
              borderRadius: '8px',
              border: '1px solid var(--border-base)',
              background: 'var(--bg-app)',
              color: 'var(--text-primary)',
              fontSize: '0.88rem',
              outline: 'none'
            }}
          />

          {/* Send Button */}
          <button
            type="button"
            onClick={() => handleSendMessage()}
            disabled={!inputVal.trim() || isProcessing}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '8px',
              border: 'none',
              background: inputVal.trim() && !isProcessing ? 'var(--primary-color)' : 'var(--border-base)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: inputVal.trim() && !isProcessing ? 'pointer' : 'not-allowed',
              flexShrink: 0,
              transition: 'background 0.2s'
            }}
          >
            <Send size={16} />
          </button>
        </div>
      </div>

      {/* RIGHT COLUMN: Live Intake Slot Dossier & One-Click Submission */}
      <div style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-base)',
        borderRadius: '12px',
        padding: '1.25rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
      }}>
        {/* Dossier Header */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
              Intake Dossier Preview
            </h4>
            <span style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              color: progressPercent >= 100 ? '#16a34a' : 'var(--primary-color)'
            }}>
              {progressPercent}% Complete
            </span>
          </div>

          {/* Progress Bar */}
          <div style={{
            height: '6px',
            background: 'var(--bg-app)',
            borderRadius: '3px',
            overflow: 'hidden',
            border: '1px solid var(--border-base)'
          }}>
            <div style={{
              height: '100%',
              width: `${progressPercent}%`,
              background: progressPercent >= 100
                ? 'linear-gradient(90deg, #16a34a, #22c55e)'
                : 'linear-gradient(90deg, #0284c7, #38bdf8)',
              transition: 'width 0.4s ease'
            }} />
          </div>
        </div>

        {/* Extracted Slots List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          
          {/* Person Name */}
          <div style={{
            padding: '0.65rem 0.85rem',
            borderRadius: '8px',
            background: extractedData.fullName ? 'rgba(34, 197, 94, 0.05)' : 'var(--bg-app)',
            border: `1px solid ${extractedData.fullName ? 'rgba(34, 197, 94, 0.3)' : 'var(--border-base)'}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <User size={15} color={extractedData.fullName ? '#16a34a' : 'var(--text-muted)'} />
              <div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Person Name *</div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: extractedData.fullName ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                  {extractedData.fullName || 'Not provided yet'}
                </div>
              </div>
            </div>
            {extractedData.fullName ? <Check size={16} color="#16a34a" /> : <AlertCircle size={15} color="#eab308" />}
          </div>

          {/* Location */}
          <div style={{
            padding: '0.65rem 0.85rem',
            borderRadius: '8px',
            background: extractedData.lastKnownLocation ? 'rgba(34, 197, 94, 0.05)' : 'var(--bg-app)',
            border: `1px solid ${extractedData.lastKnownLocation ? 'rgba(34, 197, 94, 0.3)' : 'var(--border-base)'}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <MapPin size={15} color={extractedData.lastKnownLocation ? '#16a34a' : 'var(--text-muted)'} />
              <div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Last Known Location *</div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: extractedData.lastKnownLocation ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                  {extractedData.lastKnownLocation || 'Not provided yet'}
                </div>
              </div>
            </div>
            {extractedData.lastKnownLocation ? <Check size={16} color="#16a34a" /> : <AlertCircle size={15} color="#eab308" />}
          </div>

          {/* Reporter Contact */}
          <div style={{
            padding: '0.65rem 0.85rem',
            borderRadius: '8px',
            background: extractedData.sourceContact ? 'rgba(34, 197, 94, 0.05)' : 'var(--bg-app)',
            border: `1px solid ${extractedData.sourceContact ? 'rgba(34, 197, 94, 0.3)' : 'var(--border-base)'}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Phone size={15} color={extractedData.sourceContact ? '#16a34a' : 'var(--text-muted)'} />
              <div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Reporter Contact Phone *</div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: extractedData.sourceContact ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                  {extractedData.sourceContact || 'Not provided yet'}
                </div>
              </div>
            </div>
            {extractedData.sourceContact ? <Check size={16} color="#16a34a" /> : <AlertCircle size={15} color="#eab308" />}
          </div>

          {/* Demographics (Gender / Age) */}
          <div style={{
            padding: '0.65rem 0.85rem',
            borderRadius: '8px',
            background: (extractedData.gender || extractedData.age) ? 'rgba(34, 197, 94, 0.05)' : 'var(--bg-app)',
            border: `1px solid ${(extractedData.gender || extractedData.age) ? 'rgba(34, 197, 94, 0.3)' : 'var(--border-base)'}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Age & Gender</div>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: (extractedData.gender || extractedData.age) ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                {extractedData.gender || 'Gender unstated'} • {extractedData.age ? `${extractedData.age} yrs` : 'Age unstated'}
              </div>
            </div>
            {(extractedData.gender || extractedData.age) ? <Check size={16} color="#16a34a" /> : <AlertCircle size={15} color="#eab308" />}
          </div>

          {/* Clothing & Notes */}
          {extractedData.clothing && (
            <div style={{
              padding: '0.5rem 0.85rem',
              borderRadius: '8px',
              background: 'var(--bg-app)',
              border: '1px solid var(--border-base)',
              fontSize: '0.78rem'
            }}>
              <span style={{ color: 'var(--text-muted)' }}>Clothing: </span>
              <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{extractedData.clothing}</span>
            </div>
          )}

          {/* Optional Photo Attachment (Cloudinary) */}
          <div style={{
            padding: '0.75rem',
            borderRadius: '8px',
            border: '1px dashed var(--border-base)',
            background: 'var(--bg-app)',
            textAlign: 'center'
          }}>
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handlePhotoUpload}
            />

            {extractedData.imageUrl ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <img
                  src={extractedData.imageUrl}
                  alt="Attached"
                  style={{ width: '44px', height: '44px', borderRadius: '6px', objectFit: 'cover', border: '1px solid var(--border-base)' }}
                />
                <div style={{ textAlign: 'left', flex: 1, overflow: 'hidden' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-primary)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                    {extractedData.photoFileName || 'Photo Attached'}
                  </div>
                  <div style={{ fontSize: '0.68rem', color: '#16a34a', display: 'flex', alignItems: 'center', gap: '3px' }}>
                    <Check size={12} /> Cloudinary Ready
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    fontSize: '0.7rem',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    border: '1px solid var(--border-base)',
                    background: 'var(--bg-surface)',
                    cursor: 'pointer'
                  }}
                >
                  Change
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingImage}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  color: 'var(--primary-color)',
                  fontSize: '0.78rem',
                  fontWeight: 600
                }}
              >
                <Upload size={14} />
                <span>{uploadingImage ? 'Uploading image...' : 'Attach Photo (Optional)'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Missing Fields Warning Alert (if any) */}
        {!isComplete && missingFields.length > 0 && (
          <div style={{
            padding: '0.65rem 0.85rem',
            borderRadius: '8px',
            background: 'rgba(234, 179, 8, 0.08)',
            border: '1px solid rgba(234, 179, 8, 0.25)',
            fontSize: '0.76rem',
            color: '#854d0e'
          }}>
            <div style={{ fontWeight: 600, marginBottom: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <AlertCircle size={13} /> Still needed to file official report:
            </div>
            <div style={{ paddingLeft: '1.1rem' }}>
              {missingFields.join(', ')}
            </div>
          </div>
        )}

        {/* Complete State Callout */}
        {isComplete && (
          <div style={{
            padding: '0.65rem 0.85rem',
            borderRadius: '8px',
            background: 'rgba(34, 197, 94, 0.08)',
            border: '1px solid rgba(34, 197, 94, 0.25)',
            fontSize: '0.78rem',
            color: '#15803d',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <CheckCircle2 size={16} />
            <span>All mandatory fields collected! Ready to file directly into the database.</span>
          </div>
        )}

        {/* Action Button: One-Click Instant Submit */}
        <button
          type="button"
          onClick={handleSubmitReport}
          disabled={!extractedData.fullName || isSubmitting}
          style={{
            width: '100%',
            padding: '0.85rem',
            borderRadius: '8px',
            border: 'none',
            background: isComplete
              ? 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)'
              : extractedData.fullName
              ? 'var(--primary-color)'
              : 'var(--border-base)',
            color: '#ffffff',
            fontWeight: 700,
            fontSize: '0.92rem',
            cursor: (!extractedData.fullName || isSubmitting) ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            boxShadow: isComplete ? '0 4px 12px rgba(22, 163, 74, 0.25)' : 'none',
            transition: 'all 0.2s'
          }}
        >
          {isSubmitting ? (
            <span>Saving Report to Database...</span>
          ) : (
            <>
              <CheckCircle2 size={18} />
              <span>{isComplete ? 'File Official Report to Database' : 'Submit Report With Current Data'}</span>
            </>
          )}
        </button>

        {/* Switch to Manual Form Option */}
        {onSwitchToManual && (
          <button
            type="button"
            onClick={onSwitchToManual}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-secondary)',
              fontSize: '0.78rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.35rem',
              textDecoration: 'underline'
            }}
          >
            <span>Prefer the traditional step-by-step form? Switch here</span>
            <ChevronRight size={12} />
          </button>
        )}
      </div>

    </div>
  );
};
