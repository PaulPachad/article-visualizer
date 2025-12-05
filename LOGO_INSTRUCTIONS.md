# Logo Setup Instructions

## Adding Your Logo

1. **Save your logo** as `logo.png` in the project folder:
   ```
   C:\Users\Yitzi\.gemini\antigravity\scratch\article-visualizer\logo.png
   ```

2. **Logo Requirements**:
   - Format: PNG (with transparent background recommended)
   - Size: Height should be around 72-144px (it will auto-scale to 36px)
   - Style: Clean, minimal design works best with the Apple aesthetic

3. **If you don't have a logo yet**:
   - The app will work fine without it
   - The logo image will automatically hide if not found
   - Just the text "Authority Magazine" will show

## Using a Different Logo File

If your logo has a different name (e.g., `my-logo.svg`), update line 24 in `index.html`:

```html
<img src="my-logo.svg" alt="Authority Magazine" class="logo-image" onerror="this.style.display='none'">
```

## Temporary Logo

I've generated a placeholder logo for you. You can find it in the artifacts panel and save it as `logo.png` in your project folder.
