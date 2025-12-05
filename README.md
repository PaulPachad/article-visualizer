# 🎉 Authority Magazine Article Visualizer - READY!

## ✅ **Images Now Work!**

The app will automatically display **real photos** from your Google Sheet when you import your CSV!

### How Images Work:

1. **Sample Data** (what you see now): Shows placeholder avatars (👤)
2. **Your Real Data** (after CSV import): Shows actual photos from your spreadsheet!

The app automatically extracts image URLs from columns 4 & 5 of your spreadsheet:
- Column 4: Headshot (shows on article cards)
- Column 5: Action shot (shows in contact panel)

**Supported formats:**
- ✅ Google Drive links (automatically converted)
- ✅ Dropbox links (automatically converted)
- ✅ Direct image URLs (.jpg, .png, .gif, .webp)

---

## 🚀 Quick Start

### Step 1: Export Your Google Sheet
1. Open: https://docs.google.com/spreadsheets/d/1m5z_SuWspD4jyeK3cb18PB_FZM1qob3KEsmx-rYEN0M/edit
2. Click: **File → Download → Comma Separated Values (.csv)**
3. Save the file

### Step 2: Import to App
1. Open `index.html` (double-click it)
2. Click **"Import CSV"** button
3. Upload the CSV file you just downloaded
4. **Done!** All your articles with real photos will appear!

---

## ✨ Features

### Article Cards (Right Side):
- Real headshot photos (or placeholder if no image)
- Topic badge
- Name and company
- Publication date
- Status (published/pending)

### Contact Panel (Left Side):
- Real action shot photo (or placeholder)
- Full contact details
- Email addresses (clickable)
- Social media links
- Article links (Authority Magazine, BuzzFeed)

### Search & Filter:
- Search by name, company, or topic
- Filter by topic category
- Filter by status (published/pending)

---

## 📊 Your Spreadsheet Structure

The app reads these columns from your CSV:

| Column | Content | Used For |
|--------|---------|----------|
| 1 | Timestamp | Submission date |
| 2 | Interviewee Name & Company | Name display |
| 3 | Publicist Name & Company | Publicist info |
| **4** | **Headshot Image** | **Article card photo** |
| **5** | **Action Shot Image** | **Panel photo** |
| 6 | Additional images link | Not used |
| 7 | Video link | Not used |
| 9 | Topic | Category badge |
| 10 | Social media profiles | Social links |
| 13 | Interviewee email | Contact |
| 14 | Publicist email | Contact |
| 17 | Publish date | Display date |
| 18 | Authority Magazine link | Article link |
| 19 | BuzzFeed link | Article link |

---

## 🖼️ Image Tips

### For Best Results:
1. **Use Google Drive or Dropbox** for hosting images
2. **Make sure links are public/shareable**
3. **Recommended image sizes:**
   - Headshots: 400x400px or larger
   - Action shots: 800x600px or larger

### If Images Don't Show:
- Check that Google Drive links are set to "Anyone with the link can view"
- Make sure Dropbox links are public
- Verify image URLs are working (paste in browser)
- The app will show placeholder avatars if images fail to load

---

## 🎨 What You'll See

```
┌─────────────────────────────────────────────────────────┐
│  📰 Authority Magazine                                  │
│  [Search...] [Filter] [Import CSV]                     │
├──────────────────┬──────────────────────────────────────┤
│                  │  ┌──────┐ ┌──────┐ ┌──────┐        │
│  📸 Photo        │  │ 📸   │ │ 📸   │ │ 📸   │        │
│                  │  │Sarah │ │James │ │Alex  │        │
│  Contact Panel   │  │Chen  │ │Mart. │ │Rivera│        │
│  (click article) │  └──────┘ └──────┘ └──────┘        │
│                  │                                      │
│  • Name          │  ┌──────┐ ┌──────┐ ┌──────┐        │
│  • Company       │  │ 📸   │ │ 📸   │ │ 📸   │        │
│  • Email         │  │Marcus│ │Priya │ │Carlos│        │
│  • Social Media  │  │John. │ │Patel │ │Mendez│        │
│  • Links         │  └──────┘ └──────┘ └──────┘        │
└──────────────────┴──────────────────────────────────────┘
```

---

## 🐛 Troubleshooting

**Images not showing after CSV import?**
- Make sure your Google Drive/Dropbox links are public
- Check columns 4 & 5 in your spreadsheet have image links
- Try pasting the image URL in your browser to verify it works

**Page loading slowly?**
- Large images may take time to load
- The app shows placeholders while images load
- Consider using optimized/compressed images

**CSV import fails?**
- Make sure file is `.csv` format (not `.xlsx`)
- Check that you exported from Google Sheets correctly
- Verify the CSV has data rows (not just headers)

---

## 📁 Project Files

- `index.html` - Main page
- `index.css` - Styling
- `app.js` - All functionality + image handling
- `data.js` - Sample data
- `README.md` - This file
- `START_HERE.md` - Quick start guide

---

**Ready to go! Import your CSV to see your real photos!** 🎉📸
