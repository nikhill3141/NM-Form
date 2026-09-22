import { LegalPageLayout } from "~/components/LegalPageLayout";


export default function AboutPage() {
  return (
    <LegalPageLayout
      title="About Forest Forms"
      description="Forest Forms is a full-stack form-building platform designed to help people create engaging, customizable, and shareable forms with an immersive visual experience."
    >
      <h2>What is Forest Forms?</h2>

      <p>
        Forest Forms is a form-building SaaS platform that helps individuals, creators, teams, and
        organizations create and publish online forms. The platform combines a simple form-building
        workflow with immersive themes and AI-assisted form creation.
      </p>

      <h2>Build forms from an idea</h2>

      <p>
        Forest Forms includes AI-assisted form generation that can turn a natural-language
        description into a structured form proposal. Users can review the generated proposal and
        continue editing the form using the Forest Forms builder.
      </p>

      <p>
        AI-generated content is provided as an assistance feature. Users remain responsible for
        reviewing and deciding what content is ultimately used in their forms.
      </p>

      <h2>Forms with personality</h2>

      <p>
        Forest Forms provides a collection of visual themes designed to make forms more engaging
        than traditional static questionnaires. Depending on the plan available to the user,
        different themes and customization capabilities may be available.
      </p>

      <h2>What you can do</h2>

      <ul>
        <li>Create and customize online forms.</li>
        <li>Add different types of questions and fields.</li>
        <li>Publish forms using shareable links.</li>
        <li>Collect and manage form responses.</li>
        <li>Use AI-assisted form generation.</li>
        <li>Use available themes and customization features.</li>
      </ul>

      <h2>Our approach</h2>

      <p>
        Forest Forms is built around a simple idea: forms should not only collect information, they
        should also provide a clear and engaging experience for the people filling them out.
      </p>

      <h2>Contact</h2>

      <p>
        If you have questions about Forest Forms, your account, payments, subscriptions, or the
        services provided through the platform, please visit our <a href="/contact">Contact Us</a>{" "}
        page.
      </p>
    </LegalPageLayout>
  );
}
