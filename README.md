# Instagram DM Automator Chrome Extension

A Chrome extension that automates Instagram direct messages with human-like behavior to avoid spam detection.

## Features

- 📱 Send DMs to multiple Instagram users (up to 100 per session)
- 🤖 Human-like behavior with random delays and mouse movements
- 🎯 Customizable delay settings between messages
- 💾 Saves your settings for future use
- 🔒 Works only on Instagram tabs for security
- 📊 Real-time progress tracking

## Installation

1. Download or clone this repository
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select the extension folder
5. The extension will appear in your Chrome toolbar

## Usage

1. Open Instagram in a Chrome tab
2. Click the extension icon in your toolbar
3. Enter Instagram usernames (comma-separated, max 100)
4. Enter your message
5. Adjust delay settings if needed (3-8 seconds recommended)
6. Click "Start Automation"

## Settings

- **Min/Max Delay**: Random delay between messages (in seconds)
- **Username Limit**: Maximum 100 usernames per session
- **Message Length**: Up to 1000 characters

## Safety Features

- Human-like typing with random delays
- Random mouse movements during operation
- Customizable delays between messages
- Automatic stop on errors
- Session limits to prevent spam detection

## Important Notes

⚠️ **Use Responsibly**: This tool is for legitimate communication purposes only. Respect Instagram's terms of service and don't spam users.

- Instagram may temporarily limit your account if you send too many messages
- Always test with a small number of users first
- Use reasonable delays between messages
- Don't use this for unsolicited marketing

## Technical Details

- **Manifest Version**: 3
- **Permissions**: activeTab, scripting, storage
- **Host Permissions**: Instagram.com
- **Content Script**: Runs on Instagram pages
- **Background Script**: Handles extension lifecycle

## Files Structure

```
cinspam-automator/
├── manifest.json       # Extension configuration
├── popup.html          # Extension popup interface
├── popup.js            # Popup logic and UI handling
├── content.js          # Instagram page interaction
├── background.js       # Background service worker
├── icon16.png          # 16x16 icon
├── icon48.png          # 48x48 icon
├── icon128.png         # 128x128 icon
└── README.md           # This file
```

## Development

To modify the extension:

1. Make changes to the source files
2. Go to `chrome://extensions/`
3. Click the refresh icon on the extension card
4. Test your changes

## Troubleshooting

**Extension not working?**
- Make sure you're on Instagram.com
- Refresh the Instagram page
- Check if Instagram's interface has changed

**Messages not sending?**
- Ensure usernames are valid
- Check your internet connection
- Try reducing the number of usernames
- Increase delays between messages

**Getting rate limited?**
- Reduce the number of users per session
- Increase delay settings
- Wait before running again

## Legal Disclaimer

This tool is for educational and legitimate communication purposes only. Users are responsible for complying with Instagram's terms of service and applicable laws. The developers are not responsible for any misuse of this tool.

## Version History

- **v1.0**: Initial release with basic automation features