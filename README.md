# 🚀 TNP AutoFill - Chrome Extension

Automatically fill **Training & Placement (TNP)** Google Forms using your saved student profile.

Instead of entering your personal, academic, and professional information repeatedly for every placement drive, save your details once and let the extension fill them automatically.

---

## ✨ Features

- 📄 Save your profile once
- ⚡ Automatically fill Google Forms
- 🎓 Supports academic details
- 💻 Supports coding profiles
- 🔗 GitHub & LinkedIn integration
- 📄 Resume link support
- ➕ Custom field support
- 💾 Stores data locally using `chrome.storage.local`
- 🔒 No external server or database
- 🚀 Fast and easy to use

---

## 🛠️ Tech Stack

- HTML
- CSS
- JavaScript
- Chrome Extension API
- `chrome.storage.local`

---

## 📂 Project Structure

```text
TNP-AutoFill/
│
├── manifest.json
├── popup.html
├── popup.js
├── content.js
├── background.js
├── styles/
├── icons/
└── README.md
```

---

## 📥 Installation

There are **two ways** to install the extension.

---

## Option 1: Download ZIP

### Step 1

Download the repository.

```
Code
   ↓
Download ZIP
```

### Step 2

Extract the downloaded ZIP file.

Your folder should look like:

```text
TNP-AutoFill/
│
├── manifest.json
├── popup.html
├── popup.js
├── content.js
└── ...
```

### Step 3

Open Google Chrome.

Go to:

```text
chrome://extensions/
```

### Step 4

Enable **Developer Mode**.

### Step 5

Click

```text
Load unpacked
```

### Step 6

Select the extracted folder (the folder containing `manifest.json`).

The extension is now installed.

---

## Option 2: Clone Repository

Clone this repository.

```bash
git clone https://github.com/YOUR_USERNAME/TNP-AutoFill.git
```

Move into the project directory.

```bash
cd TNP-AutoFill
```

Open Chrome.

Go to:

```text
chrome://extensions/
```

Enable **Developer Mode**.

Click

```text
Load unpacked
```

Select the cloned project folder.

The extension is ready to use.

---

## 🚀 How to Use

### 1. Open the Extension

Click the extension icon in Chrome.

### 2. Fill Your Profile

Enter your information such as:

- Full Name
- Email
- Phone Number
- PRN
- Roll Number
- CGPA
- Skills
- GitHub
- LinkedIn
- Resume Link
- Projects
- Coding Profiles
- Custom Fields

### 3. Save Profile

Click

```text
Save Profile
```

Your information will be stored locally.

### 4. Open a Google TNP Form

Navigate to your college placement Google Form.

### 5. Auto Fill

Click the extension.

It will automatically detect supported fields and fill them with your saved profile.

---

## 🔒 Privacy

This extension **does not collect, upload, or share your personal data**.

All information is stored **only on your computer** using Chrome's local extension storage.

```javascript
chrome.storage.local
```

The extension:

- ❌ Does NOT use Firebase
- ❌ Does NOT use MongoDB
- ❌ Does NOT use PostgreSQL
- ❌ Does NOT send data to any server
- ❌ Does NOT require a login or account

Everything remains on your local Chrome profile.

---

## 🤝 Contributing

Contributions are welcome!

### 1. Fork the repository

### 2. Create a new branch

```bash
git checkout -b feature-name
```

### 3. Commit your changes

```bash
git commit -m "Added new feature"
```

### 4. Push your branch

```bash
git push origin feature-name
```

### 5. Open a Pull Request

---

## ⭐ Support

If this project helps you, please consider giving it a ⭐ on GitHub.

It motivates future improvements and helps other students discover the project.

---

## 👨‍💻 Author

**Prajwal Hage**

- GitHub: https://github.com/Prjhage
- LinkedIn: https://www.linkedin.com/in/prajwal-hage-58738a303/

---

## ❤️ Made for Students

Built to simplify the **Training & Placement (TNP)** form filling process by saving time and eliminating repetitive data entry.
