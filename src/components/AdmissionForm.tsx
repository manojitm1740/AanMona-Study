
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { type Language } from '../i18n';
import { addDoc, collection, getFirestore } from 'firebase/firestore';
import { jsPDF } from 'jspdf';

interface AdmissionFormProps {
  lang: Language;
}

export default function AdmissionForm({ lang }: AdmissionFormProps) {
  const [step, setStep] = useState(1);
  const [declarationChecked, setDeclarationChecked] = useState(false);
  const [fileErrors, setFileErrors] = useState<Record<string, string>>({});
  const [showPreview, setShowPreview] = useState(false);
  const [generatedCredentials, setGeneratedCredentials] = useState<{userId: string, password: string} | null>(null);
  const [formData, setFormData] = useState<any>({
    sameAddress: false,
    presentAddress: {},
    permanentAddress: {},
    fullName: '',
    dob: '',
    gender: '',
    bloodGroup: '',
    religion: '',
    category: '',
    nationality: '',
    motherTongue: '',
    aadhaar: '',
    fatherName: '',
    motherName: '',
    guardianName: '',
    relation: '',
    guardianOccupation: '',
    guardianMobile: '',
    whatsappNo: '',
    studentMobile: '',
    email: '',
    applyingClass: '',
    subjects: []
  });
  const db = getFirestore();

  const handleUpdate = (field: string, value: any, subField?: string) => {
    setFormData((prev: any) => {
      if (subField) {
        return {
          ...prev,
          [field]: { ...prev[field], [subField]: value }
        };
      }
      return { ...prev, [field]: value };
    });
  };

  const getFormPDF = (data: any, credentials?: {userId: string, password: string}) => {
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.setTextColor(255, 107, 53); // Saffron Theme
    doc.setFont('helvetica', 'bold');
    doc.text("AanMona Study", 105, 20, { align: 'center' });
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
    doc.text("West Bengal, India · Mobile: 8016936780 (Manojit Sir)", 105, 30, { align: 'center' });
    
    doc.setFontSize(16);
    doc.setFillColor(255, 107, 53);
    doc.rect(10, 40, 190, 10, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.text("ADMISSION FORM", 105, 47, { align: 'center' });
    
    if (credentials) {
      doc.setFontSize(10);
      doc.text(`User ID: ${credentials.userId} | Password: ${credentials.password}`, 105, 55, { align: 'center' });
    }

    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'normal');
    
    let y = 70;
    doc.setFont('helvetica', 'bold');
    doc.text(`Personal Details`, 10, y);
    y += 10;
    doc.setFont('helvetica', 'normal');
    doc.text(`Full Name: ${data.fullName || ''}`, 10, y);
    y += 7;
    doc.text(`DOB: ${data.dob || ''} | Gender: ${data.gender || ''} | Blood Group: ${data.bloodGroup || ''}`, 10, y);
    y += 7;
    doc.text(`Religion: ${data.religion || ''} | Category: ${data.category || ''} | Nationality: ${data.nationality || ''}`, 10, y);
    
    return doc;
  };

  const downloadBlankForm = () => {
    const doc = getFormPDF({});
    doc.save("aanmona_study_admission_blank.pdf");
  };

  const submitForm = async () => {
    try {
      const firstName = formData.fullName?.split(' ')[0] || 'User';
      const birthYear = formData.dob ? new Date(formData.dob).getFullYear() : new Date().getFullYear();
      const userId = `${firstName}${birthYear}`;
      const password = `${firstName}@${birthYear}`;
      const credentials = { userId, password };

      await addDoc(collection(db, 'admissions'), {
        ...formData,
        ...credentials,
        status: 'pending',
        createdAt: new Date().toISOString()
      });
      
      setGeneratedCredentials(credentials);
      const doc = getFormPDF(formData, credentials);
      doc.save(`admission_form_${userId}.pdf`);
      alert(`Application submitted successfully! \n\nUserID: ${userId}, Password: ${password}`);
      setShowPreview(false);
      
    } catch (e) {
      console.error(e);
      alert('Error submitting form');
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-2xl shadow-sm border border-gray-200">
      <style>{`
        @media print {
          .no-print { display: none !important; }
        }
      `}</style>
      <div className="text-center mb-6 border-b-2 border-[#FF6B35] pb-4 no-print">
        <h1 className="text-3xl font-bold text-[#FF6B35]">AanMona Study</h1>
        <p className="text-sm text-gray-600">West Bengal, India · Mobile: 8016936780 (Manojit Sir) · contact@aanmona.study</p>
        <div className="bg-[#FF6B35] text-white mt-2 p-2 font-bold rounded-xl">OFFLINE ADMISSION FORM</div>
      </div>
      
      <div className="mb-8 flex justify-between no-print">
        {[1,2,3,4,5,6,7,8].map(s => (
          <div key={s} className={`h-2 flex-1 mx-1 rounded-full ${s <= step ? 'bg-[#FF6B35]' : 'bg-gray-200'}`}></div>
        ))}
      </div>
      
      <div className="mb-4 no-print">
        <button onClick={downloadBlankForm} className="text-sm text-[#FF6B35] underline font-medium">
          Download Blank Form (Offline Mode)
        </button>
      </div>

      <AnimatePresence mode="wait">
      {step === 1 && (
        <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="space-y-4">
          <h3 className="bg-[#FF6B35] text-white p-2 font-bold mb-4 rounded-xl">1. Personal Details</h3>
          <input type="text" placeholder="Full Name (UPPERCASE)*" value={formData.fullName} onChange={(e) => handleUpdate('fullName', e.target.value.toUpperCase())} className="w-full p-2 border border-gray-300 rounded-xl hover:border-[#FF6B35] focus:border-[#FF6B35] focus:ring-1 focus:ring-[#FF6B35] outline-none transition" />
          <div className="grid grid-cols-3 gap-4">
            <input type="date" value={formData.dob} onChange={(e) => handleUpdate('dob', e.target.value)} className="w-full p-2 border border-gray-300 rounded-xl hover:border-[#FF6B35] focus:border-[#FF6B35] focus:ring-1 focus:ring-[#FF6B35] outline-none transition" placeholder="DOB" />
            <select value={formData.gender} onChange={(e) => handleUpdate('gender', e.target.value)} className="w-full p-2 border border-gray-300 rounded-xl hover:border-[#FF6B35] focus:border-[#FF6B35] focus:ring-1 focus:ring-[#FF6B35] outline-none transition">
              <option value="">Select Gender*</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            <select value={formData.bloodGroup} onChange={(e) => handleUpdate('bloodGroup', e.target.value)} className="w-full p-2 border border-gray-300 rounded-xl hover:border-[#FF6B35] focus:border-[#FF6B35] focus:ring-1 focus:ring-[#FF6B35] outline-none transition">
              <option value="">Blood Group</option>
              {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-', 'Unknown'].map(bg => <option key={bg} value={bg}>{bg}</option>)}
            </select>
          </div>
          <div className="flex justify-end no-print">
            <button onClick={() => setStep(step + 1)} className="bg-[#FF6B35] text-white px-6 py-2 rounded-xl transition hover:bg-orange-600">Save and Next</button>
          </div>
        </motion.div>
      )}
      {step === 8 && (
        <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="space-y-4">
          <h3 className="bg-[#FF6B35] text-white p-2 font-bold mb-4 rounded-xl">8. Review & Submit</h3>
          <p>Click below to preview your details.</p>
          <div className="flex justify-between no-print">
            <button onClick={() => setStep(7)} className="bg-gray-200 px-6 py-2 rounded-xl">Back</button>
            <button onClick={() => setShowPreview(true)} className="bg-[#FF6B35] text-white px-6 py-2 rounded-xl transition hover:bg-orange-600">Preview Details</button>
          </div>
        </motion.div>
      )}
      </AnimatePresence>
      
      {showPreview && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
           <div className="bg-white p-6 rounded-2xl w-full max-w-lg space-y-4">
              <h2 className="text-xl font-bold text-[#FF6B35]">Review Details</h2>
              <pre className="text-xs bg-gray-100 p-4 rounded-xl overflow-auto">{JSON.stringify(formData, null, 2)}</pre>
              <div className="flex justify-end gap-2">
                <button onClick={() => setShowPreview(false)} className="bg-gray-500 text-white px-4 py-2 rounded-xl">Close</button>
                <button onClick={submitForm} className="bg-[#FF6B35] text-white px-4 py-2 rounded-xl">Confirm & Submit</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
