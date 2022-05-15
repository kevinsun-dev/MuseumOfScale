window.onload = function () {
    setTimeout(function () {
        document.getElementById("loader").remove();
    }, 2000);

    const svg = d3.select("svg#mainCanvas");
    const width = svg.node().getBoundingClientRect().width;
    const height = svg.node().getBoundingClientRect().height;
    const drawGroup = d3.select("svg#mainCanvas g");
    let data = [];
    let scaleFactor = Math.pow(2, 10)
    let dimensions = [841 * scaleFactor, 1188 * scaleFactor];
    let origin = [0, 0];
    let numPoints = 100;

    let zoom = d3.zoom()
        .on('zoom', handleZoom);

    function handleZoom(e) {
        drawGroup.attr('transform', e.transform);
    }

    function initZoom() {
        console.log([width, height]);
        let initialZoom = d3.zoomIdentity
            .translate(572 * (width / 1440), 500 * (height / 790))
            .scale(0.00054555, 0.00054555);
        svg.call(zoom).call(zoom.transform, initialZoom);
    }

    function updateData() {
        data = [];
        for (let i = 0; i < numPoints; i++) {
            data.push({
                id: i,
                x: origin[0],
                y: origin[1],
                width: dimensions[0],
                height: dimensions[1],
                strokeWidth: Math.pow(0.70710678118, i - 24)
            });
            switch (i % 4) {
                case 0:
                    origin[1] += dimensions[1] / 2;
                    dimensions[1] = dimensions[1] / 2;
                    break;
                case 1:
                    origin[0] += dimensions[0] / 2;
                    dimensions[0] = dimensions[0] / 2;
                    break;
                case 2:
                    dimensions[1] = dimensions[1] / 2;
                    break;
                case 3:
                    dimensions[0] = dimensions[0] / 2;
                    break;
            }
        }
    }

    function update() {
        drawGroup.selectAll('rect')
            .data(data)
            .join('rect')
            .attr('x', function (d) { return d.x - origin[0] + ((width - 297) / 2); })
            .attr('y', function (d) { return d.y - origin[1] + ((height - 105) / 2); })
            .attr('width', function (d) { return d.width; })
            .attr('height', function (d) { return d.height; })
            .attr('stroke-width', function (d) { return d.strokeWidth; })
            .attr('stroke', 'black')
            .attr('fill', 'none');
        drawGroup.selectAll('text')
            .data(data)
            .join('text')
            .attr('x', function (d) {
                if (d.id % 4 === 0 && d.id !== 0)
                    return d.x + d.width + (d.strokeWidth * 2) - origin[0] + ((width - 297) / 2);
                return d.x + (d.strokeWidth * 2) - origin[0] + ((width - 297) / 2);
            })
            .attr('y', function (d) {
                if (d.id % 4 === 3)
                    return d.y + (d.strokeWidth * 5) - origin[1] + ((height - 105) / 2);
                if (d.id % 4 === 0 && d.id !== 0)
                    return d.y + (d.strokeWidth * 5) - origin[1] + ((height - 105) / 2);
                return d.y - (d.strokeWidth * 1.2) - origin[1] + ((height - 105) / 2);
            })
            .attr('font-size', function (d) { return `${d.strokeWidth * 4}px` })
            .attr('class', "paper-labels")
            .text(function (d) {
                let dispWidth = Math.min(d.width, d.height) / scaleFactor;
                let dispHeight = Math.max(d.width, d.height) / scaleFactor;
                let dispUnits = "mm";
                if (Math.round(dispWidth) === 0) {
                    dispWidth *= 1000;
                    dispHeight *= 1000;
                    dispUnits = "μm";
                }
                if (Math.round(dispWidth) === 0) {
                    dispWidth *= 1000;
                    dispHeight *= 1000;
                    dispUnits = "nm";
                }
                return `A${d.id} - (${dispWidth.toPrecision(4)}${dispUnits}, ${dispHeight.toPrecision(4)}${dispUnits})`
            })
    }

    initZoom();
    updateData();
    update();
};