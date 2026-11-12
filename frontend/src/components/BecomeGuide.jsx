import { ArrowRight, Users, Camera, IndianRupee } from "lucide-react";

function BecomeGuide() {
  return (
    <section className="py-20 bg-white">

      <div className="max-w-7xl mx-auto px-6">

        <div className="bg-green-800 rounded-3xl overflow-hidden grid grid-cols-1 lg:grid-cols-2">

          <div className="p-9 md:p-14 text-white">

            <span className="bg-orange-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
              Become a Local Guide
            </span>

            <h2 className="text-3xl md:text-4xl font-bold mt-7 leading-tight">
              Turn Your Passion for Your City Into Unique Experiences
            </h2>

            <p className="text-green-100 mt-5 leading-7">
              Are you passionate about food, photography, culture or
              adventure? Share your knowledge with travellers and
              create memorable local experiences.
            </p>

            <div className="grid grid-cols-2 gap-5 mt-8">

              <div className="flex items-center gap-3">
                <Users className="text-orange-400" size={25} />
                <span className="text-sm">Meet New People</span>
              </div>

              <div className="flex items-center gap-3">
                <Camera className="text-orange-400" size={25} />
                <span className="text-sm">Share Your Passion</span>
              </div>

              <div className="flex items-center gap-3">
                <IndianRupee className="text-orange-400" size={25} />
                <span className="text-sm">Earn Through Experiences</span>
              </div>

            </div>

            <button className="mt-9 bg-orange-500 hover:bg-orange-600 text-white px-7 py-4 rounded-xl font-semibold flex items-center gap-3 transition">
              Register as a Guide
              <ArrowRight size={20} />
            </button>

          </div>

          <div className="min-h-[350px]">

            <img
              src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1000"
              alt="People enjoying a local experience"
              className="w-full h-full object-cover"
            />

          </div>

        </div>

      </div>

    </section>
  );
}

export default BecomeGuide;