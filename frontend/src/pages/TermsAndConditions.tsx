import React from 'react';
import '../styles/pages/LegalPages.scss';

const TermsAndConditions: React.FC = () => {
  return (
    <div className="legal-page">
      <div className="legal-container">
        {/* Header */}
        <header className="legal-header">
          <div className="legal-header-content">
            <h1 className="legal-title">Terms & Conditions</h1>
            <p className="legal-subtitle">
              Please read these terms carefully before using STELLARION. By accessing our platform, you agree to be bound by these terms.
            </p>
            <p className="legal-update">Last Updated: October 19, 2025</p>
          </div>
        </header>

        {/* Content */}
        <div className="legal-content">
          {/* Introduction */}
          <section className="legal-section">
            <h2 className="section-title">1. Agreement to Terms</h2>
            <p className="section-text">
              Welcome to STELLARION, an astronomy education platform operated by STELLARION Inc. ("Company," "we," "us," or "our"). 
              These Terms and Conditions ("Terms") govern your access to and use of the STELLARION platform, including our website, 
              mobile applications, and related services (collectively, the "Platform").
            </p>
            <p className="section-text">
              By creating an account, accessing, or using the Platform, you agree to be bound by these Terms and our Privacy Policy. 
              If you do not agree with these Terms, please do not use the Platform.
            </p>
            <p className="section-text highlight-box">
              <strong>Important:</strong> These Terms contain a mandatory arbitration clause and class action waiver (Section 18) 
              that affect your legal rights. Please review carefully.
            </p>
          </section>

          {/* Eligibility */}
          <section className="legal-section">
            <h2 className="section-title">2. Eligibility and Account Registration</h2>
            
            <h3 className="subsection-title">2.1 Age Requirements</h3>
            <ul className="legal-list">
              <li>You must be at least 13 years old to use STELLARION</li>
              <li>Users aged 13-17 require parental consent</li>
              <li>Certain features (paid services, guide applications) require users to be 18 or older</li>
            </ul>

            <h3 className="subsection-title">2.2 Account Creation</h3>
            <p className="section-text">To access certain features, you must create an account by providing:</p>
            <ul className="legal-list">
              <li>Accurate, current, and complete information</li>
              <li>A valid email address</li>
              <li>A secure password</li>
            </ul>

            <h3 className="subsection-title">2.3 Account Security</h3>
            <p className="section-text">You are responsible for:</p>
            <ul className="legal-list">
              <li>Maintaining the confidentiality of your account credentials</li>
              <li>All activities that occur under your account</li>
              <li>Notifying us immediately of any unauthorized access or security breach</li>
              <li>Not sharing your account with others</li>
            </ul>

            <h3 className="subsection-title">2.4 Account Verification</h3>
            <p className="section-text">
              Certain user roles (guides, mentors, moderators) require identity verification through government-issued 
              identification and background checks to ensure community safety.
            </p>
          </section>

          {/* User Roles */}
          <section className="legal-section">
            <h2 className="section-title">3. User Roles and Responsibilities</h2>
            <p className="section-text">STELLARION supports multiple user types, each with specific rights and responsibilities:</p>
            
            <h3 className="subsection-title">3.1 Learners</h3>
            <ul className="legal-list">
              <li>Access educational content, courses, and resources</li>
              <li>Participate in sessions, quizzes, and competitions</li>
              <li>Book astronomy tours and services</li>
              <li>Engage with the community through posts and comments</li>
            </ul>

            <h3 className="subsection-title">3.2 Enthusiasts</h3>
            <ul className="legal-list">
              <li>All learner privileges plus advanced features</li>
              <li>Access to premium content and exclusive events</li>
              <li>Ability to organize stargazing meetups</li>
              <li>Volunteer for community initiatives</li>
            </ul>

            <h3 className="subsection-title">3.3 Influencers</h3>
            <ul className="legal-list">
              <li>Create and publish educational content (blogs, videos, podcasts)</li>
              <li>Host live astronomy sessions</li>
              <li>Create polls and quizzes</li>
              <li>Build a follower base and engage with the community</li>
              <li>Must comply with content guidelines and community standards</li>
            </ul>

            <h3 className="subsection-title">3.4 Guides</h3>
            <ul className="legal-list">
              <li>Offer paid astronomy services (tours, equipment rentals, observations)</li>
              <li>Set pricing and availability</li>
              <li>Must maintain professional conduct and service quality</li>
              <li>Subject to verification and quality reviews</li>
              <li>Responsible for service delivery and safety</li>
            </ul>

            <h3 className="subsection-title">3.5 Mentors</h3>
            <ul className="legal-list">
              <li>Provide one-on-one educational guidance</li>
              <li>Create personalized learning paths</li>
              <li>Review mentee progress and provide feedback</li>
              <li>Must demonstrate expertise in astronomy education</li>
              <li>Subject to background checks and quality monitoring</li>
            </ul>

            <h3 className="subsection-title">3.6 Moderators</h3>
            <ul className="legal-list">
              <li>Review and moderate user-generated content</li>
              <li>Enforce community guidelines</li>
              <li>Handle user reports and disputes</li>
              <li>Must remain impartial and follow moderation policies</li>
            </ul>

            <h3 className="subsection-title">3.7 Admins</h3>
            <ul className="legal-list">
              <li>Manage platform operations and user roles</li>
              <li>Oversee content moderation and quality control</li>
              <li>Handle escalated issues and appeals</li>
            </ul>
          </section>

          {/* Acceptable Use */}
          <section className="legal-section">
            <h2 className="section-title">4. Acceptable Use Policy</h2>
            <p className="section-text">You agree NOT to:</p>
            <ul className="legal-list">
              <li>Violate any laws, regulations, or third-party rights</li>
              <li>Harass, bully, threaten, or harm other users</li>
              <li>Post offensive, discriminatory, or hateful content</li>
              <li>Share false, misleading, or fraudulent information</li>
              <li>Impersonate others or misrepresent your identity</li>
              <li>Spam, advertise, or solicit users without authorization</li>
              <li>Scrape, mine, or extract data from the Platform</li>
              <li>Attempt to hack, disrupt, or compromise platform security</li>
              <li>Upload viruses, malware, or harmful code</li>
              <li>Use automated tools (bots, scripts) without permission</li>
              <li>Share copyrighted material without proper authorization</li>
              <li>Engage in activities that could harm the Platform or other users</li>
            </ul>
          </section>

          {/* Content Ownership */}
          <section className="legal-section">
            <h2 className="section-title">5. Content and Intellectual Property</h2>
            
            <h3 className="subsection-title">5.1 Your Content</h3>
            <p className="section-text">You retain ownership of content you create and post on STELLARION. However, by posting content, you grant us:</p>
            <ul className="legal-list">
              <li>A worldwide, non-exclusive, royalty-free license to use, reproduce, modify, and distribute your content</li>
              <li>The right to display your content on the Platform and promotional materials</li>
              <li>Permission to sublicense your content to other users (e.g., for educational purposes)</li>
            </ul>

            <h3 className="subsection-title">5.2 Content Standards</h3>
            <p className="section-text">All user-generated content must:</p>
            <ul className="legal-list">
              <li>Be accurate, informative, and relevant to astronomy education</li>
              <li>Respect intellectual property rights (provide citations and sources)</li>
              <li>Not contain plagiarized or unauthorized copyrighted material</li>
              <li>Comply with community guidelines and content policies</li>
            </ul>

            <h3 className="subsection-title">5.3 Our Content</h3>
            <p className="section-text">
              All Platform content created by STELLARION, including but not limited to text, graphics, logos, software, 
              and course materials, is owned by or licensed to us and protected by copyright, trademark, and other 
              intellectual property laws.
            </p>

            <h3 className="subsection-title">5.4 Copyright Infringement</h3>
            <p className="section-text">
              We respect intellectual property rights. If you believe your copyright has been infringed, contact us at 
              <a href="mailto:copyright@stellarion.com"> copyright@stellarion.com</a> with:
            </p>
            <ul className="legal-list">
              <li>Description of the copyrighted work</li>
              <li>Location of the infringing content on our Platform</li>
              <li>Your contact information and signature</li>
            </ul>
          </section>

          {/* Services and Payments */}
          <section className="legal-section">
            <h2 className="section-title">6. Services and Payments</h2>
            
            <h3 className="subsection-title">6.1 Subscription Plans</h3>
            <p className="section-text">STELLARION offers various subscription tiers:</p>
            <ul className="legal-list">
              <li><strong>Free Tier:</strong> Basic access to educational content</li>
              <li><strong>Premium Tier:</strong> Advanced features, exclusive content, and priority support</li>
              <li><strong>Professional Tier:</strong> Full access for guides, mentors, and influencers</li>
            </ul>

            <h3 className="subsection-title">6.2 Payment Terms</h3>
            <ul className="legal-list">
              <li>Subscriptions are billed monthly or annually</li>
              <li>Payments are processed securely through third-party processors (Stripe, PayPal)</li>
              <li>All fees are non-refundable unless otherwise stated</li>
              <li>We reserve the right to change pricing with 30 days' notice</li>
            </ul>

            <h3 className="subsection-title">6.3 Booking Services</h3>
            <p className="section-text">When booking services from guides:</p>
            <ul className="legal-list">
              <li>Payment is required at the time of booking</li>
              <li>Cancellation policies are set by individual service providers</li>
              <li>STELLARION acts as a facilitator and is not liable for service quality</li>
              <li>Disputes should be resolved directly with the service provider</li>
            </ul>

            <h3 className="subsection-title">6.4 Refund Policy</h3>
            <ul className="legal-list">
              <li>Subscription refunds are available within 7 days of purchase (first-time subscribers only)</li>
              <li>Service bookings follow provider-specific refund policies</li>
              <li>Refund requests must be submitted to <a href="mailto:billing@stellarion.com">billing@stellarion.com</a></li>
            </ul>

            <h3 className="subsection-title">6.5 Service Provider Commissions</h3>
            <p className="section-text">
              STELLARION charges a commission fee (typically 15-20%) on services booked through the Platform. 
              Commission rates are outlined in separate service provider agreements.
            </p>
          </section>

          {/* Platform Rules */}
          <section className="legal-section">
            <h2 className="section-title">7. Platform Features and Rules</h2>
            
            <h3 className="subsection-title">7.1 Educational Content</h3>
            <ul className="legal-list">
              <li>Content must be scientifically accurate and evidence-based</li>
              <li>Misleading or pseudoscientific content is prohibited</li>
              <li>Proper attribution and citations are required</li>
            </ul>

            <h3 className="subsection-title">7.2 Community Interactions</h3>
            <ul className="legal-list">
              <li>Respect diverse opinions and perspectives</li>
              <li>Engage in constructive discussions</li>
              <li>Report inappropriate behavior to moderators</li>
              <li>Do not engage in personal attacks or harassment</li>
            </ul>

            <h3 className="subsection-title">7.3 Competitions and Events</h3>
            <ul className="legal-list">
              <li>Follow competition rules and guidelines</li>
              <li>Do not cheat, manipulate results, or create fake accounts</li>
              <li>Prizes are awarded at our discretion and are non-transferable</li>
            </ul>

            <h3 className="subsection-title">7.4 Messaging and Communication</h3>
            <ul className="legal-list">
              <li>Use messaging features for educational and professional purposes only</li>
              <li>Do not share personal contact information publicly</li>
              <li>Report suspicious or inappropriate messages</li>
            </ul>
          </section>

          {/* Moderation */}
          <section className="legal-section">
            <h2 className="section-title">8. Content Moderation and Enforcement</h2>
            <p className="section-text">We reserve the right to:</p>
            <ul className="legal-list">
              <li>Review, monitor, and moderate user-generated content</li>
              <li>Remove content that violates these Terms or community guidelines</li>
              <li>Suspend or terminate accounts for violations</li>
              <li>Issue warnings, temporary bans, or permanent bans</li>
              <li>Limit access to certain features for repeat offenders</li>
            </ul>

            <h3 className="subsection-title">8.1 Reporting Violations</h3>
            <p className="section-text">Users can report violations through:</p>
            <ul className="legal-list">
              <li>In-app reporting tools on content and profiles</li>
              <li>Email to <a href="mailto:moderation@stellarion.com">moderation@stellarion.com</a></li>
            </ul>

            <h3 className="subsection-title">8.2 Appeals Process</h3>
            <p className="section-text">
              If your content is removed or account is suspended, you may appeal by contacting 
              <a href="mailto:appeals@stellarion.com"> appeals@stellarion.com</a> within 30 days.
            </p>
          </section>

          {/* Privacy */}
          <section className="legal-section">
            <h2 className="section-title">9. Privacy and Data Protection</h2>
            <p className="section-text">
              Your use of STELLARION is also governed by our Privacy Policy. By using the Platform, you consent to 
              our collection, use, and disclosure of your information as described in the Privacy Policy.
            </p>
            <p className="section-text">
              Key points include:
            </p>
            <ul className="legal-list">
              <li>We collect personal, usage, and communication data</li>
              <li>Data is used to provide services and improve the Platform</li>
              <li>We implement security measures to protect your information</li>
              <li>You have rights to access, correct, and delete your data</li>
            </ul>
            <p className="section-text">
              Read our full <a href="/privacy-policy">Privacy Policy</a> for complete details.
            </p>
          </section>

          {/* Third-Party Services */}
          <section className="legal-section">
            <h2 className="section-title">10. Third-Party Services and Links</h2>
            <p className="section-text">
              STELLARION integrates with third-party services (payment processors, analytics, mapping services). 
              We are not responsible for:
            </p>
            <ul className="legal-list">
              <li>The availability, accuracy, or security of third-party services</li>
              <li>Third-party terms of service or privacy policies</li>
              <li>Issues arising from third-party service failures</li>
            </ul>
            <p className="section-text">
              External links to websites or resources are provided for convenience. We do not endorse or assume 
              responsibility for their content.
            </p>
          </section>

          {/* Disclaimers */}
          <section className="legal-section">
            <h2 className="section-title">11. Disclaimers and Warranties</h2>
            <p className="section-text highlight-box">
              <strong>THE PLATFORM IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, 
              EITHER EXPRESS OR IMPLIED.</strong>
            </p>
            <p className="section-text">We disclaim all warranties, including but not limited to:</p>
            <ul className="legal-list">
              <li><strong>Accuracy:</strong> We do not guarantee the accuracy, completeness, or reliability of Platform content</li>
              <li><strong>Availability:</strong> Platform may be unavailable due to maintenance, outages, or technical issues</li>
              <li><strong>Service Quality:</strong> We do not guarantee the quality of services provided by guides or mentors</li>
              <li><strong>User Conduct:</strong> We are not responsible for the actions or behavior of other users</li>
              <li><strong>Educational Outcomes:</strong> We do not guarantee specific learning outcomes or results</li>
            </ul>
          </section>

          {/* Limitation of Liability */}
          <section className="legal-section">
            <h2 className="section-title">12. Limitation of Liability</h2>
            <p className="section-text highlight-box">
              <strong>TO THE MAXIMUM EXTENT PERMITTED BY LAW, STELLARION AND ITS AFFILIATES, DIRECTORS, 
              EMPLOYEES, AND AGENTS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, 
              OR PUNITIVE DAMAGES ARISING FROM YOUR USE OF THE PLATFORM.</strong>
            </p>
            <p className="section-text">This includes, but is not limited to:</p>
            <ul className="legal-list">
              <li>Loss of data, profits, or business opportunities</li>
              <li>Service interruptions or technical failures</li>
              <li>Errors, bugs, or security vulnerabilities</li>
              <li>User disputes or interactions with other users</li>
              <li>Third-party service failures</li>
            </ul>
            <p className="section-text">
              <strong>Our total liability shall not exceed the amount you paid to STELLARION in the 12 months 
              preceding the claim, or $100, whichever is greater.</strong>
            </p>
          </section>

          {/* Indemnification */}
          <section className="legal-section">
            <h2 className="section-title">13. Indemnification</h2>
            <p className="section-text">
              You agree to indemnify, defend, and hold harmless STELLARION and its affiliates from any claims, 
              liabilities, damages, losses, and expenses (including legal fees) arising from:
            </p>
            <ul className="legal-list">
              <li>Your use of the Platform</li>
              <li>Your violation of these Terms</li>
              <li>Your content or conduct on the Platform</li>
              <li>Your infringement of any third-party rights</li>
              <li>Services you provide as a guide or mentor</li>
            </ul>
          </section>

          {/* Account Termination */}
          <section className="legal-section">
            <h2 className="section-title">14. Account Termination</h2>
            
            <h3 className="subsection-title">14.1 Termination by You</h3>
            <p className="section-text">You may delete your account at any time through account settings or by contacting support.</p>

            <h3 className="subsection-title">14.2 Termination by Us</h3>
            <p className="section-text">We may suspend or terminate your account if:</p>
            <ul className="legal-list">
              <li>You violate these Terms or community guidelines</li>
              <li>You engage in fraudulent or illegal activities</li>
              <li>Your account has been inactive for an extended period</li>
              <li>We discontinue the Platform or certain features</li>
            </ul>

            <h3 className="subsection-title">14.3 Effects of Termination</h3>
            <ul className="legal-list">
              <li>You lose access to your account and associated data</li>
              <li>Subscription fees are non-refundable</li>
              <li>Content you posted may remain on the Platform (for legal or operational reasons)</li>
              <li>Certain provisions (indemnification, liability limitations) survive termination</li>
            </ul>
          </section>

          {/* Changes to Terms */}
          <section className="legal-section">
            <h2 className="section-title">15. Changes to Terms</h2>
            <p className="section-text">
              We reserve the right to modify these Terms at any time. When we make significant changes, we will:
            </p>
            <ul className="legal-list">
              <li>Update the "Last Updated" date</li>
              <li>Notify you via email or platform notification</li>
              <li>Provide a reasonable notice period before changes take effect</li>
            </ul>
            <p className="section-text">
              Your continued use of the Platform after changes constitutes acceptance of the updated Terms. 
              If you do not agree, you must stop using the Platform.
            </p>
          </section>

          {/* Governing Law */}
          <section className="legal-section">
            <h2 className="section-title">16. Governing Law and Jurisdiction</h2>
            <p className="section-text">
              These Terms are governed by the laws of [Your Jurisdiction], without regard to conflict of law principles. 
              Any disputes arising from these Terms or your use of the Platform shall be subject to the exclusive 
              jurisdiction of the courts located in [Your Location].
            </p>
          </section>

          {/* Dispute Resolution */}
          <section className="legal-section">
            <h2 className="section-title">17. Dispute Resolution</h2>
            
            <h3 className="subsection-title">17.1 Informal Resolution</h3>
            <p className="section-text">
              Before initiating formal dispute resolution, please contact us at 
              <a href="mailto:disputes@stellarion.com"> disputes@stellarion.com</a> to resolve the issue informally.
            </p>

            <h3 className="subsection-title">17.2 Arbitration Agreement</h3>
            <p className="section-text">
              If informal resolution fails, disputes shall be resolved through binding arbitration in accordance with 
              [Arbitration Rules]. Each party bears its own costs, and the arbitrator's decision is final.
            </p>

            <h3 className="subsection-title">17.3 Class Action Waiver</h3>
            <p className="section-text highlight-box">
              <strong>YOU AGREE THAT DISPUTES SHALL BE RESOLVED ON AN INDIVIDUAL BASIS ONLY. YOU WAIVE YOUR RIGHT 
              TO PARTICIPATE IN CLASS ACTIONS, CLASS ARBITRATIONS, OR REPRESENTATIVE PROCEEDINGS.</strong>
            </p>

            <h3 className="subsection-title">17.4 Exceptions</h3>
            <p className="section-text">
              Either party may seek injunctive relief in court for intellectual property infringement or unauthorized 
              use of the Platform.
            </p>
          </section>

          {/* General Provisions */}
          <section className="legal-section">
            <h2 className="section-title">18. General Provisions</h2>
            
            <h3 className="subsection-title">18.1 Entire Agreement</h3>
            <p className="section-text">
              These Terms, together with our Privacy Policy, constitute the entire agreement between you and STELLARION.
            </p>

            <h3 className="subsection-title">18.2 Severability</h3>
            <p className="section-text">
              If any provision is found to be invalid or unenforceable, the remaining provisions remain in full effect.
            </p>

            <h3 className="subsection-title">18.3 No Waiver</h3>
            <p className="section-text">
              Our failure to enforce any right or provision does not constitute a waiver of that right.
            </p>

            <h3 className="subsection-title">18.4 Assignment</h3>
            <p className="section-text">
              You may not assign or transfer these Terms without our written consent. We may assign our rights and 
              obligations to any third party.
            </p>

            <h3 className="subsection-title">18.5 Force Majeure</h3>
            <p className="section-text">
              We are not liable for failures or delays caused by events beyond our reasonable control (natural disasters, 
              pandemics, government actions, etc.).
            </p>
          </section>

          {/* Contact Information */}
          <section className="legal-section">
            <h2 className="section-title">19. Contact Us</h2>
            <p className="section-text">
              If you have questions or concerns about these Terms, please contact us:
            </p>
            <div className="contact-info">
              <p><strong>Email:</strong> <a href="mailto:legal@stellarion.com">legal@stellarion.com</a></p>
              <p><strong>Support:</strong> <a href="mailto:support@stellarion.com">support@stellarion.com</a></p>
              <p><strong>Address:</strong> STELLARION Legal Team, [Your Address]</p>
            </div>
          </section>

          {/* Acknowledgment */}
          <section className="legal-section acknowledgment">
            <p className="section-text">
              By using STELLARION, you acknowledge that you have read, understood, and agree to be bound by these 
              Terms and Conditions. Thank you for being part of our astronomy education community!
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
