import {
  ShieldCheck,
  Users,
  MapPin,
  HeartHandshake
} from "lucide-react";

const benefits = [
  {
    icon: Users,
    title: "Authentic Local Experiences",
    description:
      "Explore cities through experiences created and hosted by passionate local people."
  },
  {
    icon: ShieldCheck,
    title: "Verified Local Guides",
    description:
      "Discover experiences hosted by guides whose profiles are verified by our platform."
  },
  {
    icon: MapPin,
    title: "Discover Hidden Places",
    description:
      "Find interesting places and activities beyond ordinary tourist destinations."
  },
  {
    icon: HeartHandshake,
    title: "Support Local Communities",
    description:
      "Connect with local businesses and help independent experience providers grow."
  }
];

function WhyChoose() {
  return (
    <section className="py-20 bg-green-50">

      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center mb-12">

          <p className="text-green-700 font-semibold text-sm tracking-wider">
            WHY LOCALXPLORE?
          </p>

          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-3">
            Travel Differently. Explore Locally.
          </h2>

          <p className="text-gray-500 mt-3">
            More than sightseeing. Discover the real stories of every place.
          </p>

        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7">

          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;

            return (
              <div
                key={index}
                className="bg-white p-7 rounded-2xl hover:shadow-xl transition duration-300"
              >

                <div className="bg-green-100 w-14 h-14 flex items-center justify-center rounded-2xl">
                  <Icon size={28} className="text-green-700" />
                </div>

                <h3 className="text-lg font-bold mt-6 text-gray-900">
                  {benefit.title}
                </h3>

                <p className="text-gray-500 text-sm leading-7 mt-3">
                  {benefit.description}
                </p>

              </div>
            );
          })}

        </div>

      </div>

    </section>
  );
}

export default WhyChoose;