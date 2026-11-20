export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ reply: 'Method not allowed' });
  const message = (req.body && req.body.message || '').toString().slice(0, 2000);
  if (!message) return res.status(400).json({ reply: 'খালি মেসেজ' });
  try {
    const r = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': process.env.GEMINI_API_KEY
        },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: 'তুমি একজন সহায়ক AI অ্যাসিস্ট্যান্ট। ব্যবহারকারী যে ভাষায় লেখে সেই ভাষায় উত্তর দাও, বাংলা হলে বাংলায়।' }] },
          contents: [{ role: 'user', parts: [{ text: message }] }]
        })
      }
    );
    const j = await r.json();
    const reply = j?.candidates?.[0]?.content?.parts?.[0]?.text || 'উত্তর পাওয়া যায়নি';
    res.status(200).json({ reply });
  } catch (e) {
    res.status(500).json({ reply: 'সার্ভারে সমস্যা হয়েছে' });
  }
}
