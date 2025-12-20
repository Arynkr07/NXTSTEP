import ContactForm from '../components/contact';
import Navbar from '../components/navbar';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      <Navbar />
      <ContactForm />
    </div>
  );
}