import React from "react";
import { X } from "lucide-react";

const OrderModal = ({
  isOpen,
  onClose,
  order,
  onChangeStatus, // optional callback to update order status
}: any) => {
  if (!isOpen || !order) return null;

  const handleStatusChange = (newStatus: string) => {
    if (onChangeStatus) {
      onChangeStatus(order.orderId, newStatus);
    }
    onClose(); // close modal after action
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800">
        <div className="flex items-center justify-between border-b pb-2">
          <h2 className="text-2xl font-semibold text-primary ">
            Order Details
          </h2>
          <button onClick={onClose} className="text-[#e63946]">
            <X size={20} />
          </button>
        </div>

        <div className="mt-4 space-y-2 text-sm text-gray-700 dark:text-gray-200">
          <p>
            <strong>Order ID:</strong> {order.orderId}
          </p>
          <p>
            <strong>Customer:</strong> {order.userName}
          </p>
          <p>
            <strong>Package:</strong> {order.name}
          </p>
          <p>
            <strong>Recipe:</strong> {order.recipeName}
          </p>
          <p>
            <strong>Invoice Date:</strong> {order.invoiceDate}
          </p>
          <p>
            <strong>Price Before Coupon:</strong> ${order.priceBeforeCoupon}
          </p>
          <p>
            <strong>Price After Coupon:</strong> ${order.priceAfterCoupon}
          </p>
          <p>
            <strong>Status:</strong> {order.status}
          </p>
          <p>
            <strong>Order Status:</strong> {order.orderStatus}
          </p>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          <div className="flex gap-2">
            <button
              onClick={() => handleStatusChange("Approved")}
              className="rounded bg-primary px-3 py-1.5 text-white hover:bg-green-600"
            >
              Approve
            </button>
            <button
              onClick={() => handleStatusChange("Pending")}
              className="rounded bg-[#f4d35e] px-3 py-1.5 text-white hover:bg-yellow-400"
            >
              Pending
            </button>
            <button
              onClick={() => handleStatusChange("Closed")}
              className="rounded bg-[#e63946] px-5 py-1.5 text-white hover:bg-red-600"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderModal;
