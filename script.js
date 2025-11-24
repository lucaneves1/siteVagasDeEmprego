// Dados das vagas de emprego
const jobsData = [
    {
        id: 1,
        title: "Desenvolvedor Frontend React",
        company: "Tech Solutions",
        location: "São Paulo, SP",
        salary: "R$ 6.000 - R$ 9.000",
        type: "Tempo Integral",
        description: "Procuramos um desenvolvedor frontend experiente em React para integrar nosso time.",
        requirements: ["React", "TypeScript", "Tailwind CSS", "Git"]
    },
    {
        id: 2,
        title: "Desenvolvedor Backend Node.js",
        company: "Digital Innovations",
        location: "Rio de Janeiro, RJ",
        salary: "R$ 7.000 - R$ 10.000",
        type: "Tempo Integral",
        description: "Desenvolvedor backend com experiência em Node.js e arquitetura de APIs.",
        requirements: ["Node.js", "Express", "PostgreSQL", "Docker"]
    },
    {
        id: 3,
        title: "Designer UX/UI",
        company: "Creative Studio",
        location: "Belo Horizonte, MG",
        salary: "R$ 5.000 - R$ 7.500",
        type: "Freelancer",
        description: "Designer criativo para trabalhar em projetos de interface e experiência do usuário.",
        requirements: ["Figma", "Prototipagem", "Design Thinking", "Comunicação"]
    },
    {
        id: 4,
        title: "Analista de Dados",
        company: "Data Analytics Co.",
        location: "Curitiba, PR",
        salary: "R$ 6.500 - R$ 9.500",
        type: "Tempo Integral",
        description: "Profissional para análise de dados e geração de insights para negócio.",
        requirements: ["Python", "SQL", "Power BI", "Excel Avançado"]
    },
    {
        id: 5,
        title: "Gerente de Projetos",
        company: "Project Management Pro",
        location: "Brasília, DF",
        salary: "R$ 8.000 - R$ 12.000",
        type: "Tempo Integral",
        description: "Líder de projetos para coordenar equipes e entregar resultados.",
        requirements: ["Agile", "Scrum", "Liderança", "Comunicação"]
    },
    {
        id: 6,
        title: "DevOps Engineer",
        company: "Cloud Systems",
        location: "São Paulo, SP",
        salary: "R$ 9.000 - R$ 13.000",
        type: "Tempo Integral",
        description: "Engenheiro DevOps para gerenciar infraestrutura em nuvem.",
        requirements: ["AWS", "Docker", "Kubernetes", "CI/CD"]
    }
];

// Estado da aplicação
let currentFilter = "all";
let currentSearchTerm = "";
let selectedJobId = null;

// Elementos do DOM
const searchInput = document.getElementById("searchInput");
const filterButtons = document.querySelectorAll(".filter-btn");
const jobsList = document.getElementById("jobsList");
const jobDetailsContainer = document.getElementById("jobDetailsContainer");

// Inicializar a aplicação
function init() {
    renderJobs();
    attachEventListeners();
}

// Renderizar vagas de emprego
function renderJobs() {
    const filteredJobs = filterJobs();

    if (filteredJobs.length === 0) {
        jobsList.innerHTML = '<div class="no-results">Nenhuma vaga encontrada com os critérios selecionados.</div>';
        return;
    }

    jobsList.innerHTML = filteredJobs.map(job => createJobCard(job)).join("");

    // Reattach click listeners para os cards
    document.querySelectorAll(".job-card").forEach(card => {
        card.addEventListener("click", () => {
            const jobId = parseInt(card.dataset.jobId);
            selectJob(jobId);
        });
    });
}

// Criar HTML do card de vaga
function createJobCard(job) {
    const isSelected = selectedJobId === job.id ? "selected" : "";
    return `
        <div class="job-card ${isSelected}" data-job-id="${job.id}">
            <div class="job-header">
                <div>
                    <h3 class="job-title">${escapeHtml(job.title)}</h3>
                    <p class="job-company">${escapeHtml(job.company)}</p>
                </div>
                <span class="job-type-badge">${escapeHtml(job.type)}</span>
            </div>
            <div class="job-meta">
                <div class="meta-item">
                    <span class="meta-icon">📍</span>
                    ${escapeHtml(job.location)}
                </div>
                <div class="meta-item">
                    <span class="meta-icon">💰</span>
                    ${escapeHtml(job.salary)}
                </div>
            </div>
            <p class="job-description">${escapeHtml(job.description)}</p>
        </div>
    `;
}

// Filtrar vagas baseado em busca e tipo
function filterJobs() {
    return jobsData.filter(job => {
        const matchesSearch = 
            job.title.toLowerCase().includes(currentSearchTerm.toLowerCase()) ||
            job.company.toLowerCase().includes(currentSearchTerm.toLowerCase()) ||
            job.location.toLowerCase().includes(currentSearchTerm.toLowerCase());
        
        const matchesType = currentFilter === "all" || job.type === currentFilter;
        
        return matchesSearch && matchesType;
    });
}

// Selecionar uma vaga e exibir detalhes
function selectJob(jobId) {
    selectedJobId = jobId;
    renderJobs();
    renderJobDetails();
    
    // Scroll para o topo no mobile
    if (window.innerWidth < 768) {
        jobDetailsContainer.scrollIntoView({ behavior: "smooth", block: "start" });
    }
}

// Renderizar detalhes da vaga selecionada
function renderJobDetails() {
    if (!selectedJobId) {
        jobDetailsContainer.innerHTML = '<div class="job-details-placeholder"><p>Selecione uma vaga para ver mais detalhes</p></div>';
        return;
    }

    const job = jobsData.find(j => j.id === selectedJobId);
    if (!job) return;

    const requirementsHtml = job.requirements.map(req => 
        `<span class="requirement-tag">${escapeHtml(req)}</span>`
    ).join("");

    jobDetailsContainer.innerHTML = `
        <div class="job-details">
            <div class="job-details-header">
                <h2 class="job-details-title">${escapeHtml(job.title)}</h2>
                <button class="close-btn" onclick="closeJobDetails()">✕</button>
            </div>

            <div class="detail-section">
                <div class="detail-label">Empresa</div>
                <div class="detail-value">${escapeHtml(job.company)}</div>
            </div>

            <div class="detail-section">
                <div class="detail-label">Localização</div>
                <div class="detail-value">📍 ${escapeHtml(job.location)}</div>
            </div>

            <div class="detail-section">
                <div class="detail-label">Salário</div>
                <div class="detail-value salary">💰 ${escapeHtml(job.salary)}</div>
            </div>

            <div class="detail-section">
                <div class="detail-label">Tipo de Vaga</div>
                <div class="detail-value">⏱️ ${escapeHtml(job.type)}</div>
            </div>

            <div class="detail-section">
                <div class="detail-label">Requisitos</div>
                <div class="requirements">
                    ${requirementsHtml}
                </div>
            </div>

            <button class="apply-btn" onclick="applyForJob(${job.id})">Candidatar-se</button>
        </div>
    `;
}

// Fechar detalhes da vaga
function closeJobDetails() {
    selectedJobId = null;
    renderJobs();
    renderJobDetails();
}

// Candidatar para uma vaga
function applyForJob(jobId) {
    const job = jobsData.find(j => j.id === jobId);
    if (job) {
        alert(`Obrigado por se candidatar para a vaga de ${job.title} na ${job.company}!\n\nEm breve entraremos em contato com você.`);
    }
}

// Anexar event listeners
function attachEventListeners() {
    // Search input
    searchInput.addEventListener("input", (e) => {
        currentSearchTerm = e.target.value;
        renderJobs();
    });

    // Filter buttons
    filterButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            filterButtons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            currentFilter = btn.dataset.filter;
            renderJobs();
        });
    });
}

// Função auxiliar para escapar HTML
function escapeHtml(text) {
    const map = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

// Inicializar quando o DOM estiver pronto
document.addEventListener("DOMContentLoaded", init);
