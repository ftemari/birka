import React from 'react';

type PageProps = {
    searchParams: { [key: string]: string | string[] | undefined }
  };


export default function Confirmation({ searchParams }: PageProps) {
    const paymentId = searchParams.payment_id as string;
    const status = searchParams.status as string;

    return (
        <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Payment Details</h2>
            <div className="space-y-2">
                <p className="text-sm text-gray-600">
                    <span className="font-semibold">Payment ID:</span> {paymentId || 'Not provided'}
                </p>
                <p className="text-sm text-gray-600">
                    <span className="font-semibold">Status:</span> {status || 'Not provided'}
                </p>
            </div>
        </div>
    );
}
