import { Router, Request, Response } from 'express';
import { Report } from '../models/Report';
import { Case } from '../models/Case';
import { AuditLog } from '../models/AuditLog';

const router = Router();

interface ExtractedFields {
  fullName?: string;
  reportType?: 'Missing Person' | 'Found Person' | 'Rescued Person' | 'Hospital Admission' | 'Unidentified Person';
  urgencyLevel?: 'CRITICAL' | 'HIGH' | 'ROUTINE';
  gender?: 'MALE' | 'FEMALE' | 'OTHER' | 'UNKNOWN';
  age?: string;
  lastKnownLocation?: string;
  sourceContact?: string;
  clothing?: string;
  bodyMarks?: string;
  narrativeDescription?: string;
  photoUrl?: string;
  imageUrl?: string;
}

// POST /api/chat/intake - Process natural language in English or Hindi, extract fields, ask for missing details
router.post('/intake', async (req: Request, res: Response) => {
  try {
    const { message, history = [], currentFields = {}, language = 'auto' } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'A message string is required.' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'GEMINI_API_KEY is not configured on the server.' });
    }

    // Prepare system instructions for Gemini
    const systemPrompt = `You are an empathetic, rapid disaster triage assistant for the "Reconnect Network" Missing Persons Platform in India.
Your mission is to help emergency survivors, family members, or relief volunteers file an official missing/found person report through natural conversation without requiring manual form entry.

Languages supported: English, Hindi (हिन्दी), and Hinglish (Hindi written in Roman script).
Respond in the EXACT same language and script the user uses (if user writes in Hindi or Hinglish, respond kindly in Hindi/Hinglish).

The required fields to officially file a report in the database are:
1. fullName: Name of the person (or "Unidentified Male/Female" if unknown)
2. reportType: One of "Missing Person", "Found Person", "Rescued Person", "Hospital Admission", "Unidentified Person" (default to "Missing Person" if unclear)
3. gender: "MALE", "FEMALE", "OTHER", or "UNKNOWN"
4. lastKnownLocation: City, flood sector, relief camp, landmark, or station where they were last seen or found
5. sourceContact: Phone number or contact info of the person filing this report (so authorities can follow up)

Optional helpful fields:
- age: Approximate or exact age (e.g. "28" or "8-10 years")
- clothing: What they were wearing (e.g. "Blue kurta and slippers")
- bodyMarks: Distinctive marks, tattoos, birthmarks, scars
- narrativeDescription: Brief summary of what happened
- urgencyLevel: "CRITICAL" | "HIGH" | "ROUTINE" (default to "HIGH")

Current already-extracted fields from previous turns:
${JSON.stringify(currentFields, null, 2)}

User's latest message:
"${message}"

Recent conversation history:
${JSON.stringify(history.slice(-4), null, 2)}

RULES:
1. Merge newly mentioned details into the current fields without losing existing valid data.
2. Determine which required fields are still missing from: [fullName, lastKnownLocation, sourceContact, gender/age].
3. If ANY required field is missing, set "isComplete" to false, list the missing field names in "missingFields", and write a warm, brief, 1-to-2 sentence conversational "reply" in the user's language asking specifically for the missing information.
4. If ALL required fields are provided, set "isComplete" to true, "missingFields" to [], and provide a confirming, reassuring "reply" telling them the report is ready to be submitted to the emergency database.
5. ALWAYS respond with valid JSON ONLY matching this schema:
{
  "reply": "string (conversational response in user's language)",
  "extracted": {
    "fullName": "string or null",
    "reportType": "Missing Person | Found Person | Rescued Person | Hospital Admission | Unidentified Person",
    "gender": "MALE | FEMALE | OTHER | UNKNOWN | null",
    "age": "string or null",
    "lastKnownLocation": "string or null",
    "sourceContact": "string or null",
    "clothing": "string or null",
    "bodyMarks": "string or null",
    "narrativeDescription": "string or null",
    "urgencyLevel": "CRITICAL | HIGH | ROUTINE"
  },
  "missingFields": ["string"],
  "isComplete": boolean
}`;

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=${apiKey}`;

    const geminiResponse = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: systemPrompt }]
          }
        ],
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.2
        }
      })
    });

    if (!geminiResponse.ok) {
      const errText = await geminiResponse.text();
      console.error('[Gemini API Error]:', errText);
      return res.status(502).json({ error: 'Gemini API failed to process conversation.', details: errText });
    }

    const data = await geminiResponse.json();
    const candidate = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!candidate) {
      return res.status(500).json({ error: 'No output generated by Gemini.' });
    }

    let parsedResult;
    try {
      parsedResult = JSON.parse(candidate);
    } catch (parseErr) {
      console.error('[Gemini JSON Parse Error]:', parseErr, candidate);
      // Clean possible markdown code fences
      const cleaned = candidate.replace(/```json/g, '').replace(/```/g, '').trim();
      parsedResult = JSON.parse(cleaned);
    }

    // Merge photo if previously attached
    if (currentFields.imageUrl && !parsedResult.extracted.imageUrl) {
      parsedResult.extracted.imageUrl = currentFields.imageUrl;
      parsedResult.extracted.imagePublicId = currentFields.imagePublicId;
    }

    return res.json(parsedResult);
  } catch (error: any) {
    console.error('[Chat Intake Route Error]:', error);
    return res.status(500).json({ error: error.message || 'Internal server error in chat intake.' });
  }
});

// POST /api/chat/submit-report - Direct one-click filing from chatbot
router.post('/submit-report', async (req: Request, res: Response) => {
  try {
    const { extracted, language = 'en' } = req.body;

    if (!extracted || !extracted.fullName) {
      return res.status(400).json({ error: 'Extracted fields with fullName are required to create a report.' });
    }

    const randomId = String(Math.floor(1 + Math.random() * 99999)).padStart(5, '0');
    const reportId = `AI-ST-2026-H4-${randomId.slice(-3)}`;
    const randomCaseNum = String(Math.floor(1 + Math.random() * 99999)).padStart(5, '0');
    const caseId = `MP-2026-${randomCaseNum}`;

    const reportData = {
      reportId,
      reportType: extracted.reportType || 'Missing Person',
      urgencyLevel: extracted.urgencyLevel || 'HIGH',
      source: 'AI NLP Voice Intake Desk',
      sourceContact: extracted.sourceContact || 'Not Provided',
      intakeStation: extracted.lastKnownLocation ? `${extracted.lastKnownLocation} Hub` : 'Disaster SAR Intake Desk',
      fullName: extracted.fullName,
      age: extracted.age || '',
      gender: extracted.gender || 'UNKNOWN',
      phoneNumber: extracted.sourceContact || '',
      lastKnownLocation: extracted.lastKnownLocation || 'Disaster Operational Area',
      clothing: extracted.clothing || '',
      bodyMarks: extracted.bodyMarks || '',
      narrativeDescription: extracted.narrativeDescription || `Filed via AI Voice/NLP Chat Assistant (${language}).`,
      imageUrl: extracted.imageUrl || '',
      imagePublicId: extracted.imagePublicId || '',
      photoUrl: extracted.imageUrl || '',
      photoFileName: extracted.photoFileName || '',
      status: 'NEW',
      tabCategory: 'New Submissions',
      submittedBy: 'AI Voice/Text Intake Assistant',
    };

    const newReport = await Report.create(reportData);

    const newCase = await Case.create({
      caseId,
      name: newReport.fullName,
      aliases: [],
      age: Number(newReport.age) || 25,
      gender: newReport.gender === 'FEMALE' ? 'F' : newReport.gender === 'OTHER' ? 'Other' : 'M',
      lastSeenLocation: newReport.lastKnownLocation,
      sector: 'Sector B-4',
      reportedAgo: 'Just now',
      source: 'AI Voice/Text Intake',
      priority: newReport.urgencyLevel,
      status: 'LOOKING FOR A MATCH',
      isMinor: Boolean(Number(newReport.age) > 0 && Number(newReport.age) < 18),
      hasPhoto: Boolean(newReport.imageUrl),
      photoUrl: newReport.imageUrl || '',
      imageUrl: newReport.imageUrl || '',
      imagePublicId: newReport.imagePublicId || '',
      clothing: newReport.clothing,
      bodyMarks: newReport.bodyMarks,
      reporterContact: newReport.phoneNumber,
      duplicatesMerged: false,
      canonicalId: caseId,
      verificationNotes: `Automated intake via NLP Chatbot. Details extracted from user voice/text description.`,
    });

    await AuditLog.create({
      source: 'AI Voice/Text Intake',
      sourceType: 'PUBLIC',
      action: 'AI Intake Registered',
      person: newReport.fullName,
      caseId,
      operator: 'AI-INTAKE-BOT',
      status: 'INTAKE',
      details: `Report ${reportId} auto-filed via bilingual conversational NLP and linked to live Case ${caseId}`,
    });

    res.status(201).json({
      success: true,
      report: newReport,
      case: newCase,
      caseId,
      reportId,
      message: language === 'hi' 
        ? `रिपोर्ट सफलतापूर्वक दर्ज कर ली गई है! केस आईडी: ${caseId}`
        : `Report successfully filed to database! Case ID: ${caseId}`
    });
  } catch (error: any) {
    console.error('[Submit Chat Report Error]:', error);
    res.status(500).json({ error: error.message || 'Failed to submit report from chatbot' });
  }
});

export default router;
