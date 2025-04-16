
import React from 'react';
import { Link } from 'react-router-dom';

const TermsOfService = () => {
  return (
    <div className="recipe-container py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>

        <div className="prose prose-lg">
          <p className="text-gray-600 mb-6">
            Last updated: April 9, 2025
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
            <p className="mb-4">
              Welcome to RecipePal! These Terms of Service ("Terms") govern your access to and use of the RecipePal website, including any content, functionality, and services offered on or through the website (the "Service").
            </p>
            <p className="mb-4">
              By using our Service, you agree to comply with and be bound by these Terms. If you do not agree with these Terms, please do not use our Service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. User Accounts</h2>
            <p className="mb-4">
              When you create an account with us, you must provide accurate, complete, and current information. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account.
            </p>
            <p className="mb-4">
              You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. User-Generated Content</h2>
            <p className="mb-4">
              Our Service allows you to post, link, store, share and otherwise make available certain information, text, graphics, videos, or other material ("Content"). You are responsible for the Content that you post on or through the Service.
            </p>
            <p className="mb-4">
              By posting Content on or through the Service, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, adapt, publish, translate, distribute, and display such Content in any media formats.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Recipe Ownership</h2>
            <p className="mb-4">
              While you retain ownership of your recipes, by posting them on RecipePal, you grant other users the right to view, save, and make variations of your recipes in accordance with the Service functionality.
            </p>
            <p className="mb-4">
              When creating a variation of someone else's recipe, the original creator will always be credited appropriately.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Prohibited Uses</h2>
            <p className="mb-4">
              You may not use the Service for any purpose that is illegal or prohibited by these Terms. You agree not to:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Use the Service in any manner that could disable, overburden, damage, or impair the site</li>
              <li>Use any robot, spider or other automated device to access the Service</li>
              <li>Introduce any viruses, trojan horses, worms, or other material which is malicious or harmful</li>
              <li>Attempt to gain unauthorized access to any portion of the Service</li>
              <li>Post false, misleading, or deceptive content</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Changes to Terms</h2>
            <p className="mb-4">
              We reserve the right to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. Contact Us</h2>
            <p className="mb-4">
              If you have any questions about these Terms, please contact us at:
            </p>
            <p className="mb-4">
              Email: [TODO]
            </p>
          </section>
        </div>

        <div className="mt-8 text-center">
          <Link
            to="/"
            className="text-recipe-600 hover:text-recipe-700 font-medium"
          >
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
