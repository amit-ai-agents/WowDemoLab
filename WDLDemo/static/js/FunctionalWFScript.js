// Initialize Mermaid globally
mermaid.initialize({ startOnLoad: false });

$(document).ready(function () {
    $.getJSON('/static/DemoDetailsRepo/wf/24_wf.json', function (data) {
        const container = $('#dynamicContent');

        // Build layout
        container.html(`
            <h3 class="mb-4 text-primary">${data.title}</h3>
            <hr />
            <p class="lead">${data.description}</p>
            <ul class="nav nav-tabs" id="workflowTabs" role="tablist"></ul>
            <div class="tab-content p-4 border border-top-0" id="workflowTabContent"></div>
        `);

        data.modules.forEach((module, index) => {
            $('#workflowTabs').append(`
                <li class="nav-item">
                    <a class="nav-link ${index === 0 ? 'active' : ''}" 
                       id="${module.id}-tab" 
                       data-bs-toggle="tab" 
                       href="#${module.id}" 
                       role="tab"
                       aria-controls="${module.id}"
                       aria-selected="${index === 0}">
                       ${module.icon} ${module.tabTitle}
                    </a>
                </li>
            `);

            const featuresList = module.features.map(
                feat => `<li><strong>${feat.title}:</strong> ${feat.detail}</li>`
            ).join('');

            const benefitsList = module.benefits.map(
                benefit => `<li>${benefit}</li>`
            ).join('');

            const mermaidHTML = `<div class="mermaid">${module.mermaid}</div>`;

            $('#workflowTabContent').append(`
                <div class="tab-pane fade ${index === 0 ? 'show active' : ''}" 
                     id="${module.id}" 
                     role="tabpanel" 
                     aria-labelledby="${module.id}-tab">
                     <div class="row">
                     <div class="col-md-4">
                    <h4 class="text-success">${module.moduleTitle}</h4>
                    <p><strong>Functional Overview:</strong> ${module.functionalOverview}</p>
                    <ul>${featuresList}</ul>
                    <p><strong>Business Benefits:</strong></p>
                    <ul>${benefitsList}</ul>
                    </div>
                    <div class="col-md-8">
                    ${mermaidHTML}
                    </div>
                    </div>
                </div>
            `);
        });

        // Initial render only when section is visible
        observeVisibility('#dataflow', renderMermaidInActiveTab);

        // Re-render on tab switch
        $('a[data-bs-toggle="tab"]').on('shown.bs.tab', function (e) {
            const targetId = $(e.target).attr('href');
            renderMermaidInTab(targetId);
        });
    });
});

function renderMermaidInTab(tabId) {
    const nodes = document.querySelectorAll(`${tabId} .mermaid`);
    mermaid.run({ nodes });
}

function renderMermaidInActiveTab() {
    const activePane = document.querySelector('.tab-pane.active');
    if (activePane) {
        const nodes = activePane.querySelectorAll('.mermaid');
        mermaid.run({ nodes });
    }
}

// 🔍 Visibility observer
function observeVisibility(selector, callback) {
    const el = document.querySelector(selector);
    if (!el) return;

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                callback();
                observer.unobserve(entry.target); // run only once
            }
        });
    }, { threshold: 0.1 });

    observer.observe(el);
}
