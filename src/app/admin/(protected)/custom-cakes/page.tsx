import { updateRequestStatus } from "@/app/admin/actions";
import { StatusSelect } from "@/components/admin/StatusSelect";
import { Badge, Card, EmptyState } from "@/components/ui";
import { whatsappLink } from "@/lib/bakery-info";
import { formatRwf } from "@/lib/currency";
import { REQUEST_STATUSES, REQUEST_STATUS_LABELS, type RequestStatus } from "@/lib/enums";
import { formatDate, formatDateTime } from "@/lib/format";
import { prisma } from "@/lib/prisma";

export default async function AdminCustomCakesPage() {
  const requests = await prisma.customCakeRequest.findMany({ orderBy: { createdAt: "desc" } });
  const newCount = requests.filter((r) => r.status === "NEW").length;

  return (
    <>
      <h1 className="font-display text-4xl text-ink-900">Custom cake requests</h1>
      <p className="mt-1 text-sm text-ink-700">
        {requests.length} total{newCount > 0 && ` · ${newCount} awaiting a first reply`}
      </p>

      <div className="mt-8 space-y-5">
        {requests.length === 0 ? (
          <EmptyState
            title="No requests yet"
            body="Enquiries from the Custom Cakes page land here."
          />
        ) : (
          requests.map((request) => (
            <Card key={request.id} className="p-7">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 className="font-display text-2xl text-ink-900">
                    {request.occasion} — {request.name}
                  </h2>
                  <p className="mt-1 text-xs text-ink-700">Sent {formatDateTime(request.createdAt)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge tone={request.status === "NEW" ? "wine" : request.status === "CLOSED" ? "neutral" : "gold"}>
                    {REQUEST_STATUS_LABELS[request.status as RequestStatus] ?? request.status}
                  </Badge>
                  <StatusSelect
                    action={updateRequestStatus}
                    idName="requestId"
                    idValue={request.id}
                    current={request.status}
                    options={REQUEST_STATUSES.map((s) => ({ value: s, label: REQUEST_STATUS_LABELS[s] }))}
                  />
                </div>
              </div>

              <dl className="mt-5 grid gap-4 text-sm sm:grid-cols-2 lg:grid-cols-4">
                <Detail label="Phone">
                  <a href={`tel:${request.phone}`} className="text-accent hover:underline">
                    {request.phone}
                  </a>
                </Detail>
                {request.email && (
                  <Detail label="Email">
                    <a href={`mailto:${request.email}`} className="text-accent hover:underline">
                      {request.email}
                    </a>
                  </Detail>
                )}
                <Detail label="Date needed">
                  {request.eventDate ? formatDate(request.eventDate) : "Not given"}
                </Detail>
                <Detail label="Servings">{request.servings ?? "Not given"}</Detail>
                <Detail label="Flavour">{request.flavour ?? "Open to ideas"}</Detail>
                <Detail label="Budget">
                  {request.budgetRwf ? formatRwf(request.budgetRwf) : "Not given"}
                </Detail>
              </dl>

              <div className="mt-5 rounded-xl bg-cream-100 px-5 py-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-ink-700">What they want</p>
                <p className="mt-1.5 whitespace-pre-wrap text-sm leading-relaxed text-ink-900">
                  {request.description}
                </p>
              </div>

              <a
                href={whatsappLink(
                  `Hello ${request.name}, this is Sweet Crust about your ${request.occasion.toLowerCase()} cake enquiry.`,
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-5 py-2.5 text-sm font-semibold text-[#0a2e1f]"
              >
                Reply on WhatsApp
              </a>
            </Card>
          ))
        )}
      </div>
    </>
  );
}

function Detail({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wider text-ink-700">{label}</dt>
      <dd className="mt-1 text-ink-900">{children}</dd>
    </div>
  );
}
