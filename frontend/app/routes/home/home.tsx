
import {Button, Card, Carousel} from "flowbite-react";
import {useLocation} from "react-router";
import {useEffect} from "react";
import {
    FaBullseye,
    FaCameraRetro,
    FaGlassCheers,
    FaGlobeAmericas,
    FaLightbulb,
    FaListAlt,
    FaMedal,
    FaMountain,
    FaUsers
} from "react-icons/fa";
import type {Route} from "../../../.react-router/types/app/routes/home/+types/home";


export function meta({}: Route.MetaArgs) {
    return [
        { title: "Bucket List" },
        { name: "description", content: "Welcome to React Router!" },
    ];
}
const features = [
    {
        icon: <FaListAlt className="w-10 h-10 text-indigo-600 mx-auto mb-3" />,
        title: "My Bucket List",
        description: "Add, organize, and track your goals easily.",
    },
    {
        icon: <FaBullseye className="w-10 h-10 text-indigo-600 mx-auto mb-3" />,
        title: "In Progress",
        description: "Mark milestones and stay motivated as you move forward.",
    },
    {
        icon: <FaGlassCheers className="w-10 h-10 text-indigo-600 mx-auto mb-3" />,
        title: "Completed Goals",
        description: "Celebrate your wins and relive your adventures.",
    },
    {
        icon: <FaLightbulb className="w-10 h-10 text-indigo-600 mx-auto mb-3" />,
        title: "Discover Ideas",
        description: "Find inspiration from others and add them to your list.",
    },
];
const scrollImages = [
    "/adventures.jpg",
    "/adventures1.jpg",
    "/adventures2.jpg",
    "/adventures3.jpg",
    "/adventures4.jpg",
    "/adventures5.jpg",
    "/adventures6.jpg",
    "/travel.webp"
    ]
const whyBucketList =[
    {
        icon: <FaGlobeAmericas className="text-indigo-600 text-5xl mx-auto mb-3" />,
        title: "Global Inspiration",
        description:  "Discover ideas from travelers, creators, and dreamers around the world.",
    },
    {
        icon: <FaUsers className="text-indigo-600 text-5xl mx-auto mb-3" />,
        title: "Supportive Community",
        description: "Join groups, find partners, and share your progress with people who inspire you.",
    },
    {
        icon: <FaLightbulb className="text-indigo-600 text-5xl mx-auto mb-3" />,
        title: "Stay Motivated",
        description:  "Visualize your goals and celebrate milestones that keep your motivation high.",
    },
    {
        icon: <FaMedal className="text-indigo-600 text-5xl mx-auto mb-3" />,
        title: "Celebrate Success",
        description: "Track what you’ve accomplished and turn memories into your personal storybook.",
    },

]


export default function Home() {

  const location = useLocation();
    useEffect( () => {
        const images = document.querySelectorAll('[data-carousel-item]');
console.log(images.length);
        if(images.length == 0) return;
        let index = 0;
        const interval = setInterval( () => {
            images.forEach((image,i) => {
                image.classList.toggle('hidden' , i !==index);
            })
            index = (index+1) % images.length;

        }, 3000)
        return () => clearInterval(interval);
    }, [location.pathname]);
    return(
        <>

          {/*  <div className="h-56 sm:h-64 xl:h-80 2xl:h-96">
                <Carousel >
                    <img src= "/adventures.jpg" alt="..." />
                    <img src= "/adventures1.jpg" alt="..." />
                    <img src="/adventures2.jpg" alt="..." />
                </Carousel>
            </div>*/}

            <section className="relative">
                <div className="relative w-full" data-carousel="slide" id="adventure-data-carousel">
                    <div className="relative h-[550px] overflow-hidden  rounded-lg z-0">
                    {
                        scrollImages.map((image, index) => (
                            <div className="hidden ease-in-out duration-700" key ={index+1} data-carousel-item>
                                <img src={image} className="absolute block w-full h-full object-cover" alt={image} key ={index+1}/>
                            </div>
                        ))
                    }
                    </div>
                    <div className="absolute flex z-30 bottom-5 space-x-3 left-1/2 -translate-x-1/2 ">
                        {
                            scrollImages.map((_, index) => (
                                <button type="button" className="w-3 h-3 rounded-full bg-white/50 hover:bg-white"
                                        aria-label={`slide ${index+1}`} data-carsousel-slide-to ={index} key={`slide ${index+1}`}>
                                </button>
                            ))
                        }

                    </div>

                </div>
                <div className="absolute inset-0 w-full top-0 m-5">
                    <h2 className="text-blue-500 text-center text-5xl font-extrabold">Bucket List App</h2>
                </div>
                    <div className="absolute inset-0  flex flex-col justify-center items-center text-center p-6">
                        <h2 className="text-5xl font-extrabold text-yellow-500 mb-4" key="heading"> Turn your Dreams Into Adventures</h2>
                        <p className="text-lg text-black-900 font-bold mb-8 mx-auto w-1/2">
                            Create your bucket list, share with friends, and start checking off your dreams today!
                            Connect with a community of adventurers and make every moment count.
                            Connect with dreamers like you and start your journey now!
                        </p>
                        <Button href='/login'  size="lg" className="bg-gradient-to-r from-cyan-500 to-purple-600 px-6 py-3 rounded-lg text-white font-semibold hover:opacity-90 transition">
                            Start your journey
                        </Button>
                    </div>

            </section>
          <div className="text-gray-900">
                <section className="py-16 bg-white">
                    <h2 className="text-3xl font-bold text-center mb-10">What You Can Do</h2>
                    <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto px-6">
                        {
                            features.map((item, index) => (
                                <Card key={index} className="text-center p-6 shadow-lg hover:shadow-xl transition-shadow hover:bg-purple-400">
                                    <div className="flex flex-col items-center">
                                        {item.icon}
                                        <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                                        <p className="text-gray-600">{item.description}</p>
                                    </div>
                                </Card>
                            ))
                        }
                    </div>
                </section>
 <section className="bg-blue-600 p-5">
     <div className="max-w-6xl mx-auto px-6 text-center">
         <h2 className="text-4xl font-extrabold mb-4 "> Why Choose <span className="text-white">Bucket List? </span></h2>
         <p className="text-black max-w-2xl mx-auto mb-12">
             Bucket List isn’t just a goal tracker — it’s your digital adventure
             journal, connecting dreamers worldwide and inspiring you to live a
             more meaningful life.
         </p>
         <div className="grid grid-cols-4  gap-8">
             { whyBucketList.map((item, index) => (
                 <Card className=" text-center hover:shadow-lg transition duration-200">
                     {item.icon}
                     <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                     <p className="text-gray-600 text-sm"> {item.description} </p>
                 </Card>
             )) }

         </div>
     </div>

 </section>

                <section id="inspiration" className="py-16 bg-indigo-50">
                    <h2 className="text-3xl font-bold text-center mb-10">Inspiration Gallery</h2>
                    <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto px-6">
                        {["mountain","travel","adventure","beaches","hiking","skiing"].map((place, i) => (
                            <div key={i} className="relative group">
                                <img
                                    src={`/inspirationGallery/${place}.jpg`}
                                    alt={place}
                                    className="rounded-2xl shadow-md group-hover:scale-105 transition w-90 h-60"
                                />
                                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                                    <p className="text-white text-lg font-semibold capitalize">{place}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section id="community" className="py-16 bg-blue-600 text-center">
                    <h2 className="text-3xl font-bold mb-4">Join Our Global Dreamers</h2>
                    <p className="text-white max-w-xl mx-auto mb-8">
                        Thousands of people worldwide are ticking off their dreams one goal at a time.
                        Be part of a community that celebrates life’s adventures.
                    </p>

                    <div className="flex justify-center gap-4 mb-8">
                        <FaUsers className="w-8 h-8 text-white" />
                        <FaMountain className="w-8 h-8 text-white" />
                        <FaCameraRetro className="w-8 h-8 text-white" />
                        <FaGlobeAmericas className="w-8 h-8 text-white" />

                    </div>
                    <Button href="/signup"  className="mx-auto bg-gradient-to-r from-cyan-500 to-purple-600 px-6 py-3 rounded-lg text-white font-semibold w-50 ">
                        Join the Community
                    </Button>

                </section>


            </div>
        </>
    )

}
