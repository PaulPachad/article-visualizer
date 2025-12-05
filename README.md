# Article Visualizer - Multi-Client Setup

## 🎯 How It Works

Each client has their own Google Sheet with article data. The app automatically loads data from the published sheet URL.

## 📋 Setup Instructions

### For Each Client:

1. **Publish Their Google Sheet as CSV**:
   - Open the client's Google Sheet
   - Click **File → Share → Publish to web**
   - In the dropdown, select **"Comma-separated values (.csv)"**
   - Click **"Publish"**
   - Copy the published URL (starts with `https://docs.google.com/spreadsheets/d/e/2PACX-...`)

2. **Add Client to app.js**:
   - Open `app.js`
   - Find the `CLIENT_SHEETS` object at the top
   - Add the client:
   ```javascript
   const CLIENT_SHEETS = {
       'diane': 'https://docs.google.com/spreadsheets/d/e/2PACX-1vS...',
       'client2': 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT...',
   };
   ```

3. **Share the URL with Client**:
   - Each client gets: `yourapp.vercel.app?client=clientname`
   - Example: `yourapp.vercel.app?client=diane`

## 🚀 Features

- ✅ **Automatic Data Loading** - Data loads from Google Sheets automatically
- ✅ **Always Up-to-Date** - When you update the sheet, the app updates instantly
- ✅ **Separate Data** - Each client only sees their own data
- ✅ **No Manual Upload** - Clients just visit their URL
- ✅ **Search & Filter** - Full search and filtering capabilities
- ✅ **Beautiful UI** - Modern, responsive design

## 📝 Client URLs

- **Diane**: `yourapp.vercel.app?client=diane`
- Add more clients as needed...

## 🔄 Updating Data

To update a client's data:
1. Edit their Google Sheet
2. The changes appear automatically (may take a few seconds for cache to clear)
3. Client refreshes their page to see updates

## 💡 Tips

- Keep the Google Sheet published - don't unpublish it
- Make sure the sheet is set to "Anyone with the link can view"
- Test the published CSV URL in your browser first to make sure it works
