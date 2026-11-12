import { useState } from "react";

import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Categories from "../components/Categories";
import ExperienceCard from "../components/ExperienceCard";

import FeaturedGuides from "../components/FeaturedGuides";
import WhyChoose from "../components/Whychoose";
import BecomeGuide from "../components/BecomeGuide";
import Testimonials from "../components/Testimonials";
import Footer from "../components/Footer";
import experiences from "../data/experiences";

function Home() {

  // Search State
  const [searchQuery, setSearchQuery] = useState("");

  // Category State
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Filter Experiences
  const filteredExperiences = experiences.filter((experience) => {

    const query = searchQuery.toLowerCase().trim();

    const matchesCategory =
      selectedCategory === "All" ||
      experience.category === selectedCategory;

    const matchesSearch =
      experience.title.toLowerCase().includes(query) ||
      experience.category.toLowerCase().includes(query) ||
      experience.location.toLowerCase().includes(query);

    return matchesCategory && matchesSearch;

  });

  // Clear Filters
  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All");
  };

  return (
    <>

      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <Hero
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Categories */}
      <Categories
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      {/* Popular Experiences */}
      <section
        id="experiences"
        className="py-16 md:py-20 bg-gray-50"
      >

        <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20">

          {/* Section Heading */}
          <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-5 mb-10">

            <div>

              <p className="text-green-700 font-bold text-sm uppercase tracking-widest">
                HANDPICKED FOR YOU
              </p>

              <h2 className="text-3xl md:text-4xl font-bold mt-3 text-gray-900">
                {selectedCategory === "All"
                  ? "Popular Experiences"
                  : selectedCategory}
              </h2>

              <p className="text-gray-500 mt-3">
                Discover unique experiences hosted by local people.
              </p>

            </div>

            <div className="flex items-center gap-3">

              <span className="text-sm text-gray-500">
                {filteredExperiences.length} Experiences Found
              </span>

              {(selectedCategory !== "All" || searchQuery !== "") && (

                <button
                  onClick={clearFilters}
                  className="text-green-700 font-semibold text-sm hover:underline"
                >
                  Clear Filters
                </button>

              )}

            </div>

          </div>

          {/* Experience Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">

            {filteredExperiences.length > 0 ? (

              filteredExperiences.map((experience) => (

                <ExperienceCard
                  key={experience.id}
                  experience={experience}
                />

              ))

            ) : (

              // No Results Found
              <div className="col-span-full text-center py-20 bg-white rounded-2xl border border-gray-100">

                <div className="text-5xl mb-5">
                  🔍
                </div>

                <h3 className="text-2xl font-bold text-gray-800">
                  No Experiences Found
                </h3>

                <p className="text-gray-500 mt-3">
                  We couldn't find any experiences matching your search.
                  Try another keyword or category.
                </p>

                <button
                  onClick={clearFilters}
                  className="mt-6 bg-green-700 hover:bg-green-800 text-white px-7 py-3 rounded-xl font-semibold transition"
                >
                  View All Experiences
                </button>

              </div>

            )}

          </div>

        </div>

      </section>

      {/* Featured Local Guides */}
      <FeaturedGuides />

      {/* Why Choose LocalXplore */}
      <WhyChoose />

      {/* Become a Guide */}
      <BecomeGuide />

      {/* Customer Testimonials */}
      <Testimonials />

      {/* Footer */}
      <Footer />

    </>
  );
}

export default Home;