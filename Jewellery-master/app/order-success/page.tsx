"use client";

export const dynamic = "force-dynamic";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

function OrderSuccessContent() {

const searchParams = useSearchParams();
const orderId = searchParams.get("orderId");

return ( <div className="container mx-auto py-20 text-center">

```
  <h1 className="text-3xl font-bold mb-4">
    Order Successful 🎉
  </h1>

  <p>Your order has been placed successfully.</p>

  {orderId && (
    <p className="mt-4 text-muted-foreground">
      Order ID: {orderId}
    </p>
  )}

</div>
);
}

export default function OrderSuccess() {
return (
<Suspense fallback={<div className="text-center py-20">Loading...</div>}> <OrderSuccessContent /> </Suspense>
);
}
