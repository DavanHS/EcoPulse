export const POLLUTANT_INFO = {
    pm25: {
        name: 'PM₂.₅',
        description: 'Fine particulate matter smaller than 2.5 micrometers that can penetrate deep into lungs',
        source: 'Vehicle emissions, industrial processes, construction, burning of fuels',
        healthEffect: 'Can cause respiratory problems, asthma attacks, and cardiovascular issues',
    },
    pm10: {
        name: 'PM₁₀',
        description: 'Coarse particulate matter smaller than 10 micrometers',
        source: 'Dust, pollen, construction sites, vehicle wear, industrial processes',
        healthEffect: 'Can irritate respiratory tract and worsen lung conditions',
    },
    no2: {
        name: 'NO₂',
        description: 'Nitrogen dioxide - a reactive gas produced from high-temperature combustion',
        source: 'Vehicle emissions, power plants, industrial furnaces, cooking',
        healthEffect: 'Can cause respiratory inflammation and reduce lung function',
    },
    so2: {
        name: 'SO₂',
        description: 'Sulfur dioxide - a pungent gas produced from burning fossil fuels',
        source: 'Coal-fired power plants, industrial processes, ships, diesel engines',
        healthEffect: 'Can cause breathing difficulties and worsen asthma',
    },
    o3: {
        name: 'O₃',
        description: 'Ground-level ozone - formed when pollutants react in sunlight',
        source: 'Vehicle emissions, industrial chemicals, solvents, power plants',
        healthEffect: 'Can cause chest pain, coughing, and throat irritation',
    },
    co: {
        name: 'CO',
        description: 'Carbon monoxide - a colorless, odorless gas from incomplete combustion',
        source: 'Vehicle exhaust, faulty furnaces, tobacco smoke, burning fuels',
        healthEffect: 'Reduces oxygen in blood, causing dizziness and headaches',
    },
    aqi: {
        name: 'AQI',
        description: 'Air Quality Index - a scale that summarizes overall air quality',
        source: 'Calculated based on all major pollutants measured at a station',
        healthEffect: 'Higher AQI means worse air quality and greater health concerns',
    },
};

export const COMPARISON_POLLUTANTS = [
    { key: 'aqi', label: 'AQI' },
    { key: 'pm25', label: 'PM₂.₅', unit: 'µg/m³' },
    { key: 'pm10', label: 'PM₁₀', unit: 'µg/m³' },
    { key: 'no2', label: 'NO₂', unit: 'ppb' },
    { key: 'so2', label: 'SO₂', unit: 'ppb' },
    { key: 'o3', label: 'O₃', unit: 'ppb' },
];