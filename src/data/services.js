// Single source of truth for the 12 services.
//
// Consumed by:
//   pages/services.astro          — the card grid + the detail modal
//   pages/services/[slug].astro   — one real, indexable page per service
//   components/Header.astro       — the nav dropdown
//   components/Footer.astro       — the footer service list
//
// Every service needs: id, num, category, title, cardDesc, desc, highlights,
// faqs, bookLabel, bookHref, imgDesc, icon, bgIcon.
//
// The remaining fields are optional and render conditionally, so a service
// without them still produces a complete page. Only dental-implants carries
// the long-form set today (lifted from the old hand-built /service page);
// the rest render from desc + highlights + faqs.

export const services = [
  {
    id: 'general-dentistry',
    num: '01 — General',
    category: 'General dentistry',
    title: 'General Dentistry',
    metaDescription:
      'General dentistry in Huntington Beach — cleanings, exams, digital X-rays and fillings for every age, with Dr. Jason Fu. Call (714) 893-2106.',
    cardDesc: 'Cleanings, exams, and checkups that keep your smile healthy for life.',
    desc: 'From routine cleanings to digital X-rays, general dentistry keeps your whole mouth healthy. We focus on catching problems early, guiding prevention, and making sure every visit is comfortable and clear—no jargon, no surprises.',
    highlights: ['Checkup & professional cleaning', 'Digital X-rays & full-mouth exam', 'Cavity treatment & tooth-colored fillings', 'Personalized home care guidance'],
    faqs: [
      { q: 'How often should I come in for a cleaning?', a: "Every six months for most patients. If you've had gum disease or other concerns, we may recommend more frequent visits." },
      { q: "What if I haven't been to the dentist in years?", a: "More common than you'd think—and you're always welcome without judgment. We'll start with a thorough exam and go at your pace." },
      { q: 'Are digital X-rays safe?', a: 'Yes. Digital X-rays emit significantly less radiation than traditional film and give us clearer images to work with.' },
      { q: 'Do you see children as well as adults?', a: "Absolutely. We provide gentle, age-appropriate care from a toddler's first visit to seniors." },
    ],
    bookLabel: 'Book a Cleaning or Checkup',
    bookHref: '/contact',
    imgDesc: 'Welcoming clinical setting or patient smiling comfortably in chair',
    icon: '<path d="M9 2C6.5 2 5 4.5 5 7c0 2.5.8 4.8 1.6 7.5L8 22h8l1.4-7.5C18.2 11.8 19 9.5 19 7c0-2.5-1.5-5-4-5-1 0-1.8.5-3 .5-1.2 0-2-.5-3-.5z"/>',
    bgIcon: '<path d="M9 2C6.5 2 5 4.5 5 7c0 2.5.8 4.8 1.6 7.5L8 22h8l1.4-7.5C18.2 11.8 19 9.5 19 7c0-2.5-1.5-5-4-5-1 0-1.8.5-3 .5-1.2 0-2-.5-3-.5z"/>',
  },
  {
    id: 'cosmetic-dentistry',
    num: '02 — Cosmetic',
    category: 'Cosmetic dentistry',
    title: 'Cosmetic Dentistry',
    metaDescription:
      'Cosmetic dentistry in Huntington Beach — whitening, veneers, bonding and full smile makeovers tailored to look naturally you. Call (714) 893-2106.',
    cardDesc: 'Whitening, veneers, and bonding to brighten and refine your natural smile.',
    desc: "Whether you want a subtle refresh or a complete transformation, we tailor every cosmetic treatment to your face, smile goals, and lifestyle. Results that look naturally you—never overdone.",
    highlights: ['Teeth whitening (in-office & take-home)', 'Dental bonding & contouring', 'Veneers & smile design', 'Complete smile makeovers'],
    faqs: [
      { q: "What's the difference between whitening and veneers?", a: "Whitening brightens your existing teeth's color. Veneers reshape, resize, and recolor—ideal for more significant changes." },
      { q: 'Is cosmetic work painful?', a: "Most cosmetic treatments involve little to no discomfort. We'll always walk you through what to expect beforehand." },
      { q: 'How long do results last?', a: "Whitening lasts months to years with touch-ups. Veneers and bonding can last a decade or more with proper care." },
      { q: 'Will it look natural?', a: "Yes—we design around your facial proportions and natural tooth shade so results look like the best version of you." },
    ],
    bookLabel: 'Book a Cosmetic Consultation',
    bookHref: '/contact',
    imgDesc: 'Patient with bright, natural smile; soft studio lighting',
    icon: '<path d="M10 3C8 3 7 5 7 7c0 2 .6 3.8 1.2 6L9.5 19h5L16 13c.6-2.2 1.2-4 1.2-6 0-2-1-4-3.2-4-1 0-1.5.4-2 .4S11 3 10 3z"/><path d="M19 2l.5 1.5 1.5.5-1.5.5L19 6l-.5-1.5L17 4l1.5-.5z"/>',
    bgIcon: '<path d="M10 3C8 3 7 5 7 7c0 2 .6 3.8 1.2 6L9.5 19h5L16 13c.6-2.2 1.2-4 1.2-6 0-2-1-4-3.2-4-1 0-1.5.4-2 .4S11 3 10 3z"/>',
  },
  {
    id: 'dental-implants',
    num: '03 — Restorative',
    category: 'Restorative dentistry',
    title: 'Dental Implants',
    metaTitle: 'Dental Implants — Oasis Dental Care, Huntington Beach',
    metaDescription:
      'Permanent, natural-looking dental implants in Huntington Beach. Restore missing teeth with Dr. Jason Fu at Oasis Dental Care. Call (714) 893-2106.',
    cardDesc: 'A permanent, natural-looking replacement for one or more missing teeth.',
    desc: "A titanium post replaces the tooth root, topped with a custom crown matched to your natural teeth. Unlike bridges, implants don't affect neighboring teeth—and unlike dentures, they're fixed, permanent, and preserve your jawbone.",
    highlights: ['3D imaging & personalized treatment plan', 'In-office implant placement', 'Healing period (osseointegration)', 'Custom crown fabrication & final placement'],
    faqs: [
      { q: 'Will the procedure hurt?', a: "Most patients say the process is easier than expected. We use modern anesthesia and gentle techniques to keep you comfortable during each step, and most people manage post-procedure soreness with simple over-the-counter pain relief." },
      { q: 'How long do dental implants last?', a: "With good care, dental implants can last decades—often a lifetime. They're designed to be a long-term solution, not just a quick fix." },
      { q: 'Am I too old (or too young) for implants?', a: "Implants are a great option for healthy adults of almost any age. If you're considering them, we'll check your health and bone structure to make sure it's the right choice for you." },
      { q: "What's recovery like?", a: "Most patients return to their routine the next day, with only minor adjustments. We'll guide you through the healing process and support you at every visit." },
      { q: 'How much do dental implants cost?', a: "We're happy to discuss costs and insurance options in advance—no surprises, no pressure. Flexible payment plans are available, and we'll help you understand all your choices." },
    ],
    bookLabel: 'Schedule an Implant Consultation',
    bookHref: '/contact',
    imgDesc: 'Confident patient with full smile; implant cross-section diagram',
    icon: '<path d="M12 2v7"/><rect x="9" y="9" width="6" height="3" rx="1"/><path d="M10.5 12l-1 8h5l-1-8"/>',
    bgIcon: '<path d="M12 2v7"/><rect x="9" y="9" width="6" height="3" rx="1"/><path d="M10.5 12l-1 8h5l-1-8"/>',

    // Long-form content carried over from the retired /service page so this
    // page renders as it did before the route was generalised.
    heroIntro:
      'Missing a tooth — or several? Implants provide a permanent foundation for strong, natural-looking replacement teeth, so you can eat, speak and smile with confidence.',
    overviewHeading: 'A confident smile, rebuilt to last.',
    overview: [
      'A dental implant is a small titanium post that acts as a new tooth root. Once placed, it fuses with your jawbone to create a stable base for a custom crown that looks and feels like a natural tooth. Implants help preserve bone, protect neighboring teeth, and restore full chewing strength.',
      'At Oasis Dental Care, Dr. Fu plans every implant with 3D imaging for precise, comfortable placement — and walks you through each option so you know exactly what to expect.',
    ],
    eligibility: {
      heading: 'Implants may be right for you if you…',
      items: [
        'Are missing one or more teeth, or have a failing tooth',
        'Want a permanent alternative to dentures or bridges',
        'Are tired of a removable appliance shifting while you eat or speak',
        'Want to protect your jawbone and facial structure long-term',
      ],
    },
    steps: [
      { title: 'Consultation & 3D scan', body: 'We review your goals, take digital imaging, and map a precise plan — including a clear cost and insurance breakdown.' },
      { title: 'Gentle implant placement', body: 'The titanium post is placed with local anesthetic and comfort options. Most patients are surprised how easy it is.' },
      { title: 'Healing & integration', body: 'Over a few months the implant fuses with the bone. We check in along the way and keep you comfortable.' },
      { title: 'Your custom crown', body: 'We attach a natural-looking crown color-matched to your smile. You leave with a tooth that feels like your own.' },
    ],
    asideTitle: 'Book your implant consult',
    asideRows: ['Consults typically 45–60 min', 'Most insurance accepted & verified up front', '3D-guided, comfort-focused care'],
  },
  {
    id: 'invisalign',
    num: '04 — Orthodontics',
    category: 'Orthodontics',
    title: 'Invisalign Treatment',
    metaDescription:
      'Invisalign clear aligners in Huntington Beach. A certified Invisalign provider — straighten your teeth with no brackets or wires. Call (714) 893-2106.',
    cardDesc: 'Clear, removable aligners that straighten teeth — no brackets or wires.',
    desc: "Clear, custom-made aligners gradually move your teeth into the right position. You wear them nearly all day, but they come out for eating and brushing—and they're virtually invisible in conversation.",
    highlights: ['Custom 3D treatment preview', 'New aligner sets every 1–2 weeks', 'Removable for meals & brushing', 'No brackets, wires, or dietary restrictions'],
    faqs: [
      { q: 'How long does Invisalign treatment take?', a: "Treatment length varies but typically ranges from 6 to 18 months depending on your specific needs. Invisalign Express offers faster treatment for minor adjustments." },
      { q: 'Are Invisalign aligners comfortable?', a: "Yes! They are made from smooth, BPA-free plastic designed to fit snugly and gently move your teeth, causing minimal discomfort compared to traditional braces." },
      { q: 'Can I eat and drink with Invisalign?', a: "It's best to remove your aligners when eating or drinking anything other than water to avoid staining and damage." },
      { q: 'How often do I need to wear the aligners?', a: "For best results, wear your aligners 20 to 22 hours per day, removing them only to eat, brush, and floss." },
      { q: 'Will Invisalign affect my speech?', a: "Most patients adapt quickly, and any temporary lisp typically disappears within a few days." },
      { q: 'How often will I need check-ins during treatment?', a: "You'll have periodic visits—usually every 6 to 8 weeks—so we can monitor your progress and provide your next set of aligners. These appointments are quick and comfortable, and they help ensure your treatment stays on track." },
    ],
    bookLabel: 'Book an Invisalign Consultation',
    bookHref: '/contact',
    imgDesc: 'Patient wearing clear aligners; confident smile in natural light',
    icon: '<path d="M3 10c0-2.8 4-5 9-5s9 2.2 9 5v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M7 14v2.5M12 14.5V18M17 14v2.5"/>',
    bgIcon: '<path d="M3 10c0-2.8 4-5 9-5s9 2.2 9 5v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
  },
  {
    id: 'crowns-bridges',
    num: '05 — Restorative',
    category: 'Restorative dentistry',
    title: 'Crowns & Bridges',
    metaDescription:
      'Custom crowns and bridges in Huntington Beach. Tooth-colored porcelain and zirconia restorations that rebuild your bite. Call (714) 893-2106.',
    cardDesc: 'Custom restorations that repair damaged teeth and fill the gaps left by missing ones.',
    desc: "Crowns cap and protect a damaged or weakened tooth. Bridges fill the gap left by a missing tooth, anchored to neighboring teeth or implants. Both restore your bite, your appearance, and your confidence—typically in just two visits.",
    highlights: ['Custom-fit crown or bridge', 'Tooth-colored porcelain or zirconia options', 'Anchored for lasting stability', 'Restores bite force & appearance'],
    faqs: [
      { q: 'How long do crowns and bridges last?', a: "With proper care, crowns and bridges can last 10-15 years or longer. Regular dental visits and good oral hygiene are key to their longevity." },
      { q: 'Are crowns and bridges noticeable?', a: "We use tooth-colored materials that match your natural teeth closely, making crowns and bridges virtually indistinguishable from your own smile." },
      { q: 'Is the procedure painful?', a: "We numb the area thoroughly to ensure your comfort during preparation and placement. Most patients report minimal discomfort." },
      { q: 'Can I eat normally with crowns or bridges?', a: "Yes. Once placed, crowns and bridges function like natural teeth, allowing you to eat, speak, and smile confidently." },
      { q: 'Will my insurance cover crowns and bridges?', a: "Many dental plans cover crowns and bridges partially. We'll help you understand your benefits and provide clear cost estimates upfront." },
    ],
    bookLabel: 'Book a Crown or Bridge Consultation',
    bookHref: '/contact',
    imgDesc: 'Restored smile; crown fitting or bridge placement visual',
    icon: '<path d="M3 20h18M5 20V10l3.5 4L12 3l3.5 11L19 10v10"/>',
    bgIcon: '<path d="M3 20h18M5 20V10l3.5 4L12 3l3.5 11L19 10v10"/>',
  },
  {
    id: 'emergency-dentistry',
    num: '06 — Emergency',
    category: 'Emergency care',
    title: 'Emergency Dentistry',
    metaDescription:
      'Emergency dentist in Huntington Beach. Same-day relief for toothaches, broken teeth and dental infections. Call (714) 893-2106.',
    cardDesc: 'Same-day relief for toothaches, broken teeth, and dental pain.',
    desc: "Dental emergencies don't wait. We keep same-day slots open for urgent situations—severe toothaches, broken teeth, lost crowns, dental infections, and trauma. Call us first and we'll get you in fast.",
    highlights: ['Same-day & next-day availability', 'Toothaches & dental infections', 'Broken, chipped, or knocked-out teeth', 'Lost fillings, crowns & trauma care'],
    faqs: [
      { q: 'What counts as a dental emergency?', a: "Severe pain, swelling, broken or knocked-out teeth, persistent bleeding, or any sudden change in your mouth that worries you should be treated as an emergency. If you're unsure, call us—we'll help you decide what to do next." },
      { q: 'Can a knocked-out tooth be saved?', a: "Often, yes—if you act quickly. Keep the tooth moist (in milk or your cheek), avoid touching the root, and call us right away. Fast action increases the chance of saving the tooth." },
      { q: 'What if my dental emergency happens after hours?', a: "Call our office—our voicemail will give you instructions, and we do our best to respond to true emergencies as soon as possible, even after hours." },
      { q: 'Will insurance cover emergency dental care?', a: "Most plans cover some emergency services. We'll check your benefits, explain costs up front, and help you find solutions if you don't have insurance." },
      { q: 'Do I need an appointment for emergency care?', a: "We prioritize emergency calls and can usually see you the same day. It's best to call ahead so we can prepare for your arrival." },
    ],
    bookLabel: 'Call for Emergency Care',
    bookHref: 'tel:7148932106',
    imgDesc: 'Calm, reassuring clinical environment; prompt, compassionate care',
    icon: '<path d="M9.5 2C7 2 5.5 4 5.5 6.5c0 2.3.7 4.3 1.4 7L8 20h8l1.1-6.5c.7-2.7 1.4-4.7 1.4-7C18.5 4 17 2 14.5 2z"/><path d="M13.5 7.5l-3 5H13l-2 4.5 5-7h-3z"/>',
    bgIcon: '<path d="M9.5 2C7 2 5.5 4 5.5 6.5c0 2.3.7 4.3 1.4 7L8 20h8l1.1-6.5c.7-2.7 1.4-4.7 1.4-7C18.5 4 17 2 14.5 2z"/>',
  },
  {
    id: 'teeth-whitening',
    num: '07 — Cosmetic',
    category: 'Cosmetic dentistry',
    title: 'Teeth Whitening',
    metaDescription:
      'Professional teeth whitening in Huntington Beach — in-office treatment and custom take-home trays that lift years of stains. Call (714) 893-2106.',
    cardDesc: 'Professional whitening that lifts stains and brightens your smile.',
    desc: "Professional whitening is faster and more effective than anything over-the-counter. We offer in-office treatment for a quick, dramatic lift—or custom take-home trays for gradual brightening on your own schedule.",
    highlights: ['In-office treatment (approx. 1 hour)', 'Custom take-home tray kits', 'Removes coffee, tea & wine stains', 'Safe for enamel under professional supervision'],
    faqs: [
      { q: 'Is teeth whitening safe?', a: "Yes. Professional whitening uses controlled, dentist-supervised treatments designed to protect your teeth and gums while lightening stains." },
      { q: 'Will whitening make my teeth sensitive?', a: "Some patients experience mild sensitivity during or after treatment, but it's usually temporary. We offer solutions to minimize discomfort." },
      { q: 'How long do whitening results last?', a: "Results vary, but with good care, whitening effects can last from several months up to a few years. Touch-ups may be recommended." },
      { q: 'Can anyone get their teeth whitened?', a: "Most adults and teens are good candidates, but whitening isn't recommended for pregnant women or those with certain dental conditions. We evaluate your suitability during consultation." },
      { q: 'How quickly will I see results?', a: "In-office treatments can brighten teeth several shades in a single visit, while take-home kits show gradual improvement over days or weeks." },
    ],
    bookLabel: 'Book a Whitening Appointment',
    bookHref: '/contact',
    imgDesc: 'Patient with bright, confident smile; before/after lighting',
    icon: '<path d="M10 3.5C8 3.5 7 5.5 7 7.5c0 2 .6 3.8 1.2 6L9.5 19h5L16 13.5c.6-2.2 1.2-4 1.2-6 0-2-1-4-3.2-4-1 0-1.5.5-2 .5S11 3.5 10 3.5z"/><path d="M19.5 3v2.5M18.2 4.3l1.8 1.8M20.5 4.8h-2.5"/>',
    bgIcon: '<path d="M10 3.5C8 3.5 7 5.5 7 7.5c0 2 .6 3.8 1.2 6L9.5 19h5L16 13.5c.6-2.2 1.2-4 1.2-6 0-2-1-4-3.2-4-1 0-1.5.5-2 .5S11 3.5 10 3.5z"/>',
  },
  {
    id: 'veneers',
    num: '08 — Cosmetic',
    category: 'Cosmetic dentistry',
    title: 'Veneers',
    metaDescription:
      'Porcelain veneers in Huntington Beach. Custom-designed shells that reshape colour, size and alignment for a natural result. Call (714) 893-2106.',
    cardDesc: 'Thin porcelain shells that reshape and perfect the look of your smile.',
    desc: "Ultra-thin porcelain shells bonded to the front of your teeth to change their color, shape, length, or alignment. Designed specifically for your smile—durable, stain-resistant, and remarkably natural-looking.",
    highlights: ['Custom-designed porcelain shells', 'Addresses color, shape & proportion', 'Highly stain-resistant & long-lasting', 'Minimal tooth reduction required'],
    faqs: [
      { q: 'Are veneers permanent?', a: "While veneers are very durable, they do require some removal of enamel and are considered a permanent cosmetic treatment. With proper care, they can last 10-15 years or longer." },
      { q: 'Do veneers look natural?', a: "Yes! Veneers are custom-made to match the color, shape, and translucency of your natural teeth for a seamless appearance." },
      { q: 'Is the veneer application painful?', a: "Most patients experience little to no discomfort during the procedure. Local anesthesia is used when enamel is removed." },
      { q: 'Can veneers fix crooked teeth?', a: "Veneers can mask minor misalignments and gaps, but severe cases may require orthodontic treatment." },
      { q: 'How do I care for my veneers?', a: "Good oral hygiene, regular dental visits, and avoiding excessive biting on hard objects will help keep veneers looking their best." },
      { q: 'How long do veneers last?', a: "Veneers can last many years with proper care. Good oral hygiene and regular dental visits will help them stay in excellent condition." },
    ],
    bookLabel: 'Book a Veneer Consultation',
    bookHref: '/contact',
    imgDesc: 'Close-up of porcelain veneer smile; natural, polished result',
    icon: '<rect x="2" y="6" width="20" height="12" rx="2"/><path d="M8 6V4M16 6V4M2 10h20"/>',
    bgIcon: '<rect x="2" y="6" width="20" height="12" rx="2"/>',
  },
  {
    id: 'root-canal',
    num: '09 — Restorative',
    category: 'Restorative dentistry',
    title: 'Root Canal Therapy',
    metaDescription:
      'Gentle root canal therapy in Huntington Beach. Relieve pain and save your natural tooth with Dr. Jason Fu. Call (714) 893-2106.',
    cardDesc: 'Gentle treatment that relieves pain and saves your natural tooth.',
    desc: "A root canal removes infected or inflamed tissue from inside the tooth, relieving pain and saving the natural tooth from extraction. Modern technique and anesthesia make it far more comfortable than its reputation suggests—most patients are genuinely surprised.",
    highlights: ['Removes infection & relieves pain', 'Preserves your natural tooth', 'Full local anesthesia for comfort', 'Usually followed by a protective crown'],
    faqs: [
      { q: 'Is a root canal painful?', a: "Most patients are surprised by how comfortable the procedure is. With modern anesthesia and gentle care, a root canal often feels no different than getting a filling." },
      { q: 'How do I know if I need a root canal?', a: "Symptoms can include ongoing tooth pain, sensitivity to hot or cold, swelling, or a pimple on the gums. The best way to know for sure is a dental exam and x-rays." },
      { q: 'Will my tooth look or feel different afterward?', a: "Once restored with a filling or crown, your tooth will look and function like any other. You'll be able to eat, speak, and smile with confidence." },
      { q: 'How long does a root canal take?', a: "Most root canals are completed in one to two appointments, depending on the tooth and the severity of the infection." },
      { q: 'Will my insurance cover a root canal?', a: "Most dental insurance plans cover some or all of the cost of root canal therapy. Our team will help you understand your benefits and out-of-pocket costs before starting." },
    ],
    bookLabel: 'Book a Root Canal Consultation',
    bookHref: '/contact',
    imgDesc: 'Comfortable clinical environment; patient relaxed post-treatment',
    icon: '<circle cx="12" cy="12" r="9"/><path d="M9 12h6M12 9v6"/>',
    bgIcon: '<circle cx="12" cy="12" r="9"/>',
  },
  {
    id: 'extractions',
    num: '10 — General',
    category: 'General dentistry',
    title: 'Extractions',
    metaDescription:
      'Gentle tooth extractions and wisdom tooth removal in Huntington Beach, with clear aftercare and replacement options. Call (714) 893-2106.',
    cardDesc: 'Comfortable, gentle tooth removal with clear, caring aftercare.',
    desc: "When a tooth needs to come out—due to severe decay, crowding, infection, or impaction—we handle it with precision and care. We'll also walk you through your replacement options so you leave knowing exactly what comes next.",
    highlights: ['Simple & surgical extractions', 'Wisdom tooth removal', 'Gentle technique & full anesthesia', 'Clear aftercare & next-step guidance'],
    faqs: [
      { q: 'Will the extraction hurt?', a: "We use strong local anesthesia to keep you comfortable, and we check in with you throughout the procedure. If you're nervous, let us know—we can discuss sedation or additional comfort options." },
      { q: 'How long is recovery?', a: "Most people feel much better within a couple of days. We'll give you clear aftercare instructions, and you can always call if you have questions while you heal." },
      { q: 'What can I eat after an extraction?', a: "Stick to soft, cool foods (like yogurt or applesauce) for the first day or two. We'll give you a full list and tips for an easy recovery." },
      { q: 'Will I need to replace the tooth?', a: "Depending on the location, you might benefit from a replacement (like an implant, bridge, or partial denture) to maintain your bite and appearance. We'll help you explore all your options." },
      { q: "What if I'm anxious about the procedure?", a: "You're not alone—many people feel this way. Our team is skilled at easing nerves, and we'll work with you to make your visit as stress-free as possible." },
      { q: 'How do I know if an extraction is really necessary?', a: "We only recommend removing a tooth when it's the healthiest option for your long-term well-being. Before deciding, Dr. Fu will review digital images with you, explain what's going on in clear terms, and discuss any alternatives. You'll always understand the “why” behind the recommendation before moving forward." },
    ],
    bookLabel: 'Book an Extraction Consultation',
    bookHref: '/contact',
    imgDesc: 'Gentle, calm clinical environment; focused, caring procedure',
    icon: '<path d="M3 6h18M3 12h18M3 18h18"/>',
    bgIcon: '<path d="M3 6h18M3 12h18M3 18h18"/>',
  },
  {
    id: 'periodontal-care',
    num: '11 — Periodontal',
    category: 'Periodontal care',
    title: 'Periodontal Care',
    metaDescription:
      'Gum disease treatment in Huntington Beach — evaluations, deep cleaning (scaling and root planing) and ongoing maintenance. Call (714) 893-2106.',
    cardDesc: "Gentle gum care that protects your smile's foundation from disease.",
    desc: "Your gums are the foundation of your entire smile. We provide thorough evaluations, deep cleanings, and ongoing maintenance to stop gum disease in its tracks—and keep it from coming back.",
    highlights: ['Comprehensive gum evaluation', 'Scaling & root planing (deep cleaning)', 'Ongoing periodontal maintenance visits', 'Gum disease prevention & patient education'],
    faqs: [
      { q: 'What causes gum disease?', a: "Gum disease is caused by plaque buildup along and below the gum line. Factors like poor oral hygiene, smoking, genetics, and certain health conditions can increase risk." },
      { q: 'What are the signs of gum disease?', a: "Look for redness, swelling, bleeding gums, persistent bad breath, or loose teeth. Early detection is key to effective treatment." },
      { q: 'How is gum disease treated?', a: "Treatment can range from professional cleanings to deep cleanings (scaling and root planing) and, in advanced cases, surgical procedures." },
      { q: 'Can gum disease affect my overall health?', a: "Yes. Research links gum disease to heart disease, diabetes, and other systemic conditions, making periodontal care vital." },
      { q: 'How often should I have periodontal checkups?', a: "Depending on your gum health, your dentist may recommend visits every 3 to 6 months for monitoring and maintenance." },
    ],
    bookLabel: 'Book a Periodontal Evaluation',
    bookHref: '/contact',
    imgDesc: 'Healthy gum tissue; clinical gum assessment in progress',
    icon: '<path d="M12 2 4 5v6c0 5 3.5 9 8 11 4.5-2 8-6 8-11V5l-8-3z"/>',
    bgIcon: '<path d="M12 2 4 5v6c0 5 3.5 9 8 11 4.5-2 8-6 8-11V5l-8-3z"/>',
  },
  {
    id: 'pediatric-dentistry',
    num: '12 — Pediatric',
    category: 'Pediatric dentistry',
    title: 'Pediatric Dentistry',
    metaDescription:
      'Kind, patient pediatric dentistry in Huntington Beach — first visits, cleanings, sealants and fluoride for kids of every age. Call (714) 893-2106.',
    cardDesc: 'Kind, patient dental care for kids of every age.',
    desc: "We make first dental visits—and every visit after—a genuinely positive experience. Our approach is patient, unhurried, and kid-friendly, building the confidence and habits kids carry into adulthood.",
    highlights: ["First visits for infants & toddlers", 'Cleanings, exams & sealants', 'Fluoride treatments', 'Early orthodontic monitoring'],
    faqs: [
      { q: 'When should my child have their first dental visit?', a: "We recommend bringing your child in by their first birthday, or within six months of the first tooth erupting. Early visits help your child get comfortable and allow us to spot any concerns right away." },
      { q: 'How often should children see the dentist?', a: "Just like adults, kids benefit from regular checkups every six months. Some children may need more frequent visits if they're prone to cavities or have special concerns." },
      { q: 'What if my child is nervous or afraid?', a: "That's completely normal! Our team is experienced in working with anxious kids. We take things slow, explain each step, and use plenty of positive reinforcement to help build trust and confidence." },
      { q: 'Are baby teeth really that important?', a: "Yes! Healthy baby teeth help children chew, speak, and smile. They also hold space for adult teeth and contribute to overall health." },
      { q: 'Do you offer sealants or fluoride treatments?', a: "Absolutely. We recommend sealants and fluoride for most children to protect against cavities and strengthen enamel." },
    ],
    bookLabel: "Book Your Child's First Visit",
    bookHref: '/contact',
    imgDesc: "Child-friendly office; child patient smiling with dentist",
    icon: '<circle cx="12" cy="8" r="4"/><path d="M6 20v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/>',
    bgIcon: '<circle cx="12" cy="8" r="4"/>',
  },
];

// Up to three siblings for the "Related care" deck, preferring the same
// category and topping up in array order so every page gets a full row.
export function relatedTo(id) {
  const others = services.filter((s) => s.id !== id);
  const self = services.find((s) => s.id === id);
  const sameCategory = others.filter((s) => s.category === self.category);
  const rest = others.filter((s) => s.category !== self.category);
  return [...sameCategory, ...rest].slice(0, 3);
}
