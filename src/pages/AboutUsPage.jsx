import { Github, Linkedin, Mail, Phone } from 'lucide-react';

export default function AboutUsPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 space-y-16">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800 tracking-tight">About ReadVault</h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          ReadVault is a modern digital library management platform designed to simplify the way users access, manage, and explore books online. The platform supports both physical and digital books, providing a seamless experience for readers and administrators.
        </p>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          The system includes secure authentication, role-based access control, digital PDF management, book borrowing functionality, and an admin dashboard for efficient library operations.
        </p>
      </div>

      {/* Vision */}
      <div className="bg-rose-50/50 rounded-3xl p-8 md:p-12 text-center border border-rose-100">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">Our Vision</h2>
        <p className="text-slate-600 leading-relaxed max-w-3xl mx-auto text-lg">
          The goal of ReadVault is to create a secure, scalable, and user-friendly virtual library system that allows users to access books anytime and anywhere.
        </p>
      </div>

      {/* Grid of features & tech */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
          <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center text-sm">✨</span>
            Features
          </h3>
          <ul className="space-y-3">
            {[
              'User Authentication & Authorization',
              'Digital & Physical Book Management',
              'PDF Upload & Access',
              'Borrow & Return System',
              'Admin Dashboard',
              'Profile Management',
              'Secure API Integration'
            ].map(feature => (
              <li key={feature} className="flex items-start gap-3 text-slate-600">
                <div className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-2 flex-shrink-0" />
                {feature}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
          <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center text-sm">💻</span>
            Technologies Used
          </h3>
          <ul className="space-y-3">
            {[
              'Java & Spring Boot',
              'Spring Security & JWT',
              'MySQL Database',
              'React.js',
              'Cloudinary',
              'REST APIs'
            ].map(tech => (
              <li key={tech} className="flex items-start gap-3 text-slate-600">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2 flex-shrink-0" />
                {tech}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Developer Section */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-8 md:p-12 text-white">
          <h2 className="text-3xl font-bold mb-2">Developed By</h2>
          <p className="text-slate-300">Meet the creator behind ReadVault</p>
        </div>
        <div className="p-8 md:p-12">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            <div className="w-32 h-32 md:w-48 md:h-48 rounded-2xl overflow-hidden bg-slate-100 flex-shrink-0 shadow-md">
              <img 
                src="https://ui-avatars.com/api/?name=Tanveer+Ahmed&size=512&background=random" 
                alt="Tanveer Ahmed" 
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="space-y-6 text-center md:text-left flex-grow">
              <div>
                <h3 className="text-3xl font-bold text-slate-800">Tanveer Ahmed</h3>
                <p className="text-rose-600 font-medium text-lg mt-1">Full Stack Java Developer</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
                <a href="mailto:tanveerahmed.dev@example.com" className="flex items-center gap-3 text-slate-600 hover:text-primary transition-colors p-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100">
                  <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center flex-shrink-0">
                    <Mail size={18} />
                  </div>
                  <div className="overflow-hidden text-left">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">Personal Email</p>
                    <p className="text-sm font-medium truncate">tanveerahmed.dev@example.com</p>
                  </div>
                </a>

                <a href="mailto:readvault.library@gmail.com" className="flex items-center gap-3 text-slate-600 hover:text-primary transition-colors p-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100">
                  <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center flex-shrink-0">
                    <Mail size={18} />
                  </div>
                  <div className="overflow-hidden text-left">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">Project Email</p>
                    <p className="text-sm font-medium truncate">readvault.library@gmail.com</p>
                  </div>
                </a>

                <a href="tel:+917051703578" className="flex items-center gap-3 text-slate-600 hover:text-primary transition-colors p-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100">
                  <div className="w-10 h-10 rounded-full bg-green-50 text-green-500 flex items-center justify-center flex-shrink-0">
                    <Phone size={18} />
                  </div>
                  <div className="overflow-hidden text-left">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">Phone</p>
                    <p className="text-sm font-medium truncate">+91 7051703578</p>
                  </div>
                </a>
              </div>

              <div className="flex items-center justify-center md:justify-start gap-4 pt-4 border-t border-slate-100">
                <a href="https://github.com/Tanveer7051" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors font-medium text-sm">
                  <Github size={18} />
                  GitHub
                </a>
                <a href="http://www.linkedin.com/in/tanveer-ahmed-tech" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 bg-[#0A66C2] text-white rounded-lg hover:bg-[#004182] transition-colors font-medium text-sm">
                  <Linkedin size={18} />
                  LinkedIn
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
