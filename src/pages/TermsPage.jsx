import { Link } from 'react-router-dom';
import { ChevronLeft, Scale, ShieldCheck, BookMarked, RefreshCw, FileCheck, Globe2 } from 'lucide-react';
import { motion } from 'motion/react';

export default function TermsPage() {
  const sections = [
    {
      icon: <Scale className="h-6 w-6 text-indigo-500" />,
      title: "1. Acceptance of Terms",
      content: "By accessing and using ReadVault, you agree to be bound by these Terms and Conditions. If you disagree with any part of these terms, you may not access our service."
    },
    {
      icon: <ShieldCheck className="h-6 w-6 text-emerald-500" />,
      title: "2. User Accounts",
      content: "When you create an account with us, you must provide information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account."
    },
    {
      icon: <BookMarked className="h-6 w-6 text-amber-500" />,
      title: "3. Library Rules",
      content: "Users must respect borrowing periods and return physical books in the same condition they were received. Digital books are for personal use only and must not be distributed."
    },
    {
      icon: <RefreshCw className="h-6 w-6 text-sky-500" />,
      title: "4. Changes to Terms",
      content: "We reserve the right, at our sole discretion, to modify or replace these Terms at any time. What constitutes a material change will be determined at our sole discretion."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="relative isolate pt-14">
        {/* Background Decorations */}
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
          <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"></div>
        </div>

        <div className="max-w-4xl mx-auto px-6 py-12">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-primary transition-colors font-bold uppercase tracking-widest mb-12">
            <ChevronLeft className="h-4 w-4" /> Back to Home
          </Link>

          <header className="mb-20 text-center md:text-left">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-indigo-50 text-indigo-600 mb-6 border border-indigo-100 shadow-sm">
              <FileCheck className="h-8 w-8" />
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">Terms of Service</h1>
            <p className="text-lg text-slate-500 max-w-2xl leading-relaxed">Please review our rules and guidelines for using the ReadVault platform.</p>
            <div className="mt-6 flex flex-wrap gap-4 items-center justify-center md:justify-start">
              <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-bold uppercase tracking-wider border border-slate-200">Last updated: May 7, 2026</span>
              <span className="flex items-center gap-1.5 text-slate-400 text-xs font-semibold uppercase tracking-wider"><Globe2 className="h-3.5 w-3.5" /> Effective Globally</span>
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
                  <h2 className="hidden md:block text-2xl font-bold text-slate-900 mb-4 group-hover:text-indigo-600 transition-colors">{section.title}</h2>
                  <p className="text-slate-600 leading-relaxed text-lg font-medium">
                    {section.content}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-20 p-12 bg-slate-900 rounded-[3rem] text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 h-32 w-32 bg-primary/20 blur-[80px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <h3 className="text-2xl font-bold text-white mb-4 relative z-10">Questions about our terms?</h3>
            <p className="text-slate-400 mb-8 relative z-10">Our legal team is here to help you understand your rights and responsibilities.</p>
            <Link to="/" className="inline-flex items-center justify-center h-12 px-8 bg-white text-slate-900 font-bold rounded-xl hover:bg-slate-50 transition-colors relative z-10">
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
