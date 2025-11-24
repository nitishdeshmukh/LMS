import { Megaphone, TrendingUp, Users, Gift, Trophy, Star, Zap, GiftIcon } from 'lucide-react';
import React from 'react';

function CampusAmbassador() {
  const items = [
    {
      icon: <Gift size={37} className=" text-white" />,
      bg: 'bg-pink-600',
      title: 'Exclusive Swag',
      desc: 'Get official LMS Portal T-shirts, hoodies, and tech accessories sent to your doorstep.',
    },
    {
      icon: <Trophy size={37} className=" text-white" />,
      bg: 'bg-yellow-500',
      title: 'Cash Rewards',
      desc: 'Earn up to ₹15,000/month based on your performance and referrals.',
    },
    {
      icon: <Star size={37} className=" text-white" />,
      bg: 'bg-blue-500',
      title: 'Leadership Certificate',
      desc: 'A verified Letter of Recommendation and Certificate of Leadership for your resume.',
    },
    {
      icon: <Zap size={37} className=" text-white" />,
      bg: 'bg-green-500',
      title: 'Free Courses',
      desc: 'Unlock premium modules and tech streams worth ₹20,000 absolutely free.',
    },
  ];
  return (
    <>
      <section className="pt-32 pb-14 px-[5vw] sm:px-[20vw] border-b border-gray-800  ">
        <div className="items-center flex flex-col text-center gap-6 ">
          <span className=" p-2 bg-gray-800 text-blue-500 rounded-full border border-white/10  ">
            {' '}
            Join Top 1% student Leader
          </span>
          <h1 className="text-4xl md:text-7xl  font-extrabold text-center ">
            {' '}
            Be the{' '}
            <span className=" bg-clip-text text-transparent bg-linear-to-r from-blue-400 to-red-400">
              {' '}
              Campus CEO{' '}
            </span>{' '}
            <br /> of your college{' '}
          </h1>
          <p className="text-xl text-gray-400">
            {' '}
            Lead a tech revolution. Gain real-world leadership experience, earn exciting rewards and
            build a powerfull network before you even graduate.{' '}
          </p>
          <button className="px-8 py-4 rounded-full bg-white text-black hover:bg-gray-200 transition-all ease-in duration-200  font-bold text-lg">
            Apply for Ambassador Program
          </button>
        </div>
      </section>
      <section className="py-10 px-[10vw] ">
        <div className="flex flex-col items-center gap-5 mb-12  ">
          <h3 className="text-4xl font-bold ">What will you Do?</h3>
          <p className="text-gray-400 text-lg">
            Its not just a title. Its Responsibility That shape's you.
          </p>
        </div>
        <div className="sm:grid-cols-3 grid gap-8 ">
          <div className="bg-[#111] border border-white/10 flex flex-col  gap-5 items-start shadow-lg hover:bg-[#151515] transition p-7 rounded-xl  ">
            <div className="mb-4 bg-black w-14 h-14 rounded-xl flex items-center justify-center text-blue-400 ">
              {' '}
              <Megaphone size={30} className="text-5xl" />{' '}
            </div>
            <h3 className="text-2xl font-bold "> Spread the word</h3>
            <p className=" text-lg text-gray-400 mt-4 ">
              Be the voice of LMS portal in your campus. Share our visions and programs
            </p>
          </div>
          <div className="bg-[#111] border border-white/10 flex flex-col  gap-5 items-start shadow-lg hover:bg-[#151515] transition p-7 rounded-xl ">
            <div className="mb-4 bg-black w-14 h-14 rounded-xl flex items-center justify-center text-blue-400 ">
              {' '}
              <Users size={30} className="text-5xl" />{' '}
            </div>
            <h3 className="text-2xl font-bold "> Build Community</h3>
            <p className=" text-lg text-gray-400 mt-4 ">
              Create and lead a tech community in your college. Host meetups and workshops.{' '}
            </p>
          </div>
          <div className="bg-[#111] border border-white/10 flex flex-col  gap-5 items-start shadow-lg hover:bg-[#151515] transition p-7 rounded-xl ">
            <div className="mb-4 bg-black w-14 h-14 rounded-xl flex items-center justify-center text-blue-400 ">
              {' '}
              <TrendingUp size={30} className="text-5xl" />{' '}
            </div>
            <h3 className="text-2xl font-bold "> Drive Growth </h3>
            <p className=" text-lg text-gray-400 mt-4 ">
              Helps students enroll in courses that matters. Guide them towards the right career
              path.{' '}
            </p>
          </div>
        </div>
      </section>
      <section className="py-16 bg-black">
        <div className="text-center mb-12 ">
          <h2 className="text-5xl font-bold ">
            Unlocking <span className="text-blue-400"> Mega Rewards </span>{' '}
          </h2>
          <p className="text-lg text-gray-400 mt-5 ">
            We value your effort. Our top ambassador walk away with gadgets, cash and
            career-defining opportunities.
          </p>
        </div>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 px-4">
          {items.map((item, index) => (
            <div
              key={index}
              className="bg-[#111] border border-white/10 p-8 rounded-2xl flex flex-col  gap-5 items-start shadow-lg hover:bg-[#151515] transition"
            >
              <div
                className={`p-4 rounded-full text-2xl  ${item.bg} flex items-center justify-center`}
              >
                {item.icon}
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-gray-300 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="px-[10vw]">
        <div className="bg-linear-to-r from-blue-500 flex justify-between rounded-2xl px-16  py-14 to-purple-500">
          <div className="flex flex-col gap-3">
            <h2 className="text-4xl font-bold ">Top Performer Rewards</h2>
            <p className="text-lg text-gray-200">
              The best CA of the season wins a brand new iphone or PS5
            </p>
            <button className="bg-white h-12 w-fit px-5 rounded-full mt-4 text-blue-800 text-xl font-bold">
              View Leaderboard
            </button>
          </div>
          <div className="backdrop-blur-md w-[20vw] transform rotate-6 origin-right h-[10vw] items-center justify-center border border-white/10 flex flex-col  gap-5  shadow-lg transition p-7 rounded-xl">
            <GiftIcon size={70} className="text-white" />
          </div>
        </div>
      </div>

      <div className="text-center py-14 space-y-5 ">
        <h3 className="text-5xl font-extrabold">Ready To Lead?</h3>
        <p className="text-xl text-gray-400">
          {' '}
          Application are closing soon. Don't miss the chance to be the face of innovation at your
          campus{' '}
        </p>
        <button className="py-4 px-7 text-xl bg-blue-500 rounded-full font-bold  ">
          Apply Now
        </button>
      </div>
    </>
  );
}

export default CampusAmbassador;
