import fs from 'fs';

let content = fs.readFileSync('src/components/StudentManagementView.tsx', 'utf8');

// Replace Firestore calls with localStorage
content = content.replace(
`  // Firestore Listeners
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
  }, []);`,
`  // Local Storage Listeners
  useEffect(() => {
    const localStudents = localStorage.getItem('local_students');
    if (localStudents) {
      setStudents(JSON.parse(localStudents).sort((a: any, b: any) => a.name.localeCompare(b.name)));
    }
    const localClassInfo = localStorage.getItem('local_class_info');
    if (localClassInfo) {
      setClassInfo(JSON.parse(localClassInfo));
    }
  }, []);

  const saveStudentsLocal = (newStudents: Student[]) => {
    setStudents(newStudents);
    localStorage.setItem('local_students', JSON.stringify(newStudents));
  };
`
);

content = content.replace(
`  const handleUpdateInfo = async (field: keyof ClassInfo, value: string) => {
    const newInfo = { ...classInfo, [field]: value };
    setClassInfo(newInfo);
    try {
      await setDoc(doc(db, "class_info", "current"), newInfo);
    } catch (error) {
      console.error("Failed to update class info", error);
    }
  };`,
`  const handleUpdateInfo = async (field: keyof ClassInfo, value: string) => {
    const newInfo = { ...classInfo, [field]: value };
    setClassInfo(newInfo);
    localStorage.setItem('local_class_info', JSON.stringify(newInfo));
  };`
);

content = content.replace(
`    const path = "students";
    try {
      await addDoc(collection(db, path), newStudent);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }`,
`    const newStudentWithId = { ...newStudent, id: Date.now().toString() };
    saveStudentsLocal([...students, newStudentWithId]);`
);

content = content.replace(
`    const path = "students";
    try {
      await updateDoc(doc(db, path, id), {
        ...updates,
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }`,
`    const updated = students.map(s => s.id === id ? { ...s, ...updates, updatedAt: new Date().toISOString() } : s);
    saveStudentsLocal(updated);`
);

content = content.replace(
`    const path = "students";
    try {
      await deleteDoc(doc(db, path, id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }`,
`    const updated = students.filter(s => s.id !== id);
    saveStudentsLocal(updated);`
);

fs.writeFileSync('src/components/StudentManagementView.tsx', content);
console.log("Done");
