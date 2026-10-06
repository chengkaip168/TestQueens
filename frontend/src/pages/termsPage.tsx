import { useEffect } from "react";
import { LegalLayout, Section } from "./legalPage";

export default function TermsPage() {
  useEffect(() => { document.title = "Terms of Service | TestQueens"; }, []);

  return (
    <LegalLayout title="Terms of Service" updated="October 5, 2026">
      <p>
        These terms cover using TestQueens. By signing in you agree to them. If you are under 18,
        a parent or guardian should read them with you.
      </p>

      <Section heading="Who runs this site">
        <p>
          TestQueens is operated by <strong>Chan Tutoring Center</strong>, based at 6012b 18th Ave,
          Brooklyn, NY 11204.
          Questions go to{" "}
          <a href="mailto:info@chantutoringcenter.com" className="underline underline-offset-4">info@chantutoringcenter.com</a>.
        </p>
      </Section>

      <Section heading="No affiliation with the SHSAT or the NYC Department of Education">
        <p>
          The Specialized High Schools Admissions Test is administered by the New York City
          Department of Education. TestQueens is not affiliated with, endorsed by, or approved by
          the NYC Department of Education or any specialized high school. We use the name of the
          test only to describe what this site helps you practice for.
        </p>
      </Section>

      <Section heading="The score estimate is an estimate">
        <p>
          The site shows a predicted score on a 200 to 700 scale. That number comes from our own
          formula, which weights your answers by how hard each question is. It is not produced by
          the Department of Education, it is not an official score, and it does not predict
          admission to any school. Treat it as a rough signal of where you are, nothing more.
        </p>
      </Section>

      <Section heading="Cost">
        <p>
          The site is free to use. There is no subscription, no trial that turns into a charge,
          and no payment information collected anywhere.
        </p>
      </Section>

      <Section heading="Accounts and access codes">
        <p>
          Student accounts are created with an access code from the tutoring center. Do not share
          your code or your password. You are responsible for what happens under your account. If
          you think someone else has access to it, tell us and change your password.
        </p>
      </Section>

      <Section heading="Using the site">
        <p>Please do not:</p>
        <ul className="list-disc pl-5 flex flex-col gap-1">
          <li>Copy the question bank or republish it anywhere</li>
          <li>Use automated tools to scrape questions or answers</li>
          <li>Try to reach another student's results</li>
          <li>Try to break, overload, or work around the site's access rules</li>
        </ul>
        <p>We can close an account that does any of these.</p>
      </Section>

      <Section heading="Content">
        <p>
          The site, its design, its code, and the practice material on it belong to us. You can
          use it to study. You cannot copy it, republish it, or pass it on to anyone else.
        </p>
      </Section>

      <Section heading="No warranty">
        <p>
          The site is provided as it is. We do not promise it will always be available, that every
          answer key is correct, or that using it will get you into a particular school. If you
          find a wrong answer, use the flag button on the question and we will look at it.
        </p>
      </Section>

      <Section heading="Limit of responsibility">
        <p>
          To the extent the law allows, we are not liable for indirect or consequential losses
          that come from using the site, including admissions outcomes. Nothing here limits
          liability that cannot legally be limited.
        </p>
      </Section>

      <Section heading="Ending access">
        <p>
          You can ask us to close your account at any time. We can close an account that breaks
          these terms. Deleting an account removes its practice history, as described in the{" "}
          <a href="#/privacy" className="underline underline-offset-4">Privacy Policy</a>.
        </p>
      </Section>

      <Section heading="Governing law">
        <p>
          These terms are governed by the laws of <strong>New York</strong>, and disputes go to the
          courts located there.
        </p>
      </Section>

      <Section heading="Changes">
        <p>
          If these terms change, we will update this page and the date at the top. Continuing to
          use the site after that means you accept the new version.
        </p>
      </Section>
    </LegalLayout>
  );
}
