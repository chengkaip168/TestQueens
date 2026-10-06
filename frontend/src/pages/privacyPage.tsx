import { useEffect } from "react";
import { LegalLayout, Section } from "./legalPage";

// Describes only what the application actually does. If the data handling in the
// code changes, this page has to change with it.
export default function PrivacyPage() {
  useEffect(() => { document.title = "Privacy Policy | TestQueens"; }, []);

  return (
    <LegalLayout title="Privacy Policy" updated="October 5, 2026">
      <p>
        TestQueens is a practice site for the SHSAT. This page explains what we store, why we
        store it, and how to get it deleted. It is written to be read, not to be skimmed past.
      </p>

      <Section heading="Who runs this site">
        <p>
          TestQueens is operated by <strong>Chan Tutoring Center</strong>, based at 6012b 18th Ave,
          Brooklyn, NY 11204.
          You can reach us at{" "}
          <a href="mailto:info@chantutoringcenter.com" className="underline underline-offset-4">info@chantutoringcenter.com</a>.
        </p>
      </Section>

      <Section heading="What we collect">
        <p>When an account is created, we store:</p>
        <ul className="list-disc pl-5 flex flex-col gap-1">
          <li>First name and last name</li>
          <li>Email address, used to sign in and to reset a password</li>
          <li>A password, which is hashed by our authentication provider and never visible to us</li>
          <li>The account type: student, parent, tutor, or admin</li>
        </ul>
        <p>While a student uses the site, we store:</p>
        <ul className="list-disc pl-5 flex flex-col gap-1">
          <li>The answer given to each question and whether it was correct</li>
          <li>How many seconds were spent on each question</li>
          <li>Test scores, test names, and the date each test was taken</li>
          <li>Any report submitted about a specific question</li>
          <li>The date of the most recent sign in</li>
        </ul>
        <p>
          We also store the links between accounts, so a parent or tutor can see the right
          student's results.
        </p>
      </Section>

      <Section heading="What we do not collect">
        <p>
          We do not take payment information, because the site does not charge for anything.
          We do not ask for a phone number, a home address, a date of birth, or a photo.
          We do not use advertising, analytics, tracking pixels, or social media widgets.
          We do not sell or rent anyone's information, and we do not send marketing email.
        </p>
      </Section>

      <Section heading="Why we store it">
        <p>
          Names and email addresses exist so that an account can be signed into and recovered.
          Answers and times exist so the site can show a student what they got wrong and which
          topics to practice next, and so a parent or tutor can see the same thing. There is no
          other use.
        </p>
      </Section>

      <Section heading="What is stored in your browser">
        <p>
          This site does not set cookies. It uses your browser's local storage for three things:
          keeping you signed in, saving a draft of your current answer so it is not lost if your
          connection drops, and remembering how much time is left in a timed test. Clearing your
          browser data removes all of it and signs you out.
        </p>
      </Section>

      <Section heading="Who else can see the data">
        <ul className="list-disc pl-5 flex flex-col gap-1">
          <li>
            <strong>Supabase</strong> hosts the database and handles sign in. Account and practice
            data is stored on their servers.
          </li>
          <li>
            <strong>Netlify</strong> serves the website files and records standard server request
            logs, which include IP addresses.
          </li>
          <li>
            <strong>Google Fonts</strong> serves the typefaces used on the site. Loading a font
            sends your IP address to Google.
          </li>
        </ul>
        <p>
          Tutors and administrators at the tutoring center can see the practice results of the
          students assigned to them. A parent account can see the results of the student it is
          linked to. Students cannot see each other's results.
        </p>
      </Section>

      <Section heading="Age">
        <p>
          Accounts on this site are for students aged 13 and over. Student accounts are created
          with an access code issued by the tutoring center rather than through open signup.
        </p>
        <p>
          If you are a parent and you want to see what we hold about your child, correct it, or
          have it deleted, email us at{" "}
          <a href="mailto:info@chantutoringcenter.com" className="underline underline-offset-4">info@chantutoringcenter.com</a>{" "}
          and we will take care of it.
        </p>
      </Section>

      <Section heading="Deleting your data">
        <p>
          Email{" "}
          <a href="mailto:info@chantutoringcenter.com" className="underline underline-offset-4">info@chantutoringcenter.com</a>{" "}
          from the address on the account, or from a parent's address if the account belongs to
          your child, and say what you want removed. We will delete the account and the practice
          history tied to it within 30 days and confirm when it is done. A tutor or administrator
          can also delete a student account directly.
        </p>
      </Section>

      <Section heading="How long we keep things">
        <p>
          Practice history stays until the account is deleted, because the point of it is to show
          progress over time. Inactive accounts may be removed after a long period with no sign in.
        </p>
      </Section>

      <Section heading="Security">
        <p>
          Connections to the site are encrypted. Passwords are hashed, not stored as text. Access
          to student records is restricted by database rules so that an account can only read the
          records it is entitled to. No system is perfect, and we are not promising that one is.
        </p>
      </Section>

      <Section heading="Changes">
        <p>
          If we change what we collect, we will update this page and change the date at the top.
        </p>
      </Section>
    </LegalLayout>
  );
}
