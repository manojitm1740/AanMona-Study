/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { UserRole, type UserProfile, type TeacherKit, type LiveTest } from './types';

export interface Subject {
  id: string;
  nameEn: string;
  nameBn: string;
  chapters: {
    id: string;
    nameEn: string;
    nameBn: string;
    notesEn: string;
    notesBn: string;
  }[];
}

export interface ClassStructure {
  id: string; // '1' - '12'
  nameEn: string;
  nameBn: string;
  board: 'WBBSE' | 'WBCHSE';
  subjects: Subject[];
}

export const CLASSES_DATA: ClassStructure[] = [
  {
    id: '1',
    nameEn: 'Class 1',
    nameBn: 'শ্রেণি ১',
    board: 'WBBSE',
    subjects: [
      {
        id: 'bengali',
        nameEn: 'Bengali',
        nameBn: 'বাংলা',
        chapters: [
          {
            id: 'bengali-ch1',
            nameEn: 'Alphabet & Words',
            nameBn: 'বর্ণমালা ও শব্দ পরিচিতি',
            notesEn: 'Learn Bengali vowels (Swarabarna) and consonants (Byanjambarna) with colorful word associations.',
            notesBn: 'রঙিন ছবির সাথে বাংলা স্বরবর্ণ এবং ব্যঞ্জনবর্ণ শিখুন এবং বিভিন্ন সাধারণ শব্দ তৈরি করা অনুশীলন করুন।'
          }
        ]
      },
      {
        id: 'math',
        nameEn: 'Mathematics',
        nameBn: 'গণিত',
        chapters: [
          {
            id: 'math-ch1',
            nameEn: 'Basic Counting',
            nameBn: 'প্রাথমিক গণনা',
            notesEn: 'Learn to count numbers from 1 to 10 with visuals of objects.',
            notesBn: 'ছবি দেখে ১ থেকে ১০ পর্যন্ত গণনা করা শিখুন এবং সংখ্যা লেখা অভ্যাস করুন।'
          }
        ]
      }
    ]
  },
  {
    id: '5',
    nameEn: 'Class 5',
    nameBn: 'শ্রেণি ৫',
    board: 'WBBSE',
    subjects: [
      {
        id: 'bengali',
        nameEn: 'Bengali',
        nameBn: 'বাংলা',
        chapters: [
          {
            id: 'beng-ch1',
            nameEn: 'Moni-Kanchan',
            nameBn: 'মণি-কাঞ্চন',
            notesEn: 'Detailed reading and analysis of West Bengal board class 5 prose.',
            notesBn: 'পশ্চিমবঙ্গ পঞ্চম শ্রেণির পাঠ্যংশের মনোগ্রাহী পাঠ এবং প্রশ্নোত্তর আলোচনা।'
          }
        ]
      },
      {
        id: 'evs',
        nameEn: 'Environmental Science',
        nameBn: 'আমাদের পরিবেশ',
        chapters: [
          {
            id: 'evs-ch1',
            nameEn: 'Human Body & Health',
            nameBn: 'মানুষের শরীর ও স্বাস্থ্য',
            notesEn: 'Overview of human bones, muscles, skin types and basic hygiene.',
            notesBn: 'মানুষের হাড়, পেশি, চামড়ার গঠন এবং প্রাথমিক স্বাস্থ্যবিধি সম্পর্কে বিস্তারিত আলোচনা।'
          }
        ]
      }
    ]
  },
  {
    id: '10',
    nameEn: 'Class 10',
    nameBn: 'শ্রেণি ১০',
    board: 'WBBSE',
    subjects: [
      {
        id: 'physical-science',
        nameEn: 'Physical Science',
        nameBn: 'ভৌত বিজ্ঞান',
        chapters: [
          {
            id: 'phys-light',
            nameEn: 'Light (Refraction & Lenses)',
            nameBn: 'আলো (প্রতিসরণ ও লেন্স)',
            notesEn: 'Detailed formulas and ray diagrams explaining the behavior of light through spherical lenses and glass slabs.',
            notesBn: 'উত্তল ও অবতল লেন্স এবং কাঁচের ফলকের মধ্য দিয়ে আলোর প্রতিসরণ, প্রতিসরাঙ্ক এবং রশ্মি চিত্র সহ ব্যাখ্যা।'
          },
          {
            id: 'phys-electricity',
            nameEn: 'Current Electricity',
            nameBn: 'চলতড়িৎ',
            notesEn: "Study of Ohm's Law, electrical circuits, Joule's heating effect, and calculations of electric bills.",
            notesBn: "ওহমের সূত্র, রোধের সমবায়, তড়িৎপ্রবাহের তাপীয় ফল এবং বৈদ্যুতিক বিল (B.O.T ইউনিট) নির্ণয় করার নিয়মাবলী।"
          }
        ]
      },
      {
        id: 'math',
        nameEn: 'Mathematics',
        nameBn: 'গণিত',
        chapters: [
          {
            id: 'math-quadratic',
            nameEn: 'Quadratic Equations with One Variable',
            nameBn: 'একচল বিশিষ্ট দ্বিঘাত সমীকরণ',
            notesEn: 'How to solve equations using Sridhar Acharya formula and factorization.',
            notesBn: 'শ্রীধর আচার্যের সূত্র এবং উৎপাদক বিশ্লেষণের সাহায্যে একচল বিশিষ্ট দ্বিঘাত সমীকরণ সমাধান করার উপায়।'
          }
        ]
      },
      {
        id: 'life-science',
        nameEn: 'Life Science',
        nameBn: 'জীবন বিজ্ঞান',
        chapters: [
          {
            id: 'life-hormone',
            nameEn: 'Plant and Animal Hormones',
            nameBn: 'উদ্ভিদ ও প্রাণী হরমোন',
            notesEn: 'In-depth guide on auxin, gibberellin, insulin, adrenaline, and thyroid functions.',
            notesBn: 'অক্সিন, জিব্বেরেলিন, ইনসুলিন, অ্যাড্রেনালিন এবং থাইরক্সিনের মতো প্রধান হরমোন সমূহের কাজ ও উৎস।'
          }
        ]
      }
    ]
  },
  {
    id: '12',
    nameEn: 'Class 12',
    nameBn: 'শ্রেণি ১২',
    board: 'WBCHSE',
    subjects: [
      {
        id: 'physics',
        nameEn: 'Physics (Science)',
        nameBn: 'পদার্থবিদ্যা (বিজ্ঞান)',
        chapters: [
          {
            id: 'phys12-electrostatics',
            nameEn: 'Electrostatics',
            nameBn: 'স্থিরতড়িৎ বিজ্ঞান',
            notesEn: "Detailed derivation of Coulomb's Law, Gauss's Theorem and capacitance calculations.",
            notesBn: "কুলম্বের সূত্র, গাউসের উপপাদ্য এবং ধারকত্বের গণনা সংক্রান্ত বিস্তারিত আলোচনা ও গাণিতিক সমাধান।"
          }
        ]
      },
      {
        id: 'history',
        nameEn: 'History (Arts)',
        nameBn: 'ইতিহাস (কলা)',
        chapters: [
          {
            id: 'hist12-colonialism',
            nameEn: 'Colonialism and Imperialism',
            nameBn: 'উপনিবেশবাদ এবং সাম্রাজ্যবাদ',
            notesEn: 'Analyzing economic and political impacts of colonialism in Asia and Africa.',
            notesBn: 'এশিয়া ও আফ্রিকায় উপনিবেশবাদের অর্থনৈতিক এবং রাজনৈতিক প্রভাবের মূল্যায়ন।'
          }
        ]
      },
      {
        id: 'accountancy',
        nameEn: 'Accountancy (Commerce)',
        nameBn: 'অ্যাকাউন্টেন্সি (বাণিজ্য)',
        chapters: [
          {
            id: 'acc12-partnership',
            nameEn: 'Partnership Accounts',
            nameBn: 'অংশীদারি কারবারের হিসাব',
            notesEn: 'How to distribute profits among partners, calculate interest on capital, and prepare partnership balance sheets.',
            notesBn: 'অংশীদারদের মধ্যে লাভ-ক্ষতি বণ্টন হিসাব খাতা তৈরি, মূলধনের সুদ এবং রিভ্যালুয়েশন অ্যাকাউন্ট প্রস্তুত প্রণালী।'
          }
        ]
      }
    ]
  }
];

export const INITIAL_USERS: UserProfile[] = [
  {
    id: 'student-ver',
    email: 'student@aanmona.com',
    fullNameEn: 'Rohit Sen',
    fullNameBn: 'রোহিত সেন',
    whatsapp: '9876543210',
    role: UserRole.STUDENT,
    isVerified: true,
    schoolName: 'Howrah Zilla School',
    studentClass: '10',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120',
    registrationDate: '2026-05-15'
  },
  {
    id: 'student-unver',
    email: 'newstudent@aanmona.com',
    fullNameEn: 'Priya Das',
    fullNameBn: 'প্রিয়া দাস',
    whatsapp: '9830098300',
    role: UserRole.STUDENT,
    isVerified: false,
    schoolName: 'Kolkata Girls High School',
    studentClass: '12',
    stream: 'Science',
    registrationDate: '2026-06-28',
    verificationNote: 'Awaiting class registration card upload.'
  },
  {
    id: 'teacher-user',
    email: 'teacher@aanmona.com',
    fullNameEn: 'Dr. Subhabrata Roy',
    fullNameBn: 'ডঃ শুভব্রত রায়',
    whatsapp: '9433094330',
    role: UserRole.TEACHER,
    isVerified: true,
    schoolName: 'Nabadwip Hindu School',
    registrationDate: '2026-04-10'
  },
  {
    id: 'admin-user',
    email: 'admin@aanmona.com',
    fullNameEn: 'AanMona Admin Team',
    fullNameBn: 'আনমনা অ্যাডমিন টিম',
    whatsapp: '9000190001',
    role: UserRole.ADMIN,
    isVerified: true,
    registrationDate: '2025-01-01'
  }
];

export const INITIAL_KITS: TeacherKit[] = [
  {
    id: 'kit-1',
    teacherId: 'teacher-user',
    teacherName: 'Dr. Subhabrata Roy',
    name: 'Class 10 — Physical Science — Light Study Bundle',
    classId: '10',
    subjectId: 'physical-science',
    chapterId: 'phys-light',
    isPublished: true,
    notesText: 'This study bundle focuses on refraction and lens systems. Please review the rays representation and practice the lens makers formulas.',
    files: [
      {
        name: 'WBBSE_Class10_Light_Official_Notes.pdf',
        url: 'https://www.wbbse.wb.gov.in/pdf/notes/light_sample.pdf',
        isDownloadable: true,
        size: '1.8 MB'
      }
    ],
    externalLinks: [
      {
        title: 'Light Ray Tracing Simulator',
        url: 'https://phet.colorado.edu/sims/html/bending-light/latest/bending-light_all.html'
      }
    ],
    images: [
      {
        caption: 'Convex Lens Image Formation Rules',
        url: 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&q=80&w=600'
      }
    ],
    createdAt: '2026-06-15'
  }
];

export const MOCK_LIVE_TESTS: LiveTest[] = [
  {
    id: 'test-light-10',
    classId: '10',
    subjectId: 'physical-science',
    chapterNameEn: 'Light Refraction',
    chapterNameBn: 'আলোর প্রতিসরণ',
    durationMinutes: 10,
    totalMarks: 30,
    isLiveNow: true,
    questions: [
      {
        id: 'q1',
        questionEn: 'What is the refractive index of glass with respect to vacuum if light speed in glass is 2 x 10^8 m/s?',
        questionBn: 'শূন্যস্থানের সাপেক্ষে কাঁচের প্রতিসরাঙ্ক কত যদি কাঁচে আলোর গতিবেগ ২ x ১০^৮ মিটার/সেকেন্ড হয়?',
        optionsEn: ['1.5', '1.33', '2.0', '1.0'],
        optionsBn: ['১.৫', '১.৩৩', '২.০', '১.০'],
        correctOptionIndex: 0
      },
      {
        id: 'q2',
        questionEn: 'Which lens is used to correct Myopia (Short-sightedness)?',
        questionBn: 'মায়োপিয়া (স্বল্পদৃষ্টি) প্রতিকারের জন্য কোন লেন্স ব্যবহার করা হয়?',
        optionsEn: ['Concave Lens', 'Convex Lens', 'Bifocal Lens', 'Cylindrical Lens'],
        optionsBn: ['অবতল লেন্স', 'উত্তল লেন্স', 'দ্বি-নাভি লেন্স', 'সিলিন্ড্রিক্যাল লেন্স'],
        correctOptionIndex: 0
      },
      {
        id: 'q3',
        questionEn: 'The critical angle of a medium is 30 degrees. What is its refractive index?',
        questionBn: 'একটি মাধ্যমের সংকট কোণ ৩০ ডিগ্রি। তার প্রতিসরাঙ্ক কত?',
        optionsEn: ['2.0', '1.5', '0.5', '1.414'],
        optionsBn: ['২.০', '১.৫', '০.৫', '১.৪১৪'],
        correctOptionIndex: 0
      }
    ]
  },
  {
    id: 'test-counting-1',
    classId: '1',
    subjectId: 'math',
    chapterNameEn: 'Basic Counting to 10',
    chapterNameBn: '১০ পর্যন্ত গণনা',
    durationMinutes: 5,
    totalMarks: 10,
    isLiveNow: true,
    questions: [
      {
        id: 'q1-1',
        questionEn: 'How many fingers are there in a normal single hand?',
        questionBn: 'একটি স্বাভাবিক মানুষের হাতে কটি আঙুল থাকে?',
        optionsEn: ['4', '5', '6', '10'],
        optionsBn: ['৪', '৫', '৬', '১০'],
        correctOptionIndex: 1
      },
      {
        id: 'q2-1',
        questionEn: 'Which number comes after 7?',
        questionBn: '৭-এর ঠিক পরে কোন সংখ্যাটি আসে?',
        optionsEn: ['6', '8', '9', '5'],
        optionsBn: ['৬', '৮', '৯', '৫'],
        correctOptionIndex: 1
      }
    ]
  }
];

export const INITIAL_LEADERBOARD = [
  { rank: 1, nameEn: 'Sayan Banerjee', nameBn: 'সায়ন ব্যানার্জী', classId: '10', score: 980 },
  { rank: 2, nameEn: 'Debarati Roy', nameBn: 'দেবারতি রায়', classId: '10', score: 925 },
  { rank: 3, nameEn: 'Amit Paul', nameBn: 'অমিত পাল', classId: '10', score: 890 },
  { rank: 4, nameEn: 'Rohit Sen', nameBn: 'রোহিত সেন', classId: '10', score: 875 },
  { rank: 5, nameEn: 'Sneha Sarkar', nameBn: 'স্নেহা সরকার', classId: '10', score: 810 }
];

export const ANNOUNCEMENTS = [
  { id: 'ann-1', textEn: 'WBBSE Secondary Examination Form Fill-up starts from next Monday.', textBn: 'মাধ্যমিক পরীক্ষার ফর্ম ফিলাপ আগামী সোমবার থেকে শুরু হতে চলেছে।' },
  { id: 'ann-2', textEn: 'Live Free Mock Test on Class 10 Light starts today at 6:00 PM.', textBn: 'দশম শ্রেণির আলো অধ্যায়ের লাইভ ফ্রি মক টেস্ট আজ সন্ধ্যা ৬টায় শুরু হবে।' },
  { id: 'ann-3', textEn: 'Offline caching feature enabled! Study notes can now be browsed offline without internet.', textBn: 'অফলাইন ক্যাশিং সুবিধা চালু হয়েছে! ইন্টারনেট ছাড়াই অধ্যায়ের নোটস পড়া যাবে।' }
];

export const GALLERY_ITEMS = [
  {
    id: 'gal-1',
    category: 'classes',
    titleEn: 'Interactive Physical Science Experiment',
    titleBn: 'ইন্টারেক্টিভ ভৌতবিজ্ঞান পরীক্ষা',
    url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'gal-2',
    category: 'events',
    titleEn: 'Science Fair 2026 Exhibition',
    titleBn: 'বিজ্ঞান মেলা ২০২৬ প্রদর্শনী',
    url: 'https://images.unsplash.com/photo-1530026405186-ed1ea06073e5?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'gal-3',
    category: 'achievements',
    titleEn: 'Congratulations to our Board Rankers',
    titleBn: 'আমাদের বোর্ড র‍্যাঙ্কারদের অভিনন্দন',
    url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'gal-4',
    category: 'classes',
    titleEn: 'Mathematics Special Doubt-Solving Session',
    titleBn: 'গণিত স্পেশাল ডাউট সলভিং সেশন',
    url: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'gal-5',
    category: 'events',
    titleEn: 'Annual Prize Distribution Ceremony',
    titleBn: 'বার্ষিক পুরস্কার বিতরণী অনুষ্ঠান',
    url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'gal-6',
    category: 'achievements',
    titleEn: 'PWA Launch Celebration - Study Anywhere',
    titleBn: 'পিডব্লিউএ লঞ্চ উদযাপন - যেকোনো জায়গায় পড়া যাবে',
    url: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=800'
  }
];
