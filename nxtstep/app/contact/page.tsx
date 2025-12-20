import ContactForm from '../components/contact';

export default function ContactPage() {
  return (
    // Added dark:bg-slate-950 and dark:text-white
    <div className="bg-white dark:bg-slate-900 border border-transparent dark:border-slate-800 p-8 rounded-lg shadow-md ...">
      <ContactForm />
    </div>
  );
}