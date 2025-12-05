// Multi-Client Support - Google Sheets URLs
const CLIENT_CONFIG_KEY = 'articleVisualizer_clientConfig';

// Get current client from URL parameter
function getCurrentClient() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('client') || 'default';
}

// Get client's sheet URL from localStorage
function getClientSheetUrl(clientName) {
    const clientConfig = JSON.parse(localStorage.getItem(CLIENT_CONFIG_KEY) || '{}');
    return clientConfig[clientName] || null;
}

// Load client data from their Google Sheet
async function loadClientData() {
    const clientName = getCurrentClient();
    const sheetUrl = getClientSheetUrl(clientName);

    if (!sheetUrl) {
        console.log('No sheet URL configured for client:', clientName);
        return [];
    }

    try {
        console.log('Loading data from Google Sheets for:', clientName);
        const response = await fetch(sheetUrl);

        if (!response.ok) {
            throw new Error(`Failed to fetch sheet data: ${response.status}`);
        }

        const csvText = await response.text();
        const parsedData = parseCSV(csvText);
        console.log(`Loaded ${parsedData.length} articles for ${clientName}`);
        return parsedData;
    } catch (error) {
        console.error('Error loading client data:', error);
        return [];
    }
}
