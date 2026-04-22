import React from "react";
import { GraduationCap, MapPin, Mail, Phone } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-400 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <GraduationCap className="h-6 w-6 text-green-500" />
              <span className="text-white font-bold text-lg">LSTC</span>
            </div>
            <p className="text-sm">
              Empowering future professionals through technology and skills
              development.
            </p>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-white transition">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Programs
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Admissions
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Contact
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Contact Info</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4" /> San Pedro, Laguna
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4" /> (+63) 969-254-3204
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4" /> lstcsplofficial@gmail.com
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a
                href="https://www.facebook.com/LSTCMAINPAGE/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition"
              >
                Facebook
              </a>
              <a href="#" className="hover:text-white transition">
                Twitter
              </a>
              <a href="#" className="hover:text-white transition">
                LinkedIn
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-8 text-center text-sm">
          <p>
            &copy; {new Date().getFullYear()} Laguna Science and Technology
            College. All rights reserved.
          </p>

          <p className="text-xs text-gray-400 mt-2">
            Developed by John Rey Cejas
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
