export const formConfigs = {
  "Apply New": {
    title: "Apply for New Connection",
    description: "Please provide your details to initiate a new utility connection.",
    fields: [
      { name: "full_name", label: "Full Legal Name", type: "text", placeholder: "John Doe" },
      { name: "contact_number", label: "Phone Number", type: "text", placeholder: "+91 9876543210" },
      { name: "address", label: "Installation Address", type: "textarea", placeholder: "Full complete address..." },
      { name: "id_proof", label: "Upload Identity Proof (PDF)", type: "file" }
    ]
  },
  "Link Existing": {
    title: "Link Existing Account",
    description: "Link a previous or existing connection to your digital profile.",
    fields: [
      { name: "account_no", label: "10-Digit Account Number", type: "text", placeholder: "e.g., 1002938475" },
      { name: "last_bill", label: "Last Bill Amount (₹)", type: "text", placeholder: "0.00" },
      { name: "bill_file", label: "Upload Recent Bill (PDF)", type: "file" }
    ]
  },
  "Profile Settings": {
    title: "Update Profile Settings",
    description: "Update your registered email and phone number.",
    fields: [
      { name: "account_no", label: "Account Number", type: "text" },
      { name: "new_email", label: "New Email Address", type: "email", placeholder: "name@example.com" },
      { name: "verification_doc", label: "Verification Document (PDF)", type: "file" }
    ]
  },
  "Update Name": {
    title: "Billing Name Change",
    description: "Submit a request to correct or change the legal name on your bills.",
    fields: [
      { name: "account_no", label: "Account Number", type: "text" },
      { name: "new_name", label: "New Legal Name", type: "text" },
      { name: "legal_doc", label: "Upload Legal Affidavit (PDF)", type: "file" }
    ]
  },
  "Change Address": {
    title: "Premises Address Correction",
    description: "Update the registered address for your meter.",
    fields: [
      { name: "account_no", label: "Account Number", type: "text" },
      { name: "new_address", label: "Corrected Address", type: "textarea" },
      { name: "address_proof", label: "Upload Address Proof (PDF)", type: "file" }
    ]
  },
  "Track Request": {
    title: "Track Service Request",
    description: "Check the status of your previously submitted applications.",
    fields: [
      { name: "request_id", label: "Service Request ID (SRN)", type: "text", placeholder: "SRN-XXXX-XXXX" }
    ]
  },
  "Check Tariff": {
    title: "Current Tariff Lookup",
    description: "View the active rate plan applied to your connection.",
    fields: [
      { name: "account_no", label: "Account Number", type: "text" }
    ]
  },
  "Modify Category": {
    title: "Modify Billing Category",
    description: "Switch your tariff from Domestic to Commercial or vice versa.",
    fields: [
      { name: "account_no", label: "Account Number", type: "text" },
      { name: "category", label: "Requested Category", type: "select", options: ["Domestic", "Commercial", "Industrial"] },
      { name: "business_doc", label: "Upload Business License (PDF)", type: "file" }
    ]
  },
  "Rate Calculator": {
    title: "Usage Rate Calculator",
    description: "Estimate your monthly bill based on current tariffs.",
    fields: [
      { name: "category", label: "Tariff Category", type: "select", options: ["Domestic", "Commercial"] },
      { name: "units", label: "Estimated Usage (Units/kWh)", type: "text", placeholder: "e.g., 250" }
    ]
  },
  "Request Install": {
    title: "New Meter Installation",
    description: "Schedule a technician for a new smart meter setup.",
    fields: [
      { name: "ref_no", label: "Application Reference", type: "text" },
      { name: "pref_date", label: "Preferred Installation Date", type: "date" },
      { name: "clearance_doc", label: "Upload Site Clearance (PDF)", type: "file" }
    ]
  },
  "Deactivation Form": {
    title: "Permanent Disconnection",
    description: "Request removal of the meter and closure of the account.",
    fields: [
      { name: "account_no", label: "Account Number", type: "text" },
      { name: "reason", label: "Reason for Deactivation", type: "textarea" },
      { name: "reading_doc", label: "Final Reading Photo (PDF)", type: "file" }
    ]
  },
  "Technical Support": {
    title: "Report Technical Issue",
    description: "Report meter faults, reading errors, or power issues.",
    fields: [
      { name: "account_no", label: "Account Number", type: "text" },
      { name: "issue_desc", label: "Describe the Issue", type: "textarea", placeholder: "Details..." },
      { name: "error_doc", label: "Upload Error Document (PDF)", type: "file" }
    ]
  }
};