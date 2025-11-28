


function LoadArchitectureDetails() {
    var demo_id = $("#demo_id").val();
    //alert(`Loading architecture for demo ID: ${demo_id}`);
    $.getJSON(`/api/archDetails?demo_id=${demo_id}`, function (architecture) {
        const layers = architecture.ModernDataAIReferenceArchitecture.Layers;
        const $vertical = $('#vertical-layers');
        const $horizontal = $('#horizontal-layers');

        layers.forEach(layer => {
            const isVertical = layer.orientation === 'vertical';
            const $layerDiv = $('<div class="layer-container"></div>').addClass(isVertical ? 'layer-vertical' : 'layer-horizontal');
            const $title = $('<div class="layer-title"></div>').text(layer.name);

            $layerDiv.append($title);

            if (isVertical) {
                Object.entries(layer.components).forEach(([key, value]) => {
                    const $card = $('<div class="component-card"></div>');
                    $card.append($('<div class="component-title"></div>').text(key));
                    if (Array.isArray(value)) {
                        value.forEach(item => $card.append($('<div></div>').text(`- ${item}`)));
                    } else if (typeof value === 'string') {
                        $card.append($('<div></div>').text(value));
                    } else if (value === true) {
                        $card.append($('<div></div>').html('<span class="text-success">✓ Enabled</span>'));
                    }
                    $layerDiv.append($card);
                });
                $vertical.append($layerDiv);
            } else {
                const $componentsWrapper = $('<div class="horizontal-components"></div>');
                Object.entries(layer.components).forEach(([key, value]) => {
                    const $card = $('<div class="component-card"></div>');
                    $card.append($('<div class="component-title"></div>').text(key));
                    if (Array.isArray(value)) {
                        value.forEach(item => $card.append($('<div></div>').text(`- ${item}`)));
                    } else if (typeof value === 'string') {
                        $card.append($('<div></div>').text(value));
                    } else if (value === true) {
                        $card.append($('<div></div>').html('<span class="text-success">✓ Enabled</span>'));
                    }
                    $componentsWrapper.append($card);
                });
                $layerDiv.append($componentsWrapper);
                $horizontal.append($layerDiv);
            }
        });
    });

}