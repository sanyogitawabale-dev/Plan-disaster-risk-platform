/**
 * GeoShield India — Multilingual Disaster & Environmental Glossary
 * Covers 12 statutory and widely spoken Indian languages.
 *
 * Terminology design:
 * - Technical term (official scientific / meteorological name)
 * - Plain language meaning (accessible to citizens with no scientific training)
 * - Cultural context & localized safety wording
 */

export type SupportedLanguageCode =
  | 'en' // English
  | 'hi' // Hindi (हिन्दी)
  | 'or' // Odia (ଓଡ଼ିଆ)
  | 'mr' // Marathi (मराठी)
  | 'bn' // Bengali (বাংলা)
  | 'ta' // Tamil (தமிழ்)
  | 'te' // Telugu (తెలుగు)
  | 'kn' // Kannada (ಕನ್ನಡ)
  | 'ml' // Malayalam (മലയാളം)
  | 'gu' // Gujarati (ગુજરાતી)
  | 'pa' // Punjabi (ਪੰਜਾਬੀ)
  | 'ur'; // Urdu (اردو)

export interface LanguageMeta {
  code: SupportedLanguageCode;
  name: string;
  nativeName: string;
  scriptDirection: 'ltr' | 'rtl';
}

export const SUPPORTED_LANGUAGES: LanguageMeta[] = [
  { code: 'en', name: 'English', nativeName: 'English', scriptDirection: 'ltr' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', scriptDirection: 'ltr' },
  { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ', scriptDirection: 'ltr' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', scriptDirection: 'ltr' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', scriptDirection: 'ltr' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', scriptDirection: 'ltr' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', scriptDirection: 'ltr' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', scriptDirection: 'ltr' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', scriptDirection: 'ltr' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', scriptDirection: 'ltr' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', scriptDirection: 'ltr' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو', scriptDirection: 'rtl' }
];

export interface TermDefinition {
  technicalTerm: string;
  simpleMeaning: string;
  actionGuidance: string;
}

export interface UiTranslations {
  pageTitle: string;
  pageSubtitle: string;
  citizenMode: string;
  expertMode: string;
  searchPlaceholder: string;
  currentSituation: string;
  whatDoesThisMean: string;
  currentConcern: string;
  whatMayHappenNext: string;
  whatShouldPeopleDo: string;
  whyDoesThisMatter: string;
  whatChangedRecently: string;
  explainThisToMe: string;
  officialWarningHeader: string;
  geoshieldAnalysisHeader: string;
  dataSourceTransparency: string;
  situationAroundMe: string;
  exploreData: string;
  liveStatus: string;
  supplementaryStatus: string;
  forecastStatus: string;
  historicalStatus: string;
  riskLevels: {
    low: string;
    moderate: string;
    high: string;
    critical: string;
  };
  hazards: {
    flood: string;
    cyclone: string;
    coastalSurge: string;
    earthquake: string;
    landslide: string;
    heat: string;
  };
}

export const MULTILINGUAL_DICTIONARY: Record<SupportedLanguageCode, {
  ui: UiTranslations;
  terms: Record<string, TermDefinition>;
}> = {
  en: {
    ui: {
      pageTitle: "Earth & Environmental Situation",
      pageSubtitle: "What is happening in our world right now?",
      citizenMode: "Citizen Mode",
      expertMode: "Expert Mode",
      searchPlaceholder: "Search city, district, river basin, or country...",
      currentSituation: "Current Situation",
      whatDoesThisMean: "What does this mean?",
      currentConcern: "Current Concern",
      whatMayHappenNext: "What could happen next?",
      whatShouldPeopleDo: "What should people do?",
      whyDoesThisMatter: "Why does this matter?",
      whatChangedRecently: "What changed recently?",
      explainThisToMe: "Explain this to me",
      officialWarningHeader: "Official Government Warning",
      geoshieldAnalysisHeader: "GeoShield Scientific Intelligence",
      dataSourceTransparency: "Where does this information come from?",
      situationAroundMe: "Situation Around Me",
      exploreData: "Explore More Data",
      liveStatus: "LIVE DATA",
      supplementaryStatus: "RECENT / SUPPLEMENTARY",
      forecastStatus: "MODEL FORECAST",
      historicalStatus: "HISTORICAL BENCHMARK",
      riskLevels: {
        low: "LOW",
        moderate: "MODERATE",
        high: "HIGH",
        critical: "CRITICAL"
      },
      hazards: {
        flood: "River Flood",
        cyclone: "Cyclone / Storm",
        coastalSurge: "Coastal Sea Surge",
        earthquake: "Earthquake Activity",
        landslide: "Hill Slope Landslide",
        heat: "Extreme Weather"
      }
    },
    terms: {
      flood_risk: {
        technicalTerm: "Riverine Hydrodynamic Flood Risk",
        simpleMeaning: "Water in nearby rivers is rising significantly above its normal banks.",
        actionGuidance: "Stay clear of river banks, culverts, and low-lying roads. Prepare emergency essentials."
      },
      storm_surge: {
        technicalTerm: "Atmospheric Coastal Storm Surge",
        simpleMeaning: "The sea level is rising abnormally high and being pushed ashore by cyclonic winds.",
        actionGuidance: "Move away from the beach and coastal roads to designated elevated storm shelters."
      },
      danger_stage: {
        technicalTerm: "Statutory CWC Gauge Danger Level",
        simpleMeaning: "The river has surpassed the official safety threshold where inundation of inhabited areas begins.",
        actionGuidance: "Evacuate low-lying river blockages if directed by district disaster management authorities."
      }
    }
  },
  hi: {
    ui: {
      pageTitle: "पृथ्वी और पर्यावरण की स्थिति",
      pageSubtitle: "इस समय हमारी दुनिया में क्या हो रहा है?",
      citizenMode: "नागरिक मोड",
      expertMode: "विशेषज्ञ मोड",
      searchPlaceholder: "शहर, जिला, नदी बेसिन या देश खोजें...",
      currentSituation: "वर्तमान स्थिति",
      whatDoesThisMean: "इसका क्या अर्थ है?",
      currentConcern: "वर्तमान चिंता",
      whatMayHappenNext: "आगे क्या हो सकता है?",
      whatShouldPeopleDo: "नागरिकों को क्या करना चाहिए?",
      whyDoesThisMatter: "यह आपके लिए क्यों महत्वपूर्ण है?",
      whatChangedRecently: "हाल ही में क्या बदलाव हुआ?",
      explainThisToMe: "इसे मुझे आसान भाषा में समझाएं",
      officialWarningHeader: "आधिकारिक सरकारी चेतावनी",
      geoshieldAnalysisHeader: "जियोशील्ड वैज्ञानिक विश्लेषण",
      dataSourceTransparency: "यह जानकारी कहां से आती है?",
      situationAroundMe: "मेरे आस-पास की स्थिति",
      exploreData: "अन्य डेटा देखें",
      liveStatus: "लाइव डेटा",
      supplementaryStatus: "हालिया / पूरक डेटा",
      forecastStatus: "मॉडल पूर्वानुमान",
      historicalStatus: "ऐतिहासिक संदर्भ",
      riskLevels: {
        low: "कम (LOW)",
        moderate: "मध्यम (MODERATE)",
        high: "गंभीर (HIGH)",
        critical: "अति गंभीर (CRITICAL)"
      },
      hazards: {
        flood: "नदी की बाढ़",
        cyclone: "चक्रवात / तूफान",
        coastalSurge: "तटीय समुद्री लहरें",
        earthquake: "भूकंपीय हलचल",
        landslide: "भूस्खलन (लैंडस्लाइड)",
        heat: "चरम मौसम"
      }
    },
    terms: {
      flood_risk: {
        technicalTerm: "नदीय जलस्तर वृद्धि और बाढ़ जोखिम",
        simpleMeaning: "आस-पास की नदियों का पानी सामान्य तटों से काफी ऊपर उठ रहा है।",
        actionGuidance: "नदी किनारे और निचले रास्तों से दूर रहें। जरूरी सामान तैयार रखें।"
      },
      storm_surge: {
        technicalTerm: "समुद्री तूफानी ज्वार (स्टॉर्म सर्ज)",
        simpleMeaning: "तूफानी हवाओं के कारण समुद्र का पानी असामान्य रूप से ऊंचा उठकर जमीन की तरफ आ रहा है।",
        actionGuidance: "समुद्र तट छोड़ें और पक्के बहुउद्देशीय चक्रवात आश्रय में जाएं।"
      },
      danger_stage: {
        technicalTerm: "केंद्रीय जल आयोग (CWC) खतरा निशान",
        simpleMeaning: "नदी ने खतरे के आधिकारिक स्तर को पार कर लिया है, जिससे बस्तियों में पानी भर सकता है।",
        actionGuidance: "प्रशासन के निर्देशानुसार तुरंत ऊंचे और सुरक्षित स्थानों पर जाएं।"
      }
    }
  },
  or: {
    ui: {
      pageTitle: "ପୃଥିବୀ ଓ ପରିବେଶର ସ୍ଥିତି",
      pageSubtitle: "ଏହି ମୁହୂର୍ତ୍ତରେ ଆମ ଦୁନିଆରେ କ'ଣ ଘଟୁଛି?",
      citizenMode: "ସାଧାରଣ ନାଗରିକ ମୋଡ୍",
      expertMode: "ବିଶେଷଜ୍ଞ ମୋଡ୍",
      searchPlaceholder: "ସହର, ଜିଲ୍ଲା, ନଦୀ ଅବବାହିକା ଖୋଜନ୍ତୁ...",
      currentSituation: "ବର୍ତ୍ତମାନର ସ୍ଥିତି",
      whatDoesThisMean: "ଏହାର ଅର୍ଥ କ'ଣ?",
      currentConcern: "ମୁଖ୍ୟ ଚିନ୍ତା",
      whatMayHappenNext: "ଆଗକୁ କ'ଣ ଘଟିପାରେ?",
      whatShouldPeopleDo: "ଲୋକମାନେ କ'ଣ କରିବା ଉଚିତ?",
      whyDoesThisMatter: "ଏହା ଆପଣଙ୍କ ପାଇଁ କାହିଁକି ଜରୁରୀ?",
      whatChangedRecently: "ନିକଟରେ କ'ଣ ବଦଳିଛି?",
      explainThisToMe: "ଏହାକୁ ମୋତେ ସରଳ ଭାଷାରେ ବୁଝାନ୍ତୁ",
      officialWarningHeader: "ସରକାରୀ ଆଧିକାରିକ ସତର୍କତା",
      geoshieldAnalysisHeader: "ଜିଓସିଲ୍ଡ ବୈଜ୍ଞାନିକ ବିଶ୍ଳେଷଣ",
      dataSourceTransparency: "ଏହି ତଥ୍ୟ କେଉଁଠାରୁ ଆସିଛି?",
      situationAroundMe: "ମୋ ଆଖପାଖର ସ୍ଥିତି",
      exploreData: "ଅଧିକ ତଥ୍ୟ ଅନୁସନ୍ଧାନ କରନ୍ତୁ",
      liveStatus: "ଲାଇଭ୍ ତଥ୍ୟ",
      supplementaryStatus: "ନିକଟତମ / ଅତିରିକ୍ତ",
      forecastStatus: "ପୂର୍ବାନୁମାନ",
      historicalStatus: "ଐତିହାସିକ ତଥ୍ୟ",
      riskLevels: {
        low: "ନିମ୍ନ (LOW)",
        moderate: "ମଧ୍ୟମ (MODERATE)",
        high: "ଉଚ୍ଚ ବିପଦ (HIGH)",
        critical: "ଅତ୍ୟନ୍ତ ବିପଜ୍ଜନକ (CRITICAL)"
      },
      hazards: {
        flood: "ନଦୀ ବନ୍ୟା",
        cyclone: "ବାତ୍ୟା / ତୋଫାନ",
        coastalSurge: "ସମୁଦ୍ର ଜୁଆର ଲହରୀ",
        earthquake: "ଭୂକମ୍ପ ଗତିବିଧି",
        landslide: "ପାହାଡ଼ ଧସିବା (ଭୂସ୍ଖଳନ)",
        heat: "ଚରମ ପାଣିପାଗ"
      }
    },
    terms: {
      flood_risk: {
        technicalTerm: "ମହାନଦୀ / ବ୍ରାହ୍ମଣୀ ବନ୍ୟା ବିପଦ",
        simpleMeaning: "ନଦୀରେ ପାଣିର ସ୍ତର ସାଧାରଣ ସୀମାଠାରୁ ବହୁତ ଉପରକୁ ଉଠୁଛି।",
        actionGuidance: "ନଦୀକୂଳ ଓ ତଳିଆ ଅଞ୍ଚଳରୁ ଦୂରେଇ ରୁହନ୍ତୁ। ଜରୁରୀ ଔଷଧ ଓ ଖାଦ୍ୟ ସାଇତି ରଖନ୍ତୁ।"
      },
      storm_surge: {
        technicalTerm: "ସାମୁଦ୍ରିକ ତୋଫାନୀ ଜୁଆର (+୪.୨ ମିଟର)",
        simpleMeaning: "ପବନର ପ୍ରଖର ବେଗ ଯୋଗୁଁ ସମୁଦ୍ର ପାଣି ମାଡ଼ି ଆସି ଉପକୂଳ ଗ୍ରାମଗୁଡ଼ିକୁ ବୁଡ଼ାଇଦେଇପାରେ।",
        actionGuidance: "ତୁରନ୍ତ ନିକଟସ୍ଥ ବହୁମୁଖୀ ବାତ୍ୟା ଆଶ୍ରୟସ୍ଥଳୀ (NCRMP) କୁ ଚାଲିଯାଆନ୍ତୁ।"
      },
      danger_stage: {
        technicalTerm: "କେନ୍ଦ୍ରୀୟ ଜଳ ଆୟୋଗ (CWC) ବିପଦ ସଙ୍କେତ",
        simpleMeaning: "ନରାଜ ଓ ଯୋବ୍ରା ବ୍ୟାରେଜ୍‌ରେ ଜଳସ୍ତର ବିପଦ ସଙ୍କେତ ଟପିଯାଇଛି।",
        actionGuidance: "ଜିଲ୍ଲା ପ୍ରଶାସନର ନିର୍ଦ୍ଦେଶ ଅନୁଯାୟୀ ତଳିଆ ଅଞ୍ଚଳ ଖାଲି କରନ୍ତୁ।"
      }
    }
  },
  mr: {
    ui: {
      pageTitle: "पृथ्वी आणि पर्यावरणाची स्थिती",
      pageSubtitle: "सध्या आपल्या जगात काय घडत आहे?",
      citizenMode: "नागरिक मोड",
      expertMode: "तज्ज्ञ मोड",
      searchPlaceholder: "शहर, जिल्हा, नदी किंवा देश शोधा...",
      currentSituation: "सद्यस्थिती",
      whatDoesThisMean: "याचा नेमका अर्थ काय?",
      currentConcern: "सध्याची काळजी",
      whatMayHappenNext: "पुढे काय घडू शकते?",
      whatShouldPeopleDo: "नागरिकांनी काय करावे?",
      whyDoesThisMatter: "हे आपल्यासाठी महत्त्वाचे का आहे?",
      whatChangedRecently: "नुकताच काय बदल झाला?",
      explainThisToMe: "हे मला सोप्या भाषेत समजावून सांगा",
      officialWarningHeader: "अधिकृत सरकारी इशारा",
      geoshieldAnalysisHeader: "जिओशील्ड वैज्ञानिक विश्लेषण",
      dataSourceTransparency: "ही माहिती कुठून येते?",
      situationAroundMe: "माझ्या आजूबाजूची परिस्थिती",
      exploreData: "अधिक डेटा तपासा",
      liveStatus: "थेट डेटा (LIVE)",
      supplementaryStatus: "नुकताच मिळालेला डेटा",
      forecastStatus: "अंदाज (FORECAST)",
      historicalStatus: "ऐतिहासिक नोंद",
      riskLevels: {
        low: "कमी (LOW)",
        moderate: "मध्यम (MODERATE)",
        high: "गंभीर (HIGH)",
        critical: "अति धोकादायक (CRITICAL)"
      },
      hazards: {
        flood: "नदीचा पूर",
        cyclone: "चक्रीवादळ",
        coastalSurge: "सागरी लाटा",
        earthquake: "भूकंपीय हालचाली",
        landslide: "दरड कोसळणे",
        heat: "तीव्र हवामान"
      }
    },
    terms: {
      flood_risk: {
        technicalTerm: "नदी पूर धोका",
        simpleMeaning: "नद्यांची पाणी पातळी धोक्याच्या पातळीजवळ पोहोचली आहे.",
        actionGuidance: "नदीकाठच्या भागातून दूर जा आणि स्थानिक सूचनांचे पालन करा."
      },
      storm_surge: {
        technicalTerm: "चक्रीवादळाची सागरी लाट",
        simpleMeaning: "वादळामुळे समुद्राचे पाणी जमिनीवर शिरण्याची शक्यता आहे.",
        actionGuidance: "किनारपट्टी सोडून उंच व सुरक्षित निवाऱ्यात जा."
      },
      danger_stage: {
        technicalTerm: "धोका पातळी (Danger Level)",
        simpleMeaning: "नदीने सुरक्षिततेची मर्यादा ओलांडली आहे.",
        actionGuidance: "तातडीने पूरग्रस्त भाग रिकामा करा."
      }
    }
  },
  bn: {
    ui: {
      pageTitle: "পৃথিবী ও পরিবেশের পরিস্থিতি",
      pageSubtitle: "এই মুহূর্তে বিশ্বে কী ঘটছে?",
      citizenMode: "নাগরিক মোড",
      expertMode: "বিশেষজ্ঞ মোড",
      searchPlaceholder: "শহর, জেলা, নদী বা দেশ অনুসন্ধান করুন...",
      currentSituation: "বর্তমান পরিস্থিতি",
      whatDoesThisMean: "এর অর্থ কী?",
      currentConcern: "বর্তমান উদ্বেগ",
      whatMayHappenNext: "পরবর্তীতে কী ঘটতে পারে?",
      whatShouldPeopleDo: "মানুষের কী করা উচিত?",
      whyDoesThisMatter: "এটি কেন গুরুত্বপূর্ণ?",
      whatChangedRecently: "সম্প্রতি কী পরিবর্তন হয়েছে?",
      explainThisToMe: "আমাকে সহজ ভাষায় বুঝিয়ে বলুন",
      officialWarningHeader: "সরকারি আনুষ্ঠানিক সতর্কতা",
      geoshieldAnalysisHeader: "জিওশিল্ড বৈজ্ঞানিক বিশ্লেষণ",
      dataSourceTransparency: "এই তথ্যের উৎস কী?",
      situationAroundMe: "আমার আশপাশের পরিস্থিতি",
      exploreData: "আরও তথ্য অন্বেষণ করুন",
      liveStatus: "সরাসরি তথ্য",
      supplementaryStatus: "সাম্প্রতিক তথ্য",
      forecastStatus: "মডেল পূর্বাভাস",
      historicalStatus: "ঐতিহাসিক বেঞ্চমার্ক",
      riskLevels: {
        low: "কম (LOW)",
        moderate: "মাঝারি (MODERATE)",
        high: "উচ্চ (HIGH)",
        critical: "চরম বিপজ্জনক (CRITICAL)"
      },
      hazards: {
        flood: "নদীর বন্যা",
        cyclone: "ঘূর্ণিঝড়",
        coastalSurge: "উপকূলীয় জলোচ্ছ্বাস",
        earthquake: "ভূমিকম্প",
        landslide: "ভূমিধস",
        heat: "চরম আবহাওয়া"
      }
    },
    terms: {
      flood_risk: {
        technicalTerm: "নদীর প্লাবন ঝুঁকি",
        simpleMeaning: "নদীর জল বিপদসীমার কাছাকাছি চলে এসেছে।",
        actionGuidance: "নদীর পার ও নিচু এলাকা থেকে দূরে থাকুন।"
      },
      storm_surge: {
        technicalTerm: "উপকূলীয় জলোচ্ছ্বাস",
        simpleMeaning: "ঝড়ের কারণে সমুদ্রের জল অস্বাভাবিকভাবে ফুলে উঠে উপকূলে ঢুকছে।",
        actionGuidance: "উপকূল এলাকা ছেড়ে সাইক্লোন সেন্টারে আশ্রয় নিন।"
      },
      danger_stage: {
        technicalTerm: "বিপদসীমা (Danger Level)",
        simpleMeaning: "নদীর জল সরকারি বিপদসীমা অতিক্রম করেছে।",
        actionGuidance: "প্রশাসনের নির্দেশ মেনে নিরাপদ স্থানে যান।"
      }
    }
  },
  ta: {
    ui: {
      pageTitle: "பூமி மற்றும் சுற்றுச்சூழல் நிலைமை",
      pageSubtitle: "தற்போது உலகில் என்ன நடக்கிறது?",
      citizenMode: "பொதுமக்கள் பயன்முறை",
      expertMode: "நிபுணர் பயன்முறை",
      searchPlaceholder: "நகரம், மாவட்டம், ஆறு அல்லது நாட்டைத் தேடுங்கள்...",
      currentSituation: "தற்போதைய நிலை",
      whatDoesThisMean: "இதன் பொருள் என்ன?",
      currentConcern: "முக்கியக் கவலை",
      whatMayHappenNext: "அடுத்து என்ன நடக்கலாம்?",
      whatShouldPeopleDo: "மக்கள் என்ன செய்ய வேண்டும்?",
      whyDoesThisMatter: "இது உங்களுக்கு ஏன் முக்கியம்?",
      whatChangedRecently: "சமீபத்தில் என்ன மாறியது?",
      explainThisToMe: "இதை எளிய மொழியில் விளக்குங்கள்",
      officialWarningHeader: "அதிகாரப்பூர்வ அரசு எச்சரிக்கை",
      geoshieldAnalysisHeader: "ஜியோஷீல்ட் அறிவியல் பகுப்பாய்வு",
      dataSourceTransparency: "இந்தத் தகவல் எங்கிருந்து வருகிறது?",
      situationAroundMe: "என்னைச் சுற்றியுள்ள நிலை",
      exploreData: "கூடுதல் தகவல்களைப் பார்க்க",
      liveStatus: "நேரலைத் தரவு (LIVE)",
      supplementaryStatus: "சமீபத்திய தரவு",
      forecastStatus: "வானிலை முன்னறிவிப்பு",
      historicalStatus: "வரலாற்றுப் பதிவு",
      riskLevels: {
        low: "குறைவு (LOW)",
        moderate: "நடுத்தரம் (MODERATE)",
        high: "அதிகம் (HIGH)",
        critical: "மிக ஆபத்தானது (CRITICAL)"
      },
      hazards: {
        flood: "ஆற்று வெள்ளம்",
        cyclone: "புயல் / சூறாவளி",
        coastalSurge: "கடல் அலை சீற்றம்",
        earthquake: "நிலநடுக்கம்",
        landslide: "நிலச்சரிவு",
        heat: "கடும் வானிலை"
      }
    },
    terms: {
      flood_risk: {
        technicalTerm: "ஆற்று வெள்ள அபாயம்",
        simpleMeaning: "ஆற்றில் நீர்மட்டம் இயல்பை விட அதிகமாக உயர்ந்து வருகிறது.",
        actionGuidance: "ஆற்றுப் பகுதிகளிலிருந்து விலகி பாதுகாப்பான இடத்திற்குச் செல்லுங்கள்."
      },
      storm_surge: {
        technicalTerm: "புயல் அலை சீற்றம்",
        simpleMeaning: "புயல் காற்றின் வேகத்தால் கடல் நீர் ஊருக்குள் நுழையும் அபாயம்.",
        actionGuidance: "கடற்கரையை விட்டு வெளியேறி நிவாரண முகாம்களுக்குச் செல்லுங்கள்."
      },
      danger_stage: {
        technicalTerm: "ஆபத்து அளவு (Danger Level)",
        simpleMeaning: "ஆற்று நீர் ஆபத்துக் குறியீட்டைத் தாண்டியுள்ளது.",
        actionGuidance: "அதிகாரிகளின் அறிவுறுத்தலின்படி தாழ்வான பகுதிகளை காலி செய்யுங்கள்."
      }
    }
  },
  te: {
    ui: {
      pageTitle: "భూమి & పర్యావరణ పరిస్థితి",
      pageSubtitle: "ప్రస్తుతం ప్రపంచంలో ఏం జరుగుతోంది?",
      citizenMode: "పౌర విధానం (Citizen)",
      expertMode: "నిపుణుల విధానం (Expert)",
      searchPlaceholder: "నగరం, జిల్లా, నది లేదా దేశాన్ని శోధించండి...",
      currentSituation: "ప్రస్తుత పరిస్థితి",
      whatDoesThisMean: "దీని అర్థం ఏమిటి?",
      currentConcern: "ప్రస్తుత ఆందోళన",
      whatMayHappenNext: "తర్వాత ఏం జరగవచ్చు?",
      whatShouldPeopleDo: "ప్రజలు ఏం చేయాలి?",
      whyDoesThisMatter: "ఇది ఎందుకు ముఖ్యం?",
      whatChangedRecently: "ఇటీవల ఏం మారింది?",
      explainThisToMe: "నాకు సరళంగా వివరించండి",
      officialWarningHeader: "అధికారిక ప్రభుత్వ హెచ్చరిక",
      geoshieldAnalysisHeader: "జియోషీల్డ్ శాస్త్రీయ విశ్లేషణ",
      dataSourceTransparency: "ఈ సమాచారం ఎక్కడి నుంచి వస్తోంది?",
      situationAroundMe: "నా చుట్టూ ఉన్న పరిస్థితి",
      exploreData: "మరింత డేటాను అన్వేషించండి",
      liveStatus: "ప్రత్యక్ష సమాచారం (LIVE)",
      supplementaryStatus: "ఇటీవలి సమాచారం",
      forecastStatus: "వాతావరణ అంచనా",
      historicalStatus: "చారిత్రక రికార్డు",
      riskLevels: {
        low: "తక్కువ (LOW)",
        moderate: "మధ్యస్థం (MODERATE)",
        high: "ఎక్కువ (HIGH)",
        critical: "తీవ్ర ప్రమాదం (CRITICAL)"
      },
      hazards: {
        flood: "నది వరద",
        cyclone: "తుఫాను",
        coastalSurge: "తీరప్రాంత అలల తీవ్రత",
        earthquake: "భూకంపం",
        landslide: "కొండచరియలు విరిగిపడటం",
        heat: "తీవ్ర వాతావరణం"
      }
    },
    terms: {
      flood_risk: {
        technicalTerm: "నదీ వరద ముప్పు",
        simpleMeaning: "నదిలో నీటి మట్టం ప్రమాదకర స్థాయికి పెరుగుతోంది.",
        actionGuidance: "నదీ తీరాల నుంచి సురక్షిత ప్రాంతాలకు వెళ్లండి."
      },
      storm_surge: {
        technicalTerm: "తుఫాను ఉప్పెన",
        simpleMeaning: "తీవ్ర గాలుల వల్ల సముద్రపు నీరు నేలపైకి వస్తోంది.",
        actionGuidance: "తీర ప్రాంతాన్ని విడిచిపెట్టి సైక్లోన్ షెల్టర్‌కు చేరుకోండి."
      },
      danger_stage: {
        technicalTerm: "ప్రమాద స్థాయి (Danger Level)",
        simpleMeaning: "నది నీరు అధికారిక ప్రమాద స్థాయిని దాటింది.",
        actionGuidance: "తక్షణమే లోతట్టు ప్రాంతాలను ఖాళీ చేయండి."
      }
    }
  },
  kn: {
    ui: {
      pageTitle: "ಭೂಮಿ ಮತ್ತು ಪರಿಸರ ಪರಿಸ್ಥಿತಿ",
      pageSubtitle: "ಈ ಸಮಯದಲ್ಲಿ ಜಗತ್ತಿನಲ್ಲಿ ಏನು ನಡೆಯುತ್ತಿದೆ?",
      citizenMode: "ನಾಗರಿಕ ಮೋಡ್",
      expertMode: "ತಜ್ಞ ಮೋಡ್",
      searchPlaceholder: "ನಗರ, ಜಿಲ್ಲೆ, ನದಿ ಅಥವಾ ದೇಶ ಹುಡುಕಿ...",
      currentSituation: "ಪ್ರಸ್ತುತ ಪರಿಸ್ಥಿತಿ",
      whatDoesThisMean: "ಇದರ ಅರ್ಥವೇನು?",
      currentConcern: "ಪ್ರಮುಖ ಆತಂಕ",
      whatMayHappenNext: "ಮುಂದೆ ಏನಾಗಬಹುದು?",
      whatShouldPeopleDo: "ಸಾರ್ವಜನಿಕರು ಏನು ಮಾಡಬೇಕು?",
      whyDoesThisMatter: "ಇದು ನಿಮಗೆ ಏಕೆ ಮುಖ್ಯ?",
      whatChangedRecently: "ಇತ್ತೀಚೆಗೆ ಏನು ಬದಲಾಗಿದೆ?",
      explainThisToMe: "ಇದನ್ನು ಸುಲಭವಾಗಿ ವಿವರಿಸಿ",
      officialWarningHeader: "ಅಧಿಕೃತ ಸರ್ಕಾರಿ ಎಚ್ಚರಿಕೆ",
      geoshieldAnalysisHeader: "ಜಿಯೋಶೀಲ್ಡ್ ವೈಜ್ಞಾನಿಕ ವಿಶ್ಲೇಷಣೆ",
      dataSourceTransparency: "ಈ ಮಾಹಿತಿಯ ಮೂಲ ಯಾವುದು?",
      situationAroundMe: "ನನ್ನ ಸುತ್ತಮುತ್ತಲಿನ ಪರಿಸ್ಥಿತಿ",
      exploreData: "ಹೆಚ್ಚಿನ ಡೇಟಾ ಪರಿಶೀಲಿಸಿ",
      liveStatus: "ಲೈವ್ ಡೇಟಾ",
      supplementaryStatus: "ಇತ್ತೀಚಿನ ಡೇಟಾ",
      forecastStatus: "ಮುನ್ಸೂಚನೆ",
      historicalStatus: "ಐತಿಹಾಸಿಕ ದಾಖಲೆ",
      riskLevels: {
        low: "ಕಡಿಮೆ (LOW)",
        moderate: "ಮಧ್ಯಮ (MODERATE)",
        high: "ಹೆಚ್ಚು (HIGH)",
        critical: "ಅತ್ಯಂತ ಅಪಾಯಕಾರಿ (CRITICAL)"
      },
      hazards: {
        flood: "ನದಿ ಪ್ರವಾಹ",
        cyclone: "ಚಂಡಮಾರುತ",
        coastalSurge: "ಕರಾವಳಿ ಅಲೆಗಳ ಏರಿಳಿತ",
        earthquake: "ಭೂಕಂಪನ",
        landslide: "ಭೂಕುಸಿತ",
        heat: "ತೀವ್ರ ಹವಾಮಾನ"
      }
    },
    terms: {
      flood_risk: {
        technicalTerm: "ನದಿ ಪ್ರವಾಹ ಅಪಾಯ",
        simpleMeaning: "ನದಿಗಳಲ್ಲಿ ನೀರಿನ ಮಟ್ಟ ವೇಗವಾಗಿ ಹೆಚ್ಚುತ್ತಿದೆ.",
        actionGuidance: "ನದಿಯ ದಡಗಳಿಂದ ದೂರವಿರಿ ಮತ್ತು ಸುರಕ್ಷಿತ ಸ್ಥಳಕ್ಕೆ ತೆರಳಿ."
      },
      storm_surge: {
        technicalTerm: "ಕರಾವಳಿ ಚಂಡಮಾರುತದ ಅಲೆ",
        simpleMeaning: "ಚಂಡಮಾರುತದ ಗಾಳಿಯಿಂದ ಸಮುದ್ರದ ನೀರು ದಡಕ್ಕೆ ನುಗ್ಗುತ್ತಿದೆ.",
        actionGuidance: "ಕರಾವಳಿಯಿಂದ ದೂರವಾಗಿ ಚಂಡಮಾರುತ ಆಶ್ರಯ ತಾಣಕ್ಕೆ ಹೋಗಿ."
      },
      danger_stage: {
        technicalTerm: "ಅಪಾಯದ ಮಟ್ಟ (Danger Level)",
        simpleMeaning: "ನದಿ ಅಪಾಯದ ಮಟ್ಟ ಮೀರಿ ಹರಿಯುತ್ತಿದೆ.",
        actionGuidance: "ಅಧಿಕಾರಿಗಳ ಸೂಚನೆಯಂತೆ ತಗ್ಗು ಪ್ರದೇಶಗಳನ್ನು ತೆರವುಗೊಳಿಸಿ."
      }
    }
  },
  ml: {
    ui: {
      pageTitle: "ഭൂമിയും പരിസ്ഥിതിയും - തത്സമയ സ്ഥിതി",
      pageSubtitle: "ഇപ്പോൾ ലോകത്ത് എന്താണ് സംഭവിക്കുന്നത്?",
      citizenMode: "പൗര മോഡ്",
      expertMode: "വിദഗ്ദ്ധ മോഡ്",
      searchPlaceholder: "നഗരം, ജില്ല, നദി അല്ലെങ്കിൽ രാജ്യം തിരയുക...",
      currentSituation: "നിലവിലെ സാഹചര്യം",
      whatDoesThisMean: "ഇതിനർത്ഥം എന്താണ്?",
      currentConcern: "പ്രധാന ആശങ്ക",
      whatMayHappenNext: "അടുത്തത് എന്ത് സംഭവിക്കാം?",
      whatShouldPeopleDo: "ആളുകൾ എന്ത് ചെയ്യണം?",
      whyDoesThisMatter: "ഇത് നിങ്ങൾക്ക് എന്തുകൊണ്ട് പ്രധാനമാണ്?",
      whatChangedRecently: "അടുത്തിടെ എന്ത് മാറ്റമുണ്ടായി?",
      explainThisToMe: "ഇത് എനിക്ക് ലളിതമായി വിശദീകരിക്കുക",
      officialWarningHeader: "ഔദ്യോഗിക സർക്കാർ മുന്നറിയിപ്പ്",
      geoshieldAnalysisHeader: "ജിയോഷീൽഡ് ശാസ്ത്രീയ വിശകലനം",
      dataSourceTransparency: "ഈ വിവരങ്ങളുടെ ഉറവിടം എവിടെ നിന്നാണ്?",
      situationAroundMe: "എനിക്ക് ചുറ്റുമുള്ള സ്ഥിതി",
      exploreData: "കൂടുതൽ വിവരങ്ങൾ പരിശോധിക്കുക",
      liveStatus: "ലൈവ് ഡാറ്റ (LIVE)",
      supplementaryStatus: "സമീപകാല ഡാറ്റ",
      forecastStatus: "കാലാവസ്ഥാ പ്രവചനം",
      historicalStatus: "ചരിത്രപരമായ രേഖ",
      riskLevels: {
        low: "കുറവ് (LOW)",
        moderate: "മിതമായത് (MODERATE)",
        high: "കൂടുതൽ (HIGH)",
        critical: "ഗുരുതരമായത് (CRITICAL)"
      },
      hazards: {
        flood: "നദീ പ്രളയം",
        cyclone: "ചുഴലിക്കാറ്റ്",
        coastalSurge: "തീരദേശ തിരമാലകൾ",
        earthquake: "ഭൂകമ്പം",
        landslide: "ഉരുൾപൊട്ടൽ",
        heat: "കഠിന കാലാവസ്ഥ"
      }
    },
    terms: {
      flood_risk: {
        technicalTerm: "നദീ പ്രളയ സാധ്യത",
        simpleMeaning: "നദികളിൽ ജലനിരപ്പ് അപകടകരമാംവിധം ഉയരുകയാണ്.",
        actionGuidance: "നദീതീരങ്ങളിൽ നിന്ന് മാറി സുരക്ഷിത കേന്ദ്രങ്ങളിലേക്ക് മാറുക."
      },
      storm_surge: {
        technicalTerm: "കടലാക്രമണം / കൊടുങ്കാറ്റ് തിരമാല",
        simpleMeaning: "കാറ്റിന്റെ വേഗത കാരണം കടൽവെള്ളം കരയിലേക്ക് കയറുന്നു.",
        actionGuidance: "തീരപ്രദേശങ്ങളിൽ നിന്ന് മാറി ദുരിതാശ്വാസ ക്യാമ്പുകളിൽ എത്തുക."
      },
      danger_stage: {
        technicalTerm: "അപകട നില (Danger Level)",
        simpleMeaning: "നദിയിലെ ജലനിരപ്പ് ഔദ്യോഗിക അപകട നില കവിഞ്ഞു.",
        actionGuidance: "ഉദ്യോഗസ്ഥരുടെ നിർദ്ദേശപ്രകാരം താഴ്ന്ന പ്രദേശങ്ങൾ ഒഴിയുക."
      }
    }
  },
  gu: {
    ui: {
      pageTitle: "પૃથ્વી અને પર્યાવરણની સ્થિતિ",
      pageSubtitle: "આ સમયે આપણી દુનિયામાં શું થઈ રહ્યું છે?",
      citizenMode: "નાગરિક મોડ",
      expertMode: "નિષ્ણાત મોડ",
      searchPlaceholder: "શહેર, જિલ્લો, નદી અથવા દેશ શોધો...",
      currentSituation: "વર્તમાન પરિસ્થિતિ",
      whatDoesThisMean: "આનો અર્થ શું છે?",
      currentConcern: "મુખ્ય ચિંતા",
      whatMayHappenNext: "આગળ શું થઈ શકે છે?",
      whatShouldPeopleDo: "લોકોએ શું કરવું જોઈએ?",
      whyDoesThisMatter: "આ તમારા માટે શા માટે મહત્વનું છે?",
      whatChangedRecently: "તાજેતરમાં શું બદલાયું?",
      explainThisToMe: "આ મને સરળ ભાષામાં સમજાવો",
      officialWarningHeader: "સત્તાવાર સરકારી ચેતવણી",
      geoshieldAnalysisHeader: "જિયોશીલ્ડ વૈજ્ઞાનિક વિશ્લેષણ",
      dataSourceTransparency: "આ માહિતી ક્યાંથી આવે છે?",
      situationAroundMe: "મારી આસપાસની સ્થિતિ",
      exploreData: "વધુ ડેટા તપાસો",
      liveStatus: "લાઈવ ડેટા (LIVE)",
      supplementaryStatus: "તાજેતરનો ડેટા",
      forecastStatus: "આગાહી (FORECAST)",
      historicalStatus: "ઐતિહાસિક રેકોર્ડ",
      riskLevels: {
        low: "ઓછું (LOW)",
        moderate: "મધ્યમ (MODERATE)",
        high: "વધુ (HIGH)",
        critical: "ખૂબ જોખમી (CRITICAL)"
      },
      hazards: {
        flood: "નદીનું પૂર",
        cyclone: "વાવાઝોડું (ચક્રવાત)",
        coastalSurge: "દરિયાઈ મોજાંનું જોખમ",
        earthquake: "ધરતીકંપ",
        landslide: "જમીન ધસી પડવી",
        heat: "આત્યંતિક હવામાન"
      }
    },
    terms: {
      flood_risk: {
        technicalTerm: "નદી પૂર જોખમ",
        simpleMeaning: "નદીઓમાં પાણીનું સ્તર સામાન્ય કરતાં ઘણું વધી રહ્યું છે.",
        actionGuidance: "નદી કિનારા અને નીચાણવાળા વિસ્તારોથી દૂર રહો."
      },
      storm_surge: {
        technicalTerm: "દરિયાઈ તોફાની મોજાં",
        simpleMeaning: "વાવાઝોડાના પવનને કારણે દરિયાનું પાણી જમીન તરફ ધસી રહ્યું છે.",
        actionGuidance: "દરિયાકાંઠો છોડીને સલામત ચક્રવાત આશ્રયસ્થાનમાં જાઓ."
      },
      danger_stage: {
        technicalTerm: "જોખમી સપાટી (Danger Level)",
        simpleMeaning: "નદીનું પાણી સત્તાવાર ભયજનક સપાટી વટાવી ચૂક્યું છે.",
        actionGuidance: "પ્રશાસનના આદેશ મુજબ તાત્કાલિક સ્થળાંતર કરો."
      }
    }
  },
  pa: {
    ui: {
      pageTitle: "ਧਰਤੀ ਅਤੇ ਵਾਤਾਵਰਣ ਦੀ ਸਥਿਤੀ",
      pageSubtitle: "ਇਸ ਸਮੇਂ ਸਾਡੀ ਦੁਨੀਆ ਵਿੱਚ ਕੀ ਹੋ ਰਿਹਾ ਹੈ?",
      citizenMode: "ਆਮ ਨਾਗਰਿਕ ਮੋਡ",
      expertMode: "ਮਾਹਰ ਮੋਡ",
      searchPlaceholder: "ਸ਼ਹਿਰ, ਜ਼ਿਲ੍ਹਾ, ਨਦੀ ਜਾਂ ਦੇਸ਼ ਖੋਜੋ...",
      currentSituation: "ਮੌਜੂਦਾ ਸਥਿਤੀ",
      whatDoesThisMean: "ਇਸਦਾ ਕੀ ਅਰਥ ਹੈ?",
      currentConcern: "ਮੁੱਖ ਚਿੰਤਾ",
      whatMayHappenNext: "ਅੱਗੇ ਕੀ ਹੋ ਸਕਦਾ ਹੈ?",
      whatShouldPeopleDo: "ਲੋਕਾਂ ਨੂੰ ਕੀ ਕਰਨਾ ਚਾਹੀਦਾ ਹੈ?",
      whyDoesThisMatter: "ਇਹ ਤੁਹਾਡੇ ਲਈ ਕਿਉਂ ਜ਼ਰੂਰੀ ਹੈ?",
      whatChangedRecently: "ਹਾਲ ਹੀ ਵਿੱਚ ਕੀ ਬਦਲਿਆ ਹੈ?",
      explainThisToMe: "ਇਹ ਮੈਨੂੰ ਸੌਖੀ ਭਾਸ਼ਾ ਵਿੱਚ ਸਮਝਾਓ",
      officialWarningHeader: "ਸਰਕਾਰੀ ਅਧਿਕਾਰਤ ਚੇਤਾਵਨੀ",
      geoshieldAnalysisHeader: "ਜਿਓਸ਼ੀਲਡ ਵਿਗਿਆਨਕ ਵਿਸ਼ਲੇਸ਼ਣ",
      dataSourceTransparency: "ਇਹ ਜਾਣਕਾਰੀ ਕਿੱਥੋਂ ਆਉਂਦੀ ਹੈ?",
      situationAroundMe: "ਮੇਰੇ ਆਲੇ-ਦੁਆਲੇ ਦੀ ਸਥਿਤੀ",
      exploreData: "ਹੋਰ ਡਾਟਾ ਵੇਖੋ",
      liveStatus: "ਲਾਈਵ ਡਾਟਾ",
      supplementaryStatus: "ਹਾਲੀਆ ਡਾਟਾ",
      forecastStatus: "ਪੂਰਵ-ਅਨੁਮਾਨ",
      historicalStatus: "ਇਤਿਹਾਸਕ ਰਿਕਾਰਡ",
      riskLevels: {
        low: "ਘੱਟ (LOW)",
        moderate: "ਦਰਮਿਆਨਾ (MODERATE)",
        high: "ਵੱਧ (HIGH)",
        critical: "ਬਹੁਤ ਗੰਭੀਰ (CRITICAL)"
      },
      hazards: {
        flood: "ਦਰਿਆਈ ਹੜ੍ਹ",
        cyclone: "ਚੱਕਰਵਾਤ / ਤੂਫਾਨ",
        coastalSurge: "ਤੱਟਵਰਤੀ ਲਹਿਰਾਂ",
        earthquake: "ਭੂਚਾਲ",
        landslide: "ਜ਼ਮੀਨ ਖਿਸਕਣਾ",
        heat: "ਗੰਭੀਰ ਮੌਸਮ"
      }
    },
    terms: {
      flood_risk: {
        technicalTerm: "ਹੜ੍ਹ ਦਾ ਖ਼ਤਰਾ",
        simpleMeaning: "ਦਰਿਆ ਵਿੱਚ ਪਾਣੀ ਦਾ ਪੱਧਰ ਖ਼ਤਰੇ ਦੇ ਨਿਸ਼ਾਨ ਵੱਲ ਵੱਧ ਰਿਹਾ ਹੈ।",
        actionGuidance: "ਦਰਿਆ ਦੇ ਕੰਢਿਆਂ ਤੋਂ ਦੂਰ ਰਹੋ ਅਤੇ ਸੁਰੱਖਿਅਤ ਸਥਾਨਾਂ 'ਤੇ ਜਾਓ।"
      },
      storm_surge: {
        technicalTerm: "ਤੂਫਾਨੀ ਸਮੁੰਦਰੀ ਲਹਿਰਾਂ",
        simpleMeaning: "ਤੇਜ਼ ਹਵਾਵਾਂ ਕਾਰਨ ਸਮੁੰਦਰ ਦਾ ਪਾਣੀ ਕੰਢਿਆਂ ਵੱਲ ਵੱਧ ਰਿਹਾ ਹੈ।",
        actionGuidance: "ਤੱਟਵਰਤੀ ਇਲਾਕਿਆਂ ਨੂੰ ਖ਼ਾਲੀ ਕਰਕੇ ਪੱਕੇ ਆਸਰੇ ਵਿੱਚ ਜਾਓ।"
      },
      danger_stage: {
        technicalTerm: "ਖ਼ਤਰੇ ਦਾ ਨਿਸ਼ਾਨ (Danger Level)",
        simpleMeaning: "ਪਾਣੀ ਖ਼ਤਰੇ ਦੀ ਸਰਕਾਰੀ ਹੱਦ ਪਾਰ ਕਰ ਗਿਆ ਹੈ।",
        actionGuidance: "ਪ੍ਰਸ਼ਾਸਨ ਦੀਆਂ ਹਦਾਇਤਾਂ ਅਨੁਸਾਰ ਤੁਰੰਤ ਸੁਰੱਖਿਅਤ ਥਾਂ ਜਾਓ।"
      }
    }
  },
  ur: {
    ui: {
      pageTitle: "زمین اور ماحولیات کی صورتحال",
      pageSubtitle: "اس وقت ہماری دنیا میں کیا ہو رہا ہے؟",
      citizenMode: "شہری موڈ (Citizen)",
      expertMode: "ماہرین کا موڈ (Expert)",
      searchPlaceholder: "شہر، ضلع، دریا یا ملک تلاش کریں...",
      currentSituation: "موجودہ صورتحال",
      whatDoesThisMean: "اس کا کیا مطلب ہے؟",
      currentConcern: "اہم تشویش",
      whatMayHappenNext: "آگے کیا ہو سکتا ہے؟",
      whatShouldPeopleDo: "شہریوں کو کیا کرنا چاہیے؟",
      whyDoesThisMatter: "یہ آپ کے لیے کیوں اہم ہے؟",
      whatChangedRecently: "حال ہی میں کیا تبدیل ہوا؟",
      explainThisToMe: "اسے آسان الفاظ میں سمجھائیں",
      officialWarningHeader: "سرکاری انتباہ",
      geoshieldAnalysisHeader: "جیو شیلڈ سائنسی تجزیہ",
      dataSourceTransparency: "یہ معلومات کہاں سے آتی ہیں؟",
      situationAroundMe: "میرے آس پاس کی صورتحال",
      exploreData: "مزید ڈیٹا دیکھیں",
      liveStatus: "براہ راست ڈیٹا (LIVE)",
      supplementaryStatus: "حالیہ ڈیٹا",
      forecastStatus: "پیش گوئی",
      historicalStatus: "تاریخی ریکارڈ",
      riskLevels: {
        low: "کم (LOW)",
        moderate: "معتدل (MODERATE)",
        high: "زیادہ (HIGH)",
        critical: "انتہائی خطرناک (CRITICAL)"
      },
      hazards: {
        flood: "دریا کا سیلاب",
        cyclone: "سمندری طوفان",
        coastalSurge: "ساحلی لہریں",
        earthquake: "زلزلہ",
        landslide: "زمین کا کھسکنا",
        heat: "شدید موسم"
      }
    },
    terms: {
      flood_risk: {
        technicalTerm: "دریا کے سیلاب کا خطرہ",
        simpleMeaning: "قریبی دریاؤں میں پانی کی سطح خطرے کے نشان کی طرف بڑھ رہی ہے۔",
        actionGuidance: "دریا کے کنارے اور نشیبی علاقوں سے دور رہیں۔"
      },
      storm_surge: {
        technicalTerm: "طوفانی ساحلی لہریں",
        simpleMeaning: "طوفانی ہواؤں کی وجہ سے سمندر کا پانی خشکی پر چڑھ رہا ہے۔",
        actionGuidance: "ساحل خالی کریں اور پختہ طوفانی پناہ گاہ میں منتقل ہوں۔"
      },
      danger_stage: {
        technicalTerm: "خطرے کا نشان (Danger Level)",
        simpleMeaning: "دریا نے پانی کی سرکاری خطرے کی حد کو عبور کر لیا ہے۔",
        actionGuidance: "انتظامیہ کی ہدایات کے مطابق فوری محفوظ مقامات پر جائیں۔"
      }
    }
  }
};

// Convenience mapping of UI translations by language code
export const UI_TRANSLATIONS: Record<SupportedLanguageCode, UiTranslations> = Object.keys(
  MULTILINGUAL_DICTIONARY
).reduce((acc, langCode) => {
  acc[langCode as SupportedLanguageCode] = MULTILINGUAL_DICTIONARY[langCode as SupportedLanguageCode].ui;
  return acc;
}, {} as Record<SupportedLanguageCode, UiTranslations>);

// Lookup safety term definition
export function getGlossaryTerm(
  lang: SupportedLanguageCode,
  termKey: string
): TermDefinition | undefined {
  const dict = MULTILINGUAL_DICTIONARY[lang] || MULTILINGUAL_DICTIONARY.en;
  return dict.terms[termKey] || MULTILINGUAL_DICTIONARY.en.terms[termKey];
}

