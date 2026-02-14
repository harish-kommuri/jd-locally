"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import LocallySidebar from "../../../components/LocallySidebar";
import AskLocationMessage from "../../../components/messageTypes/AskLocationMessage";
import CompareMessage from "../../../components/messageTypes/CompareMessage";
import ConfirmationMessage from "../../../components/messageTypes/ConfirmationMessage";
import GeoLocateMessage from "../../../components/messageTypes/GeoLocateMessage";
import InfoMessage from "../../../components/messageTypes/InfoMessage";
import ListMessage from "../../../components/messageTypes/ListMessage";
import TextMessage from "../../../components/messageTypes/TextMessage";

const ConfirmationModal = dynamic(
  () => import("../../../components/ConfirmationModal"),
  { ssr: false }
);

const chatMessages = [
  {
    role: "user",
    id: "c1",
    msg: "Hi",
    attachments: []
  },
  {
    role: "system",
    id: "c2",
    msg: "Hi, How can I help you Harish?",
    attachments: []
  },
  {
    role: "user",
    id: "c3",
    msg: "Show me the nearest restuarents"
  },
  {
    role: "system",
    id: "c4",
    msg: "Please allow us to access your location or you can select manually.",
    type: "ask_location"
  },
  {
    role: "user",
    id: "c5",
    msg: "Hyderabad, Telangana",
    type: "address"
  },
  {
    role: "system",
    id: "c6",
    data: [
      {
        id: "r1",
        name: "Spice Avenue",
        ratings: "4.6",
        reviews: "1,248",
        established_on: "2012",
        address: "Hitech City, Hyderabad",
        distance: "1.2 km",
        call: "+91 90000 10001",
        deals: "10% off"
      },
      {
        id: "r2",
        name: "Urban Dine",
        ratings: "4.4",
        reviews: "982",
        established_on: "2015",
        address: "Kondapur, Hyderabad",
        distance: "2.4 km",
        call: "+91 90000 10002",
        deals: "Free dessert"
      },
      {
        id: "r3",
        name: "Bistro 27",
        ratings: "4.7",
        reviews: "1,532",
        established_on: "2010",
        address: "Gachibowli, Hyderabad",
        distance: "3.1 km",
        call: "+91 90000 10003",
        deals: "20% off"
      }
    ],
    type: "list"
  },
  {
    role: "user",
    id: "c7",
    msg: "Compare first and fourth restuarants"
  },
  {
    role: "system",
    id: "c8",
    data: [
      {
        id: "r1",
        name: "Spice Avenue",
        ratings: "4.6",
        reviews: "1,248",
        established_on: "2012",
        address: "Hitech City, Hyderabad",
        distance: "1.2 km",
        price: "₹₹"
      },
      {
        id: "r3",
        name: "Bistro 27",
        ratings: "4.7",
        reviews: "1,532",
        established_on: "2010",
        address: "Gachibowli, Hyderabad",
        distance: "3.1 km",
        price: "₹₹₹"
      }
    ],
    type: "compare"
  },
  {
    role: "user",
    id: "c9",
    msg: "How far is restuarant A from me / Chikkadapalli."
  },
  {
    role: "system",
    id: "c10",
    data: {
      msg: "Restaurant is 2.6KM from Chikkadapalli",
      address: "18/1, 100 feet road, Kammanahalli, Kalyan Nagar, Bangalore - 560043",
      map_link: "http://goo.gl/dcubisid"
    },
    type: "geo_locate"
  },
  {
    role: "user",
    id: "c11",
    msg: "Can you comare the prices of Marriot hotel and Hilton hotels"
  },
  {
    role: "system",
    id: "c12",
    data: [
      {
        msg: "4 Hitlon and 6 Marriot locations found. Please select to compare.",
        list: [
          {
            id: "b1",
            name: "Hilton Garden Inn",
            location: "MG Road, Bengaluru"
          },
          {
            id: "b2",
            name: "Hilton Nagawara",
            location: "Nagawara, Bengaluru"
          },
          {
            id: "b3",
            name: "Marriott MG Road",
            location: "MG Road, Bengaluru"
          },
          {
            id: "b4",
            name: "Marriott Whitefield",
            location: "Whitefield, Bengaluru"
          },
          {
            id: "b5",
            name: "Marriott Hebbal",
            location: "Hebbal, Bengaluru"
          },
          {
            id: "b6",
            name: "Hilton Embassy Golf",
            location: "Domlur, Bengaluru"
          }
        ]
      }
    ],
    type: "confirmation"
  },
  {
    role: "user",
    id: "c13",
    msg: "Marriot in MG road and Hitlon in Manayta, Nagawara"
  },
  {
    role: "system",
    id: "c14",
    data: [
      {
        id: "h1",
        name: "Marriott MG Road",
        ratings: "4.5",
        reviews: "2,410",
        established_on: "2008",
        address: "MG Road, Bengaluru",
        distance: "2.9 km",
        price: "₹₹₹₹"
      },
      {
        id: "h2",
        name: "Hilton Nagawara",
        ratings: "4.4",
        reviews: "1,980",
        established_on: "2014",
        address: "Nagawara, Bengaluru",
        distance: "5.4 km",
        price: "₹₹₹"
      }
    ],
    type: "compare"
  },
  {
    role: "user",
    id: "c15",
    msg: "Tell me more about Google office in Mahadevapura, Bangalore"
  },
  {
    role: "system",
    id: "c16",
    type: "info",
    data: {
      id: "g1",
      name: "Google Office",
      ratings: "4.8",
      reviews: "3,204",
      established_on: "2008",
      address: "Mahadevapura, Bengaluru",
      distance: "6.2 km",
      price: "N/A",
      call: "+91 90000 10111",
      deals: "N/A",
      map_link: "https://maps.google.com"
    }
  }
];

const formatPayload = (message) => {
  if (message.msg) {
    return message.msg;
  }

  if (message.data) {
    return JSON.stringify(message.data, null, 2);
  }

  return "";
};

const messageTitles = {
  ask_location: "Location permission",
  address: "Address",
  list: "Nearby places",
  compare: "Comparison",
  geo_locate: "Distance info",
  confirmation: "Confirmation",
  info: "Business details"
};

export default function LocallyChatPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBusinesses, setSelectedBusinesses] = useState([]);

  const confirmationBusinesses = useMemo(() => {
    const confirmation = chatMessages.find(
      (message) => message.type === "confirmation"
    );

    if (!confirmation || !Array.isArray(confirmation.data)) {
      return [];
    }

    return confirmation.data[0]?.list ?? [];
  }, []);

  const toggleBusiness = (businessId) => {
    setSelectedBusinesses((prev) => {
      if (prev.includes(businessId)) {
        return prev.filter((id) => id !== businessId);
      }

      if (prev.length >= 5) {
        return prev;
      }

      return [...prev, businessId];
    });
  };

  return (
    <section className="min-h-screen bg-white grid grid-cols-1 lg:grid-cols-[320px_1fr]">
      <LocallySidebar />
      <main className="flex w-full flex-col bg-[radial-gradient(circle_at_top,rgba(0,118,215,0.08),transparent_60%)] px-6 sm:px-10">
        <div className="mx-auto w-full max-w-3xl flex-1 space-y-4 py-10">
          {chatMessages.map((message) => {
            const isUser = message.role.toLowerCase() === "user";
            const payload = formatPayload(message);

            return (
              <div
                key={message.id}
                className={`flex ${isUser ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm shadow-sm ${
                    isUser
                      ? "bg-[#0076d7] text-white"
                      : "border border-[#0076d7]/20 bg-white text-slate-900"
                  }`}
                >
                  {message.type && (
                    <p
                      className={`mb-2 text-[11px] uppercase tracking-[0.2em] ${
                        isUser ? "text-white/70" : "text-[#0076d7]"
                      }`}
                    >
                      {messageTitles[message.type] ?? message.type}
                    </p>
                  )}
                  {message.type === "list" && (
                    <ListMessage items={message.data} />
                  )}
                  {message.type === "compare" && (
                    <CompareMessage items={message.data} />
                  )}
                  {message.type === "geo_locate" && (
                    <GeoLocateMessage data={message.data} />
                  )}
                  {message.type === "confirmation" && (
                    <ConfirmationMessage
                      message={message.data?.[0]?.msg}
                      onSelect={() => setIsModalOpen(true)}
                    />
                  )}
                  {message.type === "ask_location" && (
                    <AskLocationMessage message={message.msg} />
                  )}
                  {message.type === "info" && (
                    <InfoMessage data={message.data} />
                  )}
                  {payload &&
                    message.type !== "list" &&
                    message.type !== "compare" &&
                    message.type !== "geo_locate" &&
                    message.type !== "confirmation" &&
                    message.type !== "ask_location" &&
                    message.type !== "info" && <TextMessage text={payload} />}
                  {message.attachments && message.attachments.length > 0 && (
                    <p className="mt-2 text-xs text-white/70">
                      {message.attachments.length} attachment(s)
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        <div className="sticky bottom-0 left-0 right-0 bg-white/90 backdrop-blur">
          <div className="mx-auto w-full max-w-3xl py-4">
            <div className="flex w-full items-center gap-2 rounded-full border border-[#0076d7]/30 bg-white px-4 py-2 shadow-sm">
              <input
                className="flex-1 bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
                placeholder="Search businesses"
                type="text"
              />
              <button
                className="flex h-9 w-9 items-center justify-center rounded-full text-[#0076d7] transition hover:bg-[#0076d7]/10"
                type="button"
                aria-label="Voice search"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  <rect x="9" y="3" width="6" height="11" rx="3" />
                  <path d="M5 11a7 7 0 0 0 14 0" />
                  <path d="M12 18v3" />
                  <path d="M9 21h6" />
                </svg>
              </button>
              <button
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0076d7] text-white transition hover:bg-[#0066bb]"
                type="button"
                aria-label="Search"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  <circle cx="11" cy="11" r="7" />
                  <path d="M20 20l-3.5-3.5" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </main>
      <ConfirmationModal
        isOpen={isModalOpen}
        businesses={confirmationBusinesses}
        selectedBusinesses={selectedBusinesses}
        onToggle={toggleBusiness}
        onClose={() => setIsModalOpen(false)}
      />
    </section>
  );
}
