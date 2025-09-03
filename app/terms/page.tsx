import React from 'react';

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
      
      <div className="prose max-w-none">
        <h2 className="text-2xl font-semibold mb-4">Acceptance of Terms</h2>
        <p className="mb-4">
          By accessing and using WeddingLK, you accept and agree to be bound by the terms 
          and provision of this agreement.
        </p>

        <h2 className="text-2xl font-semibold mb-4">Use License</h2>
        <p className="mb-4">
          Permission is granted to temporarily download one copy of WeddingLK for personal, 
          non-commercial transitory viewing only.
        </p>

        <h2 className="text-2xl font-semibold mb-4">Disclaimer</h2>
        <p className="mb-4">
          The materials on WeddingLK are provided on an 'as is' basis. WeddingLK makes no 
          warranties, expressed or implied, and hereby disclaims and negates all other warranties.
        </p>

        <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
        <p className="mb-4">
          If you have any questions about these Terms of Service, please contact us at 
          legal@weddinglk.com
        </p>
      </div>
    </div>
  );
}
