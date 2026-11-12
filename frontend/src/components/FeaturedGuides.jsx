import { Star, MapPin, BadgeCheck } from "lucide-react";

const guides = [
  {
    name: "Rahul Sharma",
    location: "Old Delhi",
    specialty: "Food & Heritage Expert",
    rating: "4.9",
    experiences: 12,
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400"
  },
  {
    name: "Priya Verma",
    location: "New Delhi",
    specialty: "Photography Guide",
    rating: "4.8",
    experiences: 8,
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400"
  },
  {
    name: "Aman Singh",
    location: "Chandni Chowk",
    specialty: "Cultural Experience Host",
    rating: "4.9",
    experiences: 15,
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400"
  }
];

function FeaturedGuides() {
  return (
    <section id="guides" className="py-20 bg-white">

      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center mb-12">
          <p className="text-green-700 font-semibold tracking-wider text-sm">
            MEET OUR LOCAL EXPERTS
          </p>

          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-3">
            Experiences Hosted by Locals
          </h2>

          <p className="text-gray-500 mt-3 max-w-xl mx-auto">
            Meet passionate local guides who help you discover
            the hidden stories and beautiful places of their cities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {guides.map((guide, index) => (
            <div
              key={index}
              className="bg-gray-50 rounded-2xl p-7 text-center hover:shadow-xl transition duration-300"
            >

              <img
                src={guide.image}
                alt={guide.name}
                className="w-24 h-24 rounded-full object-cover mx-auto border-4 border-white shadow-md"
              />

              <div className="flex items-center justify-center gap-2 mt-4">
                <h3 className="text-xl font-bold text-gray-900">
                  {guide.name}
                </h3>

                <BadgeCheck className="text-green-600" size={20} />
              </div>

              <p className="text-green-700 text-sm font-medium mt-2">
                {guide.specialty}
              </p>

              <p className="flex items-center justify-center gap-1 text-gray-500 text-sm mt-3">
                <MapPin size={15} />
                {guide.location}
              </p>

              <div className="flex justify-center gap-6 mt-5 border-t pt-5">

                <div>
                  <p className="flex items-center gap-1 font-bold justify-center">
                    <Star size={16} className="text-orange-400 fill-orange-400" />
                    {guide.rating}
                  </p>
                  <span className="text-xs text-gray-500">Rating</span>
                </div>

                <div>
                  <p className="font-bold">{guide.experiences}+</p>
                  <span className="text-xs text-gray-500">Experiences</span>
                </div>

              </div>

              <button className="w-full mt-6 border border-green-700 text-green-700 py-3 rounded-xl hover:bg-green-700 hover:text-white transition">
                View Profile
              </button>

            </div>
          ))}

        </div>

      </div>
    </section>
  );
}

export default FeaturedGuides;
