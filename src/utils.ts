import { bankLocations, storeLocations, stockadeLocations } from './constants';

export function getLocationName(value: string): string {
  const allLocations = [...bankLocations, ...storeLocations, ...stockadeLocations];
  return allLocations.find(loc => loc.value === value)?.label || value;
}

export function generateReport(
  incidentType: 'bank' | 'jewelry' | 'store' | 'seizure' | 'drugs' | 'stockade' | 'code5' | 'codered' | 'shootout' | 'civilian'| 'cadet',
  sceneAssignment: any,
  pursuitDetails: any,
  robberyDetails: any,
  vehicleDetails: any,
  drugDetails?: any,
  code5Details?: any,
  codeRedDetails?: any,
  shootoutDetails?: any,
  civilianDetails?: any,
  cadetDetails?: any
): string {
  const currentDate = new Date().toLocaleString();

  if (incidentType === 'cadet') {
    return `[TRAINING OFFICER]:\n${cadetDetails.trainingOfficer}\n\n` +
      `[CADET]:\n${cadetDetails.cadetName}\n\n` +
      `Phase: ${cadetDetails.phase}\n\n` +
      `Activities Completed Successfully:\n${cadetDetails.activities.join('\n')}\n\n` +
      `Notes:\n${cadetDetails.notes}\n\n` +
      `${cadetDetails.overallPerformance}`;
  }

  if (incidentType === 'civilian') {
    return `[REPORTING OFFICER]:\n${sceneAssignment.reportingOfficer}\n\n` +
      `During normal patrol routine, we had an individual come to PD to make a complaint they had.\n\n` +
      `Reporting Civilian's Name: ${civilianDetails.name}\n` +
      `Reporting Civilian's Number: ${civilianDetails.phoneNumber}\n\n` +
      `Type of report: ${civilianDetails.reportType}\n\n` +
      `INCIDENT DESCRIPTION:\n${civilianDetails.description}\n\n`+
      `MDT created by ${sceneAssignment.mdtCreatedBy}\n\n` ;
  }
  

  if (incidentType === 'shootout') {
    const weaponsList = shootoutDetails.weapons
      .map(weapon => `Weapon: ${weapon.name} | Serial Number: ${weapon.serial}`)
      .join('\n');

      return `[REPORTING OFFICER]:\n${sceneAssignment.reportingOfficer}\n\n` +
      `[INCIDENT DETAILS]:\n` +
      `During normal patrol, we had a shootout happen between police officers and a group of people.\n` +
      `The whole shootout that has occured, originated from ${shootoutDetails.originatedFrom}.\n` +
      `The location being ${shootoutDetails.location}.\n\n` +
      `After the shootout, we counted:\n` +
      `- Suspects total: ${shootoutDetails.totalSuspects}\n` +
      `- Suspects downed: ${shootoutDetails.suspectsDowned}\n` +
      `- Officers downed: ${shootoutDetails.officersDowned}\n\n` +
      `[WEAPONS INFORMATION]:\n${weaponsList}\n\n` +
      `[MEDICAL ATTENTION]:\n` +
      `After we apprehended the suspects, they were in need of medical attention. ` +
      `We brought the injured people (Suspects Total: ${shootoutDetails.injuredSuspects} | PD Total: ${shootoutDetails.injuredOfficers}) to Mount Zonah.\n` +
      `Once everyone got medical treatment, we started heading back towards the PD.\n` +
      `${shootoutDetails.attemptedFlee ? 'The suspect attempted to flee at the hospital but was apprehended.' : ''}\n\n` +
      `[PROCESSED]:\n` +
      `All of the apprehended suspects were processed at ${shootoutDetails.processedAt}.\n\n`+
      `Incident report was created by ${sceneAssignment.mdtCreatedBy}.\n\n`;
  }

  if (incidentType === 'codered') {
    const weaponsList = codeRedDetails.weapons
      .map(weapon => `Weapon: ${weapon.name} | Serial Number: ${weapon.serial}`)
      .join('\n');

    return `CODE RED/SHOOTOUT REPORT\n\n` +
      `[REPORTING OFFICER]:\n${sceneAssignment.reportingOfficer}\n\n` +
      `[LOCATION]:\n${codeRedDetails.location}\n\n` +
      `[DESCRIBE INCIDENT]:\n` +
      `During routine patrol, we had received a few 10-32 (Person with a gun) dispatch calls over by the location mentioned above.\n\n` +
      `At first glance, we noticed that the two gangs who were fighting each other were wearing the following colors: ` +
      `${codeRedDetails.gang1Color} & ${codeRedDetails.gang2Color}\n\n` +
      `[WEAPON INFORMATION]:\n${weaponsList}\n\n` +
      `[MEDICAL ATTENTION]:\n` +
      `${codeRedDetails.medicalAttention 
        ? 'Medical attention was provided to the injured parties.'
        : 'Due to no suspects or officers having any major injuries, everyone waived their rights to medical attention.'}\n\n` +
      `[PROCESSED]:\n` +
      `All of the apprehended suspects were processed at ${codeRedDetails.processedAt}.\n\n` +
      `Incident report was created by ${sceneAssignment.mdtCreatedBy}.\n\n` +
      `${codeRedDetails.charges.join(' | ')}`;
  }

  if (incidentType === 'code5') {
    return `10-11/Code 5 REPORT\n\n` +
      `[REPORTING OFFICER]:\n${sceneAssignment.reportingOfficer}\n\n` +
      `[STOP INFORMATION]:\n` +
      `During routine patrol, we pulled over a vehicle next to ${code5Details.location}.\n` +
      `The reason for us pulling over the vehicle was because we caught them excessively speeding.\n` +
      `The exact speed we clocked the vehicle travelling at was ${code5Details.speed} mph.\n\n` +
      `[ARREST INFORMATION]:\n` +
      `After analyzing the whole situation and also taking into account that the driver was exceeding the speed limit enough to get arrested, ` +
      `we asked the driver to step out of the vehicle. From there the driver was placed in handcuffs and under police custody.\n\n` +
      `[VEHICLE DESCRIPTION]:\n` +
      `The vehicle was a ${vehicleDetails.model} | ${vehicleDetails.color} (PLATE: ${vehicleDetails.plate}). ` +
      `The vehicle was registered to an individual named ${vehicleDetails.registeredTo}. ` +
      `Once everyone was ready, the chase started and they attempted to evade from police recklessly.` +
      `Report created by ${sceneAssignment.mdtCreatedBy}. ` +
      (vehicleDetails.escaped ? ` The chase continued but the suspect's somehow managed to flee away.\n\n` : '');
  }

  if (incidentType === 'stockade') {
    return `INCIDENT REPORT\n\n` +
      `Incident Number: ${robberyDetails.incidentNumber || 'STK-' + Math.floor(Math.random() * 10000)}\n\n` +
      `Date and Time of Incident: ${robberyDetails.dateTime || currentDate}\n\n` +
      `Location of Incident: ${getLocationName(robberyDetails.location)}\n\n` +
      `Officer Reporting: ${sceneAssignment.reportingOfficer}\n\n` +
      `Scene Command: ${sceneAssignment.sceneCommand}\n\n` +
      `Negotiator: ${sceneAssignment.negotiator}\n\n` +
      `Hostage Involved: ${sceneAssignment.stayedBackForHostage}\n\n` +
      `Pursuit Details:\n\n` +
      `Primary Pursuit Vehicle: ${vehicleDetails.color} ${vehicleDetails.model} (${vehicleDetails.plate})\n` +
      `Primary Pursuit Officer: ${pursuitDetails.primary}\n` +
      `Secondary Pursuit Officer: ${pursuitDetails.secondary}\n` +
      `Tertiary Pursuit Officer: ${pursuitDetails.tertiary}\n\n` +
      `Incident Summary:\n\n` +
      `On ${robberyDetails.dateTime || currentDate}, an armored stockade truck robbery occurred at ${getLocationName(robberyDetails.location)}. ` +
      `The truck, belonging to ${robberyDetails.truckingCompany || 'Gruppe 6'}, was transporting ${robberyDetails.valuables || 'valuable assets'}.\n\n` +
      `Suspect Information:\n\n` +
      `Number of Suspects: ${robberyDetails.robbersInside}\n` +
      `Number of suspects Apprehended: ${robberyDetails.robbersOutside}\n` +
      `Hostages: ${robberyDetails.hostages}\n` +
      `Vehicle Description: ${vehicleDetails.color} ${vehicleDetails.model} (PLATE: ${vehicleDetails.plate})\n` +
      `Vehicle Registered to: ${vehicleDetails.registeredTo}\n` +
      `MDT created by: ${sceneAssignment.mdtCreatedBy}\n` +
      (pursuitDetails.escaped ? `The chase continued but the suspect's somehow managed to flee away.\n\n` : '');
  } else if (incidentType === 'drugs') {
    return `10-66 | ${drugDetails.location}\n\n` +
      `REPORTING OFFICER:\n${sceneAssignment.reportingOfficer}\n\n` +
      `DESCRIPTION:\n` +
      `While patrolling, we received a report of a suspicious activity going on at ${drugDetails.location}. ` +
      `While arriving on the scene we got the eyes on ${drugDetails.suspects} suspects selling drugs to the locals.\n\n` +
      `On arriving at the scene we came to know that there were ${drugDetails.suspects} who were doing the unfair practice.\n\n` +
      `Vehicle Details:\n` +
      `Model: ${vehicleDetails.model}\n` +
      `Color: ${vehicleDetails.color}\n` +
      `Plate: ${vehicleDetails.plate}\n` +
      `Registered to: ${vehicleDetails.registeredTo}\n` +
      `Incident report was created by: ${sceneAssignment.mdtCreatedBy}\n` +
      (vehicleDetails.escaped ? `The chase continued but the suspect's somehow managed to flee away.\n\n` : '');
  } else if (incidentType === 'bank' || incidentType === 'jewelry' || incidentType === 'store') {
    const location = incidentType === 'jewelry' 
      ? 'Vangelico Jewelry Store'
      : getLocationName(robberyDetails.location);

    const reportTitle = incidentType === 'jewelry'
      ? '10-90 | Jewellery Store: Vangelico'
      : incidentType === 'store'
        ? `10-90 | Store Robbery: ${location}`
        : `10-90 | Bank Robbery: ${location}`;

    return `${reportTitle}\n\n` +
      `REPORTING OFFICER:\n${sceneAssignment.reportingOfficer}\n\n` +
      `SCENE ASSIGNMENT\n` +
      `Scene Command: ${sceneAssignment.sceneCommand}\n` +
      `Negotiator: ${sceneAssignment.negotiator}\n` +
      `Stayed Back For Hostage: ${sceneAssignment.stayedBackForHostage}\n\n` +
      `INVOLVED IN PURSUIT:\n` +
      `Filled By Scene command assigned officer\n` +
      `Primary: ${pursuitDetails.primary}\n` +
      `Secondary: ${pursuitDetails.secondary}\n` +
      `Tertiary: ${pursuitDetails.tertiary}\n` +
      `Parallel: ${pursuitDetails.parallel}\n` +
      `${pursuitDetails.showExtra ? `5th Unit: ${pursuitDetails.fifthUnit}\n` : ''}` +
      `${pursuitDetails.showExtra ? `Air1: ${pursuitDetails.airOne}\n` : ''}\n` +
      `DETAILS & DEMANDS\n\n` +
      `While patrolling, we received a report of an alarm going off at the ${location}. ` +
      `${sceneAssignment.mdtCreatedBy} was assigned to create an incident report.\n\n` +
      `After setting up the perimeters around the area, we began with the negotiations. ` +
      `By interacting with the robbers we learned few below mentioned things:\n\n` +
      `Robbers Involved: ${robberyDetails.robbersInside}\n` +
      `Robbers Apprehended: ${robberyDetails.robbersOutside}\n` +
      `Hostages: ${robberyDetails.hostages}\n\n` +
      `Vehicle Details\n` +
      `Model: ${vehicleDetails.model}\n` +
      `Color: ${vehicleDetails.color}\n` +
      `Plate: ${vehicleDetails.plate}\n` +
      `Registered to: ${vehicleDetails.registeredTo}\n\n` +
      `Robbers were unidentified and in exchange of the hostage, their demand was ${robberyDetails.demands}.\n\n` +
      `Once everyone was ready, scene command prepared a lineup for the pursuit.\n\n` +
      `CHASE:\n` +
      `Once everyone was ready, the chase started and they attempted to evade from police recklessly. ` +
      `The officers followed the suspects vehicle according to the sequence. ` +
      `The robbers kept roaming in the city and were damaging the public property.` +
      `${pursuitDetails.escaped ? ' The chase continued but the suspect\'s somehow managed to flee away.' : ''}`;
  } else {
    return `VEHICLE SEIZURE REPORT\n\n` +
      `[VEHICLE DETAILS]:\n` +
      `Model: ${vehicleDetails.model}\n` +
      `Color: ${vehicleDetails.color}\n` +
      `Plate: ${vehicleDetails.plate}\n` +
      `Registered to: ${vehicleDetails.registeredTo}\n\n` +
      `[SEIZURE DETAILS]:\n` +
      `Reason: ${vehicleDetails.seizeReason}\n` +
      `Duration: ${vehicleDetails.seizeDuration} Minutes`+
      `Report created by: ${sceneAssignment.mdtCreatedBy}`;
  }
}
