import { writable, derived } from "svelte/store";

const defaultData = {
  contacts: [
    {
      id: 1,
      name: "Ahmet Yilmaz",
      email: "ahmet@example.com",
      subject: "Web Projesi",
      message: "Kurumsal web sitemizi yenilemek istiyoruz.",
      status: "unread",
      date: "2025-01-15",
    },
    {
      id: 2,
      name: "Elif Kaya",
      email: "elif@example.com",
      subject: "E-ticaret",
      message: "Online magaza kurmak istiyoruz.",
      status: "read",
      date: "2025-01-14",
    },
    {
      id: 3,
      name: "Mehmet Demir",
      email: "mehmet@example.com",
      subject: "SEO Danismanligi",
      message: "Web sitemizin SEO performansini artirmak istiyoruz.",
      status: "replied",
      date: "2025-01-13",
    },
  ],
  partners: [
    {
      id: 1,
      name: "Antalyaspor",
      description: "Digital Fan Experience Platform",
      tags: ["Web Experiences", "Content Production"],
    },
    {
      id: 2,
      name: "HostDirekt",
      description: "Cloud Infrastructure & DevOps",
      tags: ["Cloud & DevOps", "Performance & SEO"],
    },
    {
      id: 3,
      name: "EventPlus",
      description: "Event Management System",
      tags: ["AI & Automation", "Web Experiences"],
    },
    {
      id: 4,
      name: "Anatolicus",
      description: "E-commerce & Brand Identity",
      tags: ["Brand & Identity", "E-commerce"],
    },
    {
      id: 5,
      name: "IBU",
      description: "Educational Content Platform",
      tags: ["Content Production", "Strategy & Consulting"],
    },
    {
      id: 6,
      name: "MICE",
      description: "Business Intelligence Dashboard",
      tags: ["Strategy & Consulting", "AI & Automation"],
    },
    {
      id: 7,
      name: "Maras Ceviz",
      description: "Brand & Digital Presence",
      tags: ["Brand & Identity", "Web Experiences"],
    },
  ],
  services: [
    {
      id: 1,
      title: "Strategy & Consulting",
      description:
        "Market research, digital transformation, KPI frameworks, stakeholder workshops.",
      features: [
        "Market research & competitive analysis",
        "Digital transformation roadmaps",
        "KPI frameworks & measurement",
        "Stakeholder workshops",
      ],
      active: true,
    },
    {
      id: 2,
      title: "Brand & Identity",
      description:
        "Logo design, color palettes, typography, brand guidelines, visual identity.",
      features: [
        "Logo design & brand marks",
        "Color palettes & typography",
        "Brand guidelines",
        "Visual identity systems",
      ],
      active: true,
    },
    {
      id: 3,
      title: "Web Experiences",
      description: "Responsive web apps, PWAs, SSR, interactive UI with WebGL.",
      features: [
        "Responsive web applications",
        "Progressive Web Apps",
        "Server-side rendering",
        "Interactive UI & WebGL",
      ],
      active: true,
    },
    {
      id: 4,
      title: "AI & Automation",
      description:
        "Custom AI chatbots, workflow automation, data integration, ML deployment.",
      features: [
        "Custom AI chatbots",
        "Workflow automation",
        "Data integration & ETL",
        "ML model deployment",
      ],
      active: true,
    },
    {
      id: 5,
      title: "E-commerce",
      description:
        "Shopify & custom storefronts, payment gateways, subscriptions, CRO.",
      features: [
        "Shopify & custom builds",
        "Payment integrations",
        "Subscription billing",
        "Conversion optimization",
      ],
      active: true,
    },
    {
      id: 6,
      title: "Content Production",
      description:
        "Video production, motion graphics, photography, social media strategy.",
      features: [
        "Video production",
        "Motion graphics",
        "Photography & art direction",
        "Social media strategy",
      ],
      active: true,
    },
    {
      id: 7,
      title: "Cloud & DevOps",
      description:
        "AWS/GCP/Azure architecture, CI/CD, Infrastructure as Code, monitoring.",
      features: [
        "Cloud architecture",
        "CI/CD pipelines",
        "Infrastructure as Code",
        "Monitoring & alerting",
      ],
      active: true,
    },
    {
      id: 8,
      title: "Performance & SEO",
      description:
        "Core Web Vitals, technical SEO, accessibility (WCAG), page speed.",
      features: [
        "Core Web Vitals",
        "Technical SEO audits",
        "WCAG compliance",
        "Bundle optimization",
      ],
      active: true,
    },
    {
      id: 9,
      title: "Support & Growth",
      description:
        "Monthly retainers, A/B testing, analytics dashboards, feature iteration.",
      features: [
        "Support plans",
        "A/B testing",
        "Analytics dashboards",
        "Feature iteration",
      ],
      active: true,
    },
  ],
  content: {
    hero: {
      headline: "Your Digital Agency",
      subheadline: "Designed for the Future.",
    },
    about: {
      description:
        "ROCR Digital is a full-service digital agency based in Antalya, Turkey.",
      mission:
        "To empower businesses with cutting-edge digital solutions that drive measurable growth.",
      vision:
        "To be the leading digital agency in the region, known for innovation and excellence.",
    },
    stats: {
      projects: "50+",
      clients: "30+",
      years: "5+",
      services: "9",
    },
    values: [
      "Design-First Thinking",
      "Technical Excellence",
      "Collaborative Process",
      "Measurable Impact",
    ],
  },
  team: [
    {
      id: 1,
      name: "Founder 1",
      role: "CEO & Co-Founder",
      group: "Founders & Leadership",
      description: "Visionary leader driving ROCR Digital's strategic direction.",
    },
    {
      id: 2,
      name: "Founder 2",
      role: "CTO & Co-Founder",
      group: "Founders & Leadership",
      description: "Technical architect behind ROCR Digital's engineering excellence.",
    },
    {
      id: 3,
      name: "Designer 1",
      role: "Lead Designer",
      group: "Design Studio",
      description: "Creative mind crafting beautiful digital experiences.",
    },
    {
      id: 4,
      name: "Engineer 1",
      role: "Senior Developer",
      group: "Engineering Lab",
      description: "Full-stack engineer building robust web applications.",
    },
  ],
};

function createDataStore() {
  const { subscribe, set, update } = writable(defaultData);

  return {
    subscribe,
    set,
    update,

    // Contact operations
    addContact(contact) {
      update((data) => ({
        ...data,
        contacts: [
          ...data.contacts,
          { ...contact, id: Date.now(), date: new Date().toISOString().split("T")[0], status: "unread" },
        ],
      }));
    },
    updateContact(id, updates) {
      update((data) => ({
        ...data,
        contacts: data.contacts.map((c) =>
          c.id === id ? { ...c, ...updates } : c
        ),
      }));
    },
    deleteContact(id) {
      update((data) => ({
        ...data,
        contacts: data.contacts.filter((c) => c.id !== id),
      }));
    },

    // Partner operations
    addPartner(partner) {
      update((data) => ({
        ...data,
        partners: [...data.partners, { ...partner, id: Date.now() }],
      }));
    },
    updatePartner(id, updates) {
      update((data) => ({
        ...data,
        partners: data.partners.map((p) =>
          p.id === id ? { ...p, ...updates } : p
        ),
      }));
    },
    deletePartner(id) {
      update((data) => ({
        ...data,
        partners: data.partners.filter((p) => p.id !== id),
      }));
    },

    // Service operations
    updateService(id, updates) {
      update((data) => ({
        ...data,
        services: data.services.map((s) =>
          s.id === id ? { ...s, ...updates } : s
        ),
      }));
    },
    toggleService(id) {
      update((data) => ({
        ...data,
        services: data.services.map((s) =>
          s.id === id ? { ...s, active: !s.active } : s
        ),
      }));
    },

    // Content operations
    updateContent(section, value) {
      update((data) => ({
        ...data,
        content: { ...data.content, [section]: value },
      }));
    },

    // Team operations
    addTeamMember(member) {
      update((data) => ({
        ...data,
        team: [...data.team, { ...member, id: Date.now() }],
      }));
    },
    updateTeamMember(id, updates) {
      update((data) => ({
        ...data,
        team: data.team.map((t) =>
          t.id === id ? { ...t, ...updates } : t
        ),
      }));
    },
    deleteTeamMember(id) {
      update((data) => ({
        ...data,
        team: data.team.filter((t) => t.id !== id),
      }));
    },
  };
}

export const data = createDataStore();

// Derived stores
export const unreadContacts = derived(data, ($data) =>
  $data.contacts.filter((c) => c.status === "unread")
);

export const activeServices = derived(data, ($data) =>
  $data.services.filter((s) => s.active)
);

export const teamByGroup = derived(data, ($data) => {
  const groups = {};
  $data.team.forEach((member) => {
    if (!groups[member.group]) groups[member.group] = [];
    groups[member.group].push(member);
  });
  return groups;
});
