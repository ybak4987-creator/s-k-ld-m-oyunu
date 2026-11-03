import type { QuizQuestion } from './types';

export type KnowledgeFact = {
  id: number;
  category: string;
  question: string;
  answer: string;
  distractors: [string, string, string];
  statement: string;
  falseStatement: string;
  explanation: string;
  difficulty?: 'Kolay' | 'Orta';
};

const factRows: Omit<KnowledgeFact, 'id'>[] = [
  { category: 'Coğrafya', question: "Türkiye'nin başkenti neresidir?", answer: 'Ankara', distractors: ['İstanbul', 'İzmir', 'Bursa'], statement: "Türkiye'nin başkenti Ankara'dır.", falseStatement: "Türkiye'nin başkenti İstanbul'dur.", explanation: "Türkiye'nin başkenti Ankara'dır; İstanbul ülkenin en kalabalık şehridir." },
  { category: 'Bilim', question: 'Güneş Sistemi’nin en büyük gezegeni hangisidir?', answer: 'Jüpiter', distractors: ['Satürn', 'Dünya', 'Neptün'], statement: 'Jüpiter, Güneş Sistemi’nin en büyük gezegenidir.', falseStatement: 'Mars, Güneş Sistemi’nin en büyük gezegenidir.', explanation: 'Jüpiter, çapı ve kütlesi bakımından Güneş Sistemi’nin en büyük gezegenidir.' },
  { category: 'Bilim', question: 'İnsan kalbinde kaç odacık bulunur?', answer: '4', distractors: ['2', '3', '5'], statement: 'İnsan kalbinde dört odacık bulunur.', falseStatement: 'İnsan kalbinde üç odacık bulunur.', explanation: 'Kalpte iki kulakçık ve iki karıncık olmak üzere dört odacık vardır.' },
  { category: 'Sanat', question: 'Mona Lisa tablosunu kim yapmıştır?', answer: 'Leonardo da Vinci', distractors: ['Pablo Picasso', 'Vincent van Gogh', 'Michelangelo'], statement: 'Mona Lisa tablosunu Leonardo da Vinci yapmıştır.', falseStatement: 'Mona Lisa tablosunu Vincent van Gogh yapmıştır.', explanation: 'Mona Lisa, Leonardo da Vinci’nin Rönesans döneminde yaptığı ünlü portredir.' },
  { category: 'Tarih', question: 'Mustafa Kemal Atatürk hangi yıl doğmuştur?', answer: '1881', distractors: ['1876', '1885', '1890'], statement: 'Mustafa Kemal Atatürk 1881 yılında doğmuştur.', falseStatement: 'Mustafa Kemal Atatürk 1890 yılında doğmuştur.', explanation: 'Atatürk 1881 yılında Selanik’te doğmuştur.' },
  { category: 'Bilim', question: 'Suyun kimyasal formülü nedir?', answer: 'H₂O', distractors: ['CO₂', 'O₂', 'NaCl'], statement: 'Suyun kimyasal formülü H₂O’dur.', falseStatement: 'Suyun kimyasal formülü CO₂’dir.', explanation: 'Bir su molekülü iki hidrojen ve bir oksijen atomundan oluşur.' },
  { category: 'Bilim', question: 'Kızıl Gezegen olarak bilinen gezegen hangisidir?', answer: 'Mars', distractors: ['Venüs', 'Merkür', 'Satürn'], statement: 'Mars, Kızıl Gezegen olarak bilinir.', falseStatement: 'Venüs, Kızıl Gezegen olarak bilinir.', explanation: 'Mars yüzeyindeki demir oksit nedeniyle kızılımsı görünür.' },
  { category: 'Bilim', question: 'Dünya’nın doğal uydusu kaç tanedir?', answer: '1', distractors: ['0', '2', '3'], statement: 'Dünya’nın bir doğal uydusu vardır.', falseStatement: 'Dünya’nın iki doğal uydusu vardır.', explanation: 'Dünya’nın doğal uydusu Ay’dır.' },
  { category: 'Bilim', question: 'Oksijen elementinin atom numarası kaçtır?', answer: '8', distractors: ['6', '7', '16'], statement: 'Oksijenin atom numarası 8’dir.', falseStatement: 'Oksijenin atom numarası 16’dır.', explanation: 'Oksijen atomunun çekirdeğinde 8 proton bulunur.' },
  { category: 'Bilim', question: 'Işık boşlukta yaklaşık hangi hızla ilerler?', answer: 'Saniyede 300.000 km', distractors: ['Saniyede 30.000 km', 'Saniyede 3.000 km', 'Saniyede 1.000 km'], statement: 'Işık boşlukta saniyede yaklaşık 300.000 kilometre yol alır.', falseStatement: 'Işık boşlukta saniyede yaklaşık 3.000 kilometre yol alır.', explanation: 'Işığın boşluktaki hızı yaklaşık 299.792 kilometre/saniyedir.' },
  { category: 'Bilim', question: 'Dünya, Güneş çevresindeki bir turunu yaklaşık kaç günde tamamlar?', answer: '365,25 gün', distractors: ['30 gün', '180 gün', '400 gün'], statement: 'Dünya’nın Güneş çevresindeki dolanımı yaklaşık 365,25 gün sürer.', falseStatement: 'Dünya’nın Güneş çevresindeki dolanımı yaklaşık 30 gün sürer.', explanation: 'Bir tropik yıl yaklaşık 365 gün 5 saat 49 dakikadır.' },
  { category: 'Bilim', question: 'Güneş’e en yakın gezegen hangisidir?', answer: 'Merkür', distractors: ['Venüs', 'Dünya', 'Mars'], statement: 'Güneş’e en yakın gezegen Merkür’dür.', falseStatement: 'Güneş’e en yakın gezegen Venüs’tür.', explanation: 'Merkür, Güneş’e en yakın yörüngede bulunan gezegendir.' },
  { category: 'Bilim', question: 'Belirgin halka sistemiyle tanınan gezegen hangisidir?', answer: 'Satürn', distractors: ['Mars', 'Merkür', 'Dünya'], statement: 'Satürn, belirgin halka sistemiyle tanınır.', falseStatement: 'Merkür, belirgin halka sistemiyle tanınır.', explanation: 'Satürn’ün geniş ve parlak halkaları çoğunlukla buz ve kaya parçalarından oluşur.' },
  { category: 'Bilim', question: 'Güneş Sistemi’nde ortalama yüzey sıcaklığı en yüksek gezegen hangisidir?', answer: 'Venüs', distractors: ['Merkür', 'Mars', 'Jüpiter'], statement: 'Venüs, güçlü sera etkisi nedeniyle ortalama yüzey sıcaklığı en yüksek gezegendir.', falseStatement: 'Merkür, ortalama yüzey sıcaklığı en yüksek gezegendir.', explanation: 'Venüs’ün yoğun karbondioksit atmosferi ısıyı çok güçlü biçimde hapseder.' },
  { category: 'Bilim', question: 'Dünya kendi ekseni etrafında hangi yönde döner?', answer: 'Batıdan doğuya', distractors: ['Doğudan batıya', 'Kuzeyden güneye', 'Güneyden kuzeye'], statement: 'Dünya kendi ekseni etrafında batıdan doğuya döner.', falseStatement: 'Dünya kendi ekseni etrafında doğudan batıya döner.', explanation: 'Dünya’nın batıdan doğuya dönüşü nedeniyle Güneş doğudan doğuyormuş gibi görünür.' },
  { category: 'Coğrafya', question: 'Deniz seviyesinden ölçüldüğünde dünyanın en yüksek dağı hangisidir?', answer: 'Everest', distractors: ['K2', 'Kilimanjaro', 'Mont Blanc'], statement: 'Everest, deniz seviyesinden ölçülen dünyanın en yüksek dağıdır.', falseStatement: 'Kilimanjaro, deniz seviyesinden ölçülen dünyanın en yüksek dağıdır.', explanation: 'Everest’in zirvesi deniz seviyesinden yaklaşık 8.849 metre yüksektedir.' },
  { category: 'Coğrafya', question: 'Dünyanın yüzölçümü bakımından en büyük okyanusu hangisidir?', answer: 'Pasifik Okyanusu', distractors: ['Atlas Okyanusu', 'Hint Okyanusu', 'Arktik Okyanusu'], statement: 'Pasifik Okyanusu, dünyanın yüzölçümü bakımından en büyük okyanusudur.', falseStatement: 'Hint Okyanusu, dünyanın yüzölçümü bakımından en büyük okyanusudur.', explanation: 'Pasifik Okyanusu, dünya okyanuslarının en genişidir.' },
  { category: 'Coğrafya', question: 'Dünyanın en büyük sıcak çölü hangisidir?', answer: 'Sahra', distractors: ['Gobi', 'Kalahari', 'Atacama'], statement: 'Sahra, dünyanın en büyük sıcak çölüdür.', falseStatement: 'Gobi, dünyanın en büyük sıcak çölüdür.', explanation: 'Sahra, Kuzey Afrika’da yer alan en büyük sıcak çöldür; Antarktika ise genel olarak en büyük çöldür.' },
  { category: 'Coğrafya', question: 'Dünyanın yüzölçümü bakımından en büyük çölü hangisidir?', answer: 'Antarktika', distractors: ['Sahra', 'Gobi', 'Arabistan Çölü'], statement: 'Antarktika, dünyanın yüzölçümü bakımından en büyük çölüdür.', falseStatement: 'Sahra, dünyanın yüzölçümü bakımından en büyük çölüdür.', explanation: 'Çöller yağış azlığına göre tanımlanır; bu nedenle kutup çölleri de çöl sayılır.' },
  { category: 'Coğrafya', question: 'Kanada’nın başkenti neresidir?', answer: 'Ottawa', distractors: ['Toronto', 'Vancouver', 'Montreal'], statement: 'Kanada’nın başkenti Ottawa’dır.', falseStatement: 'Kanada’nın başkenti Toronto’dur.', explanation: 'Ottawa, Ontario eyaletinde bulunan Kanada’nın başkentidir.' },
  { category: 'Coğrafya', question: 'Japonya’nın başkenti neresidir?', answer: 'Tokyo', distractors: ['Kyoto', 'Osaka', 'Nagoya'], statement: 'Japonya’nın başkenti Tokyo’dur.', falseStatement: 'Japonya’nın başkenti Kyoto’dur.', explanation: 'Tokyo, Japonya’nın başkenti ve en büyük metropol alanıdır.' },
  { category: 'Coğrafya', question: 'Avustralya’nın başkenti hangi şehirdir?', answer: 'Canberra', distractors: ['Sydney', 'Melbourne', 'Perth'], statement: 'Avustralya’nın başkenti Canberra’dır.', falseStatement: 'Avustralya’nın başkenti Sydney’dir.', explanation: 'Canberra, Avustralya’nın başkentidir; Sydney ülkenin en büyük şehirlerinden biridir.' },
  { category: 'Coğrafya', question: 'İtalya’nın başkenti neresidir?', answer: 'Roma', distractors: ['Milano', 'Venedik', 'Napoli'], statement: 'İtalya’nın başkenti Roma’dır.', falseStatement: 'İtalya’nın başkenti Milano’dur.', explanation: 'Roma, İtalya’nın başkenti ve tarihî merkezlerinden biridir.' },
  { category: 'Coğrafya', question: 'Mısır’ın başkenti hangi şehirdir?', answer: 'Kahire', distractors: ['İskenderiye', 'Gize', 'Luksor'], statement: 'Mısır’ın başkenti Kahire’dir.', falseStatement: 'Mısır’ın başkenti İskenderiye’dir.', explanation: 'Kahire, Mısır’ın başkenti ve en büyük şehirlerinden biridir.' },
  { category: 'Coğrafya', question: 'Fransa’nın başkenti neresidir?', answer: 'Paris', distractors: ['Lyon', 'Marsilya', 'Nice'], statement: 'Fransa’nın başkenti Paris’tir.', falseStatement: 'Fransa’nın başkenti Lyon’dur.', explanation: 'Paris, Fransa’nın başkentidir.' },
  { category: 'Coğrafya', question: 'Brezilya’nın başkenti neresidir?', answer: 'Brasília', distractors: ['Rio de Janeiro', 'São Paulo', 'Salvador'], statement: 'Brezilya’nın başkenti Brasília’dır.', falseStatement: 'Brezilya’nın başkenti Rio de Janeiro’dur.', explanation: 'Brasília, 1960 yılında başkent olarak açılmıştır.' },
  { category: 'Coğrafya', question: 'Almanya’nın başkenti neresidir?', answer: 'Berlin', distractors: ['Münih', 'Hamburg', 'Frankfurt'], statement: 'Almanya’nın başkenti Berlin’dir.', falseStatement: 'Almanya’nın başkenti Münih’tir.', explanation: 'Berlin, Almanya’nın başkentidir.' },
  { category: 'Coğrafya', question: 'Ekvator, Dünya’yı hangi iki yarım küreye ayırır?', answer: 'Kuzey ve Güney', distractors: ['Doğu ve Batı', 'Kara ve Deniz', 'Kutup ve Tropik'], statement: 'Ekvator, Dünya’yı Kuzey ve Güney yarım kürelerine ayırır.', falseStatement: 'Ekvator, Dünya’yı Doğu ve Batı yarım kürelerine ayırır.', explanation: 'Ekvator 0° enlemidir ve Kuzey ile Güney yarım kürelerini ayırır.' },
  { category: 'Coğrafya', question: 'İstanbul hangi iki kıta üzerinde yer alır?', answer: 'Avrupa ve Asya', distractors: ['Asya ve Afrika', 'Avrupa ve Afrika', 'Avrupa ve Güney Amerika'], statement: 'İstanbul hem Avrupa hem Asya kıtasında topraklara sahiptir.', falseStatement: 'İstanbul yalnızca Afrika kıtasında yer alır.', explanation: 'İstanbul Boğazı, şehrin Avrupa ve Asya yakalarını birbirinden ayırır.' },
  { category: 'Coğrafya', question: 'İstanbul Boğazı hangi iki denizi birbirine bağlar?', answer: 'Karadeniz ve Marmara Denizi', distractors: ['Ege ve Akdeniz', 'Karadeniz ve Ege Denizi', 'Marmara ve Akdeniz'], statement: 'İstanbul Boğazı, Karadeniz ile Marmara Denizi’ni birbirine bağlar.', falseStatement: 'İstanbul Boğazı, Ege Denizi ile Akdeniz’i birbirine bağlar.', explanation: 'Boğaz, Karadeniz’i Marmara Denizi’ne bağlar.' },
  { category: 'Coğrafya', question: 'Türkiye’nin yüzölçümü bakımından en büyük gölü hangisidir?', answer: 'Van Gölü', distractors: ['Tuz Gölü', 'Beyşehir Gölü', 'Eğirdir Gölü'], statement: 'Van Gölü, Türkiye’nin yüzölçümü bakımından en büyük gölüdür.', falseStatement: 'Tuz Gölü, Türkiye’nin yüzölçümü bakımından en büyük gölüdür.', explanation: 'Van Gölü, Türkiye’nin en büyük gölüdür; Tuz Gölü ise ikinci büyük göldür.' },
  { category: 'Coğrafya', question: 'Türkiye’nin en yüksek dağı hangisidir?', answer: 'Ağrı Dağı', distractors: ['Erciyes Dağı', 'Süphan Dağı', 'Kaçkar Dağı'], statement: 'Ağrı Dağı, Türkiye’nin en yüksek dağıdır.', falseStatement: 'Erciyes Dağı, Türkiye’nin en yüksek dağıdır.', explanation: 'Ağrı Dağı’nın Büyük Ağrı zirvesi 5.137 metre yüksekliğindedir.' },
  { category: 'Tarih', question: 'Çin Seddi hangi ülkededir?', answer: 'Çin', distractors: ['Hindistan', 'Japonya', 'Moğolistan'], statement: 'Çin Seddi Çin’de bulunur.', falseStatement: 'Çin Seddi Japonya’da bulunur.', explanation: 'Çin Seddi, Çin’in kuzeyinde farklı dönemlerde inşa edilmiş savunma yapıları bütünüdür.' },
  { category: 'Tarih', question: 'Gize piramitleri hangi ülkededir?', answer: 'Mısır', distractors: ['Meksika', 'Peru', 'Yunanistan'], statement: 'Gize piramitleri Mısır’da bulunur.', falseStatement: 'Gize piramitleri Meksika’da bulunur.', explanation: 'Gize piramitleri, Kahire yakınlarında bulunan Eski Mısır anıtlarıdır.' },
  { category: 'Tarih', question: 'Antik Olimpiyat Oyunları hangi uygarlıkta ortaya çıkmıştır?', answer: 'Antik Yunan', distractors: ['Roma', 'Pers', 'Mısır'], statement: 'Antik Olimpiyat Oyunları Antik Yunan’da ortaya çıkmıştır.', falseStatement: 'Antik Olimpiyat Oyunları Antik Roma’da ortaya çıkmıştır.', explanation: 'Oyunlar, Antik Yunan’da Olympia’da düzenlenirdi.' },
  { category: 'Tarih', question: 'Rönesans hareketi ilk olarak hangi ülkede gelişmiştir?', answer: 'İtalya', distractors: ['Fransa', 'İngiltere', 'İspanya'], statement: 'Rönesans, ilk olarak İtalya’da gelişmiştir.', falseStatement: 'Rönesans, ilk olarak İngiltere’de gelişmiştir.', explanation: 'Rönesans’ın erken merkezleri Floransa gibi İtalyan şehirleridir.' },
  { category: 'Tarih', question: 'Avrupa’da matbaanın yaygınlaşmasıyla ilişkilendirilen Johannes Gutenberg hangi alanda tanınır?', answer: 'Matbaacılık', distractors: ['Denizcilik', 'Astronomi', 'Heykeltıraşlık'], statement: 'Johannes Gutenberg, Avrupa’da matbaacılığın gelişmesiyle tanınır.', falseStatement: 'Johannes Gutenberg, buharlı makinenin icadıyla tanınır.', explanation: 'Gutenberg’in hareketli metal harfli baskı sistemi Avrupa’da basımın yaygınlaşmasında etkili oldu.' },
  { category: 'Tarih', question: 'Birinci Dünya Savaşı hangi yıl başladı?', answer: '1914', distractors: ['1912', '1916', '1918'], statement: 'Birinci Dünya Savaşı 1914 yılında başladı.', falseStatement: 'Birinci Dünya Savaşı 1918 yılında başladı.', explanation: 'Savaş 1914’te başladı ve 1918’de ateşkesle sona erdi.' },
  { category: 'Tarih', question: 'Türkiye Cumhuriyeti hangi yıl ilan edildi?', answer: '1923', distractors: ['1919', '1920', '1938'], statement: 'Türkiye Cumhuriyeti 1923 yılında ilan edildi.', falseStatement: 'Türkiye Cumhuriyeti 1920 yılında ilan edildi.', explanation: 'Cumhuriyet 29 Ekim 1923’te ilan edildi.' },
  { category: 'Tarih', question: 'Türkiye Cumhuriyeti’nin ilk cumhurbaşkanı kimdir?', answer: 'Mustafa Kemal Atatürk', distractors: ['İsmet İnönü', 'Celâl Bayar', 'Fevzi Çakmak'], statement: 'Mustafa Kemal Atatürk, Türkiye Cumhuriyeti’nin ilk cumhurbaşkanıdır.', falseStatement: 'İsmet İnönü, Türkiye Cumhuriyeti’nin ilk cumhurbaşkanıdır.', explanation: 'Atatürk, 29 Ekim 1923’te cumhurbaşkanı seçildi.' },
  { category: 'Tarih', question: 'Apollo 11’in Ay’a insanlı inişi hangi yıl gerçekleşti?', answer: '1969', distractors: ['1959', '1965', '1972'], statement: 'Apollo 11, 1969 yılında Ay’a insanlı iniş gerçekleştirdi.', falseStatement: 'Apollo 11, 1972 yılında Ay’a insanlı iniş gerçekleştirdi.', explanation: 'Neil Armstrong ve Buzz Aldrin, Temmuz 1969’da Ay yüzeyine indi.' },
  { category: 'Tarih', question: 'İkinci Dünya Savaşı hangi yıl sona erdi?', answer: '1945', distractors: ['1939', '1941', '1950'], statement: 'İkinci Dünya Savaşı 1945 yılında sona erdi.', falseStatement: 'İkinci Dünya Savaşı 1939 yılında sona erdi.', explanation: 'Avrupa’da savaş Mayıs 1945’te, Japonya’nın teslim olmasıyla küresel savaş Eylül 1945’te sona erdi.' },
  { category: 'Tarih', question: 'Magna Carta hangi yıl kabul edildi?', answer: '1215', distractors: ['1066', '1492', '1776'], statement: 'Magna Carta 1215 yılında mühürlendi.', falseStatement: 'Magna Carta 1492 yılında mühürlendi.', explanation: 'İngiltere Kralı John, Magna Carta’yı 1215’te mühürledi.' },
  { category: 'Sanat', question: 'Hamlet adlı eserin yazarı kimdir?', answer: 'William Shakespeare', distractors: ['Charles Dickens', 'Victor Hugo', 'Molière'], statement: 'Hamlet adlı oyunu William Shakespeare yazmıştır.', falseStatement: 'Hamlet adlı oyunu Victor Hugo yazmıştır.', explanation: 'Hamlet, William Shakespeare’in trajedilerinden biridir.' },
  { category: 'Sanat', question: 'Dokuzuncu Senfoni hangi besteciyle özdeşleşmiştir?', answer: 'Ludwig van Beethoven', distractors: ['Mozart', 'Bach', 'Chopin'], statement: 'Dokuzuncu Senfoni, Ludwig van Beethoven’ın eseridir.', falseStatement: 'Dokuzuncu Senfoni, Wolfgang Amadeus Mozart’ın eseridir.', explanation: 'Beethoven’ın 9. Senfonisi, finalindeki Koro bölümüyle ünlüdür.' },
  { category: 'Sanat', question: 'Guernica tablosunu hangi sanatçı yapmıştır?', answer: 'Pablo Picasso', distractors: ['Salvador Dalí', 'Claude Monet', 'Edvard Munch'], statement: 'Guernica tablosunu Pablo Picasso yapmıştır.', falseStatement: 'Guernica tablosunu Claude Monet yapmıştır.', explanation: 'Picasso, Guernica’yı 1937’de İspanya İç Savaşı’ndaki bombardımana tepki olarak yaptı.' },
  { category: 'Sanat', question: 'Yıldızlı Gece tablosunun ressamı kimdir?', answer: 'Vincent van Gogh', distractors: ['Rembrandt', 'Paul Cézanne', 'Édouard Manet'], statement: 'Yıldızlı Gece tablosunu Vincent van Gogh yapmıştır.', falseStatement: 'Yıldızlı Gece tablosunu Rembrandt yapmıştır.', explanation: 'Yıldızlı Gece, Van Gogh’un 1889 tarihli tablosudur.' },
  { category: 'Sanat', question: 'Sihirli Flüt operasının bestecisi kimdir?', answer: 'Wolfgang Amadeus Mozart', distractors: ['Beethoven', 'Verdi', 'Vivaldi'], statement: 'Sihirli Flüt operasını Mozart bestelemiştir.', falseStatement: 'Sihirli Flüt operasını Giuseppe Verdi bestelemiştir.', explanation: 'Sihirli Flüt, Mozart’ın 1791’de sahnelenen operasıdır.' },
  { category: 'Sanat', question: 'Osmanlı döneminin ünlü mimarı Mimar Sinan hangi mesleğiyle tanınır?', answer: 'Mimar', distractors: ['Şair', 'Denizci', 'Ressam'], statement: 'Mimar Sinan, Osmanlı döneminin önemli mimarlarından biridir.', falseStatement: 'Mimar Sinan, Osmanlı döneminin ünlü denizcilerinden biridir.', explanation: 'Mimar Sinan, Süleymaniye ve Selimiye gibi eserlerle tanınır.' },
  { category: 'Sanat', question: 'İstiklâl Marşı’nın şairi kimdir?', answer: 'Mehmet Âkif Ersoy', distractors: ['Tevfik Fikret', 'Namık Kemal', 'Orhan Veli'], statement: 'İstiklâl Marşı’nın sözlerini Mehmet Âkif Ersoy yazmıştır.', falseStatement: 'İstiklâl Marşı’nın sözlerini Namık Kemal yazmıştır.', explanation: 'İstiklâl Marşı, Mehmet Âkif Ersoy’un şiiridir.' },
  { category: 'Genel Bilgi', question: 'Türk alfabesinde kaç harf vardır?', answer: '29', distractors: ['26', '28', '32'], statement: 'Türk alfabesinde 29 harf vardır.', falseStatement: 'Türk alfabesinde 26 harf vardır.', explanation: 'Türk alfabesi 29 harften oluşur.' },
  { category: 'Bilim', question: 'Balinalar hangi hayvan grubuna girer?', answer: 'Memeliler', distractors: ['Balıklar', 'Sürüngenler', 'Amfibiler'], statement: 'Balinalar balık değil, memelidir.', falseStatement: 'Balinalar balık sınıfına girer.', explanation: 'Balinalar akciğerleriyle solunum yapar ve yavrularını sütle besler.' },
  { category: 'Bilim', question: 'Yarasalar hangi hayvan grubuna girer?', answer: 'Memeliler', distractors: ['Kuşlar', 'Böcekler', 'Sürüngenler'], statement: 'Yarasalar memeli hayvanlardır.', falseStatement: 'Yarasalar kuş sınıfına girer.', explanation: 'Yarasalar uçabilen memelilerdir; yavrularını sütle beslerler.' },
  { category: 'Bilim', question: 'Penguenler hangi hayvan sınıfına girer?', answer: 'Kuşlar', distractors: ['Memeliler', 'Balıklar', 'Sürüngenler'], statement: 'Penguenler uçamayan kuşlardır.', falseStatement: 'Penguenler memeli hayvanlardır.', explanation: 'Penguenler tüyleri ve yumurtlamalarıyla kuş sınıfındadır.' },
  { category: 'Bilim', question: 'Örümceklerin kaç bacağı vardır?', answer: '8', distractors: ['6', '10', '12'], statement: 'Örümceklerin sekiz bacağı vardır.', falseStatement: 'Örümceklerin altı bacağı vardır.', explanation: 'Örümcekler örümceğimsiler sınıfındadır ve sekiz bacağa sahiptir.' },
  { category: 'Bilim', question: 'Böceklerin tipik olarak kaç bacağı bulunur?', answer: '6', distractors: ['4', '8', '10'], statement: 'Böceklerin altı bacağı bulunur.', falseStatement: 'Böceklerin sekiz bacağı bulunur.', explanation: 'Böcekler üç çift, yani altı bacağa sahiptir.' },
  { category: 'Bilim', question: 'Ahtapotların kaç kalbi vardır?', answer: '3', distractors: ['1', '2', '4'], statement: 'Ahtapotların üç kalbi vardır.', falseStatement: 'Ahtapotların bir kalbi vardır.', explanation: 'Ahtapotlarda iki kalp solungaçlara, bir kalp vücudun geri kalanına kan pompalar.' },
  { category: 'Bilim', question: 'Arıların ekosistemdeki önemli rollerinden biri nedir?', answer: 'Tozlaşmaya yardımcı olmak', distractors: ['Kayaları aşındırmak', 'Oksijen tüketimini durdurmak', 'Deniz suyunu arıtmak'], statement: 'Arılar birçok bitkinin tozlaşmasına yardımcı olur.', falseStatement: 'Arılar bitkilerin fotosentez yapmasını tek başına sağlar.', explanation: 'Arılar çiçekler arasında polen taşıyarak tozlaşmaya katkıda bulunur.' },
  { category: 'Bilim', question: 'Bambu bitkisi hangi bitki ailesine aittir?', answer: 'Buğdaygiller', distractors: ['Gülgiller', 'Baklagiller', 'Çamgiller'], statement: 'Bambu, buğdaygiller ailesinden bir ottur.', falseStatement: 'Bambu, çamgiller ailesinden bir ağaçtır.', explanation: 'Bambu, Poaceae yani buğdaygiller ailesinde yer alır.' },
  { category: 'Bilim', question: 'Fotosentez sırasında bitkiler atmosferden çoğunlukla hangi gazı alır?', answer: 'Karbondioksit', distractors: ['Azot', 'Helyum', 'Metan'], statement: 'Bitkiler fotosentez sırasında karbondioksit kullanır.', falseStatement: 'Bitkiler fotosentez sırasında helyum kullanır.', explanation: 'Fotosentezde bitkiler ışık enerjisiyle karbondioksit ve sudan organik madde üretir.' },
  { category: 'Bilim', question: 'DNA’nın yaygın yapısal modeli nasıldır?', answer: 'Çift sarmal', distractors: ['Tek düz zincir', 'Küp', 'Üçgen prizma'], statement: 'DNA’nın yapısı çift sarmal olarak tanımlanır.', falseStatement: 'DNA’nın yapısı tek katlı düz bir zincirdir.', explanation: 'DNA iki nükleotit zincirinin çift sarmal oluşturmasıyla tanımlanır.' },
  { category: 'Bilim', question: 'Ökaryot hücrelerde genetik materyalin büyük bölümü hangi yapıda bulunur?', answer: 'Çekirdek', distractors: ['Ribozom', 'Hücre zarı', 'Golgi aygıtı'], statement: 'Ökaryot hücrelerde DNA’nın büyük bölümü çekirdekte bulunur.', falseStatement: 'Ökaryot hücrelerde DNA’nın büyük bölümü hücre zarında bulunur.', explanation: 'Ökaryot hücrelerin çekirdeği, genetik materyalin büyük bölümünü barındırır.' },
  { category: 'Bilim', question: 'Hücrede enerji üretimiyle özellikle ilişkilendirilen organel hangisidir?', answer: 'Mitokondri', distractors: ['Lizozom', 'Golgi aygıtı', 'Koful'], statement: 'Mitokondri, hücresel enerji üretiminde önemli rol oynar.', falseStatement: 'Golgi aygıtı, hücresel enerjinin büyük bölümünü üretir.', explanation: 'Mitokondriler hücresel solunumla ATP üretiminde temel rol oynar.' },
  { category: 'Bilim', question: 'Kanın kırmızı görünmesinde hangi protein etkilidir?', answer: 'Hemoglobin', distractors: ['Keratin', 'İnsülin', 'Kolajen'], statement: 'Hemoglobin, kana kırmızı rengini veren proteindir.', falseStatement: 'Keratin, kana kırmızı rengini veren proteindir.', explanation: 'Hemoglobindeki demir içeren yapı kana kırmızı rengini verir.' },
  { category: 'Bilim', question: 'İnsan vücudunun en büyük organı hangisidir?', answer: 'Deri', distractors: ['Karaciğer', 'Akciğer', 'Kalp'], statement: 'Deri, insan vücudunun en büyük organıdır.', falseStatement: 'Kalp, insan vücudunun en büyük organıdır.', explanation: 'Deri vücudu kaplayan ve en geniş yüzey alanına sahip organdır.' },
  { category: 'Bilim', question: 'Yetişkin bir insan iskeletinde tipik olarak kaç kemik bulunur?', answer: '206', distractors: ['106', '180', '306'], statement: 'Yetişkin insan iskeletinde tipik olarak 206 kemik bulunur.', falseStatement: 'Yetişkin insan iskeletinde tipik olarak 306 kemik bulunur.', explanation: 'Yetişkinlerde kemiklerin bazıları gelişim sırasında birleştiği için sayı genellikle 206’dır.' },
  { category: 'Bilim', question: 'İnsan vücudundaki en uzun kemik hangisidir?', answer: 'Uyluk kemiği (femur)', distractors: ['Kaval kemiği', 'Kol kemiği', 'Köprücük kemiği'], statement: 'İnsan vücudundaki en uzun kemik femurdur.', falseStatement: 'İnsan vücudundaki en uzun kemik köprücük kemiğidir.', explanation: 'Femur, kalça ile diz arasında uzanan ve vücudun en uzun kemiği olan uyluk kemiğidir.' },
  { category: 'Bilim', question: 'Göz bebeğine giren ışık miktarını ayarlayan renkli yapı hangisidir?', answer: 'İris', distractors: ['Retina', 'Kornea', 'Optik sinir'], statement: 'İris, göz bebeğinin boyutunu değiştirerek ışık girişini düzenler.', falseStatement: 'Retina, göz bebeğinin boyutunu değiştirerek ışık girişini düzenler.', explanation: 'İris kasları kasılıp gevşeyerek göz bebeğinin çapını değiştirir.' },
  { category: 'Bilim', question: 'Beynin denge ve hareket koordinasyonunda önemli rol oynayan bölümü hangisidir?', answer: 'Beyincik', distractors: ['Omurilik soğanı', 'Hipotalamus', 'Talamus'], statement: 'Beyincik, denge ve hareket koordinasyonunda önemli rol oynar.', falseStatement: 'Beyincik, yalnızca koku duyusunu yönetir.', explanation: 'Beyincik hareketlerin koordinasyonu, denge ve duruş kontrolüne katkı sağlar.' },
  { category: 'Bilim', question: 'İnsan vücudundaki en sert madde hangisidir?', answer: 'Diş minesi', distractors: ['Kemik iliği', 'Kıkırdak', 'Tırnak'], statement: 'Diş minesi, insan vücudundaki en sert maddedir.', falseStatement: 'Tırnak, insan vücudundaki en sert maddedir.', explanation: 'Diş minesi yüksek oranda mineral içerir ve vücudun en sert dokusudur.' },
  { category: 'Bilim', question: 'Ses boşlukta nasıl yayılır?', answer: 'Yayılamaz', distractors: ['Işıktan hızlı yayılır', 'Yalnızca yukarı yayılır', 'Sürtünmeyle yayılır'], statement: 'Ses, yayılmak için maddesel bir ortama ihtiyaç duyar ve boşlukta ilerleyemez.', falseStatement: 'Ses, boşlukta da hava içindeki gibi ilerleyebilir.', explanation: 'Ses mekanik bir dalgadır; titreşimi taşıyacak parçacıklar bulunmayan boşlukta yayılamaz.' },
  { category: 'Bilim', question: 'Deniz seviyesinde saf su yaklaşık kaç °C’de kaynar?', answer: '100 °C', distractors: ['0 °C', '50 °C', '150 °C'], statement: 'Saf su, standart atmosfer basıncında yaklaşık 100 °C’de kaynar.', falseStatement: 'Saf su, standart atmosfer basıncında yaklaşık 50 °C’de kaynar.', explanation: 'Kaynama noktası basınca bağlıdır; standart atmosfer basıncında saf su yaklaşık 100 °C’de kaynar.' },
  { category: 'Bilim', question: 'Saf su standart basınçta yaklaşık kaç °C’de donar?', answer: '0 °C', distractors: ['-10 °C', '10 °C', '100 °C'], statement: 'Saf su standart basınçta yaklaşık 0 °C’de donar.', falseStatement: 'Saf su standart basınçta yaklaşık 100 °C’de donar.', explanation: 'Saf suyun donma noktası standart koşullarda yaklaşık 0 °C’dir.' },
  { category: 'Bilim', question: '25 °C’de saf suyun pH değeri yaklaşık kaçtır?', answer: '7', distractors: ['1', '5', '14'], statement: '25 °C’de saf su nötrdür ve pH değeri yaklaşık 7’dir.', falseStatement: '25 °C’de saf suyun pH değeri yaklaşık 1’dir.', explanation: '25 °C’de nötr saf suyun pH değeri yaklaşık 7’dir.' },
  { category: 'Bilim', question: 'Elektronun elektrik yükü nasıldır?', answer: 'Negatif', distractors: ['Pozitif', 'Nötr', 'Değişken'], statement: 'Elektron negatif elektrik yüküne sahiptir.', falseStatement: 'Elektron pozitif elektrik yüküne sahiptir.', explanation: 'Elektronun temel elektrik yükü negatiftir.' },
  { category: 'Bilim', question: 'Protonun elektrik yükü nasıldır?', answer: 'Pozitif', distractors: ['Negatif', 'Nötr', 'Yüksüz ama değişken'], statement: 'Proton pozitif elektrik yüküne sahiptir.', falseStatement: 'Proton negatif elektrik yüküne sahiptir.', explanation: 'Protonun elektrik yükü +1 temel yüktür.' },
  { category: 'Bilim', question: 'Nötronun elektrik yükü nasıldır?', answer: 'Nötr', distractors: ['Pozitif', 'Negatif', 'Çift pozitif'], statement: 'Nötronun elektrik yükü yoktur.', falseStatement: 'Nötron negatif elektrik yüküne sahiptir.', explanation: 'Nötron elektriksel olarak yüksüz bir atom altı parçacıktır.' },
  { category: 'Bilim', question: 'Periyodik tablonun erken biçimini geliştirmesiyle tanınan bilim insanı kimdir?', answer: 'Dmitri Mendeleyev', distractors: ['Isaac Newton', 'Marie Curie', 'Niels Bohr'], statement: 'Dmitri Mendeleyev, periyodik tablonun geliştirilmesinde öncü olmuştur.', falseStatement: 'Isaac Newton, periyodik tablonun geliştirilmesinde öncü olmuştur.', explanation: 'Mendeleyev 1869’da elementleri düzenleyen etkili periyodik tablo biçimini yayımladı.' },
  { category: 'Bilim', question: 'Karbon elementinin atom numarası kaçtır?', answer: '6', distractors: ['4', '8', '12'], statement: 'Karbonun atom numarası 6’dır.', falseStatement: 'Karbonun atom numarası 12’dir.', explanation: 'Karbon atomlarının çekirdeğinde altı proton bulunur.' },
  { category: 'Bilim', question: 'Altının kimyasal sembolü nedir?', answer: 'Au', distractors: ['Ag', 'Al', 'Fe'], statement: 'Altının kimyasal sembolü Au’dur.', falseStatement: 'Altının kimyasal sembolü Ag’dir.', explanation: 'Au sembolü Latince aurum sözcüğünden gelir; Ag gümüşün sembolüdür.' },
  { category: 'Bilim', question: 'Sodyum elementinin sembolü nedir?', answer: 'Na', distractors: ['So', 'S', 'Sn'], statement: 'Sodyumun kimyasal sembolü Na’dır.', falseStatement: 'Sodyumun kimyasal sembolü Sn’dir.', explanation: 'Na sembolü Latince natrium adından gelir.' },
  { category: 'Bilim', question: 'Demir elementinin kimyasal sembolü nedir?', answer: 'Fe', distractors: ['D', 'Ir', 'Dr'], statement: 'Demirin kimyasal sembolü Fe’dir.', falseStatement: 'Demirin kimyasal sembolü Ir’dir.', explanation: 'Fe sembolü Latince ferrum sözcüğünden gelir.' },
  { category: 'Bilim', question: 'Karbondioksit molekülünde kaç oksijen atomu bulunur?', answer: '2', distractors: ['1', '3', '4'], statement: 'Bir karbondioksit molekülünde iki oksijen atomu bulunur.', falseStatement: 'Bir karbondioksit molekülünde üç oksijen atomu bulunur.', explanation: 'CO₂ formülündeki alt indis 2, iki oksijen atomunu belirtir.' },
  { category: 'Bilim', question: 'Sürtünme kuvveti genellikle hangi harekete karşı koyar?', answer: 'Temas eden yüzeylerin göreli hareketine', distractors: ['Kütle çekimine', 'Işığın yayılmasına', 'Manyetik kutuplara'], statement: 'Sürtünme kuvveti, temas eden yüzeylerin göreli hareketine karşı koyar.', falseStatement: 'Sürtünme kuvveti, temas eden yüzeylerin hareketini daima hızlandırır.', explanation: 'Sürtünme, temas eden yüzeylerin birbirine göre hareketini veya hareket eğilimini engeller.' },
  { category: 'Bilim', question: 'Elektrik akımının SI birimi nedir?', answer: 'Amper', distractors: ['Volt', 'Watt', 'Ohm'], statement: 'Elektrik akımının SI birimi amperdir.', falseStatement: 'Elektrik akımının SI birimi volttur.', explanation: 'Amper elektrik akımını, volt elektrik potansiyel farkını ölçer.' },
  { category: 'Bilim', question: 'Gücün SI birimi nedir?', answer: 'Watt', distractors: ['Joule', 'Newton', 'Pascal'], statement: 'Gücün SI birimi watt’tır.', falseStatement: 'Gücün SI birimi joule’dür.', explanation: 'Watt güç birimidir; joule enerji birimidir.' },
  { category: 'Bilim', question: 'Enerjinin SI birimi nedir?', answer: 'Joule', distractors: ['Watt', 'Newton', 'Amper'], statement: 'Enerjinin SI birimi joule’dür.', falseStatement: 'Enerjinin SI birimi newton’dur.', explanation: 'Joule enerji ve işin SI birimidir.' },
  { category: 'Teknoloji', question: 'İkili sayı sistemi hangi tabana dayanır?', answer: '2', distractors: ['8', '10', '16'], statement: 'İkili sayı sistemi 2 tabanını kullanır.', falseStatement: 'İkili sayı sistemi 10 tabanını kullanır.', explanation: 'İkili sistemde yalnızca 0 ve 1 rakamları kullanılır.' },
  { category: 'Teknoloji', question: 'Python hangi alanda kullanılan bir dildir?', answer: 'Programlama', distractors: ['Doğal dil', 'Müzik notasyonu', 'İşaret dili'], statement: 'Python bir programlama dilidir.', falseStatement: 'Python bir veritabanı donanım standardıdır.', explanation: 'Python, genel amaçlı ve yaygın kullanılan bir programlama dilidir.' },
  { category: 'Teknoloji', question: 'HTML’nin temel görevi nedir?', answer: 'Web sayfasının yapısını tanımlamak', distractors: ['Elektrik akımını ölçmek', 'Görüntü sıkıştırmak', 'İşletim sistemi çalıştırmak'], statement: 'HTML, web sayfalarının yapısını tanımlamak için kullanılır.', falseStatement: 'HTML, bilgisayarın işlemci hızını artırmak için kullanılır.', explanation: 'HTML, web belgelerindeki başlık, paragraf, bağlantı gibi yapısal öğeleri tanımlar.' },
  { category: 'Teknoloji', question: 'HTTP temel olarak ne için kullanılır?', answer: 'Web üzerinde veri aktarımı', distractors: ['Görüntü çizimi', 'Pil şarjı', 'Ses kaydı'], statement: 'HTTP, web üzerinde istemci ve sunucu arasında veri aktarımı için kullanılan protokoldür.', falseStatement: 'HTTP, bilgisayarların pil seviyesini ölçen bir protokoldür.', explanation: 'HTTP, web kaynaklarının istek ve yanıtlarla aktarılmasını tanımlar.' },
  { category: 'Teknoloji', question: 'QR kısaltmasının açılımı nedir?', answer: 'Quick Response', distractors: ['Quality Record', 'Quantum Read', 'Quick Radio'], statement: 'QR, Quick Response ifadesinin kısaltmasıdır.', falseStatement: 'QR, Quality Record ifadesinin kısaltmasıdır.', explanation: 'QR kod adı, hızlı okunabilen iki boyutlu kod sisteminden gelir.' },
  { category: 'Teknoloji', question: 'GPS kısaltmasının açılımı nedir?', answer: 'Global Positioning System', distractors: ['General Power Service', 'Global Program Signal', 'Geographic Print System'], statement: 'GPS, Global Positioning System ifadesinin kısaltmasıdır.', falseStatement: 'GPS, General Power Service ifadesinin kısaltmasıdır.', explanation: 'GPS, uydu sinyalleriyle konum belirlemeye yarayan küresel konumlama sistemidir.' },
  { category: 'Teknoloji', question: 'World Wide Web’in mucidi olarak kim tanınır?', answer: 'Tim Berners-Lee', distractors: ['Bill Gates', 'Steve Jobs', 'Alan Turing'], statement: 'World Wide Web, Tim Berners-Lee tarafından geliştirilmiştir.', falseStatement: 'World Wide Web, Steve Jobs tarafından geliştirilmiştir.', explanation: 'Tim Berners-Lee, 1989’da Web’in temel önerisini geliştirdi.' },
  { category: 'Teknoloji', question: 'USB kısaltmasının açılımı nedir?', answer: 'Universal Serial Bus', distractors: ['Unified System Board', 'Universal Storage Base', 'User Signal Bridge'], statement: 'USB, Universal Serial Bus ifadesinin kısaltmasıdır.', falseStatement: 'USB, Universal Storage Base ifadesinin kısaltmasıdır.', explanation: 'USB, çevre birimlerini bağlamak ve veri aktarmak için kullanılan standarttır.' },
  { category: 'Teknoloji', question: 'CPU’nun temel görevi nedir?', answer: 'Komutları işlemek', distractors: ['Ekranı temizlemek', 'İnterneti dağıtmak', 'Sesi hoparlöre dönüştürmek'], statement: 'CPU, bilgisayarın komutları işleyen merkezi işlem birimidir.', falseStatement: 'CPU, bilgisayarın yalnızca görüntü depolayan birimidir.', explanation: 'CPU, program komutlarını yürütür ve bilgisayarın temel işlem merkezidir.' },
  { category: 'Teknoloji', question: 'RAM’in önemli bir özelliği nedir?', answer: 'Elektrik kesilince içerik kaybolur', distractors: ['Verileri daima kalıcı saklar', 'Yalnızca ses depolar', 'İşlemci yerine geçer'], statement: 'RAM, genellikle elektrik kesildiğinde içeriğini kaybeden geçici bellektir.', falseStatement: 'RAM, elektrik kesildiğinde verileri daima kalıcı olarak saklar.', explanation: 'RAM uçucu bellektir; kalıcı saklama için SSD veya HDD gibi depolama birimleri kullanılır.' },
  { category: 'Teknoloji', question: 'Dijital bir görüntünün temel küçük örnek noktası nedir?', answer: 'Piksel', distractors: ['Bayt', 'Hertz', 'Volt'], statement: 'Piksel, dijital görüntüyü oluşturan temel görüntü öğelerinden biridir.', falseStatement: 'Piksel, işlemcinin saat frekansını ölçen birimdir.', explanation: 'Piksel, raster görüntülerde renk bilgisi taşıyan en küçük görüntü birimidir.' },
  { category: 'Teknoloji', question: 'Bir bayt kaç bitten oluşur?', answer: '8', distractors: ['4', '10', '16'], statement: 'Bir bayt sekiz bitten oluşur.', falseStatement: 'Bir bayt on bitten oluşur.', explanation: 'Standart bilgisayar kullanımında bir bayt sekiz bittir.' },
  { category: 'Spor', question: 'Bir futbol takımının sahada aynı anda kaç oyuncusu bulunur?', answer: '11', distractors: ['9', '10', '12'], statement: 'Bir futbol takımı normal oyunda sahada 11 oyuncuyla yer alır.', falseStatement: 'Bir futbol takımı normal oyunda sahada 9 oyuncuyla yer alır.', explanation: 'Standart futbol maçında her takım kaleci dahil 11 oyuncuyla başlar.' },
  { category: 'Spor', question: 'Basketbolda bir takım sahada aynı anda kaç oyuncuyla oynar?', answer: '5', distractors: ['4', '6', '7'], statement: 'Basketbolda bir takım sahada aynı anda beş oyuncuyla oynar.', falseStatement: 'Basketbolda bir takım sahada aynı anda yedi oyuncuyla oynar.', explanation: 'Standart basketbolda her takımın sahada beş oyuncusu bulunur.' },
  { category: 'Spor', question: 'Teniste bir takvim yılında düzenlenen Grand Slam turnuvası sayısı kaçtır?', answer: '4', distractors: ['2', '3', '5'], statement: 'Teniste yılda dört Grand Slam turnuvası düzenlenir.', falseStatement: 'Teniste yılda beş Grand Slam turnuvası düzenlenir.', explanation: 'Avustralya Açık, Fransa Açık, Wimbledon ve ABD Açık dört Grand Slam turnuvasıdır.' },
  { category: 'Spor', question: 'Voleybolda bir takım sahada aynı anda kaç oyuncuyla bulunur?', answer: '6', distractors: ['5', '7', '8'], statement: 'Salon voleybolunda bir takım sahada altı oyuncuyla bulunur.', falseStatement: 'Salon voleybolunda bir takım sahada sekiz oyuncuyla bulunur.', explanation: 'Salon voleybolunda her takımın sahada altı oyuncusu vardır.' },
  { category: 'Spor', question: 'Resmî maraton koşusunun uzunluğu kaç kilometredir?', answer: '42,195 km', distractors: ['21,1 km', '40 km', '50 km'], statement: 'Maratonun resmî mesafesi 42,195 kilometredir.', falseStatement: 'Maratonun resmî mesafesi 21,1 kilometredir.', explanation: 'Maraton mesafesi 42 kilometre 195 metredir.' },
  { category: 'Spor', question: 'Standart satranç tahtasında kaç kare vardır?', answer: '64', distractors: ['32', '48', '100'], statement: 'Standart satranç tahtasında 64 kare bulunur.', falseStatement: 'Standart satranç tahtasında 100 kare bulunur.', explanation: 'Satranç tahtası 8 satır ve 8 sütundan oluşur: 8 × 8 = 64.' },
  { category: 'Spor', question: 'Satrançta şah normal bir hamlede en fazla kaç kare ilerleyebilir?', answer: '1', distractors: ['2', '3', '4'], statement: 'Satrançta şah, rok dışında normal bir hamlede bitişik bir kareye ilerler.', falseStatement: 'Satrançta şah, normal bir hamlede üç kare ilerleyebilir.', explanation: 'Şah her yönde bir kare hareket eder; rok özel bir hamledir.' },
  { category: 'Spor', question: 'Futbolda uzatmalar hariç normal maç süresi kaç dakikadır?', answer: '90', distractors: ['60', '80', '100'], statement: 'Futbolda normal maç süresi, iki 45 dakikalık devreyle toplam 90 dakikadır.', falseStatement: 'Futbolda normal maç süresi, iki 30 dakikalık devreyle toplam 60 dakikadır.', explanation: 'Standart futbol maçı iki eşit 45 dakikalık devreden oluşur.' },
  { category: 'Spor', question: 'Olimpiyat bayrağında kaç iç içe geçmiş halka vardır?', answer: '5', distractors: ['4', '6', '7'], statement: 'Olimpiyat bayrağında beş iç içe geçmiş halka bulunur.', falseStatement: 'Olimpiyat bayrağında yedi iç içe geçmiş halka bulunur.', explanation: 'Beş halka, olimpik hareketin beş kıtasını simgelemek üzere kullanılır.' },
  { category: 'Genel Bilgi', question: 'Bir haftada kaç gün vardır?', answer: '7', distractors: ['5', '6', '8'], statement: 'Bir hafta yedi günden oluşur.', falseStatement: 'Bir hafta sekiz günden oluşur.', explanation: 'Yaygın kullanılan Gregoryen takviminde hafta yedi gündür.' },
  { category: 'Genel Bilgi', question: 'Bir düzine kaç adettir?', answer: '12', distractors: ['10', '6', '24'], statement: 'Bir düzine 12 adettir.', falseStatement: 'Bir düzine 10 adettir.', explanation: 'Düzine, on iki parçalık sayım birimidir.' },
  { category: 'Genel Bilgi', question: 'Roma rakamlarında X hangi sayıyı gösterir?', answer: '10', distractors: ['5', '50', '100'], statement: 'Roma rakamlarında X, 10 değerini gösterir.', falseStatement: 'Roma rakamlarında X, 50 değerini gösterir.', explanation: 'Roma rakamlarında I=1, V=5, X=10, L=50 ve C=100’dür.' },
  { category: 'Genel Bilgi', question: 'Dünya üzerindeki kıta sayısı yaygın sınıflandırmada kaçtır?', answer: '7', distractors: ['5', '6', '8'], statement: 'Yaygın yedi kıta modelinde Dünya yedi kıtaya ayrılır.', falseStatement: 'Yaygın yedi kıta modelinde Dünya dört kıtaya ayrılır.', explanation: 'Yaygın modelde Asya, Afrika, Kuzey Amerika, Güney Amerika, Antarktika, Avrupa ve Avustralya sayılır.' },
  { category: 'Genel Bilgi', question: 'Gökkuşağında geleneksel olarak kaç renk sayılır?', answer: '7', distractors: ['5', '6', '8'], statement: 'Gökkuşağının geleneksel renk sınıflandırmasında yedi renk sayılır.', falseStatement: 'Gökkuşağının geleneksel renk sınıflandırmasında üç renk sayılır.', explanation: 'Geleneksel sınıflandırma kırmızı, turuncu, sarı, yeşil, mavi, lacivert ve mor renklerini sayar.' },
  { category: 'Genel Bilgi', question: 'Bir yıl, artık yıl değilse kaç gündür?', answer: '365', distractors: ['360', '364', '366'], statement: 'Artık yıl olmayan bir takvim yılı 365 gündür.', falseStatement: 'Artık yıl olmayan bir takvim yılı 366 gündür.', explanation: 'Gregoryen takviminde normal yıl 365, artık yıl 366 gündür.' },
  { category: 'Genel Bilgi', question: 'Dünya üzerindeki en büyük memeli hayvan hangisidir?', answer: 'Mavi balina', distractors: ['Afrika fili', 'Zürafa', 'Orka'], statement: 'Mavi balina, bilinen en büyük hayvandır.', falseStatement: 'Afrika fili, bilinen en büyük hayvandır.', explanation: 'Mavi balina, yaşayan en büyük hayvan ve en büyük memelidir.' },
  { category: 'Genel Bilgi', question: 'Arıların ürettiği tatlı besin nedir?', answer: 'Bal', distractors: ['Pekmez', 'Nektar', 'Reçel'], statement: 'Bal, bal arılarının nektarı işleyerek ürettiği bir besindir.', falseStatement: 'Bal, bitkilerin köklerinde doğal olarak ürettiği bir öz sudur.', explanation: 'Bal arıları nektarı toplar, işler ve peteklerde olgunlaştırır.' },
  { category: 'Genel Bilgi', question: 'Dünyanın en büyük kara hayvanı hangisidir?', answer: 'Afrika fili', distractors: ['Gergedan', 'Su aygırı', 'Zürafa'], statement: 'Afrika fili, yaşayan en büyük kara hayvanıdır.', falseStatement: 'Zürafa, yaşayan en büyük kara hayvanıdır.', explanation: 'Afrika fili, yaşayan kara hayvanları arasında en büyük kütleye sahiptir.' },
  { category: 'Genel Bilgi', question: 'Işık yılı neyi ölçmek için kullanılır?', answer: 'Mesafeyi', distractors: ['Zamanı', 'Kütleyi', 'Sıcaklığı'], statement: 'Işık yılı, ışığın bir yılda aldığı mesafeyi ifade eder.', falseStatement: 'Işık yılı, bir yıldaki saniye sayısını ifade eder.', explanation: 'Işık yılı zaman değil, astronomide kullanılan bir uzaklık birimidir.' },
  { category: 'Genel Bilgi', question: 'Dünya’nın şekline en yakın bilimsel tanım hangisidir?', answer: 'Geoit', distractors: ['Küp', 'Düz disk', 'Tam küre'], statement: 'Dünya’nın gerçek şekli yaklaşık geoit olarak tanımlanır.', falseStatement: 'Dünya’nın gerçek şekli kusursuz bir küptür.', explanation: 'Dünya kutuplardan basık, ekvatordan şişkin ve düzensiz bir geoit biçimindedir.' },
  { category: 'Genel Bilgi', question: 'İnsanların zamanı ölçmek için kullandığı standart bir saat kaç dakikadır?', answer: '60 dakika', distractors: ['50 dakika', '90 dakika', '100 dakika'], statement: 'Bir saat 60 dakikadan oluşur.', falseStatement: 'Bir saat 100 dakikadan oluşur.', explanation: 'Zaman ölçümünde bir saat 60 dakikadır.' },
  { category: 'Genel Bilgi', question: 'Bir gün kaç saatten oluşur?', answer: '24 saat', distractors: ['12 saat', '18 saat', '30 saat'], statement: 'Bir gün 24 saatten oluşur.', falseStatement: 'Bir gün 30 saatten oluşur.', explanation: 'Bir günün standart süresi 24 saattir.' },
  { category: 'Genel Bilgi', question: 'Bir yılda kaç ay bulunur?', answer: '12 ay', distractors: ['10 ay', '11 ay', '13 ay'], statement: 'Bir yılda 12 ay bulunur.', falseStatement: 'Bir yılda 10 ay bulunur.', explanation: 'Takvim yılı ocaktan aralığa kadar 12 aydır.' },
  { category: 'Doğa', question: 'Güneş sabah genellikle hangi yönden doğar?', answer: 'Doğu', distractors: ['Batı', 'Kuzey', 'Güney'], statement: 'Güneş doğudan doğar.', falseStatement: 'Güneş batıdan doğar.', explanation: 'Dünya’nın dönüşü nedeniyle Güneş doğu yönünde doğuyor gibi görünür.' },
  { category: 'Bilim', question: 'Buz eridiğinde hangi hâle geçer?', answer: 'Sıvı', distractors: ['Gaz', 'Katı', 'Plazma'], statement: 'Buz eridiğinde sıvı suya dönüşür.', falseStatement: 'Buz eridiğinde doğrudan metale dönüşür.', explanation: 'Erime, katı maddenin sıvı hâle geçmesidir.' },
  { category: 'Genel Bilgi', question: 'Bir üçgenin kaç kenarı vardır?', answer: '3', distractors: ['2', '4', '5'], statement: 'Bir üçgenin üç kenarı vardır.', falseStatement: 'Bir üçgenin dört kenarı vardır.', explanation: 'Üçgen, üç kenarı ve üç köşesi olan geometrik şekildir.' },
  { category: 'Genel Bilgi', question: 'Bir karenin kaç kenarı vardır?', answer: '4', distractors: ['3', '5', '6'], statement: 'Bir karenin dört kenarı vardır.', falseStatement: 'Bir karenin beş kenarı vardır.', explanation: 'Karenin dört eşit kenarı ve dört köşesi vardır.' },
  { category: 'Genel Bilgi', question: 'Bir elde normalde kaç parmak bulunur?', answer: '5', distractors: ['4', '6', '10'], statement: 'Bir elde beş parmak bulunur.', falseStatement: 'Bir elde altı parmak bulunur.', explanation: 'Bir elde başparmak dâhil beş parmak bulunur.' },
  { category: 'Genel Bilgi', question: 'Pazar gününden sonra hangi gün gelir?', answer: 'Pazartesi', distractors: ['Cumartesi', 'Salı', 'Çarşamba'], statement: 'Pazar gününden sonra pazartesi gelir.', falseStatement: 'Pazar gününden sonra cuma gelir.', explanation: 'Haftanın günleri pazarın ardından pazartesiyle devam eder.' },
  { category: 'Bilim', question: 'Sıcaklığı ölçmek için hangi araç kullanılır?', answer: 'Termometre', distractors: ['Cetvel', 'Terazi', 'Pusula'], statement: 'Sıcaklık termometre ile ölçülür.', falseStatement: 'Sıcaklık cetvel ile ölçülür.', explanation: 'Termometre sıcaklığı ölçmek için kullanılan araçtır.' },
  { category: 'Genel Bilgi', question: 'Bir kilometre kaç metredir?', answer: '1000 metre', distractors: ['100 metre', '500 metre', '10.000 metre'], statement: 'Bir kilometre 1000 metredir.', falseStatement: 'Bir kilometre 100 metredir.', explanation: 'Metrik sistemde 1 kilometre, 1000 metreye eşittir.' },
];

const easyFactIds = new Set([
  // Günlük yaşamda sık karşılaşılan, kısa ve temel bilgiler.
  1, 3, 4, 5, 6, 7, 8, 12, 23, 25, 27, 29, 30, 31, 32, 33, 34,
  39, 40, 49, 50, 51, 52, 53, 54, 55, 56, 58, 65, 71, 72, 73,
  16, 21, 100, 101, 103, 105, 107, 108, 109, 110, 111, 113, 114,
  115, 116, 117, 120, 121, 122, 123, 124, 125, 126, 127, 128, 129, 130,
]);

export const knowledgeFacts: KnowledgeFact[] = factRows.map((fact, index) => ({
  ...fact,
  id: index + 1,
  difficulty: easyFactIds.has(index + 1) ? 'Kolay' : 'Orta',
}));

export const easyKnowledgeFacts = knowledgeFacts.filter((fact) => fact.difficulty === 'Kolay');

export const triviaQuestionBank: QuizQuestion[] = knowledgeFacts.map((fact) => ({
  id: fact.id,
  question: fact.question,
  options: [fact.answer, ...fact.distractors],
  answer: 0,
  topic: fact.category,
  difficulty: fact.difficulty ?? 'Orta',
  explanation: fact.explanation,
}));

function optionsFor(answer: number): { options: string[]; answerIndex: number } {
  const candidates = [answer + 1, answer - 1, answer + 2, answer - 2, answer + 5, answer * 2, answer + 10]
    .filter((value) => value >= 0 && value !== answer);
  const distractors = [...new Set(candidates)].slice(0, 3);
  let next = answer + 3;
  while (distractors.length < 3) {
    if (next !== answer && !distractors.includes(next)) distractors.push(next);
    next += 1;
  }
  const options = [answer, ...distractors].map(String);
  return { options, answerIndex: 0 };
}

function buildIqBank(): QuizQuestion[] {
  const questions: QuizQuestion[] = [];
  let id = 1;
  const add = (sequence: number[], answer: number, topic: string, stepText: string, difficulty: 'Kolay' | 'Orta' = 'Kolay') => {
    const generated = optionsFor(answer);
    questions.push({
      id: id++,
      question: `Sayı dizisinde sıradaki sayı hangisi? ${sequence.join(', ')}, ?`,
      options: generated.options,
      answer: generated.answerIndex,
      topic,
      difficulty,
      explanation: stepText,
    });
  };

  // Başlangıç düzeyi: küçük sayılarla düzenli artış.
  [[1, 1], [2, 1], [3, 1], [4, 1], [5, 1], [6, 1], [7, 1], [8, 1], [9, 1], [10, 1],
    [1, 2], [2, 2], [3, 2], [4, 2], [5, 2], [6, 2], [7, 2], [8, 2], [9, 2], [10, 2]].forEach(([start, step]) => {
    const sequence = Array.from({ length: 4 }, (_, index) => start + index * step);
    add(sequence, start + 4 * step, 'İleri sayma', `Her adımda ${step} ekleniyor.`);
  });

  // Basit geri sayma.
  [[10, 1], [9, 1], [8, 1], [12, 2], [14, 2], [16, 2], [20, 2], [25, 5], [30, 5], [40, 5]].forEach(([start, step]) => {
    const sequence = Array.from({ length: 4 }, (_, index) => start - index * step);
    add(sequence, start - 4 * step, 'Geri sayma', `Her adımda ${step} çıkarılıyor.`);
  });

  // Beşer ve onar sayma: çarpma veya karmaşık kural gerektirmez.
  [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].forEach((start) => {
    const sequence = Array.from({ length: 4 }, (_, index) => start + index * 5);
    add(sequence, start + 20, 'Beşer sayma', 'Her adımda 5 ekleniyor.');
  });
  [0, 10, 20, 30, 40, 50, 60, 70, 80, 90].forEach((start) => {
    const sequence = Array.from({ length: 4 }, (_, index) => start + index * 10);
    add(sequence, start + 40, 'Onar sayma', 'Her adımda 10 ekleniyor.', 'Orta');
  });

  return questions;
}

export const iqQuestionBank = buildIqBank();

export type WordEntry = { word: string; category: string; hint: string; difficulty: 'Kolay' | 'Orta' | 'Zor' };

const wordRows: [string, string, string, WordEntry['difficulty']][] = [
  ['ARMUT','Meyve','Yeşil veya sarı olabilen sulu meyve','Kolay'], ['KİRAZ','Meyve','Sapıyla bilinen küçük kırmızı meyve','Kolay'], ['LİMON','Meyve','Ekşi ve sarı renkli narenciye','Kolay'], ['PORTAKAL','Meyve','C vitaminiyle anılan turuncu meyve','Kolay'], ['KARPUZ','Meyve','Yazın dilimlenerek yenir','Kolay'], ['ÇİLEK','Meyve','Küçük kırmızı, çekirdekleri dışındadır','Kolay'], ['ANANAS','Meyve','Dikenli kabuklu tropik meyve','Orta'], ['AVOKADO','Meyve','Yeşil etli, çekirdeği büyük meyve','Orta'], ['KAYISI','Meyve','Turuncu renkli yaz meyvesi','Kolay'], ['MANDALİNA','Meyve','Kolay soyulan narenciye','Orta'],
  ['KİTAP','Eşya','Sayfalardan oluşur','Kolay'], ['KALEM','Eşya','Yazı yazmaya yarar','Kolay'], ['DEFTER','Eşya','Not tutmak için kullanılır','Kolay'], ['MASA','Eşya','Üzerinde çalışılır veya yemek yenir','Kolay'], ['SANDALYE','Eşya','Oturmak için kullanılır','Kolay'], ['PENCERE','Eşya','Dışarıyı görmeyi sağlar','Orta'], ['ANAHTAR','Eşya','Kilidi açmaya yarar','Kolay'], ['ÇANTA','Eşya','Eşyaları taşımaya yarar','Kolay'], ['SAAT','Eşya','Zamanı gösterir','Kolay'], ['ŞEMSİYE','Eşya','Yağmurdan korur','Orta'],
  ['ASLAN','Hayvan','Yelesiyle tanınan büyük kedi','Kolay'], ['KAPLAN','Hayvan','Çizgili büyük kedi','Kolay'], ['ZÜRAFA','Hayvan','Uzun boynu ile tanınır','Kolay'], ['PENGUEN','Hayvan','Uçamayan, iyi yüzen kuş','Orta'], ['YUNUS','Hayvan','Denizde yaşayan zeki memeli','Kolay'], ['KAPLUMBAĞA','Hayvan','Sert kabuğuyla bilinir','Zor'], ['TİMSAH','Hayvan','Suda yaşayan büyük sürüngen','Orta'], ['KANGURU','Hayvan','Yavrusu kesesinde gelişir','Orta'], ['KİRPİ','Hayvan','Sırtında dikenleri bulunur','Kolay'], ['FİL','Hayvan','Uzun hortumlu büyük kara hayvanı','Kolay'],
  ['ANKARA','Şehir','Türkiye’nin başkenti','Kolay'], ['İSTANBUL','Şehir','Boğazıyla tanınan metropol','Kolay'], ['İZMİR','Şehir','Ege kıyısındaki büyük şehir','Kolay'], ['ANTALYA','Şehir','Akdeniz kıyısında turizm şehri','Kolay'], ['BURSA','Şehir','Uludağ ile tanınır','Kolay'], ['SİLOPİ','Şehir','Şırnak’ın ilçesi','Orta'], ['TOKYO','Şehir','Japonya’nın başkenti','Orta'], ['LONDRA','Şehir','Thames Nehri kıyısında başkent','Orta'], ['PARİS','Şehir','Eyfel Kulesi ile tanınır','Kolay'], ['ROMA','Şehir','İtalya’nın başkenti','Kolay'],
  ['BİLGİSAYAR','Teknoloji','İşlem yapmak için kullanılan cihaz','Zor'], ['TELEFON','Teknoloji','İletişim kurmaya yarar','Kolay'], ['KLAVYE','Teknoloji','Yazı yazmak için tuşları bulunur','Orta'], ['İNTERNET','Teknoloji','Dünya çapında ağ altyapısı','Orta'], ['YAZILIM','Teknoloji','Bilgisayara ne yapacağını söyler','Orta'], ['DONANIM','Teknoloji','Bilgisayarın fiziksel parçaları','Orta'], ['ROBOT','Teknoloji','Programlanabilir makine','Kolay'], ['EKRAN','Teknoloji','Görüntü gösterir','Kolay'], ['İŞLEMCİ','Teknoloji','Komutları yürütür','Orta'], ['PİKSEL','Teknoloji','Dijital görüntünün temel noktası','Orta'],
  ['GÜNEŞ','Doğa','Dünya’ya ışık ve ısı sağlar','Kolay'], ['YILDIZ','Doğa','Kendi ışığını üreten gök cismi','Kolay'], ['BULUT','Doğa','Gökyüzünde su damlacıkları taşır','Kolay'], ['OKYANUS','Doğa','Çok geniş tuzlu su kütlesi','Orta'], ['ORMAN','Doğa','Ağaçların yoğun olduğu alan','Kolay'], ['VOLKAN','Doğa','Lav çıkarabilen dağ yapısı','Orta'], ['DEPREM','Doğa','Yer kabuğundaki sarsıntı','Kolay'], ['ŞELALE','Doğa','Yüksekten dökülen akarsu','Orta'], ['BUZUL','Doğa','Karın sıkışmasıyla oluşan büyük buz kütlesi','Orta'], ['KUZEY','Doğa','Pusulada üst yön olarak gösterilir','Kolay'],
  ['MÜZİK','Sanat','Seslerin ritim ve melodiyle düzenlenmesi','Kolay'], ['RESİM','Sanat','Boyayla veya çizgiyle yapılan görsel sanat','Kolay'], ['TİYATRO','Sanat','Sahnede canlandırılan oyun sanatı','Orta'], ['HEYKEL','Sanat','Üç boyutlu sanat eseri','Orta'], ['ŞİİR','Sanat','Dizelerle yazılan edebî tür','Kolay'], ['ROMAN','Sanat','Uzun kurmaca anlatı türü','Kolay'], ['OPERA','Sanat','Müzik ve sahne sanatını birleştirir','Orta'], ['BALE','Sanat','Dans temelli sahne sanatı','Kolay'], ['FİLM','Sanat','Hareketli görüntülerle anlatı','Kolay'], ['FOTOĞRAF','Sanat','Kamerayla kaydedilen görüntü','Orta'],
  ['MATEMATİK','Ders','Sayılar ve yapılarla ilgilenir','Zor'], ['GEOMETRİ','Ders','Şekil ve uzay ilişkilerini inceler','Orta'], ['FİZİK','Ders','Madde ve enerjiyi inceler','Kolay'], ['KİMYA','Ders','Maddelerin yapısını ve tepkimelerini inceler','Kolay'], ['BİYOLOJİ','Ders','Canlıları inceler','Orta'], ['TARİH','Ders','Geçmişteki olayları inceler','Kolay'], ['COĞRAFYA','Ders','Yerleri ve Dünya’yı inceler','Orta'], ['ASTRONOMİ','Ders','Gök cisimlerini inceler','Zor'], ['FELSEFE','Ders','Varlık ve bilgi gibi konuları sorgular','Orta'], ['EDEBİYAT','Ders','Yazın eserleri alanı','Orta'],
  ['KÖPRÜ','Diğer','İki yakayı birbirine bağlar','Kolay'], ['MERDİVEN','Diğer','Katlar arasında çıkıp inmeyi sağlar','Orta'], ['GÖKKUŞAĞI','Diğer','Yağmur ve ışıkla görülebilen renkli yay','Zor'], ['PUSULA','Diğer','Yön bulmaya yarar','Kolay'], ['TAKVİM','Diğer','Günleri ve ayları gösterir','Kolay'], ['HARİTA','Diğer','Yerleri ve yönleri gösterir','Kolay'], ['BİLET','Diğer','Bir etkinliğe veya yolculuğa giriş sağlar','Kolay'], ['FENER','Diğer','Işık veren taşınabilir araç','Kolay'], ['YELKEN','Diğer','Rüzgârla hareket sağlayan kumaş','Orta'], ['LABİRENT','Diğer','Çıkışı bulunması gereken yollar bütünü','Orta'],
  ['KAVUN','Meyve','Yazın tüketilen, içi çoğunlukla turuncu meyve','Kolay'], ['ÜZÜM','Meyve','Salkım halinde yetişen küçük meyve','Kolay'], ['ŞEFTALİ','Meyve','Tüylü kabuğuyla tanınan yaz meyvesi','Orta'], ['NAR','Meyve','İçinde çok sayıda kırmızı tanecik bulunur','Kolay'], ['ELMA','Meyve','Kırmızı, yeşil veya sarı olabilen meyve','Kolay'],
  ['KOLTUK','Eşya','Birden fazla kişinin oturabildiği mobilya','Kolay'], ['LAMBA','Eşya','Işık vermek için kullanılır','Kolay'], ['BUZDOLABI','Eşya','Yiyecekleri soğuk tutar','Orta'], ['BİSİKLET','Eşya','Pedal çevirerek hareket ettirilir','Orta'], ['GÖMLEK','Eşya','Düğmeli üst giyim ürünü','Kolay'],
  ['KARTAL','Hayvan','Güçlü görüşlü yırtıcı kuş','Kolay'], ['TAVŞAN','Hayvan','Uzun kulaklarıyla tanınır','Kolay'], ['KURT','Hayvan','Sürü halinde yaşayabilen yırtıcı memeli','Kolay'], ['TİLKİ','Hayvan','Gür kuyruğuyla bilinen memeli','Kolay'], ['LEYLEK','Hayvan','Uzun bacaklı göçmen kuş','Orta'],
  ['ERZURUM','Şehir','Doğu Anadolu’da bulunan büyükşehir','Orta'], ['DİYARBAKIR','Şehir','Surlarıyla tanınan Güneydoğu Anadolu şehri','Zor'], ['ŞANLIURFA','Şehir','Göbeklitepe ile tanınan şehir','Zor'], ['MADRİD','Şehir','İspanya’nın başkenti','Orta'], ['ATİNA','Şehir','Yunanistan’ın başkenti','Kolay'], ['TORNAVİDA','Diğer','Vidayı sıkıp gevşetmeye yarayan alet','Orta'],
];

export const wordBank: WordEntry[] = wordRows.map(([word, category, hint, difficulty]) => ({ word, category, hint, difficulty }));

export type SequenceChallenge = {
  id: number;
  sequence: number[];
  answer: number;
  explanation: string;
  difficulty: 'Kolay' | 'Orta' | 'Zor';
  topic: string;
};

function buildSequenceBank(): SequenceChallenge[] {
  const rows: SequenceChallenge[] = [];
  let id = 1;
  const add = (sequence: number[], answer: number, topic: string, explanation: string, difficulty: SequenceChallenge['difficulty'] = 'Kolay') => {
    rows.push({ id: id++, sequence, answer, topic, explanation, difficulty });
  };

  // Easy: count forward by a constant amount.
  [[1, 1], [2, 1], [3, 1], [5, 1], [10, 1], [2, 2], [4, 2], [6, 2], [10, 2], [5, 5], [10, 5], [20, 5]].forEach(([start, step]) => {
    const sequence = Array.from({ length: 4 }, (_, index) => start + index * step);
    add(sequence, start + 4 * step, 'İleri sayma', `Her seferinde ${step} ekle.`);
  });

  // Easy: count backward.
  [[10, 1], [12, 1], [15, 2], [20, 2], [30, 5], [50, 10], [40, 5], [25, 5]].forEach(([start, step]) => {
    const sequence = Array.from({ length: 4 }, (_, index) => start - index * step);
    add(sequence, start - 4 * step, 'Geri sayma', `Her seferinde ${step} çıkar.`);
  });

  // Orta: ikiye katlama.
  [1, 2, 3, 4, 5, 6, 7, 8].forEach((start) => {
    const sequence = Array.from({ length: 3 }, (_, index) => start * 2 ** index);
    add(sequence, start * 8, 'İkiye katlama', 'Her sayı bir öncekinin iki katı.', 'Orta');
  });

  // Orta: basit çarpım tablosu örnekleri.
  [2, 3, 4, 5, 10, 6, 7, 8].forEach((step) => {
    const sequence = [step, step * 2, step * 3, step * 4];
    add(sequence, step * 5, 'Çarpım tablosu', `Sayılar ${step}’er ${step}’er artıyor.`, 'Orta');
  });

  // Kolay: üçer sayma.
  [1, 2, 4, 5, 7, 8, 10, 12].forEach((start) => {
    const sequence = Array.from({ length: 4 }, (_, index) => start + index * 3);
    add(sequence, start + 12, 'Üçer sayma', 'Her adımda 3 ekle.');
  });

  // Kolay: beşer sayma ile biraz daha büyük sayılar.
  [[15, 5], [20, 5], [25, 5], [30, 5], [35, 5], [40, 5]].forEach(([start, step]) => {
    const sequence = Array.from({ length: 4 }, (_, index) => start + index * step);
    add(sequence, start + 4 * step, 'Beşer sayma', `Her adımda ${step} ekleniyor.`);
  });

  return rows;
}

export const sequenceBank = buildSequenceBank();
