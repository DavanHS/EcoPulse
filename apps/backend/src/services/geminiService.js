import axios from 'axios';

export const geminiService = {
    async generateAdvisory({ pm25, no2, so2, o3, co, aqi, location }) {
        try {
            const prompt = `
You are an environmental health advisor. Based on the following air quality data for ${location}, provide a health advisory.

Air Quality Data:
- AQI: ${aqi}
- PM2.5: ${pm25 ? pm25 + ' µg/m³' : 'N/A'}
- NO2: ${no2 ? no2 + ' ppb' : 'N/A'}
- SO2: ${so2 ? so2 + ' ppb' : 'N/A'}
- O3: ${o3 ? o3 + ' ppb' : 'N/A'}
- CO: ${co ? co + ' mg/m³' : 'N/A'}

Please provide a response in the following JSON format:
{
  "riskLevel": <number between 1-5>,
  "advisoryMessage": "<2-3 sentence actionable health advice>",
  "activities": {
    "recommended": ["<activity 1>", "<activity 2>"],
    "avoid": ["<activity 1>", "<activity 2>"]
  }
}

Guidelines:
- Risk Level 1: Good air quality - Outdoor activities safe
- Risk Level 2: Moderate - Sensitive individuals should limit prolonged outdoor exertion
- Risk Level 3: Unhealthy for Sensitive - Children, elderly, those with respiratory issues should reduce outdoor activity
- Risk Level 4: Unhealthy - Everyone should limit prolonged outdoor exertion
- Risk Level 5: Very Unhealthy - Avoid outdoor activities, keep windows closed

Provide only the JSON object, no additional text.
`;

            const response = await axios.post(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${process.env.GEMINI_API_KEY}`,
                {
                    contents: [{ parts: [{ text: prompt }] }]
                },
                { headers: { 'Content-Type': 'application/json' } }
            );

            const text = response.data.candidates[0].content.parts[0].text;

            try {
                const parsed = JSON.parse(text);
                return {
                    riskLevel: parsed.riskLevel || this.calculateRiskLevel(aqi),
                    advisoryMessage: parsed.advisoryMessage || this.getDefaultAdvisory(aqi),
                    activities: parsed.activities || this.getDefaultActivities(aqi)
                };
            } catch (parseError) {
                return this.getFallbackResponse(aqi);
            }
        } catch (error) {
            console.error('Gemini API error:', error.message);
            return this.getFallbackResponse(aqi);
        }
    },

    calculateRiskLevel(aqi) {
        if (aqi <= 50) return 1;
        if (aqi <= 100) return 2;
        if (aqi <= 150) return 3;
        if (aqi <= 200) return 4;
        return 5;
    },

    getDefaultAdvisory(aqi) {
        const advisories = {
            1: 'Air quality is good. Enjoy outdoor activities!',
            2: 'Air quality is moderate. Sensitive individuals should consider limiting prolonged outdoor exertion.',
            3: 'Air quality is unhealthy for sensitive groups. Consider reducing prolonged outdoor activities.',
            4: 'Air quality is unhealthy. Limit prolonged outdoor exertion.',
            5: 'Air quality is very unhealthy. Avoid outdoor activities.'
        };
        return advisories[this.calculateRiskLevel(aqi)] || advisories[3];
    },

    getDefaultActivities(aqi) {
        const level = this.calculateRiskLevel(aqi);
        if (level <= 2) {
            return {
                recommended: ['Outdoor running', 'Cycling', 'Walking'],
                avoid: []
            };
        } else if (level === 3) {
            return {
                recommended: ['Light outdoor walking', 'Indoor exercises'],
                avoid: ['Prolonged outdoor exertion', 'Heavy exercise']
            };
        } else {
            return {
                recommended: ['Indoor exercises', 'Yoga', 'Stretching'],
                avoid: ['Outdoor activities', 'Running', 'Cycling']
            };
        }
    },

    getFallbackResponse(aqi) {
        return {
            riskLevel: this.calculateRiskLevel(aqi),
            advisoryMessage: this.getDefaultAdvisory(aqi),
            activities: this.getDefaultActivities(aqi)
        };
    }
};