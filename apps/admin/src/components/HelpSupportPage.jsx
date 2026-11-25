import {
  AlertTriangle,
  Bell,
  Clock3,
  LocateFixed,
  MapPin,
  ShieldCheck,
  Users
} from "lucide-react";

const faqs = [
  {
    question: "How do I use the SOS feature?",
    answer:
      "Use the SOS control on the dashboard to start the demo flow. SHIELDHER records a demo incident and may create simulated notification records for your trusted contacts. It does not contact emergency services or send real messages."
  },
  {
    question: "How do I add trusted contacts?",
    answer:
      "Open Trusted Contacts from the navigation, choose Add Contact, enter the contact details, and save. These contacts are used to create demo notification records during the SOS flow."
  },
  {
    question: "How do notification records work?",
    answer:
      "Notification records show the contact, incident details, and simulated delivery status. They are records for this academic demo only; no SMS or WhatsApp message is sent."
  },
  {
    question: "Where can I view incident history?",
    answer:
      "Open Incident History from the navigation to view incidents recorded for your account, including their status and any location recorded with them."
  },
  {
    question: "How do Safe Zones work?",
    answer:
      "Save a location and radius under Safe Zones. On Live Location, allow GPS access and start monitoring to record demo entry or exit events while the page is open."
  },
  {
    question: "Why does SHIELDHER need location permission?",
    answer:
      "Location permission lets the browser provide coordinates for location features. You can deny or revoke permission in your browser settings; location may require HTTPS outside localhost."
  },
  {
    question: "How do I sign out?",
    answer:
      "Choose Settings and use Sign Out, or use Sign Out in the sidebar. Sign out after using SHIELDHER on a shared device."
  }
];

function HelpSupportPage() {
  return (
    <div className="help-page">
      <div className="workspace-page-intro">
        <span className="section-kicker">HELP &amp; SAFETY INFORMATION</span>
        <p>Understand the demo features and how to use them responsibly.</p>
      </div>

      <section className="help-emergency-card">
        <div className="help-emergency-icon">
          <AlertTriangle size={22} />
        </div>
        <div>
          <span className="section-kicker">EMERGENCY GUIDANCE</span>
          <h3>This academic demo cannot guarantee emergency response.</h3>
          <p>
            The SOS flow records a demo incident and may create simulated
            notification records. It does not contact emergency services, and
            no real SMS or WhatsApp message is sent. In an actual emergency,
            contact the appropriate local emergency service directly.
          </p>
        </div>
      </section>

      <section className="help-section">
        <div className="help-section-heading">
          <div className="help-section-icon">
            <ShieldCheck size={19} />
          </div>
          <div>
            <h3>Frequently Asked Questions</h3>
            <p>Answers about SHIELDHER's current demo features.</p>
          </div>
        </div>
        <div className="faq-list">
          {faqs.map(({ question, answer }) => (
            <details className="faq-item" key={question}>
              <summary>{question}</summary>
              <p>{answer}</p>
            </details>
          ))}
        </div>
      </section>

      <div className="help-card-grid">
        <section className="help-info-card">
          <div className="help-section-heading">
            <div className="help-section-icon">
              <LocateFixed size={19} />
            </div>
            <h3>Safety &amp; Privacy</h3>
          </div>
          <ul>
            <li>SHIELDHER is a safety-support demo, not a replacement for emergency services.</li>
            <li>Only grant location access when you want to use location features.</li>
            <li>Keep account credentials private and sign out on shared devices.</li>
            <li>Check simulated statuses carefully; they do not confirm message delivery.</li>
          </ul>
        </section>

        <section className="help-info-card">
          <div className="help-section-heading">
            <div className="help-section-icon">
              <Users size={19} />
            </div>
            <h3>Contact Support</h3>
          </div>
          <p>
            No support phone number, email address, or support URL is configured
            in this project.
          </p>
          <p className="help-support-note">
            For an actual emergency, contact the appropriate local emergency
            service.
          </p>
        </section>
      </div>

      <p className="help-demo-footer">
        <Bell size={15} />
        Demo notifications only
        <span aria-hidden="true">·</span>
        <MapPin size={15} />
        Location requires browser permission
        <span aria-hidden="true">·</span>
        <Clock3 size={15} />
        Sign out when finished
      </p>
    </div>
  );
}

export default HelpSupportPage;
