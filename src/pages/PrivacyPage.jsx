import { Link } from 'react-router-dom';
import { ChevronLeft, Database, Settings, ShieldCheck, Mail, Lock, Eye } from 'lucide-react';
import { motion } from 'motion/react';

export default function PrivacyPage() {
  const sections = [
    {
      icon: <Database className="h-6 w-6 text-indigo-500" />,
      title: "1. Information We Collect",
      content: "We collect information you provide directly to us, such as when you create or modify your account, request services, contact customer support, or otherwise communicate with us. This includes: name, email, phone number, profile picture, and borrowing history."
    },
    {
      icon: <Settings className="h-6 w-6 text-sky-500" />,
      title: "2. How We Use Information",
      content: "We use the information we collect to provide, maintain, and improve our Services, perform internal operations including fraud prevention, send important updates, and personalize your reading experience."
    },
    {
      icon: <ShieldCheck className="h-6 w-6 text-emerald-500" />,
      title: "3. Data Security",
      content: "We use industry-standard encryption and security measures to help protect your information from loss, theft, misuse and unauthorized access, disclosure, or destruction."
    },
    {
      icon: <Mail className="h-6 w-6 text-amber-500" />,
      title: "4. Contact Us",
      content: "If you have any questions or concerns regarding our privacy practices, please reach out to us at privacy@readvault.in."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="relative isolate pt-14">
        {/* Background Decorations */}
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
          <div className="relative left-[calc(50%+11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#80ffdb] to-[#89d4fc] opacity-20 sm:left-[calc(50%+30rem)] sm:w-[72.1875rem]"></div>
        </div>

        <div className="max-w-4xl mx-auto px-6 py-12">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-primary transition-colors font-bold uppercase tracking-widest mb-12">
            <ChevronLeft className="h-4 w-4" /> Back to Home
          </Link>

          <header className="mb-20 text-center md:text-left">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-teal-50 text-teal-600 mb-6 border border-teal-100 shadow-sm">
              <Lock className="h-8 w-8" />
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">Privacy Policy</h1>
            <p className="text-lg text-slate-500 max-w-2xl leading-relaxed">Your privacy is our priority. Learn about how we protect and manage your personal data.</p>
            <div className="mt-6 flex flex-wrap gap-4 items-center justify-center md:justify-start">
              <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-bold uppercase tracking-wider border border-slate-200">Version 2.0</span>
              <span className="flex items-center gap-1.5 text-slate-400 text-xs font-semibold uppercase tracking-wider"><Eye className="h-3.5 w-3.5" /> High Privacy Standards</span>
            </div>
          </header>

          <div className="grid grid-cols-1 gap-12 relative">
            <div className="absolute left-[31px] top-8 bottom-8 w-1 bg-slate-100 hidden md:block"></div>
            
            {sections.map((section, idx) => (
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                key={idx} 
                className="relative md:pl-20"
              >
                <div className="absolute left-0 top-0 hidden md:flex h-16 w-16 items-center justify-center rounded-2xl bg-white border border-slate-200 shadow-sm z-10 transition-transform hover:scale-110">
                  {section.icon}
                </div>
                
                <div className="bg-white rounded-[2rem] p-8 md:p-10 border border-slate-200 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-all group">
                  <div className="flex items-center gap-4 mb-6 md:hidden">
                    <div className="h-12 w-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center">
                      {section.icon}
                    </div>
                    <h2 className="text-xl font-bold text-slate-800">{section.title}</h2>
                  </div>
                  <h2 className="hidden md:block text-2xl font-bold text-slate-900 mb-4 group-hover:text-teal-600 transition-colors">{section.title}</h2>
                  <p className="text-slate-600 leading-relaxed text-lg font-medium">
                    {section.content}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-12 p-8 bg-rose-50 border border-rose-100 rounded-3xl flex flex-col md:flex-row items-center gap-6">
             <div className="h-12 w-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center flex-shrink-0 animate-pulse">
                <ShieldCheck className="h-6 w-6" />
             </div>
             <div>
                <h4 className="font-bold text-slate-900">Your Data, Your Control</h4>
                <p className="text-sm text-slate-600">You can request a copy of your data or account deletion at any time through your dashboard settings.</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
