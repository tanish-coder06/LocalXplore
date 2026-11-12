import { Search, MapPin } from "lucide-react";

function Hero({ searchQuery, setSearchQuery }) {

  const handleSearch = (e) => {
    e.preventDefault();

    document.getElementById("experiences")?.scrollIntoView({
      behavior: "smooth"
    });
  };

  return (
    <section
      className="relative min-h-[620px] lg:min-h-[680px] flex items-center bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1477587458883-47145ed94245?w=1800')"
      }}
    >

      {/* Background Overlay */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20 py-20 text-white">

        <div className="max-w-3xl">

          {/* Badge */}
          <span className="inline-block bg-orange-500 px-5 py-2 rounded-full text-sm font-semibold shadow-lg">
            Discover Experiences Beyond Tourism
          </span>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mt-7 leading-[1.15] tracking-tight">
            Discover Hidden Places & Unique Local Experiences
          </h1>

          {/* Description */}
          <p className="text-lg md:text-xl mt-6 max-w-2xl text-gray-200 leading-relaxed">
            Explore your city like never before. Discover food walks,
            heritage tours, photography adventures and experiences
            hosted by local people.
          </p>

          {/* Search Bar */}
          <form
            onSubmit={handleSearch}
            className="bg-white rounded-2xl p-2 mt-9 max-w-3xl shadow-2xl flex flex-col sm:flex-row gap-2"
          >

            <div className="flex items-center gap-3 flex-1 px-4">

              <MapPin className="text-green-700 shrink-0" size={22} />

              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search food walks, photography, locations..."
                className="w-full outline-none text-gray-800 py-4 text-base"
              />

            </div>

            <button
              type="submit"
              className="bg-green-700 hover:bg-green-800 text-white px-9 py-4 rounded-xl flex items-center justify-center gap-2 font-semibold transition duration-300"
            >

              <Search size={20} />

              Search

            </button>

          </form>

          {/* Popular Searches */}
          <p className="mt-6 text-sm md:text-base text-gray-200">
            <span className="font-semibold text-white">Popular:</span>
            {" "}Delhi Food Walks · Heritage Tours · Photography
          </p>

        </div>

      </div>

    </section>
  );
}

export default Hero;