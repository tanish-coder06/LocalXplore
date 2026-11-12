import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Rahul Sharma",
    location: "Delhi",
    experience: "Old Delhi Food Walk",
    review:
      "An amazing experience! I discovered food places I had never noticed before. The local guide was extremely knowledgeable.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200"
  },
  {
    name: "Ananya Verma",
    location: "Noida",
    experience: "Heritage Walk",
    review:
      "I loved learning about the history behind the monuments. LocalXplore made my weekend really special.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200"
  },
  {
    name: "Karan Mehta",
    location: "Gurugram",
    experience: "Photography Tour",
    review:
      "A wonderful photography experience. I explored beautiful streets and captured some amazing photographs.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200"
  }
];

function Testimonials() {
  return (
    <section className="py-20 bg-gray-50">

      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center mb-12">

          <p className="text-green-700 font-semibold text-sm tracking-wider">
            CUSTOMER STORIES
          </p>

          <h2 className="text-3xl md:text-4xl font-bold mt-3">
            What Our Travellers Say
          </h2>

          <p className="text-gray-500 mt-3">
            Real experiences create unforgettable memories.
          </p>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-7">

          {testimonials.map((item, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-lg transition"
            >

              <Quote size={30} className="text-green-700" />

              <div className="flex gap-1 mt-5">

                {[...Array(item.rating)].map((_, i) => (
                  <Star
                    key={i}
                    size={17}
                    className="text-orange-400 fill-orange-400"
                  />
                ))}

              </div>

              <p className="text-gray-600 leading-7 mt-5">
                "{item.review}"
              </p>

              <div className="flex items-center gap-4 mt-7 border-t pt-5">

                <img
                  src={item.image}
                  alt={item.name}
                  className="w-12 h-12 rounded-full object-cover"
                />

                <div>
                  <h4 className="font-bold text-gray-900">
                    {item.name}
                  </h4>

                  <p className="text-xs text-gray-500">
                    {item.location} · {item.experience}
                  </p>
                </div>

              </div>

            </div>
          ))}

        </div>

      </div>

    </section>
  );
}

export default Testimonials;