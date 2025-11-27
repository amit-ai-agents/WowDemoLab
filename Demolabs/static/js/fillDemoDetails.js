$(function () {
    //alert(demo);
    $('[data-bs-toggle="tooltip"]').tooltip();

    $(".sidebar i").on("click", function () {
        const target = $(this).data("target");

        $(".sidebar i").removeClass("active");
        $(this).addClass("active");

        $(".section").removeClass("active");
        $("#" + target).addClass("active");
    });
    // Inject demo JSON data
    /*const demo = {{ demo_data | tojson }};*/

//alert(JSON.stringify(demo));
    //alert(JSON.stringify(demo.cost.CAPEX));
    $('#demo_id').val(demo.id);
$('#demo-business').text(demo.business);
$('#demo-approach').text(demo.approach);
    AddExecutiveOverview(demo);
    AddBusinessOverview(demo);
    AddFunctionalComponentDetails(demo);
    AddSolutionOverview(demo);
$('#demo-architecture').attr('src', demo.architecture_image);
$('#demo-dataflow').text(demo.dataflow);
$('#demo-design').text(demo.design);

//demo.effort.forEach(effort => {
//$('#demo-effort').append(`<li>${effort}</li>`);
//});

$('#demo-capex').append('<strong>CAPEX:</strong> ' + demo.cost.CAPEX);
$('#demo-opex').append('<strong>OPEX:</strong> ' + demo.cost.OPEX);


    LoadArchitectureDetails();
        });

function AddExecutiveOverview(demo) {
    //alert(demo.UseCaseTitle);
    $('#UsecaseTitle').text("🧾 Use Case - "+demo.UseCaseTitle);
    $('#UsecasePurpose').text(demo.Purpose);
    if (demo.ExecSummaryKeyAsks && demo.ExecSummaryKeyAsks.length > 0) {
        //$('#demo-functionDetails').append('<h3>Function Overview</h3>');
        demo.ExecSummaryKeyAsks.forEach(keyASKS => {
            $('#ExecSummaryKeyAsks').append(`<li>${keyASKS}</li>`);
        });
    }

    $('#ExecSummary').text(demo.ExecSummary);
    if (demo.ExecSummaryKeyAsks && demo.ExecSummaryKeyAsks.length > 0) {
        //$('#demo-functionDetails').append('<h3>Function Overview</h3>');
        demo.ExecSummaryKeyAsks.forEach(keyASKS => {
            $('#ExecSummaryKeyAsks').append(`<li>${keyASKS}</li>`);
        });
    }
    if (demo.BusinessObjectives && demo.BusinessObjectives.length > 0) {
        //$('#demo-functionDetails').append('<h3>Function Overview</h3>');
        demo.BusinessObjectives.forEach(BObjectives=> {
            $('#BusinessObjectives').append(`<li>${BObjectives}</li>`);
        });
    }
    if (demo.BusinessBenefits && demo.BusinessBenefits.length > 0) {
        //$('#demo-functionDetails').append('<h3>Function Overview</h3>');
        demo.BusinessBenefits.forEach(BBenefits => {
            $('#BusinessBenefits').append(`<li> ✅ ${BBenefits}</li>`);
        });
    }

}
function AddBusinessOverview(demo) {
    /*$('#demo-overview').text(demo.overview);*/
    if (demo.BusinessDrivers && demo.BusinessDrivers.length > 0) {
        //$('#demo-functionDetails').append('<h3>Function Overview</h3>');
        demo.BusinessDrivers.forEach(busDrivers=> {
            $('#BusinessDrivers').append(`<li>${busDrivers}</li>`);
        });
    }
    if (demo.BusinessChallanges && demo.BusinessChallanges.length > 0) {
        //$('#demo-functionDetails').append('<h3>Function Overview</h3>');
        demo.BusinessChallanges.forEach(busChallanges => {
            $('#BusinessChallanges').append(`<li>${busChallanges}</li>`);
        });
    }
    /*$('#demo-overview').text(demo.overview);*/
    if (demo.FunctionalOverview && demo.FunctionalOverview.length > 0) {
        //$('#demo-functionDetails').append('<h3>Function Overview</h3>');
        demo.FunctionalOverview.forEach(funcDetails => {
            $('#FunctionalOverview').append(`<li>${funcDetails}</li>`);
        });
    }
}
//function AddFunctionalComponentDetails(demo) {
//    /*$('#demo-overview').text(demo.overview);*/
//    if (demo.FunctionalComponentDetails && demo.FunctionalComponentDetails.length > 0) {
//        //$('#demo-functionDetails').append('<h3>Function Overview</h3>');
//        demo.FunctionalComponentDetails.forEach(FunctComponentDetails => {
//            ///For each functional component, add a list item to the FunctionalComponentDetails section
            
//        });
//    }
//}
function AddFunctionalComponentDetails(demo) {
    const container = document.getElementById("FunctionalComponents");

    if (demo.FunctionalComponentDetails && demo.FunctionalComponentDetails.length > 0) {
        demo.FunctionalComponentDetails.forEach((component, index) => {
            const row = document.createElement("div");
            row.className = "row mb-4 p-3 border rounded bg-dark";

            // Title
            const title = document.createElement("h3");
            const hrLine = document.createElement("hr");
            title.innerHTML = `<label>${component.FunctionalComponentTitle}</label>`;
            row.appendChild(title);
            row.appendChild(hrLine);
            // Description
            const desc = document.createElement("p");
            desc.textContent = component.Description;
            row.appendChild(desc);

            // Key Features
            const featuresHeader = document.createElement("h4");
            featuresHeader.innerHTML = "✨ Key Features:";
            row.appendChild(featuresHeader);

            const featureList = document.createElement("ul");
            component.KeyFeatures.forEach(feature => {
                const li = document.createElement("li");
                li.textContent = feature;
                featureList.appendChild(li);
            });
            row.appendChild(featureList);

            // Business Impact
            const impactHeader = document.createElement("h4");
            impactHeader.innerHTML = "📊 Business Impact:";
            row.appendChild(impactHeader);

            const impactList = document.createElement("ul");
            component.BusinessImpact.forEach(impact => {
                const li = document.createElement("li");
                li.textContent = impact;
                impactList.appendChild(li);
            });
            row.appendChild(impactList);

            container.appendChild(row);
        });
    }
}
function AddSolutionOverview(demo) {
    /*$('#demo-overview').text(demo.overview);*/
    if (demo.SolutionOverview && demo.SolutionOverview.length > 0) {
        //$('#demo-functionDetails').append('<h3>Function Overview</h3>');
        demo.SolutionOverview.forEach(solOverview => {
            $('#SolutionOverview').append(`<li>${solOverview}</li>`);
        });
    }
    if (demo.SolutionComponents && demo.SolutionComponents.length > 0) {
        //$('#demo-functionDetails').append('<h3>Function Overview</h3>');
        demo.SolutionComponents.forEach(solComps => {
            $('#SolutionComponents').append(`<li>${solComps}</li>`);
        });
    }
}
