import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ChevronLeft,
  Trash2,
  Search,
  Plus,
  CheckCircle2,
  Filter,
  UserPlus,
  FileSpreadsheet,
  Printer,
  Save,
  Download,
  Camera,
  X,
  PlusCircle,
  FileText,
  Users,
  GraduationCap,
} from "lucide-react";
import { db, auth } from "../lib/firebase";
import {
  collection,
  query,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  orderBy,
  setDoc,
} from '../lib/firebase';
import { Student, Grade, ClassInfo } from "../types";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import StudentReportMoEYS from "./StudentReportMoEYS";

enum OperationType {
  CREATE = "create",
  UPDATE = "update",
  DELETE = "delete",
  LIST = "list",
  GET = "get",
  WRITE = "write",
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  };
}

function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null,
) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
    },
    operationType,
    path,
  };
  console.error("Firestore Error: ", JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

interface StudentManagementViewProps {
  onBack: () => void;
}

export default function StudentManagementView({
  onBack,
}: StudentManagementViewProps) {
  const [students, setStudents] = useState<Student[]>([]);
  const [classInfo, setClassInfo] = useState<ClassInfo>({
    schoolName: "សាលាបឋមសិក្សាវិមានឯករាជ្យ",
    grade: "ថ្នាក់ទី ៦អា (6A)",
    academicYear: "២០២៤-២០២៥",
    teacherName: "លោកគ្រូ អ៊ុំ សុភក្ត្រា",
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [showMoEYSReport, setShowMoEYSReport] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newStudentData, setNewStudentData] = useState({
    photoUrl: "",
    name: "",
    gender: "ប្រុស",
    dob: "",
    fatherName: "",
    motherName: "",
    village: "",
    district: "",
    province: "",
  });


  const printRef = useRef<HTMLDivElement>(null);

  // Firestore Listeners
  useEffect(() => {
    const studentsPath = "students";
    const unsubStudents = onSnapshot(
      query(collection(db, studentsPath), orderBy("name", "asc")),
      (snap) => {
        setStudents(
          snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Student[],
        );
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, studentsPath);
      },
    );

    const infoPath = "class_info";
    const infoDocRef = doc(db, infoPath, "current");
    const unsubInfo = onSnapshot(infoDocRef, (snap) => {
      if (snap.exists()) {
        setClassInfo(snap.data() as ClassInfo);
      }
    });

    return () => {
      unsubStudents();
      unsubInfo();
    };
  }, []);

  const handleUpdateInfo = async (field: keyof ClassInfo, value: string) => {
    const newInfo = { ...classInfo, [field]: value };
    setClassInfo(newInfo);
    try {
      await setDoc(doc(db, "class_info", "current"), newInfo);
    } catch (error) {
      console.error("Failed to update class info", error);
    }
  };


  const handleAddStudent = () => {
    setShowAddModal(true);
  };

  const saveNewStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    // Generate next roll number (e.g. 001, 002...)
    const nextRollNum = String(students.length + 1).padStart(3, "0");

    const newStudent: any = {
      name: newStudentData.name || "សិស្សថ្មី",
      rollNumber: nextRollNum,
      gender: newStudentData.gender,
      grade: 6,
      dob: newStudentData.dob,
      fatherName: newStudentData.fatherName,
      motherName: newStudentData.motherName,
      village: newStudentData.village,
      district: newStudentData.district,
      province: newStudentData.province,
      status: "active",
      photoUrl: newStudentData.photoUrl || "",
      stars: {
        cleanliness: 0,
        friendliness: 0,
        helpingOthers: 0,
        learningActivity: 0,
        groupWork: 0,
        homework: 0,
      },
      badges: [],
      academicYear: classInfo.academicYear,
      updatedAt: new Date().toISOString(),
    };

    const path = "students";
    try {
      await addDoc(collection(db, path), newStudent);
      setShowAddModal(false);
      setNewStudentData({
        name: "",
        gender: "ប្រុស",
        dob: "",
        fatherName: "",
        motherName: "",
        village: "",
        district: "",
        province: "",
        photoUrl: "",
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  };


  const handleUpdateStudent = async (id: string, updates: Partial<Student>) => {
    const path = "students";
    try {
      await updateDoc(doc(db, path, id), {
        ...updates,
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  };

  const handleDeleteStudent = async (id: string) => {
    if (window.confirm("តើអ្នកពិតជាចង់លុបទិន្នន័យសិស្សនេះមែនទេ?")) {
      const path = "students";
      try {
        await deleteDoc(doc(db, path, id));
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, path);
      }
    }
  };

  const handlePhotoUpload = async (
    id: string,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result as string;
      await handleUpdateStudent(id, { photoUrl: base64String });
    };
    reader.readAsDataURL(file);
  };

  const exportToExcel = () => {
    const data = students.map((s, index) => ({
      "ល.រ": s.rollNumber || String(index + 1).padStart(3, "0"),
      "គោត្តនាម - នាម": s.name,
      "ភេទ": s.gender,
      "ថ្ងៃខែឆ្នាំកំណើត": s.dob || "",
      "ឈ្មោះឪពុក": s.fatherName || "",
      "ឈ្មោះម្តាយ": s.motherName || "",
      "ភូមិ/ឃុំ/សង្កាត់": s.village || "",
      "ក្រុង/ស្រុក/ខេត្ត": s.province || "",
      "ស្ថានភាព": s.status === 'inactive' ? 'ឈប់រៀន' : 'កំពុងសិក្សា',
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Students");

    // Auto adjust column widths
    const wscols = [
      {wch: 8},
      {wch: 25},
      {wch: 10},
      {wch: 15},
      {wch: 20},
      {wch: 20},
      {wch: 20},
      {wch: 20},
      {wch: 15},
    ];
    ws['!cols'] = wscols;

    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([wbout], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, `Student_List_${classInfo.grade}.xlsx`);
  };

  const handlePrint = () => {
    window.print();
  };

  const filteredStudents = students.filter(
    (s) =>
      s.name.includes(searchTerm) ||
      (s.rollNumber && s.rollNumber.includes(searchTerm)) ||
      (s.id && s.id.includes(searchTerm)),
  );

  const stats = {
    total: students.length,
    male: students.filter((s) => s.gender === "ប្រុស" || s.gender === "male")
      .length,
    female: students.filter((s) => s.gender === "ស្រី" || s.gender === "female")
      .length,
    active: students.filter((s) => s.status === "active" || !s.status).length,
  };

  if (showMoEYSReport) {
    return (
      <StudentReportMoEYS
        students={students}
        classInfo={classInfo}
        onBack={() => setShowMoEYSReport(false)}
      />
    );
  }

  return (
    <div className="space-y-8 min-h-screen pb-20 print:p-0 print:bg-white print:space-y-4">
      {/* Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
        <button
          onClick={onBack}
          className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl text-slate-600 hover:text-indigo-600 transition-all font-medium border border-slate-200 shadow-sm self-start"
        >
          <ChevronLeft className="w-5 h-5 text-indigo-600" />
          ត្រឡប់ក្រោយ
        </button>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleAddStudent}
            className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold khmer-font flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
          >
            <PlusCircle className="w-5 h-5" /> បញ្ចូលឈ្មោះសិស្ស
          </button>
          <button
            onClick={exportToExcel}
            className="bg-emerald-50 text-emerald-700 border border-emerald-100 px-6 py-2.5 rounded-xl font-bold khmer-font flex items-center gap-2 hover:bg-emerald-100 transition-all"
          >
            <FileSpreadsheet className="w-5 h-5" /> ទាញយក EXCEL
          </button>
          <button
            onClick={() => setShowMoEYSReport(true)}
            className="bg-orange-50 text-orange-700 border border-orange-100 px-6 py-2.5 rounded-xl font-bold khmer-font flex items-center gap-2 hover:bg-orange-100 transition-all"
          >
            <FileText className="w-5 h-5" /> តារាងបញ្ជីឈ្មោះសិស្ស
          </button>
          <button
            onClick={handlePrint}
            className="bg-slate-800 text-white px-6 py-2.5 rounded-xl font-bold khmer-font flex items-center gap-2 hover:bg-slate-900 transition-all shadow-lg shadow-slate-100"
          >
            <Printer className="w-5 h-5" /> បោះពុម្ពបញ្ជី
          </button>
        </div>
      </div>

      {/* Summary Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 print:hidden">
        <StatCard
          label="សិស្សសរុបទូទាំងថ្នាក់"
          value={stats.total}
          color="border-indigo-200 bg-indigo-50"
          textColor="text-indigo-700"
          icon={<Users className="w-5 h-5" />}
        />
        <StatCard
          label="សិស្សប្រុស"
          value={stats.male}
          color="border-blue-200 bg-blue-50"
          textColor="text-blue-700"
          icon={<div className="text-xl">👦</div>}
        />
        <StatCard
          label="សិស្សស្រី"
          value={stats.female}
          color="border-pink-200 bg-pink-50"
          textColor="text-pink-700"
          icon={<div className="text-xl">👧</div>}
        />
        <StatCard
          label="ស្ថានភាព៖ កំពុងសិក្សា"
          value={stats.active}
          color="border-emerald-200 bg-emerald-50"
          textColor="text-emerald-700"
          icon={<CheckCircle2 className="w-5 h-5" />}
        />
      </div>

      {/* Document Wrapper - Removed as requested */}

      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              onClick={() => setShowAddModal(false)}
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl p-8 z-10"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold khmer-font text-slate-800">បន្ថែមសិស្សថ្មី</h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="w-10 h-10 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={saveNewStudent} className="space-y-4">
                <div className="flex items-center gap-6">
                  <div className="relative w-24 h-24 rounded-full bg-slate-100 border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden shrink-0 group">
                    {newStudentData.photoUrl ? (
                      <img src={newStudentData.photoUrl} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <Camera className="w-8 h-8 text-slate-300" />
                    )}
                    <label className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                      <Camera className="w-6 h-6 text-white mb-1" />
                      <span className="text-[10px] text-white font-bold khmer-font">ជ្រើសរើស</span>
                      <input 
                        type="file" 
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setNewStudentData(prev => ({...prev, photoUrl: reader.result as string}));
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-bold text-slate-700 mb-1 khmer-font">ឈ្មោះសិស្ស <span className="text-rose-500">*</span></label>
                    <input
                      type="text"
                      required
                      value={newStudentData.name}
                      onChange={(e) => setNewStudentData({ ...newStudentData, name: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all khmer-font"
                      placeholder="ឧ. សុខ សាន្ត"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1 khmer-font">ភេទ <span className="text-rose-500">*</span></label>
                  <select
                    value={newStudentData.gender}
                    onChange={(e) => setNewStudentData({ ...newStudentData, gender: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all khmer-font"
                  >
                    <option value="ប្រុស">ប្រុស</option>
                    <option value="ស្រី">ស្រី</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1 khmer-font">ថ្ងៃខែឆ្នាំកំណើត</label>
                  <input
                    type="date"
                    value={newStudentData.dob}
                    onChange={(e) => setNewStudentData({ ...newStudentData, dob: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all khmer-font"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1 khmer-font">ឈ្មោះឪពុក</label>
                    <input
                      type="text"
                      value={newStudentData.fatherName}
                      onChange={(e) => setNewStudentData({ ...newStudentData, fatherName: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all khmer-font text-sm"
                      placeholder="ឈ្មោះឪពុក"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1 khmer-font">ឈ្មោះម្ដាយ</label>
                    <input
                      type="text"
                      value={newStudentData.motherName}
                      onChange={(e) => setNewStudentData({ ...newStudentData, motherName: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all khmer-font text-sm"
                      placeholder="ឈ្មោះម្ដាយ"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1 khmer-font">ភូមិ</label>
                    <input
                      type="text"
                      value={newStudentData.village}
                      onChange={(e) => setNewStudentData({ ...newStudentData, village: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all khmer-font text-sm"
                      placeholder="ភូមិ"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1 khmer-font">ឃុំ/សង្កាត់</label>
                    <input
                      type="text"
                      value={newStudentData.district}
                      onChange={(e) => setNewStudentData({ ...newStudentData, district: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all khmer-font text-sm"
                      placeholder="ឃុំ/សង្កាត់"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1 khmer-font">ខេត្ត</label>
                    <input
                      type="text"
                      value={newStudentData.province}
                      onChange={(e) => setNewStudentData({ ...newStudentData, province: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all khmer-font text-sm"
                      placeholder="ខេត្ត"
                    />
                  </div>
                </div>

                <div className="pt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold khmer-font hover:bg-slate-200 transition-colors"
                  >
                    បោះបង់
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold khmer-font hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100 flex items-center justify-center gap-2"
                  >
                    <Save className="w-5 h-5" />
                    រក្សាទុក
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style>{`

        @media print {
          @page { size: landscape; margin: 1cm; }
          body { background: white !important; }
          .min-h-screen { min-height: auto !important; }
          .print\\:hidden { display: none !important; }
          .cell-header, .cell-content { border: 1px solid #e2e8f0 !important; padding: 4px !important; }
          .input-inline { border: none !important; padding: 0 !important; font-size: 8px !important; }
          select { appearance: none; -webkit-appearance: none; border: none !important; background: transparent !important; padding: 0 !important; font-size: 8px !important; }
        }
        .cell-header { padding: 1.25rem 0.5rem; text-align: center; font-weight: 900; color: #64748b; text-transform: uppercase; letter-spacing: 0.1em; border-bottom: 2px solid #f1f5f9; white-space: nowrap; font-family: 'Kantumruy Pro', sans-serif; }
        .cell-content { padding: 0.75rem 0.5rem; }
        .input-inline { width: 100%; background: transparent; outline: none; border-bottom: 1px solid transparent; transition: all 0.2s; font-family: 'Kantumruy Pro', sans-serif; padding: 4px; }
        .input-inline:focus { border-bottom-color: #6366f1; background-color: #f8fafc; border-radius: 4px; }
      `}</style>
    </div>
  );
}

function HeaderField({
  label,
  value,
  onChange,
  align,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  align: string;
}) {
  return (
    <div
      className={`bg-white p-4 rounded-2xl border border-slate-100 shadow-sm print:border-none print:p-0 text-${align}`}
    >
      <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full font-black khmer-font text-slate-700 bg-transparent outline-none border-none focus:ring-0 p-0 text-${align}`}
      />
    </div>
  );
}

function StatCard({ label, value, color, textColor, icon }: any) {
  return (
    <div
      className={`p-6 rounded-[2rem] border-2 shadow-sm flex items-center justify-between group hover:scale-[1.02] transition-all cursor-default ${color}`}
    >
      <div className="space-y-1">
        <p className="text-[10px] font-black opacity-50 uppercase tracking-widest khmer-font">
          {label}
        </p>
        <p className={`text-4xl font-black ${textColor}`}>{value}</p>
      </div>
      <div
        className={`w-12 h-12 rounded-2xl flex items-center justify-center opacity-40 group-hover:opacity-100 transition-opacity ${textColor} bg-white/50 backdrop-blur-sm`}
      >
        {icon}
      </div>
    </div>
  );
}
