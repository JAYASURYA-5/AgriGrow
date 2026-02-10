const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Indian market price data - simulated based on actual market trends
// In production, this would integrate with real APIs like Agmarknet, NDDB, NECC
const getMarketPrices = () => {
  // Base prices (approximate Indian market averages)
  const basePrices = {
    cattle: 45000,      // per head
    buffalo: 55000,     // per head
    goat: 8500,         // per head
    sheep: 7500,        // per head
    cowMilk: 52,        // per litre
    buffaloMilk: 65,    // per litre
    eggs: 6.5,          // per piece
    chicken: 180,       // per kg live weight
  };

  // Add some realistic variation (±5%)
  const variation = () => (Math.random() - 0.5) * 0.1;
  
  const prices: Record<string, number> = {};
  const changes: Record<string, number> = {};
  
  for (const [key, basePrice] of Object.entries(basePrices)) {
    const variationFactor = 1 + variation();
    prices[key] = Math.round(basePrice * variationFactor * 100) / 100;
    changes[key] = Math.round((variationFactor - 1) * 100 * 10) / 10;
  }

  return { prices, changes };
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Fetching market prices...");
    
    const { prices, changes } = getMarketPrices();
    
    console.log("Market prices generated:", JSON.stringify(prices));

    return new Response(
      JSON.stringify({
        success: true,
        prices,
        changes,
        source: "Indian Market Average",
        timestamp: new Date().toISOString(),
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error("Error fetching market prices:", error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: (error as Error).message,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
