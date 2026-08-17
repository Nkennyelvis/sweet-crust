import { updateReservationStatus } from "@/app/admin/actions";
import { StatusSelect } from "@/components/admin/StatusSelect";
import { Badge, Card, EmptyState } from "@/components/ui";
import { whatsappLink } from "@/lib/bakery-info";
import { formatRwf } from "@/lib/currency";
import { IS_DEMO } from "@/lib/demo";
import {
  OPEN_RESERVATION_STATUSES,
  RESERVATION_STATUSES,
  RESERVATION_STATUS_LABELS,
  type ReservationStatus,
} from "@/lib/enums";
import { formatDate, formatDateTime } from "@/lib/format";
import { getReservations, reservationWhatsAppMessage } from "@/lib/reservations";
import { todayUtc } from "@/lib/validation";

function toneFor(status: string) {
  if (status === "CANCELLED") return "danger" as const;
  if (status === "COLLECTED") return "success" as const;
  if (status === "READY") return "gold" as const;
  return "wine" as const;
}

export default async function AdminReservationsPage() {
  const reservations = await getReservations();
  const open = reservations.filter((r) => OPEN_RESERVATION_STATUSES.includes(r.status as ReservationStatus));

  // UTC boundaries, matching how requestedDate is stored.
  const today = todayUtc();
  const tomorrow = new Date(today);
  tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
  const dueToday = open.filter((r) => r.requestedDate >= today && r.requestedDate < tomorrow).length;
  const overdue = open.filter((r) => r.requestedDate < today).length;

  return (
    <>
      <h1 className="font-display text-4xl text-ink-900">Reservations</h1>
      <p className="mt-1 text-sm text-ink-700">
        {reservations.length} total · {open.length} still open
        {dueToday > 0 && ` · ${dueToday} due today`}
        {overdue > 0 && ` · ${overdue} past their date`}
      </p>

      {overdue > 0 && (
        <Card className="mt-6 border-amber-500/30 bg-amber-500/5 p-5">
          <p className="text-sm text-ink-900">
            <strong>{overdue}</strong>{" "}
            {overdue === 1 ? "reservation is" : "reservations are"} past the date the customer asked for
            and still open. Chase or close them.
          </p>
        </Card>
      )}

      <div className="mt-8 space-y-5">
        {reservations.length === 0 ? (
          <EmptyState
            title="No reservations yet"
            body="When someone reserves a sold-out item, or asks for something on a particular day, it lands here."
          />
        ) : (
          reservations.map((r) => {
            const isOverdue =
              r.requestedDate < today && OPEN_RESERVATION_STATUSES.includes(r.status as ReservationStatus);
            return (
              <Card key={r.id} className={r.status === "COLLECTED" || r.status === "CANCELLED" ? "p-7 opacity-70" : "p-7"}>
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h2 className="font-display text-2xl text-ink-900">
                      {r.quantity} × {r.productNameSnapshot}
                      {r.variantName && <span className="text-ink-700"> · {r.variantName}</span>}
                    </h2>
                    <p className="mt-1 text-sm text-ink-700">
                      {r.reference} · asked {formatDateTime(r.createdAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    {isOverdue && <Badge tone="danger">Past date</Badge>}
                    <Badge tone={toneFor(r.status)}>
                      {RESERVATION_STATUS_LABELS[r.status as ReservationStatus] ?? r.status}
                    </Badge>
                    <StatusSelect
                      action={IS_DEMO ? undefined : updateReservationStatus}
                      idName="reservationId"
                      idValue={r.id}
                      current={r.status}
                      options={RESERVATION_STATUSES.map((s) => ({
                        value: s,
                        label: RESERVATION_STATUS_LABELS[s],
                      }))}
                    />
                  </div>
                </div>

                <dl className="mt-5 grid gap-4 text-sm sm:grid-cols-2 lg:grid-cols-4">
                  <Detail label="Wanted for">
                    {formatDate(r.requestedDate)}
                    {r.timeWindow && <span className="block text-xs text-ink-700">{r.timeWindow}</span>}
                  </Detail>
                  <Detail label="Customer">{r.customerName}</Detail>
                  <Detail label="Phone">
                    <a href={`tel:${r.customerPhone}`} className="text-accent hover:underline">
                      {r.customerPhone}
                    </a>
                  </Detail>
                  <Detail label="Price when asked">
                    {r.priceRwfAtRequest ? formatRwf(r.priceRwfAtRequest * r.quantity) : "—"}
                  </Detail>
                </dl>

                {r.notes && (
                  <div className="mt-5 rounded-xl bg-blush-100 px-5 py-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-accent">Their notes</p>
                    <p className="mt-1.5 whitespace-pre-wrap text-sm leading-relaxed text-ink-900">
                      {r.notes}
                    </p>
                  </div>
                )}

                <a
                  href={whatsappLink(reservationWhatsAppMessage(r))}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-5 py-2.5 text-sm font-semibold text-[#0a2e1f]"
                >
                  Message the customer
                </a>
              </Card>
            );
          })
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
