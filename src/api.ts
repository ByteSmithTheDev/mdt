import { Officer, Vehicle } from './types';
import { SHEET_ID, VEHICLES_API_URL } from './constants';

export async function fetchOfficers(): Promise<Officer[]> {
  try {
    const response = await fetch(
      `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&tq=SELECT B, F WHERE B IS NOT NULL AND F IS NOT NULL`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch officers data');
    }

    const text = await response.text();
    const jsonString = text.match(/google\.visualization\.Query\.setResponse\((.*)\);/)?.[1];
    
    if (!jsonString) {
      throw new Error('Invalid response format');
    }

    const jsonData = JSON.parse(jsonString);

    if (!jsonData.table || !jsonData.table.rows) {
      throw new Error('Invalid data structure');
    }

    return jsonData.table.rows
      .map((row: any) => ({
        callSign: row.c[0]?.v || '',
        name: row.c[1]?.v || '',
      }))
      .filter((officer: Officer) => 
        officer.callSign && 
        officer.name && 
        !officer.callSign.includes('/') && 
        !officer.name.includes('/')
      );
  } catch (error) {
    console.error('Error fetching officers:', error);
    throw error;
  }
}

export async function fetchVehicles(): Promise<Vehicle[]> {
  try {
    const response = await fetch(VEHICLES_API_URL);

    if (!response.ok) {
      throw new Error('Failed to fetch vehicles data');
    }

    const jsonData = await response.json();

    return jsonData
      .map((vehicle: any) => ({
        name: vehicle.name || '',
      }))
      .filter((vehicle: Vehicle) => vehicle.name);
  } catch (error) {
    console.error('Error fetching vehicles:', error);
    throw error;
  }
}