
> Nagar-Setu : Smart Municipal Service System
> Full Stack CivicTech Platform

> $ whoami
Citizen + Admin Municipal Management System
> $ stack --info
Frontend  : React 19 + TailwindCSS
Backend   : Node.js + Express 5
Database  : MongoDB
Payments  : Razorpay
OTP/Auth  : Twilio Verify
Maps      : Leaflet
AI        : Google Generative AI

>📂 Project Structure
💻 Client Side (User & Admin)
```bash
src/
├── components/
│   ├── common/         # Navbar, LanguageGate, Loader, Chatbot, BlobCursor
│   ├── dashboard/      # Home, Profile, Notification, ServiceHistory
│   ├── complaints/     # ComplaintForm, Status, Categories
│   ├── pages/          # Services, Contacts
│   └── payment/        # PaymentPage (Razorpay Integration)
├── pages/              # Admin Specific: AdminLogin, AdminHome, AdminDashboard
└── App.jsx             # Main Routing & Auth Logic
```

💻 Server Side (User & Admin)
```bash
server/
├── models/             # Mongoose Schemas (User, Admin, Complaint, Bill, etc.)
├── routes/             # adminRoutes, userSearchRoutes
├── uploads/            # Directory for stored service request PDFs
└── server.js           # Express App, Twilio & Razorpay logic
```



⚙️ Installation & Setup
1. Clone the Repository
```bash 
git clone https://github.com/ArshAnsari23122003/Hackathon_Suvidha.git
cd Hackathon_Suvidha
```
2. Backend Setup
  1. Navigate to the server folder.
  2. Install dependencies: npm install
  3. Create a .env file and add the following:
```bash
PORT=5000
MONGO_URI=your_mongodb_connection_string
TWILIO_ACCOUNT_SID=your_sid
TWILIO_AUTH_TOKEN=your_token
TWILIO_VERIFY_SERVICE_SID=your_verify_sid
TWILIO_PHONE_NUMBER=your_twilio_number
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
```
3. Frontend Setup
  1. Navigate to the client folder.
  2. Install dependencies: npm install
  3. Create a .env file for your Google AI Key
```bash
VITE_GEMINI_API_KEY=your_google_ai_key
```

4. Start the server:
```bash
npm start
```


📜 License
MIT License
