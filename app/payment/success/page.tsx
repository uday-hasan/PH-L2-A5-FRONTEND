"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  const sessionId = searchParams.get("session_id");
  const eventId = searchParams.get("event_id");
  const eventTitle = searchParams.get("event_title");
  const eventDate = searchParams.get("event_date");
  const amount = searchParams.get("amount");

  useEffect(() => {
    // Simulate verification delay
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-linear-to-br from-green-50 to-blue-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <Card className="p-8 text-center">
          {isLoading ? (
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center animate-pulse">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <p className="text-gray-600">Processing your payment...</p>
            </div>
          ) : (
            <>
              {/* Success Icon */}
              <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-6">
                <svg
                  className="w-10 h-10 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>

              {/* Title and Message */}
              <h1 className="text-4xl font-bold text-gray-300 mb-2">
                Payment Successful!
              </h1>
              <p className="text-gray-600 mb-6">
                Your payment has been processed successfully.
              </p>

              {/* Status Badge */}
              <div className="mb-6">
                <Badge variant="default" className="text-lg py-2 px-4">
                  ✓ Confirmed
                </Badge>
              </div>

              {/* Payment Details */}
              <div className="bg-muted rounded-lg p-6 text-left mb-6 space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Session ID</p>
                  <p className="font-mono text-sm break-all text-gray-300">
                    {sessionId || "N/A"}
                  </p>
                </div>

                {amount && (
                  <div className="border-t pt-4">
                    <p className="text-sm text-gray-600 mb-1">Amount Paid</p>
                    <p className="text-2xl font-bold text-green-600">
                      ৳{parseFloat(amount).toFixed(2)}
                    </p>
                  </div>
                )}

                {eventTitle && (
                  <div className="border-t pt-4">
                    <p className="text-sm text-gray-600 mb-1">Event</p>
                    <p className="font-semibold text-gray-300">{eventTitle}</p>
                    {eventDate && (
                      <p className="text-sm text-gray-600">
                        {new Date(eventDate).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Next Steps */}
              <div className="bg-blue-50 rounded-lg p-4 mb-6 text-left">
                <h3 className="font-semibold text-gray-900 mb-2">
                  {"What's"} Next?
                </h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>✓ Your payment has been confirmed</li>
                  {eventTitle && (
                    <>
                      <li>✓ You have been registered for {eventTitle}</li>
                      <li>
                        ✓ Check your dashboard for event details and reminders
                      </li>
                    </>
                  )}
                  <li>✓ A confirmation email will be sent to you shortly</li>
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 justify-center">
                <Button
                  onClick={() => router.push(`/dashboard`)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Go to Dashboard
                </Button>
                {eventId && (
                  <Button
                    onClick={() => router.push(`/events`)}
                    variant="outline"
                  >
                    Browse Events
                  </Button>
                )}
              </div>

              {/* Receipt Note */}
              <div className="mt-8 text-xs text-gray-500">
                <p>Transaction ID: {sessionId || "PENDING"}</p>
                <p>Date: {new Date().toLocaleString()}</p>
                <p className="mt-2">
                  A detailed receipt has been sent to your registered email
                  address.
                </p>
              </div>
            </>
          )}
        </Card>

        {/* Support Link */}
        <div className="text-center mt-6">
          <p className="text-gray-600 text-sm">
            Having issues?{" "}
            <a
              href="mailto:support@planora.com"
              className="text-blue-600 hover:underline"
            >
              Contact Support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          Loading...
        </div>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}
