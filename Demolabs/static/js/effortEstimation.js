$(document).ready(function () {
    $.getJSON('/static/DemoDetailsRepo/EffortEstimation/2_effort.json', function (data) {

        // ========== Technology Constraints ==========
        const $techConstraints = $('#TechnologyConstraints').empty();
        if (data.TechnologyConstraints && data.TechnologyConstraints.length > 0) {
            const card = $('<div class="card shadow-sm mb-4"></div>');
            const cardBody = $('<div class="card-body"></div>');
            cardBody.append('<h4 class="card-title text-danger"><i class="fas fa-exclamation-triangle"></i> Technology Constraints</h4>');

            const $list = $('<ul class="list-group list-group-flush"></ul>');
            data.TechnologyConstraints.forEach(c => {
                $list.append(`<li class="list-group-item"><i class="fas fa-ban text-warning me-2"></i>${c.Constraint}</li>`);
            });

            cardBody.append($list);
            card.append(cardBody);
            $techConstraints.append(card);
        }

        // ========== Effort Estimation ==========
        const $effortList = $('#EffortEstimation').empty();
        if (data.EffortEstimation && data.EffortEstimation.length > 0) {
            const card = $('<div class="card shadow-sm mb-4"></div>');
            const cardBody = $('<div class="card-body"></div>');
            cardBody.append('<h4 class="card-title text-primary"><i class="fas fa-clock"></i> Effort Breakdown</h4>');

            const $timelineList = $('<ul class="list-group list-group-flush"></ul>');

            data.EffortEstimation.forEach(item => {
                if (item.Task && item.Timeline) {
                    $timelineList.append(`
                        <li class="list-group-item d-flex justify-content-between align-items-center">
                            <span><i class="fas fa-tasks text-secondary me-2"></i><strong>${item.Task}</strong></span>
                            <span class="badge bg-primary rounded-pill">${item.Timeline}</span>
                        </li>
                    `);
                } else if (item.Total) {
                    cardBody.append(`
                        <div class="mt-3 text-end">
                            <span class="text-muted">Total Estimated Duration: </span>
                            <span class="fw-bold">${item.Total}</span>
                        </div>
                    `);
                }
            });

            cardBody.append($timelineList);
            card.append(cardBody);
            $effortList.append(card);
        }

        // ========== Cost Breakdown ==========
        const $cost = $('#CostBreakdown').empty();
        if (data.CostBreakdown) {
            const card = $('<div class="card shadow-sm mb-4"></div>');
            const cardBody = $('<div class="card-body"></div>');
            cardBody.append('<h4 class="card-title text-success"><i class="fas fa-dollar-sign"></i> Cost Breakdown</h4>');

            // CAPEX
            const capex = data.CostBreakdown.CAPEX;
            if (capex) {
                cardBody.append('<h5 class="mt-3 text-muted">CAPEX</h5>');
                const $capexList = $('<ul class="list-group list-group-flush mb-2"></ul>');
                capex.Items.forEach(item => {
                    $capexList.append(`
                        <li class="list-group-item d-flex justify-content-between">
                            <span>${item.Item}</span>
                            <span class="fw-bold">$${item.CostUSD.toLocaleString()}</span>
                        </li>
                    `);
                });
                cardBody.append($capexList);
                cardBody.append(`<p class="text-end fw-bold">Total CAPEX: $${capex.TotalUSD.toLocaleString()}</p>`);
            }

            // OPEX
            const opex = data.CostBreakdown.OPEX;
            if (opex) {
                cardBody.append('<h5 class="mt-4 text-muted">OPEX</h5>');
                const $opexList = $('<ul class="list-group list-group-flush mb-2"></ul>');
                opex.Items.forEach(item => {
                    $opexList.append(`
                        <li class="list-group-item">
                            <div class="d-flex justify-content-between">
                                <span>${item.Item}</span>
                                <span class="text-muted">Monthly: $${item.MonthlyUSD.toLocaleString()}</span>
                            </div>
                            <div class="text-end"><strong>Annual: $${item.AnnualUSD.toLocaleString()}</strong></div>
                        </li>
                    `);
                });
                cardBody.append($opexList);
                cardBody.append(`<p class="text-end fw-bold">Total OPEX (Annual): $${opex.TotalAnnualUSD.toLocaleString()}</p>`);
            }

            card.append(cardBody);
            $cost.append(card);
        }

        // ========== ROI Justification ==========
        const $roi = $('#ROIJustification').empty();
        if (data.ROIJustification) {
            const card = $('<div class="card shadow-sm mb-4"></div>');
            const cardBody = $('<div class="card-body"></div>');
            cardBody.append('<h4 class="card-title text-info"><i class="fas fa-chart-line"></i> ROI Justification</h4>');

            const $kpiTable = $(`
                <table class="table table-bordered mt-3">
                    <thead class="table-light">
                        <tr>
                            <th>KPI</th>
                            <th>Pre-AI</th>
                            <th>Post-AI</th>
                        </tr>
                    </thead>
                    <tbody></tbody>
                </table>
            `);

            data.ROIJustification.KPIs.forEach(kpi => {
                $kpiTable.find('tbody').append(`
                    <tr>
                        <td>${kpi.KPI}</td>
                        <td>${kpi.PreAI}</td>
                        <td>${kpi.PostAI}</td>
                    </tr>
                `);
            });

            cardBody.append($kpiTable);
            cardBody.append(`
                <p class="mt-3"><strong>Estimated Annual ROI Savings:</strong> $${data.ROIJustification.EstimatedAnnualROISavingsUSD.toLocaleString()}</p>
                <p><strong>Policyholder Base:</strong> ${data.ROIJustification.AssumedPolicyholderBase}</p>
            `);

            card.append(cardBody);
            $roi.append(card);
        }

    }).fail(function () {
        $('#EffortEstimation').html('<div class="alert alert-danger">⚠️ Failed to load data.</div>');
    });
});
