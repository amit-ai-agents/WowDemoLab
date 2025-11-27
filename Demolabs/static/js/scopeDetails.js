$(document).ready(function () {
    $.getJSON("/static/DemoDetailsRepo/ScopeDetails/2_scope.json", function (data) {
        const container = $("#ScopeDetails");
        container.empty(); // Clear if reloaded
        //alert("Loading Scope Details..." + JSON.stringify(data));
        // 1. Assumptions
        container.append(`<h3>📌 Assumptions</h3><hr/>`);
        const assumptionsList = $("<ul class='list-group mb-4'></ul>");
        data.Assumptions.forEach(item => {
            assumptionsList.append(`<li class='list-group-item'><strong>${item.ID}:</strong> ${item.Assumption}</li>`);
        });
        container.append(assumptionsList);

        // 2. In-Scope
        container.append(`<h3>✅ In-Scope Items</h3><hr/>`);
        const inScopeTable = $(`
            <div class="table-responsive mb-4">
            <table class="table table-bordered table-striped">
                <thead class="table-primary"><tr><th>#</th><th>Component</th><th>Description</th></tr></thead>
                <tbody></tbody>
            </table>
            </div>
        `);
        data.InScope.forEach(item => {
            inScopeTable.find("tbody").append(`
                <tr>
                    <td>${item.ID}</td>
                    <td>${item.Component}</td>
                    <td>${item.Scope}</td>
                </tr>
            `);
        });
        container.append(inScopeTable);

        // 3. Out-of-Scope
        container.append(`<h3>❌ Out-of-Scope Items</h3><hr/>`);
        const outScopeTable = $(`
            <div class="table-responsive mb-4">
            <table class="table table-bordered table-striped">
                <thead class="table-secondary"><tr><th>#</th><th>Item</th><th>Rationale</th></tr></thead>
                <tbody></tbody>
            </table>
            </div>
        `);
        data.OutOfScope.forEach(item => {
            outScopeTable.find("tbody").append(`
                <tr>
                    <td>${item.ID}</td>
                    <td>${item.OutOfScopeItem}</td>
                    <td>${item.Rationale}</td>
                </tr>
            `);
        });
        container.append(outScopeTable);

        // 4. Risks and Mitigations
        container.append(`<h3>⚠️ Risks & Mitigations</h3><hr/>`);
        const riskTable = $(`
            <div class="table-responsive mb-4">
            <table class="table table-bordered table-striped">
                <thead class="table-warning">
                    <tr><th>Risk ID</th><th>Description</th><th>Impact</th><th>Likelihood</th><th>Mitigation</th></tr>
                </thead>
                <tbody></tbody>
            </table>
            </div>
        `);
        data.RisksAndMitigations.forEach(item => {
            riskTable.find("tbody").append(`
                <tr>
                    <td>${item.RiskID}</td>
                    <td>${item.RiskDescription}</td>
                    <td>${item.Impact}</td>
                    <td>${item.Likelihood}</td>
                    <td>${item.MitigationStrategy}</td>
                </tr>
            `);
        });
        container.append(riskTable);

        // 5. Business Problem to Functional Mapping
        container.append(`<h3>🔗 Business Problem to Functional Mapping</h3><hr/>`);
        const mappingList = $("<ul class='list-group mb-4'></ul>");
        data.BusinessProblemMapping.forEach(item => {
            mappingList.append(`
                <li class='list-group-item'>
                    <strong>${item.BusinessProblem}:</strong><br/>
                    <span class="text-muted">${item.FunctionalComponent}</span>
                </li>
            `);
        });
        container.append(mappingList);
    }).fail(function () {
        $("#dynamicContent").html(
            `<div class="alert alert-danger" role="alert">
                Failed to load scope details JSON.
            </div>`
        );
    });
});
