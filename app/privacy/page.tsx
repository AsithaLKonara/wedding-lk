import React from 'react';

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      
      <div className="prose max-w-none">
        <h2 className="text-2xl font-semibold mb-4">Information We Collect</h2>
        <p className="mb-4">
          WeddingLK collects information you provide directly to us, such as when you create an account, 
          make a booking, or contact us for support.
        </p>

        <h2 className="text-2xl font-semibold mb-4">How We Use Your Information</h2>
        <p className="mb-4">
          We use the information we collect to provide, maintain, and improve our services, 
          process transactions, and communicate with you.
        </p>

        <h2 className="text-2xl font-semibold mb-4">Information Sharing</h2>
        <p className="mb-4">
          We do not sell, trade, or otherwise transfer your personal information to third parties 
          without your consent, except as described in this policy.
        </p>

        <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
        <p className="mb-4">
          If you have any questions about this Privacy Policy, please contact us at 
          privacy@weddinglk.com
        </p>
      </div>
    </div>
  );
}


