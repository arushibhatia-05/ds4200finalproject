d3.csv("slopes_comparison_long.csv").then(function(data) {
  data.forEach(function(d) {
    d.Percentage = +d.Percentage; 
  });

  const greenData = data.filter(d => d["Slope Type"] === "Green Slopes");
  const blueData = data.filter(d => d["Slope Type"] === "Blue Slopes");
  const blackData = data.filter(d => d["Slope Type"] === "Black Slopes");

  const greenTrace = {
    x: greenData.map(d => d.Region),
    y: greenData.map(d => d.Percentage),
    name: 'Green Slopes',
    type: 'bar',
    marker: {
      color: 'green'
    }
  };

  const blueTrace = {
    x: blueData.map(d => d.Region),
    y: blueData.map(d => d.Percentage),
    name: 'Blue Slopes',
    type: 'bar',
    marker: {
      color: 'blue'
    }
  };

  const blackTrace = {
    x: blackData.map(d => d.Region),
    y: blackData.map(d => d.Percentage),
    name: 'Black Slopes',
    type: 'bar',
    marker: {
      color: 'black'
    }
  };

  const layout = {
    title: 'Slope Type Distribution for East Coast vs West Coast Ski Resorts',
    barmode: 'stack',
    xaxis: {
      title: 'Region'
    },
    yaxis: {
      title: 'Percentage',
      tickformat: '.0f',
      range: [0, 100]
    },
    legend: {
      title: {
        text: 'Slope Type'
      }
    },
    hovermode: 'closest',
    hoverlabel: {
      bgcolor: 'white',
      bordercolor: '#ccc',
      font: {
        family: 'Arial',
        size: 12
      }
    },
    margin: {
      l: 50,
      r: 50,
      b: 50,
      t: 50,
      pad: 4
    }
  };

  Plotly.newPlot('slopeTypeChart', [greenTrace, blueTrace, blackTrace], layout, {
    responsive: true,
    displayModeBar: true,
    modeBarButtonsToAdd: ['resetScale2d']
  });
});

d3.csv("skiResort.csv").then(function(data) {
  const cleanedData = data.filter(d => d["State/Province"] && d.Altitude)
    .map(d => {
      return {
        resort: d["Resort Name"],
        state: d["State/Province"],
        altitude: +d.Altitude,
        easy: +d.Easy,
        intermediate: +d.Intermediate,
        difficult: +d.Difficult
      };
    })
    .filter(d => !isNaN(d.altitude));
  
  const usStates = [
    'Alaska', 'Arizona', 'California', 'Colorado', 'Idaho', 'Maine', 
    'Michigan', 'Minnesota', 'Montana', 'Nevada', 'New Hampshire',
    'New Mexico', 'New York', 'North Carolina', 'Oregon', 'Pennsylvania',
    'South Dakota', 'Utah', 'Vermont', 'Virginia', 'Washington', 
    'West Virginia', 'Wyoming'
  ];
  





  
  const usData = cleanedData.filter(d => usStates.includes(d.state));
  
  const fig = {
    data: [
      {
        type: 'box',
        name: 'State 1',
        y: [],
        boxpoints: 'all',
        jitter: 0.3,
        pointpos: -1.8,
        marker: {
          color: 'blue',
          opacity: 0.7
        },
        line: {
          color: 'blue'
        },
        fillcolor: 'rgba(0, 0, 255, 0.5)'
      },
      {
        type: 'box',
        name: 'State 2',
        y: [],
        boxpoints: 'all',
        jitter: 0.3,
        pointpos: -1.8,
        marker: {
          color: 'green',
          opacity: 0.7
        },
        line: {
          color: 'green'
        },
        fillcolor: 'rgba(0, 255, 0, 0.5)'
      }
    ],
    layout: {
      title: {
        text: 'Compare the altitude of two states using the dropdown menu',
        y: 0.85,  
        yanchor: 'bottom'
      },
      yaxis: {
        title: 'Altitude (m)',
        zeroline: false
      },
      boxmode: 'group',
      updatemenus: [
        {
          buttons: usStates.map(state => {
            return {
              method: 'restyle',
              label: state,
              args: [
                {
                  y: [usData.filter(d => d.state === state).map(d => d.altitude)],
                  'hoverlabel.bgcolor': 'blue',
                  hovertext: usData.filter(d => d.state === state).map(d => `${d.resort}<br>Altitude: ${d.altitude}m`)
                },
                [0]
              ]
            };
          }),
          direction: 'down',
          showactive: true,
          x: 0.25,
          xanchor: 'center',
          y: 1.30,  
          yanchor: 'top',
          bgcolor: '#f8f9fa',
          bordercolor: '#ccc',
          font: {
            size: 12
          }
        },
        {
          buttons: usStates.map(state => {
            return {
              method: 'restyle',
              label: state,
              args: [
                {
                  y: [usData.filter(d => d.state === state).map(d => d.altitude)],
                  'hoverlabel.bgcolor': 'green',
                  hovertext: usData.filter(d => d.state === state).map(d => `${d.resort}<br>Altitude: ${d.altitude}m`)
                },
                [1]
              ]
            };
          }),
          direction: 'down',
          showactive: true,
          x: 0.75,
          xanchor: 'center',
          y: 1.30,  
          yanchor: 'top',
          bgcolor: '#f8f9fa',
          bordercolor: '#ccc',
          font: {
            size: 12
          }
        }
      ],
      annotations: [
        {
          text: 'Select State 1:',
          x: 0.25,
          y: 1.37,  
          xref: 'paper',
          yref: 'paper',
          showarrow: false,
          font: {
            size: 14,
            color: '#0056b3'
          }
        },
        {
          text: 'Select State 2:',
          x: 0.75,
          y: 1.37,  
          xref: 'paper',
          yref: 'paper',
          showarrow: false,
          font: {
            size: 14,
            color: '#0056b3'
          }
        }
      ],
      margin: {
        l: 50,
        r: 50,
        b: 50,
        t: 150,  
        pad: 4
      },
      hovermode: 'closest',
      hoverlabel: {
        bgcolor: 'white',
        bordercolor: '#ccc',
        font: {
          family: 'Arial',
          size: 12
        }
      }
    }
  };
  

  const initialState1 = 'Colorado';
  const initialState2 = 'Vermont';
  

  fig.data[0].y = usData.filter(d => d.state === initialState1).map(d => d.altitude);
  fig.data[0].hovertext = usData.filter(d => d.state === initialState1).map(d => `${d.resort}<br>Altitude: ${d.altitude}m`);
  fig.data[1].y = usData.filter(d => d.state === initialState2).map(d => d.altitude);
  fig.data[1].hovertext = usData.filter(d => d.state === initialState2).map(d => `${d.resort}<br>Altitude: ${d.altitude}m`);
  





  Plotly.newPlot('altitudeBoxplot', fig.data, fig.layout, {
    responsive: true,
    displayModeBar: true,
    modeBarButtonsToAdd: ['resetScale2d']
  });
});


let dashboardData;
let originalPlotlyData;
let stateFilterOptions = new Set();


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

  const updatedLayout = JSON.parse(JSON.stringify(originalPlotlyData.layout));

  Plotly.react('plotlyChart', updatedData, updatedLayout, {
    responsive: false,
    displayModeBar: true,
    modeBarButtonsToAdd: ['hoverClosestGeo', 'hoverCompareCartesian', 'resetGeo']
  });
}






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
  
  console.log("Raw binary data structure:", 
    JSON.stringify({
      lat: data.data.find(d => d.type === 'scattergeo').lat,
      lon: data.data.find(d => d.type === 'scattergeo').lon,
      marker: data.data.find(d => d.type === 'scattergeo').marker
    }, null, 2)
  );
  
  data = convertBinaryData(data);
  
  if (Array.isArray(data.data)) {
    data.data = data.data.map(trace => convertBinaryData(trace));
  }
  
  if (Array.isArray(data.data)) {
    data.data = data.data.filter(trace => 
      trace.name !== "Whistler Blackcomb - BC Canada"
    );
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
          x: 1.50,
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
    margin: { t: 50, r: 120, b: 50, l: 50 },
    hovermode: 'closest',
    height: 700,
    autosize: true,
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
      coastlinecolor: 'rgb(204, 204, 204)',
      domain: {
        x: [0, 0.5],
        y: [0, 1]
      }
    });
  }

  Plotly.newPlot('plotlyChart', data.data, data.layout, {
    responsive: true,
    displayModeBar: true,
    modeBarButtonsToAdd: ['hoverClosestGeo', 'hoverCompareCartesian', 'resetGeo']
  }).then(function() {
    setTimeout(function() {
      const update = {
        'marker.colorbar.x': 1.05
      };
      Plotly.restyle('plotlyChart', update, 0);
    }, 500);
    
    window.addEventListener('resize', function() {
      Plotly.Plots.resize('plotlyChart');
      setTimeout(function() {
        const update = {
          'marker.colorbar.x': 1.05
        };
        Plotly.restyle('plotlyChart', update, 0);
      }, 500);
    });
  });
  
});

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
      if (originalPlotlyData) {
        Plotly.react('plotlyChart', 
                    originalPlotlyData.data, 
                    originalPlotlyData.layout, 
                    {responsive: false});
      }
    });
  }
});