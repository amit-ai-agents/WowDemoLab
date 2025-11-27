let demoData = [];

function fetchData() {
    $.getJSON('/static/data/demoList.json', function (data) {
        demoData = data;
        renderFilters();
        renderDemos();
    });
}

function rederLiveNowHTML(prmType = "grid", prmURI = "#", prmDemoData) {
    var className = "live-badge-grid text-decoration-none";
    if (prmType === "list") {
        className = "live-badge text-decoration-none";
    }
    var liveNowHTML = `
      <a href="#" class="${className}" onclick='demoStepsDetails("${prmDemoData.name}" , ${prmDemoData.id} )'>
        <span class="live-dot"></span> LIVE
      </a>`;
    return liveNowHTML;
}

function renderFilters() {
    const industries = [...new Set(demoData.flatMap(d => d.industries))];
    const domains = [...new Set(demoData.flatMap(d => d.domains))];
    renderFilterButtons(industries, "#industryFilters", "industry");
    renderFilterButtons(domains, "#domainFilters", "domain");
}

function renderFilterButtons(items, containerId, group) {
    const container = $(containerId).empty();
    container.append(`<button class='btn btn-outline-secondary btn-sm me-2 active' data-group='${group}' data-value='All'>All</button>`);
    items.forEach(item => {
        container.append(`<button class='btn btn-outline-secondary btn-sm me-2' style='color:white;' data-group='${group}' data-value='${item}'>${item}</button>`);
    });
}

function renderDemos() {
    const keyword = $("#searchInput").val().toLowerCase();
    const industryFilter = $("#industryFilters .active").data("value") || 'All';
    const domainFilter = $("#domainFilters .active").data("value") || 'All';
    const demoStatus = $("input[name='demoStatus']:checked").attr("id");

    // Filter by name, keywords, industries, domains, and isLive
    const filtered = demoData.filter(d => {
        const textToSearch = (d.name + " " + d.description + " " + d.tech_stack + " " + (d.keywords ? d.keywords.join(" ") : "")).toLowerCase();
        const matchesKeyword = textToSearch.includes(keyword);
        const matchesIndustry = industryFilter === 'All' || d.industries.includes(industryFilter);
        const matchesDomain = domainFilter === 'All' || d.domains.includes(domainFilter);
        const matchesStatus = (demoStatus === "allDemos") || (demoStatus === "liveDemos" && d.isLive);

        return matchesKeyword && matchesIndustry && matchesDomain && matchesStatus;
    });

    const container = $("#demoContainer").empty();
    const isListView = container.hasClass('list-view');

    filtered.forEach((d) => {
        const keywordTags = (d.keywords || []).map((k, index) =>
            `<span class="keyword-tag tag-${index % 8}">🔖 ${k}</span>`).join(" ");

        let liveNowHTML = "";
        if (d.isLive) {
            liveNowHTML = rederLiveNowHTML(isListView ? "list" : "grid", d.demoLink, d);
        }

        // Add non-live gray class
        const nonLiveClass = d.isLive ? "" : " non-live";

        let cardHtml = '';
        if (isListView) {
            cardHtml = `
                <div class="col-md-12 mb-3">
                  <div class="card demo-card${nonLiveClass}">
                    <div class="card-body d-flex align-items-center gap-3">
                      <div style="font-size: 2rem;">${d.icon || "🚀"}</div>
                      <div style="flex-grow:1;">
                        <h5 class="card-title mb-0">${d.name}</h5> ${liveNowHTML}
                        <p class="card-text mb-1">${d.description}</p>
                        <p class="mb-1"><strong>Tech Stack:</strong> ${d.tech_stack}</p>
                        <div>${keywordTags}</div>
                      </div>
                      <div>
                        <button class="btn btn-sm btn-outline-primary mb-2 w-100 " onclick='quickDetails(${d.id})'><i class="bi bi-eye"></i> Quick Details</button>
                        <button class="btn btn-sm btn-outline-danger mb-2 w-100" onclick='viewDetails(${d.id})'><i class="bi bi-box-arrow-up-right"></i> View Details</button>
                        <button class="btn btn-sm btn-outline-success w-100" onclick='customizeDemo("${d.name}")'><i class="bi bi-pencil"></i> Customize</button>
                      </div>
                    </div>
                  </div>
                </div>`;
        } else {
            cardHtml = `
                <div class="col-md-4 mb-4">
                  <div class="card demo-card h-100 position-relative${nonLiveClass}">
                    ${liveNowHTML}
                    <div class="card-body d-flex flex-column">
                      <h5 class="card-title">${d.icon || "🚀"} ${d.name}</h5>
                      <p class="card-text flex-grow-1">${d.description}</p>
                      <p><strong>Tech Stack:</strong> ${d.tech_stack}</p>
                      <div class="mb-2">${keywordTags}</div>
                      <div>
                        <button class="btn btn-sm btn-outline-primary me-2" onclick='quickDetails(${d.id})'><i class="bi bi-eye"></i> Demo Details</button>
                        <button class="btn btn-sm btn-outline-danger me-2" onclick='viewDetails(${d.id})'><i class="bi bi-box-arrow-up-right"></i> Solution Details</button>
                        <button class="btn btn-sm btn-outline-success" onclick='customizeDemo("${d.name}")'><i class="bi bi-pencil"></i> Customize</button>
                      </div>
                    </div>
                  </div>
                </div>`;
        }

        container.append(cardHtml);
    });
}

function quickDetails(id) {
    const d = demoData.find(item => item.id === id);
    if (!d) return;

    $("#demoModalLabel").text(d.name);
    $("#demoModalBody").html(`
        <p><strong>Industries:</strong> ${d.industries.join(", ")}</p>
        <p><strong>Domains:</strong> ${d.domains.join(", ")}</p>
        <p><strong>Description:</strong> ${d.description}</p>
        <p><strong>Tech Stack:</strong> ${d.tech_stack}</p>
        <hr>
        <p>${d.details || "No additional details provided."}</p>
    `);

    new bootstrap.Modal(document.getElementById('demoModal')).show();
}

function viewDetails(index) {
    const d = demoData[index];
    document.getElementById("demoIDField").value = index;
    document.getElementById("demoDetailsForm").submit();
}

function customizeDemo(name) {
    $("#customizeModalLabel").text(`Customize: ${name}`);
    new bootstrap.Modal(document.getElementById('customizeModal')).show();
}

function demoStepsDetails(name, demoID) {
    $("#demostepdetailsModalLabel").text(`Steps: ${name}`);
    new bootstrap.Modal(document.getElementById('demostepdetailsModal')).show();
    InitiateFlow(demoID)
    return false;
}

$(document).ready(function () {
    fetchData();
    // Default to list view on load
    //$("#listViewBtn").addClass("active").attr("aria-pressed", "true");
    //$("#gridViewBtn").removeClass("active").attr("aria-pressed", "false");
    //$("#demoContainer").removeClass("grid-view").addClass("list-view");
    $("#searchInput").on("input", renderDemos);

    $(document).on("click", ".filter-section .btn", function () {
        const group = $(this).data("group");
        $(this).siblings(`[data-group='${group}']`).removeClass("active");
        $(this).addClass("active");
        renderDemos();
    });

    $("input[name='demoStatus']").on("change", renderDemos);

    $("#customizeForm").on("submit", function (e) {
        e.preventDefault();
        alert("Customization request submitted!");
        $(this)[0].reset();
        bootstrap.Modal.getInstance(document.getElementById('customizeModal')).hide();
    });

    $("#gridViewBtn").on("click", function () {
        if (!$(this).hasClass("active")) {
            $(this).addClass("active");
            $("#listViewBtn").removeClass("active").attr("aria-pressed", "false");
            $(this).attr("aria-pressed", "true");
            $("#demoContainer").removeClass("list-view").addClass("grid-view");
            renderDemos();
        }
    });

    $("#listViewBtn").on("click", function () {
        if (!$(this).hasClass("active")) {
            $(this).addClass("active");
            $("#gridViewBtn").removeClass("active").attr("aria-pressed", "false");
            $(this).attr("aria-pressed", "true");
            $("#gridViewBtn").attr("aria-pressed", "false");
            $("#demoContainer").removeClass("grid-view").addClass("list-view");
            renderDemos();
        }
    });
});
