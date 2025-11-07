'use client';

import { useState } from 'react';
import CheckoutModal from '../../components/CheckoutModal';

export default function Pricing() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Whether you&apos;re learning microVMs at home or scaling production workloads, 
            we have a plan that fits your needs.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          
          {/* Hobbyist Tier */}
          <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-200 hover:shadow-xl transition duration-300">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Hobbyist</h3>
              <div className="text-4xl font-bold text-indigo-600 mb-2">$25</div>
              <div className="text-gray-500">per month</div>
            </div>
            
            <ul className="space-y-4 mb-8">
              <li className="flex items-start">
                <span className="text-indigo-600 mr-3">✓</span>
                <span className="text-gray-700">Pay monthly via GitHub.com using GitHub Sponsors</span>
              </li>
              <li className="flex items-start">
                <span className="text-indigo-600 mr-3">✓</span>
                <span className="text-gray-700">Unlimited Slicer installations for personal use only</span>
              </li>
              <li className="flex items-start">
                <span className="text-indigo-600 mr-3">✓</span>
                <span className="text-gray-700">Deploy almost anywhere i.e. WSL, RPi 5, N100, Hetzner, etc</span>
              </li>
              <li className="flex items-start">
                <span className="text-indigo-600 mr-3">✓</span>
                <span className="text-gray-700">K3sup Pro included for free</span>
              </li>
              <li className="flex items-start">
                <span className="text-indigo-600 mr-3">✓</span>
                <span className="text-gray-700">Experiment with and learn microVMs</span>
              </li>
              <li className="flex items-start">
                <span className="text-indigo-600 mr-3">✓</span>
                <span className="text-gray-700">Support &amp; Collaboration via Discord</span>
              </li>
            </ul>
            
            <a 
              href="https://github.com/sponsors/alexellis"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-300 block text-center"
            >
              Start Sponsoring
            </a>
          </div>

          {/* Pro Tier */}
          <div className="bg-white rounded-lg shadow-lg p-8 border-2 border-indigo-600 hover:shadow-xl transition duration-300 relative">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span className="bg-indigo-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                Self-Service Option
              </span>
            </div>
            
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Pro</h3>
              <div className="text-4xl font-bold text-indigo-600 mb-2">$250</div>
              <div className="text-gray-500">per month per seat</div>
            </div>
            
            <ul className="space-y-4 mb-8">
              <li className="flex items-start">
                <span className="text-indigo-600 mr-3">✓</span>
                <span className="text-gray-700">Run servers, containers, and Kubernetes in microVMs</span>
              </li>
              <li className="flex items-start">
                <span className="text-indigo-600 mr-3">✓</span>
                <span className="text-gray-700">Run ephemeral jobs in microVMs via REST API</span>
              </li>
              <li className="flex items-start">
                <span className="text-indigo-600 mr-3">✓</span>
                <span className="text-gray-700">Customise microVMs via userdata or a custom Docker image</span>
              </li>
              <li className="flex items-start">
                <span className="text-indigo-600 mr-3">✓</span>
                <span className="text-gray-700">Supported Operating Systems: Ubuntu LTS - x86_64 and arm64</span>
              </li>
              <li className="flex items-start">
                <span className="text-indigo-600 mr-3">✓</span>
                <span className="text-gray-700">Mount GPUs into microVMs for AI/LLMs</span>
              </li>
              <li className="flex items-start">
                <span className="text-indigo-600 mr-3">✓</span>
                <span className="text-gray-700"><a style={{ textDecoration: "underline" }} href="https://actuated.com/blog/bringing-firecracker-to-jenkins">Jenkins plugin</a> for ephemeral build slaves</span>
              </li>
              <li className="flex items-start">
                <span className="text-indigo-600 mr-3">✓</span>
                <span className="text-gray-700">Support via email - business hours</span>
              </li>

            </ul>
            
            <button 
              onClick={() => setIsModalOpen(true)}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-300"
            >
              Purchase Seats
            </button>
          </div>

          {/* Enterprise Tier */}
          <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-200 hover:shadow-xl transition duration-300">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Enterprise</h3>
              <div className="text-4xl font-bold text-gray-500 mb-2">Custom</div>
              <div className="">&nbsp;</div>
            </div>
            
            <ul className="space-y-4 mb-8">
              <li className="flex items-start">
                <span className="text-indigo-600 mr-3">✓</span>
                <span className="text-gray-700">Pricing that scales with your needs</span>
              </li>
              <li className="flex items-start">
                <span className="text-indigo-600 mr-3">✓</span>
                <span className="text-gray-700">Pay annually by invoice - USD ACH or SWIFT in GBP</span>
              </li>
              <li className="flex items-start">
                <span className="text-indigo-600 mr-3">✓</span>
                <span className="text-gray-700">Additional Operating Systems: RHEL-like (Rocky Linux)</span>
              </li>
              <li className="flex items-start">
                <span className="text-indigo-600 mr-3">✓</span>
                <span className="text-gray-700">Private Slack channel</span>
              </li>
              <li className="flex items-start">
                <span className="text-indigo-600 mr-3">✓</span>
                <span className="text-gray-700">Priority support within 1 business day</span>
              </li>
            </ul>
            
            <a 
              href="https://docs.google.com/forms/d/e/1FAIpQLSdDdWbzoRFjGmLTuMI7h-OBhybzXewaNL-hoKTnbU8Wbz7bRA/viewform?usp=sharing&ouid=108694999418382910484"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold py-3 px-6 rounded-lg transition duration-300 border border-gray-300 block text-center"
            >
              Contact Us
            </a>
          </div>
        </div>

        {/* Additional Information */}
        <div className="text-center mt-16">
          <p className="text-gray-600 mb-6">
            Got questions for us about Slicer before purchasing?
          </p>
          <a 
            href="https://docs.google.com/forms/d/e/1FAIpQLSdDdWbzoRFjGmLTuMI7h-OBhybzXewaNL-hoKTnbU8Wbz7bRA/viewform?usp=sharing&ouid=108694999418382910484"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-6 py-3 text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition duration-300"
          >
            Talk to Sales
          </a>
        </div>

        {/* Footer */}
        <footer className="mt-16 text-center text-gray-500 text-sm">
          <p>© 2025 <a href="https://openfaas.com" className="hover:text-indigo-600">OpenFaaS Ltd</a>. Made with ❤️ for the self-hosted community.</p>
        </footer>
      </div>

      {/* Checkout Modal */}
      <CheckoutModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}
