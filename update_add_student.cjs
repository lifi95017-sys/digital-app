const fs = require('fs');

let content = fs.readFileSync('src/components/StudentManagementView.tsx', 'utf8');

const stateCode = `
  const [searchTerm, setSearchTerm] = useState("");
  const [showMoEYSReport, setShowMoEYSReport] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newStudentData, setNewStudentData] = useState({
    name: "",
    gender: "ប្រុស",
    dob: "",
    fatherName: "",
    motherName: "",
    village: "",
    district: "",
    province: "",
  });
`;
content = content.replace('  const [searchTerm, setSearchTerm] = useState("");\n  const [showMoEYSReport, setShowMoEYSReport] = useState(false);', stateCode);

const addStudentCode = `
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
      photoUrl: "",
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
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  };
`;

content = content.replace(/  const handleAddStudent = async \(\) => {[\s\S]*?catch \(error\) {[\s\S]*?handleFirestoreError\(error, OperationType\.CREATE, path\);\n    }\n  };/, addStudentCode);

fs.writeFileSync('src/components/StudentManagementView.tsx', content);
