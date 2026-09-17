export async function fetchNASA_PSH(lat: number, lng: number): Promise<number | null> {
  try {
    const url = `https://power.larc.nasa.gov/api/temporal/climatology/point?parameters=ALLSKY_SFC_SW_DWN&community=RE&longitude=${lng}&latitude=${lat}&format=JSON`;
    
    // Add an abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);
    
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`NASA API HTTP error: ${response.status}`);
    }
    
    const data = await response.json();
    const annualGHI = data?.properties?.parameter?.ALLSKY_SFC_SW_DWN?.ANN;
    
    if (annualGHI && typeof annualGHI === "number" && annualGHI > 0) {
      // NASA returns values like 5.42, round to 2 decimal places
      return Math.round(annualGHI * 100) / 100;
    }
    
    return null;
  } catch (error) {
    console.error("NASA POWER API Fetch Error:", error);
    return null; // The fallback mechanism will handle this in the computation logic
  }
}
