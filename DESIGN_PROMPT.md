# Aegis AI - Comprehensive Web Design Specification & Implementation Prompt

## 🎯 PROJECT OVERVIEW

**Project Name:** Aegis AI - AI-Powered Phishing Detection System
**Current Status:** Frontend operational, ML models available
**Design Goal:** Create a professional, user-friendly interface for threat detection with robust error handling
**Target Users:** General public scanning emails/URLs for phishing threats

---

## 📊 WEBSITE STRUCTURE & NAVIGATION

### Navigation Architecture

The website consists of **3 main pages** with a hub-and-spoke model:

```
HOME (/)
  ├─→ EMAIL CHECKER (/email-checker)
  ├─→ URL CHECKER (/url-checker)
  └─→ EXTENSION DOWNLOAD
      
All pages link back to HOME via logo
```

### Page Hierarchy

- **Level 1 (Hub):** HOME - Marketing & onboarding
- **Level 2 (Scanners):** EMAIL CHECKER, URL CHECKER - Functional pages
- **Level 2 (Support):** Extension download, API docs

---

## 🏠 PAGE 1: HOME PAGE (/)

### Purpose
- Introduce the product
- Build trust through stats and features
- Guide users to scanning tools
- Promote browser extension

### Layout Structure

#### A. Header/Navigation (Fixed/Sticky)
```
Left: Logo "⬡ AEGIS_AI" (clickable, returns to /)
Right: Menu button (hamburger for mobile)
Background: Dark navy (#1a1a2e)
Height: 70px
```

#### B. Hero Section (Full Width)
```
Background: Dark gradient with subtle pattern
Content:
  - Label: "AI-POWERED THREAT DETECTION" (small, uppercase, cyan)
  - Main Heading: "Defend against phishing attacks." (large, bold, animated text)
  - Subheading: "Aegis AI uses a 3-layer detection system — rule engine, 
                  fine-tuned DistilBERT, and Google Safe Browsing — 
                  to protect you from phishing in real time." (medium text)
  - CTA Buttons (2 side-by-side):
    * "✉ Scan Email" → /email-checker (primary button, cyan)
    * "🔗 Scan URL" → /url-checker (primary button, cyan)
  
  - Stats Cards (3 columns, below buttons):
    * 99.4% Accuracy
    * 3-Layer Detection
    * < 2s Response Time

Animation: Subtle scroll-triggered fade-in, text underline animation on heading
```

#### C. Capabilities Section (// capabilities)
```
Layout: 3-column grid (stack on mobile)

Card 1 - Email Detection
  Icon: ✉ (large)
  Heading: "Email Detection"
  Text: "Paste any suspicious email. Our fine-tuned DistilBERT model 
         trained on 80,000+ real phishing emails detects spoofing, 
         urgency tactics and domain manipulation."

Card 2 - URL Safety Check
  Icon: 🔗 (large)
  Heading: "URL Safety Check"
  Text: "Enter any URL and get an instant safety verdict. Aegis checks 
         SSL certificates, domain age, typosquatting patterns and 
         cross-references Google's threat database."

Card 3 - Browser Extension
  Icon: 🛡 (large)
  Heading: "Browser Extension"
  Text: "Install the Aegis AI Chrome extension for automatic protection. 
         Unsafe sites are intercepted and blocked before the page even loads."

Styling: Hover effect (shadow, scale), icons in cyan
```

#### D. Architecture Section (// architecture)
```
Layout: Horizontal flow (3-step process with arrows)

LAYER 01 → LAYER 02 → LAYER 03

Box 1:
  Label: "LAYER 01"
  Title: "Rule Engine"
  Text: "Instant checks — SSL, domain age, typosquatting, keyword patterns. 
         No API cost."
  Icon: ⚙

Box 2:
  Label: "LAYER 02"
  Title: "AI Model"
  Text: "Fine-tuned DistilBERT running self-hosted. 99.4% F1 score on 
         7 phishing datasets."
  Icon: 🧠

Box 3:
  Label: "LAYER 03"
  Title: "Safe Browsing"
  Text: "Google Safe Browsing API as final fallback. Checks against 
         millions of known threats."
  Icon: 🔐

Arrows: "→" between boxes (cyan color, responsive)
Background: Semi-transparent boxes with borders
```

#### E. Browser Extension Section (// browser extension)
```
Layout: Two-column (image left, content right on desktop; stack on mobile)

Content:
  Heading: "Browse with protection on"
  Subheading: "The Aegis AI extension scans every URL automatically. 
               Phishing sites are blocked before they load."
  CTA Button: "🛡 Download Extension" → /aegis-ai-extension.zip
  
  Feature List (3 items):
    "> Auto-scan"
      Description: "Every URL checked the moment you navigate to it"
    "> Instant block"
      Description: "Threats intercepted before the page loads"
    "> Fail-safe"
      Description: "If server unreachable, you browse normally"

Image: Extension screenshot or browser mockup (right side)
Button: Primary action, large, cyan background
```

#### F. Footer
```
Content:
  Logo: "AEGIS_AI"
  Tagline: "// PROTECTING THE DIGITAL FRONTIER"
  Links: (optional) About | Privacy | Terms | Contact
  Version: "v1.0.0 — 2026"

Background: Dark (#0f3460)
Text: Light gray/white
Layout: Center aligned
```

#### G. Interactive Elements
```
Scroll Behavior: Smooth scroll on anchor links
Animations: 
  - Fade-in on scroll for each section
  - Icon hover effects (slight lift, glow)
  - Button hover effects (brightness increase, shadow)
Text Animation:
  - Main heading has typing effect or gradient animation
  - Stats numbers increment on scroll (1, 2, 3... 99.4%)
Mobile: Hamburger menu expands to show navigation
```

---

## ✉️ PAGE 2: EMAIL CHECKER (/email-checker)

### Purpose
- Provide clean interface for email scanning
- Collect sender email and content
- Display detailed phishing analysis
- Handle validation errors gracefully

### Layout Structure

#### A. Header/Navigation (Same as HOME)
```
Logo clickable, returns to /
```

#### B. Page Title Section
```
Heading: "Email Checker"
Subheading: "Detect phishing and fake emails instantly"
Background: Gradient or solid dark
Spacing: 40px padding top/bottom
```

#### C. Form Section (Main Content)
```
Layout: Single column, centered, max-width 700px
Background: Semi-transparent dark card
Padding: 40px
Border-radius: 8px

Form Fields:

Field 1: Sender Email Address
  Label: "Sender Email Address" (uppercase, small)
  Input Type: Text
  Placeholder: "e.g. support@paypa1.com"
  Validation: Check for @ symbol and email format
  Error: Invalid email shows error message

Field 2: Email Content
  Label: "Email Content" (uppercase, small)
  Input Type: Textarea
  Placeholder: "Paste the email body here..."
  Rows: 8-10
  Validation: Check that content is not empty
  Error: Empty content shows error message

Button: "Analyse Email"
  Type: Submit
  Background: Cyan (#00d4ff)
  Text: White
  Width: 100% (block)
  Padding: 15px
  Border-radius: 6px
  Hover: Slight brightness increase, shadow
  Active: Loading spinner replaces text during submission
```

#### D. Error Handling Display
```
Position: Above the button, below the textareas
Styling: Yellow/warning background (#ffaa00 or similar)
Border: Left border in orange/red
Icon: ⚠ symbol on the left
Text: Clear, specific error message
Animation: Slide in from top
Examples:
  - "⚠ Please enter both the sender email and email content."
  - "⚠ Please enter a valid email address format."

Behavior:
  - Only displays when validation fails
  - Disappears when user corrects and resubmits
  - Multiple errors: Show the most relevant one
  - User input is preserved (not cleared)
```

#### E. Results Section (Conditionally Displayed Below Form)
```
Condition: Shows after successful API response
Layout: Card-based, centered

Result Card:
  Verdict Badge:
    - If verdict = "SAFE": Green background (#44ff44), text "✅ SAFE"
    - If verdict = "FAKE": Red background (#ff4444), text "⚠ FAKE"
    Size: Large, prominent
    Position: Top of results
  
  Confidence Score:
    Display: "Confidence: 92.5%"
    Format: Percentage with progress bar (optional)
    Color: Matches verdict (green/red)
  
  Detailed Reasons:
    Heading: "Analysis Reasons"
    Format: Bulleted list
    Example Items:
      - "Email content classified as phishing by ML model (confidence: 92.5%)"
      - "Sender domain contains suspicious numbers: 192.168.1.1"
      - "Urgency language detected: urgent, verify, act now"
  
  Precautions (if FAKE):
    Heading: "What You Should Do"
    Format: Bulleted list with checkmarks
    Example Items:
      - "Do not click any links in this email"
      - "Do not download any attachments"
      - "Report as phishing to your email provider"
      - "Verify the sender through official channels"
  
  Model Availability Indicator:
    Display: "ML Model Status: Active" or "Using Rule Engine (Model unavailable)"
    Color: Green if active, yellow if fallback
  
  Action Buttons (2 side-by-side at bottom):
    Button 1: "Analyse Another Email"
      Action: Clears form, stays on /email-checker
      Color: Cyan outline, transparent background
    Button 2: "Back Home"
      Action: Navigate to /
      Color: Cyan outline, transparent background
```

#### F. Loading State
```
Trigger: After user clicks "Analyse Email" with valid input
Display:
  - Button text changes to "Analysing..."
  - Spinner/loader animation in button (rotating icon)
  - Button becomes disabled
  - Form inputs become slightly dimmed
  - Stays until API response received

Dismissal: When results or error from backend arrives
```

---

## 🔗 PAGE 3: URL CHECKER (/url-checker)

### Purpose
- Provide clean interface for URL scanning
- Collect URL input
- Display detailed safety analysis
- Handle validation errors gracefully

### Layout Structure

#### A. Header/Navigation (Same as EMAIL CHECKER)
```
Logo clickable, returns to /
```

#### B. Page Title Section
```
Heading: "URL Checker"
Subheading: "Check if a website is safe before you visit it"
Background: Gradient or solid dark
Spacing: 40px padding top/bottom
```

#### C. Form Section (Main Content)
```
Layout: Single column, centered, max-width 600px
Background: Semi-transparent dark card
Padding: 40px
Border-radius: 8px

Form Fields:

Field 1: Enter URL
  Label: "Enter URL" (uppercase, small)
  Input Type: Text
  Placeholder: "e.g. https://example.com"
  Validation: 
    - Check URL is not empty
    - Check URL starts with https:// or http://
  Error: Shows specific error message

Button: "Check URL"
  Type: Submit
  Background: Cyan (#00d4ff)
  Text: White
  Width: 100% (block)
  Padding: 15px
  Border-radius: 6px
  Hover: Slight brightness increase, shadow
  Active: Loading spinner replaces text during submission
```

#### D. Error Handling Display
```
Position: Above the button, below URL input
Styling: Yellow/warning background (#ffaa00 or similar)
Border: Left border in orange/red
Icon: ⚠ symbol on the left
Text: Clear, specific error message
Animation: Slide in from top
Examples:
  - "⚠ Please enter a URL to check."
  - "⚠ Please enter a valid URL including https:// or http://"

Behavior:
  - Only displays when validation fails
  - Disappears when user corrects and resubmits
  - User input is preserved (not cleared)
```

#### E. Results Section (Conditionally Displayed Below Form)
```
Condition: Shows after successful API response
Layout: Card-based, centered

Result Card:
  Verdict Badge:
    - If verdict = "SAFE": Green background (#44ff44), text "✅ SAFE"
    - If verdict = "UNSAFE": Red background (#ff4444), text "⚠ UNSAFE"
    Size: Large, prominent
    Position: Top of results
  
  Confidence Score:
    Display: "Confidence: 87.3%"
    Format: Percentage with progress bar (optional)
    Color: Matches verdict (green/red)
  
  URL Display:
    Show: The URL that was checked
    Format: "Checked: https://example.com"
    Styling: Monospace font, gray text
  
  Detailed Threat Analysis:
    Heading: "Safety Analysis"
    Format: Bulleted list
    Possible Items (if threats found):
      - "No SSL certificate (HTTP connection)"
      - "IP address used instead of domain name"
      - "URL contains @ symbol — destination is being disguised"
      - "Excessive subdomains (5 detected)"
      - "Contains 3 suspicious keyword(s)"
      - "High URL entropy — unusual character patterns detected"
      - "Hostname contains digits — common in domain spoofing"
    
    If Safe:
      - "No significant phishing indicators detected"
      - "Valid SSL certificate with proper domain"
      - "Domain age appears legitimate"
  
  Model Availability Indicator:
    Display: "ML Model Status: Active" or "Using Safe Browsing API (Model unavailable)"
    Color: Green if active, yellow if fallback
  
  Action Buttons (2 side-by-side at bottom):
    Button 1: "Check Another URL"
      Action: Clears form, stays on /url-checker
      Color: Cyan outline, transparent background
    Button 2: "Back Home"
      Action: Navigate to /
      Color: Cyan outline, transparent background
```

#### F. Loading State
```
Trigger: After user clicks "Check URL" with valid input
Display:
  - Button text changes to "Checking..."
  - Spinner/loader animation in button (rotating icon)
  - Button becomes disabled
  - Form input becomes slightly dimmed
  - Stays until API response received

Dismissal: When results or error from backend arrives
```

---

## 🎨 DESIGN SYSTEM

### Color Palette

**Primary Colors:**
- Background: Navy/Black (#1a1a2e)
- Dark Card Background: Navy (#16213e)
- Accent/Primary: Cyan/Electric Blue (#00d4ff)

**Status Colors:**
- Success/Safe: Green (#44ff44)
- Danger/Unsafe/Fake: Red (#ff4444)
- Warning/Error: Yellow/Orange (#ffaa00 or #ff8800)
- Info: Blue (#00d4ff)

**Text Colors:**
- Primary Text: White (#ffffff)
- Secondary Text: Light Gray (#cccccc)
- Disabled Text: Dark Gray (#666666)

### Typography

**Font Family:** System fonts or modern sans-serif
- Primary: Segoe UI, -apple-system, BlinkMacSystemFont, sans-serif
- Monospace: Monaco, 'Courier New', monospace (for URLs, code)

**Font Sizes:**
- Page Heading: 48px (desktop), 32px (mobile)
- Section Heading: 32px (desktop), 24px (mobile)
- Card Title: 24px
- Body Text: 16px
- Labels: 14px (uppercase, slight letter-spacing)
- Small Text: 12px

**Font Weights:**
- Headings: 700 (bold)
- Body: 400 (regular)
- Labels: 600 (semibold)

### Button Styles

**Primary Button** (CTA):
```
Background: Cyan (#00d4ff)
Text: Dark Navy (#1a1a2e)
Padding: 15px 30px
Border-radius: 6px
Font-weight: 600
Transition: 0.3s ease
Hover: Brightness +10%, shadow elevation
Active: Scale 0.98
Disabled: Opacity 0.5, cursor not-allowed
```

**Secondary Button** (Outline):
```
Background: Transparent
Border: 2px solid Cyan (#00d4ff)
Text: Cyan (#00d4ff)
Padding: 13px 28px (accounting for border)
Border-radius: 6px
Font-weight: 600
Transition: 0.3s ease
Hover: Background fills with cyan, text dark
Active: Scale 0.98
```

### Input Fields

**Text Input / Textarea:**
```
Background: Dark (#16213e)
Border: 1px solid #333333
Border-radius: 4px
Padding: 12px 15px
Color: White (#ffffff)
Placeholder: Gray (#999999)
Font-size: 16px
Transition: 0.2s ease

States:
- Focus: Border color cyan (#00d4ff), box-shadow with cyan glow
- Error: Border color red (#ff4444)
- Disabled: Background opacity 0.5, cursor not-allowed
```

### Cards & Containers

**Card:**
```
Background: Semi-transparent dark (#16213e with opacity)
Border: 1px solid #333333
Border-radius: 8px
Padding: 30px
Box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3)
Transition: 0.3s ease

Hover (optional): Shadow elevation
```

### Spacing Scale

```
- xs: 4px
- sm: 8px
- md: 16px
- lg: 24px
- xl: 32px
- 2xl: 48px
- 3xl: 64px
```

### Animations

**Fade In:**
```
Animation: opacity 0.6s ease-in-out
Trigger: Page load, scroll into view
```

**Slide In (Errors):**
```
Animation: slideDown 0.3s ease-out
From: translateY(-10px), opacity 0
To: translateY(0), opacity 1
```

**Button Hover:**
```
Animation: all 0.3s ease
Changes: brightness, shadow
```

**Loading Spinner:**
```
Animation: rotation 1s linear infinite
Icon: Rotating circle or dots
Color: Cyan (#00d4ff)
```

**Scroll Animations:**
```
- Stats counters: Increment from 0 on scroll
- Section cards: Fade in + slight lift on scroll
- Text: Underline animation on headings
```

---

## 🔄 ERROR HANDLING & VALIDATION WORKFLOW

### Email Checker Validation & Error Flow

**Step 1: User Enters Data (or doesn't)**
```
User types into sender email and content fields
No real-time validation needed (check on submit)
```

**Step 2: User Clicks "Analyse Email" Button**
```
Frontend immediately validates before API call
```

**Step 3: Frontend Validation Check**
```
Check 1: Is sender field empty?
  ✗ YES → Show Error: "⚠ Please enter both the sender email and email content."
  ✓ NO → Continue to Check 2

Check 2: Is content field empty?
  ✗ YES → Show Error: "⚠ Please enter both the sender email and email content."
  ✓ NO → Continue to Check 3

Check 3: Does sender contain @ symbol and valid email format?
  ✗ NO → Show Error: "⚠ Please enter a valid email address format."
  ✓ YES → Continue to Step 4
```

**Step 4: Show Loading State**
```
- Change button text to "Analysing..."
- Add spinner animation to button
- Disable button
- Slightly dim form inputs
- Wait for API response
```

**Step 5: API Call**
```
Endpoint: POST /predict/email
Headers: Content-Type: application/json
Payload: {
  "sender": "user@example.com",
  "content": "Email body text here..."
}
Timeout: 30 seconds
```

**Step 6: Handle API Response**

**Success Response:**
```
Response: {
  "verdict": "SAFE" or "FAKE",
  "confidence": 0.92,
  "reasons": ["Reason 1", "Reason 2", ...],
  "precautions": ["Action 1", "Action 2", ...],
  "model_available": true
}

Action:
- Hide loading state
- Clear error messages
- Display results section with all data
- Show verdict badge with color
- List all reasons
- Show precautions if FAKE
- Enable action buttons
```

**Error Response:**
```
Response: {
  "error": "Error message from server"
}

Action:
- Hide loading state
- Show error message in red alert box
- Keep user input intact
- Button remains enabled for retry
```

**Network Error:**
```
Action:
- Hide loading state
- Show error: "⚠ Connection error. Please try again."
- Keep user input intact
- Button remains enabled for retry
```

### URL Checker Validation & Error Flow

**Step 1: User Enters URL (or doesn't)**
```
User types into URL field
No real-time validation needed
```

**Step 2: User Clicks "Check URL" Button**
```
Frontend immediately validates before API call
```

**Step 3: Frontend Validation Check**
```
Check 1: Is URL field empty?
  ✗ YES → Show Error: "⚠ Please enter a URL to check."
  ✓ NO → Continue to Check 2

Check 2: Does URL start with https:// or http://?
  ✗ NO → Show Error: "⚠ Please enter a valid URL including https:// or http://"
  ✓ YES → Continue to Step 4
```

**Step 4: Show Loading State**
```
- Change button text to "Checking..."
- Add spinner animation to button
- Disable button
- Slightly dim form input
- Wait for API response
```

**Step 5: API Call**
```
Endpoint: POST /predict/url
Headers: Content-Type: application/json
Payload: {
  "url": "https://example.com"
}
Timeout: 30 seconds
```

**Step 6: Handle API Response**

**Success Response:**
```
Response: {
  "verdict": "SAFE" or "UNSAFE",
  "confidence": 0.87,
  "reasons": ["Reason 1", "Reason 2", ...],
  "model_available": true
}

Action:
- Hide loading state
- Clear error messages
- Display results section with all data
- Show verdict badge with color
- List all reasons
- Enable action buttons
```

**Error Response:**
```
Response: {
  "error": "Error message from server"
}

Action:
- Hide loading state
- Show error: "⚠ [Error message from server]"
- Keep user input intact
- Button remains enabled for retry
```

---

## 📱 RESPONSIVE DESIGN REQUIREMENTS

### Desktop (1024px+)
```
- 2-3 column layouts where applicable
- Full sidebar navigation (if added)
- Hero section full viewport height
- Cards side-by-side
- Buttons large and prominent
```

### Tablet (768px - 1023px)
```
- Single column layouts mostly
- Adjusted font sizes
- Touch-friendly button sizes (min 44px)
- Hamburger menu
- Cards stack vertically
```

### Mobile (< 768px)
```
- Full-width single column
- Font sizes reduced appropriately
- Buttons 100% width
- Large touch targets (min 44px x 44px)
- Hamburger menu with overlay
- Hero section 80vh
- Padding reduced on mobile
- Form inputs full width
- Error messages wrap properly
```

### Breakpoints

```
- Mobile: 320px - 767px
- Tablet: 768px - 1023px
- Desktop: 1024px+
- Large Desktop: 1440px+
```

---

## 🔗 API INTEGRATION ENDPOINTS

### Email Prediction Endpoint

```
Method: POST
URL: http://localhost:5000/predict/email
Content-Type: application/json

Request:
{
  "sender": "support@bank.com",
  "content": "Your account has been suspended. Click here to verify..."
}

Response (Success):
{
  "verdict": "FAKE",
  "confidence": 0.92,
  "reasons": [
    "Email content classified as phishing by ML model (confidence: 92%)",
    "Sender domain contains suspicious numbers: 192.168.1.1",
    "Urgency language detected: suspended, verify, click here"
  ],
  "precautions": [
    "Do not click any links in this email",
    "Do not download any attachments",
    "Report as phishing to your email provider",
    "Verify the sender through official channels"
  ],
  "model_available": true
}

Response (Error):
{
  "error": "Prediction failed: [error details]"
}

Status Codes:
- 200: Success
- 400: Bad request (missing fields)
- 503: Model not available (fallback to rule engine)
```

### URL Prediction Endpoint

```
Method: POST
URL: http://localhost:5000/predict/url
Content-Type: application/json

Request:
{
  "url": "https://malicious-site.com"
}

Response (Success):
{
  "verdict": "UNSAFE",
  "confidence": 0.89,
  "reasons": [
    "URL pattern matches known phishing characteristics",
    "No SSL certificate (HTTP connection)",
    "IP address used instead of domain name",
    "Excessive subdomains (4 detected)"
  ],
  "model_available": true
}

Response (Error):
{
  "error": "Prediction failed: [error details]"
}

Status Codes:
- 200: Success
- 400: Bad request (missing URL)
- 503: Model not available (fallback to rule engine)
```

### Health Check Endpoint

```
Method: GET
URL: http://localhost:5000/health

Response:
{
  "status": "healthy",
  "url_model_loaded": true,
  "email_model_loaded": true
}

Usage: Optional - can be called on page load to show model status
```

---

## ✅ IMPLEMENTATION CHECKLIST

### Frontend Structure
- [ ] Create responsive navigation component
- [ ] Build HOME page with all sections (hero, capabilities, architecture, extension)
- [ ] Build EMAIL CHECKER page with form and results display
- [ ] Build URL CHECKER page with form and results display
- [ ] Implement error message components
- [ ] Create loading spinner component
- [ ] Implement result card components

### Validation & Logic
- [ ] Email validation: Check for @ symbol and email format
- [ ] URL validation: Check for https:// or http:// protocol
- [ ] Empty field validation
- [ ] Form submission prevention on invalid input
- [ ] Data preservation on error (don't clear form)

### API Integration
- [ ] Set up fetch/axios for API calls
- [ ] Implement POST to /predict/email endpoint
- [ ] Implement POST to /predict/url endpoint
- [ ] Handle success responses and display results
- [ ] Handle error responses and display error messages
- [ ] Implement loading states during API calls
- [ ] Add timeout handling (30 seconds)

### Styling & UX
- [ ] Apply color scheme throughout
- [ ] Create responsive layouts
- [ ] Add hover effects to buttons
- [ ] Add animations (fade-in, slide-in, spinner)
- [ ] Test on mobile devices (320px width)
- [ ] Test on tablets (768px width)
- [ ] Test on desktop (1024px+ width)

### Error Handling
- [ ] Empty field validation error messages
- [ ] Invalid email format error message
- [ ] Invalid URL format error message
- [ ] API error handling
- [ ] Network error handling
- [ ] Display error in warning yellow boxes with ⚠ icon
- [ ] Keep form inputs enabled for retry

### User Experience
- [ ] Preserve user input on error
- [ ] Show loading states clearly
- [ ] Display results immediately after API response
- [ ] "Analyse Another" / "Check Another" buttons clear form
- [ ] "Back Home" navigation works
- [ ] Logo always links to home
- [ ] Mobile menu works on hamburger click

### Testing
- [ ] Test all validation scenarios
- [ ] Test with valid email and URL
- [ ] Test with invalid formats
- [ ] Test with empty fields
- [ ] Test API response handling
- [ ] Test on multiple devices/browsers
- [ ] Test error recovery flow

---

## 🎬 USER JOURNEY EXAMPLES

### Journey 1: Email Scanner (Happy Path)

1. User lands on HOME page
2. Reads about features and detects problem with suspicious email
3. Clicks "✉ Scan Email" button
4. Navigates to /email-checker
5. Sees form with 2 input fields
6. Enters sender: "noreply@bank-secure.com"
7. Enters content: Email text about account verification
8. Clicks "Analyse Email" button
9. Form validates successfully
10. Loading spinner shows "Analysing..."
11. Backend processes email
12. Results appear with:
    - Red FAKE badge
    - 92.5% confidence
    - List of reasons (urgency language, spoofed domain, etc.)
    - Precautions to take
13. User reads results
14. User clicks "Analyse Another Email"
15. Form clears, user can enter next email
16. OR User clicks "Back Home" to return to landing page

### Journey 2: URL Checker (Error Recovery)

1. User lands on HOME page
2. Clicks "🔗 Scan URL" button
3. Navigates to /url-checker
4. Sees form with 1 input field
5. User quickly types "google.com" (without https://)
6. Clicks "Check URL" button
7. Validation fails - URL missing protocol
8. Error message appears: "⚠ Please enter a valid URL including https:// or http://"
9. User's input "google.com" is still in field
10. User clicks in field and adds "https://" prefix
11. Field now shows "https://google.com"
12. User clicks "Check URL" button again
13. Validation succeeds this time
14. Loading spinner shows "Checking..."
15. Backend processes URL
16. Results appear with:
    - Green SAFE badge
    - 95.2% confidence
    - Analysis details (SSL valid, domain age legitimate, etc.)
17. User clicks "Back Home"
18. Returns to / landing page

---

## 📝 ADDITIONAL NOTES

### Performance Considerations
- Lazy load images on home page
- Minimize bundle size
- Use CSS-in-JS or Tailwind for styling efficiency
- Optimize form inputs (debounce if needed)
- Cache API responses if appropriate

### Accessibility
- Use semantic HTML (button, form, input, label)
- ARIA labels for screen readers
- Color contrast meets WCAG AA standards
- Keyboard navigation support (Tab through inputs)
- Error messages associated with inputs

### Browser Support
- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions
- Mobile browsers: Latest versions

### Security
- Validate input on both client and server
- Sanitize user input before display
- Use HTTPS for all API calls
- No sensitive data in localStorage
- CORS properly configured on backend

---

## 🚀 SUCCESS CRITERIA

✓ All pages load without errors
✓ Navigation works correctly
✓ Form validation works for all error cases
✓ Error messages display correctly and disappear on correction
✓ API calls return results quickly (< 3 seconds)
✓ Results display accurately
✓ Mobile responsive (tested on 320px, 768px, 1024px)
✓ User input preserved on error
✓ Loading states show during processing
✓ All buttons work and navigate correctly
✓ Extension download link works
✓ Logo always returns to home
