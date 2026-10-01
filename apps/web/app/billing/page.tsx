"use client";

import { trpc } from "~/trpc/client";

export default function TestBillingComponent() {
  // Call the tRPC query hook
  const { data, isLoading, error, refetch } = trpc.billing.testRazorpay.useQuery(
    undefined,
    { enabled: false }, // Prevents auto-running on mount
  );

  return (
    <div className="p-4 border rounded-md">
      <h3 className="font-bold">Razorpay Connection Test</h3>
      <button onClick={() => refetch()} className="px-4 py-2 bg-blue-500 text-white rounded mt-2">
        {isLoading ? "Testing..." : "Run Connection Test"}
      </button>

      {data && <p className="text-green-600 mt-2">Success: {JSON.stringify(data)}</p>}
      {error && <p className="text-red-600 mt-2">Error: {error.message}</p>}
    </div>
  );
}
