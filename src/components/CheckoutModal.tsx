"use client";

import { useState } from "react";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CheckoutModal({ isOpen, onClose }: CheckoutModalProps) {
  const [quantity, setQuantity] = useState(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const checkoutURL = `https://subscribe.openfaas.com/buy/cbf41f9b-9ab3-4c04-b64a-2c00c5d725ac?quantity=${quantity}`;
    window.location.href = checkoutURL;
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="relative z-50"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
        aria-hidden="true"
        onClick={handleBackdropClick}
      />

      {/* Modal container */}
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
            {/* Close button */}
            <div className="absolute top-0 right-0 pt-4 pr-4">
              <button
                type="button"
                onClick={onClose}
                className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none"
              >
                <span className="sr-only">Close</span>
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18 18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Modal content */}
            <div>
              <h3
                className="text-lg font-semibold text-gray-900"
                id="modal-title"
              >
                SlicerVM Pro (commercial use)
              </h3>
              <div className="mt-2">
                <p className="text-sm text-gray-500 mt-5">
                  Deploy SlicerVM for commercial, business, and internal use.
                </p>
                <ul>
                  <li className="text-sm text-gray-500 mt-5 list-disc list-inside">
                    Each developer that runs Slicer requires a seat.
                  </li>
                  <li className="text-sm text-gray-500 list-disc list-inside">
                    Each deployment to a company server requires a seat
                    (production and non-production).
                  </li>
                </ul>
                <p className="text-sm text-gray-500 mt-5">
                  Contact us via the{" "}
                  <a
                    style={{ textDecoration: "underline" }}
                    href="https://docs.google.com/forms/d/e/1FAIpQLSdDdWbzoRFjGmLTuMI7h-OBhybzXewaNL-hoKTnbU8Wbz7bRA/viewform"
                  >
                    form
                  </a>{" "}
                  to order via invoice or to ask questions.
                </p>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div className="flex items-center">
                <label
                  htmlFor="quantity"
                  className="text-sm font-medium text-gray-700"
                >
                  Number of seats
                </label>
                <input
                  id="quantity"
                  name="quantity"
                  type="number"
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                  }
                  min="1"
                  className="mt-1 ml-3 px-2 py-1 w-16 border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-gray-900 font-medium"
                />
              </div>

              <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
                <p className="font-medium">
                  Total: ${(quantity * 250).toLocaleString()}/month
                </p>
                <p className="text-xs mt-1">$250 per seat per month</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href="https://subscribe.openfaas.com/billing"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-full rounded-md px-3 py-2 text-sm font-semibold bg-white text-gray-900 ring-1 shadow-sm ring-gray-300 ring-inset hover:bg-gray-50"
                >
                  Update subscription
                </a>
                <button
                  type="submit"
                  className="w-full rounded-md px-3 py-2 text-sm font-semibold text-white bg-indigo-600 shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Checkout Now
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
