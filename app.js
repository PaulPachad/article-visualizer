// Multi-Client Support - URL-Based Configuration
// Clients can be accessed via: ?client=name&sheet=ENCODED_URL
// Or via localStorage for convenience

// Get current client from URL parameter
function getCurrentClient() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('client') || 'default';
}

// Get client's sheet URL from URL parameter or localStorage
function getClientSheetUrl(clientName) {
    const urlParams = new URLSearchParams(window.location.search);

    // First, check if sheet URL is in the URL itself
    const sheetParam = urlParams.get('sheet');
    if (sheetParam) {
        try {
            return decodeURIComponent(sheetParam);
        } catch (e) {
            console.error('Error decoding sheet URL:', e);
        }
    }

    // Otherwise, check localStorage
    const CLIENT_CONFIG_KEY = 'articleVisualizer_clientConfig';
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

// App State
let currentArticles = [];
let selectedArticle = null;

// Initialize app
document.addEventListener('DOMContentLoaded', async () => {
    // Load client-specific data from Google Sheets
    const clientData = await loadClientData();
    if (clientData.length > 0) {
        articlesData.length = 0;
        articlesData.push(...clientData);
        currentArticles = [...articlesData];
    } else {
        currentArticles = [...articlesData];
    }

    // Show client name in header
    updateClientHeader();

    initializeFilters();
    renderArticles(currentArticles);
    setupEventListeners();
});

// Update header to show client name
function updateClientHeader() {
    const clientName = getCurrentClient();
    const clientNameElement = document.getElementById('client-name');
    if (clientNameElement && clientName !== 'default') {
        const formattedName = clientName.charAt(0).toUpperCase() + clientName.slice(1);
        clientNameElement.textContent = `Authority Magazine - ${formattedName}`;
    }
}

// Initialize filter dropdowns
function initializeFilters() {
    const topicFilter = document.getElementById('topicFilter');
    topicFilter.innerHTML = '<option value="">All Topics</option>';

    const topics = [...new Set(articlesData.map(article => article.topic))].sort();
    topics.forEach(topic => {
        const option = document.createElement('option');
        option.value = topic;
        option.textContent = topic;
        topicFilter.appendChild(option);
    });
}

// Setup event listeners
function setupEventListeners() {
    const searchInput = document.getElementById('searchInput');
    const topicFilter = document.getElementById('topicFilter');
    const statusFilter = document.getElementById('statusFilter');
    const closePanel = document.getElementById('closePanel');
    const importBtn = document.getElementById('importBtn');
    const closeModal = document.getElementById('closeModal');
    const cancelImport = document.getElementById('cancelImport');
    const fileUploadArea = document.getElementById('fileUploadArea');
    const csvFileInput = document.getElementById('csvFileInput');

    searchInput.addEventListener('input', handleSearch);
    topicFilter.addEventListener('change', handleFilter);
    statusFilter.addEventListener('change', handleFilter);
    closePanel.addEventListener('click', closeSidePanel);

    // Import modal listeners
    importBtn.addEventListener('click', openImportModal);
    closeModal.addEventListener('click', closeImportModal);
    cancelImport.addEventListener('click', closeImportModal);

    // File upload listeners
    fileUploadArea.addEventListener('click', () => csvFileInput.click());
    csvFileInput.addEventListener('change', handleFileSelect);

    // Drag and drop
    fileUploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        fileUploadArea.style.borderColor = 'var(--accent-primary)';
        fileUploadArea.style.background = 'rgba(37, 99, 235, 0.05)';
    });

    fileUploadArea.addEventListener('dragleave', () => {
        fileUploadArea.style.borderColor = 'var(--border-color)';
        fileUploadArea.style.background = 'var(--bg-tertiary)';
    });

    fileUploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        fileUploadArea.style.borderColor = 'var(--border-color)';
        fileUploadArea.style.background = 'var(--bg-tertiary)';

        const files = e.dataTransfer.files;
        if (files.length > 0 && files[0].name.endsWith('.csv')) {
            handleFile(files[0]);
        }
    });

    // Close panel when clicking outside
    document.addEventListener('click', (e) => {
        const sidePanel = document.getElementById('sidePanel');
        if (sidePanel.classList.contains('active') &&
            !sidePanel.contains(e.target) &&
            !e.target.closest('.article-card')) {
            closeSidePanel();
        }

        // Close modal when clicking outside
        const modal = document.getElementById('importModal');
        if (modal.classList.contains('active') && e.target === modal) {
            closeImportModal();
        }
    });
}

// Handle search
function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase();

    currentArticles = articlesData.filter(article => {
        return (
            article.intervieweeName.toLowerCase().includes(searchTerm) ||
            article.intervieweeCompany.toLowerCase().includes(searchTerm) ||
            article.topic.toLowerCase().includes(searchTerm) ||
            (article.publicistName && article.publicistName.toLowerCase().includes(searchTerm))
        );
    });

    applyFilters();
}

// Handle filters
function handleFilter() {
    applyFilters();
}

// Apply all filters
function applyFilters() {
    const topicFilter = document.getElementById('topicFilter').value;
    const statusFilter = document.getElementById('statusFilter').value;

    let filtered = [...currentArticles];

    if (topicFilter) {
        filtered = filtered.filter(article => article.topic === topicFilter);
    }

    if (statusFilter) {
        filtered = filtered.filter(article => article.status === statusFilter);
    }

    renderArticles(filtered);
}

// Render articles grid
function renderArticles(articles) {
    const grid = document.getElementById('articlesGrid');

    if (articles.length === 0) {
        grid.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">🔍</div>
                <p class="empty-state-text">No articles found</p>
            </div>
        `;
        return;
    }

    grid.innerHTML = articles.map((article, index) => {
        console.log(`Article: ${article.intervieweeName}, Headshot URL: "${article.headshot}"`);

        const imageHtml = article.headshot
            ? `<img src="${article.headshot}" alt="${article.intervieweeName}" class="article-image" onerror="console.error('Failed to load image:', '${article.headshot}'); this.outerHTML='<div class=\\'article-image\\' style=\\'background: linear-gradient(135deg, #e0e7ff 0%, #dbeafe 100%); display: flex; align-items: center; justify-content: center; font-size: 3rem; color: #2563eb;\\'>\u{1F464}</div>'">`
            : `<div class="article-image" style="background: linear-gradient(135deg, #e0e7ff 0%, #dbeafe 100%); display: flex; align-items: center; justify-content: center; font-size: 3rem; color: #2563eb;">👤</div>`;

        return `
        <article class="article-card" onclick="openSidePanel(${articlesData.indexOf(article)})" style="animation-delay: ${index * 50}ms">
            ${imageHtml}
            <div class="article-content">
                <span class="article-topic">${article.topic}</span>
                <h2 class="article-title">${article.intervieweeName}</h2>
                <p class="article-interviewee">${article.intervieweeCompany}</p>
                <div class="article-meta">
                    <span class="article-date">${formatDate(article.publishDate)}</span>
                    <span class="status-badge status-${article.status}">${article.status}</span>
                </div>
            </div>
        </article>
        `;
    }).join('');
}

// Open side panel with article details
function openSidePanel(index) {
    selectedArticle = articlesData[index];
    const panel = document.getElementById('sidePanel');
    const panelDetails = document.getElementById('panelDetails');

    const panelImageHtml = selectedArticle.actionShot
        ? `<img src="${selectedArticle.actionShot}" alt="${selectedArticle.intervieweeName}" class="panel-image" onerror="this.outerHTML='<div class=\\'panel-image\\' style=\\'background: linear-gradient(135deg, #e0e7ff 0%, #dbeafe 100%); display: flex; align-items: center; justify-content: center; font-size: 4rem; color: #2563eb;\\'>👤</div>'">`
        : `<div class="panel-image" style="background: linear-gradient(135deg, #e0e7ff 0%, #dbeafe 100%); display: flex; align-items: center; justify-content: center; font-size: 4rem; color: #2563eb;">👤</div>`;

    panelDetails.innerHTML = `
        <div class="panel-header">
            ${panelImageHtml}
            <h2 class="panel-title">${selectedArticle.intervieweeName}</h2>
            <span class="panel-topic">${selectedArticle.topic}</span>
        </div>
        
        <div class="panel-section">
            <h3 class="section-title">Interviewee Details</h3>
            <div class="section-content">
                <div class="contact-item">
                    <svg class="contact-icon" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"/>
                    </svg>
                    <span>${selectedArticle.intervieweeName}</span>
                </div>
                <div class="contact-item">
                    <svg class="contact-icon" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clip-rule="evenodd"/>
                    </svg>
                    <span>${selectedArticle.intervieweeCompany}</span>
                </div>
                <div class="contact-item">
                    <svg class="contact-icon" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                    </svg>
                    <a href="mailto:${selectedArticle.intervieweeEmail}" class="contact-link">${selectedArticle.intervieweeEmail}</a>
                </div>
                ${selectedArticle.socialMedia.length > 0 ? `
                    <div style="margin-top: 12px;">
                        <div style="font-size: 0.85rem; font-weight: 600; color: var(--text-muted); margin-bottom: 8px;">Social Media</div>
                        <div class="social-links">
                            ${selectedArticle.socialMedia.map(social => `
                                <a href="https://${social.url}" target="_blank" class="social-link">
                                    ${getSocialIcon(social.platform)}
                                    ${social.platform}
                                </a>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}
            </div>
        </div>
        
        ${selectedArticle.publicistName ? `
        <div class="panel-section">
            <h3 class="section-title">Publicist Details</h3>
            <div class="section-content">
                <div class="contact-item">
                    <svg class="contact-icon" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"/>
                    </svg>
                    <span>${selectedArticle.publicistName}</span>
                </div>
                <div class="contact-item">
                    <svg class="contact-icon" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clip-rule="evenodd"/>
                    </svg>
                    <span>${selectedArticle.publicistCompany}</span>
                </div>
                <div class="contact-item">
                    <svg class="contact-icon" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                    </svg>
                    <a href="mailto:${selectedArticle.publicistEmail}" class="contact-link">${selectedArticle.publicistEmail}</a>
                </div>
            </div>
        </div>
        ` : ''}
        
        <div class="panel-section">
            <h3 class="section-title">Article Links</h3>
            <div class="article-links">
                ${selectedArticle.authorityMagazineLink ? `
                    <a href="${selectedArticle.authorityMagazineLink}" target="_blank" class="article-link-btn">
                        📰 View on Authority Magazine
                    </a>
                ` : ''}
                ${selectedArticle.buzzfeedLink ? `
                    <a href="${selectedArticle.buzzfeedLink}" target="_blank" class="article-link-btn secondary">
                        🔥 View on BuzzFeed
                    </a>
                ` : ''}
                ${!selectedArticle.authorityMagazineLink && !selectedArticle.buzzfeedLink ? `
                    <p style="color: var(--text-muted); text-align: center;">No published links yet</p>
                ` : ''}
            </div>
        </div>
        
        <div class="panel-section">
            <h3 class="section-title">Publishing Info</h3>
            <div class="section-content">
                <div class="contact-item">
                    <svg class="contact-icon" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd"/>
                    </svg>
                    <span>Publish Date: ${formatDate(selectedArticle.publishDate)}</span>
                </div>
                <div class="contact-item">
                    <svg class="contact-icon" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"/>
                    </svg>
                    <span>Submitted: ${formatDate(selectedArticle.timestamp)}</span>
                </div>
            </div>
        </div>
    `;

    panel.classList.add('active');
}

// Close side panel
function closeSidePanel() {
    const panel = document.getElementById('sidePanel');
    panel.classList.remove('active');
}

// Format date
function formatDate(dateString) {
    if (!dateString) return 'Not set';
    // If the value is "LIVE", just display it as-is
    if (dateString.toUpperCase().trim() === 'LIVE') return 'LIVE';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// Get social media icon
function getSocialIcon(platform) {
    const icons = {
        'LinkedIn': '💼',
        'Twitter': '🐦',
        'Instagram': '📸',
        'Facebook': '👥',
        'YouTube': '📺',
        'TikTok': '🎵'
    };
    return icons[platform] || '🔗';
}

// Import Modal Functions
function openImportModal() {
    const modal = document.getElementById('importModal');
    modal.classList.add('active');
}

function closeImportModal() {
    const modal = document.getElementById('importModal');
    const statusDiv = document.getElementById('importStatus');
    const csvFileInput = document.getElementById('csvFileInput');
    const sheetsUrlInput = document.getElementById('sheetsUrl');

    modal.classList.remove('active');
    statusDiv.innerHTML = '';
    csvFileInput.value = '';
    if (sheetsUrlInput) sheetsUrlInput.value = '';
}

function handleUrlImport() {
    const sheetsUrlInput = document.getElementById('sheetsUrl');
    const statusDiv = document.getElementById('importStatus');
    const url = sheetsUrlInput.value.trim();

    if (!url) {
        statusDiv.className = 'import-status error';
        statusDiv.textContent = '⚠️ Please enter a Google Sheets URL';
        return;
    }

    // Check if it's already a published CSV URL
    let csvUrl = url;

    // If it's a regular sheet URL, try to convert it
    if (url.includes('/edit') && !url.includes('2PACX')) {
        statusDiv.className = 'import-status error';
        statusDiv.innerHTML = '⚠️ Please use a <strong>published CSV URL</strong>.<br><small>Go to File → Share → Publish to web → Select "CSV" format</small>';
        return;
    }

    console.log('Fetching CSV from:', csvUrl);

    statusDiv.className = 'import-status loading';
    statusDiv.textContent = '⏳ Importing data from Google Sheets...';

    // Fetch directly from Google Sheets (no CORS proxy needed for public sheets)
    fetch(csvUrl)
        .then(response => {
            console.log('Response status:', response.status);
            if (!response.ok) {
                throw new Error(`Failed to fetch (HTTP ${response.status}). Make sure the sheet is set to "Anyone with the link can view"`);
            }
            return response.text();
        })
        .then(csvText => {
            console.log('CSV data received, length:', csvText.length);

            // Parse the CSV data
            const parsedData = parseCSV(csvText);

            if (parsedData.length === 0) {
                throw new Error('No data found in the spreadsheet');
            }

            // Update global data
            articlesData.length = 0;
            articlesData.push(...parsedData);
            currentArticles = [...articlesData];

            // Refresh UI
            initializeFilters();
            renderArticles(currentArticles);

            statusDiv.className = 'import-status success';
            statusDiv.textContent = `✅ Successfully imported ${parsedData.length} articles from Google Sheets!`;

            setTimeout(() => {
                closeImportModal();
            }, 2000);
        })
        .catch(error => {
            console.error('Import error:', error);
            statusDiv.className = 'import-status error';
            statusDiv.textContent = `⚠️ ${error.message}`;
        });
}

function handleFileSelect(e) {
    const file = e.target.files[0];
    if (file) {
        handleFile(file);
    }
}

function handleFile(file) {
    const statusDiv = document.getElementById('importStatus');

    if (!file.name.endsWith('.csv')) {
        statusDiv.className = 'import-status error';
        statusDiv.textContent = '⚠️ Please upload a CSV file';
        return;
    }

    statusDiv.className = 'import-status loading';
    statusDiv.textContent = '⏳ Reading CSV file...';

    const reader = new FileReader();

    reader.onload = function (e) {
        try {
            const csvText = e.target.result;
            const parsedData = parseCSV(csvText);

            if (parsedData.length === 0) {
                throw new Error('No data found in the CSV file');
            }

            // Update global data
            articlesData.length = 0;
            articlesData.push(...parsedData);
            currentArticles = [...articlesData];

            // Save to localStorage for this client
            saveClientData(parsedData);

            // Refresh UI
            initializeFilters();
            renderArticles(currentArticles);

            statusDiv.className = 'import-status success';
            statusDiv.textContent = `✅ Successfully imported ${parsedData.length} articles!`;

            setTimeout(() => {
                closeImportModal();
            }, 2000);

        } catch (error) {
            statusDiv.className = 'import-status error';
            statusDiv.textContent = `⚠️ Error: ${error.message}`;
        }
    };

    reader.onerror = function () {
        statusDiv.className = 'import-status error';
        statusDiv.textContent = '⚠️ Error reading file';
    };

    reader.readAsText(file);
}

function parseCSV(csvText) {
    const lines = csvText.split('\n');
    if (lines.length < 2) return [];

    const articles = [];

    for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue;

        const values = parseCSVLine(lines[i]);

        // Skip rows where interviewee name (column B) is blank
        if (!values[1] || !values[1].trim()) continue;

        // Check columns R, S, T for a live Medium article URL
        const columnR = values[17] || '';
        const columnS = values[18] || '';
        const columnT = values[19] || '';

        // Find which column has the Medium article URL (prioritize S, then R, then T)
        let mediumLink = '';
        if (columnS && columnS.toLowerCase().includes('medium.com/authority-magazine')) {
            mediumLink = columnS;
        } else if (columnR && columnR.toLowerCase().includes('medium.com/authority-magazine')) {
            mediumLink = columnR;
        } else if (columnT && columnT.toLowerCase().includes('medium.com/authority-magazine')) {
            mediumLink = columnT;
        }

        const isPublished = mediumLink !== '';

        // Debug logging
        if (mediumLink) {
            console.log('Medium Link found:', mediumLink, '| Is Published:', isPublished);
        }

        // Validate email - make sure it's not a social media URL
        const emailValue = values[12] || '';
        const isSocialUrl = emailValue.toLowerCase().includes('instagram.com') ||
            emailValue.toLowerCase().includes('linkedin.com') ||
            emailValue.toLowerCase().includes('twitter.com') ||
            emailValue.toLowerCase().includes('facebook.com');

        const article = {
            timestamp: values[0] || '',
            intervieweeName: values[1] || 'Unknown',
            intervieweeCompany: values[1] ? values[1].split(' - ')[1] || values[1] : '',
            publicistName: values[2] ? values[2].split(' - ')[0] || '' : '',
            publicistCompany: values[2] ? values[2].split(' - ')[1] || '' : '',
            topic: values[8] || 'General',
            intervieweeEmail: isSocialUrl ? '' : emailValue,
            publicistEmail: values[13] || '',
            socialMedia: parseSocialMedia(values),
            publishDate: values[17] || '', // Column R
            authorityMagazineLink: mediumLink,
            buzzfeedLink: values[19] || '',
            status: isPublished ? 'published' : 'pending',
            headshot: extractImageUrl(values[4] || ''),
            actionShot: extractImageUrl(values[5] || '')
        };

        articles.push(article);
    }

    return articles;
}

function parseCSVLine(line) {
    const values = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
        const char = line[i];

        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            values.push(current.trim());
            current = '';
        } else {
            current += char;
        }
    }
    values.push(current.trim());

    return values.map(v => v.replace(/^"|"$/g, ''));
}

function parseSocialMedia(values) {
    const links = [];
    const platforms = [
        { name: 'LinkedIn', pattern: /linkedin\.com\/in\/([^\s,]+)/i },
        { name: 'Instagram', pattern: /instagram\.com\/([^\s,]+)/i },
        { name: 'Twitter', pattern: /twitter\.com\/([^\s,]+)/i },
        { name: 'Facebook', pattern: /facebook\.com\/([^\s,]+)/i },
        { name: 'YouTube', pattern: /youtube\.com\/([^\s,]+)/i },
        { name: 'TikTok', pattern: /tiktok\.com\/@?([^\s,]+)/i }
    ];

    // Check all columns for social media URLs
    values.forEach((value, index) => {
        if (!value) return;

        platforms.forEach(platform => {
            const match = value.match(platform.pattern);
            if (match && !links.find(l => l.platform === platform.name)) {
                // Extract the full URL
                let url = value.trim();
                if (!url.startsWith('http')) {
                    url = 'https://' + url;
                }

                links.push({
                    platform: platform.name,
                    url: url.replace('https://', '')
                });

                console.log(`Found ${platform.name} in column ${index}:`, url);
            }
        });
    });

    return links;
}

function extractImageUrl(text) {
    if (!text || text.trim() === '') return '';

    console.log('Extracting image URL from:', text);

    // Handle Google Drive links - multiple formats
    if (text.includes('drive.google.com')) {
        // Format 1: /file/d/FILE_ID/view or /d/FILE_ID
        let match = text.match(/\/d\/([a-zA-Z0-9_-]+)/);

        // Format 2: open?id=FILE_ID
        if (!match) {
            match = text.match(/[?&]id=([a-zA-Z0-9_-]+)/);
        }

        // Format 3: uc?id=FILE_ID
        if (!match) {
            match = text.match(/uc\?.*id=([a-zA-Z0-9_-]+)/);
        }

        if (match) {
            const fileId = match[1];
            // Use thumbnail API which works better for embedded images
            const url = `https://drive.google.com/thumbnail?id=${fileId}&sz=w400`;
            console.log('Converted Google Drive URL to:', url);
            return url;
        } else {
            console.warn('Could not extract Google Drive file ID from:', text);
        }
    }

    // Handle Dropbox links
    if (text.includes('dropbox.com')) {
        const url = text.replace('www.dropbox.com', 'dl.dropboxusercontent.com').replace('?dl=0', '');
        console.log('Converted Dropbox URL to:', url);
        return url;
    }

    // If it's already a direct image URL, return as is
    if (text.match(/\.(jpg|jpeg|png|gif|webp)$/i) || text.startsWith('http')) {
        console.log('Using direct URL:', text);
        return text;
    }

    console.warn('No valid image URL found in:', text);
    return '';
}
