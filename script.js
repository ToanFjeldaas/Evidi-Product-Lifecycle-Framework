const yearEl = document.querySelector("#year");
if (yearEl) {
  yearEl.textContent = new Date().getFullYear().toString();
}

const observer = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    }
  },
  {
    threshold: 0.2,
  }
);

for (const el of document.querySelectorAll(".reveal")) {
  observer.observe(el);
}

const frameworkCards = document.querySelectorAll(".framework-card");
const capabilitySectionsList = document.querySelector("#capability-sections-list");
const floatingNav = document.querySelector("#floating-nav");
const floatingNavList = document.querySelector("#floating-nav-list");
const floatingNavToggle = document.querySelector("#floating-nav-toggle");
const contentSearchInput = document.querySelector("#content-search-input");
const contentSearchStatus = document.querySelector("#content-search-status");
const contentSearchNextButton = document.querySelector("#content-search-next");
const taxonomyCategoryButtons = document.querySelectorAll(".taxonomy-category, .taxonomy-category-button");
const taxonomyOverlay = document.querySelector("#taxonomy-overlay");
const taxonomyOverlayTitle = document.querySelector("#taxonomy-overlay-title");
const taxonomyOverlayContent = document.querySelector("#taxonomy-overlay-content, #taxonomy-overlay-body");
const taxonomyOverlayCloseButtons = document.querySelectorAll("[data-taxonomy-close], #taxonomy-overlay-close");
const ideaWizardLaunch = document.querySelector("#idea-wizard-launch");
const ideaWizardModal = document.querySelector("#idea-wizard-modal");
const ideaWizardQuestionStage = document.querySelector("#idea-wizard-question-stage");
const ideaWizardSummaryStage = document.querySelector("#idea-wizard-summary-stage");
const ideaWizardConfirmStage = document.querySelector("#idea-wizard-confirm-stage");
const ideaWizardTitle = document.querySelector("#idea-wizard-title");
const ideaWizardHelp = document.querySelector("#idea-wizard-help");
const ideaWizardInput = document.querySelector("#idea-wizard-input");
const ideaWizardStepLabel = document.querySelector("#idea-wizard-step-label");
const ideaWizardProgressFill = document.querySelector("#idea-wizard-progress-fill");
const ideaWizardActions = document.querySelector(".idea-wizard-actions");
const ideaWizardBack = document.querySelector("#idea-wizard-back");
const ideaWizardNext = document.querySelector("#idea-wizard-next");
const ideaWizardSend = document.querySelector("#idea-wizard-send");
const ideaWizardFinish = document.querySelector("#idea-wizard-finish");
const ideaWizardDone = document.querySelector("#idea-wizard-done");
const ideaWizardSummary = document.querySelector("#idea-wizard-summary");
const ideaWizardCloseButtons = document.querySelectorAll("[data-idea-wizard-close], #idea-wizard-close");
const maturityRadar = document.querySelector("#maturity-radar");
const maturityPhaseList = document.querySelector("#maturity-phase-list");
const maturityPhaseOverview = document.querySelector("#maturity-phase-overview");
const maturityCurrentPointsEl = document.querySelector("#maturity-current-points");
const maturityMaxPointsEl = document.querySelector("#maturity-max-points");
const maturityPercentEl = document.querySelector("#maturity-percent");
let focusResetTimer;
let maturityModules = [];
let moduleSearchEntries = [];
let firstSearchMatch = null;
let searchMatchedEntries = [];
let currentSearchMatchIndex = -1;

const phaseOrder = [
  "Product Planning",
  "Product Development",
  "Product Introduction",
  "Product Life Cycle Management",
];

const phaseTheme = {
  "Product Planning": {
    fill: "rgba(33, 95, 111, 0.12)",
    stroke: "rgba(33, 95, 111, 0.85)",
    accent: "#215f6f",
  },
  "Product Development": {
    fill: "rgba(0, 174, 121, 0.12)",
    stroke: "rgba(0, 174, 121, 0.9)",
    accent: "#008b65",
  },
  "Product Introduction": {
    fill: "rgba(244, 148, 68, 0.12)",
    stroke: "rgba(244, 148, 68, 0.92)",
    accent: "#f49444",
  },
  "Product Life Cycle Management": {
    fill: "rgba(87, 110, 177, 0.12)",
    stroke: "rgba(87, 110, 177, 0.9)",
    accent: "#576eb1",
  },
};

const phaseTargets = {
  "Product Planning": 0.7,
  "Product Development": 0.8,
  "Product Introduction": 0.75,
  "Product Life Cycle Management": 0.7,
};

const ideaWizardQuestions = [
  {
    id: "ideaName",
    type: "text",
    title: "What is the name of the idea?",
    help: "Use a working title that makes the idea easy to recognize later.",
    placeholder: "Example: AI assistant for proposal drafting",
  },
  {
    id: "ideaSummary",
    type: "textarea",
    title: "Describe the idea in one short paragraph.",
    help: "Focus on what it does, who it helps, and why it could matter for Evidi.",
    placeholder: "Describe the problem, the idea, and the expected value.",
  },
  {
    id: "beneficiary",
    type: "single",
    title: "Who benefits most if this idea becomes real?",
    help: "This helps determine whether the idea is closer to a product, service, framework, or something else.",
    options: [
      {
        value: "single-internal-team",
        title: "A single internal team",
        copy: "The idea mainly helps one team work differently or better.",
        categoryScores: { concept: 2, accelerator: 1 },
        maturity: 1,
        phaseScores: { "Product Planning": 2 },
      },
      {
        value: "many-internal-teams",
        title: "Multiple internal teams",
        copy: "The idea is meant to improve how several teams operate or deliver.",
        categoryScores: { accelerator: 3, framework: 2 },
        maturity: 2,
        phaseScores: { "Product Development": 2, "Product Life Cycle Management": 1 },
      },
      {
        value: "specific-client-need",
        title: "A specific customer need",
        copy: "The value is strongest in a customer-specific situation or delivery.",
        categoryScores: { service: 3, concept: 1 },
        maturity: 2,
        phaseScores: { "Product Planning": 2, "Product Introduction": 1 },
      },
      {
        value: "many-customers",
        title: "Many customers or a repeatable market need",
        copy: "The idea could potentially be reused across multiple customers without major redesign.",
        categoryScores: { product: 4, service: 1 },
        maturity: 3,
        phaseScores: { "Product Planning": 2, "Product Introduction": 2 },
      },
      {
        value: "organization-governance",
        title: "The organization as a whole",
        copy: "The idea is mainly about governance, principles, or consistency across Evidi.",
        categoryScores: { framework: 4 },
        maturity: 3,
        phaseScores: { "Product Life Cycle Management": 3 },
      },
    ],
  },
  {
    id: "valueType",
    type: "single",
    title: "What kind of value is strongest in the idea?",
    help: "Choose the value pattern that best describes the idea today.",
    options: [
      {
        value: "learning",
        title: "Learning and validation",
        copy: "The main value is exploring whether something is worth pursuing.",
        categoryScores: { concept: 4 },
        maturity: 1,
        phaseScores: { "Product Planning": 2 },
      },
      {
        value: "governance",
        title: "Governance and consistency",
        copy: "The idea creates value by defining standards, rules, or responsibilities.",
        categoryScores: { framework: 4 },
        maturity: 3,
        phaseScores: { "Product Life Cycle Management": 3 },
      },
      {
        value: "efficiency",
        title: "Faster and safer delivery",
        copy: "The idea improves speed, reuse, or execution quality for teams.",
        categoryScores: { accelerator: 4 },
        maturity: 3,
        phaseScores: { "Product Development": 3 },
      },
      {
        value: "execution",
        title: "Expert execution for customers",
        copy: "The value depends on people delivering work with strong competence.",
        categoryScores: { service: 4 },
        maturity: 3,
        phaseScores: { "Product Introduction": 2, "Product Development": 1 },
      },
      {
        value: "repeatable-offering",
        title: "A repeatable offering with market value",
        copy: "The idea could become something Evidi owns, evolves, and offers repeatedly.",
        categoryScores: { product: 4 },
        maturity: 4,
        phaseScores: { "Product Planning": 2, "Product Introduction": 2 },
      },
    ],
  },
  {
    id: "reuse",
    type: "single",
    title: "How reusable is the idea?",
    help: "Think about reuse across teams, deliveries, or customers.",
    options: [
      {
        value: "one-context",
        title: "Mostly useful in one context",
        copy: "The idea is still tied to a specific team, project, or customer situation.",
        categoryScores: { concept: 2, service: 2 },
        maturity: 1,
        phaseScores: { "Product Planning": 2 },
      },
      {
        value: "internal-pattern",
        title: "Reusable across internal deliveries",
        copy: "The same solution or pattern could help multiple internal teams or projects.",
        categoryScores: { accelerator: 3, framework: 1 },
        maturity: 2,
        phaseScores: { "Product Development": 2 },
      },
      {
        value: "service-repeatable",
        title: "Repeatable with some tailoring",
        copy: "The idea can be reused, but customer adaptation will still be important.",
        categoryScores: { service: 3, product: 1 },
        maturity: 3,
        phaseScores: { "Product Development": 2, "Product Introduction": 1 },
      },
      {
        value: "market-repeatable",
        title: "Highly reusable across many customers",
        copy: "The idea looks like something that could scale as a repeatable offering.",
        categoryScores: { product: 4 },
        maturity: 4,
        phaseScores: { "Product Introduction": 2, "Product Life Cycle Management": 1 },
      },
    ],
  },
  {
    id: "tailoring",
    type: "single",
    title: "How much customer-specific tailoring would it require?",
    help: "Tailoring level often separates products from services and accelerators.",
    options: [
      {
        value: "high-tailoring",
        title: "A lot of tailoring per customer",
        copy: "The idea mainly creates value when adapted by people for each context.",
        categoryScores: { service: 4 },
        maturity: 2,
        phaseScores: { "Product Development": 1, "Product Introduction": 1 },
      },
      {
        value: "moderate-tailoring",
        title: "Some configuration or adaptation",
        copy: "The core is reusable, but customers will still need adjustments.",
        categoryScores: { service: 2, product: 2 },
        maturity: 3,
        phaseScores: { "Product Development": 2, "Product Introduction": 1 },
      },
      {
        value: "low-tailoring",
        title: "Low tailoring",
        copy: "The same core solution could work repeatedly with limited adaptation.",
        categoryScores: { product: 3, accelerator: 1 },
        maturity: 4,
        phaseScores: { "Product Introduction": 2, "Product Life Cycle Management": 1 },
      },
      {
        value: "governance-pattern",
        title: "Tailoring is not the point",
        copy: "The main value is governance, structure, or reuse rather than customer configuration.",
        categoryScores: { framework: 2, accelerator: 2 },
        maturity: 3,
        phaseScores: { "Product Life Cycle Management": 2, "Product Development": 1 },
      },
    ],
  },
  {
    id: "evidence",
    type: "single",
    title: "How much evidence do you have that the idea is worth pursuing?",
    help: "Evidence can come from users, teams, customers, leaders, or repeated demand.",
    options: [
      {
        value: "assumption-only",
        title: "Mostly a promising assumption",
        copy: "The idea is interesting, but evidence is still limited.",
        categoryScores: { concept: 2 },
        maturity: 1,
        phaseScores: { "Product Planning": 3 },
      },
      {
        value: "internal-feedback",
        title: "Some internal feedback",
        copy: "People inside Evidi see value, but the case is still forming.",
        categoryScores: { concept: 1, framework: 1, accelerator: 1, service: 1, product: 1 },
        maturity: 2,
        phaseScores: { "Product Planning": 2 },
      },
      {
        value: "validated-problem",
        title: "A validated problem or clear pain point",
        copy: "There is enough evidence to justify structured follow-up.",
        categoryScores: { service: 1, product: 1, accelerator: 1 },
        maturity: 3,
        phaseScores: { "Product Planning": 2, "Product Development": 1 },
      },
      {
        value: "sponsor-demand",
        title: "Clear demand and sponsor support",
        copy: "The need is recognized and stakeholders are ready to move.",
        categoryScores: { service: 1, product: 2, framework: 1 },
        maturity: 4,
        phaseScores: { "Product Development": 2, "Product Introduction": 1 },
      },
      {
        value: "repeated-demand",
        title: "Repeated demand from multiple contexts",
        copy: "The signal is strong enough to justify real ownership and investment decisions.",
        categoryScores: { product: 3, accelerator: 1, service: 1 },
        maturity: 5,
        phaseScores: { "Product Introduction": 2, "Product Life Cycle Management": 2 },
      },
    ],
  },
  {
    id: "ownership",
    type: "single",
    title: "How clear is ownership today?",
    help: "Ownership clarity is a strong maturity signal.",
    options: [
      {
        value: "no-owner",
        title: "No clear owner yet",
        copy: "The idea exists, but nobody is clearly accountable for moving it forward.",
        categoryScores: { concept: 2 },
        maturity: 1,
        phaseScores: { "Product Planning": 2 },
      },
      {
        value: "informal-owner",
        title: "An informal owner exists",
        copy: "Someone cares about the idea, but sponsorship and mandate are still limited.",
        categoryScores: { concept: 1, accelerator: 1, service: 1 },
        maturity: 2,
        phaseScores: { "Product Planning": 1, "Product Development": 1 },
      },
      {
        value: "named-owner",
        title: "A named owner is ready to shape it",
        copy: "There is a clear person who can define next steps and coordinate follow-up.",
        categoryScores: { framework: 1, accelerator: 1, service: 1, product: 1 },
        maturity: 3,
        phaseScores: { "Product Development": 2 },
      },
      {
        value: "sponsored-owner",
        title: "A named owner and sponsor are aligned",
        copy: "The idea has leadership support and a stronger basis for structured follow-through.",
        categoryScores: { service: 1, framework: 1, product: 2 },
        maturity: 4,
        phaseScores: { "Product Introduction": 2, "Product Development": 1 },
      },
      {
        value: "funded-owner",
        title: "Accountable, sponsored, and funded",
        copy: "The idea is ready for governance, investment, and measurable commitments.",
        categoryScores: { product: 3, framework: 1, service: 1 },
        maturity: 5,
        phaseScores: { "Product Life Cycle Management": 2, "Product Introduction": 2 },
      },
    ],
  },
  {
    id: "readiness",
    type: "single",
    title: "How ready is the idea for repeatable delivery or adoption?",
    help: "Think about whether the idea is still forming or already becoming repeatable.",
    options: [
      {
        value: "not-shaped",
        title: "It is still mostly unshaped",
        copy: "The idea needs more exploration before it can be packaged or repeated.",
        categoryScores: { concept: 2 },
        maturity: 1,
        phaseScores: { "Product Planning": 2 },
      },
      {
        value: "outline-only",
        title: "An outline exists",
        copy: "There is enough to explain it, but not yet enough to scale it.",
        categoryScores: { concept: 1, accelerator: 1, service: 1 },
        maturity: 2,
        phaseScores: { "Product Planning": 1, "Product Development": 1 },
      },
      {
        value: "repeatable-method",
        title: "A repeatable method is emerging",
        copy: "Parts of the idea already look reusable or structured enough to repeat.",
        categoryScores: { accelerator: 2, service: 2, framework: 1 },
        maturity: 3,
        phaseScores: { "Product Development": 2, "Product Introduction": 1 },
      },
      {
        value: "packaged-offer",
        title: "It can almost be packaged",
        copy: "The idea is moving toward a defined internal or external offering.",
        categoryScores: { service: 2, product: 2 },
        maturity: 4,
        phaseScores: { "Product Introduction": 2, "Product Life Cycle Management": 1 },
      },
      {
        value: "ready-to-scale",
        title: "It is close to scalable adoption",
        copy: "The idea is mature enough for stronger lifecycle, investment, or commercial decisions.",
        categoryScores: { product: 3, framework: 1 },
        maturity: 5,
        phaseScores: { "Product Life Cycle Management": 2, "Product Introduction": 2 },
      },
    ],
  },
  {
    id: "commitment",
    type: "single",
    title: "What level of commitment feels right for the idea now?",
    help: "Choose the commitment that best matches reality today, not the ambition five years out.",
    options: [
      {
        value: "exploration",
        title: "Exploration only",
        copy: "We mainly need to investigate and learn more before formalizing anything.",
        categoryScores: { concept: 4 },
        maturity: 1,
        phaseScores: { "Product Planning": 3 },
      },
      {
        value: "governance-model",
        title: "Governance and operating model",
        copy: "The right next step is defining principles, responsibilities, or decision rules.",
        categoryScores: { framework: 4 },
        maturity: 3,
        phaseScores: { "Product Life Cycle Management": 3 },
      },
      {
        value: "reusable-asset",
        title: "Reusable delivery asset",
        copy: "The idea should become a reusable enabler that helps teams work faster or better.",
        categoryScores: { accelerator: 4 },
        maturity: 3,
        phaseScores: { "Product Development": 3 },
      },
      {
        value: "service-ownership",
        title: "Service ownership and capability build",
        copy: "The idea should become a clearly managed service built around people and delivery quality.",
        categoryScores: { service: 4 },
        maturity: 4,
        phaseScores: { "Product Introduction": 2, "Product Development": 1 },
      },
      {
        value: "full-product-lifecycle",
        title: "Roadmap, backlog, and lifecycle ownership",
        copy: "The idea is ready to be considered as a repeatable product with long-term responsibility.",
        categoryScores: { product: 4 },
        maturity: 5,
        phaseScores: { "Product Introduction": 2, "Product Life Cycle Management": 2 },
      },
    ],
  },
];

const ideaWizardCategoryDescriptions = {
  concept: "Best treated as a concept for exploration and evidence-building.",
  framework: "Best treated as a framework to create governance and consistency.",
  accelerator: "Best treated as an accelerator to improve reuse, speed, or delivery quality.",
  service: "Best treated as a service built around people, execution, and capability.",
  product: "Best treated as a product with repeatability, ownership, and lifecycle commitments.",
};

let ideaWizardStepIndex = 0;
let ideaWizardAnswers = {};

const modulePhaseMap = {
  "Know the Customer": "Product Planning",
  "Size the Market Opportunity": "Product Planning",
  "Know the Competitors": "Product Planning",
  "Create the Product Strategy": "Product Planning",
  "Accelerate Time to Market": "Product Development",
  "Prioritize Product Investments": "Product Development",
  "Differentiate Products": "Product Development",
  "Build Compelling Customer Experiences": "Product Development",
  "Improve Cross-Departmental Collaboration": "Product Development",
  "Invest in the Right Tools": "Product Development",
  "Improve PM Approaches": "Product Development",
  "Manage Product Launch": "Product Introduction",
  "Communicate Product Value": "Product Introduction",
  "Price Products": "Product Introduction",
  "Measure Business Unit Performance": "Product Life Cycle Management",
  "Invest in Strong Teams": "Product Life Cycle Management",
  "Optimize Lifecycle Events": "Product Life Cycle Management",
  "Manage Innovation and Evolution": "Product Life Cycle Management",
  "Harness Disruption": "Product Life Cycle Management",
  "Achieve Financial Objectives": "Product Life Cycle Management",
  "Collaborate to Drive Business": "Product Life Cycle Management",
  "Package Products": "Product Life Cycle Management",
};

const capabilityContent = {
  "Know the Customer": [
    "This capability focuses on building and maintaining a deep understanding of customers, users, stakeholders, and their needs throughout the entire product lifecycle.",
    "The purpose is to ensure that product decisions are based on validated customer insights rather than assumptions or internal preferences.",
    "Organizations mature in this area continuously gather feedback, analyze customer behavior, validate problems, and identify opportunities to improve customer value.",
    "Customer understanding is treated as an ongoing discipline that influences prioritization, strategy, development, and lifecycle decisions.",
    "Strong customer understanding helps ensure that products remain relevant, valuable, and aligned with both market expectations and business objectives.",
  ],
  "Size the Market Opportunity": [
    "This capability focuses on understanding the commercial potential, strategic relevance, and long-term viability of a product or service opportunity.",
    "The purpose is to ensure that product investments are directed toward markets and opportunities that provide meaningful customer and business value.",
    "Organizations mature in this area continuously analyze market trends, growth opportunities, customer demand, and external factors that may influence future market conditions.",
    "Strong market understanding helps organizations prioritize investments, reduce strategic risk, and align product direction with long-term business objectives.",
  ],
  "Know the Competitors": [
    "This capability focuses on understanding the competitive landscape and identifying how products and services differentiate themselves in the market.",
    "The purpose is to ensure that the organization maintains awareness of competitor strategies, market positioning, strengths, weaknesses, and emerging threats.",
    "Organizations mature in this area continuously monitor competitors, evaluate market movements, and use competitive insights to improve product strategy, positioning, and decision-making.",
    "Strong competitor awareness helps organizations identify opportunities, reduce strategic blind spots, and strengthen market differentiation.",
  ],
  "Create the Product Strategy": [
    "This capability focuses on defining the long-term direction, vision, and objectives for a product or service.",
    "The purpose is to create alignment between customer needs, business priorities, market opportunities, and technology direction.",
    "Organizations mature in this area establish clear product strategies that guide prioritization, investments, development decisions, and lifecycle planning.",
    "A strong product strategy creates clarity, improves alignment, and ensures that product initiatives contribute to measurable business outcomes.",
  ],
  "Prioritize Product Investments": [
    "This capability focuses on ensuring that investments, resources, and organizational focus are directed toward initiatives that provide the highest customer and business value.",
    "Organizations mature in this area use structured prioritization models, governance processes, and measurable criteria to support investment decisions.",
    "Effective prioritization improves execution focus, resource utilization, and long-term value realization.",
  ],
  "Differentiate Products": [
    "This capability focuses on creating and maintaining unique value that distinguishes products and services from competitors.",
    "The purpose is to ensure that customers clearly understand why the product is valuable and why it should be chosen over alternatives.",
    "Organizations mature in this area continuously strengthen product differentiation through innovation, customer value, industry expertise, service quality, and user experience.",
    "Strong differentiation improves market positioning, customer preference, and long-term competitiveness.",
  ],
  "Build Compelling Customer Experiences": [
    "This capability focuses on designing and delivering seamless, valuable, and customer-centric experiences across all product interactions.",
    "The purpose is to ensure that customers experience products and services as intuitive, efficient, and valuable throughout the entire lifecycle.",
    "Organizations mature in this area continuously improve usability, accessibility, onboarding, support, and customer interactions based on feedback and customer insights.",
    "Strong customer experiences increase satisfaction, adoption, loyalty, and long-term customer value.",
  ],
  "Accelerate Time to Market": [
    "This capability focuses on improving the organization's ability to deliver products, features, and improvements quickly and efficiently while maintaining quality, governance, and operational stability.",
    "Organizations mature in this area optimize development processes, collaboration models, tooling, and delivery practices to reduce delays and improve responsiveness to market and customer needs.",
    "The objective is not simply faster delivery, but predictable, sustainable, and value-driven execution.",
  ],
  "Manage Product Launch": [
    "This capability focuses on planning, coordinating, and executing successful product launches and releases.",
    "The purpose is to ensure that products, features, or services are introduced to customers and the organization in a structured, predictable, and operationally ready manner.",
    "Organizations mature in this area establish standardized launch processes that align business, product, operational, and customer-facing teams.",
    "Strong launch management improves customer adoption, operational stability, communication quality, and overall go-to-market effectiveness.",
  ],
  "Communicate Product Value": [
    "This capability focuses on clearly communicating the value, purpose, and benefits of products and services to customers, stakeholders, and internal teams.",
    "The purpose is to ensure that customers understand what the product does, which problems it solves, why it matters, how it creates value, and why it differs from alternatives.",
    "Organizations mature in this area create clear, consistent, and customer-focused messaging aligned with both customer outcomes and business objectives.",
    "Strong communication improves customer understanding, adoption, trust, and commercial effectiveness.",
  ],
  "Price Products": [
    "This capability focuses on establishing pricing models and commercial structures that align customer value with business objectives, market conditions, and product strategy.",
    "Organizations mature in this area continuously evaluate pricing approaches to ensure that products remain competitive, commercially sustainable, and aligned with customer expectations.",
    "Effective pricing supports customer adoption, profitability, market positioning, and long-term business growth.",
  ],
  "Measure Business Unit Performance": [
    "This capability focuses on measuring product performance, operational effectiveness, customer outcomes, and business impact through structured metrics, reporting, and governance processes.",
    "Organizations mature in this area establish measurable KPIs and performance frameworks that support informed decision-making, continuous improvement, and strategic alignment.",
    "Performance measurement helps ensure that products deliver expected value throughout their lifecycle.",
  ],
  "Invest in Strong Teams": [
    "This capability focuses on building, developing, and maintaining the competencies, structures, and culture required for successful product lifecycle management.",
    "Organizations mature in this area recognize that strong products are built by strong teams.",
    "Success depends on having the right mix of business, technical, operational, and leadership competencies working together toward shared objectives.",
    "The purpose is to ensure that teams have the skills, support, governance, and collaboration models necessary to deliver sustainable customer and business value.",
    "Strong teams improve execution quality, innovation capability, collaboration, and long-term organizational maturity.",
  ],
  "Optimize Lifecycle Events": [
    "This capability focuses on managing important lifecycle transitions and operational events in a structured, predictable, and controlled manner.",
    "Products and services continuously evolve through releases, upgrades, migrations, scaling activities, operational transitions, and eventual retirement.",
    "Organizations mature in this area establish governance and processes that reduce operational risk while maintaining continuity and customer trust.",
    "The purpose is to ensure that lifecycle transitions are handled efficiently, consistently, and with minimal disruption to customers and business operations.",
  ],
  "Manage Innovation and Evolution": [
    "This capability focuses on continuously improving, modernizing, and evolving products and services to remain relevant, competitive, and aligned with changing customer and market expectations.",
    "Organizations mature in this area treat innovation as an ongoing discipline rather than isolated initiatives.",
    "Innovation includes both major strategic changes and continuous incremental improvements.",
    "The purpose is to ensure that products continue creating value over time while adapting to technological, operational, and market developments.",
  ],
  "Harness Disruption": [
    "This capability focuses on identifying, understanding, and responding proactively to external disruptions that may impact products, customers, markets, or business operations.",
    "Disruption may come from technological advances, regulatory changes, market shifts, economic conditions, competitor innovation, or evolving customer behavior.",
    "Organizations mature in this area actively monitor external developments and adapt before disruption becomes a significant business risk.",
    "The purpose is to improve resilience, adaptability, and strategic readiness across the product lifecycle.",
  ],
  "Achieve Financial Objectives": [
    "This capability focuses on ensuring that products and services contribute positively to financial performance, business growth, and long-term organizational sustainability.",
    "Organizations mature in this area align product decisions, investments, pricing, and operational activities with defined financial goals and measurable business outcomes.",
    "The purpose is to balance customer value creation with profitability, operational efficiency, and sustainable growth.",
    "Strong financial management improves investment quality, accountability, and long-term business performance.",
  ],
  "Collaborate to Drive Business": [
    "This capability focuses on strengthening collaboration, alignment, and shared ownership across departments, leadership teams, and operational units involved in the product lifecycle.",
    "Successful product management depends on effective collaboration between product teams, sales, marketing, delivery, operations, architecture, finance, leadership, and support organizations.",
    "Organizations mature in this area establish clear communication structures, governance models, and collaboration practices that reduce silos and improve decision-making.",
    "The purpose is to ensure that all stakeholders work toward shared business objectives and customer outcomes throughout the product lifecycle.",
    "Strong collaboration improves execution quality, operational efficiency, customer experience, and organizational alignment.",
  ],
  "Package Products": [
    "This capability focuses on structuring products and services into scalable, understandable, and commercially effective offerings.",
    "Product packaging influences how customers understand, purchase, adopt, and consume products and services.",
    "Organizations mature in this area establish clear portfolio structures, commercial models, service definitions, and packaging standards aligned with both customer needs and business objectives.",
    "The purpose is to ensure that offerings are easy to understand, operationally manageable, and commercially scalable throughout the product lifecycle.",
    "Strong product packaging improves customer clarity, operational efficiency, sales effectiveness, and long-term scalability.",
  ],
  "Improve Cross-Departmental Collaboration": [
    "This capability focuses on improving collaboration, communication, and alignment across organizational boundaries to support successful product lifecycle management.",
    "Organizations mature in this area reduce silos and establish structures that improve coordination between departments, leadership teams, and operational functions.",
    "The purpose is to ensure that information flows efficiently across the organization and that teams collaborate effectively toward shared customer and business outcomes.",
    "Strong cross-departmental collaboration improves decision-making, execution quality, operational efficiency, and organizational alignment.",
  ],
  "Invest in the Right Tools": [
    "This capability focuses on enabling effective product lifecycle management through appropriate tools, platforms, systems, and supporting technologies.",
    "Organizations mature in this area ensure that tooling supports collaboration, planning, delivery, governance, reporting, customer insight management, and operational efficiency across the product lifecycle.",
    "The purpose is to ensure that teams have access to reliable, scalable, and integrated tools that improve productivity, visibility, and decision-making.",
    "Strong tooling capabilities improve operational consistency, collaboration quality, automation, and organizational scalability.",
  ],
  "Improve PM Approaches": [
    "This capability focuses on continuously improving product management methodologies, governance models, frameworks, standards, and organizational best practices.",
    "Organizations mature in this area actively evaluate how product management is performed across the organization and continuously optimize processes, governance, and ways of working.",
    "The purpose is to improve consistency, scalability, decision-making quality, and organizational maturity across the entire product lifecycle.",
    "Strong product management practices improve alignment, execution quality, governance effectiveness, and long-term business outcomes.",
  ],
};

const capabilityTitleAliases = {
  "Build Compelling CX": "Build Compelling Customer Experiences",
  "Optimize Life Cycle Events": "Optimize Lifecycle Events",
  "Improve Cross-Departmental Collab.": "Improve Cross-Departmental Collaboration",
  "Manage Innovation": "Manage Innovation and Evolution",
};

const moduleOutputs = {
  "Know the Customer": [
    "Customer segmentation overview",
    "Defined customer personas",
    "Customer journey maps",
    "Stakeholder relationship overview",
    "Customer pain point overview",
    "Product usage and adoption insights",
    "Customer feedback repository",
    "Customer satisfaction metrics",
  ],
  "Size the Market Opportunity": [
    "Target market definition",
    "Market size assessment",
    "Market growth analysis",
    "Industry trend overview",
    "Opportunity assessment",
    "Business case evaluations",
    "Market risk overview",
  ],
  "Know the Competitors": [
    "Competitor benchmarking analysis",
    "Product differentiation overview",
    "Competitive pricing comparison",
    "Competitor strengths and weaknesses analysis",
    "Competitive risk overview",
  ],
  "Create the Product Strategy": [
    "Product strategy document",
    "Strategic product roadmap",
    "Defined product objectives and KPIs",
    "Product governance structure",
  ],
  "Prioritize Product Investments": [
    "Prioritized initiative portfolio",
    "Investment evaluation criteria",
    "Resource and capacity overview",
    "Investment decision framework",
  ],
  "Differentiate Products": [
    "Product value proposition",
    "Product differentiation strategy",
    "Unique capability overview",
  ],
  "Build Compelling Customer Experiences": [
    "Customer journey improvement plan",
    "Accessibility standards",
    "Customer onboarding framework",
    "Customer support experience metrics",
  ],
  "Accelerate Time to Market": [
    "Standardized delivery process",
    "Agile delivery framework",
    "Release management process",
    "CI/CD implementation overview",
    "Lead time reporting",
  ],
  "Manage Product Launch": [
    "Product launch plan",
    "Go-live readiness assessment",
    "Stakeholder communication plan",
    "Operational readiness checklist",
    "Customer enablement material",
    "Launch risk assessment",
  ],
  "Communicate Product Value": [
    "Product messaging framework",
    "Customer value proposition",
    "Sales enablement material",
    "Product communication guidelines",
    "Customer-facing product documentation",
    "Product training material",
  ],
  "Price Products": [
    "Pricing strategy",
    "Commercial pricing model",
    "Competitive pricing analysis",
    "Pricing governance process",
  ],
  "Measure Business Unit Performance": [
    "Business KPI framework",
    "Product performance dashboard",
    "Operational performance reporting",
    "Customer adoption metrics",
    "Financial performance reporting",
  ],
  "Invest in Strong Teams": [
    "Competency framework",
    "Defined team roles and responsibilities",
    "Capability assessment overview",
    "Training and development plan",
    "Knowledge sharing structure",
  ],
  "Optimize Lifecycle Events": [
    "Lifecycle governance model",
    "Release and upgrade schedule",
    "Migration and transition plans",
    "Product retirement process",
    "Operational readiness assessments",
  ],
  "Manage Innovation and Evolution": [
    "Innovation management process",
    "Product improvement backlog",
    "Innovation prioritization overview",
    "Proof-of-concept evaluation process",
  ],
  "Harness Disruption": [
    "Disruption risk assessment",
    "Regulatory impact assessment",
    "Strategic risk overview",
    "Business continuity considerations",
  ],
  "Achieve Financial Objectives": [
    "Financial objectives and targets",
    "Revenue performance reporting",
    "Profitability analysis",
    "Cost optimization initiatives",
    "ROI assessments",
    "Financial forecasting overview",
    "Financial governance structure",
  ],
  "Collaborate to Drive Business": [
    "Cross-functional governance structure",
    "Shared business objectives",
    "Decision-making responsibilities",
  ],
  "Package Products": [
    "Product and service catalog",
    "Product packaging model",
    "Licensing and subscription structure",
    "Portfolio governance model",
  ],
  "Improve Cross-Departmental Collaboration": [
    "Cross-department collaboration model",
    "Shared governance structure",
    "Stakeholder dependency overview",
  ],
  "Invest in the Right Tools": [
    "CRM for Sales Pipeline",
    "CRM for Backlogs",
    "CRM for Innovation process",
    "PO for Resourcebookings",
    "Business Central for Finance",
    "Employe Portal for Knowledge Sharing",
    "Power BI for Reporting",
    "Public Website for Marketing",
    "Featurebase for External Facing Documentation",
    "Featurebase for Roadmaps",
    "Customer Care Portal for Customer Service",
    "Evidi Hub for Internal Product Documentation",
    "DevOps/GitHub for Technical Documentation",
  ],
  "Improve PM Approaches": [
    "PM governance standards",
    "Product maturity model",
    "Standardized PM methodologies",
    "Continuous improvement roadmap",
  ],
};

const criticalOutputsByModule = {
  "Know the Customer": ["Defined customer personas"],
  "Size the Market Opportunity": ["Target market definition"],
  "Know the Competitors": ["Competitor benchmarking analysis"],
  "Create the Product Strategy": ["Product strategy document"],
  "Prioritize Product Investments": ["Prioritized initiative portfolio"],
  "Differentiate Products": ["Product value proposition"],
  "Accelerate Time to Market": ["Standardized delivery process"],
  "Manage Product Launch": ["Product launch plan", "Go-live readiness assessment"],
  "Communicate Product Value": ["Customer value proposition"],
  "Price Products": ["Commercial pricing model"],
  "Measure Business Unit Performance": ["Product performance dashboard"],
  "Optimize Lifecycle Events": ["Lifecycle governance model"],
  "Package Products": ["Product and service catalog"],
  "Improve PM Approaches": ["PM governance standards"],
  "Achieve Financial Objectives": ["Financial performance reporting"],
};

const moduleLinks = {
  // Add module template links here - structure: "Module Name": [{ name: "Link Text", url: "#" }]
  // Example: "Know the Customer": [{ name: "Customer Research Template", url: "#" }]
  "Know the Customer": [
    { name: "Customer Research Template", url: "#" },
    { name: "Persona Development Guide", url: "#" },
  ],
};

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function resolveCapabilityKey(title) {
  return capabilityTitleAliases[title] || title;
}

function normalizeModuleLanguage(lines) {
  return lines.map((line) =>
    line
      .replace(/\bCapabilities\b/g, "Modules")
      .replace(/\bcapabilities\b/g, "modules")
      .replace(/\bCapability\b/g, "Module")
      .replace(/\bcapability\b/g, "module")
  );
}

function buildCapabilityLines(title, desc) {
  const key = resolveCapabilityKey(title);
  const summaryLines = capabilityContent[key];
  if (summaryLines && summaryLines.length > 0) {
    return normalizeModuleLanguage(summaryLines);
  }

  return normalizeModuleLanguage([
    `${title} defines the focus area for this capability in the lifecycle model.`,
    `Core intent: ${desc}.`,
  ]);
}

function buildModuleOutputs(title) {
  const key = resolveCapabilityKey(title);
  const outputs = moduleOutputs[key];
  if (outputs && outputs.length > 0) {
    return outputs;
  }

  return [
    `Primary outputs for ${key} will be added.`,
    "Standard output templates will be connected in this section.",
    "Governance and evidence outputs will be expanded over time.",
  ];
}

function isCriticalOutput(moduleTitle, outputText) {
  const key = resolveCapabilityKey(moduleTitle);
  const criticalOutputs = criticalOutputsByModule[key] || [];
  return criticalOutputs.includes(outputText);
}

function resolvePhaseLevel(phasePercent, criticalMet) {
  if (!criticalMet) {
    return "Level 2 - Emerging";
  }
  if (phasePercent <= 20) {
    return "Level 1 - Initial";
  }
  if (phasePercent <= 40) {
    return "Level 2 - Emerging";
  }
  if (phasePercent <= 60) {
    return "Level 3 - Established";
  }
  if (phasePercent <= 80) {
    return "Level 4 - Scalable";
  }
  return "Level 5 - Mature";
}

function resolvePhaseStatus(phasePercent, targetPercent, criticalMet) {
  if (!criticalMet) {
    return "Below expectation";
  }
  if (phasePercent >= targetPercent + 10) {
    return "Strong";
  }
  if (phasePercent >= targetPercent) {
    return "Mature enough";
  }
  if (phasePercent >= targetPercent - 10) {
    return "On track";
  }
  return "Below expectation";
}

function renderPhaseOverview(phaseStates) {
  if (!maturityPhaseOverview) {
    return;
  }

  maturityPhaseOverview.innerHTML = "";

  for (const phaseState of phaseStates) {
    const card = document.createElement("article");
    card.className = "maturity-phase-card";
    card.setAttribute("data-phase", phaseState.phase);
    card.setAttribute("data-status", phaseState.status);

    const title = document.createElement("h4");
    title.className = "maturity-phase-card-title";
    title.textContent = phaseState.phase;

    const score = document.createElement("strong");
    score.className = "maturity-phase-card-percent";
    score.textContent = `${Math.round(phaseState.phasePercent)}%`;

    const target = document.createElement("div");
    target.className = "maturity-phase-card-meta";
    target.textContent = `Target ${Math.round(phaseState.targetPercent)}%`;

    const gap = document.createElement("div");
    gap.className = "maturity-phase-card-gap";
    const gapValue = Math.round(phaseState.phasePercent - phaseState.targetPercent);
    if (gapValue >= 0) {
      gap.textContent = `+${gapValue}% vs target`;
      gap.setAttribute("data-gap", "positive");
    } else {
      gap.textContent = `${gapValue}% vs target`;
      gap.setAttribute("data-gap", "negative");
    }

    const critical = document.createElement("div");
    critical.className = "maturity-phase-card-meta";
    critical.textContent = `Critical ${phaseState.criticalChecked}/${phaseState.criticalTotal}`;

    const status = document.createElement("div");
    status.className = "maturity-phase-card-status";
    status.textContent = phaseState.status;

    card.appendChild(title);
    card.appendChild(score);
    card.appendChild(target);
    card.appendChild(gap);
    card.appendChild(critical);
    card.appendChild(status);
    maturityPhaseOverview.appendChild(card);
  }
}

function buildModuleLinks(title) {
  const key = resolveCapabilityKey(title);
  const links = moduleLinks[key];
  return links || [];
}

function highlightTarget(target) {
  if (!target) {
    return;
  }

  document.querySelectorAll(".is-focused").forEach((el) => {
    el.classList.remove("is-focused");
  });

  target.classList.add("is-focused");

  window.clearTimeout(focusResetTimer);
  focusResetTimer = window.setTimeout(() => {
    target.classList.remove("is-focused");
  }, 2400);
}

function jumpToTarget(target) {
  if (!target) {
    return;
  }

  target.scrollIntoView({ behavior: "smooth", block: "start" });
  highlightTarget(target);
}

function setFloatingNavState(open) {
  if (!floatingNav || !floatingNavToggle) {
    return;
  }

  floatingNav.classList.toggle("is-collapsed", !open);
  floatingNavToggle.setAttribute("aria-expanded", open ? "true" : "false");
  floatingNavToggle.textContent = open ? "Close Navigation" : "Navigation";
}

function addNavListItem(label, targetId) {
  if (!floatingNavList) {
    return;
  }

  const listItem = document.createElement("li");
  const link = document.createElement("a");
  link.href = `#${targetId}`;
  link.textContent = label;
  link.addEventListener("click", (event) => {
    event.preventDefault();
    const target = document.querySelector(`#${targetId}`);
    jumpToTarget(target);
  });

  listItem.appendChild(link);
  floatingNavList.appendChild(listItem);
}

function buildFloatingNavigation() {
  if (!floatingNavList) {
    return;
  }

  floatingNavList.innerHTML = "";
  addNavListItem("Home", "top");

  const topLevelSections = document.querySelectorAll("main > section[id]");
  for (const section of topLevelSections) {
    const heading = section.querySelector(".section-title");
    if (heading) {
      addNavListItem(heading.textContent.trim(), section.id);
    }
  }
}

function updateContentSearchStatus(message) {
  if (!contentSearchStatus) {
    return;
  }

  contentSearchStatus.textContent = message;
}

function updateSearchNextButtonVisibility() {
  if (!contentSearchNextButton) {
    return;
  }

  contentSearchNextButton.hidden = searchMatchedEntries.length < 2;
}

function clearHighlights(root) {
  if (!root) {
    return;
  }

  const highlightMarks = root.querySelectorAll("mark.search-highlight");
  for (const mark of highlightMarks) {
    const parent = mark.parentNode;
    if (!parent) {
      continue;
    }

    parent.replaceChild(document.createTextNode(mark.textContent || ""), mark);
    parent.normalize();
  }
}

function collectTextMatches(root, query) {
  if (!root || !query) {
    return [];
  }

  const queryLower = query.toLowerCase();
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const textNodes = [];

  while (walker.nextNode()) {
    const textNode = walker.currentNode;
    const parent = textNode.parentElement;
    if (!parent) {
      continue;
    }

    if (parent.closest("script, style, input, button, textarea")) {
      continue;
    }

    const textValue = textNode.textContent || "";
    if (!textValue.trim()) {
      continue;
    }

    if (textValue.toLowerCase().includes(queryLower)) {
      textNodes.push(textNode);
    }
  }

  const marks = [];

  for (const textNode of textNodes) {
    const textValue = textNode.textContent || "";
    const lower = textValue.toLowerCase();
    let cursor = 0;
    let matchIndex = lower.indexOf(queryLower, cursor);

    if (matchIndex === -1) {
      continue;
    }

    const fragment = document.createDocumentFragment();

    while (matchIndex !== -1) {
      if (matchIndex > cursor) {
        fragment.appendChild(document.createTextNode(textValue.slice(cursor, matchIndex)));
      }

      const mark = document.createElement("mark");
      mark.className = "search-highlight";
      mark.textContent = textValue.slice(matchIndex, matchIndex + queryLower.length);
      fragment.appendChild(mark);
      marks.push(mark);

      cursor = matchIndex + queryLower.length;
      matchIndex = lower.indexOf(queryLower, cursor);
    }

    if (cursor < textValue.length) {
      fragment.appendChild(document.createTextNode(textValue.slice(cursor)));
    }

    const parent = textNode.parentNode;
    if (parent) {
      parent.replaceChild(fragment, textNode);
    }
  }

  return marks;
}

function clearSearchCurrentState() {
  for (const entry of searchMatchedEntries) {
    entry.card.classList.remove("is-search-current");
    entry.section.classList.remove("is-search-current");

    for (const mark of entry.marks || []) {
      mark.classList.remove("search-highlight-current");
    }
  }
}

function setCurrentSearchMatch(index, shouldJump) {
  if (searchMatchedEntries.length === 0) {
    currentSearchMatchIndex = -1;
    return;
  }

  const normalizedIndex = ((index % searchMatchedEntries.length) + searchMatchedEntries.length) % searchMatchedEntries.length;
  currentSearchMatchIndex = normalizedIndex;
  clearSearchCurrentState();

  const currentEntry = searchMatchedEntries[currentSearchMatchIndex];
  currentEntry.card.classList.add("is-search-current");
  currentEntry.section.classList.add("is-search-current");

  for (const mark of currentEntry.marks || []) {
    mark.classList.add("search-highlight-current");
  }

  if (shouldJump) {
    jumpToTarget(currentEntry.section);
  }

  updateContentSearchStatus(`${currentSearchMatchIndex + 1}/${searchMatchedEntries.length} matches`);
}

function buildSearchEntries() {
  moduleSearchEntries = [];

  for (const card of frameworkCards) {
    const sectionId = card.getAttribute("data-section-id");
    if (!sectionId) {
      continue;
    }

    const section = document.querySelector(`#${sectionId}`);
    if (!section) {
      continue;
    }

    const rawTitle = card.getAttribute("data-title") || "Module";
    const title = resolveCapabilityKey(rawTitle);
    const desc = card.getAttribute("data-desc") || "";
    const searchableText = `${title} ${desc} ${section.textContent || ""}`.toLowerCase();

    moduleSearchEntries.push({
      card,
      section,
      searchableText,
      marks: [],
    });
  }
}

function applyContentSearch(rawQuery) {
  const query = rawQuery.trim().toLowerCase();
  firstSearchMatch = null;

  if (moduleSearchEntries.length === 0) {
    buildSearchEntries();
  }

  searchMatchedEntries = [];
  currentSearchMatchIndex = -1;

  if (!query) {
    for (const entry of moduleSearchEntries) {
      clearHighlights(entry.card);
      clearHighlights(entry.section);
      entry.marks = [];
      entry.card.classList.remove("is-search-hidden", "is-search-match", "is-search-current");
      entry.section.classList.remove("is-search-hidden", "is-search-match", "is-search-current");
    }

    updateContentSearchStatus("");
    updateSearchNextButtonVisibility();
    return;
  }

  let matchCount = 0;

  for (const entry of moduleSearchEntries) {
    clearHighlights(entry.card);
    clearHighlights(entry.section);

    const isMatch = entry.searchableText.includes(query);
    entry.card.classList.toggle("is-search-hidden", !isMatch);
    entry.card.classList.toggle("is-search-match", isMatch);
    entry.card.classList.remove("is-search-current");
    entry.section.classList.toggle("is-search-hidden", !isMatch);
    entry.section.classList.toggle("is-search-match", isMatch);
    entry.section.classList.remove("is-search-current");
    entry.marks = [];

    if (isMatch) {
      matchCount += 1;
      entry.marks = [
        ...collectTextMatches(entry.card, query),
        ...collectTextMatches(entry.section, query),
      ];
      searchMatchedEntries.push(entry);
      if (!firstSearchMatch) {
        firstSearchMatch = entry.section;
      }
    }
  }

  if (matchCount === 0) {
    updateContentSearchStatus(`No matches for "${rawQuery.trim()}"`);
    updateSearchNextButtonVisibility();
    return;
  }

  updateSearchNextButtonVisibility();
  setCurrentSearchMatch(0, false);
}

function toTwoDecimals(value) {
  return value.toFixed(2);
}

function toCompactLabel(value) {
  return value.length > 18 ? `${value.slice(0, 15)}...` : value;
}

function getPhaseIndex(phase) {
  const index = phaseOrder.indexOf(phase);
  return index === -1 ? phaseOrder.length - 1 : index;
}

function getModuleProgress(section) {
  const checkboxes = section.querySelectorAll('.checklist-item input[type="checkbox"]');
  const totalChecklistPoints = checkboxes.length;
  const criticalCheckboxes = Array.from(checkboxes).filter(
    (checkbox) => checkbox.dataset.critical === "true"
  );

  if (totalChecklistPoints === 0) {
    return {
      score: 0,
      checkedCount: 0,
      totalChecklistPoints: 0,
      criticalCheckedCount: 0,
      criticalChecklistPoints: 0,
    };
  }

  const checkedCount = Array.from(checkboxes).filter((checkbox) => checkbox.checked).length;
  const criticalCheckedCount = criticalCheckboxes.filter((checkbox) => checkbox.checked).length;
  const scorePerChecklistPoint = 5 / totalChecklistPoints;
  const score = checkedCount * scorePerChecklistPoint;

  return {
    score,
    checkedCount,
    totalChecklistPoints,
    criticalCheckedCount,
    criticalChecklistPoints: criticalCheckboxes.length,
  };
}

function drawMaturityRadar(values) {
  if (!maturityRadar) {
    return;
  }

  maturityRadar.innerHTML = "";

  const axisCount = values.length;
  if (axisCount < 3) {
    return;
  }

  const namespace = "http://www.w3.org/2000/svg";
  const center = 380;
  const outerRadius = 275;
  const ringCount = 5;
  const maxPerModule = 5;
  const chartModules = maturityModules
    .map((moduleRef, index) => ({
      title: moduleRef.title,
      phase: resolveModulePhase(moduleRef.title),
      value: values[index] || 0,
    }))
    .sort((left, right) => {
      const phaseDiff = getPhaseIndex(left.phase) - getPhaseIndex(right.phase);
      if (phaseDiff !== 0) {
        return phaseDiff;
      }
      return left.title.localeCompare(right.title);
    });

  const phaseGroups = phaseOrder
    .map((phase) => ({
      phase,
      modules: chartModules.filter((moduleState) => moduleState.phase === phase),
    }))
    .filter((group) => group.modules.length > 0);

  const sectorAngle = (Math.PI * 2) / 4;
  const sectorStartAngles = phaseOrder.map((_, index) => -Math.PI / 2 + index * sectorAngle);

  for (let sectorIndex = 0; sectorIndex < phaseOrder.length; sectorIndex += 1) {
    const phase = phaseOrder[sectorIndex];
    const theme = phaseTheme[phase];
    const startAngle = sectorStartAngles[sectorIndex];
    const endAngle = startAngle + sectorAngle;
    const startX = center + Math.cos(startAngle) * outerRadius;
    const startY = center + Math.sin(startAngle) * outerRadius;
    const endX = center + Math.cos(endAngle) * outerRadius;
    const endY = center + Math.sin(endAngle) * outerRadius;

    const sector = document.createElementNS(namespace, "path");
    sector.setAttribute(
      "d",
      [
        `M ${center} ${center}`,
        `L ${startX.toFixed(3)} ${startY.toFixed(3)}`,
        `A ${outerRadius} ${outerRadius} 0 0 1 ${endX.toFixed(3)} ${endY.toFixed(3)}`,
        "Z",
      ].join(" ")
    );
    sector.setAttribute("fill", theme.fill);
    sector.setAttribute("stroke", theme.stroke);
    sector.setAttribute("class", "radar-sector");
    maturityRadar.appendChild(sector);
  }

  for (let ringIndex = 1; ringIndex <= ringCount; ringIndex += 1) {
    const radius = (outerRadius * ringIndex) / ringCount;
    const ring = document.createElementNS(namespace, "circle");
    ring.setAttribute("cx", String(center));
    ring.setAttribute("cy", String(center));
    ring.setAttribute("r", String(radius));
    ring.setAttribute("class", "radar-ring");
    maturityRadar.appendChild(ring);
  }

  const points = [];

  for (let axisIndex = 0; axisIndex < axisCount; axisIndex += 1) {
    const moduleState = chartModules[axisIndex];
    const phaseIndex = getPhaseIndex(moduleState.phase);
    const phaseGroup = phaseGroups.find((group) => group.phase === moduleState.phase);
    const phasePosition = phaseGroup ? phaseGroup.modules.indexOf(moduleState) : 0;
    const phaseCount = phaseGroup ? phaseGroup.modules.length : 1;
    const phaseStart = sectorStartAngles[phaseIndex];
    const phaseSpan = sectorAngle;
    const innerMargin = phaseSpan * 0.16;
    const usableSpan = phaseSpan - innerMargin * 2;
    const angle =
      phaseStart + innerMargin + ((phasePosition + 1) / (phaseCount + 1)) * usableSpan;
    const axisX = center + Math.cos(angle) * outerRadius;
    const axisY = center + Math.sin(angle) * outerRadius;

    const axis = document.createElementNS(namespace, "line");
    axis.setAttribute("x1", String(center));
    axis.setAttribute("y1", String(center));
    axis.setAttribute("x2", axisX.toFixed(3));
    axis.setAttribute("y2", axisY.toFixed(3));
    axis.setAttribute("class", "radar-axis");
    axis.setAttribute("stroke", phaseTheme[moduleState.phase]?.stroke || "rgba(28, 78, 80, 0.24)");
    maturityRadar.appendChild(axis);

    const labelRadius = outerRadius + 32;
    const labelX = center + Math.cos(angle) * labelRadius;
    const labelY = center + Math.sin(angle) * labelRadius;
    const label = document.createElementNS(namespace, "text");
    label.setAttribute("x", labelX.toFixed(3));
    label.setAttribute("y", labelY.toFixed(3));
    label.setAttribute("class", "radar-label");
    label.setAttribute("dominant-baseline", "middle");
    label.setAttribute("fill", phaseTheme[moduleState.phase]?.accent || "#1c4e50");
    label.textContent = toCompactLabel(moduleState.title);
    maturityRadar.appendChild(label);

    const normalizedValue = Math.max(0, Math.min(moduleState.value, maxPerModule)) / maxPerModule;
    const pointRadius = normalizedValue * outerRadius;
    const pointX = center + Math.cos(angle) * pointRadius;
    const pointY = center + Math.sin(angle) * pointRadius;
    points.push({ x: pointX, y: pointY });
  }

  for (const group of phaseGroups) {
    const phaseIndex = getPhaseIndex(group.phase);
    const angle = sectorStartAngles[phaseIndex] + sectorAngle / 2;
    const labelRadius = outerRadius - 58;
    const labelX = center + Math.cos(angle) * labelRadius;
    const labelY = center + Math.sin(angle) * labelRadius;

    const phaseLabel = document.createElementNS(namespace, "text");
    phaseLabel.setAttribute("x", labelX.toFixed(3));
    phaseLabel.setAttribute("y", labelY.toFixed(3));
    phaseLabel.setAttribute("class", "radar-phase-label");
    phaseLabel.setAttribute("dominant-baseline", "middle");
    phaseLabel.setAttribute("fill", phaseTheme[group.phase]?.accent || "#1d565b");
    phaseLabel.textContent = group.phase;
    maturityRadar.appendChild(phaseLabel);
  }

  const polygon = document.createElementNS(namespace, "polygon");
  polygon.setAttribute(
    "points",
    points.map((point) => `${point.x.toFixed(3)},${point.y.toFixed(3)}`).join(" ")
  );
  polygon.setAttribute("class", "radar-shape");
  maturityRadar.appendChild(polygon);

  for (const point of points) {
    const dot = document.createElementNS(namespace, "circle");
    dot.setAttribute("cx", point.x.toFixed(3));
    dot.setAttribute("cy", point.y.toFixed(3));
    dot.setAttribute("r", "3.3");
    dot.setAttribute("class", "radar-point");
    maturityRadar.appendChild(dot);
  }
}

function resolveModulePhase(moduleTitle) {
  return modulePhaseMap[moduleTitle] || "Other";
}

function buildMaturityScoreList(moduleStates) {
  if (!maturityPhaseList) {
    return;
  }

  maturityPhaseList.innerHTML = "";

  const groupedStates = new Map();
  for (const moduleState of moduleStates) {
    const phase = resolveModulePhase(moduleState.title);
    if (!groupedStates.has(phase)) {
      groupedStates.set(phase, []);
    }
    groupedStates.get(phase).push(moduleState);
  }

  const orderedPhases = phaseOrder.filter((phase) => groupedStates.has(phase));
  const phaseStates = [];

  for (const phase of orderedPhases) {
    const modulesInPhase = groupedStates.get(phase);
    const phaseScore = modulesInPhase.reduce((sum, moduleState) => sum + moduleState.score, 0);
    const phaseMaxScore = modulesInPhase.length * 5;
    const phasePercent = phaseMaxScore > 0 ? (phaseScore / phaseMaxScore) * 100 : 0;
    const targetPercent = (phaseTargets[phase] || 0) * 100;
    const criticalTotal = modulesInPhase.reduce(
      (sum, moduleState) => sum + moduleState.criticalChecklistPoints,
      0
    );
    const criticalChecked = modulesInPhase.reduce(
      (sum, moduleState) => sum + moduleState.criticalCheckedCount,
      0
    );
    const criticalMet = criticalTotal === 0 ? true : criticalChecked === criticalTotal;
    const phaseLevel = resolvePhaseLevel(phasePercent, criticalMet);
    const phaseStatus = resolvePhaseStatus(phasePercent, targetPercent, criticalMet);

    phaseStates.push({
      phase,
      phasePercent,
      targetPercent,
      criticalChecked,
      criticalTotal,
      status: phaseStatus,
    });

    const details = document.createElement("details");
    details.className = "maturity-phase-group";
    details.setAttribute("data-phase", phase);
    details.setAttribute("data-status", phaseStatus);

    details.open = true;

    const summary = document.createElement("summary");
    summary.addEventListener("click", (event) => {
      event.preventDefault();
      details.open = !details.open;
    });

    const summaryRow = document.createElement("div");
    summaryRow.className = "maturity-phase-summary";

    const phaseName = document.createElement("span");
    phaseName.className = "maturity-phase-name";
    phaseName.innerHTML = `<span class="maturity-phase-pill"><span class="maturity-phase-dot" style="background:${phaseTheme[phase]?.accent || '#1d565b'}"></span><span>${phase}</span></span>`;

    const phaseValue = document.createElement("span");
    phaseValue.className = "maturity-phase-value";
    phaseValue.textContent = `${Math.round(phasePercent)}% current`;

    const metaRow = document.createElement("div");
    metaRow.className = "maturity-phase-meta";

    const targetBadge = document.createElement("span");
    targetBadge.className = "maturity-phase-badge";
    targetBadge.textContent = `Target ${Math.round(targetPercent)}%`;

    const criticalBadge = document.createElement("span");
    criticalBadge.className = `maturity-phase-badge ${criticalMet ? "is-good" : "is-warning"}`;
    criticalBadge.textContent = `Critical ${criticalChecked}/${criticalTotal}`;

    const levelBadge = document.createElement("span");
    levelBadge.className = "maturity-phase-badge";
    levelBadge.textContent = phaseLevel;

    const statusBadge = document.createElement("span");
    statusBadge.className = `maturity-phase-badge ${phaseStatus
      .toLowerCase()
      .replace(/[^a-z]+/g, "-")}`;
    statusBadge.textContent = phaseStatus;

    summaryRow.appendChild(phaseName);
    summaryRow.appendChild(phaseValue);
    summary.appendChild(summaryRow);
    metaRow.appendChild(targetBadge);
    metaRow.appendChild(criticalBadge);
    metaRow.appendChild(levelBadge);
    metaRow.appendChild(statusBadge);
    summary.appendChild(metaRow);
    details.appendChild(summary);

    const moduleList = document.createElement("div");
    moduleList.className = "maturity-phase-modules";

    for (const moduleState of modulesInPhase) {
      const listItem = document.createElement("div");
      listItem.className = "maturity-score-item";
      listItem.setAttribute("data-phase", phase);

      const header = document.createElement("div");
      header.className = "maturity-score-header";

      const name = document.createElement("span");
      name.className = "maturity-score-name";
      name.textContent = moduleState.title;

      const value = document.createElement("span");
      value.className = "maturity-score-value";
      value.textContent = `${toTwoDecimals(moduleState.score)} / 5.00`;

      if (moduleState.criticalChecklistPoints > 0) {
        value.textContent += ` | Critical ${moduleState.criticalCheckedCount}/${moduleState.criticalChecklistPoints}`;
      }

      header.appendChild(name);
      header.appendChild(value);

      const track = document.createElement("div");
      track.className = "maturity-score-track";

      const fill = document.createElement("div");
      fill.className = "maturity-score-fill";
      fill.style.width = `${(moduleState.score / 5) * 100}%`;

      track.appendChild(fill);
      listItem.appendChild(header);
      listItem.appendChild(track);
      moduleList.appendChild(listItem);
    }

    details.appendChild(moduleList);
    maturityPhaseList.appendChild(details);
  }

  renderPhaseOverview(phaseStates);
}

function updateMaturityModel() {
  if (maturityModules.length === 0) {
    return;
  }

  const moduleStates = maturityModules.map((moduleRef) => {
    const progress = getModuleProgress(moduleRef.section);
    return {
      title: moduleRef.title,
      score: progress.score,
      checkedCount: progress.checkedCount,
      totalChecklistPoints: progress.totalChecklistPoints,
      criticalCheckedCount: progress.criticalCheckedCount,
      criticalChecklistPoints: progress.criticalChecklistPoints,
      phase: resolveModulePhase(moduleRef.title),
    };
  });

  const sortedModuleStates = moduleStates.sort((left, right) => {
    const phaseDiff = getPhaseIndex(left.phase) - getPhaseIndex(right.phase);
    if (phaseDiff !== 0) {
      return phaseDiff;
    }
    return left.title.localeCompare(right.title);
  });

  const totalPoints = sortedModuleStates.reduce((sum, moduleState) => sum + moduleState.score, 0);
  const maxPoints = sortedModuleStates.length * 5;
  const maturityPercent = maxPoints > 0 ? (totalPoints / maxPoints) * 100 : 0;

  if (maturityCurrentPointsEl) {
    maturityCurrentPointsEl.textContent = toTwoDecimals(totalPoints);
  }
  if (maturityMaxPointsEl) {
    maturityMaxPointsEl.textContent = toTwoDecimals(maxPoints);
  }
  if (maturityPercentEl) {
    maturityPercentEl.textContent = `${Math.round(maturityPercent)}%`;
  }

  buildMaturityScoreList(sortedModuleStates);
  drawMaturityRadar(sortedModuleStates.map((moduleState) => moduleState.score));
}

function initializeMaturityModel() {
  if (!maturityRadar || !maturityPhaseList) {
    return;
  }

  maturityModules = Array.from(frameworkCards)
    .map((card) => {
      const sectionId = card.getAttribute("data-section-id");
      if (!sectionId) {
        return null;
      }

      const section = document.querySelector(`#${sectionId}`);
      if (!section) {
        return null;
      }

      const rawTitle = card.getAttribute("data-title") || "Module";
      const moduleTitle = resolveCapabilityKey(rawTitle);
      return {
        title: moduleTitle,
        phase: resolveModulePhase(moduleTitle),
        section,
      };
    })
    .filter((moduleRef) => moduleRef !== null);

  if (maturityModules.length === 0) {
    return;
  }

  updateMaturityModel();
}

if (capabilitySectionsList && frameworkCards.length > 0) {
  const slugCount = new Map();

  for (const card of frameworkCards) {
    const title = card.getAttribute("data-title") || "Capability";
    const desc = card.getAttribute("data-desc") || "Define scope and expected value";
    const baseSlug = slugify(title) || "capability";
    const count = (slugCount.get(baseSlug) || 0) + 1;
    slugCount.set(baseSlug, count);
    const slug = count === 1 ? baseSlug : `${baseSlug}-${count}`;
    const sectionId = `capability-${slug}`;
    card.setAttribute("data-section-id", sectionId);

    const article = document.createElement("article");
    article.className = "capability-section reveal";
    article.id = sectionId;
    article.setAttribute("data-module-key", resolveCapabilityKey(title));

    const heading = document.createElement("h3");
    heading.className = "capability-title";
    heading.textContent = resolveCapabilityKey(title);
    article.appendChild(heading);

    const textWrap = document.createElement("div");
    textWrap.className = "capability-text";
    const lines = buildCapabilityLines(title, desc);
    for (const line of lines) {
      const lineEl = document.createElement("p");
      lineEl.textContent = line;
      textWrap.appendChild(lineEl);
    }
    article.appendChild(textWrap);

    const toggleButton = document.createElement("button");
    toggleButton.type = "button";
    toggleButton.className = "capability-read-more";
    toggleButton.textContent = "Read more";
    toggleButton.setAttribute("aria-expanded", "false");
    toggleButton.addEventListener("click", () => {
      const expanded = textWrap.classList.toggle("is-expanded");
      toggleButton.textContent = expanded ? "Show less" : "Read more";
      toggleButton.setAttribute("aria-expanded", expanded ? "true" : "false");
    });
    article.appendChild(toggleButton);

    const checklist = document.createElement("div");
    checklist.className = "capability-checklist";

    const checklistTitle = document.createElement("h4");
    checklistTitle.textContent = "Outputs";
    checklist.appendChild(checklistTitle);

    const checklistItems = buildModuleOutputs(title);

    checklistItems.forEach((itemText, index) => {
      const itemId = `${sectionId}-item-${index + 1}`;
      const itemLabel = document.createElement("label");
      itemLabel.className = "checklist-item";
      if (isCriticalOutput(title, itemText)) {
        itemLabel.classList.add("is-critical-output");
      }

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.id = itemId;
      checkbox.dataset.critical = isCriticalOutput(title, itemText) ? "true" : "false";
      checkbox.addEventListener("change", updateMaturityModel);

      const span = document.createElement("span");
      span.textContent = itemText;

      itemLabel.appendChild(checkbox);
      itemLabel.appendChild(span);

      if (isCriticalOutput(title, itemText)) {
        const badge = document.createElement("span");
        badge.className = "critical-output-badge";
        badge.textContent = "Critical";
        itemLabel.appendChild(badge);
      }

      checklist.appendChild(itemLabel);
    });

    article.appendChild(checklist);

    // Add links section
    const moduleLinks = buildModuleLinks(title);
    if (moduleLinks.length > 0) {
      const linksSection = document.createElement("div");
      linksSection.className = "capability-links";

      const linksTitle = document.createElement("h4");
      linksTitle.textContent = "Templates & Resources";
      linksSection.appendChild(linksTitle);

      const linksList = document.createElement("div");
      linksList.className = "capability-links-list";

      moduleLinks.forEach((linkData) => {
        const linkItem = document.createElement("a");
        linkItem.className = "capability-link-item";
        linkItem.href = linkData.url;
        linkItem.textContent = linkData.name;
        linkItem.target = "_blank";
        linkItem.rel = "noopener noreferrer";
        linksList.appendChild(linkItem);
      });

      linksSection.appendChild(linksList);
      article.appendChild(linksSection);
    }

    capabilitySectionsList.appendChild(article);
    observer.observe(article);
  }
}

buildFloatingNavigation();
buildSearchEntries();
initializeMaturityModel();
updateSearchNextButtonVisibility();

if (contentSearchInput) {
  contentSearchInput.addEventListener("input", () => {
    applyContentSearch(contentSearchInput.value);
  });

  contentSearchInput.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      contentSearchInput.value = "";
      applyContentSearch("");
      return;
    }

    if (event.key === "Enter" && searchMatchedEntries.length > 0) {
      event.preventDefault();
      const currentEntry = searchMatchedEntries[currentSearchMatchIndex] || searchMatchedEntries[0];
      jumpToTarget(currentEntry.section);
    }
  });
}

if (contentSearchNextButton) {
  contentSearchNextButton.addEventListener("click", () => {
    if (searchMatchedEntries.length === 0) {
      return;
    }

    setCurrentSearchMatch(currentSearchMatchIndex + 1, true);
  });
}

if (floatingNavToggle) {
  floatingNavToggle.addEventListener("click", () => {
    const shouldOpen = floatingNav ? floatingNav.classList.contains("is-collapsed") : true;
    setFloatingNavState(shouldOpen);
  });
}

for (const card of frameworkCards) {
  card.addEventListener("click", () => {
    const sectionId = card.getAttribute("data-section-id");

    for (const c of frameworkCards) {
      c.classList.remove("is-active");
      c.setAttribute("aria-pressed", "false");
    }

    card.classList.add("is-active");
    card.setAttribute("aria-pressed", "true");

    if (sectionId) {
      const target = document.querySelector(`#${sectionId}`);
      jumpToTarget(target);
    }
  });
}

function closeTaxonomyOverlay() {
  if (!taxonomyOverlay) {
    return;
  }

  taxonomyOverlay.hidden = true;
  document.body.style.overflow = "";
}

function openTaxonomyOverlay(targetKey) {
  if (!taxonomyOverlay || !taxonomyOverlayTitle || !taxonomyOverlayContent || !targetKey) {
    return;
  }

  const template = document.querySelector(`#taxonomy-template-${targetKey}`);
  if (!(template instanceof HTMLTemplateElement)) {
    return;
  }

  const title = targetKey.charAt(0).toUpperCase() + targetKey.slice(1);
  taxonomyOverlayTitle.textContent = title;
  taxonomyOverlayContent.innerHTML = "";
  taxonomyOverlayContent.appendChild(template.content.cloneNode(true));

  taxonomyOverlay.hidden = false;
  document.body.style.overflow = "hidden";
}

for (const categoryButton of taxonomyCategoryButtons) {
  categoryButton.addEventListener("click", () => {
    const targetKey = categoryButton.getAttribute("data-taxonomy-target") || "";
    openTaxonomyOverlay(targetKey);
  });
}

for (const closeButton of taxonomyOverlayCloseButtons) {
  closeButton.addEventListener("click", closeTaxonomyOverlay);
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && taxonomyOverlay && !taxonomyOverlay.hidden) {
    closeTaxonomyOverlay();
  }
});

function getIdeaQuestionOption(question, optionValue) {
  if (!question || question.type !== "single") {
    return null;
  }

  return question.options.find((option) => option.value === optionValue) || null;
}

function isIdeaWizardAnswerValid(question) {
  const answer = ideaWizardAnswers[question.id];
  if (question.type === "text" || question.type === "textarea") {
    return typeof answer === "string" && answer.trim().length > 0;
  }

  if (question.type === "single") {
    return typeof answer === "string" && answer.length > 0;
  }

  return false;
}

function renderIdeaWizardInput(question) {
  if (!ideaWizardInput) {
    return;
  }

  ideaWizardInput.innerHTML = "";

  if (question.type === "text" || question.type === "textarea") {
    const label = document.createElement("label");
    const labelText = document.createElement("span");
    labelText.className = "idea-wizard-field-label";
    labelText.textContent = question.title;
    label.appendChild(labelText);

    const input = document.createElement(question.type === "textarea" ? "textarea" : "input");
    input.className = question.type === "textarea" ? "idea-wizard-textarea" : "idea-wizard-text";
    if (question.type === "text") {
      input.type = "text";
    }
    input.placeholder = question.placeholder || "";
    input.value = ideaWizardAnswers[question.id] || "";
    input.addEventListener("input", () => {
      ideaWizardAnswers[question.id] = input.value;
    });

    label.appendChild(input);
    ideaWizardInput.appendChild(label);
    return;
  }

  if (question.type === "single") {
    const optionsWrap = document.createElement("div");
    optionsWrap.className = "idea-wizard-options";

    for (const option of question.options) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "idea-wizard-option";
      if (ideaWizardAnswers[question.id] === option.value) {
        button.classList.add("is-selected");
      }

      const title = document.createElement("span");
      title.className = "idea-wizard-option-title";
      title.textContent = option.title;

      const copy = document.createElement("span");
      copy.className = "idea-wizard-option-copy";
      copy.textContent = option.copy;

      button.appendChild(title);
      button.appendChild(copy);
      button.addEventListener("click", () => {
        ideaWizardAnswers[question.id] = option.value;
        renderIdeaWizardStep();
      });

      optionsWrap.appendChild(button);
    }

    ideaWizardInput.appendChild(optionsWrap);
  }
}

function renderIdeaWizardStep() {
  const question = ideaWizardQuestions[ideaWizardStepIndex];
  if (!question || !ideaWizardTitle || !ideaWizardHelp || !ideaWizardStepLabel || !ideaWizardProgressFill) {
    return;
  }

  if (ideaWizardQuestionStage) {
    ideaWizardQuestionStage.hidden = false;
  }
  if (ideaWizardSummaryStage) {
    ideaWizardSummaryStage.hidden = true;
  }
  if (ideaWizardConfirmStage) {
    ideaWizardConfirmStage.hidden = true;
  }
  if (ideaWizardActions) {
    ideaWizardActions.hidden = false;
  }

  ideaWizardTitle.textContent = question.title;
  ideaWizardHelp.textContent = question.help;
  ideaWizardStepLabel.textContent = `Question ${ideaWizardStepIndex + 1} of ${ideaWizardQuestions.length}`;
  ideaWizardProgressFill.style.width = `${((ideaWizardStepIndex + 1) / ideaWizardQuestions.length) * 100}%`;

  renderIdeaWizardInput(question);

  if (ideaWizardBack) {
    ideaWizardBack.hidden = ideaWizardStepIndex === 0;
  }
  if (ideaWizardNext) {
    ideaWizardNext.textContent =
      ideaWizardStepIndex === ideaWizardQuestions.length - 1 ? "See summary" : "Next";
  }
}

function resolveIdeaMaturityLabel(score) {
  if (score <= 1.8) {
    return "Level 1 - Initial";
  }
  if (score <= 2.6) {
    return "Level 2 - Emerging";
  }
  if (score <= 3.4) {
    return "Level 3 - Established";
  }
  if (score <= 4.2) {
    return "Level 4 - Scalable";
  }
  return "Level 5 - Mature";
}

function calculateIdeaWizardSummary() {
  const categoryScores = {
    concept: 0,
    framework: 0,
    accelerator: 0,
    service: 0,
    product: 0,
  };
  const phaseScores = {
    "Product Planning": 0,
    "Product Development": 0,
    "Product Introduction": 0,
    "Product Life Cycle Management": 0,
  };
  const reasons = [];
  const maturityValues = [];

  for (const question of ideaWizardQuestions) {
    const answer = ideaWizardAnswers[question.id];
    if (question.type !== "single") {
      continue;
    }

    const option = getIdeaQuestionOption(question, answer);
    if (!option) {
      continue;
    }

    for (const [category, score] of Object.entries(option.categoryScores || {})) {
      categoryScores[category] += score;
    }

    for (const [phase, score] of Object.entries(option.phaseScores || {})) {
      phaseScores[phase] += score;
    }

    if (typeof option.maturity === "number") {
      maturityValues.push(option.maturity);
    }

    reasons.push(option.copy);
  }

  const rankedCategories = Object.entries(categoryScores).sort((left, right) => right[1] - left[1]);
  const recommendedCategory = rankedCategories[0]?.[0] || "concept";
  const runnerUpCategory = rankedCategories[1]?.[0] || recommendedCategory;
  const maturityScore =
    maturityValues.length > 0
      ? maturityValues.reduce((sum, value) => sum + value, 0) / maturityValues.length
      : 1;
  const maturityLabel = resolveIdeaMaturityLabel(maturityScore);
  const lifecycleFit = Object.entries(phaseScores).sort((left, right) => right[1] - left[1])[0]?.[0] || "Product Planning";

  return {
    ideaName: (ideaWizardAnswers.ideaName || "Untitled idea").trim(),
    ideaSummary: (ideaWizardAnswers.ideaSummary || "").trim(),
    recommendedCategory,
    runnerUpCategory,
    maturityScore,
    maturityLabel,
    lifecycleFit,
    recommendation: ideaWizardCategoryDescriptions[recommendedCategory],
    reasons: reasons.slice(0, 4),
  };
}

function renderIdeaWizardSummary() {
  if (!ideaWizardSummary) {
    return;
  }

  const summary = calculateIdeaWizardSummary();
  ideaWizardSummary.innerHTML = `
    <div class="idea-summary-grid">
      <div class="idea-summary-card">
        <span>Recommended category</span>
        <strong>${summary.recommendedCategory.charAt(0).toUpperCase() + summary.recommendedCategory.slice(1)}</strong>
      </div>
      <div class="idea-summary-card">
        <span>Maturity indication</span>
        <strong>${summary.maturityLabel}</strong>
      </div>
      <div class="idea-summary-card">
        <span>Closest lifecycle fit</span>
        <strong>${summary.lifecycleFit}</strong>
      </div>
    </div>
    <div class="idea-summary-note">
      <h4>${summary.ideaName}</h4>
      <p>${summary.ideaSummary}</p>
    </div>
    <div class="idea-summary-note">
      <h4>Recommendation</h4>
      <p>${summary.recommendation}</p>
      <p>Secondary signal: ${summary.runnerUpCategory.charAt(0).toUpperCase() + summary.runnerUpCategory.slice(1)}.</p>
    </div>
    <div class="idea-summary-note">
      <h4>Why the wizard landed here</h4>
      <ul>${summary.reasons.map((reason) => `<li>${reason}</li>`).join("")}</ul>
    </div>
  `;
}

function showIdeaWizardSummary() {
  renderIdeaWizardSummary();
  if (ideaWizardQuestionStage) {
    ideaWizardQuestionStage.hidden = true;
  }
  if (ideaWizardSummaryStage) {
    ideaWizardSummaryStage.hidden = false;
  }
  if (ideaWizardConfirmStage) {
    ideaWizardConfirmStage.hidden = true;
  }
  if (ideaWizardActions) {
    ideaWizardActions.hidden = true;
  }
  if (ideaWizardStepLabel) {
    ideaWizardStepLabel.textContent = "Summary";
  }
  if (ideaWizardProgressFill) {
    ideaWizardProgressFill.style.width = "100%";
  }
}

function showIdeaWizardConfirmation() {
  if (ideaWizardQuestionStage) {
    ideaWizardQuestionStage.hidden = true;
  }
  if (ideaWizardSummaryStage) {
    ideaWizardSummaryStage.hidden = true;
  }
  if (ideaWizardConfirmStage) {
    ideaWizardConfirmStage.hidden = false;
  }
  if (ideaWizardActions) {
    ideaWizardActions.hidden = true;
  }
  if (ideaWizardStepLabel) {
    ideaWizardStepLabel.textContent = "Submitted";
  }
  if (ideaWizardProgressFill) {
    ideaWizardProgressFill.style.width = "100%";
  }
}

function resetIdeaWizard() {
  ideaWizardStepIndex = 0;
  ideaWizardAnswers = {};
  renderIdeaWizardStep();
}

function openIdeaWizard() {
  if (!ideaWizardModal) {
    return;
  }

  resetIdeaWizard();
  ideaWizardModal.hidden = false;
  document.body.style.overflow = "hidden";
}

function closeIdeaWizard() {
  if (!ideaWizardModal) {
    return;
  }

  ideaWizardModal.hidden = true;
  document.body.style.overflow = "";
}

if (ideaWizardLaunch) {
  ideaWizardLaunch.addEventListener("click", openIdeaWizard);
}

for (const closeButton of ideaWizardCloseButtons) {
  closeButton.addEventListener("click", closeIdeaWizard);
}

if (ideaWizardBack) {
  ideaWizardBack.addEventListener("click", () => {
    if (ideaWizardStepIndex > 0) {
      ideaWizardStepIndex -= 1;
      renderIdeaWizardStep();
    }
  });
}

if (ideaWizardNext) {
  ideaWizardNext.addEventListener("click", () => {
    const question = ideaWizardQuestions[ideaWizardStepIndex];
    if (!isIdeaWizardAnswerValid(question)) {
      return;
    }

    if (ideaWizardStepIndex === ideaWizardQuestions.length - 1) {
      showIdeaWizardSummary();
      return;
    }

    ideaWizardStepIndex += 1;
    renderIdeaWizardStep();
  });
}

if (ideaWizardSend) {
  ideaWizardSend.addEventListener("click", showIdeaWizardConfirmation);
}

if (ideaWizardFinish) {
  ideaWizardFinish.addEventListener("click", closeIdeaWizard);
}

if (ideaWizardDone) {
  ideaWizardDone.addEventListener("click", closeIdeaWizard);
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && ideaWizardModal && !ideaWizardModal.hidden) {
    closeIdeaWizard();
  }
});

