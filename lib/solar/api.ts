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

export async function geocodeLocation(query: string): Promise<{ lat: number; lng: number; name: string; state?: string } | null> {
  try {
    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    if (!token) return null;

    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${token}&country=in&types=place,locality,region`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    
    if (data.features && data.features.length > 0) {
      const feature = data.features[0];
      const lng = feature.center[0];
      const lat = feature.center[1];
      
      const stateContext = feature.context?.find((c: any) => c.id.startsWith("region"));
      
      return {
        lat,
        lng,
        name: feature.text,
        state: stateContext ? stateContext.text : undefined,
      };
    }
    return null;
  } catch (err) {
    console.error("Mapbox Geocoding Error:", err);
    return null;
  }
}

export async function searchLocations(query: string): Promise<Array<{ lat: number; lng: number; name: string; fullName: string; state?: string }>> {
  try {
    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    if (!token) return [];

    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${token}&country=in&types=place,locality,region&limit=5`;
    const res = await fetch(url);
    if (!res.ok) return [];
    const data = await res.json();
    
    if (data.features && data.features.length > 0) {
      return data.features.map((feature: any) => {
        const stateContext = feature.context?.find((c: any) => c.id.startsWith("region"));
        return {
          lat: feature.center[1],
          lng: feature.center[0],
          name: feature.text,
          fullName: feature.place_name,
          state: stateContext ? stateContext.text : undefined,
        };
      });
    }
    return [];
  } catch (err) {
    console.error("Mapbox Geocoding Error:", err);
    return [];
  }
}
