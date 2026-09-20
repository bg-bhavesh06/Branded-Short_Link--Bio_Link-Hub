import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Shield, FileText, ShieldCheck, Database, Eye, Globe, Lock, UserCheck, AlertTriangle, Scale, RefreshCw, KeyRound, Server, Cpu, CheckCircle2, EyeOff, ArrowLeft } from "lucide-react";
import { Card } from "@/components/ui/card";

const DOCS = {
  "/privacy": {
    badge: "GDPR & CCPA Compliant",
    icon: Shield,
    title: "Privacy Policy",
    desc: "We believe in transparent, privacy-first analytics with zero raw IP storage.",
    email: "privacy@linkhub.me",
    items: [
      { icon: Database, t: "1. Information We Collect", d: "Account credentials and link configurations. Visitor clicks record coarse country, device, and browser telemetry." },
      { icon: Shield, t: "2. Privacy-First Click Telemetry", d: "Visitor IP addresses are instantly hashed with rotatable cryptographic salts. Raw IP addresses are never saved." },
      { icon: Eye, t: "3. How We Use Information", d: "To authenticate requests, generate analytics dashboards, and prevent fraudulent link redirects." },
      { icon: Globe, t: "4. GDPR & CCPA Compliance", d: "You have full rights to access, export, or permanently erase your personal data anytime." },
      { icon: Lock, t: "5. Data Security", d: "All traffic is secured via TLS 1.3 in transit and AES-256 database encryption at rest." },
      { icon: UserCheck, t: "6. Data Retention & Deletion", d: "Deleting a short link or account instantly purges all associated telemetry records." },
    ],
  },
  "/terms": {
    badge: "Fair Use Terms",
    icon: FileText,
    title: "Terms of Service",
    desc: "Guidelines and acceptable use rules governing LinkHub's short link and QR services.",
    email: "legal@linkhub.me",
    items: [
      { icon: CheckCircle2, t: "1. Acceptance of Terms", d: "By accessing LinkHub, you agree to these Terms of Service." },
      { icon: AlertTriangle, t: "2. Acceptable Use Policy", d: "Phishing, malware distribution, illegal redirects, and unsolicited spam are strictly prohibited." },
      { icon: Scale, t: "3. Vanity Slugs & Custom Aliases", d: "Vanity URLs are allocated on a fair-use basis; brand squatting is subject to reclamation." },
      { icon: ShieldCheck, t: "4. Account Responsibilities", d: "You are responsible for maintaining the security of your credentials and account activities." },
      { icon: RefreshCw, t: "5. Service Availability", d: "We target 99.9% uptime and regularly update features to ensure high platform reliability." },
      { icon: FileText, t: "6. Limitation of Liability", d: "LinkHub is provided as-is without liability for indirect or consequential damages." },
    ],
  },
  "/security": {
    badge: "SOC-2 & GDPR Aligned",
    icon: ShieldCheck,
    title: "Security at LinkHub",
    desc: "Security and privacy are engineered into every layer of our short links and QR generator.",
    email: "security@linkhub.me",
    items: [
      { icon: Lock, t: "End-to-End TLS & AES-256", d: "Encrypted data in transit via modern TLS 1.3 suites and AES-256 database storage at rest." },
      { icon: EyeOff, t: "Salted IP Hashing", d: "Visitor metrics are generated via one-way cryptographic hashing without exposing raw IPs." },
      { icon: KeyRound, t: "HttpOnly JWT Cookies", d: "Secure authentication cookies with SameSite protections to prevent XSS and session hijacking." },
      { icon: Server, t: "DDoS & Rate Limiting", d: "Adaptive edge rate limits against brute force, credential stuffing, and flood attacks." },
      { icon: Cpu, t: "Malicious URL Detection", d: "Automated real-time safety scans to detect and disable malicious redirect targets." },
      { icon: CheckCircle2, t: "Responsible Disclosure", d: "We welcome vulnerability reports and patch reported security issues rapidly." },
    ],
  },
};

export function LegalPage() {
  const { pathname } = useLocation();
  const doc = DOCS[pathname] || DOCS["/privacy"];
  const MainIcon = doc.icon;

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between">
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors">
          <ArrowLeft className="size-4" /> Back to Home
        </Link>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
          {doc.badge}
        </span>
      </div>

      <div className="text-center mb-10">
        <div className="inline-flex size-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 mb-3 shadow-2xs">
          <MainIcon className="size-6" />
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">{doc.title}</h1>
        <p className="mt-2 text-slate-600 text-sm max-w-xl mx-auto">{doc.desc}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {doc.items.map((item, i) => {
          const Icon = item.icon;
          return (
            <Card key={i} className="p-5 rounded-2xl border border-slate-200/80 bg-white shadow-xs hover:border-slate-300 transition-colors">
              <div className="flex size-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600 mb-3">
                <Icon className="size-4.5" />
              </div>
              <h2 className="text-sm font-bold text-slate-900">{item.t}</h2>
              <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">{item.d}</p>
            </Card>
          );
        })}
      </div>

      <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50/60 p-4 text-center text-xs text-slate-600">
        Questions? Contact us at <a href={`mailto:${doc.email}`} className="font-bold text-blue-600 underline hover:text-blue-700">{doc.email}</a>
      </div>
    </div>
  );
}

export const PrivacyPage = LegalPage;
export const TermsPage = LegalPage;
export const SecurityPage = LegalPage;
