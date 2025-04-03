

// --- Sankey diagram using sankey_data.csv with tooltip interactivity ---
d3.csv("sankey_data.csv").then(function(data) {
  const width = 960, height = 500;
  const container = d3.select("#sankey");
  if (container.empty()) { console.error("Container #sankey not found."); return; }
  
  // Clear any existing content before creating the visualization
  container.html("");
  
  const tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("position", "absolute")
    .style("background", "#f4f4f4")
    .style("padding", "8px")
    .style("border", "1px solid #ccc")
    .style("border-radius", "4px")
    .style("pointer-events", "none")
    .style("opacity", 0);
  
  const nodeColor = d3.scaleOrdinal(d3.schemeCategory10);
  const linkColor = d3.scaleOrdinal(d3.schemeSet2);
  
  const sankeyGen = d3.sankey()
    .nodeWidth(20)
    .nodePadding(10)
    .extent([[1, 1], [width - 1, height - 6]]);
  
  const graph = { nodes: [], links: [] };
  const nodeSet = new Set();
  
  data.forEach(d => {
    nodeSet.add(d.Resort);
    nodeSet.add(d.snowfall_group);
    graph.links.push({
      source: d.Resort,
      target: d.snowfall_group,
      value: +d.count
    });
  });
  
  graph.nodes = Array.from(nodeSet).map(name => ({ name }));
  const nodeMap = new Map(graph.nodes.map((d, i) => [d.name, i]));
  graph.links.forEach(d => {
    d.source = nodeMap.get(d.source);
    d.target = nodeMap.get(d.target);
  });
  
  sankeyGen(graph);
  
  container.append("g")
    .attr("fill", "none")
    .selectAll("path")
    .data(graph.links)
    .join("path")
    .attr("d", d3.sankeyLinkHorizontal())
    .attr("stroke", "#000")
    .attr("stroke-opacity", 0.2)
    .attr("stroke-width", d => Math.max(1, d.width))
    .on("mouseover", function(event, d) {
      tooltip.transition().duration(200).style("opacity", 0.9);
      tooltip.html("Source: " + d.source.name + "<br/>Target: " + d.target.name + "<br/>Value: " + d.value)
        .style("left", (event.pageX + 10) + "px")
        .style("top", (event.pageY - 28) + "px");
      d3.select(this)
        .attr("stroke", linkColor(d.source.name))
        .attr("stroke-opacity", 0.8);
    })
    .on("mouseout", function(event, d) {
      tooltip.transition().duration(500).style("opacity", 0);
      d3.select(this)
        .attr("stroke", "#000")
        .attr("stroke-opacity", 0.2);
    });
  
  const node = container.append("g")
    .selectAll("g")
    .data(graph.nodes)
    .join("g")
    .on("mouseover", function(event, d) {
      tooltip.transition().duration(200).style("opacity", 0.9);
      tooltip.html("Name: " + d.name)
        .style("left", (event.pageX + 10) + "px")
        .style("top", (event.pageY - 28) + "px");
      d3.select(this)
        .select("rect")
        .attr("fill", d3.rgb(nodeColor(d.name)).brighter(0.5));
    })
    .on("mouseout", function(event, d) {
      tooltip.transition().duration(500).style("opacity", 0);
      d3.select(this)
        .select("rect")
        .attr("fill", nodeColor(d.name));
    });
  
  node.append("rect")
    .attr("x", d => d.x0)
    .attr("y", d => d.y0)
    .attr("height", d => d.y1 - d.y0)
    .attr("width", d => d.x1 - d.x0)
    .attr("fill", d => nodeColor(d.name));
  
  node.append("text")
    .attr("x", d => d.x0 < width / 2 ? d.x1 + 6 : d.x0 - 6)
    .attr("y", d => (d.y1 + d.y0) / 2)
    .attr("dy", "0.35em")
    .attr("text-anchor", d => d.x0 < width / 2 ? "start" : "end")
    .text(d => d.name);
});

// --- Interactive Pie Charts for Slope Type Distribution using slopes_comparison_long.csv ---
d3.csv("slopes_comparison_long.csv").then(function(data) {
  const width = 300, height = 300, radius = Math.min(width, height) / 2;
  const containerEast = d3.select("#eastPie");
  const containerWest = d3.select("#westPie");
  if (containerEast.empty()) { console.error("Container #eastPie not found."); return; }
  if (containerWest.empty()) { console.error("Container #westPie not found."); return; }
  
  // Clear any existing content
  containerEast.html("");
  containerWest.html("");
  
  const svgEast = containerEast.append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", `translate(${width/2}, ${height/2})`);
  
  const svgWest = containerWest.append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", `translate(${width/2}, ${height/2})`);
  
  const color = d3.scaleOrdinal()
    .domain(data.map(d => d["Slope Type"]))
    .range(d3.schemeCategory10);
  
  const tooltipPie = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("position", "absolute")
    .style("background", "#f4f4f4")
    .style("padding", "8px")
    .style("border", "1px solid #ccc")
    .style("border-radius", "4px")
    .style("pointer-events", "none")
    .style("opacity", 0);
  
  function createPieChart(svgContainer, region) {
    const regionData = data.filter(d => d.Region === region);
    const pie = d3.pie().value(d => +d.Percentage);
    const arc = d3.arc().innerRadius(0).outerRadius(radius);
    const arcs = svgContainer.selectAll("arc")
      .data(pie(regionData))
      .enter()
      .append("g");
    arcs.append("path")
      .attr("d", arc)
      .attr("fill", d => color(d.data["Slope Type"]))
      .on("mouseover", function(event, d) {
         tooltipPie.transition().duration(200).style("opacity", 0.9);
         tooltipPie.html("Slope Type: " + d.data["Slope Type"] + "<br/>Percentage: " + d.data.Percentage + "%")
           .style("left", (event.pageX + 10) + "px")
           .style("top", (event.pageY - 28) + "px");
      })
      .on("mouseout", function() {
         tooltipPie.transition().duration(500).style("opacity", 0);
      });
    arcs.append("text")
      .attr("transform", d => `translate(${arc.centroid(d)})`)
      .attr("text-anchor", "middle")
      .attr("dy", "0.35em")
      .text(d => d.data["Slope Type"]);
  }
  
  createPieChart(svgEast, "East Coast");
  createPieChart(svgWest, "West Coast");
});
































// --- Dashboard Chart using JSON and Plotly with Enhanced Filter Controls ---
let dashboardData;
let originalPlotlyData;
let stateFilterOptions = new Set(); // For state filtering

// Initialize filter options for various categories
function initFilterOptions(data) {
  const filterSelect = document.getElementById('filterSelect');
  const stateFilterSelect = document.getElementById('stateFilter');
  if (!filterSelect || !stateFilterSelect) return;

  while (filterSelect.options.length > 1) filterSelect.remove(1);
  while (stateFilterSelect.options.length > 1) stateFilterSelect.remove(1);

  const mapData = data.data.find(d => d.type === 'scattergeo');

  if (mapData && Array.isArray(mapData.text)) {
    const resorts = mapData.text.map(text => {
      const parts = text.split(',');
      const resortName = parts[0].trim();
      const stateMatch = (parts[1] || '').trim().match(/([A-Z]{2})/);
      const state = stateMatch ? stateMatch[0] : '';
      if (state) stateFilterOptions.add(state);
      return { name: resortName, state: state };
    });

    [...new Set(resorts.map(r => r.name))].sort().forEach(resort => {
      const option = document.createElement('option');
      option.value = resort;
      option.textContent = resort;
      filterSelect.appendChild(option);
    });

    [...stateFilterOptions].sort().forEach(state => {
      const option = document.createElement('option');
      option.value = state;
      option.textContent = state;
      stateFilterSelect.appendChild(option);
    });
  }
}

// Helper function to check if a property is in binary format
function isBinaryData(prop) {
  return prop && typeof prop === 'object' && prop.bdata && prop.dtype;
}

function decodeBase64ToFloat64Array(base64Str) {
  const binaryString = atob(base64Str);
  const uint8Array = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) uint8Array[i] = binaryString.charCodeAt(i);
  return Array.from(new Float64Array(uint8Array.buffer));
}

function convertBinaryData(data) {
  if (!data) return data;

  Object.keys(data).forEach(key => {
    const prop = data[key];
    if (prop && typeof prop === 'object') {
      if (isBinaryData(prop) && prop.dtype === 'f8') {
        try {
          data[key] = decodeBase64ToFloat64Array(prop.bdata);
        } catch {
          data[key] = [];
        }
      } else if (!Array.isArray(prop)) {
        convertBinaryData(prop);
      }
    }
  });

  return data;
}

// Debug function to inspect binary structure
function debugBinaryData(data) {
  const geo = data.data.find(d => d.type === 'scattergeo');
  if (!geo) {
    console.warn("No scattergeo data found.");
    return;
  }

  console.log("Raw binary data structure:", JSON.stringify({
    lat: geo.lat,
    lon: geo.lon,
    marker: geo.marker
  }, null, 2));
}

// Apply filters to map
function applyFilters() {
  if (!originalPlotlyData) return;

  const resortFilter = document.getElementById('filterSelect')?.value || 'all';
  const stateFilter = document.getElementById('stateFilter')?.value || 'all';

  const mapData = originalPlotlyData.data.find(d => d.type === 'scattergeo');
  if (!mapData || !Array.isArray(mapData.text)) return;

  const indices = mapData.text.map((text, i) => {
    return ((resortFilter === 'all' || text.includes(resortFilter)) &&
            (stateFilter === 'all' || text.includes(stateFilter))) ? i : -1;
  }).filter(i => i !== -1);

  // Create a deep copy of the original data
  const updatedData = JSON.parse(JSON.stringify(originalPlotlyData.data));
  const updatedMapData = updatedData.find(d => d.type === 'scattergeo');
  
  if (indices.length > 0) {
    Object.keys(updatedMapData).forEach(key => {
      if (Array.isArray(updatedMapData[key])) {
        updatedMapData[key] = indices.map(i => {
          return updatedMapData[key][i] !== undefined ? updatedMapData[key][i] : null;
        });
      }
    });
  } else {
    Object.keys(updatedMapData).forEach(key => {
      if (Array.isArray(updatedMapData[key])) updatedMapData[key] = [];
    });
  }

  // Use the exact original layout - don't modify it
  const updatedLayout = JSON.parse(JSON.stringify(originalPlotlyData.layout));

  // Use Plotly.react with the exact same configuration used for the initial plot
  Plotly.react('plotlyChart', updatedData, updatedLayout, {
    responsive: false,
    displayModeBar: true,
    modeBarButtonsToAdd: ['hoverClosestGeo', 'hoverCompareCartesian', 'resetGeo']
  });
}

// Load and render dashboard
d3.json("dashboard.json").then(function(data) {
  console.log("Dashboard data loaded:", data);

  debugBinaryData(data);

  console.log("Checking for binary data format...");
  console.log("Raw binary data structure:", 
    JSON.stringify({
      lat: data.data.find(d => d.type === 'scattergeo').lat,
      lon: data.data.find(d => d.type === 'scattergeo').lon,
      marker: data.data.find(d => d.type === 'scattergeo').marker
    }, null, 2)
  );
  
  // Convert layout and global-level data
  console.log("Raw binary data structure:", 
    JSON.stringify({
      lat: data.data.find(d => d.type === 'scattergeo').lat,
      lon: data.data.find(d => d.type === 'scattergeo').lon,
      marker: data.data.find(d => d.type === 'scattergeo').marker
    }, null, 2)
  );
  
  // Convert layout and global-level data
  data = convertBinaryData(data);
  
  // Convert each trace inside data.data
  if (Array.isArray(data.data)) {
    data.data = data.data.map(trace => convertBinaryData(trace));
  }
  
  // Convert each trace inside data.data
  if (Array.isArray(data.data)) {
    data.data = data.data.map(trace => convertBinaryData(trace));
  }
  console.log("Converted data:", data);

  const mapData = data.data.find(d => d.type === 'scattergeo');
  console.log("Converted Map Data:", mapData);

  originalPlotlyData = JSON.parse(JSON.stringify(data));
  initFilterOptions(data);

  const plotlyChartDiv = document.getElementById('plotlyChart');
  if (plotlyChartDiv) {
    const resetButton = document.createElement('button');
    resetButton.innerHTML = 'Reset View';
    resetButton.className = 'reset-btn';
    Object.assign(resetButton.style, {
      position: 'absolute',
      right: '10px',
      top: '10px',
      zIndex: '1000'
    });

    resetButton.onclick = () => {
      document.getElementById('filterSelect').value = 'all';
      document.getElementById('stateFilter').value = 'all';
      // Use the original data and layout without modification
      Plotly.react('plotlyChart', originalPlotlyData.data, originalPlotlyData.layout, {
        responsive: false,
        displayModeBar: true,
        modeBarButtonsToAdd: ['hoverClosestGeo', 'hoverCompareCartesian', 'resetGeo']
      });
    };


    plotlyChartDiv.style.position = 'relative';
    plotlyChartDiv.appendChild(resetButton);
  }

  if (mapData) {
    if (Array.isArray(mapData.text)) {
      mapData.hoverinfo = 'text';
      mapData.hoverlabel = {
        bgcolor: 'white',
        bordercolor: '#ccc',
        font: { family: 'Arial', size: 12 }
      };
    }

    if (mapData.marker) {
      mapData.marker.showscale = true;
      if (!mapData.marker.colorbar) {
        mapData.marker.colorbar = {
          title: { text: "% Black Runs" },
          thickness: 15,
          len: 0.5,
          x: 1.10,        // Slightly adjust right position
          xanchor: 'left',
          y: 0.5,
          yanchor: 'middle',
          outlinewidth: 1,
          outlinecolor: '#ccc',
          tickfont: { size: 10 }
        };
      }
    }
  }

  Object.assign(data.layout, {
    margin: { t: 50, r: 120, b: 100, l: 50 },  // Right margin of 120 is enough
    hovermode: 'closest',
    height: 700,
    autosize: false,
    legend: {
      title: { text: 'Legend' },
      orientation: 'h',
      yanchor: 'bottom',
      y: -0.2,
      xanchor: 'center',
      x: 0.5
    }
  });


  if (data.layout.geo) {
  Object.assign(data.layout.geo, {
    projection: { type: 'albers usa', scale: 1 },
    scope: 'usa',
    showland: true,
    landcolor: 'rgb(243, 243, 243)',
    showcountries: true,
    countrycolor: 'rgb(204, 204, 204)',
    showstates: true,
    statecolor: 'rgb(180, 180, 180)',
    showcoastlines: true,
    coastlinecolor: 'rgb(204, 204, 204)'
    // Remove the domain property completely
  });
}

  Plotly.newPlot('plotlyChart', data.data, data.layout, {
    responsive: true,
    displayModeBar: true,
    modeBarButtonsToAdd: ['hoverClosestGeo', 'hoverCompareCartesian', 'resetGeo']
  }).then(function() {
    // Add resize handler
    window.addEventListener('resize', function() {
      Plotly.Plots.resize('plotlyChart');
    });
  });
  
  }); // Close the d3.json callback here
  
  document.addEventListener('DOMContentLoaded', function() {
    const filterSelect = document.getElementById('filterSelect');
    const stateFilter = document.getElementById('stateFilter');
    const resetBtn = document.getElementById('resetFiltersBtn');
  
    if (filterSelect) filterSelect.addEventListener('change', applyFilters);
    if (stateFilter) stateFilter.addEventListener('change', applyFilters);
    
    if (resetBtn) {
      resetBtn.addEventListener('click', function() {
        document.getElementById('filterSelect').value = 'all';
        document.getElementById('stateFilter').value = 'all';
        // Use the original data and layout to reset
        if (originalPlotlyData) {
          Plotly.react('plotlyChart', 
                      originalPlotlyData.data, 
                      originalPlotlyData.layout, 
                      {responsive: false});
        }
      });
    }
  });