import { Icon } from "./Icon";
import { Reveal } from "./Reveal";

const items = [
  {
    icon: "star",
    title: "Famous brand names",
    body: "Bulk offerings of the best labels from famous and specialty stores — the brands your buyers already search for.",
  },
  {
    icon: "shield",
    title: "100% inspection",
    body: "NEJ performs a quality-control inspection on all goods we offer, so you maximize recovery value on every lot.",
  },
  {
    icon: "shuffle",
    title: "Various lot types",
    body: "Fully manifested, partially manifested, and unmanifested pallets across every category — by the pallet or the truckload.",
  },
  {
    icon: "truck",
    title: "Freight handled for you",
    body: "Live LTL rates at checkout through our ShipHawk carrier network, or pick up free from our Beacon Falls, CT dock.",
  },
];

export function ValueProps() {
  return (
    <section className="border-b border-ink-100 bg-white py-14">
      <div className="container">
        <Reveal>
          <p className="eyebrow">Why resellers choose us</p>
          <h2 className="mt-2 max-w-2xl text-balance text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl">
            Inventory that&rsquo;s inspected, graded, and ready to resell.
          </h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {items.map((item) => (
              <div key={item.title} className="card p-6 transition duration-300 hover:-translate-y-1 hover:shadow-pop">
                <span className="grid h-10 w-10 place-items-center rounded-lg bg-brand-50 text-brand-700">
                  <Icon name={item.icon} />
                </span>
                <h3 className="mt-4 text-base font-bold text-ink-900">{item.title}</h3>
                <p className="mt-2 text-sm text-ink-600">{item.body}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
