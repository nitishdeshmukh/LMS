import { useState } from 'react';
import {
  Mail,
  MessageSquare,
  Send,
  CheckCircle,
  HelpCircle,
  FileText,
  BookOpen,
  Award,
  ChevronDown,
} from 'lucide-react';

const StudentSupportPage = () => {
  const [category, setCategory] = useState('Select a topic');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [email, setEmail] = useState('alex.johnson@example.com'); // Pre-filled for logged-in user
  const [message, setMessage] = useState('');
  const [isSent, setIsSent] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const categories = [
    { id: 'courses', label: 'My Courses', icon: <BookOpen size={18} /> },
    { id: 'assignments', label: 'Assignments', icon: <FileText size={18} /> },
    { id: 'quizzes', label: 'Quizzes', icon: <HelpCircle size={18} /> },
    { id: 'certificates', label: 'Certificates', icon: <Award size={18} /> },
    { id: 'other', label: 'Other', icon: <MessageSquare size={18} /> },
  ];

  const handleSend = e => {
    e.preventDefault();
    if (category === 'Select a topic' || !message) return;

    setIsSending(true);
    // Simulate API call
    setTimeout(() => {
      setIsSending(false);
      setIsSent(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-blue-500 selection:text-white flex overflow-hidden">

      {/* --- MAIN CONTENT --- */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Support Form Content */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-10 custom-scrollbar flex justify-center">
          <div className="w-full max-w-2xl">
            {!isSent ? (
              <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
                {/* Decorative gradient */}
                <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-blue-500 via-purple-500 to-pink-500"></div>

                <div className="mb-8">
                  <h2 className="text-3xl font-bold mb-2">Get in touch</h2>
                  <p className="text-zinc-400">
                    Facing an issue? Let our support team know and we'll get back to you within 24
                    hours.
                  </p>
                </div>

                <form onSubmit={handleSend} className="space-y-6">
                  {/* Email Field */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-300">Your Email</label>
                    <div className="relative">
                      <Mail
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
                        size={18}
                      />
                      <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className="w-full bg-black border border-zinc-700 text-white pl-12 pr-4 py-3 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
                        placeholder="name@example.com"
                      />
                    </div>
                  </div>

                  {/* Category Dropdown */}
                  <div className="space-y-2 relative">
                    <label className="text-sm font-medium text-zinc-300">Topic</label>
                    <button
                      type="button"
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="w-full bg-black border border-zinc-700 text-white px-4 py-3 rounded-xl flex justify-between items-center focus:outline-none focus:border-blue-500 transition-colors text-left"
                    >
                      <span className="flex items-center gap-2">
                        {category !== 'Select a topic' &&
                          categories.find(c => c.label === category)?.icon}
                        {category}
                      </span>
                      <ChevronDown
                        size={18}
                        className={`text-zinc-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                      />
                    </button>

                    {isDropdownOpen && (
                      <div className="absolute top-full left-0 w-full mt-2 bg-zinc-800 border border-zinc-700 rounded-xl shadow-xl z-20 overflow-hidden">
                        {categories.map(item => (
                          <div
                            key={item.id}
                            onClick={() => {
                              setCategory(item.label);
                              setIsDropdownOpen(false);
                            }}
                            className="px-4 py-3 hover:bg-zinc-700 cursor-pointer flex items-center gap-3 text-sm text-zinc-200 hover:text-white transition-colors"
                          >
                            {item.icon}
                            {item.label}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Message Area */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-300">Message</label>
                    <textarea
                      rows="5"
                      value={message}
                      onChange={e => setMessage(e.target.value)}
                      className="w-full bg-black border border-zinc-700 text-white p-4 rounded-xl focus:outline-none focus:border-blue-500 transition-colors resize-none"
                      placeholder="Describe your issue in detail..."
                    ></textarea>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSending || category === 'Select a topic' || !message}
                    className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                      isSending || category === 'Select a topic' || !message
                        ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700 text-white hover:shadow-lg hover:shadow-blue-600/25'
                    }`}
                  >
                    {isSending ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send size={18} /> Send Message
                      </>
                    )}
                  </button>
                </form>
              </div>
            ) : (
              // Success State
              <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-12 shadow-2xl text-center flex flex-col items-center animate-fadeIn">
                <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle size={40} className="text-green-500" />
                </div>
                <h2 className="text-3xl font-bold mb-2">Message Sent!</h2>
                <p className="text-zinc-400 mb-8 max-w-xs mx-auto">
                  Thank you for reaching out. Our support team will review your query about{' '}
                  <span className="text-white font-bold">{category}</span> and respond to{' '}
                  <strong>{email}</strong> shortly.
                </p>
                <button
                  onClick={() => {
                    setIsSent(false);
                    setMessage('');
                    setCategory('Select a topic');
                  }}
                  className="px-8 py-3 border border-zinc-700 rounded-xl hover:bg-zinc-800 text-white font-medium transition-colors"
                >
                  Send Another Message
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentSupportPage;
