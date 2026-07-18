/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum UserRole {
  STUDENT = 'STUDENT',
  TEACHER = 'TEACHER',
  ADMIN = 'ADMIN'
}

export interface UserProfile {
  id: string;
  email: string;
  fullNameEn: string;
  fullNameBn: string;
  whatsapp: string;
  role: UserRole;
  isVerified: boolean;
  schoolName?: string;
  studentClass?: string; // e.g., '10', '11', '12'
  stream?: 'Science' | 'Arts' | 'Commerce' | '';
  avatar?: string;
  registrationDate: string;
  verificationNote?: string;
}

export interface TeacherKit {
  id: string;
  teacherId: string;
  teacherName: string;
  name: string;
  classId: string; // '1' - '12'
  subjectId: string;
  chapterId: string;
  isPublished: boolean;
  notesText?: string;
  files: KitFile[];
  externalLinks: KitExternalLink[];
  images: KitImage[];
  createdAt: string;
}

export interface KitFile {
  name: string;
  url: string; // Can be Google Drive file URL, blob URL or placeholder
  driveFileId?: string; // If imported from Google Drive
  isDownloadable: boolean;
  size?: string;
}

export interface KitExternalLink {
  title: string;
  url: string;
}

export interface KitImage {
  caption: string;
  url: string;
}

export interface LiveTest {
  id: string;
  classId: string;
  subjectId: string;
  chapterNameEn: string;
  chapterNameBn: string;
  durationMinutes: number;
  totalMarks: number;
  isLiveNow: boolean;
  questions: Question[];
  startTime?: string;
}

export interface Question {
  id: string;
  questionEn: string;
  questionBn: string;
  optionsEn: string[];
  optionsBn: string[];
  correctOptionIndex: number;
}

export interface TestResult {
  testId: string;
  testNameEn: string;
  testNameBn: string;
  score: number;
  totalMarks: number;
  correctAnswersCount: number;
  wrongAnswersCount: number;
  skippedCount: number;
  percentage: number;
  rank?: number;
  date: string;
  studentName?: string;
}

export interface ChatMessage {
  id: string;
  roomId: string; // e.g., 'class_10_math'
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  text: string;
  timestamp: string;
  fileAttachment?: {
    name: string;
    url: string;
    type: 'pdf' | 'image';
  };
}

export interface DriveItem {
  id: string;
  name: string;
  mimeType: string;
  webViewLink?: string;
  webContentLink?: string;
  size?: string;
  thumbnailLink?: string;
}

export interface Announcement {
  id: string;
  textEn: string;
  textBn: string;
  date: string;
  isPinned: boolean;
}

export enum QuestionType {
  MCQ = 'mcq',
  SHORT = 'short',
  LONG = 'long',
}

export interface TestGroup {
  group_label: string;
  group_description: string;
  marks_per_question: number;
  question_ids: string[];
}

export interface TestPaper {
  test_id: string;
  test_type: 'live_mcq' | 'full_length' | 'practice_generated';
  class: string;
  subject: string;
  groups: TestGroup[];
  total_marks: number;
  duration_minutes: number;
  scheduled_time?: string;
}

