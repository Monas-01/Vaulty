"use client";

import { IconTrash } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { deleteProductAction } from "@/lib/actions/products";
import { Button } from "@/components/ui/button";

interface ProductDeleteButtonProps {
  id: string;
  name: string;
}

export function ProductDeleteButton({ id, name }: ProductDeleteButtonProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteProductAction(id);
      toast.success(`"${name}" deleted successfully`);
      router.push("/dashboard/products");
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error(
        error instanceof Error ? error.message : "Failed to delete product",
      );
    } finally {
      setIsDeleting(false);
      setShowConfirm(false);
    }
  };

  if (showConfirm) {
    return (
      <div className="flex items-center gap-sm">
        <span className="text-body-sm text-status-expired font-medium">
          Are you sure?
        </span>
        <Button
          variant="tertiary"
          onClick={() => setShowConfirm(false)}
          disabled={isDeleting}
          className="py-xs px-md text-body-sm"
        >
          Cancel
        </Button>
        <button
          type="button"
          onClick={handleDelete}
          disabled={isDeleting}
          className="rounded-xl bg-status-expired px-md py-xs text-canvas text-body-sm font-semibold hover:opacity-90 transition-opacity cursor-pointer"
        >
          {isDeleting ? "Deleting..." : "Confirm Delete"}
        </button>
      </div>
    );
  }

  return (
    <Button
      variant="tertiary"
      onClick={() => setShowConfirm(true)}
      className="text-status-expired hover:bg-status-expired-pale hover:border-status-expired"
    >
      <IconTrash size={18} stroke={2} aria-hidden="true" />
      Delete
    </Button>
  );
}
