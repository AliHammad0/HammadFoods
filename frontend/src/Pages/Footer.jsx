
import React from 'react'
import {
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaTiktok,
  FaWhatsapp,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaClock
} from 'react-icons/fa'

const Footer = () => {
  const socialLinks = [
    {
      name: 'Facebook',
      icon: <FaFacebookF />,
      url: 'ABC'
    },
    {
      name: 'Instagram',
      icon: <FaInstagram />,
      url: 'https://www.instagram.com/ABC'
    },
    {
      name: 'YouTube',
      icon: <FaYoutube />,
      url: 'ABC'
    },
    {
      name: 'TikTok',
      icon: <FaTiktok />,
      url: 'https://www.tiktok.com/ABC'
    }
  ]

  const policies = [
    { name: 'Terms & Conditions', url: 'ABCterms-and-conditions' },
    { name: 'Privacy Policy', url: 'ABCprivacy-policy' },
    { name: 'Delivery Policy', url: 'ABCdelivery-policy' },
    { name: 'Refund Policy', url: 'ABCrefund-policy' }
  ]

  return (
    <footer className="bg-[#111111] text-white font-[Arial]">
      <div className="max-w-7xl mx-auto px-6 md:px-10 pt-16 pb-10">

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* Brand */}
          <div>
            <h2 className="text-3xl font-extrabold tracking-wide">
              HAMMAD <span className="text-[#d9a441]">FOODS</span>
            </h2>

            <div className="w-14 h-1 bg-[#d9a441] mt-4 mb-5" />

            <p className="text-gray-400 text-sm leading-7 max-w-xs">
              Bringing people together through great food, quality ingredients
              and unforgettable taste. Discover the Al Kaif Pizza experience
              with Hammad Foods.
            </p>

            <a
              href="ABC"
              target="_blank"
              rel="noreferrer"
              className="inline-block mt-5 text-[#d9a441] text-sm font-semibold hover:text-white transition"
            >
              Visit Hammad Foods
            </a>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-6">Quick Links</h3>

            <ul className="space-y-4 text-sm text-gray-400">
              <li>
                <a href="/" className="hover:text-[#d9a441] transition">
                  Home
                </a>
              </li>
              <li>
                <a href="/menu" className="hover:text-[#d9a441] transition">
                  Our Menu
                </a>
              </li>
              <li>
                <a href="" className="hover:text-[#d9a441] transition">
                  Hammad Foods
                </a>
              </li>
              <li>
                <a href="/contact" className="hover:text-[#d9a441] transition">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-bold mb-6">Contact Us</h3>

            <ul className="space-y-5 text-sm text-gray-400">
              <li className="flex items-start gap-3">
                <FaMapMarkerAlt className="text-[#d9a441] mt-1 shrink-0" />
                <span>
                  ABC
                </span>
              </li>

              <li className="flex items-center gap-3">
                <FaPhoneAlt className="text-[#d9a441] shrink-0" />
                <a href="tel:ABC" className="hover:text-[#d9a441] transition">
                 ABC
                </a>
              </li>

              <li className="flex items-center gap-3">
                <FaWhatsapp className="text-[#d9a441] shrink-0" />
                <a href="https://wa.me/ABC" target="_blank" rel="noreferrer" className="hover:text-[#d9a441] transition">
                  ABC
                </a>
              </li>

              <li className="flex items-center gap-3">
                <FaEnvelope className="text-[#d9a441] shrink-0" />
                <a href="mailto:ABC" className="hover:text-[#d9a441] transition">
                  ABC
                </a>
              </li>
            </ul>
          </div>

          {/* Timings & Social */}
          <div>
            <h3 className="text-lg font-bold mb-6">Opening Hours</h3>

            <div className="flex items-start gap-3 text-sm text-gray-400">
              <FaClock className="text-[#d9a441] mt-1 shrink-0" />
              <div>
                <p className="text-white font-semibold">Monday - Sunday</p>
                <p className="mt-2">12:00 PM - 02:30 AM</p>
              </div>
            </div>

            <h3 className="text-lg font-bold mt-8 mb-5">Follow Us</h3>

            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={social.name}
                  className="w-10 h-10 rounded-full border border-gray-700 flex items-center justify-center text-gray-300 hover:bg-[#d9a441] hover:text-black hover:border-[#d9a441] transition duration-300"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Policies */}
        <div className="border-t border-gray-800 mt-14 pt-8">
          <div className="flex flex-wrap justify-center gap-x-7 gap-y-4 text-xs text-gray-400">
            {policies.map((policy) => (
              <a
                key={policy.name}
                href={policy.url}
                target="_blank"
                rel="ABC"
                className="hover:text-[#d9a441] transition"
              >
                {policy.name}
              </a>
            ))}
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-8 pt-7 flex flex-col md:flex-row justify-between items-center gap-4 text-center">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} Hammad Foods. All Rights Reserved.
          </p>

          <p className="text-xs text-gray-500">
            Made with <span className="text-[#d9a441]">♥</span> for food lovers.
          </p>
        </div>

      </div>
    </footer>
  )
}

export default Footer