import React from 'react';
import '../styles/pages/LegalPages.scss';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="legal-page">
      <div className="legal-container">
        {/* Header */}
        <header className="legal-header">
          <div className="legal-header-content">
            <h1 className="legal-title">Privacy Policy</h1>
            <p className="legal-subtitle">
              Your privacy is important to us. This policy outlines how we collect, use, and protect your personal information.
            </p>
            <p className="legal-update">Last Updated: October 19, 2025</p>
          </div>
        </header>

        {/* Content */}
        <div className="legal-content">
          {/* Introduction */}
          <section className="legal-section">
            <h2 className="section-title">1. Introduction</h2>
            <p className="section-text">
              Welcome to STELLARION ("we," "our," or "us"). We are committed to protecting your privacy and ensuring 
              the security of your personal information. This Privacy Policy explains how we collect, use, disclose, 
              and safeguard your information when you use our astronomy education platform.
            </p>
            <p className="section-text">
              By accessing or using STELLARION, you agree to the terms of this Privacy Policy. If you do not agree 
              with the terms, please do not access or use our services.
            </p>
          </section>

          {/* Information We Collect */}
          <section className="legal-section">
            <h2 className="section-title">2. Information We Collect</h2>
            
            <h3 className="subsection-title">2.1 Personal Information</h3>
            <p className="section-text">We collect the following types of personal information:</p>
            <ul className="legal-list">
              <li><strong>Account Information:</strong> Name, email address, username, password, profile picture, and date of birth</li>
              <li><strong>Profile Data:</strong> Bio, interests, educational background, and astronomy expertise level</li>
              <li><strong>Contact Information:</strong> Phone number, mailing address (for guides and service providers)</li>
              <li><strong>Payment Information:</strong> Credit card details, billing address (processed securely through third-party payment processors)</li>
              <li><strong>Identity Verification:</strong> Government-issued ID for guides, mentors, and moderators</li>
            </ul>

            <h3 className="subsection-title">2.2 Usage Information</h3>
            <ul className="legal-list">
              <li>Learning progress, session attendance, and course completion data</li>
              <li>Content interactions (blogs read, videos watched, quizzes completed)</li>
              <li>User-generated content (posts, comments, reviews, poll responses)</li>
              <li>Search queries and navigation patterns</li>
              <li>Device information (IP address, browser type, operating system)</li>
              <li>Location data (for stargazing spot recommendations and local events)</li>
            </ul>

            <h3 className="subsection-title">2.3 Communication Data</h3>
            <ul className="legal-list">
              <li>Messages exchanged with mentors, guides, and other users</li>
              <li>Customer support communications</li>
              <li>Email preferences and notification settings</li>
            </ul>

            <h3 className="subsection-title">2.4 Automatically Collected Information</h3>
            <ul className="legal-list">
              <li>Cookies and similar tracking technologies</li>
              <li>Log files and analytics data</li>
              <li>Session recordings for quality assurance</li>
            </ul>
          </section>

          {/* How We Use Your Information */}
          <section className="legal-section">
            <h2 className="section-title">3. How We Use Your Information</h2>
            <p className="section-text">We use your information for the following purposes:</p>
            
            <h3 className="subsection-title">3.1 Service Delivery</h3>
            <ul className="legal-list">
              <li>Create and manage your user account</li>
              <li>Provide personalized learning experiences and recommendations</li>
              <li>Facilitate bookings for astronomy sessions, tours, and events</li>
              <li>Enable communication between users (learners, mentors, guides)</li>
              <li>Process payments and manage subscriptions</li>
            </ul>

            <h3 className="subsection-title">3.2 Platform Improvement</h3>
            <ul className="legal-list">
              <li>Analyze user behavior to improve features and content</li>
              <li>Conduct research and development for new services</li>
              <li>Perform testing and quality assurance</li>
              <li>Generate aggregated, anonymized statistics</li>
            </ul>

            <h3 className="subsection-title">3.3 Communication</h3>
            <ul className="legal-list">
              <li>Send transactional emails (booking confirmations, payment receipts)</li>
              <li>Provide customer support and respond to inquiries</li>
              <li>Send educational content, newsletters, and promotional materials (with consent)</li>
              <li>Notify you of platform updates, policy changes, and security alerts</li>
            </ul>

            <h3 className="subsection-title">3.4 Safety and Security</h3>
            <ul className="legal-list">
              <li>Verify user identities (especially for guides and mentors)</li>
              <li>Detect and prevent fraud, spam, and abuse</li>
              <li>Enforce our Terms & Conditions and community guidelines</li>
              <li>Comply with legal obligations and protect user rights</li>
            </ul>
          </section>

          {/* Information Sharing */}
          <section className="legal-section">
            <h2 className="section-title">4. How We Share Your Information</h2>
            <p className="section-text">We do not sell your personal information. We share your data only in the following circumstances:</p>
            
            <h3 className="subsection-title">4.1 With Other Users</h3>
            <ul className="legal-list">
              <li>Your public profile information (name, photo, bio) is visible to other users</li>
              <li>Mentors and guides can see relevant learner information for service delivery</li>
              <li>User-generated content (posts, comments, reviews) is publicly visible</li>
            </ul>

            <h3 className="subsection-title">4.2 With Service Providers</h3>
            <ul className="legal-list">
              <li>Payment processors (Stripe, PayPal) for transaction handling</li>
              <li>Cloud hosting services (AWS, Google Cloud) for data storage</li>
              <li>Email service providers for communication</li>
              <li>Analytics providers (Google Analytics) for platform insights</li>
            </ul>

            <h3 className="subsection-title">4.3 For Legal Compliance</h3>
            <ul className="legal-list">
              <li>Law enforcement or government authorities when required by law</li>
              <li>Legal proceedings, court orders, or subpoenas</li>
              <li>Protection of our rights, property, or safety</li>
              <li>Prevention of fraud or illegal activities</li>
            </ul>

            <h3 className="subsection-title">4.4 Business Transfers</h3>
            <p className="section-text">
              In the event of a merger, acquisition, or sale of assets, your information may be transferred 
              to the acquiring entity. We will notify you of any such change.
            </p>
          </section>

          {/* Data Security */}
          <section className="legal-section">
            <h2 className="section-title">5. Data Security</h2>
            <p className="section-text">We implement industry-standard security measures to protect your information:</p>
            <ul className="legal-list">
              <li><strong>Encryption:</strong> All data transmitted between your device and our servers is encrypted using SSL/TLS</li>
              <li><strong>Secure Storage:</strong> Personal data is stored in encrypted databases with restricted access</li>
              <li><strong>Access Controls:</strong> Only authorized personnel can access personal information</li>
              <li><strong>Regular Audits:</strong> We conduct security assessments and vulnerability testing</li>
              <li><strong>Incident Response:</strong> We have procedures in place to respond to data breaches</li>
            </ul>
            <p className="section-text highlight-box">
              <strong>Important:</strong> While we strive to protect your data, no method of transmission over the internet 
              is 100% secure. Use strong passwords and enable two-factor authentication for added security.
            </p>
          </section>

          {/* Your Rights */}
          <section className="legal-section">
            <h2 className="section-title">6. Your Rights and Choices</h2>
            <p className="section-text">You have the following rights regarding your personal information:</p>
            
            <h3 className="subsection-title">6.1 Access and Portability</h3>
            <ul className="legal-list">
              <li>Request a copy of your personal data in a machine-readable format</li>
              <li>Download your learning history, posts, and other user-generated content</li>
            </ul>

            <h3 className="subsection-title">6.2 Correction and Update</h3>
            <ul className="legal-list">
              <li>Edit your profile information at any time through account settings</li>
              <li>Request correction of inaccurate or incomplete data</li>
            </ul>

            <h3 className="subsection-title">6.3 Deletion</h3>
            <ul className="legal-list">
              <li>Delete your account and associated data (subject to legal retention requirements)</li>
              <li>Request removal of specific content you've posted</li>
              <li>Note: Some data may be retained for legal, security, or operational purposes</li>
            </ul>

            <h3 className="subsection-title">6.4 Consent Withdrawal</h3>
            <ul className="legal-list">
              <li>Opt out of marketing emails (unsubscribe link provided in all promotional emails)</li>
              <li>Disable non-essential cookies through browser settings</li>
              <li>Adjust notification preferences in account settings</li>
            </ul>

            <h3 className="subsection-title">6.5 Objection and Restriction</h3>
            <ul className="legal-list">
              <li>Object to certain data processing activities</li>
              <li>Request limitation of how your data is used</li>
            </ul>

            <p className="section-text">
              To exercise these rights, please contact us at <a href="mailto:privacy@stellarion.com">privacy@stellarion.com</a>
            </p>
          </section>

          {/* Cookies and Tracking */}
          <section className="legal-section">
            <h2 className="section-title">7. Cookies and Tracking Technologies</h2>
            <p className="section-text">We use cookies and similar technologies to enhance your experience:</p>
            
            <h3 className="subsection-title">7.1 Types of Cookies</h3>
            <ul className="legal-list">
              <li><strong>Essential Cookies:</strong> Required for platform functionality (login, session management)</li>
              <li><strong>Performance Cookies:</strong> Help us understand how users interact with the platform</li>
              <li><strong>Functional Cookies:</strong> Remember your preferences and settings</li>
              <li><strong>Advertising Cookies:</strong> Deliver relevant ads (with your consent)</li>
            </ul>

            <h3 className="subsection-title">7.2 Managing Cookies</h3>
            <p className="section-text">
              You can control cookies through your browser settings. Note that disabling certain cookies may 
              limit platform functionality.
            </p>
          </section>

          {/* Children's Privacy */}
          <section className="legal-section">
            <h2 className="section-title">8. Children's Privacy</h2>
            <p className="section-text">
              STELLARION is designed for users aged 13 and above. We do not knowingly collect personal information 
              from children under 13 without parental consent. If you believe a child has provided us with personal 
              information, please contact us immediately at <a href="mailto:privacy@stellarion.com">privacy@stellarion.com</a>.
            </p>
            <p className="section-text">
              For users aged 13-17, we encourage parental involvement in their learning journey. Parents can monitor 
              account activity and communication with mentors.
            </p>
          </section>

          {/* International Transfers */}
          <section className="legal-section">
            <h2 className="section-title">9. International Data Transfers</h2>
            <p className="section-text">
              STELLARION operates globally. Your information may be transferred to and stored in countries outside 
              your jurisdiction, including countries that may not have the same data protection laws. We ensure 
              appropriate safeguards are in place, such as:
            </p>
            <ul className="legal-list">
              <li>Standard contractual clauses approved by regulatory authorities</li>
              <li>Privacy Shield certification (where applicable)</li>
              <li>Adequacy decisions recognizing equivalent protection levels</li>
            </ul>
          </section>

          {/* Data Retention */}
          <section className="legal-section">
            <h2 className="section-title">10. Data Retention</h2>
            <p className="section-text">We retain your personal information for as long as necessary to:</p>
            <ul className="legal-list">
              <li>Provide services and maintain your account</li>
              <li>Comply with legal obligations (tax records, transaction history)</li>
              <li>Resolve disputes and enforce agreements</li>
              <li>Prevent fraud and abuse</li>
            </ul>
            <p className="section-text">
              When you delete your account, we will remove or anonymize your data within 90 days, except for 
              information we must retain for legal or security reasons.
            </p>
          </section>

          {/* Third-Party Links */}
          <section className="legal-section">
            <h2 className="section-title">11. Third-Party Links and Services</h2>
            <p className="section-text">
              STELLARION may contain links to third-party websites, services, or APIs (e.g., NASA data, weather services). 
              We are not responsible for the privacy practices of these third parties. We encourage you to review their 
              privacy policies before providing any personal information.
            </p>
          </section>

          {/* Changes to Policy */}
          <section className="legal-section">
            <h2 className="section-title">12. Changes to This Privacy Policy</h2>
            <p className="section-text">
              We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. 
              When we make significant changes, we will:
            </p>
            <ul className="legal-list">
              <li>Update the "Last Updated" date at the top of this policy</li>
              <li>Notify you via email or platform notification</li>
              <li>Request your consent if required by law</li>
            </ul>
            <p className="section-text">
              Your continued use of STELLARION after changes indicates your acceptance of the updated policy.
            </p>
          </section>

          {/* Contact Information */}
          <section className="legal-section">
            <h2 className="section-title">13. Contact Us</h2>
            <p className="section-text">
              If you have questions, concerns, or requests regarding this Privacy Policy or our data practices, 
              please contact us:
            </p>
            <div className="contact-info">
              <p><strong>Email:</strong> <a href="mailto:privacy@stellarion.com">privacy@stellarion.com</a></p>
              <p><strong>Support:</strong> <a href="mailto:support@stellarion.com">support@stellarion.com</a></p>
              <p><strong>Data Protection Officer:</strong> <a href="mailto:dpo@stellarion.com">dpo@stellarion.com</a></p>
              <p><strong>Address:</strong> STELLARION Privacy Team, [Your Address]</p>
            </div>
          </section>

          {/* GDPR & CCPA Compliance */}
          <section className="legal-section">
            <h2 className="section-title">14. Additional Rights for EU and California Residents</h2>
            
            <h3 className="subsection-title">14.1 GDPR Rights (EU Residents)</h3>
            <p className="section-text">Under the General Data Protection Regulation (GDPR), you have additional rights:</p>
            <ul className="legal-list">
              <li>Right to lodge a complaint with a supervisory authority</li>
              <li>Right to object to automated decision-making and profiling</li>
              <li>Right to data portability in commonly used formats</li>
            </ul>

            <h3 className="subsection-title">14.2 CCPA Rights (California Residents)</h3>
            <p className="section-text">Under the California Consumer Privacy Act (CCPA), you have the right to:</p>
            <ul className="legal-list">
              <li>Know what personal information we collect, use, and share</li>
              <li>Delete your personal information (with certain exceptions)</li>
              <li>Opt out of the sale of personal information (we do not sell personal data)</li>
              <li>Non-discrimination for exercising your privacy rights</li>
            </ul>
          </section>

          {/* Acknowledgment */}
          <section className="legal-section acknowledgment">
            <p className="section-text">
              By using STELLARION, you acknowledge that you have read, understood, and agree to be bound by this 
              Privacy Policy. Thank you for trusting us with your information as we work together to explore the cosmos!
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
