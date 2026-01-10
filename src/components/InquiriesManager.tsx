"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Mail, Phone, Trash2, Check, Eye } from "lucide-react";
import { updateInquiryStatus, deleteInquiry } from "@/lib/inquiry-actions";
import { toast } from "sonner";

interface Inquiry {
  id: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string | null;
  message: string;
  status: string;
  createdAt: Date;
}

interface InquiriesManagerProps {
  propertyId: string;
  inquiries: Inquiry[];
}

export function InquiriesManager({ propertyId, inquiries }: InquiriesManagerProps) {
  const [filter, setFilter] = useState<"all" | "unread" | "read" | "replied">("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredInquiries = inquiries.filter((inquiry) => {
    if (filter === "all") return true;
    return inquiry.status === filter;
  });

  const handleMarkAsRead = async (inquiryId: string) => {
    const result = await updateInquiryStatus(inquiryId, "read");
    if (result.success) {
      toast.success("Marked as read");
      window.location.reload();
    } else {
      toast.error(result.error || "Failed to update status");
    }
  };

  const handleMarkAsReplied = async (inquiryId: string) => {
    const result = await updateInquiryStatus(inquiryId, "replied");
    if (result.success) {
      toast.success("Marked as replied");
      window.location.reload();
    } else {
      toast.error(result.error || "Failed to update status");
    }
  };

  const handleDelete = async (inquiryId: string) => {
    if (!confirm("Are you sure you want to delete this inquiry?")) return;

    const result = await deleteInquiry(inquiryId);
    if (result.success) {
      toast.success("Inquiry deleted");
      window.location.reload();
    } else {
      toast.error(result.error || "Failed to delete inquiry");
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      unread: "bg-red-100 text-red-700",
      read: "bg-blue-100 text-blue-700",
      replied: "bg-green-100 text-green-700",
    };
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status as keyof typeof styles] || "bg-stone-100 text-stone-700"}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-stone-200">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            filter === "all"
              ? "text-stone-900 border-b-2 border-stone-900"
              : "text-stone-500 hover:text-stone-700"
          }`}
        >
          All ({inquiries.length})
        </button>
        <button
          onClick={() => setFilter("unread")}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            filter === "unread"
              ? "text-stone-900 border-b-2 border-stone-900"
              : "text-stone-500 hover:text-stone-700"
          }`}
        >
          Unread ({inquiries.filter((i) => i.status === "unread").length})
        </button>
        <button
          onClick={() => setFilter("read")}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            filter === "read"
              ? "text-stone-900 border-b-2 border-stone-900"
              : "text-stone-500 hover:text-stone-700"
          }`}
        >
          Read ({inquiries.filter((i) => i.status === "read").length})
        </button>
        <button
          onClick={() => setFilter("replied")}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            filter === "replied"
              ? "text-stone-900 border-b-2 border-stone-900"
              : "text-stone-500 hover:text-stone-700"
          }`}
        >
          Replied ({inquiries.filter((i) => i.status === "replied").length})
        </button>
      </div>

      {/* Inquiries List */}
      {filteredInquiries.length === 0 ? (
        <div className="text-center py-12 text-stone-500">
          <p>No inquiries found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredInquiries.map((inquiry) => (
            <div
              key={inquiry.id}
              className={`border rounded-lg p-4 transition-colors ${
                inquiry.status === "unread" ? "bg-blue-50 border-blue-200" : "bg-white border-stone-200"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-stone-900">{inquiry.guestName}</h3>
                    {getStatusBadge(inquiry.status)}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-stone-600 mb-2">
                    <div className="flex items-center gap-1">
                      <Mail className="w-4 h-4" />
                      <a href={`mailto:${inquiry.guestEmail}`} className="hover:underline">
                        {inquiry.guestEmail}
                      </a>
                    </div>
                    {inquiry.guestPhone && (
                      <div className="flex items-center gap-1">
                        <Phone className="w-4 h-4" />
                        <a href={`tel:${inquiry.guestPhone}`} className="hover:underline">
                          {inquiry.guestPhone}
                        </a>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-stone-500">
                    {new Date(inquiry.createdAt).toLocaleString()}
                  </p>

                  {/* Message Preview/Full */}
                  <div className="mt-3">
                    <p className={`text-stone-700 ${expandedId === inquiry.id ? "" : "line-clamp-2"}`}>
                      {inquiry.message}
                    </p>
                    {inquiry.message.length > 100 && (
                      <button
                        onClick={() => setExpandedId(expandedId === inquiry.id ? null : inquiry.id)}
                        className="text-sm text-stone-500 hover:text-stone-700 mt-1"
                      >
                        {expandedId === inquiry.id ? "Show less" : "Read more"}
                      </button>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2">
                  {inquiry.status === "unread" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleMarkAsRead(inquiry.id)}
                      className="text-xs"
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      Mark Read
                    </Button>
                  )}
                  {inquiry.status === "read" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleMarkAsReplied(inquiry.id)}
                      className="text-xs"
                    >
                      <Check className="w-3 h-3 mr-1" />
                      Mark Replied
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(inquiry.id)}
                    className="text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-3 h-3 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
