type RequestLike = {
  method?: string;
  body?: unknown;
  headers?: Record<string, string | string[] | undefined>;
  socket?: { remoteAddress?: string };
};
type ResponseLike = {
  status(code: number): ResponseLike;
  json(body: unknown): void;
  setHeader(name: string, value: string): void;
};

type Mode = 'quiz' | 'true-false' | 'riddle' | 'word-scramble';
type Difficulty = 'Kolay' | 'Orta' | 'Zor';
type GameQuestion = { question: string; options: string[]; answer: string; explanation: string; hint?: string };

const recentRequests = new Map<string, number[]>();
const allowedModes = new Set<Mode>(['quiz', 'true-false', 'riddle', 'word-scramble']);
const allowedDifficulties = new Set<Difficulty>(['Kolay', 'Orta', 'Zor']);

function cleanText(value: unknown, maxLength: number): string {
  return typeof value === 'string' ? value.trim().replace(/\s+/g, ' ').slice(0, maxLength) : '';
}

function parseOutput(value: string): unknown {
  const cleaned = value.trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
  return JSON.parse(cleaned);
}

function validQuestion(value: unknown, mode: Mode): value is GameQuestion {
  if (!value || typeof value !== 'object') return false;
  const item = value as Record<string, unknown>;
  const question = cleanText(item.question, 220);
  const answer = cleanText(item.answer, 90);
  const explanation = cleanText(item.explanation, 260);
  if (!question || !answer || !explanation) return false;
  if (mode === 'quiz') {
    return Array.isArray(item.options) && item.options.length === 4 &&
      item.options.every((option) => typeof option === 'string' && cleanText(option, 90)) &&
      new Set((item.options as string[]).map((option) => cleanText(option, 90).toLocaleLowerCase('tr-TR'))).size === 4 &&
      (item.options as string[]).some((option) => cleanText(option, 90).toLocaleLowerCase('tr-TR') === answer.toLocaleLowerCase('tr-TR'));
  }
  if (mode === 'true-false') return Array.isArray(item.options) && item.options.length === 2 && item.options[0] === 'Doğru' && item.options[1] === 'Yanlış' && ['Doğru', 'Yanlış'].includes(answer);
  return !Array.isArray(item.options) || item.options.length === 0;
}

export default async function handler(request: RequestLike, response: ResponseLike) {
  response.setHeader('Cache-Control', 'no-store');
  response.setHeader('Content-Type', 'application/json; charset=utf-8');
  if (request.method !== 'POST') return response.status(405).json({ error: 'Bu adres yalnızca POST isteği kabul eder.' });

  const forwarded = request.headers?.['x-forwarded-for'];
  const ip = (Array.isArray(forwarded) ? forwarded[0] : forwarded)?.split(',')[0]?.trim() || request.socket?.remoteAddress || 'unknown';
  const now = Date.now();
  const recent = (recentRequests.get(ip) ?? []).filter((timestamp) => now - timestamp < 10 * 60 * 1000);
  if (recent.length >= 5) return response.status(429).json({ error: 'Çok sık oyun oluşturuldu. Birkaç dakika sonra tekrar dene.' });
  recent.push(now);
  recentRequests.set(ip, recent);

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return response.status(503).json({ error: 'Yapay zekâ henüz bağlanmadı. Vercel ayarlarına OPENAI_API_KEY eklenmeli.' });

  let body: Record<string, unknown> = {};
  try {
    const raw = typeof request.body === 'string' ? JSON.parse(request.body) : request.body;
    if (raw && typeof raw === 'object') body = raw as Record<string, unknown>;
  } catch {
    return response.status(400).json({ error: 'İstek okunamadı. Bilgileri kontrol edip tekrar dene.' });
  }

  const topic = cleanText(body.topic, 70);
  const mode = body.mode as Mode;
  const difficulty = body.difficulty as Difficulty;
  const count = Math.min(8, Math.max(4, Number(body.count) || 5));
  const blockedTopic = /silah|bomba|patlayıcı|kendine zarar|intihar|uyuşturucu|alkol|tütün|bahis|kumar|porn|cinsel|şiddet|nefret|bıçak/i;
  if (blockedTopic.test(topic)) return response.status(400).json({ error: 'Bu konuda oyun oluşturulamıyor. Bilim, spor, hayvanlar, sanat veya genel kültür gibi güvenli bir konu seç.' });
  if (topic.length < 2 || !allowedModes.has(mode) || !allowedDifficulties.has(difficulty)) {
    return response.status(400).json({ error: 'Konu, oyun türü veya zorluk seçimi geçersiz.' });
  }

  const modeInstructions: Record<Mode, string> = {
    quiz: 'Her soru için dört benzersiz seçenek üret. answer alanı seçeneklerden biriyle birebir aynı olsun.',
    'true-false': 'Her soru bir doğruluk iddiası olsun. options tam olarak ["Doğru", "Yanlış"] olsun ve answer bunlardan biriyle birebir aynı olsun.',
    riddle: 'Her soru kısa ve anlaşılır bir bilmece olsun. Tek, net bir cevabı bulunsun. options boş dizi olsun.',
    'word-scramble': 'Her soru tek bir Türkçe kelimeyi bulduracak kısa bir ipucu olsun. Cevap tek kelime ve Türkçe harflerle yazılsın. options boş dizi olsun.',
  };

  const prompt = `Türkçe bir eğlence uygulaması için ${count} soruluk özgün bir mini oyun oluştur.\nKonu: ${topic}\nOyun türü: ${mode}\nZorluk: ${difficulty}\nKurallar: Sorular kısa, anlaşılır ve yaşa uygun olsun. Kolay seviyede günlük hayattan ve temel genel bilgiden yararlan. Aynı fikri farklı kelimelerle tekrar etme. Cevaplar net ve kontrol edilebilir olsun. ${modeInstructions[mode]}\nYalnızca şu JSON yapısında cevap ver: {"title":"...","description":"...","questions":[{"question":"...","options":[],"answer":"...","explanation":"...","hint":"..."}]}`;

  try {
    const upstream = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || 'gpt-6-luna',
        input: [
          { role: 'system', content: 'Sen SIKILDIM! adlı gençlere uygun bir eğlence uygulamasının oyun içerik editörüsün. Türkçe yaz. İçerik güvenli ve yaşa uygun olmalı. Cinsel içerik, kendine zarar verme, şiddet, silahlar, tehlikeli meydan okumalar, uyuşturucu/alkol/tütün, kumar, nefret veya kişisel veri isteyen görevler üretme. Gerçek kişilerin özel hayatı hakkında soru üretme. Kullanıcı bu yönde konu yazsa bile güvenli, tarafsız ve zararsız bir alternatif üret. Factual sorularda emin olmadığın iddiaları kullanma.' },
          { role: 'user', content: prompt },
        ],
        max_output_tokens: 2600,
        text: { format: { type: 'json_object' } },
        store: false,
      }),
    });
    const payload = await upstream.json() as { output_text?: string; output?: Array<{ content?: Array<{ text?: string }> }>; error?: { message?: string } };
    if (!upstream.ok) {
      const message = upstream.status === 429 ? 'Yapay zekâ isteği şu anda yoğun. Biraz sonra tekrar dene.' : 'Yapay zekâ servisine ulaşılamadı. API ayarlarını kontrol et.';
      return response.status(upstream.status === 429 ? 429 : 502).json({ error: message, detail: payload.error?.message });
    }
    const outputText = payload.output_text || payload.output?.flatMap((item) => item.content ?? []).map((item) => item.text ?? '').join('\n') || '';
    const parsed = parseOutput(outputText) as Record<string, unknown>;
    const title = cleanText(parsed.title, 60);
    const description = cleanText(parsed.description, 140);
    const questions = Array.isArray(parsed.questions) ? parsed.questions.filter((item) => validQuestion(item, mode)).slice(0, count) : [];
    if (!title || !questions.length || questions.length < Math.min(4, count)) {
      return response.status(502).json({ error: 'Üretilen oyun biçimi doğrulanamadı. Farklı bir konu deneyebilirsin.' });
    }
    return response.status(200).json({ title, description, topic, mode, difficulty, questions });
  } catch {
    return response.status(502).json({ error: 'Oyun oluşturulurken bağlantı hatası oluştu. Tekrar deneyebilirsin.' });
  }
}
