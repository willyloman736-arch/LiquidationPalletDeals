import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { ContactForm } from "@/components/ContactForm";
import { Icon } from "@/components/Icon";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Send us a message through the contact form. Business hours 7:00am–3:30pm ET, Monday–Friday.",
};

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Get in touch."
        description="Send us a message and we'll do our best to follow up within the business day."
        breadcrumbs={[
          { href: "/", label: "Home" },
          { href: "/contact", label: "Contact" },
        ]}
      />
      <section className="py-12">
        <div className="container grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <h2 className="text-lg font-bold text-ink-900">Customer service</h2>
            <ul className="mt-4 space-y-3 text-sm text-ink-700">
              <li className="flex items-start gap-3">
                <Icon name="mail" className="mt-0.5 h-5 w-5 text-brand-700" />
                <div>
                  <p className="font-semibold text-ink-900">Email us</p>
                  <a href={`mailto:${site.email}`} className="link break-all font-medium">
                    {site.email}
                  </a>
                  <p className="text-xs text-ink-500">
                    The fastest way to reach us — we reply within the business day.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Icon name="clock" className="mt-0.5 h-5 w-5 text-brand-700" />
                <div>
                  <p className="font-semibold text-ink-900">Business hours</p>
                  <p>{site.hours}</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Icon name="pin" className="mt-0.5 h-5 w-5 text-brand-700" />
                <div>
                  <p className="font-semibold text-ink-900">Address</p>
                  <p>
                    {site.address.line1}
                    <br />
                    {site.address.city}, {site.address.state} {site.address.zip}
                  </p>
                </div>
              </li>
            </ul>

            <div className="mt-8 rounded-2xl bg-brand-50 p-5 ring-1 ring-brand-100">
              <h3 className="text-sm font-bold text-brand-900">Response times</h3>
              <p className="mt-1 text-sm text-brand-900/80">
                If you reach out after business hours, we&rsquo;ll respond as soon as possible on the next
                business day. Please check your spam folder for our reply — it may be hidden there.
              </p>
            </div>
          </div>

          <div className="lg:col-span-7">
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}
