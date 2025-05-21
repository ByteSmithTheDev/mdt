import './style.css';

function generateReport() {
  const form = document.getElementById('incidentForm');
  const output = document.getElementById('reportOutput');
  const reportText = document.getElementById('reportText');

  const report = `REPORTING OFFICER: ${form.reportingOfficer.value}

SCENE ASSIGNMENT
Scene Command: ${form.sceneCommand.value}
Negotiator: ${form.negotiator.value}
Stayed Back For Hostage: ${form.stayedBack.value}

INVOLVED IN PURSUIT
Primary: ${form.primary.value}
Secondary: ${form.secondary.value}
Tertiary: ${form.tertiary.value}
Parallel: ${form.parallel.value}

DETAILS & DEMANDS
Robbers Inside: ${form.robbersInside.value}
Robbers Outside: ${form.robbersOutside.value}
Hostages: ${form.hostages.value}
Demands: ${form.demands.value}

VEHICLE DETAILS
Model: ${form.vehicleModel.value}
Color: ${form.vehicleColor.value}
Plate: ${form.vehiclePlate.value}
Registered To: ${form.registeredTo.value}`;

  reportText.textContent = report;
  output.style.display = 'block';
}

window.generateReport = generateReport;

document.querySelector('#app').innerHTML = `
  <div class="container">
    <div class="header">
      <h1>EZ MDT [INCIDENT REPORT]</h1>
    </div>
    
    <form id="incidentForm" onsubmit="return false;">
      <div class="form-section">
        <h2>REPORTING OFFICER</h2>
        <div class="form-group">
          <label for="reportingOfficer">Officer Name & Call Sign:</label>
          <input type="text" id="reportingOfficer" required>
        </div>
      </div>

      <div class="form-section">
        <h2>SCENE ASSIGNMENT</h2>
        <div class="grid">
          <div class="form-group">
            <label for="sceneCommand">Scene Command:</label>
            <input type="text" id="sceneCommand" required>
          </div>
          <div class="form-group">
            <label for="negotiator">Negotiator:</label>
            <input type="text" id="negotiator" required>
          </div>
          <div class="form-group">
            <label for="stayedBack">Stayed Back For Hostage:</label>
            <input type="text" id="stayedBack" required>
          </div>
        </div>
      </div>

      <div class="form-section">
        <h2>INVOLVED IN PURSUIT</h2>
        <div class="grid">
          <div class="form-group">
            <label for="primary">Primary:</label>
            <input type="text" id="primary">
          </div>
          <div class="form-group">
            <label for="secondary">Secondary:</label>
            <input type="text" id="secondary">
          </div>
          <div class="form-group">
            <label for="tertiary">Tertiary:</label>
            <input type="text" id="tertiary">
          </div>
          <div class="form-group">
            <label for="parallel">Parallel:</label>
            <input type="text" id="parallel">
          </div>
        </div>
      </div>

      <div class="form-section">
        <h2>DETAILS & DEMANDS</h2>
        <div class="form-group">
          <label for="robbersInside">Robbers Inside:</label>
          <input type="number" id="robbersInside" min="0" required>
        </div>
        <div class="form-group">
          <label for="robbersOutside">Robbers Outside:</label>
          <input type="number" id="robbersOutside" min="0" required>
        </div>
        <div class="form-group">
          <label for="hostages">Hostages:</label>
          <input type="number" id="hostages" min="0" required>
        </div>
        <div class="form-group">
          <label for="demands">Demands:</label>
          <textarea id="demands" rows="3" required></textarea>
        </div>
      </div>

      <div class="form-section">
        <h2>VEHICLE DETAILS</h2>
        <div class="grid">
          <div class="form-group">
            <label for="vehicleModel">Model:</label>
            <input type="text" id="vehicleModel" required>
          </div>
          <div class="form-group">
            <label for="vehicleColor">Color:</label>
            <input type="text" id="vehicleColor" required>
          </div>
          <div class="form-group">
            <label for="vehiclePlate">Plate:</label>
            <input type="text" id="vehiclePlate" required>
          </div>
          <div class="form-group">
            <label for="registeredTo">Registered To:</label>
            <input type="text" id="registeredTo" required>
          </div>
        </div>
      </div>

      <button type="submit" class="btn" onclick="generateReport()">Generate Report</button>
    </form>

    <div id="reportOutput" class="form-section" style="display: none;">
      <h2>Generated Report</h2>
      <pre id="reportText"></pre>
    </div>
  </div>
`;