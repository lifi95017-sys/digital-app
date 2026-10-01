const fs = require('fs');

let content = fs.readFileSync('src/components/StudentManagementView.tsx', 'utf8');

// Update state
content = content.replace(
  'const [newStudentData, setNewStudentData] = useState({',
  'const [newStudentData, setNewStudentData] = useState({\n    photoUrl: "",'
);

// Update reset
content = content.replace(
  '        name: "",\n        gender: "ប្រុស",\n        dob: "",\n        fatherName: "",\n        motherName: "",\n        village: "",\n        district: "",\n        province: "",\n      });\n    } catch (error) {',
  '        name: "",\n        gender: "ប្រុស",\n        dob: "",\n        fatherName: "",\n        motherName: "",\n        village: "",\n        district: "",\n        province: "",\n        photoUrl: "",\n      });\n    } catch (error) {'
);

// Update save payload
content = content.replace(
  '      status: "active",\n      photoUrl: "",',
  '      status: "active",\n      photoUrl: newStudentData.photoUrl || "",'
);

// Add photo uploader UI
const uploadUI = `
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
`;

content = content.replace(
  /                <div>\s*<label className="block text-sm font-bold text-slate-700 mb-1 khmer-font">ឈ្មោះសិស្ស <span className="text-rose-500">\*<\/span><\/label>\s*<input\s*type="text"\s*required\s*value=\{newStudentData\.name\}\s*onChange=\{\(e\) => setNewStudentData\(\{ \.\.\.newStudentData, name: e\.target\.value \}\)\}\s*className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all khmer-font"\s*placeholder="ឧ\. សុខ សាន្ត"\s*\/>\s*<\/div>/,
  uploadUI
);


fs.writeFileSync('src/components/StudentManagementView.tsx', content);
