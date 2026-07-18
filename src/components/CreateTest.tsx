import React, { useState } from 'react';
import { type Question, type TestPaper, QuestionType, type TestGroup } from '../types';
import { SymbolPaletteButton } from './SymbolPaletteButton';

interface CreateTestProps {
  lang: 'en' | 'bn';
  onPublish: (test: TestPaper) => void;
}

export const CreateTest: React.FC<CreateTestProps> = ({ lang, onPublish }) => {
  const [testType, setTestType] = useState<'live_mcq' | 'full_length' | 'practice_generated'>('live_mcq');
  const [groups, setGroups] = useState<TestGroup[]>([{ group_label: 'Group A', group_description: '', marks_per_question: 1, question_ids: [] }]);

  const addGroup = () => {
    setGroups([...groups, { group_label: `Group ${String.fromCharCode(65 + groups.length)}`, group_description: '', marks_per_question: 1, question_ids: [] }]);
  };

  const updateGroup = (idx: number, updates: Partial<TestGroup>) => {
    setGroups(groups.map((g, i) => i === idx ? { ...g, ...updates } : g));
  };

  const types = [
    { id: 'live_mcq', label: 'Live MCQ Test' },
    { id: 'full_length', label: 'Full Length Test' },
    { id: 'practice_generated', label: 'Practice Questions' },
  ];

  return (
    <div className="space-y-6">
      <h3 className="text-sm font-bold text-gray-800 tracking-wider uppercase border-b border-orange-50 pb-2">
        {lang === 'en' ? 'Create New Test Paper' : 'নতুন প্রশ্নপত্র তৈরি করুন'}
      </h3>

      <div className="flex gap-4">
        {types.map(t => (
          <button 
            key={t.id}
            onClick={() => setTestType(t.id as any)}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${testType === t.id ? 'bg-teal-500 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            {t.label}
          </button>
        ))}
      </div>
      
      <div className="space-y-4">
        {groups.map((group, idx) => (
          <div key={idx} className="p-4 border rounded-xl bg-gray-50">
            <div className="flex gap-2">
              <input value={group.group_label} onChange={e => updateGroup(idx, { group_label: e.target.value })} className="font-bold p-1 w-24" />
              <input value={group.group_description} onChange={e => updateGroup(idx, { group_description: e.target.value })} placeholder="Description" className="flex-1 p-1" />
              <input type="number" value={group.marks_per_question} onChange={e => updateGroup(idx, { marks_per_question: parseInt(e.target.value) })} className="w-16 p-1" />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Marks: {group.marks_per_question} × {group.question_ids.length} = {group.marks_per_question * group.question_ids.length}
            </p>
          </div>
        ))}
        <button onClick={addGroup} className="text-xs text-teal-600 font-bold">+ Add Group</button>
      </div>
    </div>
  );
};
