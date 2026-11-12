import {
  MapPin,
  Globe,
  Camera,
  Mail
} from "lucide-react";

function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-300 pt-16 pb-7">

      <div className="max-w-7xl mx-auto px-6">

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* Brand */}
          <div>

            <h2 className="text-3xl font-bold text-white flex items-center gap-2">
              <MapPin className="text-orange-500" />
              Local<span className="text-orange-500">X</span>plore
            </h2>

            <p className="text-gray-400 text-sm leading-7 mt-5">
              Discover unique local experiences, connect with
              passionate local guides and explore cities differently.
            </p>

            <div className="flex gap-5 mt-6">

              <Globe
                size={20}
                className="hover:text-orange-400 cursor-pointer"
              />

              <Camera
                size={20}
                className="hover:text-orange-400 cursor-pointer"
              />

              <Mail
                size={20}
                className="hover:text-orange-400 cursor-pointer"
              />

            </div>

          </div>

          {/* Explore */}
          <div>

            <h3 className="text-white font-bold text-lg mb-6">
              Explore
            </h3>

            <ul className="space-y-4 text-sm">
              <li><a href="#experiences" className="hover:text-orange-400">Popular Experiences</a></li>
              <li><a href="#categories" className="hover:text-orange-400">Categories</a></li>
              <li><a href="#guides" className="hover:text-orange-400">Local Guides</a></li>
              <li><a href="#experiences" className="hover:text-orange-400">Destinations</a></li>
            </ul>

          </div>

          {/* Company */}
          <div>

            <h3 className="text-white font-bold text-lg mb-6">
              Company
            </h3>

            <ul className="space-y-4 text-sm">
              <li><a href="#" className="hover:text-orange-400">About Us</a></li>
              <li><a href="#" className="hover:text-orange-400">Contact Us</a></li>
              <li><a href="#guides" className="hover:text-orange-400">Become a Guide</a></li>
              <li><a href="#" className="hover:text-orange-400">Privacy Policy</a></li>
            </ul>

          </div>

          {/* Contact */}
          <div>

            <h3 className="text-white font-bold text-lg mb-6">
              Get in Touch
            </h3>

            <p className="text-sm text-gray-400 leading-7">
              Have questions or suggestions?
              <br />
              We'd love to hear from you.
            </p>

            <p className="text-sm text-orange-400 mt-5">
              support@localxplore.com
            </p>

          </div>

        </div>

        <div className="border-t border-gray-800 mt-14 pt-7 text-center text-sm text-gray-500">

          © {new Date().getFullYear()} LocalXplore. All rights reserved.

          <p className="mt-2">
            Discover More. Explore Locally.
          </p>

        </div>

      </div>

    </footer>
  );
}

export default Footer;