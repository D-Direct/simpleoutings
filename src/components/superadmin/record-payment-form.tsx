"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface RecordPaymentFormProps {
  userId: string;
  adminId: string;
  currentPlan?: {
    id: string;
    name: string;
    priceMonthly: number;
    currency: string;
  } | null;
}

export function RecordPaymentForm({ userId, adminId, currentPlan }: RecordPaymentFormProps) {
  const [amount, setAmount] = useState(currentPlan?.priceMonthly.toString() || "");
  const [paymentMethod, setPaymentMethod] = useState("bank_transfer");
  const [referenceNumber, setReferenceNumber] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const response = await fetch("/api/superadmin/payment/record", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          adminId,
          amount: parseFloat(amount),
          paymentMethod,
          referenceNumber,
          notes,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to record payment");
      }

      setSuccess(true);
      // Reset form
      setReferenceNumber("");
      setNotes("");
      router.refresh();

      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError("Failed to record payment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label>Amount (LKR)</Label>
        <Input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
          min="0"
          step="0.01"
        />
        {currentPlan && (
          <p className="text-xs text-stone-500">
            Current plan: {currentPlan.name} ({currentPlan.priceMonthly} LKR/month)
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Payment Method</Label>
        <Select value={paymentMethod} onValueChange={setPaymentMethod}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
            <SelectItem value="cash">Cash</SelectItem>
            <SelectItem value="card">Card</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Reference Number (Optional)</Label>
        <Input
          value={referenceNumber}
          onChange={(e) => setReferenceNumber(e.target.value)}
          placeholder="Transaction ID or receipt number"
        />
      </div>

      <div className="space-y-2">
        <Label>Notes (Optional)</Label>
        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add any notes about this payment..."
          rows={2}
        />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-3 py-2 rounded-lg text-sm">
          Payment recorded successfully!
        </div>
      )}

      <Button type="submit" disabled={loading || !amount} className="w-full">
        {loading ? "Recording..." : "Record Payment"}
      </Button>
    </form>
  );
}