const fs = require('fs');
let content = fs.readFileSync('src/components/StudentManagementView.tsx', 'utf8');

const modalCode = `
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
              className="relative w-full max-w-lg bg-white rounded-[2rem] shadow-2xl p-6 md:p-8"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-black text-slate-800 khmer-font flex items-center gap-2">
                  <UserPlus className="w-6 h-6 text-indigo-600" />
                  បញ្ចូលឈ្មោះសិស្សថ្មី
                </h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="w-10 h-10 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={saveNewStudent} className="space-y-4">
                <div>
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
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1 khmer-font">ភេទ</label>
                    <select
                      value={newStudentData.gender}
                      onChange={(e) => setNewStudentData({ ...newStudentData, gender: e.target.value as any })}
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
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1 khmer-font">ឈ្មោះឪពុក</label>
                    <input
                      type="text"
                      value={newStudentData.fatherName}
                      onChange={(e) => setNewStudentData({ ...newStudentData, fatherName: e.target.value })}
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all khmer-font text-sm"
                      placeholder="ឈ្មោះឪពុក"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1 khmer-font">ឈ្មោះម្ដាយ</label>
                    <input
                      type="text"
                      value={newStudentData.motherName}
                      onChange={(e) => setNewStudentData({ ...newStudentData, motherName: e.target.value })}
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all khmer-font text-sm"
                      placeholder="ឈ្មោះម្ដាយ"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
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

      <style>{\`
`;

content = content.replace("      <style>{`", modalCode);

fs.writeFileSync('src/components/StudentManagementView.tsx', content);
