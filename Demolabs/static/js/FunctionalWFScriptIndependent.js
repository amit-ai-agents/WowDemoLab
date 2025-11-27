// Initialize Mermaid (v10 UMD version works fine with plain script)
mermaid.initialize({ startOnLoad: false });

$(document).ready(function () {
    $.getJSON('/static/DemoDetailsRepo/wf/24_wf.json', function (data) {
        const container = $('#dynamicContent');

        // Title and Description
        container.append(`
            <h2 class="mb-4 text-primary">${data.title}</h2>
            <p class="lead">${data.description}</p>
            <ul class="nav nav-tabs" id="workflowTabs" role="tablist"></ul>
            <div class="tab-content p-4 border border-top-0" id="workflowTabContent"></div>
        `);

        // Render Tabs and Tab Panes
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
                    <h4 class="text-success">${module.moduleTitle}</h4>
                    <p><strong>Functional Overview:</strong> ${module.functionalOverview}</p>
                    <ul>${featuresList}</ul>
                    <p><strong>Business Benefits:</strong></p>
                    <ul>${benefitsList}</ul>
                    ${mermaidHTML}
                </div>
            `);
        });

        renderMermaidInActiveTab();

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
