import {
  Utensils,
  Landmark,
  Camera,
  Palette,
  Mountain,
  Music,
  Leaf,
  ShoppingBag,
  Compass
} from "lucide-react";

const categories = [
  { name: "All", icon: Compass },
  { name: "Food & Culinary", icon: Utensils },
  { name: "History & Heritage", icon: Landmark },
  { name: "Photography", icon: Camera },
  { name: "Art & Culture", icon: Palette },
  { name: "Adventure", icon: Mountain },
  { name: "Workshops", icon: Music },
  { name: "Nature", icon: Leaf },
  { name: "Shopping", icon: ShoppingBag }
];

function Categories({ selectedCategory, onSelectCategory }) {

  return (
    <section id="categories" className="py-16 md:py-20 bg-white">

      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20">

        {/* Section Heading */}
        <div className="text-center mb-12">

          <p className="text-green-700 font-bold uppercase tracking-widest text-sm">
            Explore by Interest
          </p>

          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-3">
            Find Experiences You Love
          </h2>

          <p className="text-gray-500 mt-3 text-base md:text-lg">
            Something exciting for every kind of traveller.
          </p>

        </div>

        {/* Categories */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-4">

          {categories.map((category) => {

            const Icon = category.icon;
            const isActive = selectedCategory === category.name;

            return (

              <button
                key={category.name}
                onClick={() => onSelectCategory(category.name)}
                className={`flex flex-col items-center justify-center gap-3 p-5 rounded-2xl border transition-all duration-300 hover:-translate-y-1
                  
                  ${
                    isActive
                      ? "bg-green-50 border-green-600 shadow-md"
                      : "bg-gray-50 border-transparent hover:bg-green-50 hover:border-green-200 hover:shadow-md"
                  }
                `}
              >

                <div
                  className={`p-4 rounded-full transition-all duration-300 ${
                    isActive
                      ? "bg-green-700 text-white"
                      : "bg-white text-green-700 shadow-sm"
                  }`}
                >

                  <Icon size={25} />

                </div>

                <span
                  className={`text-xs sm:text-sm font-semibold text-center ${
                    isActive ? "text-green-800" : "text-gray-700"
                  }`}
                >
                  {category.name === "All" ? "All Experiences" : category.name}
                </span>

              </button>

            );

          })}

        </div>

      </div>

    </section>
  );
}

export default Categories;