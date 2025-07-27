# TRUST_BASKET 🛒

India's Most Trusted B2B Marketplace - Connecting suppliers and buyers with verified credentials and real-time communication.

## OTP POPUP:
  OTP will be shown via Popup

## 🚀 New Features

### 🛡️ Trusted Member Verification System
- **Three-tier membership**: Regular (Free), Trusted (₹999/year), Verified (₹1098/year)
- **Government document verification** for business credentials
- **Real SMS OTP authentication** with multi-provider support
- **User badges** for enhanced credibility and trust

### 📱 Real SMS OTP Verification
- **Multi-provider SMS service** with fallback support:
  - Twilio (Primary)
  - TextLocal (India-specific)
  - MSG91 (India-specific)
- **Secure OTP system** with 4-digit codes and 5-minute expiration
- **Rate limiting** and attempt restrictions for security

### 📄 Business Document Upload
- **Supported documents**: Business License, Trade License, GST Certificate, Shop & Establishment License
- **File validation**: PDF, JPG, PNG, WebP up to 5MB
- **Drag & drop interface** for easy uploading
- **Admin verification workflow** with status tracking

### 💼 Comprehensive Business Model
- **Revenue streams**: Membership fees, transaction fees, partnership commissions
- **Cost structure analysis** and growth projections
- **Value propositions** for all stakeholders
- **Financial projections** for sustainable growth

## 📊 Features

### Core Features
- **Supplier Discovery**: Find verified suppliers in your area
- **Community Reviews**: Real user experiences and ratings
- **Location-based Search**: Find suppliers near you
- **Multi-language Support**: Hindi, Bengali, Tamil, English
- **Real-time Translation**: Powered by LibreTranslate and Google Translate

### Advanced Features
- **AI-powered Supplier Detection**: Automatically extract supplier information from posts
- **Trust Scoring System**: Dynamic scoring based on user votes
- **Voice Input**: Speech-to-text for easy posting
- **Reverse Geocoding**: Accurate location detection
- **Voting System**: Community-driven supplier verification

## 🔧 Technical Stack

- **Frontend**: React 18 + TypeScript + Vite
- **UI Framework**: shadcn/ui + Tailwind CSS
- **State Management**: React Hooks + Context
- **Location Services**: Google Maps API + OpenStreetMap
- **Translation**: LibreTranslate + Google Translate API
- **SMS Services**: Twilio + TextLocal + MSG91
- **File Upload**: React Dropzone
- **Authentication**: Real SMS OTP verification

## Translation API Configuration

This app includes a real-time translation feature for posts. The translation service uses:

### Primary: LibreTranslate (Free)
- No API key required
- Public instance: `https://libretranslate.de/translate`
- Supports Hindi, Bengali, Tamil, and English

### Fallback: Google Translate API (Optional)
- Requires API key for better quality translations
- Set environment variable: `VITE_GOOGLE_TRANSLATE_API_KEY=your_api_key`
- Get API key from: [Google Cloud Console](https://console.cloud.google.com/apis/library/translate.googleapis.com)

### How to set up Google Translate API:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the "Cloud Translation API"
4. Create credentials (API key)
5. Add the key to your environment variables

**Note**: The app works perfectly without the Google Translate API key using LibreTranslate.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager

### Installation

```bash
# Clone the repository
git clone https://github.com/Sayan30092004/TRUST_BASKET.git

# Navigate to project directory
cd TRUST_BASKET

# Install dependencies
npm install

# Copy environment configuration
cp .env.example .env

# Start development server
npm run dev
```

### Environment Setup

Create a `.env` file with your API keys:

```env
# SMS Service Configuration
VITE_TWILIO_ACCOUNT_SID=your_twilio_sid
VITE_TWILIO_AUTH_TOKEN=your_twilio_token
VITE_TWILIO_PHONE_NUMBER=your_twilio_number

# TextLocal (India)
VITE_TEXTLOCAL_API_KEY=your_textlocal_key

# MSG91 (India)
VITE_MSG91_AUTH_KEY=your_msg91_key

# Optional: Google Translate API
VITE_GOOGLE_TRANSLATE_API_KEY=your_google_translate_key
```

## 📱 User Guide

### Getting Started
1. **Sign Up**: Register with phone number verification via SMS OTP
2. **Explore**: Browse suppliers and community posts as a regular member
3. **Upgrade**: Become a Trusted member by uploading business documents
4. **Verify**: Get government verification for enhanced credibility

### Membership Tiers

#### 🆓 Regular Member (Free)
- Basic supplier search and ratings
- Post basic inquiries
- Community discussions
- Location-based search

#### 🛡️ Trusted Member (₹999/year)
- All Regular features
- **Trusted Member Badge**
- Priority search listing
- Advanced analytics
- Premium support
- Bulk inquiries

#### 👑 Verified Member (₹1098/year)
- All Trusted features
- **Government Verified Badge**
- Premium search placement
- Direct customer contact
- Business insurance eligibility
- Export/Import facilitation

## 🏗️ Architecture

### Component Structure
```
src/
├── components/           # React components
│   ├── ui/              # shadcn/ui components
│   ├── AuthLogin.tsx    # SMS OTP authentication
│   ├── TrustedMemberVerification.tsx
│   ├── BusinessModelOverview.tsx
│   └── ...
├── utils/               # Utility functions
│   ├── smsService.ts    # SMS OTP handling
│   ├── documentService.ts # File upload & validation
│   ├── businessModel.ts # Business logic & pricing
│   └── ...
├── types/               # TypeScript definitions
└── pages/               # Main application pages
```

### Key Services
- **SMS Service**: Multi-provider OTP delivery
- **Document Service**: File upload and validation
- **Business Model**: Pricing and feature management
- **Location Service**: Geocoding and distance calculation
- **Translation Service**: Multi-language support

## 🔒 Security & Compliance

### Data Protection
- **Phone verification** prevents spam accounts
- **Document encryption** for business files
- **OTP rate limiting** prevents abuse
- **File validation** ensures security

### Business Compliance
- **KYC compliance** for financial services
- **Government document verification**
- **Data retention policies**
- **Privacy controls**

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎯 Roadmap

### Phase 1 (Current)
- ✅ Trusted member verification system
- ✅ Real SMS OTP authentication
- ✅ Business document upload
- ✅ Comprehensive business model

### Phase 2 (Planned)
- 🔄 Payment gateway integration (Razorpay)
- 🔄 Advanced analytics dashboard
- 🔄 API integration with government databases
- 🔄 Automated document verification (AI/OCR)

### Phase 3 (Future)
- 📋 Business networking features
- 📋 Export/Import facilitation
- 📋 Banking partnerships
- 📋 Insurance integration

## 📞 Support

- **Documentation**: See [TRUSTED_MEMBER_FEATURES.md](TRUSTED_MEMBER_FEATURES.md)
- **Issues**: [GitHub Issues](https://github.com/Sayan30092004/TRUST_BASKET/issues)
- **Discussions**: [GitHub Discussions](https://github.com/Sayan30092004/TRUST_BASKET/discussions)

## How can I edit this code?

There are several ways of editing your application.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/ebb29cfc-49d5-41c7-bb65-377f147935df) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)

---

**TRUST_BASKET** - Building India's Most Trusted B2B Marketplace 🇮🇳
