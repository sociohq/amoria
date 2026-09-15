"use client";

import { useEffect, useState } from "react";
import { listContactSubmissionsAdmin, deleteContactSubmission } from "@/lib/admin";
import { ContactSubmission } from "@/lib/types";
import { ApiError } from "@/lib/api";
import { PageHeader, Card, Button, Table, TableHead } from "@/components/admin/ui";

export default function AdminContactPage() {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  function refresh() {
    listContactSubmissionsAdmin()
      .then(({ submissions }) => setSubmissions(submissions))
      .catch(() => setError("Could not load contact submissions"))
      .finally(() => setLoading(false));
  }

  useEffect(refresh, []);

  async function handleDelete(id: string) {
    if (!confirm("Delete this submission?")) return;
    try {
      await deleteContactSubmission(id);
      refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not delete submission");
    }
  }

  return (
    <div>
      <PageHeader
        title="Contact"
        description="Messages submitted through the storefront's Contact Us page."
      />

      {error && <p className="mb-4 text-sm text-crimson">{error}</p>}

      <Card>
        <Table>
          <TableHead>
            <tr>
              <th>From</th>
              <th>Subject</th>
              <th>Message</th>
              <th>Received</th>
              <th />
            </tr>
          </TableHead>
          <tbody className="divide-y divide-border">
            {submissions.map((s) => (
              <tr key={s.id} className="align-top">
                <td className="max-w-[200px] text-ink">
                  <p>{s.name}</p>
                  <a href={`mailto:${s.email}`} className="block text-xs text-ink-soft hover:text-royal">
                    {s.email}
                  </a>
                  {s.phone && <p className="text-xs text-ink-soft">{s.phone}</p>}
                </td>
                <td className="max-w-[160px] text-ink-soft">{s.subject || "—"}</td>
                <td className="max-w-[360px] whitespace-pre-wrap text-ink-soft">{s.message}</td>
                <td className="whitespace-nowrap text-ink-soft">
                  {new Date(s.createdAt).toLocaleString("en-AE", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </td>
                <td className="text-right">
                  <Button variant="danger" size="sm" onClick={() => handleDelete(s.id)}>
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
            {!loading && submissions.length === 0 && (
              <tr>
                <td colSpan={5} className="py-10 text-center text-ink-soft">
                  No messages yet.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </Card>
    </div>
  );
}
