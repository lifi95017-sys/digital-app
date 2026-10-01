const fs = require('fs');
let content = fs.readFileSync('src/components/StudentManagementView.tsx', 'utf8');

const replacement = `      </div>

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
                  <div>`;

content = content.replace(
  `          </table>\n        </div>\n\n                  </div>\n                  <div>`,
  replacement
);

fs.writeFileSync('src/components/StudentManagementView.tsx', content);
