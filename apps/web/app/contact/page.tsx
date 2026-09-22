import { Mail, MapPin, Clock, MessageCircle } from "lucide-react";

import { LegalPageLayout } from "~/components/LegalPageLayout";

export default function ContactPage() {
  return (
    <LegalPageLayout
      title="Contact Us"
      description="Have a question about Forest Forms, your account, billing, or our services? Get in touch with our support team."
    >
      <h2>We're here to help</h2>

      <p>
        If you need help with Forest Forms, have a question about your subscription, or need
        assistance with a payment or account issue, please contact us using the details below.
      </p>

      <div className="not-prose my-8 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-black/[0.07] bg-black/[0.02] p-5 dark:border-white/[0.08] dark:bg-white/[0.025]">
          <Mail className="mb-4 h-5 w-5 text-emerald-600 dark:text-emerald-400" />

          <p className="text-xs text-black/40 dark:text-white/35">General Support</p>

          <a
            href="mailto:YOUR_SUPPORT_EMAIL"
            className="mt-1 block text-sm font-medium hover:text-emerald-600 dark:hover:text-emerald-400"
          >
            nikhilmali3141@gmail.com
          </a>
        </div>

        <div className="rounded-2xl border border-black/[0.07] bg-black/[0.02] p-5 dark:border-white/[0.08] dark:bg-white/[0.025]">
          <MessageCircle className="mb-4 h-5 w-5 text-emerald-600 dark:text-emerald-400" />

          <p className="text-xs text-black/40 dark:text-white/35">Billing Support</p>

          <a
            href="mailto:YOUR_BILLING_EMAIL"
            className="mt-1 block text-sm font-medium hover:text-emerald-600 dark:hover:text-emerald-400"
          >
            nikhilmali3141@gmail.com
          </a>
        </div>

        <div className="rounded-2xl border border-black/[0.07] bg-black/[0.02] p-5 dark:border-white/[0.08] dark:bg-white/[0.025]">
          <Clock className="mb-4 h-5 w-5 text-emerald-600 dark:text-emerald-400" />

          <p className="text-xs text-black/40 dark:text-white/35">Support Hours</p>

          <p className="mt-1 text-sm font-medium">
            Monday – Friday
            <br />
            10:00 AM – 6:00 PM IST
          </p>
        </div>

        <div className="rounded-2xl border border-black/[0.07] bg-black/[0.02] p-5 dark:border-white/[0.08] dark:bg-white/[0.025]">
          <MapPin className="mb-4 h-5 w-5 text-emerald-600 dark:text-emerald-400" />

          <p className="text-xs text-black/40 dark:text-white/35">Business Address</p>

          <p className="mt-1 text-sm font-medium leading-6">
            Forest Form
            <br />
            sharad nagar, collecotr patta, malegoan
            <br />
            Nashik, Maharastra 423203
            <br />
            India
          </p>
        </div>
      </div>

      <h2>Billing and payment support</h2>

      <p>
        For payment-related questions, please include the email address associated with your Forest
        Forms account and, where applicable, the relevant payment or transaction reference. Do not
        send complete card numbers, CVV numbers, passwords, or other payment credentials by email.
      </p>

      <h2>Refund and cancellation requests</h2>

      <p>
        For refund or subscription cancellation requests, please review our{" "}
        <a href="/refund-cancellation">Refund & Cancellation Policy</a> before contacting support.
      </p>

      <h2>Privacy questions</h2>

      <p>
        For questions about personal information or privacy, please contact us using the support
        details above and mention that your request concerns privacy or personal data.
      </p>
    </LegalPageLayout>
  );
}
