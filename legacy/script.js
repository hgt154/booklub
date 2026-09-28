/* ======================================================================
   DATA
====================================================================== */
const BOOKSTORES = [
  {
    id:'leguara', name:'Leguará', neighborhood:'Neubau', district:'1070',
    address:'Lindengasse 24, 1070 Wien', accent:'#2F6B4F', mark:'L',
    specialties:['Brazilian Literature','Latin American Literature','Philosophy','Sociology','History','Rare Books'],
    languages:['Portuguese','Spanish','German','English'],
    atmosphere:'Quiet & Scholarly, with a warm welcome', founded:2018,
    owner:'Beatriz Nogueira', ownerRole:'Founder',
    ownerPortrait:'https://images.unsplash.com/photo-1607346256330-dee7af15f7c5?auto=format&fit=crop&w=400&q=80',
    quote:"When we opened Leguará, we didn't want to build just another bookstore. We wanted to create a place where Brazilian and Latin American voices could travel across Europe. Every book on these shelves was chosen because it changed how I see the world — I hope it does the same for you.",
    story:"Leguará began in 2018 as a single suitcase of books Beatriz Nogueira carried from São Paulo to Vienna — Machado de Assis, Clarice Lispector, a battered copy of Grande Sertão: Veredas she couldn't bear to leave behind. What started as informal lending among homesick friends became a storefront on Lindengasse, then a philosophy corner, then a rare books room. Today Leguará is one of the few places in Central Europe where you can find first editions of Brazilian modernists next to well-worn paperbacks of Sociology and History, all chosen by hand.",
    mission:"To help Brazilian, Latin American and philosophical voices find readers who might otherwise never encounter them — and to make Vienna feel a little more like home for the Portuguese-speaking diaspora.",
    timeline:[
      {year:'2018', text:'Founded by Beatriz Nogueira on Lindengasse, starting with 200 titles carried from São Paulo.'},
      {year:'2019', text:'First "Brazilian Literature Night" — now a monthly tradition with a waiting list.'},
      {year:'2020', text:'Weathered the pandemic with a doorstep delivery bicycle and phone-in reading recommendations.'},
      {year:'2022', text:'Expanded into the neighbouring unit to open the Rare Books room.'},
      {year:'2024', text:'Hosted the first Vienna Latin American Literary Festival — 400 attendees over one weekend.'},
      {year:'2026', text:'Joins Estante as a founding partner bookstore.'},
    ],
    stats:{books:3204, followers:1247, eventsHosted:48, reserved:612, recentlyAdded:24},
    hours:[['Mon','Closed'],['Tue – Fri','10:00 – 19:00'],['Sat','10:00 – 17:00'],['Sun','12:00 – 16:00']],
    heroImg:'https://images.unsplash.com/photo-1521123845560-14093637aa7d?auto=format&fit=crop&w=1600&q=80',
    gallery:[
      'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1519682337058-a94d519337bc?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=800&q=80',
    ],
    instagram:'@leguara.vienna', badge:'Founding Partner',
  },
  {
    id:'pagina-dobrada', name:'Página Dobrada', neighborhood:'Margareten', district:'1050',
    address:'Margaretenstraße 55, 1050 Wien', accent:'#C1694F', mark:'P',
    specialties:['Contemporary Fiction','Poetry','Portuguese Literature','Spanish Literature'],
    languages:['Portuguese','Spanish','English'],
    atmosphere:'Cosy & Conversational', founded:2021,
    owner:'Tomás Rego', ownerRole:'Founder',
    ownerPortrait:'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=400&q=80',
    quote:"We fold pages, not corners — every dog-ear here tells us a book was truly read before it reached you.",
    story:"Tomás Rego opened Página Dobrada with a single shelf of secondhand poetry inside a shared studio space. Five years and one proper storefront later, it's become the go-to spot for contemporary Portuguese and Spanish-language fiction in Vienna, known for its Friday-night poetry readings held standing-room only.",
    mission:"To keep contemporary Iberian and Latin American voices in circulation, one well-loved copy at a time.",
    timeline:[
      {year:'2021', text:'Started as a single shelf inside a shared studio in Margareten.'},
      {year:'2022', text:'Opened a proper storefront after a crowdfunding campaign.'},
      {year:'2023', text:'Launched the weekly "Sextas de Poesia" reading nights.'},
      {year:'2025', text:'Reached 900 members in its reading community.'},
    ],
    stats:{books:1560, followers:583, eventsHosted:31, reserved:204, recentlyAdded:12},
    hours:[['Mon','Closed'],['Tue – Fri','11:00 – 19:00'],['Sat','10:00 – 18:00'],['Sun','Closed']],
    heroImg:'https://images.unsplash.com/photo-1526243741027-444d633d7365?auto=format&fit=crop&w=1600&q=80',
    gallery:[
      'https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1495640388908-05fa85288e61?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=800&q=80',
    ],
    instagram:'@paginadobrada', badge:'Community Favorite',
  },
  {
    id:'amaranth', name:'Buchhandlung Amaranth', neighborhood:'Josefstadt', district:'1080',
    address:'Florianigasse 12, 1080 Wien', accent:'#6B4F6B', mark:'A',
    specialties:['Philosophy','History','Small Press','Rare Books'],
    languages:['German','English','French'],
    atmosphere:'Quiet, Scholarly, a little mischievous', founded:2015,
    owner:'Elisabeth Gruber', ownerRole:'Founder',
    ownerPortrait:'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
    quote:"Philosophy shouldn't live only in seminar rooms. We wanted a place where a first-year student and a retired professor argue about Kant over the same table.",
    story:"Elisabeth Gruber left academia to open Amaranth in 2015, convinced Vienna needed a bookstore where philosophy wasn't intimidating. The shop's long communal reading table has hosted more late-night arguments about Kant, Arendt and Adorno than she can count — and she wouldn't have it any other way.",
    mission:"To make serious ideas approachable, and to give small philosophy presses a shelf when no one else will.",
    timeline:[
      {year:'2015', text:'Founded by Elisabeth Gruber, a former philosophy lecturer at the University of Vienna.'},
      {year:'2017', text:'Introduced the communal reading table, now the shop\'s signature.'},
      {year:'2020', text:'Began stocking exclusively small-press philosophy imprints.'},
      {year:'2024', text:'Started "Philosophy After Dark", a biweekly discussion night.'},
    ],
    stats:{books:2870, followers:764, eventsHosted:112, reserved:340, recentlyAdded:9},
    hours:[['Mon – Fri','09:30 – 18:30'],['Sat','10:00 – 16:00'],['Sun','Closed']],
    heroImg:'https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=1600&q=80',
    gallery:[
      'https://images.unsplash.com/photo-1524578271613-d550eacf6090?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=800&q=80',
    ],
    instagram:'@amaranth.buch', badge:'Founding Partner',
  },
  {
    id:'rua-nova', name:'Rua Nova Livros', neighborhood:'Favoriten', district:'1100',
    address:'Favoritenstraße 178, 1100 Wien', accent:'#B08D57', mark:'R',
    specialties:['Latin American Literature','Children\'s Books','Bilingual Editions'],
    languages:['Portuguese','Spanish','German'],
    atmosphere:'Playful & Bilingual', founded:2023,
    owner:'Marina Chávez', ownerRole:'Founder',
    ownerPortrait:'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
    quote:"Children deserve to fall in love with reading in their own language — and their neighbour's language too.",
    story:"Marina Chávez opened Rua Nova Livros to fill a gap she felt as a mother raising bilingual kids in Vienna: nowhere sold children's books in Spanish and Portuguese side by side with German. Today the shop's Saturday storytelling hour draws families from across the city.",
    mission:"To raise a generation of bilingual readers who feel equally at home in Portuguese, Spanish and German.",
    timeline:[
      {year:'2023', text:'Founded by Marina Chávez in Favoriten.'},
      {year:'2024', text:'Launched bilingual Saturday storytelling hour.'},
      {year:'2025', text:'Partnered with three local schools for reading workshops.'},
    ],
    stats:{books:980, followers:412, eventsHosted:26, reserved:158, recentlyAdded:18},
    hours:[['Mon','Closed'],['Tue – Sat','10:00 – 18:00'],['Sun','11:00 – 15:00']],
    heroImg:'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=1600&q=80',
    gallery:[
      'https://images.unsplash.com/photo-1519682337058-a94d519337bc?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1495640388908-05fa85288e61?auto=format&fit=crop&w=800&q=80',
    ],
    instagram:'@ruanovalivros', badge:'New',
  },
  {
    id:'cafe-com-livros', name:'Café com Livros', neighborhood:'Alsergrund', district:'1090',
    address:'Servitengasse 9, 1090 Wien', accent:'#8B6F47', mark:'C',
    specialties:['Travel Writing','Rare Books','Essays'],
    languages:['Portuguese','English','German'],
    atmosphere:'Cosy Literary Café', founded:2019,
    owner:'Inés Duarte', ownerRole:'Founder',
    ownerPortrait:'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=400&q=80',
    quote:"Coffee gets cold, but a good travel story keeps you somewhere else for hours.",
    story:"Part bookstore, part café, Inés Duarte's Servitengasse corner has become known for pairing rare travel writing with the best galão in Vienna. Regulars often arrive for coffee and leave with a book they didn't know they needed.",
    mission:"To give slow travel writing and personal essays a warm place to be discovered, one cup at a time.",
    timeline:[
      {year:'2019', text:'Opened as a six-table café with two shelves of travel writing.'},
      {year:'2021', text:'Expanded the book section to cover the entire back wall.'},
      {year:'2023', text:'Began hosting a monthly "Travel Pages Society" book club.'},
    ],
    stats:{books:740, followers:298, eventsHosted:19, reserved:96, recentlyAdded:7},
    hours:[['Mon – Sun','08:00 – 20:00']],
    heroImg:'https://images.unsplash.com/photo-1445116572660-236099ec97a0?auto=format&fit=crop&w=1600&q=80',
    gallery:[
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=800&q=80',
    ],
    instagram:'@cafecomlivros.vienna', badge:'Community Favorite',
  },
  {
    id:'casa-poetisas', name:'Casa das Poetisas', neighborhood:'Leopoldstadt', district:'1020',
    address:'Taborstraße 43, 1020 Wien', accent:'#A6473C', mark:'C',
    specialties:['Women\'s Writing','Poetry','Feminist Literature'],
    languages:['Portuguese','Spanish','German','English'],
    atmosphere:'Warm & Chatty', founded:2022,
    owner:'Renata Alves & Julia Hoffmann', ownerRole:'Co-founders',
    ownerPortrait:'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?auto=format&fit=crop&w=400&q=80',
    quote:"We built the shelf we couldn't find anywhere else — one where women's voices aren't a 'special section', they're the whole room.",
    story:"Renata Alves and Julia Hoffmann met at a poetry reading and, within a year, had opened Casa das Poetisas together — a bookstore built entirely around women's writing, from Lygia Fagundes Telles to contemporary Austrian poets, with nothing relegated to a token shelf.",
    mission:"To make women's writing — across languages and centuries — the whole story, not a subsection of it.",
    timeline:[
      {year:'2022', text:'Founded by Renata Alves and Julia Hoffmann in Leopoldstadt.'},
      {year:'2023', text:'Launched "Mulheres que Escrevem", a bilingual reading circle.'},
      {year:'2025', text:'Hosted its first International Women\'s Poetry Evening — sold out in two days.'},
    ],
    stats:{books:1120, followers:521, eventsHosted:37, reserved:189, recentlyAdded:15},
    hours:[['Mon','Closed'],['Tue – Sat','11:00 – 19:00'],['Sun','12:00 – 17:00']],
    heroImg:'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=1600&q=80',
    gallery:[
      'https://images.unsplash.com/photo-1519682337058-a94d519337bc?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1495640388908-05fa85288e61?auto=format&fit=crop&w=800&q=80',
    ],
    instagram:'@casadaspoetisas', badge:'New',
  },
];

const BOOKS = [
  {id:'dom-casmurro', title:'Dom Casmurro', author:'Machado de Assis', genre:'Brazilian Literature', color1:'#2F6B4F', color2:'#1F3327', desc:"Machado de Assis's most celebrated novel, narrated by the jealous, unreliable Bentinho as he reconstructs the story of his marriage to Capitu. A masterclass in ambiguity that still divides readers over one simple question: was she guilty?"},
  {id:'memorias-postumas', title:'Memórias Póstumas de Brás Cubas', author:'Machado de Assis', genre:'Brazilian Literature', color1:'#3F5B47', color2:'#1F3327', desc:"Narrated by a dead man looking back on his own mediocrity, this is one of the strangest and funniest novels of the 19th century — decades ahead of its time in form and voice."},
  {id:'hora-da-estrela', title:'A Hora da Estrela', author:'Clarice Lispector', genre:'Brazilian Literature', color1:'#C1694F', color2:'#8B3A2A', desc:"Clarice Lispector's final novel follows Macabéa, a poor typist from the Northeast, through the eyes of a narrator obsessed with — and unsettled by — her invisibility."},
  {id:'perto-coracao-selvagem', title:'Perto do Coração Selvagem', author:'Clarice Lispector', genre:'Brazilian Literature', color1:'#D98F73', color2:'#8B3A2A', desc:"Lispector's debut novel, written when she was just 23, announced a wholly new interior voice in Brazilian fiction through the restless consciousness of Joana."},
  {id:'grande-sertao', title:'Grande Sertão: Veredas', author:'Guimarães Rosa', genre:'Brazilian Literature', color1:'#8B6F47', color2:'#4A3A22', desc:"An epic monologue from the backlands of Brazil, told in a invented language of its own — often compared to Joyce for its radical reinvention of Portuguese prose."},
  {id:'gabriela', title:'Gabriela, Cravo e Canela', author:'Jorge Amado', genre:'Brazilian Literature', color1:'#B08D57', color2:'#6B4F2A', desc:"Set in the cacao boomtown of Ilhéus, this warm, sensuous novel follows Gabriela, a migrant worker whose freedom unsettles an entire town's conventions."},
  {id:'capitaes-areia', title:'Capitães da Areia', author:'Jorge Amado', genre:'Brazilian Literature', color1:'#A6473C', color2:'#5C2A22', desc:"A band of homeless children survive on the streets of Salvador in Amado's fierce, tender portrait of poverty, solidarity and resilience."},
  {id:'relato-oriente', title:'Relato de um Certo Oriente', author:'Milton Hatoum', genre:'Brazilian Literature', color1:'#6B4F6B', color2:'#3A2A3A', desc:"A haunting, fragmented family saga set among the Lebanese immigrant community of Manaus, told through overlapping memories and letters."},
  {id:'dois-irmaos', title:'Dois Irmãos', author:'Milton Hatoum', genre:'Brazilian Literature', color1:'#5C4A6B', color2:'#2A1F33', desc:"Twin brothers locked in lifelong rivalry in Manaus — a novel of jealousy, inheritance and the Amazon as more than backdrop."},
  {id:'ciranda-pedra', title:'Ciranda de Pedra', author:'Lygia Fagundes Telles', genre:'Brazilian Literature', color1:'#C1694F', color2:'#7A3F2A', desc:"A psychologically rich coming-of-age novel about Virgínia, caught between a fractured family and the discovery of her own desires."},
  {id:'as-meninas', title:'As Meninas', author:'Lygia Fagundes Telles', genre:'Brazilian Literature', color1:'#D98F73', color2:'#7A3F2A', desc:"Three young women share a convent dormitory during Brazil's military dictatorship, each representing a different response to a country in crisis."},
  {id:'lavoura-arcaica', title:'Lavoura Arcaica', author:'Raduan Nassar', genre:'Brazilian Literature', color1:'#8B6F47', color2:'#3A2E1A', desc:"A biblical, incantatory novel of a son's return to his rural family and the forbidden desire that tore it apart — dense, poetic, unforgettable."},
  {id:'copo-de-colera', title:'Um Copo de Cólera', author:'Raduan Nassar', genre:'Brazilian Literature', color1:'#A6473C', color2:'#4A1F1A', desc:"A single night's argument between two lovers, escalating from desire to fury in one of the tightest, most explosive short novels in Portuguese."},
  {id:'casa-grande-senzala', title:'Casa-Grande & Senzala', author:'Gilberto Freyre', genre:'Sociology', color1:'#1F3327', color2:'#0F1F17', desc:"A foundational and still-debated work of Brazilian sociology, examining the plantation household as the crucible of Brazilian identity."},
  {id:'raizes-brasil', title:'Raízes do Brasil', author:'Sérgio Buarque de Holanda', genre:'History', color1:'#2F4A38', color2:'#152019', desc:"One of the defining essays on Brazilian national character, tracing the country's roots through the tension between the personal and the public."},
  {id:'etica-nicomaco', title:'Ética a Nicômaco', author:'Aristóteles', genre:'Philosophy', color1:'#6B4F6B', color2:'#2A1F2E', desc:"Aristotle's foundational treatise on virtue, happiness and the good life — still the starting point for most ethical philosophy taught today."},
];

const LISTINGS = [
  {id:'l1', bookId:'dom-casmurro', bookstoreId:'leguara', language:'Portuguese', condition:'Very Good', price:14, lastConfirmed:'2 days ago', distanceKm:1.2},
  {id:'l2', bookId:'dom-casmurro', bookstoreId:'pagina-dobrada', language:'Portuguese', condition:'Good', price:10, lastConfirmed:'5 days ago', distanceKm:3.4},
  {id:'l3', bookId:'dom-casmurro', bookstoreId:'amaranth', language:'German', condition:'Like New', price:18, lastConfirmed:'Today', distanceKm:2.1},
  {id:'l4', bookId:'dom-casmurro', bookstoreId:'cafe-com-livros', language:'Spanish', condition:'Well-Loved', price:8, lastConfirmed:'1 week ago', distanceKm:4.7},
  {id:'l5', bookId:'memorias-postumas', bookstoreId:'leguara', language:'Portuguese', condition:'Good', price:12, lastConfirmed:'3 days ago', distanceKm:1.2},
  {id:'l6', bookId:'hora-da-estrela', bookstoreId:'leguara', language:'Portuguese', condition:'Like New', price:15, lastConfirmed:'1 day ago', distanceKm:1.2},
  {id:'l7', bookId:'hora-da-estrela', bookstoreId:'pagina-dobrada', language:'English', condition:'Very Good', price:13, lastConfirmed:'4 days ago', distanceKm:3.4},
  {id:'l8', bookId:'perto-coracao-selvagem', bookstoreId:'leguara', language:'Portuguese', condition:'Very Good', price:14, lastConfirmed:'2 days ago', distanceKm:1.2},
  {id:'l9', bookId:'grande-sertao', bookstoreId:'leguara', language:'Portuguese', condition:'Well-Loved', price:16, lastConfirmed:'6 days ago', distanceKm:1.2},
  {id:'l10', bookId:'gabriela', bookstoreId:'leguara', language:'Portuguese', condition:'Good', price:11, lastConfirmed:'2 days ago', distanceKm:1.2},
  {id:'l11', bookId:'gabriela', bookstoreId:'rua-nova', language:'Spanish', condition:'Very Good', price:12, lastConfirmed:'1 week ago', distanceKm:5.6},
  {id:'l12', bookId:'capitaes-areia', bookstoreId:'leguara', language:'Portuguese', condition:'Good', price:11, lastConfirmed:'5 days ago', distanceKm:1.2},
  {id:'l13', bookId:'relato-oriente', bookstoreId:'leguara', language:'Portuguese', condition:'Very Good', price:13, lastConfirmed:'3 days ago', distanceKm:1.2},
  {id:'l14', bookId:'dois-irmaos', bookstoreId:'leguara', language:'Portuguese', condition:'Like New', price:15, lastConfirmed:'Today', distanceKm:1.2},
  {id:'l15', bookId:'ciranda-pedra', bookstoreId:'casa-poetisas', language:'Portuguese', condition:'Very Good', price:13, lastConfirmed:'2 days ago', distanceKm:6.1},
  {id:'l16', bookId:'as-meninas', bookstoreId:'casa-poetisas', language:'Portuguese', condition:'Good', price:11, lastConfirmed:'4 days ago', distanceKm:6.1},
  {id:'l17', bookId:'lavoura-arcaica', bookstoreId:'leguara', language:'Portuguese', condition:'Well-Loved', price:17, lastConfirmed:'1 week ago', distanceKm:1.2},
  {id:'l18', bookId:'copo-de-colera', bookstoreId:'leguara', language:'Portuguese', condition:'Good', price:12, lastConfirmed:'3 days ago', distanceKm:1.2},
  {id:'l19', bookId:'casa-grande-senzala', bookstoreId:'leguara', language:'Portuguese', condition:'Very Good', price:19, lastConfirmed:'2 days ago', distanceKm:1.2},
  {id:'l20', bookId:'raizes-brasil', bookstoreId:'leguara', language:'Portuguese', condition:'Good', price:16, lastConfirmed:'1 day ago', distanceKm:1.2},
  {id:'l21', bookId:'etica-nicomaco', bookstoreId:'amaranth', language:'German', condition:'Very Good', price:9, lastConfirmed:'Today', distanceKm:2.1},
  {id:'l22', bookId:'etica-nicomaco', bookstoreId:'amaranth', language:'English', condition:'Good', price:7, lastConfirmed:'2 days ago', distanceKm:2.1},
];

const EVENTS = [
  {id:'e1', title:'Brazilian Literature Night', type:'Reading Night', bookstoreId:'leguara', date:'Jul 24', time:'19:00', description:"An evening of readings from Guimarães Rosa and Jorge Amado, followed by cachaça and conversation."},
  {id:'e2', title:'Reading Club: Clarice Lispector', type:'Book Club', bookstoreId:'leguara', date:'Jul 29', time:'18:30', description:"This month's chapter-by-chapter discussion of A Hora da Estrela. Newcomers welcome."},
  {id:'e3', title:'Meet the Bookseller: Beatriz Nogueira', type:'Meet the Bookseller', bookstoreId:'leguara', date:'Aug 2', time:'17:00', description:"Beatriz shares the story behind Leguará's rare books room over coffee."},
  {id:'e4', title:"Children's Storytelling Hour", type:"Children's Event", bookstoreId:'rua-nova', date:'Jul 26', time:'11:00', description:"Bilingual Portuguese-German storytelling for ages 3-7, followed by drawing."},
  {id:'e5', title:'Poetry Evening: Latin American Voices', type:'Poetry', bookstoreId:'casa-poetisas', date:'Aug 6', time:'19:30', description:"Local poets read alongside translations of Alejandra Pizarnik and Cecília Meireles."},
  {id:'e6', title:'Philosophy After Dark', type:'Discussion', bookstoreId:'amaranth', date:'Jul 31', time:'20:00', description:"This session's question: can Arendt's idea of 'natality' survive the algorithmic age?"},
];

const CLUBS = [
  {id:'c1', name:'Clube de Leitura Brasileira', bookstoreId:'leguara', freq:'Monthly · Portuguese', desc:"A relaxed monthly circle working through the Brazilian modernist canon, one novel at a time."},
  {id:'c2', name:'Philosophy After Dark', bookstoreId:'amaranth', freq:'Biweekly · German & English', desc:"Late-night arguments about Kant, Arendt and Adorno around Amaranth's communal table."},
  {id:'c3', name:'Mulheres que Escrevem', bookstoreId:'casa-poetisas', freq:'Monthly · Portuguese & German', desc:"A bilingual reading circle dedicated entirely to women writers, past and present."},
  {id:'c4', name:'Travel Pages Society', bookstoreId:'cafe-com-livros', freq:'Monthly · English', desc:"Slow travel writing over coffee — one memoir, one country, one long afternoon."},
];

const STORIES = [
  {id:'s1', title:'How Leguará brought Guimarães Rosa to Vienna', bookstoreId:'leguara', img:'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=800&q=80', excerpt:"It took three years and a small miracle of importing to get a first edition of Grande Sertão: Veredas onto Vienna shelves. Here's how it happened."},
  {id:'s2', title:'Página Dobrada: a bookstore built from a suitcase of poetry', bookstoreId:'pagina-dobrada', img:'https://images.unsplash.com/photo-1495640388908-05fa85288e61?auto=format&fit=crop&w=800&q=80', excerpt:"Tomás Rego arrived in Vienna with one suitcase, half of it books. Five years later, Página Dobrada is a cornerstone of the city's Portuguese-language scene."},
  {id:'s3', title:'The rare book that found its way home', bookstoreId:'amaranth', img:'https://images.unsplash.com/photo-1524578271613-d550eacf6090?auto=format&fit=crop&w=800&q=80', excerpt:"A 1932 first edition, a decades-long journey through three countries, and the Viennese philosophy shop where it finally landed."},
];

const WALKS = [
  {id:'w1', title:'A Literary Afternoon in Neubau', stops:['Leguará','Café com Livros','Amaranth'], duration:'2.5 hours', img:'https://images.unsplash.com/photo-1516550893923-42d28e5677af?auto=format&fit=crop&w=800&q=80', desc:"Start at Leguará's rare books room, wander to coffee and travel writing, end among philosophers."},
  {id:'w2', title:'Rare Books & Quiet Courtyards', stops:['Amaranth','Leguará'], duration:'1.5 hours', img:'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80', desc:"A short, quiet route through Josefstadt and Neubau's most contemplative shelves."},
  {id:'w3', title:'Latin American Vienna', stops:['Leguará','Rua Nova Livros','Página Dobrada'], duration:'3 hours', img:'https://images.unsplash.com/photo-1519682337058-a94d519337bc?auto=format&fit=crop&w=800&q=80', desc:"Cross three neighbourhoods tracing Vienna's Portuguese and Spanish-language literary community."},
];

const COLLECTIONS = [
  {id:'col1', name:'Brazilian Literature', color:'#2F6B4F', count:64},
  {id:'col2', name:'Philosophy', color:'#6B4F6B', count:41},
  {id:'col3', name:"Women's Writing", color:'#A6473C', count:37},
  {id:'col4', name:'Travel Writing', color:'#8B6F47', count:22},
  {id:'col5', name:'Graphic Novels', color:'#C1694F', count:18},
  {id:'col6', name:"Children's Books", color:'#B08D57', count:29},
];

/* ======================================================================
   STATE
====================================================================== */
const state = {
  page: 'home',
  currentBookstore: 'leguara',
  currentBook: null,
  searchQuery: 'Dom Casmurro',
  followed: new Set(),
  filters: { language: new Set(), condition: new Set(), distance: 'any' },
  bookstoreFilter: 'all',
};

/* ======================================================================
   HELPERS
====================================================================== */
function byId(arr, id){ return arr.find(x => x.id === id); }
function bookstoreOf(id){ return byId(BOOKSTORES, id); }
function bookOf(id){ return byId(BOOKS, id); }

function bookCoverHTML(book, size){
  size = size || 'normal';
  const pad = size === 'large' ? 'p-6' : 'p-3';
  const titleSize = size === 'large' ? 'text-xl' : 'text-[13px]';
  const authorSize = size === 'large' ? 'text-sm' : 'text-[10px]';
  return `
    <div class="book-cover w-full ${pad}" style="background: linear-gradient(155deg, ${book.color1}, ${book.color2});">
      <span class="spine-line"></span>
      <div class="relative z-10 text-cream">
        <p class="font-display leading-tight ${titleSize}">${book.title}</p>
        <p class="uppercase tracking-wide ${authorSize} opacity-70 mt-1">${book.author}</p>
      </div>
    </div>`;
}

function markHTML(bookstore, sizeClass){
  sizeClass = sizeClass || 'w-10 h-10 text-sm';
  return `<span class="${sizeClass} rounded-full flex items-center justify-center font-display text-cream shrink-0" style="background:${bookstore.accent}">${bookstore.mark}</span>`;
}

function specialtyTags(list, limit){
  const items = limit ? list.slice(0, limit) : list;
  return items.map(s => `<span class="tag-pill text-[11px] font-medium px-3 py-1 rounded-full bg-forest/8 text-forest border border-forest/15">${s}</span>`).join('');
}

/* ======================================================================
   TOAST
====================================================================== */
function showToast(msg){
  const c = document.getElementById('toast-container');
  const el = document.createElement('div');
  el.className = 'toast bg-forest text-cream text-sm px-5 py-3 rounded-full shadow-lift max-w-sm text-center';
  el.textContent = msg;
  c.appendChild(el);
  setTimeout(() => el.remove(), 3600);
}

/* ======================================================================
   MODAL
====================================================================== */
function closeModal(){
  document.getElementById('modal-root').classList.add('hidden');
  document.getElementById('modal-root').classList.remove('flex');
}
function openModal(html){
  const root = document.getElementById('modal-root');
  document.getElementById('modal-card').innerHTML = html;
  root.classList.remove('hidden');
  root.classList.add('flex');
}
document.getElementById('modal-root').addEventListener('click', e => { if (e.target.id === 'modal-root') closeModal(); });

function openReserveModal(bookId, bookstoreId){
  const book = bookOf(bookId);
  const store = bookstoreOf(bookstoreId);
  openModal(`
    <button onclick="closeModal()" class="float-right text-ink/40 hover:text-ink text-xl leading-none">×</button>
    <p class="text-terracotta text-xs font-semibold tracking-[0.2em] uppercase mb-2">Reserve</p>
    <h3 class="font-display text-2xl text-forest mb-1">${book ? book.title : 'Reserve a book'}</h3>
    <p class="text-sm text-ink/60 mb-6">Held for 48 hours at ${store.name}, ${store.neighborhood}.</p>
    <div class="space-y-3 mb-6">
      <input type="text" placeholder="Your name" class="w-full bg-white border border-ink/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-terracotta/50">
      <input type="email" placeholder="Your email" class="w-full bg-white border border-ink/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-terracotta/50">
    </div>
    <button onclick="closeModal(); showToast('Reservation request sent to ${store.name}! They will confirm within 24 hours.')" class="btn-primary w-full bg-forest text-cream font-medium py-3 rounded-full">Confirm Reservation</button>
  `);
}

function openContactModal(bookstoreId){
  const store = bookstoreOf(bookstoreId);
  openModal(`
    <button onclick="closeModal()" class="float-right text-ink/40 hover:text-ink text-xl leading-none">×</button>
    <p class="text-terracotta text-xs font-semibold tracking-[0.2em] uppercase mb-2">Contact</p>
    <h3 class="font-display text-2xl text-forest mb-1">Message ${store.name}</h3>
    <p class="text-sm text-ink/60 mb-6">${store.owner} usually replies within a day.</p>
    <div class="space-y-3 mb-6">
      <input type="text" placeholder="Your name" class="w-full bg-white border border-ink/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-terracotta/50">
      <textarea placeholder="Your message" rows="4" class="w-full bg-white border border-ink/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-terracotta/50"></textarea>
    </div>
    <button onclick="closeModal(); showToast('Message sent to ${store.name}.')" class="btn-primary w-full bg-forest text-cream font-medium py-3 rounded-full">Send Message</button>
  `);
}

function toggleFollow(bookstoreId){
  const store = bookstoreOf(bookstoreId);
  if (state.followed.has(bookstoreId)) {
    state.followed.delete(bookstoreId);
    showToast(`Unfollowed ${store.name}.`);
  } else {
    state.followed.add(bookstoreId);
    showToast(`You're now following ${store.name}!`);
  }
  renderBookstorePage(bookstoreId);
}

/* ======================================================================
   NAVIGATION
====================================================================== */
function go(page, opts){
  opts = opts || {};
  state.page = page;
  document.querySelectorAll('.page').forEach(p => p.classList.add('hidden-page'));
  document.getElementById('page-' + page).classList.remove('hidden-page');
  document.getElementById('site-footer').style.display = (page === 'admin') ? 'none' : '';
  window.scrollTo({top:0, behavior:'instant' in window ? 'instant' : 'auto'});

  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
  const navMap = { home:'navlink-home', 'bookstores-list':'navlink-bookstores-list', community:'navlink-community' };
  if (navMap[page]) { const l = document.getElementById(navMap[page]); if (l) l.classList.add('active'); }

  if (page === 'bookstore') renderBookstorePage(opts.bookstoreId || state.currentBookstore);
  if (page === 'book') renderBookPage(opts.bookId, opts.bookstoreId);
  if (page === 'search') { if (opts.query) state.searchQuery = opts.query; renderSearchPage(); }
  if (page === 'community') renderCommunityPage();
  if (page === 'bookstores-list') renderBookstoresListPage();
  if (page === 'admin') showAdminTab('books');

  document.getElementById('nav-search-dropdown').classList.add('hidden');
}

/* ======================================================================
   RENDER: HOME
====================================================================== */
function renderHome(){
  document.getElementById('featured-bookstores-grid').innerHTML = BOOKSTORES.slice(0,3).map(store => `
    <div class="card-lift bg-white rounded-3xl overflow-hidden shadow-soft">
      <div class="img-zoom h-48 relative">
        <img src="${store.heroImg}" class="w-full h-full object-cover" alt="${store.name}">
        <span class="badge-community absolute top-3 right-3 text-cream text-[10px] font-medium px-3 py-1 rounded-full">${store.badge}</span>
      </div>
      <div class="p-6">
        <div class="flex items-center gap-3 mb-3">
          ${markHTML(store)}
          <div>
            <h3 class="font-display text-lg text-forest leading-tight">${store.name}</h3>
            <p class="text-xs text-ink/50">${store.neighborhood} · ${store.distanceLabel || (LISTINGS.find(l=>l.bookstoreId===store.id) ? LISTINGS.find(l=>l.bookstoreId===store.id).distanceKm + ' km' : '')}</p>
          </div>
        </div>
        <p class="text-sm text-ink/65 leading-relaxed mb-4 line-clamp-3">${store.story.slice(0,120)}…</p>
        <div class="flex flex-wrap gap-1.5 mb-4">${specialtyTags(store.specialties, 3)}</div>
        <div class="flex items-center justify-between text-xs text-ink/50 mb-5">
          <span>${store.languages.join(' · ')}</span>
          <span>${store.stats.books.toLocaleString()} books</span>
        </div>
        <button onclick="go('bookstore', {bookstoreId:'${store.id}'})" class="btn-outline w-full border border-forest text-forest text-sm font-medium py-2.5 rounded-full">Explore Bookstore</button>
      </div>
    </div>
  `).join('');

  document.getElementById('recent-books-carousel').innerHTML = BOOKS.slice(0,10).map(book => {
    const listing = LISTINGS.find(l => l.bookId === book.id);
    const store = listing ? bookstoreOf(listing.bookstoreId) : null;
    return `
    <div class="w-44 shrink-0 cursor-pointer group" onclick="go('book', {bookId:'${book.id}', bookstoreId:'${listing ? listing.bookstoreId : ''}'})">
      <div class="img-zoom">${bookCoverHTML(book)}</div>
      <p class="font-display text-sm text-forest mt-3 leading-snug group-hover:text-terracotta transition-colors">${book.title}</p>
      <p class="text-xs text-ink/50 mt-0.5">${book.author}</p>
      ${store ? `<p class="text-[11px] text-ink/40 mt-1">at ${store.name}</p>` : ''}
    </div>`;
  }).join('');

  document.getElementById('home-events-grid').innerHTML = eventCardsHTML(EVENTS.slice(0,3));
}

function scrollCarousel(dir){
  document.getElementById('recent-books-carousel').scrollBy({left: dir*320, behavior:'smooth'});
}

function eventCardsHTML(events){
  return events.map(ev => {
    const store = bookstoreOf(ev.bookstoreId);
    return `
    <div class="card-lift bg-white rounded-2xl p-6 shadow-soft border-t-4" style="border-color:${store.accent}">
      <p class="text-[11px] font-semibold tracking-widest uppercase text-terracotta mb-2">${ev.type}</p>
      <h4 class="font-display text-lg text-forest leading-snug mb-2">${ev.title}</h4>
      <p class="text-sm text-ink/60 leading-relaxed mb-4">${ev.description}</p>
      <div class="flex items-center justify-between text-xs text-ink/50 border-t border-ink/8 pt-4">
        <span>${ev.date} · ${ev.time}</span>
        <button onclick="go('bookstore',{bookstoreId:'${store.id}'})" class="flex items-center gap-1.5 font-medium text-forest hover:text-terracotta">
          ${markHTML(store, 'w-5 h-5 text-[10px]')} ${store.name}
        </button>
      </div>
    </div>`;
  }).join('');
}

/* ======================================================================
   RENDER: BOOKSTORES LIST
====================================================================== */
function renderBookstoresListPage(){
  const neighborhoods = ['all', ...new Set(BOOKSTORES.map(b => b.neighborhood))];
  document.getElementById('bookstore-filter-chips').innerHTML = neighborhoods.map(n => `
    <button onclick="setBookstoreFilter('${n}')" class="tag-pill text-sm px-4 py-2 rounded-full border ${state.bookstoreFilter===n ? 'bg-forest text-cream border-forest' : 'bg-white border-ink/15 text-ink/70 hover:border-forest/40'}">${n === 'all' ? 'All neighborhoods' : n}</button>
  `).join('');

  const list = BOOKSTORES.filter(s => state.bookstoreFilter === 'all' || s.neighborhood === state.bookstoreFilter);
  document.getElementById('bookstores-list-grid').innerHTML = list.map(store => `
    <div class="card-lift bg-white rounded-3xl overflow-hidden shadow-soft">
      <div class="img-zoom h-48 relative">
        <img src="${store.heroImg}" class="w-full h-full object-cover" alt="${store.name}">
        <span class="badge-community absolute top-3 right-3 text-cream text-[10px] font-medium px-3 py-1 rounded-full">${store.badge}</span>
      </div>
      <div class="p-6">
        <div class="flex items-center gap-3 mb-3">
          ${markHTML(store)}
          <div>
            <h3 class="font-display text-lg text-forest leading-tight">${store.name}</h3>
            <p class="text-xs text-ink/50">${store.neighborhood} · ${store.atmosphere}</p>
          </div>
        </div>
        <div class="flex flex-wrap gap-1.5 mb-4">${specialtyTags(store.specialties, 4)}</div>
        <div class="flex items-center justify-between text-xs text-ink/50 mb-5">
          <span>${store.languages.join(' · ')}</span>
          <span>${store.stats.books.toLocaleString()} books</span>
        </div>
        <button onclick="go('bookstore', {bookstoreId:'${store.id}'})" class="btn-outline w-full border border-forest text-forest text-sm font-medium py-2.5 rounded-full">Explore Bookstore</button>
      </div>
    </div>
  `).join('');
}
function setBookstoreFilter(n){ state.bookstoreFilter = n; renderBookstoresListPage(); }

/* ======================================================================
   RENDER: SEARCH
====================================================================== */
function getFilteredListings(){
  const q = state.searchQuery.toLowerCase();
  let results = LISTINGS.filter(l => {
    const book = bookOf(l.bookId);
    return book.title.toLowerCase().includes(q) || book.author.toLowerCase().includes(q);
  });
  if (state.filters.language.size) results = results.filter(l => state.filters.language.has(l.language));
  if (state.filters.condition.size) results = results.filter(l => state.filters.condition.has(l.condition));
  if (state.filters.distance !== 'any') {
    const max = parseFloat(state.filters.distance);
    results = results.filter(l => l.distanceKm <= max);
  }
  return results;
}

function renderSearchPage(){
  document.getElementById('search-query-display').textContent = state.searchQuery;
  document.getElementById('search-page-input').value = state.searchQuery;

  const allLangs = [...new Set(LISTINGS.map(l => l.language))];
  const allConditions = [...new Set(LISTINGS.map(l => l.condition))];

  document.getElementById('filter-language').innerHTML = allLangs.map(lang => `
    <label class="flex items-center gap-2 cursor-pointer select-none">
      <input type="checkbox" onchange="toggleFilter('language','${lang}')" ${state.filters.language.has(lang)?'checked':''} class="accent-forest w-4 h-4">
      <span>${lang}</span>
    </label>`).join('');

  document.getElementById('filter-condition').innerHTML = allConditions.map(c => `
    <label class="flex items-center gap-2 cursor-pointer select-none">
      <input type="checkbox" onchange="toggleFilter('condition','${c}')" ${state.filters.condition.has(c)?'checked':''} class="accent-forest w-4 h-4">
      <span>${c}</span>
    </label>`).join('');

  document.getElementById('filter-distance').innerHTML = ['any','2','5','10'].map(d => `
    <label class="flex items-center gap-2 cursor-pointer select-none">
      <input type="radio" name="distance" onchange="setDistanceFilter('${d}')" ${state.filters.distance===d?'checked':''} class="accent-forest w-4 h-4">
      <span>${d==='any' ? 'Any distance' : 'Under ' + d + ' km'}</span>
    </label>`).join('');

  const results = getFilteredListings();
  document.getElementById('search-result-count').textContent = results.length
    ? `${results.length} ${results.length===1?'copy':'copies'} found across Vienna's independent bookstores`
    : `No copies match these filters yet`;

  if (!results.length) {
    document.getElementById('search-results-list').innerHTML = `
      <div class="bg-white rounded-2xl p-10 text-center shadow-soft">
        <p class="font-display text-xl text-forest mb-2">No exact matches</p>
        <p class="text-ink/60 text-sm">Try clearing a filter, or explore bookstores that specialize in similar collections.</p>
        <button onclick="go('bookstores-list')" class="btn-primary mt-6 bg-forest text-cream text-sm font-medium px-6 py-2.5 rounded-full">Explore Bookstores</button>
      </div>`;
    return;
  }

  document.getElementById('search-results-list').innerHTML = results.map(l => {
    const book = bookOf(l.bookId);
    const store = bookstoreOf(l.bookstoreId);
    return `
    <div class="card-lift bg-white rounded-2xl p-5 shadow-soft flex gap-5 items-stretch">
      <div class="w-24 shrink-0 cursor-pointer" onclick="go('book',{bookId:'${book.id}', bookstoreId:'${store.id}'})">${bookCoverHTML(book)}</div>
      <div class="flex-1 flex flex-col">
        <div class="flex items-start justify-between gap-4">
          <div>
            <h3 class="font-display text-lg text-forest cursor-pointer hover:text-terracotta" onclick="go('book',{bookId:'${book.id}', bookstoreId:'${store.id}'})">${book.title}</h3>
            <p class="text-sm text-ink/55">${book.author}</p>
          </div>
          <span class="text-lg font-display text-forest whitespace-nowrap">€${l.price}</span>
        </div>
        <div class="flex flex-wrap gap-2 mt-3 mb-4">
          <span class="text-[11px] px-2.5 py-1 rounded-full bg-cream-dark text-ink/60">${l.language}</span>
          <span class="text-[11px] px-2.5 py-1 rounded-full bg-cream-dark text-ink/60">${l.condition}</span>
          <span class="text-[11px] px-2.5 py-1 rounded-full bg-cream-dark text-ink/60">${l.distanceKm} km away</span>
        </div>
        <div class="mt-auto flex items-center justify-between gap-4 border-t border-ink/8 pt-4">
          <button onclick="go('bookstore',{bookstoreId:'${store.id}'})" class="flex items-center gap-2 group">
            ${markHTML(store, 'w-8 h-8 text-xs')}
            <span class="text-left">
              <span class="block text-sm font-medium text-forest group-hover:text-terracotta">${store.name}</span>
              <span class="block text-[11px] text-ink/45">Confirmed ${l.lastConfirmed}</span>
            </span>
          </button>
          <button onclick="go('bookstore',{bookstoreId:'${store.id}'})" class="btn-outline border border-forest text-forest text-xs font-medium px-4 py-2 rounded-full whitespace-nowrap">View Bookstore</button>
        </div>
      </div>
    </div>`;
  }).join('');
}
function toggleFilter(type, val){
  const set = state.filters[type];
  set.has(val) ? set.delete(val) : set.add(val);
  renderSearchPage();
}
function setDistanceFilter(d){ state.filters.distance = d; renderSearchPage(); }
function resetFilters(){
  state.filters = { language:new Set(), condition:new Set(), distance:'any' };
  renderSearchPage();
}

/* ======================================================================
   RENDER: BOOKSTORE PROFILE
====================================================================== */
function renderBookstorePage(bookstoreId){
  state.currentBookstore = bookstoreId;
  const store = bookstoreOf(bookstoreId);
  const storeListings = LISTINGS.filter(l => l.bookstoreId === bookstoreId);
  const storeEvents = EVENTS.filter(e => e.bookstoreId === bookstoreId);
  const isFollowing = state.followed.has(bookstoreId);

  document.getElementById('bookstore-content').innerHTML = `
    <div class="relative h-[70vh] min-h-[440px] w-full overflow-hidden">
      <img src="${store.heroImg}" class="absolute inset-0 w-full h-full object-cover" alt="${store.name}">
      <div class="absolute inset-0 hero-gradient"></div>
      <div class="relative z-10 h-full max-w-7xl mx-auto px-6 flex flex-col justify-end pb-14">
        <div class="flex items-center gap-3 mb-4">
          ${markHTML(store, 'w-12 h-12 text-lg')}
          <span class="badge-community text-cream text-xs font-medium px-3 py-1.5 rounded-full">${store.badge}</span>
        </div>
        <h1 class="font-display text-cream text-5xl md:text-6xl">${store.name}</h1>
        <p class="text-cream/80 mt-3">${store.neighborhood}, Vienna · Est. ${store.founded} · ${store.atmosphere}</p>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-6">
      <!-- STATS BAR -->
      <div class="grid grid-cols-2 md:grid-cols-5 gap-4 -mt-10 relative z-20 mb-16">
        ${statTile(store.stats.books,'Books')}
        ${statTile(store.stats.followers,'Followers')}
        ${statTile(store.stats.eventsHosted,'Events hosted')}
        ${statTile(store.stats.reserved,'Books reserved')}
        ${statTile(store.stats.recentlyAdded,'Recently added')}
      </div>

      <div class="grid md:grid-cols-[1fr_320px] gap-14">
        <div>
          <!-- MEET THE BOOKSELLER -->
          <div class="flex items-start gap-6 mb-16">
            <img src="${store.ownerPortrait}" class="w-24 h-24 rounded-full object-cover shrink-0 shadow-soft" alt="${store.owner}">
            <div>
              <p class="text-terracotta text-xs font-semibold tracking-[0.2em] uppercase mb-2">Meet the bookseller</p>
              <h3 class="font-display text-xl text-forest mb-1">${store.owner}</h3>
              <p class="text-xs text-ink/50 mb-4">${store.ownerRole}, ${store.name}</p>
              <p class="font-display italic text-lg text-ink/80 leading-relaxed">"${store.quote}"</p>
            </div>
          </div>

          <!-- STORY -->
          <div class="mb-16">
            <p class="text-terracotta text-xs font-semibold tracking-[0.2em] uppercase mb-3">Our story</p>
            <p class="text-ink/70 leading-relaxed mb-4">${store.story}</p>
            <p class="text-ink/70 leading-relaxed"><span class="font-medium text-forest">Mission —</span> ${store.mission}</p>
          </div>

          <!-- TIMELINE -->
          <div class="mb-16">
            <p class="text-terracotta text-xs font-semibold tracking-[0.2em] uppercase mb-6">Timeline</p>
            <div class="space-y-6 border-l-2 border-forest/15 pl-6">
              ${store.timeline.map(t => `
                <div class="relative">
                  <span class="timeline-dot absolute -left-[31px] top-1 w-3 h-3 rounded-full bg-terracotta"></span>
                  <p class="font-display text-forest text-lg">${t.year}</p>
                  <p class="text-sm text-ink/65 mt-1 leading-relaxed">${t.text}</p>
                </div>`).join('')}
            </div>
          </div>

          <!-- SPECIALTIES / LANGUAGES -->
          <div class="grid sm:grid-cols-2 gap-8 mb-16">
            <div>
              <p class="text-terracotta text-xs font-semibold tracking-[0.2em] uppercase mb-3">Specialties</p>
              <div class="flex flex-wrap gap-2">${specialtyTags(store.specialties)}</div>
            </div>
            <div>
              <p class="text-terracotta text-xs font-semibold tracking-[0.2em] uppercase mb-3">Languages</p>
              <div class="flex flex-wrap gap-2">${specialtyTags(store.languages)}</div>
            </div>
          </div>

          <!-- GALLERY -->
          <div class="mb-16">
            <p class="text-terracotta text-xs font-semibold tracking-[0.2em] uppercase mb-4">Gallery</p>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
              ${store.gallery.map(g => `<div class="img-zoom rounded-xl overflow-hidden aspect-square"><img src="${g}" class="w-full h-full object-cover" alt="${store.name} gallery"></div>`).join('')}
            </div>
          </div>

          ${storeEvents.length ? `
          <!-- EVENTS -->
          <div class="mb-16">
            <p class="text-terracotta text-xs font-semibold tracking-[0.2em] uppercase mb-4">Events at ${store.name}</p>
            <div class="grid sm:grid-cols-2 gap-5">${eventCardsHTML(storeEvents)}</div>
          </div>` : ''}

          <!-- BOOKS -->
          <div class="mb-16">
            <p class="text-terracotta text-xs font-semibold tracking-[0.2em] uppercase mb-4">Books at ${store.name}</p>
            <div class="grid grid-cols-3 sm:grid-cols-5 gap-4">
              ${storeListings.slice(0,10).map(l => {
                const book = bookOf(l.bookId);
                return `<div class="cursor-pointer group" onclick="go('book',{bookId:'${book.id}', bookstoreId:'${store.id}'})">
                  <div class="img-zoom">${bookCoverHTML(book)}</div>
                  <p class="text-xs font-medium text-forest mt-2 leading-snug group-hover:text-terracotta transition-colors">${book.title}</p>
                </div>`;
              }).join('')}
            </div>
          </div>
        </div>

        <!-- SIDEBAR -->
        <aside class="space-y-6">
          <div class="sticky top-28 space-y-6">
            <div class="bg-white rounded-2xl p-6 shadow-soft space-y-3">
              <button onclick="openReserveModal('${storeListings[0] ? storeListings[0].bookId : ''}','${store.id}')" class="btn-primary w-full bg-forest text-cream font-medium py-3 rounded-full">Reserve a Book</button>
              <button onclick="openContactModal('${store.id}')" class="btn-outline w-full border border-forest text-forest font-medium py-3 rounded-full">Contact Bookstore</button>
              <button onclick="toggleFollow('${store.id}')" class="w-full font-medium py-3 rounded-full border transition-colors ${isFollowing ? 'bg-terracotta/10 border-terracotta text-terracotta' : 'border-ink/15 text-ink/70 hover:border-forest'}">${isFollowing ? 'Following ✓' : 'Follow Bookstore'}</button>
            </div>

            <div class="bg-white rounded-2xl p-6 shadow-soft">
              <p class="text-xs font-semibold tracking-[0.15em] uppercase text-ink/40 mb-3">Opening hours</p>
              <div class="space-y-1.5 text-sm">
                ${store.hours.map(h => `<div class="flex justify-between"><span class="text-ink/55">${h[0]}</span><span class="text-ink/80 font-medium">${h[1]}</span></div>`).join('')}
              </div>
            </div>

            <div class="bg-white rounded-2xl p-6 shadow-soft">
              <p class="text-xs font-semibold tracking-[0.15em] uppercase text-ink/40 mb-3">Location</p>
              <div class="rounded-xl h-32 mb-3 flex items-center justify-center text-cream text-sm font-display" style="background: linear-gradient(135deg, ${store.accent}, #1F3327);">${store.district} Vienna</div>
              <p class="text-sm text-ink/70">${store.address}</p>
            </div>

            <div class="bg-white rounded-2xl p-6 shadow-soft">
              <p class="text-xs font-semibold tracking-[0.15em] uppercase text-ink/40 mb-2">Instagram</p>
              <p class="text-sm text-forest font-medium">${store.instagram}</p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  `;
}
function statTile(value, label){
  return `<div class="bg-white rounded-2xl px-4 py-5 shadow-soft text-center">
    <p class="font-display text-2xl md:text-3xl text-forest">${typeof value==='number' ? value.toLocaleString() : value}</p>
    <p class="text-[11px] uppercase tracking-wide text-ink/45 mt-1">${label}</p>
  </div>`;
}

/* ======================================================================
   RENDER: BOOK PAGE
====================================================================== */
function renderBookPage(bookId, bookstoreId){
  const book = bookOf(bookId) || BOOKS[0];
  const listing = LISTINGS.find(l => l.bookId === book.id && (!bookstoreId || l.bookstoreId === bookstoreId)) || LISTINGS.find(l => l.bookId === book.id);
  const store = bookstoreOf(listing.bookstoreId);
  state.currentBook = book.id;

  const otherFromStore = LISTINGS.filter(l => l.bookstoreId === store.id && l.bookId !== book.id).slice(0,5);
  const otherStores = BOOKSTORES.filter(s => s.id !== store.id).slice(0,3);

  document.getElementById('book-content').innerHTML = `
    <div class="flex items-center gap-2 text-xs text-ink/45 mb-8">
      <button onclick="go('home')" class="hover:text-forest">Home</button><span>/</span>
      <button onclick="go('bookstore',{bookstoreId:'${store.id}'})" class="hover:text-forest">${store.name}</button><span>/</span>
      <span class="text-ink/70">${book.title}</span>
    </div>
    <div class="grid md:grid-cols-[300px_1fr] gap-14 mb-24">
      <div>${bookCoverHTML(book, 'large')}</div>
      <div>
        <p class="text-terracotta text-xs font-semibold tracking-[0.2em] uppercase mb-2">${book.genre}</p>
        <h1 class="font-display text-4xl text-forest mb-2">${book.title}</h1>
        <p class="text-lg text-ink/60 mb-6">${book.author}</p>
        <p class="text-ink/70 leading-relaxed max-w-2xl mb-10">${book.desc}</p>

        <div class="bg-white rounded-2xl p-6 shadow-soft max-w-md">
          <p class="text-xs font-semibold tracking-[0.15em] uppercase text-ink/40 mb-4">Available at</p>
          <button onclick="go('bookstore',{bookstoreId:'${store.id}'})" class="flex items-center gap-3 mb-5 group">
            ${markHTML(store,'w-11 h-11')}
            <span class="text-left">
              <span class="block font-display text-lg text-forest group-hover:text-terracotta">${store.name}</span>
              <span class="block text-xs text-ink/45">${store.neighborhood} · ${listing.distanceKm} km away</span>
            </span>
          </button>
          <div class="grid grid-cols-2 gap-3 text-sm mb-5">
            <div><p class="text-ink/45 text-xs mb-0.5">Condition</p><p class="font-medium text-ink/80">${listing.condition}</p></div>
            <div><p class="text-ink/45 text-xs mb-0.5">Language</p><p class="font-medium text-ink/80">${listing.language}</p></div>
            <div><p class="text-ink/45 text-xs mb-0.5">Price</p><p class="font-display text-lg text-forest">€${listing.price}</p></div>
            <div><p class="text-ink/45 text-xs mb-0.5">Last confirmed</p><p class="font-medium text-ink/80">${listing.lastConfirmed}</p></div>
          </div>
          <button onclick="openReserveModal('${book.id}','${store.id}')" class="btn-primary w-full bg-forest text-cream font-medium py-3 rounded-full">Reserve</button>
        </div>
      </div>
    </div>

    ${otherFromStore.length ? `
    <div class="mb-20">
      <p class="text-terracotta text-xs font-semibold tracking-[0.2em] uppercase mb-4">More from ${store.name}</p>
      <div class="grid grid-cols-3 sm:grid-cols-5 gap-4">
        ${otherFromStore.map(l => {
          const b = bookOf(l.bookId);
          return `<div class="cursor-pointer group" onclick="go('book',{bookId:'${b.id}', bookstoreId:'${store.id}'})">
            <div class="img-zoom">${bookCoverHTML(b)}</div>
            <p class="text-xs font-medium text-forest mt-2 leading-snug group-hover:text-terracotta transition-colors">${b.title}</p>
          </div>`;
        }).join('')}
      </div>
    </div>` : ''}

    <div>
      <p class="text-terracotta text-xs font-semibold tracking-[0.2em] uppercase mb-4">Readers who visited ${store.name} also explored…</p>
      <div class="grid md:grid-cols-3 gap-6">
        ${otherStores.map(s => `
        <div class="card-lift bg-white rounded-2xl overflow-hidden shadow-soft">
          <div class="img-zoom h-32"><img src="${s.heroImg}" class="w-full h-full object-cover" alt="${s.name}"></div>
          <div class="p-5">
            <div class="flex items-center gap-2 mb-2">${markHTML(s,'w-8 h-8 text-xs')}<span class="font-display text-forest">${s.name}</span></div>
            <p class="text-xs text-ink/55 mb-4">${s.neighborhood} · ${s.specialties[0]}</p>
            <button onclick="go('bookstore',{bookstoreId:'${s.id}'})" class="text-xs font-medium text-forest border-b border-forest/30 hover:border-forest">Explore Bookstore →</button>
          </div>
        </div>`).join('')}
      </div>
    </div>
  `;
}

/* ======================================================================
   RENDER: COMMUNITY
====================================================================== */
function renderCommunityPage(){
  document.getElementById('community-events-grid').innerHTML = eventCardsHTML(EVENTS);

  document.getElementById('community-clubs-grid').innerHTML = CLUBS.map(club => {
    const store = bookstoreOf(club.bookstoreId);
    return `
    <div class="card-lift bg-white rounded-2xl p-6 shadow-soft flex gap-4">
      ${markHTML(store,'w-11 h-11 shrink-0')}
      <div>
        <h4 class="font-display text-lg text-forest leading-snug">${club.name}</h4>
        <p class="text-xs text-terracotta font-medium mt-1 mb-2">${club.freq} · at ${store.name}</p>
        <p class="text-sm text-ink/60 leading-relaxed">${club.desc}</p>
      </div>
    </div>`;
  }).join('');

  document.getElementById('community-recent-bookstores-grid').innerHTML = BOOKSTORES.slice().sort((a,b)=>b.founded-a.founded).slice(0,3).map(store => `
    <div class="card-lift bg-white rounded-3xl overflow-hidden shadow-soft">
      <div class="img-zoom h-40"><img src="${store.heroImg}" class="w-full h-full object-cover" alt="${store.name}"></div>
      <div class="p-6">
        <div class="flex items-center gap-3 mb-3">${markHTML(store)}<div><h3 class="font-display text-lg text-forest">${store.name}</h3><p class="text-xs text-ink/50">${store.neighborhood} · joined ${store.founded <= 2023 ? 2023 : store.founded}</p></div></div>
        <button onclick="go('bookstore',{bookstoreId:'${store.id}'})" class="btn-outline w-full border border-forest text-forest text-sm font-medium py-2.5 rounded-full">Explore Bookstore</button>
      </div>
    </div>`).join('');

  document.getElementById('community-stories-grid').innerHTML = STORIES.map(s => {
    const store = bookstoreOf(s.bookstoreId);
    return `
    <div class="card-lift bg-white rounded-2xl overflow-hidden shadow-soft cursor-pointer" onclick="go('bookstore',{bookstoreId:'${store.id}'})">
      <div class="img-zoom h-40"><img src="${s.img}" class="w-full h-full object-cover" alt="${s.title}"></div>
      <div class="p-6">
        <p class="text-[11px] text-terracotta font-semibold tracking-widest uppercase mb-2">Story</p>
        <h4 class="font-display text-lg text-forest leading-snug mb-2">${s.title}</h4>
        <p class="text-sm text-ink/60 leading-relaxed">${s.excerpt}</p>
      </div>
    </div>`;
  }).join('');

  document.getElementById('community-walks-grid').innerHTML = WALKS.map(w => `
    <div class="card-lift bg-white rounded-2xl overflow-hidden shadow-soft">
      <div class="img-zoom h-40"><img src="${w.img}" class="w-full h-full object-cover" alt="${w.title}"></div>
      <div class="p-6">
        <h4 class="font-display text-lg text-forest leading-snug mb-1">${w.title}</h4>
        <p class="text-xs text-ink/45 mb-3">${w.duration} · ${w.stops.join(' → ')}</p>
        <p class="text-sm text-ink/60 leading-relaxed">${w.desc}</p>
      </div>
    </div>`).join('');

  document.getElementById('community-collections-grid').innerHTML = COLLECTIONS.map(c => `
    <div class="card-lift rounded-2xl p-8 text-cream cursor-pointer shadow-soft" style="background: linear-gradient(150deg, ${c.color}, #1F3327);" onclick="go('search',{query:'${c.name}'})">
      <p class="font-display text-2xl mb-2">${c.name}</p>
      <p class="text-cream/70 text-sm">${c.count} books across our bookstores</p>
    </div>`).join('');
}

/* ======================================================================
   RENDER: ADMIN
====================================================================== */
function showAdminTab(tab){
  document.querySelectorAll('.admin-tab').forEach(b => {
    if (b.dataset.adminTab === tab) { b.classList.add('bg-white','shadow-soft','text-forest'); }
    else { b.classList.remove('bg-white','shadow-soft','text-forest'); }
  });
  const content = document.getElementById('admin-content');

  if (tab === 'books') {
    content.innerHTML = `
      <div class="flex items-center justify-between mb-6">
        <h2 class="font-display text-2xl text-forest">Books</h2>
        <div class="flex gap-3">
          <button onclick="showToast('CSV import simulated — 128 books processed.')" class="btn-outline border border-forest text-forest text-sm font-medium px-4 py-2 rounded-full">Import CSV</button>
          <button onclick="showToast('Excel import simulated — 96 books processed.')" class="btn-outline border border-forest text-forest text-sm font-medium px-4 py-2 rounded-full">Import Excel</button>
        </div>
      </div>
      <div class="bg-white rounded-2xl shadow-soft overflow-hidden">
        <table class="w-full text-sm">
          <thead><tr class="text-left text-ink/40 text-xs uppercase tracking-wide border-b border-ink/8">
            <th class="py-3 px-5">Title</th><th class="py-3 px-5">Author</th><th class="py-3 px-5">Condition</th><th class="py-3 px-5">Price</th><th class="py-3 px-5">Status</th>
          </tr></thead>
          <tbody>
            ${LISTINGS.filter(l=>l.bookstoreId==='leguara').map(l => { const b = bookOf(l.bookId); return `
            <tr class="border-b border-ink/5 hover:bg-cream/60">
              <td class="py-3 px-5 font-medium text-forest">${b.title}</td>
              <td class="py-3 px-5 text-ink/60">${b.author}</td>
              <td class="py-3 px-5 text-ink/60">${l.condition}</td>
              <td class="py-3 px-5 text-ink/60">€${l.price}</td>
              <td class="py-3 px-5"><span class="text-xs px-2.5 py-1 rounded-full bg-forest/10 text-forest">In stock</span></td>
            </tr>`; }).join('')}
          </tbody>
        </table>
      </div>`;
  }

  if (tab === 'reservations') {
    const names = ['Anna Huber','Lukas Fischer','Sofia Martins','Noah Bergmann','Marie Wagner'];
    content.innerHTML = `
      <h2 class="font-display text-2xl text-forest mb-6">Reservations</h2>
      <div class="bg-white rounded-2xl shadow-soft overflow-hidden">
        <table class="w-full text-sm">
          <thead><tr class="text-left text-ink/40 text-xs uppercase tracking-wide border-b border-ink/8">
            <th class="py-3 px-5">Reader</th><th class="py-3 px-5">Book</th><th class="py-3 px-5">Requested</th><th class="py-3 px-5">Status</th>
          </tr></thead>
          <tbody>
            ${LISTINGS.filter(l=>l.bookstoreId==='leguara').slice(0,5).map((l,i) => { const b = bookOf(l.bookId); const statuses=['Pending','Confirmed','Confirmed','Pending','Ready for pickup']; return `
            <tr class="border-b border-ink/5 hover:bg-cream/60">
              <td class="py-3 px-5 font-medium text-forest">${names[i]}</td>
              <td class="py-3 px-5 text-ink/60">${b.title}</td>
              <td class="py-3 px-5 text-ink/60">${l.lastConfirmed}</td>
              <td class="py-3 px-5"><span class="text-xs px-2.5 py-1 rounded-full ${statuses[i]==='Pending' ? 'bg-terracotta/10 text-terracotta' : 'bg-forest/10 text-forest'}">${statuses[i]}</span></td>
            </tr>`; }).join('')}
          </tbody>
        </table>
      </div>`;
  }

  if (tab === 'searches') {
    const searches = [['Dom Casmurro', 42],['Clarice Lispector', 37],['Grande Sertão: Veredas', 25],['philosophy books portuguese', 19],['Jorge Amado', 16]];
    content.innerHTML = `
      <h2 class="font-display text-2xl text-forest mb-6">Recent searches</h2>
      <div class="bg-white rounded-2xl shadow-soft divide-y divide-ink/5">
        ${searches.map(s => `<div class="flex items-center justify-between px-6 py-4"><span class="text-sm font-medium text-forest">"${s[0]}"</span><span class="text-xs text-ink/45">${s[1]} searches this week</span></div>`).join('')}
      </div>`;
  }

  if (tab === 'added') {
    content.innerHTML = `
      <h2 class="font-display text-2xl text-forest mb-6">Recently added books</h2>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        ${LISTINGS.filter(l=>l.bookstoreId==='leguara').slice(0,8).map(l => { const b = bookOf(l.bookId); return `
        <div class="bg-white rounded-xl p-4 shadow-soft">
          <div class="w-16 mx-auto mb-3">${bookCoverHTML(b)}</div>
          <p class="text-xs font-medium text-forest text-center leading-snug">${b.title}</p>
        </div>`; }).join('')}
      </div>`;
  }

  if (tab === 'messages') {
    const msgs = [['Anna Huber','Do you have Grande Sertão: Veredas in stock?'],['Lukas Fischer','Is the philosophy reading group open to newcomers?'],['Sofia Martins','Could you hold a copy of A Hora da Estrela until Friday?']];
    content.innerHTML = `
      <h2 class="font-display text-2xl text-forest mb-6">Messages</h2>
      <div class="bg-white rounded-2xl shadow-soft divide-y divide-ink/5">
        ${msgs.map(m => `<div class="px-6 py-4"><p class="text-sm font-medium text-forest">${m[0]}</p><p class="text-sm text-ink/60 mt-1">${m[1]}</p></div>`).join('')}
      </div>`;
  }
}

/* ======================================================================
   MAGICAL SEARCH (nav dropdown)
====================================================================== */
function buildSearchIndex(query){
  const q = query.toLowerCase().trim();
  if (!q) return null;
  const authors = [...new Set(BOOKS.map(b => b.author))].filter(a => a.toLowerCase().includes(q));
  const books = BOOKS.filter(b => b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q)).slice(0,4);
  const stores = BOOKSTORES.filter(s => s.name.toLowerCase().includes(q) || s.neighborhood.toLowerCase().includes(q) || s.specialties.some(sp=>sp.toLowerCase().includes(q))).slice(0,3);
  const events = EVENTS.filter(e => e.title.toLowerCase().includes(q)).slice(0,3);
  return { authors, books, stores, events };
}

function renderNavDropdown(query){
  const dd = document.getElementById('nav-search-dropdown');
  const idx = buildSearchIndex(query);
  if (!idx || (!idx.authors.length && !idx.books.length && !idx.stores.length && !idx.events.length)) {
    dd.classList.add('hidden');
    return;
  }
  let html = '';
  if (idx.authors.length) html += group('Authors', idx.authors.map(a => item(a, '', () => `go('search',{query:'${a.replace(/'/g,"\\'")}'})`)));
  if (idx.books.length) html += group('Books', idx.books.map(b => item(b.title, b.author, () => {
    const listing = LISTINGS.find(l=>l.bookId===b.id);
    return `go('book',{bookId:'${b.id}', bookstoreId:'${listing?listing.bookstoreId:''}'})`;
  })));
  if (idx.stores.length) html += group('Bookstores', idx.stores.map(s => item(s.name, s.neighborhood, () => `go('bookstore',{bookstoreId:'${s.id}'})`)));
  if (idx.events.length) html += group('Events', idx.events.map(e => item(e.title, e.date, () => `go('community')`)));
  dd.innerHTML = html;
  dd.classList.remove('hidden');

  function group(label, itemsHtml){
    return `<div class="px-4 pt-3 pb-1 text-[10px] font-semibold tracking-widest uppercase text-ink/35">${label}</div>${itemsHtml.join('')}`;
  }
  function item(title, sub, actionFn){
    return `<button onclick="${actionFn()}" class="w-full text-left px-4 py-2.5 hover:bg-cream/70 flex items-center justify-between group">
      <span class="text-sm text-ink/85 group-hover:text-forest">${title}</span>
      <span class="text-xs text-ink/40">${sub}</span>
    </button>`;
  }
}

['nav-search-input'].forEach(id => {
  document.getElementById(id).addEventListener('input', e => renderNavDropdown(e.target.value));
  document.getElementById(id).addEventListener('keydown', e => {
    if (e.key === 'Enter' && e.target.value.trim()) { go('search', {query: e.target.value.trim()}); e.target.blur(); }
  });
});
document.addEventListener('click', e => {
  if (!document.getElementById('nav-search-wrap').contains(e.target)) {
    document.getElementById('nav-search-dropdown').classList.add('hidden');
  }
});

document.getElementById('search-page-input').addEventListener('keydown', e => {
  if (e.key === 'Enter' && e.target.value.trim()) go('search', {query: e.target.value.trim()});
});

/* ======================================================================
   INIT
====================================================================== */
renderHome();
go('home');
