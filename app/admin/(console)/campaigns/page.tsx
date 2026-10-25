import { CustomerCampaign } from "@/components/admin/CustomerCampaign";
import { formatDateTime } from "@/lib/admin/format";
import { listCampaigns } from "@/lib/store/campaigns";
import { listCustomers } from "@/lib/store/customers";

export default async function CampaignsPage() {
  const [customers, campaigns] = await Promise.all([listCustomers(), listCampaigns()]);
  const services = [...new Set(customers.flatMap((customer) => customer.services))].sort();

  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="font-display text-[1.7rem] font-semibold text-navy">Campaigns</h1>
      <p className="mt-2 text-body">
        Choose a service, select customers, and send an offer or discount.
      </p>
      <div className="mt-6">
        <CustomerCampaign
          services={services}
          customers={customers.map((customer) => ({
            id: customer.id,
            fullName: customer.fullName,
            email: customer.email,
            phone: customer.phone,
            company: customer.company,
            services: customer.services,
            locations: customer.locations,
            enquiryCount: customer.enquiryCount,
            marketing: customer.marketing,
          }))}
        />
      </div>
      <section className="mt-8">
        <h2 className="font-display text-xl font-semibold text-navy">Offers sent</h2>
        {campaigns.length === 0 ? (
          <p className="mt-3 rounded-[6px] border border-line bg-white px-5 py-8 text-body">
            No campaigns sent yet.
          </p>
        ) : (
          <div className="mt-3 overflow-x-auto rounded-[6px] border border-line bg-white">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="border-b border-line bg-surface text-xs font-semibold tracking-[0.08em] text-muted uppercase">
                <tr>
                  <th className="w-12 px-3 py-3">#</th>
                  <th className="px-3 py-3">Subject</th>
                  <th className="px-3 py-3">Offer</th>
                  <th className="px-3 py-3">Sent</th>
                  <th className="px-3 py-3">Failed</th>
                  <th className="px-3 py-3">Skipped</th>
                  <th className="px-3 py-3">When</th>
                </tr>
              </thead>
              <tbody>
                {campaigns.map((campaign, index) => (
                  <tr key={campaign.id} className="border-b border-line last:border-b-0">
                    <td className="px-3 py-3 font-semibold text-navy tabular-nums">
                      {index + 1}
                    </td>
                    <td className="px-3 py-3 font-semibold text-navy">{campaign.subject}</td>
                    <td className="px-3 py-3 text-muted">{campaign.offer || "—"}</td>
                    <td className="px-3 py-3 tabular-nums">{campaign.sent}</td>
                    <td className="px-3 py-3 tabular-nums">{campaign.failed}</td>
                    <td className="px-3 py-3 tabular-nums">{campaign.skipped}</td>
                    <td className="px-3 py-3 whitespace-nowrap text-muted">{formatDateTime(campaign.at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
