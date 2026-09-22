import { LegalPageLayout } from "~/components/LegalPageLayout";

export default function PrivacyPage() {
  return (
    <LegalPageLayout
      title="Privacy Policy"
      description="This Privacy Policy explains how Forest Forms collects, uses, stores, and protects information when you use our services."
    >
      <h2>1. Introduction</h2>

      <p>
        Forest Forms respects your privacy and is committed to handling personal information
        responsibly. This Privacy Policy explains what information may be collected when you use
        Forest Forms and how that information may be used.
      </p>

      <h2>2. Information We May Collect</h2>

      <p>Depending on how you use Forest Forms, we may collect:</p>

      <ul>
        <li>Name and account information.</li>
        <li>Email address and authentication information.</li>
        <li>Forms and content created by you.</li>
        <li>Responses submitted through your forms.</li>
        <li>Usage and interaction information.</li>
        <li>Device, browser, and technical information.</li>
        <li>Information required to provide customer support.</li>
        <li>Subscription and transaction-related information.</li>
      </ul>

      <h2>3. Form Responses</h2>

      <p>
        If you create a form, information submitted by respondents may be processed and stored by
        Forest Forms to provide the form and response management functionality.
      </p>

      <p>
        As a form creator, you are responsible for determining what information you request from
        respondents and ensuring that your collection and use of that information complies with
        applicable laws.
      </p>

      <h2>4. How We Use Information</h2>

      <p>Information may be used to:</p>

      <ul>
        <li>Create and maintain user accounts.</li>
        <li>Provide and operate Forest Forms.</li>
        <li>Store and manage forms and responses.</li>
        <li>Process subscriptions and payments.</li>
        <li>Provide customer support.</li>
        <li>Improve reliability, security, and functionality.</li>
        <li>Prevent fraud, abuse, and unauthorized activity.</li>
        <li>Provide AI-assisted features requested by users.</li>
      </ul>

      <h2>5. AI Features</h2>

      <p>
        When you use AI-assisted features, information necessary to provide the requested AI
        functionality may be processed by the AI infrastructure used by Forest Forms.
      </p>

      <p>
        You should avoid submitting sensitive personal information into AI prompts unless the
        relevant feature explicitly requires it and you have the appropriate rights and permissions
        to process that information.
      </p>

      <h2>6. Payments</h2>

      <p>
        Forest Forms may use third-party payment providers such as Razorpay to process payments.
        Payment information is handled according to the payment provider's applicable policies and
        security practices.
      </p>

      <p>
        Forest Forms does not intentionally store complete payment-card credentials such as full
        card numbers or CVV information.
      </p>

      <h2>7. Service Providers</h2>

      <p>
        We may use third-party service providers for hosting, databases, authentication, payments,
        AI processing, analytics, communications, and other infrastructure necessary to operate
        Forest Forms.
      </p>

      <h2>8. Security</h2>

      <p>
        We use reasonable technical and organizational measures designed to protect information
        against unauthorized access, alteration, misuse, or disclosure. However, no internet-based
        system can be guaranteed to be completely secure.
      </p>

      <h2>9. Data Retention</h2>

      <p>
        Information may be retained for as long as necessary to provide the service, maintain
        account functionality, comply with legal obligations, resolve disputes, enforce agreements,
        and maintain legitimate business records.
      </p>

      <h2>10. Your Choices</h2>

      <p>
        Depending on the applicable law and the nature of the information, you may have rights
        concerning access, correction, deletion, or other processing of your personal information.
      </p>

      <p>
        To make a privacy-related request, please contact Forest Forms using the information on our{" "}
        <a href="/contact">Contact Us</a> page.
      </p>

      <h2>11. Cookies and Similar Technologies</h2>

      <p>
        Forest Forms may use cookies or similar technologies where necessary for authentication,
        preferences, security, analytics, and application functionality.
      </p>

      <h2>12. Children's Privacy</h2>

      <p>
        Forest Forms is not intended to be used by children in circumstances where applicable law
        requires parental consent. Users must comply with applicable age and consent requirements
        when collecting information from respondents.
      </p>

      <h2>13. Changes to this Policy</h2>

      <p>
        This Privacy Policy may be updated from time to time. The latest version will be published
        on this page with the applicable updated date.
      </p>

      <h2>14. Contact</h2>

      <p>
        For privacy questions or requests, please visit our <a href="/contact">Contact Us</a> page.
      </p>
    </LegalPageLayout>
  );
}
